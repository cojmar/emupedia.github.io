/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/browser/browser", "vs/base/common/platform"], function (require, exports, browser, platform) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Browser feature we can support in current platform, browser and environment.
     */
    exports.BrowserFeatures = {
        clipboard: {
            writeText: (platform.isNative
                || document.queryCommandSupported('copy')
                || !!(navigator && navigator.clipboard && navigator.clipboard.writeText)),
            readText: (platform.isNative
                || !!(navigator && navigator.clipboard && navigator.clipboard.readText)),
            richText: (() => {
                if (browser.isIE) {
                    return false;
                }
                if (browser.isEdge) {
                    let index = navigator.userAgent.indexOf('Edge/');
                    let version = parseInt(navigator.userAgent.substring(index + 5, navigator.userAgent.indexOf('.', index)), 10);
                    if (!version || (version >= 12 && version <= 16)) {
                        return false;
                    }
                }
                return true;
            })()
        },
        /*
         * Full Keyboard Support in Full Screen Mode or Standablone
         */
        fullKeyboard: !!navigator.keyboard || browser.isSafari,
        touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0
    };
});
//# sourceMappingURL=canIUse.js.map