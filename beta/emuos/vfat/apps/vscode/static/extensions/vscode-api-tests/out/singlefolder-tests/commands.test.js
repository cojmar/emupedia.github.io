"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert = require("assert");
const path_1 = require("path");
const vscode_1 = require("vscode");
suite('commands namespace tests', () => {
    test('getCommands', function (done) {
        let p1 = vscode_1.commands.getCommands().then(commands => {
            let hasOneWithUnderscore = false;
            for (let command of commands) {
                if (command[0] === '_') {
                    hasOneWithUnderscore = true;
                    break;
                }
            }
            assert.ok(hasOneWithUnderscore);
        }, done);
        let p2 = vscode_1.commands.getCommands(true).then(commands => {
            let hasOneWithUnderscore = false;
            for (let command of commands) {
                if (command[0] === '_') {
                    hasOneWithUnderscore = true;
                    break;
                }
            }
            assert.ok(!hasOneWithUnderscore);
        }, done);
        Promise.all([p1, p2]).then(() => {
            done();
        }, done);
    });
    test('command with args', async function () {
        let args;
        let registration = vscode_1.commands.registerCommand('t1', function () {
            args = arguments;
        });
        await vscode_1.commands.executeCommand('t1', 'start');
        registration.dispose();
        assert.ok(args);
        assert.equal(args.length, 1);
        assert.equal(args[0], 'start');
    });
    test('editorCommand with extra args', function () {
        let args;
        let registration = vscode_1.commands.registerTextEditorCommand('t1', function () {
            args = arguments;
        });
        return vscode_1.workspace.openTextDocument(path_1.join(vscode_1.workspace.rootPath || '', './far.js')).then(doc => {
            return vscode_1.window.showTextDocument(doc).then(_editor => {
                return vscode_1.commands.executeCommand('t1', 12345, vscode_1.commands);
            }).then(() => {
                assert.ok(args);
                assert.equal(args.length, 4);
                assert.ok(args[2] === 12345);
                assert.ok(args[3] === vscode_1.commands);
                registration.dispose();
            });
        });
    });
    test('api-command: vscode.diff', function () {
        let registration = vscode_1.workspace.registerTextDocumentContentProvider('sc', {
            provideTextDocumentContent(uri) {
                return `content of URI <b>${uri.toString()}</b>#${Math.random()}`;
            }
        });
        let a = vscode_1.commands.executeCommand('vscode.diff', vscode_1.Uri.parse('sc:a'), vscode_1.Uri.parse('sc:b'), 'DIFF').then(value => {
            assert.ok(value === undefined);
            registration.dispose();
        });
        let b = vscode_1.commands.executeCommand('vscode.diff', vscode_1.Uri.parse('sc:a'), vscode_1.Uri.parse('sc:b')).then(value => {
            assert.ok(value === undefined);
            registration.dispose();
        });
        let c = vscode_1.commands.executeCommand('vscode.diff', vscode_1.Uri.parse('sc:a'), vscode_1.Uri.parse('sc:b'), 'Title', { selection: new vscode_1.Range(new vscode_1.Position(1, 1), new vscode_1.Position(1, 2)) }).then(value => {
            assert.ok(value === undefined);
            registration.dispose();
        });
        let d = vscode_1.commands.executeCommand('vscode.diff').then(() => assert.ok(false), () => assert.ok(true));
        let e = vscode_1.commands.executeCommand('vscode.diff', 1, 2, 3).then(() => assert.ok(false), () => assert.ok(true));
        return Promise.all([a, b, c, d, e]);
    });
    test('api-command: vscode.open', function () {
        let uri = vscode_1.Uri.parse(vscode_1.workspace.workspaceFolders[0].uri.toString() + '/image.png');
        let a = vscode_1.commands.executeCommand('vscode.open', uri).then(() => assert.ok(true), () => assert.ok(false));
        let b = vscode_1.commands.executeCommand('vscode.open', uri, vscode_1.ViewColumn.Two).then(() => assert.ok(true), () => assert.ok(false));
        let c = vscode_1.commands.executeCommand('vscode.open').then(() => assert.ok(false), () => assert.ok(true));
        let d = vscode_1.commands.executeCommand('vscode.open', uri, true).then(() => assert.ok(false), () => assert.ok(true));
        return Promise.all([a, b, c, d]);
    });
});
//# sourceMappingURL=commands.test.js.map