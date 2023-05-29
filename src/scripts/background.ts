// Polyfill for Firefox manifest v2 workaround, making query function promise-based
const queryTabs = chrome.runtime.getManifest().manifest_version === 3
  ? chrome.tabs.query
  : function (queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query(queryInfo, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(tabs);
      });
    });
  };

async function setFavicons() {
  const tabGroups = await chrome.tabGroups.query({});
  const tabs = (await queryTabs({
    currentWindow: true,
  })).filter(tab => {
    if (tab.groupId === -1) return true;

    const tabGroup = tabGroups.find((group) => group.id === tab.groupId);
    return !tabGroup || !tabGroup.collapsed;
  });

  tabs.forEach((tab, index) => {
    // Don't set the favicon if there are more than 8 tabs and the current tab
    // is between the 8th and the last
    if (tabs.length > 8 && index > 7 && index !== tabs.length - 1) return;

    // Determine which number should be displayed on the favicon
    let faviconNumber = index + 1;
    if (tabs.length > 8 && index === tabs.length - 1) {
      faviconNumber = 9;
    }

    const icUrl = chrome.runtime.getURL(`images/n${faviconNumber}.png`);

    chrome.tabs.sendMessage(tab.id as number, {
      action: 'set_favicon',
      icon: icUrl
    } as CTNMessage);
  });
}

async function unsetFavicons() {
  const tabs = await queryTabs({currentWindow: true});
  tabs.forEach(tab =>
    chrome.tabs.sendMessage(tab.id as number, {
      action: 'unset_favicon'
    } as CTNMessage)
  );
}

(function () {
  // Checking for the user holding CTRL/CMD is handled by a content script that
  // passes ctrl_held and ctrl_released messages to this worker
  chrome.runtime.onMessage.addListener((message) => {
    switch (message) {
      case 'ctrl_held':
        setFavicons();
        break;
      case 'ctrl_released':
        unsetFavicons();
        break;
    }
  });

  // Onboarding
  chrome.runtime.onInstalled.addListener(async ({reason}) => {
    if (reason === 'install') {
      await chrome.tabs.create({url: 'onboarding/install.html'})
      console.log('Opened onboarding tab');
    }

    // Script injection (to allow for usage without refreshing all tabs)
    const tabs = await queryTabs({});
    tabs.forEach(async (tab) => {
      try {
        await chrome.scripting.executeScript({
          target: {
            tabId: tab.id as number,
            allFrames: true,
          },
          files: [
            'scripts/content.js',
          ],
        })
      }
      catch (err) {
        console.error(`Failed to inject script into tab "${tab.title}":\n${err}`);
      }
    });
  });
})();
