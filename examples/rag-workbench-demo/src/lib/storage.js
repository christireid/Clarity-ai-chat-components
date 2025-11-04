/**
 * In-memory document storage
 * Production should use a database (PostgreSQL, MongoDB, etc.)
 */
// In-memory storage
const documents = [];
export function getDocuments() {
    return documents;
}
export function addDocument(document) {
    documents.push(document);
}
export function removeDocument(documentId) {
    const index = documents.findIndex(doc => doc.id === documentId);
    if (index === -1)
        return false;
    documents.splice(index, 1);
    return true;
}
export function getDocumentById(documentId) {
    return documents.find(doc => doc.id === documentId);
}
//# sourceMappingURL=storage.js.map