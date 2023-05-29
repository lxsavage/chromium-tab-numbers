# The Tab Enumerator

## Background

Most modern web browsers provide a keyboard shortcut for `CTRL/CMD + #`, where 
\# is a number from 1 through 9, which will change the tab to the specified tab
index, except for 9, which will point to the last tab. This shortcut is very
useful for speeding up tab switching, but runs into one significant issue: no
numbers are displayed, so to determine which number to press is either a guessing
game, or one would have to count out the tabs from the left, negating any benefit
the shortcut had.

## What does this extension do?

This extension adds a binding where whenever the `CTRL/CMD` key is held down,
it will display numbers in place of the favicons of the tabs in the current
window to denote which tab `CTRL/CMD + #` will switch to.

## How do I install it?

Currently, this extension is not on the Chrome Webstore (due to the fact that I
believe it isn't stable enough to be able to release yet), so it must be
installed manually.

In order to do this, a few steps will need to be taken in order to put Chrome
into extension dev mode, and load the unpacked extension:

1. Clone this repo into a safe directory. In this example, I will clone it to
   the home directory:

```bash
git clone https://github.com/lxsavage/chromium-tab-numbers.git ~/chromium-tab-numbers
```

2. Install all packages with `yarn`:

```bash
yarn install
```

3. Build the project:

```bash
yarn build
```

### Chrome Installation

1. Navigate to `chrome://extensions`
2. Enable the "Developer Mode" slider
3. Click on "Load unpacked"
4. Click on open after navigating to the `dist.chrome/` folder

### Firefox Installation

A separate `dist.firefox/` directory is generated for Firefox browsers since
they do not properly implement the background Service Worker API from manifest
V3, therefore it has a different manifest that will utilize V2 instead.

Note that due to the unsigned nature of this extension, it needs to be re-added
every time firefox is restarted (this is a limitation of the browser itself, so
I can't work around it).

1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click on "Load Temporary Add-on..."
3. Select `dist.firefox/manifest.json`
