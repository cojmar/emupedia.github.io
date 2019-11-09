/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/decorators", "vs/base/common/network", "vs/base/common/path", "vs/base/common/resources", "vs/platform/label/common/label", "vs/platform/lifecycle/common/lifecycle", "vs/workbench/contrib/webview/browser/webviewWorkbenchService"], function (require, exports, decorators_1, network_1, path_1, resources_1, label_1, lifecycle_1, webviewWorkbenchService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let CustomFileEditorInput = class CustomFileEditorInput extends webviewWorkbenchService_1.LazilyResolvedWebviewEditorInput {
        constructor(resource, viewType, id, webview, lifecycleService, webviewWorkbenchService, labelService) {
            super(id, viewType, '', webview, webviewWorkbenchService, lifecycleService);
            this.labelService = labelService;
            this._editorResource = resource;
        }
        getTypeId() {
            return CustomFileEditorInput.typeId;
        }
        getResource() {
            return this._editorResource;
        }
        getName() {
            if (this.getResource().scheme === network_1.Schemas.data) {
                const metadata = resources_1.DataUri.parseMetaData(this.getResource());
                const label = metadata.get(resources_1.DataUri.META_DATA_LABEL);
                if (typeof label === 'string') {
                    return label;
                }
            }
            return path_1.basename(this.labelService.getUriLabel(this.getResource()));
        }
        getDescription() {
            if (this.getResource().scheme === network_1.Schemas.data) {
                const metadata = resources_1.DataUri.parseMetaData(this.getResource());
                const description = metadata.get(resources_1.DataUri.META_DATA_DESCRIPTION);
                if (typeof description === 'string') {
                    return description;
                }
            }
            return super.getDescription();
        }
        matches(other) {
            return this === other || (other instanceof CustomFileEditorInput
                && this.viewType === other.viewType
                && resources_1.isEqual(this.getResource(), other.getResource()));
        }
        get shortTitle() {
            return this.getName();
        }
        get mediumTitle() {
            if (this.getResource().scheme === network_1.Schemas.data) {
                return this.getName();
            }
            return this.labelService.getUriLabel(this.getResource(), { relative: true });
        }
        get longTitle() {
            if (this.getResource().scheme === network_1.Schemas.data) {
                return this.getName();
            }
            return this.labelService.getUriLabel(this.getResource());
        }
        getTitle(verbosity) {
            switch (verbosity) {
                case 0 /* SHORT */:
                    return this.shortTitle;
                default:
                case 1 /* MEDIUM */:
                    return this.mediumTitle;
                case 2 /* LONG */:
                    return this.longTitle;
            }
        }
        setModel(model) {
            if (this._model) {
                throw new Error('Model is already set');
            }
            this._model = model;
            this._register(model.onDidChangeDirty(() => this._onDidChangeDirty.fire()));
        }
        isDirty() {
            return this._model ? this._model.isDirty() : false;
        }
    };
    CustomFileEditorInput.typeId = 'workbench.editors.webviewEditor';
    __decorate([
        decorators_1.memoize
    ], CustomFileEditorInput.prototype, "getName", null);
    __decorate([
        decorators_1.memoize
    ], CustomFileEditorInput.prototype, "getDescription", null);
    __decorate([
        decorators_1.memoize
    ], CustomFileEditorInput.prototype, "shortTitle", null);
    __decorate([
        decorators_1.memoize
    ], CustomFileEditorInput.prototype, "mediumTitle", null);
    __decorate([
        decorators_1.memoize
    ], CustomFileEditorInput.prototype, "longTitle", null);
    CustomFileEditorInput = __decorate([
        __param(4, lifecycle_1.ILifecycleService),
        __param(5, webviewWorkbenchService_1.IWebviewWorkbenchService),
        __param(6, label_1.ILabelService)
    ], CustomFileEditorInput);
    exports.CustomFileEditorInput = CustomFileEditorInput;
});
//# sourceMappingURL=customEditorInput.js.map