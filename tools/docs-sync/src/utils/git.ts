/**
 * Git operations utilities
 */

import { execSync } from 'node:child_process'
import type { ChangedFile, CommitInfo, FileStatus } from '../types/index.js'

/** Execute a git command and return stdout */
export function execGit(args: string[], cwd?: string): string {
  const command = `git ${args.join(' ')}`
  try {
    return execSync(command, {
      cwd: cwd ?? process.cwd(),
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    }).trim()
  } catch (error) {
    const err = error as { stderr?: string; message: string }
    throw new Error(
      `Git command failed: ${command}\n${err.stderr ?? err.message}`
    )
  }
}

/** Get the current branch name */
export function getCurrentBranch(cwd?: string): string {
  return execGit(['rev-parse', '--abbrev-ref', 'HEAD'], cwd)
}

/** Get the current commit SHA */
export function getCurrentCommit(cwd?: string): string {
  return execGit(['rev-parse', 'HEAD'], cwd)
}

/** Get the short commit SHA */
export function getShortCommit(sha: string, cwd?: string): string {
  return execGit(['rev-parse', '--short', sha], cwd)
}

/** Check if a commit exists */
export function commitExists(sha: string, cwd?: string): boolean {
  try {
    execGit(['rev-parse', '--verify', sha], cwd)
    return true
  } catch {
    return false
  }
}

/** Get the merge base between two commits */
export function getMergeBase(
  commit1: string,
  commit2: string,
  cwd?: string
): string {
  return execGit(['merge-base', commit1, commit2], cwd)
}

/** Parse git diff status to FileStatus */
function parseStatus(status: string): FileStatus {
  switch (status[0]) {
    case 'A':
      return 'added'
    case 'D':
      return 'deleted'
    case 'M':
      return 'modified'
    case 'R':
      return 'renamed'
    case 'C':
      return 'copied'
    default:
      return 'modified'
  }
}

/** Get files changed between two commits */
export function getChangedFiles(
  base: string,
  head: string,
  cwd?: string
): ChangedFile[] {
  // Get diff with status and numstat
  const diffOutput = execGit(['diff', '--name-status', '-M', base, head], cwd)

  if (!diffOutput) {
    return []
  }

  const files: ChangedFile[] = []

  for (const line of diffOutput.split('\n')) {
    if (!line.trim()) continue

    const parts = line.split('\t')
    if (parts.length < 2) continue

    const statusPart = parts[0]
    const status = parseStatus(statusPart ?? '')

    let path: string
    let oldPath: string | undefined

    if (status === 'renamed' || status === 'copied') {
      // Format: R100\told-path\tnew-path
      oldPath = parts[1]
      path = parts[2] ?? parts[1] ?? ''
    } else {
      path = parts[1] ?? ''
    }

    // Determine package from path
    const packageMatch = path.match(/^packages\/([^/]+)\//)
    const pkg = packageMatch ? `@clarity-chat/${packageMatch[1]}` : null

    files.push({
      path,
      status,
      package: pkg,
      oldPath,
    })
  }

  return files
}

/** Get file content at a specific commit */
export function getFileAtCommit(
  filePath: string,
  commit: string,
  cwd?: string
): string | null {
  try {
    return execGit(['show', `${commit}:${filePath}`], cwd)
  } catch {
    return null
  }
}

/** Get commits between two refs */
export function getCommitsBetween(
  base: string,
  head: string,
  cwd?: string
): CommitInfo[] {
  const format = '%H|%h|%s|%b|%an|%ae|%aI'
  const output = execGit(
    ['log', `${base}..${head}`, `--format=${format}`, '--name-status'],
    cwd
  )

  if (!output) {
    return []
  }

  const commits: CommitInfo[] = []
  const lines = output.split('\n')
  let currentCommit: Partial<CommitInfo> | null = null
  let collectingFiles = false

  for (const line of lines) {
    if (line.includes('|')) {
      // New commit line
      if (currentCommit) {
        commits.push(currentCommit as CommitInfo)
      }

      const [hash, shortHash, subject, body, author, authorEmail, date] =
        line.split('|')
      currentCommit = {
        hash: hash ?? '',
        shortHash: shortHash ?? '',
        subject: subject ?? '',
        body: body ?? '',
        author: author ?? '',
        authorEmail: authorEmail ?? '',
        date: date ?? '',
        files: [],
      }
      collectingFiles = true
    } else if (collectingFiles && currentCommit && line.trim()) {
      // File status line
      const parts = line.split('\t')
      if (parts.length >= 2) {
        const status = parseStatus(parts[0] ?? '')
        const path = parts[status === 'renamed' ? 2 : 1] ?? ''
        const oldPath = status === 'renamed' ? parts[1] : undefined
        const packageMatch = path.match(/^packages\/([^/]+)\//)

        currentCommit.files?.push({
          path,
          status,
          package: packageMatch ? `@clarity-chat/${packageMatch[1]}` : null,
          oldPath,
        })
      }
    }
  }

  if (currentCommit) {
    commits.push(currentCommit as CommitInfo)
  }

  return commits
}

/** Get the default branch name */
export function getDefaultBranch(cwd?: string): string {
  try {
    // Try to get from remote
    const remote = execGit(['remote'], cwd).split('\n')[0] ?? 'origin'
    const headRef = execGit(
      ['symbolic-ref', `refs/remotes/${remote}/HEAD`],
      cwd
    )
    return headRef.replace(`refs/remotes/${remote}/`, '')
  } catch {
    // Fallback to common names
    try {
      execGit(['rev-parse', '--verify', 'main'], cwd)
      return 'main'
    } catch {
      return 'master'
    }
  }
}

/** Get tags between two commits */
export function getTagsBetween(
  base: string,
  head: string,
  cwd?: string
): string[] {
  try {
    const output = execGit(
      ['tag', '--contains', base, '--no-contains', head],
      cwd
    )
    return output ? output.split('\n').filter(Boolean) : []
  } catch {
    return []
  }
}

/** Get the latest tag */
export function getLatestTag(cwd?: string): string | null {
  try {
    return execGit(['describe', '--tags', '--abbrev=0'], cwd)
  } catch {
    return null
  }
}

/** Check if working directory is clean */
export function isWorkingDirClean(cwd?: string): boolean {
  const status = execGit(['status', '--porcelain'], cwd)
  return status.length === 0
}

/** Stage files for commit */
export function stageFiles(files: string[], cwd?: string): void {
  if (files.length === 0) return
  execGit(['add', ...files], cwd)
}

/** Create a commit */
export function createCommit(message: string, cwd?: string): string {
  execGit(['commit', '-m', message], cwd)
  return getCurrentCommit(cwd)
}

/** Configure git user for CI */
export function configureGitUser(
  name: string,
  email: string,
  cwd?: string
): void {
  execGit(['config', 'user.name', name], cwd)
  execGit(['config', 'user.email', email], cwd)
}
