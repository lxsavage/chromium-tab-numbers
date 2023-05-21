async function setFavicons() {
  const tabs = await chrome.tabs.query({currentWindow: true});

  tabs.forEach((tab, index) => {
    let logicalIndex = index + 1;
    if (tabs.length > 8 && index === tabs.length - 1) {
      logicalIndex = 9;
    } else if (index >= 8) return;

    const icUrl = chrome.runtime.getURL(`images/n${logicalIndex}.png`);

    chrome.tabs.sendMessage(tab.id as number, {
      action: 'set_favicon',
      icon: icUrl
    } as CTNMessage);
  });
}

async function unsetFavicons() {
  const tabs = await chrome.tabs.query({})

  tabs.forEach(tab =>
    chrome.tabs.sendMessage(tab.id as number, {
      action: 'unset_favicon'
    } as CTNMessage)
  );
}

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

  const tabs = await chrome.tabs.query({});
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
      console.log(`Injected script into tab "${tab.title}"`);
    }
    catch (err) {
      console.error(`Failed to inject script into tab "${tab.title}":\n${err}`);
    }
  });
});
