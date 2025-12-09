import { PageHandler } from '../base.js'; // Relative path fix
import { EPassStorage } from '../../storage.js';
import { LabelUI } from '../../ui.js';

export class LoginPageHandler extends PageHandler {
    match(url) {
        return url.includes('/game/infinitas/2/api/login/login.html');
    }

    async run() {
        console.log('e-amusement Pass Labeler: Login Page Handler running');
        this.injectLoginLabel();
    }

    async injectLoginLabel() {
        // Target requested: #login > div > div:nth-child(4) > p:nth-child(2)
        const selector = '#login > div > div:nth-child(4) > p:nth-child(2)';
        const idElement = document.querySelector(selector);

        if (!idElement) {
            console.log("Login Label Element not found with selector:", selector);
            return;
        }

        const currentId = idElement.textContent.trim();
        if (!currentId) return;

        // Check availability
        if (idElement.querySelector('.epass-label-container')) return;

        const label = await EPassStorage.getLabel(currentId);

        const ui = LabelUI.createLabelElement(currentId, label, async (newLabel) => {
            await EPassStorage.setLabel(currentId, newLabel);
            // No select box here to update
        });

        idElement.appendChild(ui);
    }
}
