declare module 'gradient-string' {
  interface Gradient {
    multiline(text: string): string
  }
  
  interface Gradients {
    pastel: Gradient
    rainbow: Gradient
    cristal: Gradient
    retro: Gradient
    atlas: Gradient
    summer: Gradient
    morning: Gradient
  }
  
  const gradient: Gradients & {
    (preset: string): Gradient
  }
  
  export default gradient
}
