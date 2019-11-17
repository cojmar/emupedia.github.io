"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const memfs_1 = require("./memfs");
const assert = require("assert");
function rndName() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
}
exports.rndName = rndName;
exports.testFs = new memfs_1.MemFS();
vscode.workspace.registerFileSystemProvider(exports.testFs.scheme, exports.testFs);
async function createRandomFile(contents = '', dir = undefined, ext = '') {
    let fakeFile;
    if (dir) {
        assert.equal(dir.scheme, exports.testFs.scheme);
        fakeFile = dir.with({ path: dir.path + '/' + rndName() + ext });
    }
    else {
        fakeFile = vscode.Uri.parse(`${exports.testFs.scheme}:/${rndName() + ext}`);
    }
    await exports.testFs.writeFile(fakeFile, Buffer.from(contents), { create: true, overwrite: true });
    return fakeFile;
}
exports.createRandomFile = createRandomFile;
async function deleteFile(file) {
    try {
        await exports.testFs.delete(file);
        return true;
    }
    catch (_a) {
        return false;
    }
}
exports.deleteFile = deleteFile;
function pathEquals(path1, path2) {
    if (process.platform !== 'linux') {
        path1 = path1.toLowerCase();
        path2 = path2.toLowerCase();
    }
    return path1 === path2;
}
exports.pathEquals = pathEquals;
function closeAllEditors() {
    return vscode.commands.executeCommand('workbench.action.closeAllEditors');
}
exports.closeAllEditors = closeAllEditors;
function disposeAll(disposables) {
    vscode.Disposable.from(...disposables).dispose();
}
exports.disposeAll = disposeAll;
function conditionalTest(name, testCallback) {
    if (isTestTypeActive()) {
        const async = !!testCallback.length;
        if (async) {
            test(name, (done) => testCallback(done));
        }
        else {
            test(name, () => testCallback());
        }
    }
}
exports.conditionalTest = conditionalTest;
function isTestTypeActive() {
    return !!vscode.extensions.getExtension('vscode-resolver-test');
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.delay = delay;
//# sourceMappingURL=utils.js.map