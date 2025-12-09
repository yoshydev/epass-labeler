import { PageHandler } from './base.js';
import { EPassStorage } from '../storage.js';
import { LabelUI } from '../ui.js';

export class MenuPageHandler extends PageHandler {
    match(url) {
        return url.includes('/gate/eapass/menu.html');
    }

    async run() {
        console.log('e-amusement Pass Labeler: Menu Page Handler running');
        await this.injectSwitcherLabel();
        await this.injectSelectLabels();
        this.observeChanges();
    }

    /**
     * Handle the main switcher display (.cl_view_switcher_variable)
     */
    async injectSwitcherLabel() {
        try {
            const targetDiv = document.querySelector(MenuPageHandler.SWITCHER_SELECTOR);
            if (!targetDiv) return; // Silent return if not found (expected if on different slide)

            const currentId = targetDiv.textContent.trim();
            if (!currentId) return;

            // Check if label already exists to avoid duplicates
            if (targetDiv.querySelector('.epass-label-container')) return;

            const label = await EPassStorage.getLabel(currentId);

            const ui = LabelUI.createLabelElement(currentId, label, async (newLabel) => {
                await EPassStorage.setLabel(currentId, newLabel);
                // Determine if we need to update other parts of the page (like the select box)
                // For simplicity, we might just reload or update matching DOM elements manually if needed
                // But for now, let's just update the Select box options if they match
                this.updateSelectOptionLabel(currentId, newLabel);
            });

            targetDiv.appendChild(ui);
        } catch (e) {
            console.error("Error in injectSwitcherLabel:", e);
        }
    }

    /**
     * Handle the Select box options
     */
    async injectSelectLabels() {
        const select = document.querySelector('select[name="eapasslist"]');
        if (!select) return;

        const options = Array.from(select.options);
        const allLabels = await EPassStorage.getAllLabels();

        options.forEach(option => {
            // The option text is usually the ID: <option>ID</option>
            // According to requirements: <option value="0">ID</option>
            // We want: <option value="0">ID (Label)</option>

            // Store original ID in dataset if not already there to prevent compounding labels on re-runs
            if (!option.dataset.originalId) {
                option.dataset.originalId = option.textContent.trim();
            }

            const id = option.dataset.originalId;
            const label = allLabels[id];

            if (label) {
                option.textContent = `${id} (${label})`;
            } else {
                option.textContent = id;
            }
        });
    }

    updateSelectOptionLabel(id, newLabel) {
        const select = document.querySelector('select[name="eapasslist"]');
        if (!select) return;

        const option = Array.from(select.options).find(opt => opt.dataset.originalId === id || opt.textContent.includes(id)); // fallback check
        if (option) {
            // Ensure we have the clean ID
            const cleanId = option.dataset.originalId || id;
            if (!option.dataset.originalId) option.dataset.originalId = cleanId;

            if (newLabel) {
                option.textContent = `${cleanId} (${newLabel})`;
            } else {
                option.textContent = cleanId;
            }
        }
    }

    /**
     * Observe changes to the switcher div (in case it changes via JS without reload)
     */
    observeChanges() {
        // Use a broader observer because the specific slide might change classes or be removed/added
        const container = document.querySelector(MenuPageHandler.CONTAINER_SELECTOR);
        if (!container) return;

        const observer = new MutationObserver((mutations) => {
            // Re-run injection on any mutation in the container potentially affecting the active card
            this.injectSwitcherLabel();
        });

        observer.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }
}

MenuPageHandler.SWITCHER_SELECTOR = '#id_ea_common_content .cl_eapasslist_playdata.slick-slide.slick-current.slick-active .cl_eapass_cardnumber_area .cl_view_switcher_variable';
MenuPageHandler.CONTAINER_SELECTOR = '#id_ea_common_content';
