const HOLD_DELAY = 100;
let ctrlTimer = null;
let ctrlHeld = false;

function isCtrlOrCmd(key) {
    const isMac = window.navigator.userAgent.includes('Macintosh');
    return isMac && key === 'Meta' || !isMac && key === 'Control';
}

document.addEventListener('keydown', evt => {
    if (!isCtrlOrCmd(evt.key)) return;

    ctrlTimer = setTimeout(() => {
        chrome.runtime.sendMessage('ctrl_held');
        ctrlHeld = true;
    }, HOLD_DELAY);
});

document.addEventListener('keyup', evt => {
    if (!isCtrlOrCmd(evt.key)) return;

    if (ctrlHeld) {
        chrome.runtime.sendMessage('ctrl_released');
        ctrlHeld = false;
    }
    clearTimeout(ctrlTimer);
});