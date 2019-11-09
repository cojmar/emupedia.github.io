"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const cp = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const net = require("net");
const download_1 = require("./download");
const processes_1 = require("./util/processes");
let extHostProcess;
let outputChannel;
function activate(context) {
    function doResolve(_authority, progress) {
        const serverPromise = new Promise(async (res, rej) => {
            progress.report({ message: 'Starting Test Resolver' });
            outputChannel = vscode.window.createOutputChannel('TestResolver');
            let isResolved = false;
            async function processError(message) {
                outputChannel.appendLine(message);
                if (!isResolved) {
                    isResolved = true;
                    outputChannel.show();
                    const result = await vscode.window.showErrorMessage(message, { modal: true }, ...getActions());
                    if (result) {
                        await result.execute();
                    }
                    rej(vscode.RemoteAuthorityResolverError.NotAvailable(message, true));
                }
            }
            let lastProgressLine = '';
            function processOutput(output) {
                outputChannel.append(output);
                for (let i = 0; i < output.length; i++) {
                    const chr = output.charCodeAt(i);
                    if (chr === 10 /* LineFeed */) {
                        const match = lastProgressLine.match(/Extension host agent listening on (\d+)/);
                        if (match) {
                            isResolved = true;
                            res(new vscode.ResolvedAuthority('localhost', parseInt(match[1], 10))); // success!
                        }
                        lastProgressLine = '';
                    }
                    else if (chr === 8 /* Backspace */) {
                        lastProgressLine = lastProgressLine.substr(0, lastProgressLine.length - 1);
                    }
                    else {
                        lastProgressLine += output.charAt(i);
                    }
                }
            }
            const delay = getConfiguration('startupDelay');
            if (typeof delay === 'number') {
                let remaining = Math.ceil(delay);
                outputChannel.append(`Delaying startup by ${remaining} seconds (configured by "testresolver.startupDelay").`);
                while (remaining > 0) {
                    progress.report({ message: `Delayed resolving: Remaining ${remaining}s` });
                    await (sleep(1000));
                    remaining--;
                }
            }
            if (getConfiguration('startupError') === true) {
                processError('Test Resolver failed for testing purposes (configured by "testresolver.startupError").');
                return;
            }
            const { updateUrl, commit, quality, serverDataFolderName, dataFolderName } = getProductConfiguration();
            const commandArgs = ['--port=0', '--disable-telemetry'];
            const env = getNewEnv();
            const remoteDataDir = process.env['TESTRESOLVER_DATA_FOLDER'] || path.join(os.homedir(), serverDataFolderName || `${dataFolderName}-testresolver`);
            env['VSCODE_AGENT_FOLDER'] = remoteDataDir;
            outputChannel.appendLine(`Using data folder at ${remoteDataDir}`);
            if (!commit) { // dev mode
                const serverCommand = process.platform === 'win32' ? 'server.bat' : 'server.sh';
                const vscodePath = path.resolve(path.join(context.extensionPath, '..', '..'));
                const serverCommandPath = path.join(vscodePath, 'resources', 'server', 'bin-dev', serverCommand);
                extHostProcess = cp.spawn(serverCommandPath, commandArgs, { env, cwd: vscodePath });
            }
            else {
                const serverCommand = process.platform === 'win32' ? 'server.cmd' : 'server.sh';
                let serverLocation = env['VSCODE_REMOTE_SERVER_PATH']; // support environment variable to specify location of server on disk
                if (!serverLocation) {
                    const serverBin = path.join(remoteDataDir, 'bin');
                    progress.report({ message: 'Installing VSCode Server' });
                    serverLocation = await download_1.downloadAndUnzipVSCodeServer(updateUrl, commit, quality, serverBin);
                }
                outputChannel.appendLine(`Using server build at ${serverLocation}`);
                extHostProcess = cp.spawn(path.join(serverLocation, serverCommand), commandArgs, { env, cwd: serverLocation });
            }
            extHostProcess.stdout.on('data', (data) => processOutput(data.toString()));
            extHostProcess.stderr.on('data', (data) => processOutput(data.toString()));
            extHostProcess.on('error', (error) => {
                processError(`server failed with error:\n${error.message}`);
                extHostProcess = undefined;
            });
            extHostProcess.on('close', (code) => {
                processError(`server closed unexpectedly.\nError code: ${code}`);
                extHostProcess = undefined;
            });
            context.subscriptions.push({
                dispose: () => {
                    if (extHostProcess) {
                        processes_1.terminateProcess(extHostProcess, context.extensionPath);
                    }
                }
            });
        });
        return serverPromise.then(serverAddr => {
            return new Promise(async (res, _rej) => {
                const proxyServer = net.createServer(proxySocket => {
                    outputChannel.appendLine(`Proxy connection accepted`);
                    let remoteReady = true, localReady = true;
                    const remoteSocket = net.createConnection({ port: serverAddr.port });
                    let isDisconnected = getConfiguration('pause') === true;
                    vscode.workspace.onDidChangeConfiguration(_ => {
                        let newIsDisconnected = getConfiguration('pause') === true;
                        if (isDisconnected !== newIsDisconnected) {
                            outputChannel.appendLine(`Connection state: ${newIsDisconnected ? 'open' : 'paused'}`);
                            isDisconnected = newIsDisconnected;
                            if (!isDisconnected) {
                                outputChannel.appendLine(`Resume remote and proxy sockets.`);
                                if (remoteSocket.isPaused() && localReady) {
                                    remoteSocket.resume();
                                }
                                if (proxySocket.isPaused() && remoteReady) {
                                    proxySocket.resume();
                                }
                            }
                            else {
                                outputChannel.appendLine(`Pausing remote and proxy sockets.`);
                                if (!remoteSocket.isPaused()) {
                                    remoteSocket.pause();
                                }
                                if (!proxySocket.isPaused()) {
                                    proxySocket.pause();
                                }
                            }
                        }
                    });
                    proxySocket.on('data', (data) => {
                        remoteReady = remoteSocket.write(data);
                        if (!remoteReady) {
                            proxySocket.pause();
                        }
                    });
                    remoteSocket.on('data', (data) => {
                        localReady = proxySocket.write(data);
                        if (!localReady) {
                            remoteSocket.pause();
                        }
                    });
                    proxySocket.on('drain', () => {
                        localReady = true;
                        if (!isDisconnected) {
                            remoteSocket.resume();
                        }
                    });
                    remoteSocket.on('drain', () => {
                        remoteReady = true;
                        if (!isDisconnected) {
                            proxySocket.resume();
                        }
                    });
                    proxySocket.on('close', () => {
                        outputChannel.appendLine(`Proxy socket closed, closing remote socket.`);
                        remoteSocket.end();
                    });
                    remoteSocket.on('close', () => {
                        outputChannel.appendLine(`Remote socket closed, closing proxy socket.`);
                        proxySocket.end();
                    });
                    context.subscriptions.push({
                        dispose: () => {
                            proxySocket.end();
                            remoteSocket.end();
                        }
                    });
                });
                proxyServer.listen(0, () => {
                    const port = proxyServer.address().port;
                    outputChannel.appendLine(`Going through proxy at port ${port}`);
                    res({ host: '127.0.0.1', port });
                });
                context.subscriptions.push({
                    dispose: () => {
                        proxyServer.close();
                    }
                });
            });
        });
    }
    vscode.workspace.registerRemoteAuthorityResolver('test', {
        resolve(_authority) {
            return vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Open TestResolver Remote ([details](command:vscode-testresolver.showLog))',
                cancellable: false
            }, (progress) => doResolve(_authority, progress));
        }
    });
    vscode.commands.registerCommand('vscode-testresolver.newWindow', () => {
        return vscode.commands.executeCommand('vscode.newWindow', { remoteAuthority: 'test+test' });
    });
    vscode.commands.registerCommand('vscode-testresolver.newWindowWithError', () => {
        return vscode.commands.executeCommand('vscode.newWindow', { remoteAuthority: 'test+error' });
    });
    vscode.commands.registerCommand('vscode-testresolver.showLog', () => {
        if (outputChannel) {
            outputChannel.show();
        }
    });
}
exports.activate = activate;
function getActions() {
    const actions = [];
    const isDirty = vscode.workspace.textDocuments.some(d => d.isDirty) || vscode.workspace.workspaceFile && vscode.workspace.workspaceFile.scheme === 'untitled';
    actions.push({
        title: 'Retry',
        execute: async () => {
            await vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    });
    if (!isDirty) {
        actions.push({
            title: 'Close Remote',
            execute: async () => {
                await vscode.commands.executeCommand('vscode.newWindow', { reuseWindow: true });
            }
        });
    }
    actions.push({
        title: 'Ignore',
        isCloseAffordance: true,
        execute: async () => {
            vscode.commands.executeCommand('vscode-testresolver.showLog'); // no need to wait
        }
    });
    return actions;
}
function getProductConfiguration() {
    const content = fs.readFileSync(path.join(vscode.env.appRoot, 'product.json')).toString();
    return JSON.parse(content);
}
function getNewEnv() {
    const env = { ...process.env };
    delete env['ELECTRON_RUN_AS_NODE'];
    return env;
}
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
function getConfiguration(id) {
    return vscode.workspace.getConfiguration('testresolver').get(id);
}
//# sourceMappingURL=extension.js.map