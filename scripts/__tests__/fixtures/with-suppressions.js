import { jsx as _jsx } from "react/jsx-runtime";
// Test fixture: Suppression comments
// review-ignore-file: todoComments
export function ComponentWithSuppressions() {
    // review-ignore: consoleLog
    console.log('This should be ignored');
    // review-ignore-next-line: explicitAny
    const data = fetchData();
    // TODO: This should be ignored due to file-level suppression
    return _jsx("div", { children: data });
}
function fetchData() {
    return {};
}
//# sourceMappingURL=with-suppressions.js.map