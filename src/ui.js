export const LabelUI = {
    /**
     * Create a label element that switches between view and edit modes.
     * @param {string} id - The e-pass ID
     * @param {string} initialLabel - Existing label text
     * @param {Function} onSave - Callback when label is saved (newLabel) => Promise<void>
     * @returns {HTMLElement} The container element
     */
    createLabelElement(id, initialLabel, onSave) {
        const container = document.createElement('span');
        container.className = 'epass-label-container';
        container.dataset.epassId = id;

        // View Mode (Text)
        const viewEl = document.createElement('span');
        viewEl.className = 'epass-label-view';
        viewEl.textContent = initialLabel ? ` (${initialLabel})` : ' (Edit Label)';
        if (!initialLabel) viewEl.classList.add('epass-label-placeholder');

        // Edit Mode (Input)
        const inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.className = 'epass-label-input';
        inputEl.value = initialLabel || '';
        inputEl.style.display = 'none';

        // Event Handlers
        viewEl.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering parent clicks
            viewEl.style.display = 'none';
            inputEl.style.display = 'inline-block';
            inputEl.focus();
        });

        const verifyAndSave = async () => {
            const newLabel = inputEl.value.trim();
            await onSave(newLabel);

            // Update View
            if (newLabel) {
                viewEl.textContent = ` (${newLabel})`;
                viewEl.classList.remove('epass-label-placeholder');
            } else {
                viewEl.textContent = ' (Edit Label)';
                viewEl.classList.add('epass-label-placeholder');
            }

            // Switch back to view
            inputEl.style.display = 'none';
            viewEl.style.display = 'inline';
        };

        inputEl.addEventListener('blur', verifyAndSave);
        inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                inputEl.blur(); // Triggers blur handler
            }
        });

        // Prevent clicks on input from bubbling (optional, depending on page behavior)
        inputEl.addEventListener('click', (e) => e.stopPropagation());

        container.appendChild(viewEl);
        container.appendChild(inputEl);

        return container;
    }
};
