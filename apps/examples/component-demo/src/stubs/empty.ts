// Empty stub for Node.js modules in browser builds
export const access = () => Promise.resolve()
export const readFile = () => Promise.resolve('')
export const writeFile = () => Promise.resolve()
export const stat = () =>
  Promise.resolve({ isDirectory: () => false, isFile: () => false })
export const readdir = () => Promise.resolve([])
export const mkdir = () => Promise.resolve()
export const unlink = () => Promise.resolve()
export const rmdir = () => Promise.resolve()
export const existsSync = () => false
export const constants = {}
export const createHash = () => ({
  update: () => ({ digest: () => '' }),
})
export const randomBytes = () => new Uint8Array(0)
export default {}
