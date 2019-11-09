"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode_1 = require("vscode");
suite('env-namespace', () => {
    test('env is set', function () {
        assert.equal(typeof vscode_1.env.language, 'string');
        assert.equal(typeof vscode_1.env.appRoot, 'string');
        assert.equal(typeof vscode_1.env.appName, 'string');
        assert.equal(typeof vscode_1.env.machineId, 'string');
        assert.equal(typeof vscode_1.env.sessionId, 'string');
        assert.equal(typeof vscode_1.env.shell, 'string');
    });
    test('env is readonly', function () {
        assert.throws(() => vscode_1.env.language = '234');
        assert.throws(() => vscode_1.env.appRoot = '234');
        assert.throws(() => vscode_1.env.appName = '234');
        assert.throws(() => vscode_1.env.machineId = '234');
        assert.throws(() => vscode_1.env.sessionId = '234');
        assert.throws(() => vscode_1.env.shell = '234');
    });
    test('env.remoteName', function () {
        const remoteName = vscode_1.env.remoteName;
        const knownWorkspaceExtension = vscode_1.extensions.getExtension('vscode.git');
        const knownUiExtension = vscode_1.extensions.getExtension('vscode.git-ui');
        if (typeof remoteName === 'undefined') {
            // not running in remote, so we expect both extensions
            assert.ok(knownWorkspaceExtension);
            assert.ok(knownUiExtension);
            assert.equal(vscode_1.ExtensionKind.UI, knownUiExtension.extensionKind);
        }
        else if (typeof remoteName === 'string') {
            // running in remote, so we only expect workspace extensions
            assert.ok(knownWorkspaceExtension);
            if (vscode_1.env.uiKind === vscode_1.UIKind.Desktop) {
                assert.ok(!knownUiExtension); // we currently can only access extensions that run on same host
            }
            assert.equal(vscode_1.ExtensionKind.Workspace, knownWorkspaceExtension.extensionKind);
        }
        else {
            assert.fail();
        }
    });
    test('env.uiKind', async function () {
        const uri = vscode_1.Uri.parse(`${vscode_1.env.uriScheme}:://vscode.vscode-api-tests/path?key=value&other=false`);
        const result = await vscode_1.env.asExternalUri(uri);
        const kind = vscode_1.env.uiKind;
        if (result.scheme === 'http' || result.scheme === 'https') {
            assert.equal(kind, vscode_1.UIKind.Web);
        }
        else {
            assert.equal(kind, vscode_1.UIKind.Desktop);
        }
    });
    test('env.asExternalUri - with env.uriScheme', async function () {
        const uri = vscode_1.Uri.parse(`${vscode_1.env.uriScheme}:://vscode.vscode-api-tests/path?key=value&other=false`);
        const result = await vscode_1.env.asExternalUri(uri);
        assert.ok(result);
        if (vscode_1.env.uiKind === vscode_1.UIKind.Desktop) {
            assert.equal(uri.scheme, result.scheme);
            assert.equal(uri.authority, result.authority);
            assert.equal(uri.path, result.path);
        }
        else {
            assert.ok(result.scheme === 'http' || result.scheme === 'https');
        }
    });
});
//# sourceMappingURL=env.test.js.map