"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode = require("vscode");
const utils_1 = require("../utils");
const path_1 = require("path");
suite('workspace-namespace', () => {
    teardown(utils_1.closeAllEditors);
    test('rootPath', () => {
        assert.ok(utils_1.pathEquals(vscode.workspace.rootPath, path_1.join(__dirname, '../../testWorkspace')));
    });
    test('workspaceFile', () => {
        assert.ok(utils_1.pathEquals(vscode.workspace.workspaceFile.fsPath, path_1.join(__dirname, '../../testworkspace.code-workspace')));
    });
    test('workspaceFolders', () => {
        assert.equal(vscode.workspace.workspaceFolders.length, 2);
        assert.ok(utils_1.pathEquals(vscode.workspace.workspaceFolders[0].uri.fsPath, path_1.join(__dirname, '../../testWorkspace')));
        assert.ok(utils_1.pathEquals(vscode.workspace.workspaceFolders[1].uri.fsPath, path_1.join(__dirname, '../../testWorkspace2')));
        assert.ok(utils_1.pathEquals(vscode.workspace.workspaceFolders[1].name, 'Test Workspace 2'));
    });
    test('getWorkspaceFolder', () => {
        const folder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(path_1.join(__dirname, '../../testWorkspace2/far.js')));
        assert.ok(!!folder);
        if (folder) {
            assert.ok(utils_1.pathEquals(folder.uri.fsPath, path_1.join(__dirname, '../../testWorkspace2')));
        }
    });
});
//# sourceMappingURL=workspace.test.js.map