// Test fixture: Suppression comments
// review-ignore-file: todoComments

export function ComponentWithSuppressions() {
  // review-ignore: consoleLog
  console.log('This should be ignored')

  // review-ignore-next-line: explicitAny
  const data: any = fetchData()

  // TODO: This should be ignored due to file-level suppression
  return <div>{data}</div>
}

function fetchData() {
  return {}
}
