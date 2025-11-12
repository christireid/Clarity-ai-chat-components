declare module 'gradient-string' {
  interface Gradient {
    multiline(text: string): string
  }
  
  interface GradientObject {
    pastel: Gradient
    rainbow: Gradient
    cristal: Gradient
    retro: Gradient
    atlas: Gradient
    summer: Gradient
    morning: Gradient
  }
  
  const gradient: GradientObject
  export default gradient
}
