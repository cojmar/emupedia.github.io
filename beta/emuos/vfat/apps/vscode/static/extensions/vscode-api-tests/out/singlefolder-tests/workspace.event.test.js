"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode = require("vscode");
const utils_1 = require("../utils");
suite('workspace-event', () => {
    const disposables = [];
    teardown(() => {
        for (const dispo of disposables) {
            dispo.dispose();
        }
        disposables.length = 0;
    });
    test('onWillCreate/onDidCreate', async function () {
        var _a, _b, _c, _d;
        const base = await utils_1.createRandomFile();
        const newUri = base.with({ path: base.path + '-foo' });
        let onWillCreate;
        let onDidCreate;
        disposables.push(vscode.workspace.onWillCreateFiles(e => onWillCreate = e));
        disposables.push(vscode.workspace.onDidCreateFiles(e => onDidCreate = e));
        const edit = new vscode.WorkspaceEdit();
        edit.createFile(newUri);
        const success = await vscode.workspace.applyEdit(edit);
        assert.ok(success);
        assert.ok(onWillCreate);
        assert.equal((_a = onWillCreate) === null || _a === void 0 ? void 0 : _a.creating.length, 1);
        assert.equal((_b = onWillCreate) === null || _b === void 0 ? void 0 : _b.creating[0].toString(), newUri.toString());
        assert.ok(onDidCreate);
        assert.equal((_c = onDidCreate) === null || _c === void 0 ? void 0 : _c.created.length, 1);
        assert.equal((_d = onDidCreate) === null || _d === void 0 ? void 0 : _d.created[0].toString(), newUri.toString());
    });
    test('onWillDelete/onDidDelete', async function () {
        var _a, _b, _c, _d;
        const base = await utils_1.createRandomFile();
        let onWilldelete;
        let onDiddelete;
        disposables.push(vscode.workspace.onWillDeleteFiles(e => onWilldelete = e));
        disposables.push(vscode.workspace.onDidDeleteFiles(e => onDiddelete = e));
        const edit = new vscode.WorkspaceEdit();
        edit.deleteFile(base);
        const success = await vscode.workspace.applyEdit(edit);
        assert.ok(success);
        assert.ok(onWilldelete);
        assert.equal((_a = onWilldelete) === null || _a === void 0 ? void 0 : _a.deleting.length, 1);
        assert.equal((_b = onWilldelete) === null || _b === void 0 ? void 0 : _b.deleting[0].toString(), base.toString());
        assert.ok(onDiddelete);
        assert.equal((_c = onDiddelete) === null || _c === void 0 ? void 0 : _c.deleted.length, 1);
        assert.equal((_d = onDiddelete) === null || _d === void 0 ? void 0 : _d.deleted[0].toString(), base.toString());
    });
    test('onWillRename/onDidRename', async function () {
        var _a, _b, _c, _d, _e, _f;
        const oldUri = await utils_1.createRandomFile();
        const newUri = oldUri.with({ path: oldUri.path + '-NEW' });
        let onWillRename;
        let onDidRename;
        disposables.push(vscode.workspace.onWillRenameFiles(e => onWillRename = e));
        disposables.push(vscode.workspace.onDidRenameFiles(e => onDidRename = e));
        const edit = new vscode.WorkspaceEdit();
        edit.renameFile(oldUri, newUri);
        const success = await vscode.workspace.applyEdit(edit);
        assert.ok(success);
        assert.ok(onWillRename);
        assert.equal((_a = onWillRename) === null || _a === void 0 ? void 0 : _a.renaming.length, 1);
        assert.equal((_b = onWillRename) === null || _b === void 0 ? void 0 : _b.renaming[0].oldUri.toString(), oldUri.toString());
        assert.equal((_c = onWillRename) === null || _c === void 0 ? void 0 : _c.renaming[0].newUri.toString(), newUri.toString());
        assert.ok(onDidRename);
        assert.equal((_d = onDidRename) === null || _d === void 0 ? void 0 : _d.renamed.length, 1);
        assert.equal((_e = onDidRename) === null || _e === void 0 ? void 0 : _e.renamed[0].oldUri.toString(), oldUri.toString());
        assert.equal((_f = onDidRename) === null || _f === void 0 ? void 0 : _f.renamed[0].newUri.toString(), newUri.toString());
    });
    test('onWillRename - make changes', async function () {
        var _a, _b, _c;
        const oldUri = await utils_1.createRandomFile('BAR');
        const newUri = oldUri.with({ path: oldUri.path + '-NEW' });
        const anotherFile = await utils_1.createRandomFile('BAR');
        let onWillRename;
        disposables.push(vscode.workspace.onWillRenameFiles(e => {
            onWillRename = e;
            const edit = new vscode.WorkspaceEdit();
            edit.insert(e.renaming[0].oldUri, new vscode.Position(0, 0), 'FOO');
            edit.replace(anotherFile, new vscode.Range(0, 0, 0, 3), 'FARBOO');
            e.waitUntil(Promise.resolve(edit));
        }));
        const edit = new vscode.WorkspaceEdit();
        edit.renameFile(oldUri, newUri);
        const success = await vscode.workspace.applyEdit(edit);
        assert.ok(success);
        assert.ok(onWillRename);
        assert.equal((_a = onWillRename) === null || _a === void 0 ? void 0 : _a.renaming.length, 1);
        assert.equal((_b = onWillRename) === null || _b === void 0 ? void 0 : _b.renaming[0].oldUri.toString(), oldUri.toString());
        assert.equal((_c = onWillRename) === null || _c === void 0 ? void 0 : _c.renaming[0].newUri.toString(), newUri.toString());
        assert.equal((await vscode.workspace.openTextDocument(newUri)).getText(), 'FOOBAR');
        assert.equal((await vscode.workspace.openTextDocument(anotherFile)).getText(), 'FARBOO');
    });
});
//# sourceMappingURL=workspace.event.test.js.map