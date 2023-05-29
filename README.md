# The Tab Enumerator

## Background

Most modern web browsers provide a keyboard shortcut for `CTRL/CMD + #`, where
`#` is a number from 1 through 9, which will change the tab to the specified tab
index, except for 9, which will point to the last tab. This shortcut is very
useful for speeding up tab switching, but runs into one significant issue: no
numbers are displayed, so to determine which number to press is either a guessing
game, or one would have to count out the tabs from the left, negating any benefit
the shortcut had.

## What does this extension do?

This extension adds a binding where whenever the `CTRL/CMD` key is held down,
it will display numbers in place of the favicons of the tabs in the current
window to denote which tab `CTRL/CMD + #` will switch to.

## Installation

Currently, this extension is not on the Chrome Webstore (due to the fact that I
believe it isn't stable enough to be able to release yet), so it must be
installed manually.

In order to do this, a few steps will need to be taken in order to put Chrome
into extension dev mode, and load the unpacked extension:

There are two different versions of the extension: one for Chromium-based
browsers (Chrome, Edge, Brave, etc.), and one for non-Chromium browsers that
don't support all of the Manifest V3 features, and as a result use Manifest V2
WebExtensions API for compatibility.

1. Extract the corresponding release zip file to a safe location (a home
   directory is a good place for it, since the unzipped folder needs to be
   present while using the extension)
2. Follow the guides below corresponding to your browser type

### Chromium/Manifest V3 Installation

1. Navigate to `chrome://extensions`
2. Enable the "Developer Mode" slider
3. Click on "Load unpacked"
4. Click on open after navigating to the root of the unzipped archive (should
   have a `manifest.json` file in it)

### Firefox/Manifest V2 Installation

Note that due to the unsigned nature of this extension, it needs to be re-added
every time firefox is restarted (this is a limitation of the browser itself, so
I can't work around it).

1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click on "Load Temporary Add-on..."
3. Select the `manifest.json` file inside the unzipped archive

## How do I build it from source?

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

4. Follow the installation instructions normally, using `dist.chrome/` for
Chromium browsers, and `dist.firefox/` for other browsers (mainly Firefox) that
support the WebExtensions API.
