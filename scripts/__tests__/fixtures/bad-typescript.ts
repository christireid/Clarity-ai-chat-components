// Test fixture: TypeScript issues
export function badFunction(data: any) {
  const result: any = data.value
  return result
}

export const handler = (event: any) => {
  console.log(event)
}
