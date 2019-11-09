/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/event", "vs/base/common/lifecycle"], function (require, exports, event_1, lifecycle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CustomEditorModel extends lifecycle_1.Disposable {
        constructor() {
            super(...arguments);
            this._currentEditIndex = 0;
            this._savePoint = -1;
            this._edits = [];
            this._onDidChangeDirty = this._register(new event_1.Emitter());
            this.onDidChangeDirty = this._onDidChangeDirty.event;
            this._onUndo = this._register(new event_1.Emitter());
            this.onUndo = this._onUndo.event;
        }
        makeEdit(data) {
            this._edits.splice(this._currentEditIndex, this._edits.length - this._currentEditIndex, data);
            this._currentEditIndex = this._edits.length - 1;
            this.updateDirty();
        }
        isDirty() {
            return this._edits.length > 0 && this._savePoint !== this._edits.length;
        }
        updateDirty() {
            this._onDidChangeDirty.fire();
        }
        save() {
            this._savePoint = this._edits.length;
            this.updateDirty();
        }
        undo() {
            if (this._currentEditIndex >= 0) {
                const undoneEdit = this._edits[this._currentEditIndex];
                --this._currentEditIndex;
                this._onUndo.fire(undoneEdit);
            }
            this.updateDirty();
        }
    }
    exports.CustomEditorModel = CustomEditorModel;
});
//# sourceMappingURL=customEditorModel.js.map