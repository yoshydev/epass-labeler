export const EPassStorage = {
    /**
     * Get label for a specific ID
     * @param {string} id
     * @returns {Promise<string|null>}
     */
    async getLabel(id) {
        if (!id) return null;
        return new Promise((resolve) => {
            try {
                chrome.storage.local.get([id], (result) => {
                    if (chrome.runtime.lastError) {
                        console.error('Storage Error (getLabel):', chrome.runtime.lastError);
                        resolve(null);
                        return;
                    }
                    resolve(result[id] || null);
                });
            } catch (e) {
                console.error('Storage Exception:', e);
                resolve(null);
            }
        });
    },

    /**
     * Set label for a specific ID
     * @param {string} id
     * @param {string} label
     * @returns {Promise<void>}
     */
    async setLabel(id, label) {
        if (!id) return;
        return new Promise((resolve) => {
            try {
                chrome.storage.local.set({ [id]: label }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Storage Error (setLabel):', chrome.runtime.lastError);
                    }
                    resolve();
                });
            } catch (e) {
                console.error('Storage Exception (setLabel):', e);
                resolve();
            }
        });
    },

    /**
     * Get all labels
     * @returns {Promise<Object>}
     */
    async getAllLabels() {
        return new Promise((resolve) => {
            chrome.storage.local.get(null, (result) => {
                resolve(result || {});
            });
        });
    }
};
