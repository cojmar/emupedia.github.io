"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode_1 = require("vscode");
suite('workspace-namespace', () => {
    suite('Tasks', () => {
        let disposables = [];
        teardown(() => {
            disposables.forEach(d => d.dispose());
            disposables.length = 0;
        });
        test('CustomExecution task should start and shutdown successfully', (done) => {
            const taskType = 'customTesting';
            const taskName = 'First custom task';
            let isPseudoterminalClosed = false;
            disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                disposables.push(vscode_1.window.onDidWriteTerminalData(e => {
                    try {
                        assert.equal(e.data, 'testing\r\n');
                    }
                    catch (e) {
                        done(e);
                    }
                    disposables.push(vscode_1.window.onDidCloseTerminal(() => {
                        try {
                            // Pseudoterminal.close should have fired by now, additionally we want
                            // to make sure all events are flushed before continuing with more tests
                            assert.ok(isPseudoterminalClosed);
                        }
                        catch (e) {
                            done(e);
                            return;
                        }
                        done();
                    }));
                    term.dispose();
                }));
            }));
            disposables.push(vscode_1.tasks.registerTaskProvider(taskType, {
                provideTasks: () => {
                    const result = [];
                    const kind = {
                        type: taskType,
                        customProp1: 'testing task one'
                    };
                    const writeEmitter = new vscode_1.EventEmitter();
                    const execution = new vscode_1.CustomExecution(() => {
                        const pty = {
                            onDidWrite: writeEmitter.event,
                            open: () => writeEmitter.fire('testing\r\n'),
                            close: () => isPseudoterminalClosed = true
                        };
                        return Promise.resolve(pty);
                    });
                    const task = new vscode_1.Task2(kind, vscode_1.TaskScope.Workspace, taskName, taskType, execution);
                    result.push(task);
                    return result;
                },
                resolveTask(_task) {
                    try {
                        assert.fail('resolveTask should not trigger during the test');
                    }
                    catch (e) {
                        done(e);
                    }
                    return undefined;
                }
            }));
            vscode_1.commands.executeCommand('workbench.action.tasks.runTask', `${taskType}: ${taskName}`);
        });
    });
});
//# sourceMappingURL=workspace.tasks.test.js.map