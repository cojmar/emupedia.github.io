/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/platform/instantiation/common/extensions", "vs/platform/clipboard/common/clipboardService"], function (require, exports, extensions_1, clipboardService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BrowserClipboardService {
        async writeText(text, type) {
            if (type) {
                return; // TODO@sbatten
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(text);
            }
            else {
                const activeElement = document.activeElement;
                const newTextarea = document.createElement('textarea');
                newTextarea.className = 'clipboard-copy';
                newTextarea.style.visibility = 'false';
                newTextarea.style.height = '1px';
                newTextarea.style.width = '1px';
                document.body.appendChild(newTextarea);
                newTextarea.value = text;
                newTextarea.focus();
                newTextarea.select();
                document.execCommand('copy');
                activeElement.focus();
                document.body.removeChild(newTextarea);
            }
            return;
        }
        async readText(type) {
            if (type) {
                return ''; // TODO@sbatten
            }
            return navigator.clipboard.readText();
        }
        readTextSync() {
            return undefined;
        }
        readFindText() {
            // @ts-ignore
            return undefined;
        }
        writeFindText(text) { }
        writeResources(resources) {
            this._internalResourcesClipboard = resources;
        }
        readResources() {
            return this._internalResourcesClipboard || [];
        }
        hasResources() {
            return this._internalResourcesClipboard !== undefined && this._internalResourcesClipboard.length > 0;
        }
    }
    exports.BrowserClipboardService = BrowserClipboardService;
    extensions_1.registerSingleton(clipboardService_1.IClipboardService, BrowserClipboardService, true);
});
//# sourceMappingURL=clipboardService.js.map