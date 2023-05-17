function setFavicons() {
    chrome.tabs.query({}, tabs => {
        tabs.forEach((tab, index) => {
            const icUrl = chrome.runtime.getURL(`images/n${index + 1}.png`);
            chrome.tabs.sendMessage(tab.id, {action: 'set_favicon', icon: icUrl});
        });
    });
}

function unsetFavicons() {
    chrome.tabs.query({}, tabs => {
        tabs.forEach((tab, index) => {
            chrome.tabs.sendMessage(tab.id, {action: 'unset_favicon'});
        });
    });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    switch (msg) {
        case 'ctrl_held':
            setFavicons();
            sendResponse(true);
            break;
        case 'ctrl_released':
            unsetFavicons();
            sendResponse(false);
            break;
    }
});

// Onboarding
chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason !== 'install') return;

    chrome.tabs.create({
        url: 'onboarding.html'
    });
});
