/**
 * Shell completion support
 * Generates completion scripts for bash, zsh, and fish
 */
/**
 * Generate completion script for shell
 */
export function generateCompletion(program, shell) {
    switch (shell) {
        case 'bash':
            return generateBashCompletion(program);
        case 'zsh':
            return generateZshCompletion(program);
        case 'fish':
            return generateFishCompletion(program);
    }
}
/**
 * Generate bash completion script
 */
function generateBashCompletion(program) {
    const commands = program.commands.map(cmd => cmd.name()).join(' ');
    return `# Bash completion for clarity-chat
_clarity_chat_completion() {
  local cur prev words cword
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"
  words=(${commands})

  if [[ \${COMP_CWORD} -eq 1 ]]; then
    COMPREPLY=( $(compgen -W "${commands}" -- "\${cur}") )
    return 0
  fi

  case "\${prev}" in
    --template)
      COMPREPLY=( $(compgen -W "basic chat rag analytics" -- "\${cur}") )
      return 0
      ;;
    --framework)
      COMPREPLY=( $(compgen -W "nextjs remix vite astro" -- "\${cur}") )
      return 0
      ;;
    --port)
      COMPREPLY=( $(compgen -W "3000 3001 3002 8080" -- "\${cur}") )
      return 0
      ;;
  esac
}

complete -F _clarity_chat_completion clarity-chat
`;
}
/**
 * Generate zsh completion script
 */
function generateZshCompletion(program) {
    const commands = program.commands.map(cmd => cmd.name()).join(' ');
    return `#compdef clarity-chat

_clarity_chat() {
  local context state line
  typeset -A opt_args

  _arguments \\
    '1: :->command' \\
    '*: :->args'

  case $state in
    command)
      _values "commands" ${commands}
      ;;
    args)
      case $words[1] in
        init)
          _arguments \\
            '--template[Project template]:template:(basic chat rag analytics)' \\
            '--framework[Framework]:framework:(nextjs remix vite astro)' \\
            '--no-install[Skip dependency installation]' \\
            '--no-git[Skip git initialization]'
          ;;
        add)
          _arguments \\
            '--path[Installation path]' \\
            '--no-deps[Skip dependency installation]'
          ;;
        dev)
          _arguments \\
            '--port[Port number]:port' \\
            '--open[Open in browser]'
          ;;
        generate)
          _arguments \\
            '--name[Component/hook name]' \\
            '--output[Output directory]'
          ;;
        *)
          _files
          ;;
      esac
      ;;
  esac
}

_clarity_chat "$@"
`;
}
/**
 * Generate fish completion script
 */
function generateFishCompletion(program) {
    const commands = program.commands.map(cmd => cmd.name()).join(' ');
    return `# Fish completion for clarity-chat

function __clarity_chat_commands
  echo ${commands}
end

function __clarity_chat_templates
  echo basic chat rag analytics
end

function __clarity_chat_frameworks
  echo nextjs remix vite astro
end

complete -c clarity-chat -f -n '__fish_use_subcommand' -a '(__clarity_chat_commands)'

complete -c clarity-chat -f -n '__fish_seen_subcommand_from init' -l template -a '(__clarity_chat_templates)'
complete -c clarity-chat -f -n '__fish_seen_subcommand_from init' -l framework -a '(__clarity_chat_frameworks)'
complete -c clarity-chat -f -n '__fish_seen_subcommand_from init' -l no-install
complete -c clarity-chat -f -n '__fish_seen_subcommand_from init' -l no-git

complete -c clarity-chat -f -n '__fish_seen_subcommand_from add' -l path -r
complete -c clarity-chat -f -n '__fish_seen_subcommand_from add' -l no-deps

complete -c clarity-chat -f -n '__fish_seen_subcommand_from dev' -l port -r
complete -c clarity-chat -f -n '__fish_seen_subcommand_from dev' -l open

complete -c clarity-chat -f -n '__fish_seen_subcommand_from generate' -l name -r
complete -c clarity-chat -f -n '__fish_seen_subcommand_from generate' -l output -r
`;
}
//# sourceMappingURL=completion.js.map