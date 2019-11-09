"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const assert_1 = require("assert");
suite('window namespace tests', () => {
    suiteSetup(async () => {
        // Disable conpty in integration tests because of https://github.com/microsoft/vscode/issues/76548
        await vscode_1.workspace.getConfiguration('terminal.integrated').update('windowsEnableConpty', false, vscode_1.ConfigurationTarget.Global);
    });
    suite('Terminal', () => {
        let disposables = [];
        teardown(() => {
            disposables.forEach(d => d.dispose());
            disposables.length = 0;
        });
        test('sendText immediately after createTerminal should not throw', (done) => {
            disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                try {
                    assert_1.equal(terminal, term);
                }
                catch (e) {
                    done(e);
                }
                terminal.dispose();
                disposables.push(vscode_1.window.onDidCloseTerminal(() => done()));
            }));
            const terminal = vscode_1.window.createTerminal();
            assert_1.doesNotThrow(terminal.sendText.bind(terminal, 'echo "foo"'));
        });
        test('onDidCloseTerminal event fires when terminal is disposed', (done) => {
            disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                try {
                    assert_1.equal(terminal, term);
                }
                catch (e) {
                    done(e);
                }
                terminal.dispose();
                disposables.push(vscode_1.window.onDidCloseTerminal(() => done()));
            }));
            const terminal = vscode_1.window.createTerminal();
        });
        test('processId immediately after createTerminal should fetch the pid', (done) => {
            disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                try {
                    assert_1.equal(terminal, term);
                }
                catch (e) {
                    done(e);
                }
                terminal.processId.then(id => {
                    try {
                        assert_1.ok(id > 0);
                    }
                    catch (e) {
                        done(e);
                    }
                    terminal.dispose();
                    disposables.push(vscode_1.window.onDidCloseTerminal(() => done()));
                });
            }));
            const terminal = vscode_1.window.createTerminal();
        });
        test('name in constructor should set terminal.name', (done) => {
            disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                try {
                    assert_1.equal(terminal, term);
                }
                catch (e) {
                    done(e);
                }
                terminal.dispose();
                disposables.push(vscode_1.window.onDidCloseTerminal(() => done()));
            }));
            const terminal = vscode_1.window.createTerminal('a');
            try {
                assert_1.equal(terminal.name, 'a');
            }
            catch (e) {
                done(e);
            }
        });
        test('creationOptions should be set and readonly for TerminalOptions terminals', (done) => {
            disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                try {
                    assert_1.equal(terminal, term);
                }
                catch (e) {
                    done(e);
                }
                terminal.dispose();
                disposables.push(vscode_1.window.onDidCloseTerminal(() => done()));
            }));
            const options = {
                name: 'foo',
                hideFromUser: true
            };
            const terminal = vscode_1.window.createTerminal(options);
            try {
                assert_1.equal(terminal.name, 'foo');
                assert_1.deepEqual(terminal.creationOptions, options);
                assert_1.throws(() => terminal.creationOptions.name = 'bad', 'creationOptions should be readonly at runtime');
            }
            catch (e) {
                done(e);
            }
        });
        test('onDidOpenTerminal should fire when a terminal is created', (done) => {
            disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                try {
                    assert_1.equal(term.name, 'b');
                }
                catch (e) {
                    done(e);
                }
                disposables.push(vscode_1.window.onDidCloseTerminal(() => done()));
                terminal.dispose();
            }));
            const terminal = vscode_1.window.createTerminal('b');
        });
        test('exitStatus.code should be set to undefined after a terminal is disposed', (done) => {
            disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                try {
                    assert_1.equal(term, terminal);
                }
                catch (e) {
                    done(e);
                }
                disposables.push(vscode_1.window.onDidCloseTerminal(t => {
                    try {
                        assert_1.deepEqual(t.exitStatus, { code: undefined });
                    }
                    catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }));
                terminal.dispose();
            }));
            const terminal = vscode_1.window.createTerminal();
        });
        // test('onDidChangeActiveTerminal should fire when new terminals are created', (done) => {
        // 	const reg1 = window.onDidChangeActiveTerminal((active: Terminal | undefined) => {
        // 		equal(active, terminal);
        // 		equal(active, window.activeTerminal);
        // 		reg1.dispose();
        // 		const reg2 = window.onDidChangeActiveTerminal((active: Terminal | undefined) => {
        // 			equal(active, undefined);
        // 			equal(active, window.activeTerminal);
        // 			reg2.dispose();
        // 			done();
        // 		});
        // 		terminal.dispose();
        // 	});
        // 	const terminal = window.createTerminal();
        // 	terminal.show();
        // });
        // test('onDidChangeTerminalDimensions should fire when new terminals are created', (done) => {
        // 	const reg1 = window.onDidChangeTerminalDimensions(async (event: TerminalDimensionsChangeEvent) => {
        // 		equal(event.terminal, terminal1);
        // 		equal(typeof event.dimensions.columns, 'number');
        // 		equal(typeof event.dimensions.rows, 'number');
        // 		ok(event.dimensions.columns > 0);
        // 		ok(event.dimensions.rows > 0);
        // 		reg1.dispose();
        // 		let terminal2: Terminal;
        // 		const reg2 = window.onDidOpenTerminal((newTerminal) => {
        // 			// This is guarantees to fire before dimensions change event
        // 			if (newTerminal !== terminal1) {
        // 				terminal2 = newTerminal;
        // 				reg2.dispose();
        // 			}
        // 		});
        // 		let firstCalled = false;
        // 		let secondCalled = false;
        // 		const reg3 = window.onDidChangeTerminalDimensions((event: TerminalDimensionsChangeEvent) => {
        // 			if (event.terminal === terminal1) {
        // 				// The original terminal should fire dimension change after a split
        // 				firstCalled = true;
        // 			} else if (event.terminal !== terminal1) {
        // 				// The new split terminal should fire dimension change
        // 				secondCalled = true;
        // 			}
        // 			if (firstCalled && secondCalled) {
        // 				let firstDisposed = false;
        // 				let secondDisposed = false;
        // 				const reg4 = window.onDidCloseTerminal(term => {
        // 					if (term === terminal1) {
        // 						firstDisposed = true;
        // 					}
        // 					if (term === terminal2) {
        // 						secondDisposed = true;
        // 					}
        // 					if (firstDisposed && secondDisposed) {
        // 						reg4.dispose();
        // 						done();
        // 					}
        // 				});
        // 				terminal1.dispose();
        // 				terminal2.dispose();
        // 				reg3.dispose();
        // 			}
        // 		});
        // 		await timeout(500);
        // 		commands.executeCommand('workbench.action.terminal.split');
        // 	});
        // 	const terminal1 = window.createTerminal({ name: 'test' });
        // 	terminal1.show();
        // });
        suite('hideFromUser', () => {
            test('should be available to terminals API', done => {
                const terminal = vscode_1.window.createTerminal({ name: 'bg', hideFromUser: true });
                disposables.push(vscode_1.window.onDidOpenTerminal(t => {
                    try {
                        assert_1.equal(t, terminal);
                        assert_1.equal(t.name, 'bg');
                        assert_1.ok(vscode_1.window.terminals.indexOf(terminal) !== -1);
                    }
                    catch (e) {
                        done(e);
                    }
                    disposables.push(vscode_1.window.onDidCloseTerminal(() => {
                        // reg3.dispose();
                        done();
                    }));
                    terminal.dispose();
                }));
            });
        });
        suite('window.onDidWriteTerminalData', () => {
            test('should listen to all future terminal data events', (done) => {
                const openEvents = [];
                const dataEvents = [];
                const closeEvents = [];
                disposables.push(vscode_1.window.onDidOpenTerminal(e => openEvents.push(e.name)));
                let resolveOnceDataWritten;
                let resolveOnceClosed;
                disposables.push(vscode_1.window.onDidWriteTerminalData(e => {
                    dataEvents.push({ name: e.terminal.name, data: e.data });
                    resolveOnceDataWritten();
                }));
                disposables.push(vscode_1.window.onDidCloseTerminal(e => {
                    closeEvents.push(e.name);
                    try {
                        if (closeEvents.length === 1) {
                            assert_1.deepEqual(openEvents, ['test1']);
                            assert_1.deepEqual(dataEvents, [{ name: 'test1', data: 'write1' }]);
                            assert_1.deepEqual(closeEvents, ['test1']);
                        }
                        else if (closeEvents.length === 2) {
                            assert_1.deepEqual(openEvents, ['test1', 'test2']);
                            assert_1.deepEqual(dataEvents, [{ name: 'test1', data: 'write1' }, { name: 'test2', data: 'write2' }]);
                            assert_1.deepEqual(closeEvents, ['test1', 'test2']);
                        }
                        resolveOnceClosed();
                    }
                    catch (e) {
                        done(e);
                    }
                }));
                const term1Write = new vscode_1.EventEmitter();
                const term1Close = new vscode_1.EventEmitter();
                vscode_1.window.createTerminal({
                    name: 'test1', pty: {
                        onDidWrite: term1Write.event,
                        onDidClose: term1Close.event,
                        open: async () => {
                            term1Write.fire('write1');
                            // Wait until the data is written
                            await new Promise(resolve => { resolveOnceDataWritten = resolve; });
                            term1Close.fire();
                            // Wait until the terminal is closed
                            await new Promise(resolve => { resolveOnceClosed = resolve; });
                            const term2Write = new vscode_1.EventEmitter();
                            const term2Close = new vscode_1.EventEmitter();
                            vscode_1.window.createTerminal({
                                name: 'test2', pty: {
                                    onDidWrite: term2Write.event,
                                    onDidClose: term2Close.event,
                                    open: async () => {
                                        term2Write.fire('write2');
                                        // Wait until the data is written
                                        await new Promise(resolve => { resolveOnceDataWritten = resolve; });
                                        term2Close.fire();
                                        // Wait until the terminal is closed
                                        await new Promise(resolve => { resolveOnceClosed = resolve; });
                                        done();
                                    },
                                    close: () => { }
                                }
                            });
                        },
                        close: () => { }
                    }
                });
            });
        });
        suite('Extension pty terminals', () => {
            test('should fire onDidOpenTerminal and onDidCloseTerminal', (done) => {
                disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                    try {
                        assert_1.equal(term.name, 'c');
                    }
                    catch (e) {
                        done(e);
                    }
                    disposables.push(vscode_1.window.onDidCloseTerminal(() => done()));
                    term.dispose();
                }));
                const pty = {
                    onDidWrite: new vscode_1.EventEmitter().event,
                    open: () => { },
                    close: () => { }
                };
                vscode_1.window.createTerminal({ name: 'c', pty });
            });
            // The below tests depend on global UI state and each other
            // test('should not provide dimensions on start as the terminal has not been shown yet', (done) => {
            // 	const reg1 = window.onDidOpenTerminal(term => {
            // 		equal(terminal, term);
            // 		reg1.dispose();
            // 	});
            // 	const pty: Pseudoterminal = {
            // 		onDidWrite: new EventEmitter<string>().event,
            // 		open: (dimensions) => {
            // 			equal(dimensions, undefined);
            // 			const reg3 = window.onDidCloseTerminal(() => {
            // 				reg3.dispose();
            // 				done();
            // 			});
            // 			// Show a terminal and wait a brief period before dispose, this will cause
            // 			// the panel to init it's dimenisons and be provided to following terminals.
            // 			// The following test depends on this.
            // 			terminal.show();
            // 			setTimeout(() => terminal.dispose(), 200);
            // 		},
            // 		close: () => {}
            // 	};
            // 	const terminal = window.createTerminal({ name: 'foo', pty });
            // });
            // test('should provide dimensions on start as the terminal has been shown', (done) => {
            // 	const reg1 = window.onDidOpenTerminal(term => {
            // 		equal(terminal, term);
            // 		reg1.dispose();
            // 	});
            // 	const pty: Pseudoterminal = {
            // 		onDidWrite: new EventEmitter<string>().event,
            // 		open: (dimensions) => {
            // 			// This test depends on Terminal.show being called some time before such
            // 			// that the panel dimensions are initialized and cached.
            // 			ok(dimensions!.columns > 0);
            // 			ok(dimensions!.rows > 0);
            // 			const reg3 = window.onDidCloseTerminal(() => {
            // 				reg3.dispose();
            // 				done();
            // 			});
            // 			terminal.dispose();
            // 		},
            // 		close: () => {}
            // 	};
            // 	const terminal = window.createTerminal({ name: 'foo', pty });
            // });
            test('should respect dimension overrides', (done) => {
                disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                    try {
                        assert_1.equal(terminal, term);
                    }
                    catch (e) {
                        done(e);
                    }
                    term.show();
                    disposables.push(vscode_1.window.onDidChangeTerminalDimensions(e => {
                        if (e.dimensions.columns === 0 || e.dimensions.rows === 0) {
                            // HACK: Ignore the event if dimension(s) are zero (#83778)
                            return;
                        }
                        try {
                            assert_1.equal(e.dimensions.columns, 10);
                            assert_1.equal(e.dimensions.rows, 5);
                            assert_1.equal(e.terminal, terminal);
                        }
                        catch (e) {
                            done(e);
                        }
                        disposables.push(vscode_1.window.onDidCloseTerminal(() => done()));
                        terminal.dispose();
                    }));
                }));
                const writeEmitter = new vscode_1.EventEmitter();
                const overrideDimensionsEmitter = new vscode_1.EventEmitter();
                const pty = {
                    onDidWrite: writeEmitter.event,
                    onDidOverrideDimensions: overrideDimensionsEmitter.event,
                    open: () => overrideDimensionsEmitter.fire({ columns: 10, rows: 5 }),
                    close: () => { }
                };
                const terminal = vscode_1.window.createTerminal({ name: 'foo', pty });
            });
            test('exitStatus.code should be set to the exit code (undefined)', (done) => {
                disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                    try {
                        assert_1.equal(terminal, term);
                        assert_1.equal(terminal.exitStatus, undefined);
                    }
                    catch (e) {
                        done(e);
                    }
                    disposables.push(vscode_1.window.onDidCloseTerminal(t => {
                        try {
                            assert_1.equal(terminal, t);
                            assert_1.deepEqual(terminal.exitStatus, { code: undefined });
                        }
                        catch (e) {
                            done(e);
                            return;
                        }
                        done();
                    }));
                }));
                const writeEmitter = new vscode_1.EventEmitter();
                const closeEmitter = new vscode_1.EventEmitter();
                const pty = {
                    onDidWrite: writeEmitter.event,
                    onDidClose: closeEmitter.event,
                    open: () => closeEmitter.fire(),
                    close: () => { }
                };
                const terminal = vscode_1.window.createTerminal({ name: 'foo', pty });
            });
            test('exitStatus.code should be set to the exit code (zero)', (done) => {
                disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                    try {
                        assert_1.equal(terminal, term);
                        assert_1.equal(terminal.exitStatus, undefined);
                    }
                    catch (e) {
                        done(e);
                    }
                    disposables.push(vscode_1.window.onDidCloseTerminal(t => {
                        try {
                            assert_1.equal(terminal, t);
                            assert_1.deepEqual(terminal.exitStatus, { code: 0 });
                        }
                        catch (e) {
                            done(e);
                            return;
                        }
                        done();
                    }));
                }));
                const writeEmitter = new vscode_1.EventEmitter();
                const closeEmitter = new vscode_1.EventEmitter();
                const pty = {
                    onDidWrite: writeEmitter.event,
                    onDidClose: closeEmitter.event,
                    open: () => closeEmitter.fire(0),
                    close: () => { }
                };
                const terminal = vscode_1.window.createTerminal({ name: 'foo', pty });
            });
            test('exitStatus.code should be set to the exit code (non-zero)', (done) => {
                disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                    try {
                        assert_1.equal(terminal, term);
                        assert_1.equal(terminal.exitStatus, undefined);
                    }
                    catch (e) {
                        done(e);
                    }
                    disposables.push(vscode_1.window.onDidCloseTerminal(t => {
                        try {
                            assert_1.equal(terminal, t);
                            assert_1.deepEqual(terminal.exitStatus, { code: 22 });
                        }
                        catch (e) {
                            done(e);
                            return;
                        }
                        done();
                    }));
                }));
                const writeEmitter = new vscode_1.EventEmitter();
                const closeEmitter = new vscode_1.EventEmitter();
                const pty = {
                    onDidWrite: writeEmitter.event,
                    onDidClose: closeEmitter.event,
                    open: () => closeEmitter.fire(22),
                    close: () => { }
                };
                const terminal = vscode_1.window.createTerminal({ name: 'foo', pty });
            });
            test('creationOptions should be set and readonly for ExtensionTerminalOptions terminals', (done) => {
                disposables.push(vscode_1.window.onDidOpenTerminal(term => {
                    try {
                        assert_1.equal(terminal, term);
                    }
                    catch (e) {
                        done(e);
                    }
                    terminal.dispose();
                    disposables.push(vscode_1.window.onDidCloseTerminal(() => done()));
                }));
                const writeEmitter = new vscode_1.EventEmitter();
                const pty = {
                    onDidWrite: writeEmitter.event,
                    open: () => { },
                    close: () => { }
                };
                const options = { name: 'foo', pty };
                const terminal = vscode_1.window.createTerminal(options);
                try {
                    assert_1.equal(terminal.name, 'foo');
                    assert_1.deepEqual(terminal.creationOptions, options);
                    assert_1.throws(() => terminal.creationOptions.name = 'bad', 'creationOptions should be readonly at runtime');
                }
                catch (e) {
                    done(e);
                }
            });
        });
    });
});
//# sourceMappingURL=terminal.test.js.map