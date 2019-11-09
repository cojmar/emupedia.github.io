"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert = require("assert");
const vscode_1 = require("vscode");
const path_1 = require("path");
const fs = require("fs");
function assertUnchangedTokens(testFixurePath, done) {
    let fileName = path_1.basename(testFixurePath);
    return vscode_1.commands.executeCommand('_workbench.captureSyntaxTokens', vscode_1.Uri.file(testFixurePath)).then(data => {
        try {
            let resultsFolderPath = path_1.join(path_1.dirname(path_1.dirname(testFixurePath)), 'colorize-results');
            if (!fs.existsSync(resultsFolderPath)) {
                fs.mkdirSync(resultsFolderPath);
            }
            let resultPath = path_1.join(resultsFolderPath, fileName.replace('.', '_') + '.json');
            if (fs.existsSync(resultPath)) {
                let previousData = JSON.parse(fs.readFileSync(resultPath).toString());
                try {
                    assert.deepEqual(data, previousData);
                }
                catch (e) {
                    fs.writeFileSync(resultPath, JSON.stringify(data, null, '\t'), { flag: 'w' });
                    if (Array.isArray(data) && Array.isArray(previousData) && data.length === previousData.length) {
                        for (let i = 0; i < data.length; i++) {
                            let d = data[i];
                            let p = previousData[i];
                            if (d.c !== p.c || hasThemeChange(d.r, p.r)) {
                                throw e;
                            }
                        }
                        // different but no tokenization ot color change: no failure
                    }
                    else {
                        throw e;
                    }
                }
            }
            else {
                fs.writeFileSync(resultPath, JSON.stringify(data, null, '\t'));
            }
            done();
        }
        catch (e) {
            done(e);
        }
    }, done);
}
function hasThemeChange(d, p) {
    let keys = Object.keys(d);
    for (let key of keys) {
        if (d[key] !== p[key]) {
            return true;
        }
    }
    return false;
}
;
suite('colorization', () => {
    let extensionsFolder = path_1.normalize(path_1.join(__dirname, '../../'));
    let extensions = fs.readdirSync(extensionsFolder);
    extensions.forEach(extension => {
        let extensionColorizeFixturePath = path_1.join(extensionsFolder, extension, 'test', 'colorize-fixtures');
        if (fs.existsSync(extensionColorizeFixturePath)) {
            let fixturesFiles = fs.readdirSync(extensionColorizeFixturePath);
            fixturesFiles.forEach(fixturesFile => {
                // define a test for each fixture
                test(extension + '-' + fixturesFile, function (done) {
                    assertUnchangedTokens(path_1.join(extensionColorizeFixturePath, fixturesFile), done);
                });
            });
        }
    });
});
//# sourceMappingURL=colorizer.test.js.map