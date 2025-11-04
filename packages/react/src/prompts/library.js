/**
 * Prompt Library
 *
 * Optional collection management for prompt templates.
 * Users can build their own libraries or use this helper.
 */
export class PromptTemplateLibrary {
    constructor() {
        this.templates = new Map();
        this.versions = new Map();
    }
    /**
     * Add a template to the library
     */
    add(template) {
        this.templates.set(template.id, template);
    }
    /**
     * Get a template by ID
     */
    get(id) {
        return this.templates.get(id);
    }
    /**
     * Get template by name
     */
    getByName(name) {
        return Array.from(this.templates.values()).find(t => t.name === name);
    }
    /**
     * Get all templates
     */
    getAll() {
        return Array.from(this.templates.values());
    }
    /**
     * Search templates by query
     */
    search(query) {
        const lowerQuery = query.toLowerCase();
        return this.getAll().filter(t => t.name.toLowerCase().includes(lowerQuery) ||
            t.description?.toLowerCase().includes(lowerQuery) ||
            t.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)));
    }
    /**
     * Get templates by tag
     */
    getByTag(tag) {
        return this.getAll().filter(t => t.tags?.includes(tag));
    }
    /**
     * Remove a template
     */
    remove(id) {
        return this.templates.delete(id);
    }
    /**
     * Save a version of a template
     */
    saveVersion(version) {
        const versions = this.versions.get(version.templateId) || [];
        // Deactivate other versions if this is active
        if (version.isActive) {
            versions.forEach(v => { v.isActive = false; });
        }
        versions.push(version);
        this.versions.set(version.templateId, versions);
    }
    /**
     * Get versions of a template
     */
    getVersions(templateId) {
        return this.versions.get(templateId) || [];
    }
    /**
     * Get active version of a template
     */
    getActiveVersion(templateId) {
        const versions = this.getVersions(templateId);
        return versions.find(v => v.isActive) || versions[versions.length - 1];
    }
    /**
     * Export library to JSON
     */
    export() {
        return JSON.stringify({
            templates: Array.from(this.templates.entries()),
            versions: Array.from(this.versions.entries()),
        });
    }
    /**
     * Import library from JSON
     */
    import(json) {
        try {
            const data = JSON.parse(json);
            if (data.templates) {
                this.templates = new Map(data.templates);
            }
            if (data.versions) {
                this.versions = new Map(data.versions);
            }
        }
        catch (error) {
            throw new Error('Invalid library JSON');
        }
    }
    /**
     * Clear library
     */
    clear() {
        this.templates.clear();
        this.versions.clear();
    }
}
//# sourceMappingURL=library.js.map