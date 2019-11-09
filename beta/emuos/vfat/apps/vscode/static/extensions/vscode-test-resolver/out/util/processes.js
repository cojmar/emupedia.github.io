"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const cp = require("child_process");
const path = require("path");
function terminateProcess(p, extensionPath) {
    if (process.platform === 'win32') {
        try {
            const options = {
                stdio: ['pipe', 'pipe', 'ignore']
            };
            cp.execFileSync('taskkill', ['/T', '/F', '/PID', p.pid.toString()], options);
        }
        catch (err) {
            return { success: false, error: err };
        }
    }
    else if (process.platform === 'darwin' || process.platform === 'linux') {
        try {
            const cmd = path.join(extensionPath, 'scripts', 'terminateProcess.sh');
            const result = cp.spawnSync(cmd, [process.pid.toString()]);
            if (result.error) {
                return { success: false, error: result.error };
            }
        }
        catch (err) {
            return { success: false, error: err };
        }
    }
    else {
        p.kill('SIGKILL');
    }
    return { success: true };
}
exports.terminateProcess = terminateProcess;
//# sourceMappingURL=processes.js.map