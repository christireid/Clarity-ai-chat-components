// Empty stub for Node.js fs/promises module (not available in browser)
export default {}
export const access = () => Promise.reject(new Error('fs/promises not available in browser'))
export const readFile = () => Promise.reject(new Error('fs/promises not available in browser'))
export const writeFile = () => Promise.reject(new Error('fs/promises not available in browser'))
