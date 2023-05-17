# Chromium Tab Numbers

## Background

Chromium provides a keyboard shortcut for `CTRL/CMD + #`, where # is a number from 1 through 9, which will change the
tab to the specified tab index, except for 9, which will point to the last tab. This shortcut is very useful for
speeding up tab switching, but runs into one significant issue: no numbers are displayed, so to determine which number
to press is either a guessing game, or one would have to count out the tabs from the left, negating any benefit the
shortcut had.

## What does this extension do?

This extension adds a binding where whenever the `CTRL/CMD` key is held down, it will display numbers in place of the
favicons of the tabs in the current window to denote which tab `CTRL/CMD + #` will switch to.

## How do I install it?

Currently, this extension is not on the Chrome Webstore (due to the fact that I believe it isn't stable enough to be
able to release yet), so it must be installed manually.

In order to do this, a few steps will need to be taken in order to put Chrome into extension dev mode, and load the
unpacked extension:

1. Clone this repo into a safe directory. In this example, I will clone it to the home directory:

```bash
git clone https://github.com/lxsavage/chromium-tab-numbers.git ~/chromium-tab-numbers
```

2. Navigate to `chrome://extensions`
3. Enable the "Developer Mode" slider
4. Click on "Load unpacked"
    1. Navigate to the root of the cloned repo (in this case `~/chromium-tab-numbers`), then open it