"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode_1 = require("vscode");
const utils_1 = require("../utils");
suite('editor tests', () => {
    teardown(utils_1.closeAllEditors);
    function withRandomFileEditor(initialContents, run) {
        return utils_1.createRandomFile(initialContents).then(file => {
            return vscode_1.workspace.openTextDocument(file).then(doc => {
                return vscode_1.window.showTextDocument(doc).then((editor) => {
                    return run(editor, doc).then(_ => {
                        if (doc.isDirty) {
                            return doc.save().then(saved => {
                                assert.ok(saved);
                                assert.ok(!doc.isDirty);
                                return utils_1.deleteFile(file);
                            });
                        }
                        else {
                            return utils_1.deleteFile(file);
                        }
                    });
                });
            });
        });
    }
    test('insert snippet', () => {
        const snippetString = new vscode_1.SnippetString()
            .appendText('This is a ')
            .appendTabstop()
            .appendPlaceholder('placeholder')
            .appendText(' snippet');
        return withRandomFileEditor('', (editor, doc) => {
            return editor.insertSnippet(snippetString).then(inserted => {
                assert.ok(inserted);
                assert.equal(doc.getText(), 'This is a placeholder snippet');
                assert.ok(doc.isDirty);
            });
        });
    });
    test('insert snippet with replacement, editor selection', () => {
        const snippetString = new vscode_1.SnippetString()
            .appendText('has been');
        return withRandomFileEditor('This will be replaced', (editor, doc) => {
            editor.selection = new vscode_1.Selection(new vscode_1.Position(0, 5), new vscode_1.Position(0, 12));
            return editor.insertSnippet(snippetString).then(inserted => {
                assert.ok(inserted);
                assert.equal(doc.getText(), 'This has been replaced');
                assert.ok(doc.isDirty);
            });
        });
    });
    test('insert snippet with replacement, selection as argument', () => {
        const snippetString = new vscode_1.SnippetString()
            .appendText('has been');
        return withRandomFileEditor('This will be replaced', (editor, doc) => {
            const selection = new vscode_1.Selection(new vscode_1.Position(0, 5), new vscode_1.Position(0, 12));
            return editor.insertSnippet(snippetString, selection).then(inserted => {
                assert.ok(inserted);
                assert.equal(doc.getText(), 'This has been replaced');
                assert.ok(doc.isDirty);
            });
        });
    });
    test('make edit', () => {
        return withRandomFileEditor('', (editor, doc) => {
            return editor.edit((builder) => {
                builder.insert(new vscode_1.Position(0, 0), 'Hello World');
            }).then(applied => {
                assert.ok(applied);
                assert.equal(doc.getText(), 'Hello World');
                assert.ok(doc.isDirty);
            });
        });
    });
    test('issue #6281: Edits fail to validate ranges correctly before applying', () => {
        return withRandomFileEditor('Hello world!', (editor, doc) => {
            return editor.edit((builder) => {
                builder.replace(new vscode_1.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE), 'new');
            }).then(applied => {
                assert.ok(applied);
                assert.equal(doc.getText(), 'new');
                assert.ok(doc.isDirty);
            });
        });
    });
    function executeReplace(editor, range, text, undoStopBefore, undoStopAfter) {
        return editor.edit((builder) => {
            builder.replace(range, text);
        }, { undoStopBefore: undoStopBefore, undoStopAfter: undoStopAfter });
    }
    test('TextEditor.edit can control undo/redo stack 1', () => {
        return withRandomFileEditor('Hello world!', (editor, doc) => {
            return executeReplace(editor, new vscode_1.Range(0, 0, 0, 1), 'h', false, false).then(applied => {
                assert.ok(applied);
                assert.equal(doc.getText(), 'hello world!');
                assert.ok(doc.isDirty);
                return executeReplace(editor, new vscode_1.Range(0, 1, 0, 5), 'ELLO', false, false);
            }).then(applied => {
                assert.ok(applied);
                assert.equal(doc.getText(), 'hELLO world!');
                assert.ok(doc.isDirty);
                return vscode_1.commands.executeCommand('undo');
            }).then(_ => {
                assert.equal(doc.getText(), 'Hello world!');
            });
        });
    });
    test('TextEditor.edit can control undo/redo stack 2', () => {
        return withRandomFileEditor('Hello world!', (editor, doc) => {
            return executeReplace(editor, new vscode_1.Range(0, 0, 0, 1), 'h', false, false).then(applied => {
                assert.ok(applied);
                assert.equal(doc.getText(), 'hello world!');
                assert.ok(doc.isDirty);
                return executeReplace(editor, new vscode_1.Range(0, 1, 0, 5), 'ELLO', true, false);
            }).then(applied => {
                assert.ok(applied);
                assert.equal(doc.getText(), 'hELLO world!');
                assert.ok(doc.isDirty);
                return vscode_1.commands.executeCommand('undo');
            }).then(_ => {
                assert.equal(doc.getText(), 'hello world!');
            });
        });
    });
    test('issue #16573: Extension API: insertSpaces and tabSize are undefined', () => {
        return withRandomFileEditor('Hello world!\n\tHello world!', (editor, _doc) => {
            assert.equal(editor.options.tabSize, 4);
            assert.equal(editor.options.insertSpaces, false);
            assert.equal(editor.options.cursorStyle, vscode_1.TextEditorCursorStyle.Line);
            assert.equal(editor.options.lineNumbers, vscode_1.TextEditorLineNumbersStyle.On);
            editor.options = {
                tabSize: 2
            };
            assert.equal(editor.options.tabSize, 2);
            assert.equal(editor.options.insertSpaces, false);
            assert.equal(editor.options.cursorStyle, vscode_1.TextEditorCursorStyle.Line);
            assert.equal(editor.options.lineNumbers, vscode_1.TextEditorLineNumbersStyle.On);
            editor.options.tabSize = 'invalid';
            assert.equal(editor.options.tabSize, 2);
            assert.equal(editor.options.insertSpaces, false);
            assert.equal(editor.options.cursorStyle, vscode_1.TextEditorCursorStyle.Line);
            assert.equal(editor.options.lineNumbers, vscode_1.TextEditorLineNumbersStyle.On);
            return Promise.resolve();
        });
    });
    test('issue #20757: Overlapping ranges are not allowed!', () => {
        return withRandomFileEditor('Hello world!\n\tHello world!', (editor, _doc) => {
            return editor.edit((builder) => {
                // create two edits that overlap (i.e. are illegal)
                builder.replace(new vscode_1.Range(0, 0, 0, 2), 'He');
                builder.replace(new vscode_1.Range(0, 1, 0, 3), 'el');
            }).then((_applied) => {
                assert.ok(false, 'edit with overlapping ranges should fail');
            }, (_err) => {
                assert.ok(true, 'edit with overlapping ranges should fail');
            });
        });
    });
    test('throw when using invalid edit', async function () {
        await withRandomFileEditor('foo', editor => {
            return new Promise((resolve, reject) => {
                editor.edit(edit => {
                    edit.insert(new vscode_1.Position(0, 0), 'bar');
                    setTimeout(() => {
                        try {
                            edit.insert(new vscode_1.Position(0, 0), 'bar');
                            reject(new Error('expected error'));
                        }
                        catch (err) {
                            assert.ok(true);
                            resolve();
                        }
                    }, 0);
                });
            });
        });
    });
    test('editor contents are correctly read (small file)', function () {
        return testEditorContents('/far.js');
    });
    test('editor contents are correctly read (large file)', async function () {
        return testEditorContents('/lorem.txt');
    });
    async function testEditorContents(relativePath) {
        const root = vscode_1.workspace.workspaceFolders[0].uri;
        const file = vscode_1.Uri.parse(root.toString() + relativePath);
        const document = await vscode_1.workspace.openTextDocument(file);
        assert.equal(document.getText(), Buffer.from(await vscode_1.workspace.fs.readFile(file)).toString());
    }
});
//# sourceMappingURL=editor.test.js.map