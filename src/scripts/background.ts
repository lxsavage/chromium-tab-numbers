function setFavicons() {
  chrome.tabs.query({currentWindow: true})
    .then((tabs) => {
      tabs.forEach((tab, index) => {
        let logicalIndex = index + 1;
        if (tabs.length > 8 && index === tabs.length - 1) {
          logicalIndex = 9;
        } else if (index >= 8) return;

        const icUrl = chrome.runtime.getURL(`images/n${logicalIndex}.png`);

        // TODO: Handle context invalidated
        chrome.tabs.sendMessage(tab.id as number, {
          action: 'set_favicon',
          icon: icUrl
        } as CTNMessage);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

function unsetFavicons() {
  chrome.tabs.query({})
    .then((tabs) => {
      tabs.forEach(tab => {
        // TODO: Handle context invalidated
        chrome.tabs.sendMessage(tab.id as number, {
          action: 'unset_favicon'
        } as CTNMessage);
      });
    })
    .catch((err) => {
      console.error(err);
    });
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
chrome.runtime.onInstalled.addListener(({reason}) => {
  if (reason === 'install') {
    chrome.tabs.create({url: 'onboarding/install.html'})
      .then(() => {
        console.log('Opened onboarding tab');
      });
  }
  chrome.tabs.query({})
    .then((tabs) => {
      tabs.forEach(tab => {
        chrome.scripting.executeScript({
          target: {
            tabId: tab.id as number,
            allFrames: true,
          },
          files: [
            'scripts/content.js',
          ],
        })
          .then(() => {
            console.log(`Injected script into tab "${tab.title}"`);
          })
          .catch((err) => {
            console.error(`Failed to inject script into tab "${tab.title}":\n${err}`);
          });
      });
    })
    .catch((err) => {
      console.error(err);
    });
});
