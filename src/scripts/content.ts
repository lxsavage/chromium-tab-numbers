const origHref: string[] = [];
const isMac: boolean = window.navigator.userAgent.includes('Macintosh');

function sendSetMsg() {
  // TODO: Handle context invalidated
  chrome.runtime.sendMessage('ctrl_held')
}

function sendUnsetMsg() {
  // TODO: Handle context invalidated
  chrome.runtime.sendMessage('ctrl_released');
}

function getFavicons(): NodeListOf<HTMLLinkElement> {
  let favicons = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");

  if (favicons.length === 0) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    document.head.append(favicon);
    favicons = document.querySelectorAll("link[rel*='icon']");
  }

  return favicons;
}

function isCtrlOrCmd(key: string): boolean {
  return (isMac && key === 'Meta') || (!isMac && key === 'Control');
}

function setFavicon(faviconUrl: string) {
  const favicons = getFavicons();
  if (origHref.length > 0) return;

  favicons.forEach((favicon) => {
    origHref.push(favicon.href);
    favicon.setAttribute('href', faviconUrl);
  });
}

function unsetFavicon() {
  const favicons = getFavicons();
  if (origHref.length === 0) return;

  favicons.forEach((favicon: Element, index: number) => {
    favicon.setAttribute('href', origHref[index]);
  });
  origHref.length = 0;
}

document.addEventListener('visibilitychange', sendUnsetMsg);
window.addEventListener('blur', sendUnsetMsg);

document.addEventListener('keydown', (evt) => {
  if (!isCtrlOrCmd(evt.key)) return;

  sendSetMsg();
});

document.addEventListener('keyup', (evt) => {
  if (!isCtrlOrCmd(evt.key)) return;

  sendUnsetMsg();
});

chrome.runtime.onMessage.addListener((message: CTNMessage) => {
  switch (message.action) {
    case 'set_favicon':
      setFavicon(message.icon as string);
      break;
    case 'unset_favicon':
      unsetFavicon();
      break;
    default:
      break;
  }
});
