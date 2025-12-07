/**
 * Codemod: v1 to v2 Migration
 * Transforms code from v1 API to v2 API
 */
const transform = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source);
    let hasChanges = false;
    // Transform 1: Rename ChatWindow to ChatInterface
    root
        .find(j.ImportDeclaration, {
        source: { value: '@clarity-chat/react' },
    })
        .forEach((path) => {
        const specifiers = path.node.specifiers;
        if (!specifiers)
            return;
        specifiers.forEach((specifier) => {
            if (specifier.type === 'ImportSpecifier' &&
                specifier.imported.type === 'Identifier' &&
                specifier.imported.name === 'ChatWindow') {
                specifier.imported.name = 'ChatInterface';
                if (specifier.local) {
                    specifier.local.name = 'ChatInterface';
                }
                hasChanges = true;
            }
        });
    });
    // Transform 2: Update ChatWindow JSX to ChatInterface
    root.find(j.JSXElement).forEach((path) => {
        const openingName = path.node.openingElement.name;
        // Handle direct JSXIdentifier (e.g., <ChatWindow>)
        if (openingName.type === 'JSXIdentifier' && openingName.name === 'ChatWindow') {
            openingName.name = 'ChatInterface';
            if (path.node.closingElement && path.node.closingElement.name.type === 'JSXIdentifier') {
                path.node.closingElement.name.name = 'ChatInterface';
            }
            hasChanges = true;
        }
        // Handle JSXMemberExpression (e.g., <namespace.ChatWindow>)
        if (openingName.type === 'JSXMemberExpression') {
            if (openingName.property.type === 'JSXIdentifier' && openingName.property.name === 'ChatWindow') {
                openingName.property.name = 'ChatInterface';
                // Update closing element too
                if (path.node.closingElement && path.node.closingElement.name.type === 'JSXMemberExpression') {
                    const closingProperty = path.node.closingElement.name.property;
                    if (closingProperty.type === 'JSXIdentifier') {
                        closingProperty.name = 'ChatInterface';
                    }
                }
                hasChanges = true;
            }
        }
    });
    // Transform 3: Rename onMessage prop to onSend
    root
        .find(j.JSXElement)
        .find(j.JSXAttribute, {
        name: { name: 'onMessage' },
    })
        .forEach((path) => {
        if (path.node.name.type === 'JSXIdentifier') {
            path.node.name.name = 'onSend';
            hasChanges = true;
        }
    });
    // Transform 4: Update config object structure
    root.find(j.ObjectExpression).forEach((path) => {
        const properties = path.node.properties;
        properties.forEach((prop, index) => {
            // Skip non-ObjectProperty types (SpreadElement, ObjectMethod, RestElement)
            if (prop.type !== 'ObjectProperty')
                return;
            // Ensure key is an Identifier (not computed or string literal)
            if (prop.key.type !== 'Identifier')
                return;
            if (prop.key.name === 'apiKey') {
                // Replace apiKey with credentials object
                const newProp = j.objectProperty(j.identifier('credentials'), j.objectExpression([
                    j.objectProperty(j.identifier('apiKey'), prop.value),
                ]));
                properties[index] = newProp;
                hasChanges = true;
            }
        });
    });
    return hasChanges ? root.toSource() : null;
};
// Module augmentation for parser property
export default transform;
// This allows the codemod to be used with tsx parser
export const parser = 'tsx';
//# sourceMappingURL=v1-to-v2.js.map