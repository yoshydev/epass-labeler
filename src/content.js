import { MenuPageHandler } from './handlers/menu.js';
import { LoginPageHandler } from './handlers/infinitas/login.js';

const handlers = [
    new MenuPageHandler(),
    new LoginPageHandler()
];

const main = async () => {
    const url = window.location.href;
    for (const handler of handlers) {
        if (handler.match(url)) {
            await handler.run();
            break;
        }
    }
};

// Run when DOM is ready (or immediately if 'document_end' is used in manifest, which it is)
if (chrome && chrome.runtime && chrome.runtime.id) {
    main().catch(e => console.error("e-amusement Labeler Uncaught Error:", e));
} else {
    console.error("e-amusement Labeler: Chrome Runtime Invalid");
}
