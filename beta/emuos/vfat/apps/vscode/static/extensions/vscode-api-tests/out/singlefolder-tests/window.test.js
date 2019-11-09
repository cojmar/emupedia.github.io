"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode_1 = require("vscode");
const path_1 = require("path");
const utils_1 = require("../utils");
suite('window namespace tests', () => {
    teardown(utils_1.closeAllEditors);
    test('editor, active text editor', async () => {
        const doc = await vscode_1.workspace.openTextDocument(path_1.join(vscode_1.workspace.rootPath || '', './far.js'));
        await vscode_1.window.showTextDocument(doc);
        const active = vscode_1.window.activeTextEditor;
        assert.ok(active);
        assert.ok(utils_1.pathEquals(active.document.uri.fsPath, doc.uri.fsPath));
    });
    test('editor, opened via resource', () => {
        const uri = vscode_1.Uri.file(path_1.join(vscode_1.workspace.rootPath || '', './far.js'));
        return vscode_1.window.showTextDocument(uri).then((_editor) => {
            const active = vscode_1.window.activeTextEditor;
            assert.ok(active);
            assert.ok(utils_1.pathEquals(active.document.uri.fsPath, uri.fsPath));
        });
    });
    // test('editor, UN-active text editor', () => {
    // 	assert.equal(window.visibleTextEditors.length, 0);
    // 	assert.ok(window.activeTextEditor === undefined);
    // });
    test('editor, assign and check view columns', async () => {
        const doc = await vscode_1.workspace.openTextDocument(path_1.join(vscode_1.workspace.rootPath || '', './far.js'));
        let p1 = vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One).then(editor => {
            assert.equal(editor.viewColumn, vscode_1.ViewColumn.One);
        });
        let p2 = vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.Two).then(editor_1 => {
            assert.equal(editor_1.viewColumn, vscode_1.ViewColumn.Two);
        });
        let p3 = vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.Three).then(editor_2 => {
            assert.equal(editor_2.viewColumn, vscode_1.ViewColumn.Three);
        });
        return Promise.all([p1, p2, p3]);
    });
    test('editor, onDidChangeVisibleTextEditors', async () => {
        let eventCounter = 0;
        let reg = vscode_1.window.onDidChangeVisibleTextEditors(_editor => {
            eventCounter += 1;
        });
        const doc = await vscode_1.workspace.openTextDocument(path_1.join(vscode_1.workspace.rootPath || '', './far.js'));
        await vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One);
        assert.equal(eventCounter, 1);
        await vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.Two);
        assert.equal(eventCounter, 2);
        await vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.Three);
        assert.equal(eventCounter, 3);
        reg.dispose();
    });
    test('editor, onDidChangeTextEditorViewColumn (close editor)', () => {
        let actualEvent;
        let registration1 = vscode_1.workspace.registerTextDocumentContentProvider('bikes', {
            provideTextDocumentContent() {
                return 'mountainbiking,roadcycling';
            }
        });
        return Promise.all([
            vscode_1.workspace.openTextDocument(vscode_1.Uri.parse('bikes://testing/one')).then(doc => vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One)),
            vscode_1.workspace.openTextDocument(vscode_1.Uri.parse('bikes://testing/two')).then(doc => vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.Two))
        ]).then(async (editors) => {
            let [one, two] = editors;
            await new Promise(resolve => {
                let registration2 = vscode_1.window.onDidChangeTextEditorViewColumn(event => {
                    actualEvent = event;
                    registration2.dispose();
                    resolve();
                });
                // close editor 1, wait a little for the event to bubble
                one.hide();
            });
            assert.ok(actualEvent);
            assert.ok(actualEvent.textEditor === two);
            assert.ok(actualEvent.viewColumn === two.viewColumn);
            registration1.dispose();
        });
    });
    test('editor, onDidChangeTextEditorViewColumn (move editor group)', () => {
        let actualEvents = [];
        let registration1 = vscode_1.workspace.registerTextDocumentContentProvider('bikes', {
            provideTextDocumentContent() {
                return 'mountainbiking,roadcycling';
            }
        });
        return Promise.all([
            vscode_1.workspace.openTextDocument(vscode_1.Uri.parse('bikes://testing/one')).then(doc => vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One)),
            vscode_1.workspace.openTextDocument(vscode_1.Uri.parse('bikes://testing/two')).then(doc => vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.Two))
        ]).then(editors => {
            let [, two] = editors;
            two.show();
            return new Promise(resolve => {
                let registration2 = vscode_1.window.onDidChangeTextEditorViewColumn(event => {
                    actualEvents.push(event);
                    if (actualEvents.length === 2) {
                        registration2.dispose();
                        resolve();
                    }
                });
                // move active editor group left
                return vscode_1.commands.executeCommand('workbench.action.moveActiveEditorGroupLeft');
            }).then(() => {
                assert.equal(actualEvents.length, 2);
                for (const event of actualEvents) {
                    assert.equal(event.viewColumn, event.textEditor.viewColumn);
                }
                registration1.dispose();
            });
        });
    });
    test('active editor not always correct... #49125', async function () {
        const [docA, docB] = await Promise.all([
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
        ]);
        for (let c = 0; c < 4; c++) {
            let editorA = await vscode_1.window.showTextDocument(docA, vscode_1.ViewColumn.One);
            assert(vscode_1.window.activeTextEditor === editorA);
            let editorB = await vscode_1.window.showTextDocument(docB, vscode_1.ViewColumn.Two);
            assert(vscode_1.window.activeTextEditor === editorB);
        }
    });
    test('default column when opening a file', async () => {
        const [docA, docB, docC] = await Promise.all([
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile())
        ]);
        await vscode_1.window.showTextDocument(docA, vscode_1.ViewColumn.One);
        await vscode_1.window.showTextDocument(docB, vscode_1.ViewColumn.Two);
        assert.ok(vscode_1.window.activeTextEditor);
        assert.ok(vscode_1.window.activeTextEditor.document === docB);
        assert.equal(vscode_1.window.activeTextEditor.viewColumn, vscode_1.ViewColumn.Two);
        const editor = await vscode_1.window.showTextDocument(docC);
        assert.ok(vscode_1.window.activeTextEditor === editor, `wanted fileName:${editor.document.fileName}/viewColumn:${editor.viewColumn} but got fileName:${vscode_1.window.activeTextEditor.document.fileName}/viewColumn:${vscode_1.window.activeTextEditor.viewColumn}. a:${docA.fileName}, b:${docB.fileName}, c:${docC.fileName}`);
        assert.ok(vscode_1.window.activeTextEditor.document === docC);
        assert.equal(vscode_1.window.activeTextEditor.viewColumn, vscode_1.ViewColumn.Two);
    });
    test('showTextDocument ViewColumn.BESIDE', async () => {
        const [docA, docB, docC] = await Promise.all([
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile())
        ]);
        await vscode_1.window.showTextDocument(docA, vscode_1.ViewColumn.One);
        await vscode_1.window.showTextDocument(docB, vscode_1.ViewColumn.Beside);
        assert.ok(vscode_1.window.activeTextEditor);
        assert.ok(vscode_1.window.activeTextEditor.document === docB);
        assert.equal(vscode_1.window.activeTextEditor.viewColumn, vscode_1.ViewColumn.Two);
        await vscode_1.window.showTextDocument(docC, vscode_1.ViewColumn.Beside);
        assert.ok(vscode_1.window.activeTextEditor.document === docC);
        assert.equal(vscode_1.window.activeTextEditor.viewColumn, vscode_1.ViewColumn.Three);
    });
    test('showTextDocument ViewColumn is always defined (even when opening > ViewColumn.Nine)', async () => {
        const [doc1, doc2, doc3, doc4, doc5, doc6, doc7, doc8, doc9, doc10] = await Promise.all([
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile())
        ]);
        await vscode_1.window.showTextDocument(doc1, vscode_1.ViewColumn.One);
        await vscode_1.window.showTextDocument(doc2, vscode_1.ViewColumn.Two);
        await vscode_1.window.showTextDocument(doc3, vscode_1.ViewColumn.Three);
        await vscode_1.window.showTextDocument(doc4, vscode_1.ViewColumn.Four);
        await vscode_1.window.showTextDocument(doc5, vscode_1.ViewColumn.Five);
        await vscode_1.window.showTextDocument(doc6, vscode_1.ViewColumn.Six);
        await vscode_1.window.showTextDocument(doc7, vscode_1.ViewColumn.Seven);
        await vscode_1.window.showTextDocument(doc8, vscode_1.ViewColumn.Eight);
        await vscode_1.window.showTextDocument(doc9, vscode_1.ViewColumn.Nine);
        await vscode_1.window.showTextDocument(doc10, vscode_1.ViewColumn.Beside);
        assert.ok(vscode_1.window.activeTextEditor);
        assert.ok(vscode_1.window.activeTextEditor.document === doc10);
        assert.equal(vscode_1.window.activeTextEditor.viewColumn, 10);
    });
    test('issue #27408 - showTextDocument & vscode.diff always default to ViewColumn.One', async () => {
        const [docA, docB, docC] = await Promise.all([
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile()),
            vscode_1.workspace.openTextDocument(await utils_1.createRandomFile())
        ]);
        await vscode_1.window.showTextDocument(docA, vscode_1.ViewColumn.One);
        await vscode_1.window.showTextDocument(docB, vscode_1.ViewColumn.Two);
        assert.ok(vscode_1.window.activeTextEditor);
        assert.ok(vscode_1.window.activeTextEditor.document === docB);
        assert.equal(vscode_1.window.activeTextEditor.viewColumn, vscode_1.ViewColumn.Two);
        await vscode_1.window.showTextDocument(docC, vscode_1.ViewColumn.Active);
        assert.ok(vscode_1.window.activeTextEditor.document === docC);
        assert.equal(vscode_1.window.activeTextEditor.viewColumn, vscode_1.ViewColumn.Two);
    });
    test('issue #5362 - Incorrect TextEditor passed by onDidChangeTextEditorSelection', (done) => {
        const file10Path = path_1.join(vscode_1.workspace.rootPath || '', './10linefile.ts');
        const file30Path = path_1.join(vscode_1.workspace.rootPath || '', './30linefile.ts');
        let finished = false;
        let failOncePlease = (err) => {
            if (finished) {
                return;
            }
            finished = true;
            done(err);
        };
        let passOncePlease = () => {
            if (finished) {
                return;
            }
            finished = true;
            done(null);
        };
        let subscription = vscode_1.window.onDidChangeTextEditorSelection((e) => {
            let lineCount = e.textEditor.document.lineCount;
            let pos1 = e.textEditor.selections[0].active.line;
            let pos2 = e.selections[0].active.line;
            if (pos1 !== pos2) {
                failOncePlease(new Error('received invalid selection changed event!'));
                return;
            }
            if (pos1 >= lineCount) {
                failOncePlease(new Error(`Cursor position (${pos1}) is not valid in the document ${e.textEditor.document.fileName} that has ${lineCount} lines.`));
                return;
            }
        });
        // Open 10 line file, show it in slot 1, set cursor to line 10
        // Open 30 line file, show it in slot 1, set cursor to line 30
        // Open 10 line file, show it in slot 1
        // Open 30 line file, show it in slot 1
        vscode_1.workspace.openTextDocument(file10Path).then((doc) => {
            return vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One);
        }).then((editor10line) => {
            editor10line.selection = new vscode_1.Selection(new vscode_1.Position(9, 0), new vscode_1.Position(9, 0));
        }).then(() => {
            return vscode_1.workspace.openTextDocument(file30Path);
        }).then((doc) => {
            return vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One);
        }).then((editor30line) => {
            editor30line.selection = new vscode_1.Selection(new vscode_1.Position(29, 0), new vscode_1.Position(29, 0));
        }).then(() => {
            return vscode_1.workspace.openTextDocument(file10Path);
        }).then((doc) => {
            return vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One);
        }).then(() => {
            return vscode_1.workspace.openTextDocument(file30Path);
        }).then((doc) => {
            return vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One);
        }).then(() => {
            subscription.dispose();
        }).then(passOncePlease, failOncePlease);
    });
    test('#7013 - input without options', function () {
        const source = new vscode_1.CancellationTokenSource();
        let p = vscode_1.window.showInputBox(undefined, source.token);
        assert.ok(typeof p === 'object');
        source.dispose();
    });
    test('showInputBox - undefined on cancel', async function () {
        const source = new vscode_1.CancellationTokenSource();
        const p = vscode_1.window.showInputBox(undefined, source.token);
        source.cancel();
        const value = await p;
        assert.equal(value, undefined);
    });
    test('showInputBox - cancel early', async function () {
        const source = new vscode_1.CancellationTokenSource();
        source.cancel();
        const p = vscode_1.window.showInputBox(undefined, source.token);
        const value = await p;
        assert.equal(value, undefined);
    });
    test('showInputBox - \'\' on Enter', function () {
        const p = vscode_1.window.showInputBox();
        return Promise.all([
            vscode_1.commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem'),
            p.then(value => assert.equal(value, ''))
        ]);
    });
    test('showInputBox - default value on Enter', function () {
        const p = vscode_1.window.showInputBox({ value: 'farboo' });
        return Promise.all([
            p.then(value => assert.equal(value, 'farboo')),
            vscode_1.commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem'),
        ]);
    });
    test('showInputBox - `undefined` on Esc', function () {
        const p = vscode_1.window.showInputBox();
        return Promise.all([
            vscode_1.commands.executeCommand('workbench.action.closeQuickOpen'),
            p.then(value => assert.equal(value, undefined))
        ]);
    });
    test('showInputBox - `undefined` on Esc (despite default)', function () {
        const p = vscode_1.window.showInputBox({ value: 'farboo' });
        return Promise.all([
            vscode_1.commands.executeCommand('workbench.action.closeQuickOpen'),
            p.then(value => assert.equal(value, undefined))
        ]);
    });
    test('showInputBox - value not empty on second try', async function () {
        const one = vscode_1.window.showInputBox({ value: 'notempty' });
        await vscode_1.commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
        assert.equal(await one, 'notempty');
        const two = vscode_1.window.showInputBox({ value: 'notempty' });
        await vscode_1.commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
        assert.equal(await two, 'notempty');
    });
    // TODO@chrmarti Disabled due to flaky behaviour (https://github.com/Microsoft/vscode/issues/70887)
    // test('showQuickPick, accept first', async function () {
    // 	const pick = window.showQuickPick(['eins', 'zwei', 'drei']);
    // 	await new Promise(resolve => setTimeout(resolve, 10)); // Allow UI to update.
    // 	await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
    // 	assert.equal(await pick, 'eins');
    // });
    test('showQuickPick, accept second', async function () {
        const resolves = [];
        let done;
        const unexpected = new Promise((resolve, reject) => {
            done = () => resolve();
            resolves.push(reject);
        });
        const first = new Promise(resolve => resolves.push(resolve));
        const pick = vscode_1.window.showQuickPick(['eins', 'zwei', 'drei'], {
            onDidSelectItem: item => resolves.pop()(item)
        });
        assert.equal(await first, 'eins');
        const second = new Promise(resolve => resolves.push(resolve));
        await vscode_1.commands.executeCommand('workbench.action.quickOpenSelectNext');
        assert.equal(await second, 'zwei');
        await vscode_1.commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
        assert.equal(await pick, 'zwei');
        done();
        return unexpected;
    });
    test('showQuickPick, select first two', async function () {
        const resolves = [];
        let done;
        const unexpected = new Promise((resolve, reject) => {
            done = () => resolve();
            resolves.push(reject);
        });
        const picks = vscode_1.window.showQuickPick(['eins', 'zwei', 'drei'], {
            onDidSelectItem: item => resolves.pop()(item),
            canPickMany: true
        });
        const first = new Promise(resolve => resolves.push(resolve));
        await new Promise(resolve => setTimeout(resolve, 10)); // Allow UI to update.
        await vscode_1.commands.executeCommand('workbench.action.quickOpenSelectNext');
        assert.equal(await first, 'eins');
        await vscode_1.commands.executeCommand('workbench.action.quickPickManyToggle');
        const second = new Promise(resolve => resolves.push(resolve));
        await vscode_1.commands.executeCommand('workbench.action.quickOpenSelectNext');
        assert.equal(await second, 'zwei');
        await vscode_1.commands.executeCommand('workbench.action.quickPickManyToggle');
        await vscode_1.commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
        assert.deepStrictEqual(await picks, ['eins', 'zwei']);
        done();
        return unexpected;
    });
    // TODO@chrmarti Disabled due to flaky behaviour (https://github.com/Microsoft/vscode/issues/70887)
    // test('showQuickPick, keep selection (Microsoft/vscode-azure-account#67)', async function () {
    // 	const picks = window.showQuickPick([
    // 		{ label: 'eins' },
    // 		{ label: 'zwei', picked: true },
    // 		{ label: 'drei', picked: true }
    // 	], {
    // 			canPickMany: true
    // 		});
    // 	await new Promise(resolve => setTimeout(resolve, 10)); // Allow UI to update.
    // 	await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
    // 	assert.deepStrictEqual((await picks)!.map(pick => pick.label), ['zwei', 'drei']);
    // });
    test('showQuickPick, undefined on cancel', function () {
        const source = new vscode_1.CancellationTokenSource();
        const p = vscode_1.window.showQuickPick(['eins', 'zwei', 'drei'], undefined, source.token);
        source.cancel();
        return p.then(value => {
            assert.equal(value, undefined);
        });
    });
    test('showQuickPick, cancel early', function () {
        const source = new vscode_1.CancellationTokenSource();
        source.cancel();
        const p = vscode_1.window.showQuickPick(['eins', 'zwei', 'drei'], undefined, source.token);
        return p.then(value => {
            assert.equal(value, undefined);
        });
    });
    test('showQuickPick, canceled by another picker', function () {
        const source = new vscode_1.CancellationTokenSource();
        const result = vscode_1.window.showQuickPick(['eins', 'zwei', 'drei'], { ignoreFocusOut: true }).then(result => {
            source.cancel();
            assert.equal(result, undefined);
        });
        vscode_1.window.showQuickPick(['eins', 'zwei', 'drei'], undefined, source.token);
        return result;
    });
    test('showQuickPick, canceled by input', function () {
        const result = vscode_1.window.showQuickPick(['eins', 'zwei', 'drei'], { ignoreFocusOut: true }).then(result => {
            assert.equal(result, undefined);
        });
        const source = new vscode_1.CancellationTokenSource();
        vscode_1.window.showInputBox(undefined, source.token);
        source.cancel();
        return result;
    });
    test('showQuickPick, native promise - #11754', async function () {
        const data = new Promise(resolve => {
            resolve(['a', 'b', 'c']);
        });
        const source = new vscode_1.CancellationTokenSource();
        const result = vscode_1.window.showQuickPick(data, undefined, source.token);
        source.cancel();
        const value_1 = await result;
        assert.equal(value_1, undefined);
    });
    test('showQuickPick, never resolve promise and cancel - #22453', function () {
        const result = vscode_1.window.showQuickPick(new Promise(_resolve => { }));
        const a = result.then(value => {
            assert.equal(value, undefined);
        });
        const b = vscode_1.commands.executeCommand('workbench.action.closeQuickOpen');
        return Promise.all([a, b]);
    });
    // TODO@chrmarti Disabled due to flaky behaviour (https://github.com/Microsoft/vscode/issues/70887)
    // test('showWorkspaceFolderPick', async function () {
    // 	const p = window.showWorkspaceFolderPick(undefined);
    // 	await timeout(10);
    // 	await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
    // 	try {
    // 		await p;
    // 		assert.ok(true);
    // 	}
    // 	catch (_error) {
    // 		assert.ok(false);
    // 	}
    // });
    test('Default value for showInput Box not accepted when it fails validateInput, reversing #33691', async function () {
        const result = vscode_1.window.showInputBox({
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Cannot set empty description';
                }
                return null;
            }
        });
        await vscode_1.commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
        await vscode_1.commands.executeCommand('workbench.action.closeQuickOpen');
        assert.equal(await result, undefined);
    });
    test('editor, selection change kind', () => {
        return vscode_1.workspace.openTextDocument(path_1.join(vscode_1.workspace.rootPath || '', './far.js')).then(doc => vscode_1.window.showTextDocument(doc)).then(editor => {
            return new Promise((resolve, _reject) => {
                let subscription = vscode_1.window.onDidChangeTextEditorSelection(e => {
                    assert.ok(e.textEditor === editor);
                    assert.equal(e.kind, vscode_1.TextEditorSelectionChangeKind.Command);
                    subscription.dispose();
                    resolve();
                });
                editor.selection = new vscode_1.Selection(editor.selection.anchor, editor.selection.active.translate(2));
            });
        });
    });
});
//# sourceMappingURL=window.test.js.map