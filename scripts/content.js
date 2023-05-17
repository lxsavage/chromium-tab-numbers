let ctrlTimer = null;
let origHref = null;

function getFavicons() {
    let favicons = document.querySelectorAll("link[rel*='icon']");

    if (favicons.length === 0) {
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        document.head.append(favicon);
        favicons = document.querySelectorAll("link[rel*='icon']");
    }

    return favicons;
}

function isCtrlOrCmd(key) {
    const isMac = window.navigator.userAgent.includes('Macintosh');
    return isMac && key === 'Meta' || !isMac && key === 'Control';
}

function setFavicon(faviconUrl) {
    const favicons = getFavicons();
    const shouldSetOrig = !origHref;
    if (shouldSetOrig) {
        origHref = [];
    }

    for (const favicon of favicons) {
        if (shouldSetOrig) {
            origHref.push(favicon.href);
        }
        favicon.setAttribute('href', faviconUrl);
    }
}

function unsetFavicon() {
    const favicons = getFavicons();
    if (origHref) {
        favicons.forEach((favicon, index) => {
            favicon.setAttribute('href', origHref[index]);
        });
    }
}

document.addEventListener('keydown', evt => {
    if (!isCtrlOrCmd(evt.key)) return;

    // TODO: Handle context invalidated
    chrome.runtime.sendMessage('ctrl_held').catch(_ => {});
});

document.addEventListener('keyup', evt => {
    if (!isCtrlOrCmd(evt.key)) return;

    // TODO: Handle context invalidated
    chrome.runtime.sendMessage('ctrl_released').catch(_ => {});
    clearTimeout(ctrlTimer);
});

chrome.runtime.onMessage.addListener(message => {
    switch (message.action) {
        case 'set_favicon':
            setFavicon(message.icon);
            break;
        case 'unset_favicon':
            unsetFavicon();
            break;
    }
})