function enumerate() {
    //
}

function deenumerate() {
    //
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!sender.tab) return;

    switch (request) {
        case 'ctrl_held':
            enumerate();
            break;
        case 'ctrl_released':
            deenumerate();
            break;
        default:
            break;
    }
});

// Onboarding
chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        chrome.tabs.create({
            url: 'onboarding.html'
        });
    }
});