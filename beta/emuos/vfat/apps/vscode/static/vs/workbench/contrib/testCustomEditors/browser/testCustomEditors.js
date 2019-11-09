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
define(["require", "exports", "vs/nls", "vs/base/common/actions", "vs/workbench/browser/parts/editor/baseEditor", "vs/workbench/common/editor", "vs/workbench/services/editor/common/editorService", "vs/base/browser/dom", "vs/platform/registry/common/platform", "vs/workbench/browser/editor", "vs/platform/instantiation/common/descriptors", "vs/platform/telemetry/common/telemetry", "vs/platform/theme/common/themeService", "vs/platform/storage/common/storage", "vs/workbench/common/actions", "vs/platform/actions/common/actions", "vs/base/common/uri", "vs/base/common/resources", "vs/base/common/uuid", "vs/platform/theme/common/colorRegistry"], function (require, exports, nls, actions_1, baseEditor_1, editor_1, editorService_1, dom_1, platform_1, editor_2, descriptors_1, telemetry_1, themeService_1, storage_1, actions_2, actions_3, uri_1, resources_1, uuid_1, colorRegistry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let TestCustomEditorsAction = class TestCustomEditorsAction extends actions_1.Action {
        constructor(id, label, editorService) {
            super(id, label);
            this.editorService = editorService;
        }
        async run() {
            await this.editorService.openEditor(new TestCustomEditorInput(uri_1.URI.parse(`testCustomEditor:/${uuid_1.generateUuid()}`)));
            return true;
        }
    };
    TestCustomEditorsAction.ID = 'workbench.action.openCustomEditor';
    TestCustomEditorsAction.LABEL = nls.localize('openCustomEditor', "Test Open Custom Editor");
    TestCustomEditorsAction = __decorate([
        __param(2, editorService_1.IEditorService)
    ], TestCustomEditorsAction);
    exports.TestCustomEditorsAction = TestCustomEditorsAction;
    let TestCustomEditor = class TestCustomEditor extends baseEditor_1.BaseEditor {
        constructor(telemetryService, themeService, storageService) {
            super(TestCustomEditor.ID, telemetryService, themeService, storageService);
            this.textArea = undefined;
        }
        updateStyles() {
            super.updateStyles();
            if (this.textArea) {
                this.textArea.style.backgroundColor = this.getColor(colorRegistry_1.editorBackground).toString();
                this.textArea.style.color = this.getColor(colorRegistry_1.editorForeground).toString();
            }
        }
        createEditor(parent) {
            this.textArea = document.createElement('textarea');
            this.textArea.style.width = '100%';
            this.textArea.style.height = '100%';
            parent.appendChild(this.textArea);
            dom_1.addDisposableListener(this.textArea, dom_1.EventType.CHANGE, e => this.onDidType());
            dom_1.addDisposableListener(this.textArea, dom_1.EventType.KEY_UP, e => this.onDidType());
            this.updateStyles();
        }
        onDidType() {
            if (this._input instanceof TestCustomEditorInput) {
                this._input.setValue(this.textArea.value);
            }
        }
        async setInput(input, options, token) {
            await super.setInput(input, options, token);
            const model = await input.resolve();
            if (model instanceof TestCustomEditorModel) {
                this.textArea.value = model.value;
            }
        }
        clearInput() {
            super.clearInput();
            this.textArea.value = '';
        }
        focus() {
            this.textArea.focus();
        }
        layout(dimension) { }
    };
    TestCustomEditor.ID = 'testCustomEditor';
    TestCustomEditor = __decorate([
        __param(0, telemetry_1.ITelemetryService),
        __param(1, themeService_1.IThemeService),
        __param(2, storage_1.IStorageService)
    ], TestCustomEditor);
    exports.TestCustomEditor = TestCustomEditor;
    class TestCustomEditorInput extends editor_1.EditorInput {
        constructor(resource) {
            super();
            this.resource = resource;
            this.model = undefined;
            this.dirty = false;
        }
        getResource() {
            return this.resource;
        }
        getTypeId() {
            return TestCustomEditor.ID;
        }
        getName() {
            return `Custom Editor: ${this.resource.toString()}`;
        }
        setValue(value) {
            if (this.model) {
                this.model.value = value;
            }
            this.setDirty(value.length > 0);
        }
        setDirty(dirty) {
            this.dirty = dirty;
            this._onDidChangeDirty.fire();
        }
        isDirty() {
            return this.dirty;
        }
        confirmSave() {
            // TODO
            return Promise.resolve(1 /* DONT_SAVE */);
        }
        save() {
            this.setDirty(false);
            return Promise.resolve(true);
        }
        revert(options) {
            this.setDirty(false);
            return Promise.resolve(true);
        }
        async resolve() {
            if (!this.model) {
                this.model = new TestCustomEditorModel(this.resource);
            }
            return this.model;
        }
        matches(other) {
            return other instanceof TestCustomEditorInput && resources_1.isEqual(other.resource, this.resource);
        }
    }
    exports.TestCustomEditorInput = TestCustomEditorInput;
    class TestCustomEditorModel extends editor_1.EditorModel {
        constructor(resource) {
            super();
            this.resource = resource;
            this.value = '';
        }
    }
    exports.TestCustomEditorModel = TestCustomEditorModel;
    platform_1.Registry.as(editor_2.Extensions.Editors).registerEditor(new editor_2.EditorDescriptor(TestCustomEditor, TestCustomEditor.ID, nls.localize('testCustomEditor', "Test Custom Editor")), [
        new descriptors_1.SyncDescriptor(TestCustomEditorInput),
    ]);
    const registry = platform_1.Registry.as(actions_2.Extensions.WorkbenchActions);
    registry.registerWorkbenchAction(new actions_3.SyncActionDescriptor(TestCustomEditorsAction, TestCustomEditorsAction.ID, TestCustomEditorsAction.LABEL), 'Test Open Custom Editor');
    class TestCustomEditorInputFactory {
        serialize(editorInput) {
            return JSON.stringify({
                resource: editorInput.resource.toString()
            });
        }
        deserialize(instantiationService, serializedEditorInput) {
            return new TestCustomEditorInput(uri_1.URI.parse(JSON.parse(serializedEditorInput).resource));
        }
    }
    platform_1.Registry.as(editor_1.Extensions.EditorInputFactories).registerEditorInputFactory(TestCustomEditor.ID, TestCustomEditorInputFactory);
});
//# sourceMappingURL=testCustomEditors.js.map