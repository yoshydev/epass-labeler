/**
 * Base class for Page Handlers
 */
export class PageHandler {
    constructor() {
        if (this.constructor === PageHandler) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    /**
     * Check if the current URL matches this handler
     * @param {string} url 
     * @returns {boolean}
     */
    match(url) {
        throw new Error("Method 'match()' must be implemented.");
    }

    /**
     * Execute the handler logic
     */
    async run() {
        throw new Error("Method 'run()' must be implemented.");
    }
}
