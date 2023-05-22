"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var origHref = [];
var isMac = window.navigator.userAgent.includes('Macintosh');
function sendSetMsg() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!((_a = chrome.runtime) === null || _a === void 0 ? void 0 : _a.id))
                        return [2];
                    return [4, chrome.runtime.sendMessage('ctrl_held')];
                case 1:
                    _b.sent();
                    return [2];
            }
        });
    });
}
function sendUnsetMsg() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!((_a = chrome.runtime) === null || _a === void 0 ? void 0 : _a.id))
                        return [2];
                    return [4, chrome.runtime.sendMessage('ctrl_released')];
                case 1:
                    _b.sent();
                    return [2];
            }
        });
    });
}
function setPageFavicons(faviconUrl) {
    var favicons = getPageFavicons();
    if (origHref.length > 0)
        return;
    favicons.forEach(function (favicon) {
        origHref.push(favicon.href);
        favicon.setAttribute('href', faviconUrl);
    });
}
function unsetPageFavicons() {
    var favicons = getPageFavicons();
    if (origHref.length === 0)
        return;
    favicons.forEach(function (favicon, index) {
        favicon.setAttribute('href', origHref[index]);
    });
    origHref.length = 0;
}
function getPageFavicons() {
    var _a;
    var favicons = document.querySelectorAll("link[rel*='icon']");
    if ((_a = !(favicons === null || favicons === void 0 ? void 0 : favicons.length)) !== null && _a !== void 0 ? _a : true) {
        var favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        document.head.append(favicon);
        favicons = document.querySelectorAll("link[rel*='icon']");
    }
    return favicons;
}
function isCtrlOrCmd(key) {
    return (isMac && key === 'Meta') || (!isMac && key === 'Control');
}
document.addEventListener('visibilitychange', sendUnsetMsg);
window.addEventListener('blur', sendUnsetMsg);
document.addEventListener('keydown', function (evt) {
    if (!isCtrlOrCmd(evt.key))
        return;
    sendSetMsg();
});
document.addEventListener('keyup', function (evt) {
    if (!isCtrlOrCmd(evt.key))
        return;
    sendUnsetMsg();
});
chrome.runtime.onMessage.addListener(function (message) {
    switch (message.action) {
        case 'set_favicon':
            setPageFavicons(message.icon);
            break;
        case 'unset_favicon':
            unsetPageFavicons();
            break;
        default:
            break;
    }
});
//# sourceMappingURL=content.js.map