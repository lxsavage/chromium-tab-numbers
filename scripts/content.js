const origHref = [];
const isMac = window.navigator.userAgent.includes('Macintosh');

// TODO: Handle context invalidated
const sendUnsetMsg = () => chrome.runtime.sendMessage('ctrl_released')
    .catch(_ => { });

// TODO: Handle context invalidated
const sendSetMsg = () => chrome.runtime.sendMessage('ctrl_held')
    .catch(_ => { });

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
    return isMac && key === 'Meta' || !isMac && key === 'Control';
}

function setFavicon(faviconUrl) {
    const favicons = getFavicons();
    if (origHref.length > 0) return;

    for (const favicon of favicons) {
        origHref.push(favicon.href);
        favicon.setAttribute('href', faviconUrl);
    }
}

function unsetFavicon() {
    const favicons = getFavicons();
    if (origHref.length === 0) return;

    favicons.forEach((favicon, index) => {
        favicon.setAttribute('href', origHref[index]);
    });
    origHref.length = 0;
}


document.addEventListener('visibilitychange', sendUnsetMsg);
window.addEventListener('blur', sendUnsetMsg);

document.addEventListener('keydown', evt => {
    if (!isCtrlOrCmd(evt.key)) return;

    sendSetMsg();
});

document.addEventListener('keyup', evt => {
    if (!isCtrlOrCmd(evt.key)) return;

    sendUnsetMsg();
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
