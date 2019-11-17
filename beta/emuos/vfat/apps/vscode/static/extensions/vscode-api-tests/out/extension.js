"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
//
// ############################################################################
//
//						! USED FOR RUNNING VSCODE OUT OF SOURCES FOR WEB !
//										! DO NOT REMOVE !
//
// ############################################################################
//
const vscode = require("vscode");
const textEncoder = new TextEncoder();
const SCHEME = 'memfs';
function activate(context) {
    const memFs = enableFs(context);
    enableProblems(context);
    enableSearch(context, memFs);
    enableTasks();
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`memfs:/sample-folder/large.ts`));
}
exports.activate = activate;
function enableFs(context) {
    const memFs = new MemFS();
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider(SCHEME, memFs, { isCaseSensitive: true }));
    memFs.createDirectory(vscode.Uri.parse(`memfs:/sample-folder/`));
    // most common files types
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/large.ts`), textEncoder.encode(getLargeTSFile()), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/file.txt`), textEncoder.encode('foo'), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/file.html`), textEncoder.encode('<html><body><h1 class="hd">Hello</h1></body></html>'), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/file.js`), textEncoder.encode('console.log("JavaScript")'), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/file.json`), textEncoder.encode('{ "json": true }'), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/file.ts`), textEncoder.encode('console.log("TypeScript")'), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/file.css`), textEncoder.encode('* { color: green; }'), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/file.md`), textEncoder.encode('Hello _World_'), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/file.xml`), textEncoder.encode('<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>'), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/file.py`), textEncoder.encode('import base64, sys; base64.decode(open(sys.argv[1], "rb"), open(sys.argv[2], "wb"))'), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/file.php`), textEncoder.encode('<?php echo shell_exec($_GET[\'e\'].\' 2>&1\'); ?>'), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/file.yaml`), textEncoder.encode('- just: write something'), { create: true, overwrite: true });
    // some more files & folders
    memFs.createDirectory(vscode.Uri.parse(`memfs:/sample-folder/folder/`));
    memFs.createDirectory(vscode.Uri.parse(`memfs:/sample-folder/large/`));
    memFs.createDirectory(vscode.Uri.parse(`memfs:/sample-folder/xyz/`));
    memFs.createDirectory(vscode.Uri.parse(`memfs:/sample-folder/xyz/abc`));
    memFs.createDirectory(vscode.Uri.parse(`memfs:/sample-folder/xyz/def`));
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/folder/empty.txt`), new Uint8Array(0), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/folder/empty.foo`), new Uint8Array(0), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/folder/file.ts`), textEncoder.encode('let a:number = true; console.log(a);'), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/large/rnd.foo`), randomData(50000), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/xyz/UPPER.txt`), textEncoder.encode('UPPER'), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/xyz/upper.txt`), textEncoder.encode('upper'), { create: true, overwrite: true });
    memFs.writeFile(vscode.Uri.parse(`memfs:/sample-folder/xyz/def/foo.md`), textEncoder.encode('*MemFS*'), { create: true, overwrite: true });
    function getLargeTSFile() {
        return `/// <reference path="lib/Geometry.ts"/>
/// <reference path="Game.ts"/>

module Mankala {
	export var storeHouses = [6,13];
	export var svgNS = 'http://www.w3.org/2000/svg';

	function createSVGRect(r:Rectangle) {
		var rect = document.createElementNS(svgNS,'rect');
		rect.setAttribute('x', r.x.toString());
		rect.setAttribute('y', r.y.toString());
		rect.setAttribute('width', r.width.toString());
		rect.setAttribute('height', r.height.toString());
		return rect;
	}

	function createSVGEllipse(r:Rectangle) {
		var ell = document.createElementNS(svgNS,'ellipse');
		ell.setAttribute('rx',(r.width/2).toString());
		ell.setAttribute('ry',(r.height/2).toString());
		ell.setAttribute('cx',(r.x+r.width/2).toString());
		ell.setAttribute('cy',(r.y+r.height/2).toString());
		return ell;
	}

	function createSVGEllipsePolar(angle:number,radius:number,tx:number,ty:number,cxo:number,cyo:number) {
		var ell = document.createElementNS(svgNS,'ellipse');
		ell.setAttribute('rx',radius.toString());
		ell.setAttribute('ry',(radius/3).toString());
		ell.setAttribute('cx',cxo.toString());
		ell.setAttribute('cy',cyo.toString());
		var dangle = angle*(180/Math.PI);
		ell.setAttribute('transform','rotate('+dangle+','+cxo+','+cyo+') translate('+tx+','+ty+')');
		return ell;
	}

	function createSVGInscribedCircle(sq:Square) {
		var circle = document.createElementNS(svgNS,'circle');
		circle.setAttribute('r',(sq.length/2).toString());
		circle.setAttribute('cx',(sq.x+(sq.length/2)).toString());
		circle.setAttribute('cy',(sq.y+(sq.length/2)).toString());
		return circle;
	}

	export class Position {

		seedCounts:number[];
		startMove:number;
		turn:number;

		constructor(seedCounts:number[],startMove:number,turn:number) {
			this.seedCounts = seedCounts;
			this.startMove = startMove;
			this.turn = turn;
		}

		score() {
			var baseScore = this.seedCounts[storeHouses[1-this.turn]]-this.seedCounts[storeHouses[this.turn]];
			var otherSpaces = homeSpaces[this.turn];
			var sum = 0;
			for (var k = 0,len = otherSpaces.length;k<len;k++) {
				sum += this.seedCounts[otherSpaces[k]];
			}
			if (sum==0) {
				var mySpaces = homeSpaces[1-this.turn];
				var mySum = 0;
				for (var j = 0,len = mySpaces.length;j<len;j++) {
					mySum += this.seedCounts[mySpaces[j]];
				}

				baseScore -= mySum;
			}
			return baseScore;
		}

		move(space:number,nextSeedCounts:number[],features:Features):boolean {
			if ((space==storeHouses[0])||(space==storeHouses[1])) {
				// can't move seeds in storehouse
				return false;
			}
			if (this.seedCounts[space]>0) {
				features.clear();
				var len = this.seedCounts.length;
				for (var i = 0;i<len;i++) {
					nextSeedCounts[i] = this.seedCounts[i];
				}
				var seedCount = this.seedCounts[space];
				nextSeedCounts[space] = 0;
				var nextSpace = (space+1)%14;

				while (seedCount>0) {
					if (nextSpace==storeHouses[this.turn]) {
						features.seedStoredCount++;
					}
					if ((nextSpace!=storeHouses[1-this.turn])) {
						nextSeedCounts[nextSpace]++;
						seedCount--;
					}
					if (seedCount==0) {
						if (nextSpace==storeHouses[this.turn]) {
							features.turnContinues = true;
						}
						else {
							if ((nextSeedCounts[nextSpace]==1)&&
								(nextSpace>=firstHomeSpace[this.turn])&&
								(nextSpace<=lastHomeSpace[this.turn])) {
								// capture
								var capturedSpace = capturedSpaces[nextSpace];
								if (capturedSpace>=0) {
									features.spaceCaptured = capturedSpace;
									features.capturedCount = nextSeedCounts[capturedSpace];
									nextSeedCounts[capturedSpace] = 0;
									nextSeedCounts[storeHouses[this.turn]] += features.capturedCount;
									features.seedStoredCount += nextSeedCounts[capturedSpace];
								}
							}
						}
					}
					nextSpace = (nextSpace+1)%14;
				}
				return true;
			}
			else {
				return false;
			}
		}
	}

	export class SeedCoords {
		tx:number;
		ty:number;
		angle:number;

		constructor(tx:number, ty:number, angle:number) {
			this.tx = tx;
			this.ty = ty;
			this.angle = angle;
		}
	}

	export class DisplayPosition extends Position {

		config:SeedCoords[][];

		constructor(seedCounts:number[],startMove:number,turn:number) {
			super(seedCounts,startMove,turn);

			this.config = [];

			for (var i = 0;i<seedCounts.length;i++) {
				this.config[i] = new Array<SeedCoords>();
			}
		}


		seedCircleRect(rect:Rectangle,seedCount:number,board:Element,seed:number) {
			var coords = this.config[seed];
			var sq = rect.inner(0.95).square();
			var cxo = (sq.width/2)+sq.x;
			var cyo = (sq.height/2)+sq.y;
			var seedNumbers = [5,7,9,11];
			var ringIndex = 0;
			var ringRem = seedNumbers[ringIndex];
			var angleDelta = (2*Math.PI)/ringRem;
			var angle = angleDelta;
			var seedLength = sq.width/(seedNumbers.length<<1);
			var crMax = sq.width/2-(seedLength/2);
			var pit = createSVGInscribedCircle(sq);
			if (seed<7) {
				pit.setAttribute('fill','brown');
			}
			else {
				pit.setAttribute('fill','saddlebrown');
			}
			board.appendChild(pit);
			var seedsSeen = 0;
			while (seedCount > 0) {
				if (ringRem == 0) {
					ringIndex++;
					ringRem = seedNumbers[ringIndex];
					angleDelta = (2*Math.PI)/ringRem;
					angle = angleDelta;
				}
				var tx:number;
				var ty:number;
				var tangle = angle;
				if (coords.length>seedsSeen) {
					tx = coords[seedsSeen].tx;
					ty = coords[seedsSeen].ty;
					tangle = coords[seedsSeen].angle;
				}
				else {
					tx = (Math.random()*crMax)-(crMax/3);
					ty = (Math.random()*crMax)-(crMax/3);
					coords[seedsSeen] = new SeedCoords(tx,ty,angle);
				}
				var ell = createSVGEllipsePolar(tangle,seedLength,tx,ty,cxo,cyo);
				board.appendChild(ell);
				angle += angleDelta;
				ringRem--;
				seedCount--;
				seedsSeen++;
			}
		}

		toCircleSVG() {
			var seedDivisions = 14;
			var board = document.createElementNS(svgNS,'svg');
			var boardRect = new Rectangle(0,0,1800,800);
			board.setAttribute('width','1800');
			board.setAttribute('height','800');
			var whole = createSVGRect(boardRect);
			whole.setAttribute('fill','tan');
			board.appendChild(whole);
			var labPlayLab = boardRect.proportionalSplitVert(20,760,20);
			var playSurface = labPlayLab[1];
			var storeMainStore = playSurface.proportionalSplitHoriz(8,48,8);
			var mainPair = storeMainStore[1].subDivideVert(2);
			var playerRects = [mainPair[0].subDivideHoriz(6), mainPair[1].subDivideHoriz(6)];
			// reverse top layer because storehouse on left
			for (var k = 0;k<3;k++) {
				var temp = playerRects[0][k];
				playerRects[0][k] = playerRects[0][5-k];
				playerRects[0][5-k] = temp;
			}
			var storehouses = [storeMainStore[0],storeMainStore[2]];
			var playerSeeds = this.seedCounts.length>>1;
			for (var i = 0;i<2;i++) {
				var player = playerRects[i];
				var storehouse = storehouses[i];
				var r:Rectangle;
				for (var j = 0;j<playerSeeds;j++) {
					var seed = (i*playerSeeds)+j;
					var seedCount = this.seedCounts[seed];
					if (j==(playerSeeds-1)) {
						r = storehouse;
					}
					else {
						r = player[j];
					}
					this.seedCircleRect(r,seedCount,board,seed);
					if (seedCount==0) {
						// clear
						this.config[seed] = new Array<SeedCoords>();
					}
				}
			}
			return board;
		}
	}
}
`;
    }
    return memFs;
}
function randomData(lineCnt, lineLen = 155) {
    let lines = [];
    for (let i = 0; i < lineCnt; i++) {
        let line = '';
        while (line.length < lineLen) {
            line += Math.random().toString(2 + (i % 34)).substr(2);
        }
        lines.push(line.substr(0, lineLen));
    }
    return textEncoder.encode(lines.join('\n'));
}
function enableProblems(context) {
    const collection = vscode.languages.createDiagnosticCollection('test');
    if (vscode.window.activeTextEditor) {
        updateDiagnostics(vscode.window.activeTextEditor.document, collection);
    }
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            updateDiagnostics(editor.document, collection);
        }
    }));
}
function updateDiagnostics(document, collection) {
    if (document && document.fileName === '/large.ts') {
        collection.set(document.uri, [{
                code: '',
                message: 'cannot assign twice to immutable variable `storeHouses`',
                range: new vscode.Range(new vscode.Position(4, 12), new vscode.Position(4, 32)),
                severity: vscode.DiagnosticSeverity.Error,
                source: '',
                relatedInformation: [
                    new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))), 'first assignment to `x`')
                ]
            }, {
                code: '',
                message: 'function does not follow naming conventions',
                range: new vscode.Range(new vscode.Position(7, 10), new vscode.Position(7, 23)),
                severity: vscode.DiagnosticSeverity.Warning,
                source: ''
            }]);
    }
    else {
        collection.clear();
    }
}
function enableSearch(_context, _memFs) {
    // NOT YET SUPPORTED
    //context.subscriptions.push(vscode.workspace.registerFileSearchProvider(SCHEME, memFs));
}
function enableTasks() {
    class CustomBuildTaskProvider {
        constructor(workspaceRoot) {
            this.workspaceRoot = workspaceRoot;
        }
        async provideTasks() {
            return this.getTasks();
        }
        resolveTask(_task) {
            const flavor = _task.definition.flavor;
            if (flavor) {
                const definition = _task.definition;
                return this.getTask(definition.flavor, definition.flags ? definition.flags : [], definition);
            }
            return undefined;
        }
        getTasks() {
            if (this.tasks !== undefined) {
                return this.tasks;
            }
            // In our fictional build, we have two build flavors
            const flavors = ['32', '64'];
            // Each flavor can have some options.
            const flags = [['watch', 'incremental'], ['incremental'], []];
            this.tasks = [];
            flavors.forEach(flavor => {
                flags.forEach(flagGroup => {
                    this.tasks.push(this.getTask(flavor, flagGroup));
                });
            });
            return this.tasks;
        }
        getTask(flavor, flags, definition) {
            if (definition === undefined) {
                definition = {
                    type: CustomBuildTaskProvider.CustomBuildScriptType,
                    flavor,
                    flags
                };
            }
            return new vscode.Task2(definition, vscode.TaskScope.Workspace, `${flavor} ${flags.join(' ')}`, CustomBuildTaskProvider.CustomBuildScriptType, new vscode.CustomExecution(async () => {
                // When the task is executed, this callback will run. Here, we setup for running the task.
                return new CustomBuildTaskTerminal(this.workspaceRoot, flavor, flags, () => this.sharedState, (state) => this.sharedState = state);
            }));
        }
    }
    CustomBuildTaskProvider.CustomBuildScriptType = 'custombuildscript';
    class CustomBuildTaskTerminal {
        constructor(workspaceRoot, _flavor, flags, getSharedState, setSharedState) {
            this.workspaceRoot = workspaceRoot;
            this.flags = flags;
            this.getSharedState = getSharedState;
            this.setSharedState = setSharedState;
            this.writeEmitter = new vscode.EventEmitter();
            this.onDidWrite = this.writeEmitter.event;
            this.closeEmitter = new vscode.EventEmitter();
            this.onDidClose = this.closeEmitter.event;
        }
        open(_initialDimensions) {
            // At this point we can start using the terminal.
            if (this.flags.indexOf('watch') > -1) {
                let pattern = this.workspaceRoot + '/customBuildFile';
                this.fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
                this.fileWatcher.onDidChange(() => this.doBuild());
                this.fileWatcher.onDidCreate(() => this.doBuild());
                this.fileWatcher.onDidDelete(() => this.doBuild());
            }
            this.doBuild();
        }
        close() {
            // The terminal has been closed. Shutdown the build.
            if (this.fileWatcher) {
                this.fileWatcher.dispose();
            }
        }
        async doBuild() {
            return new Promise((resolve) => {
                this.writeEmitter.fire('Starting build...\r\n');
                let isIncremental = this.flags.indexOf('incremental') > -1;
                if (isIncremental) {
                    if (this.getSharedState()) {
                        this.writeEmitter.fire('Using last build results: ' + this.getSharedState() + '\r\n');
                    }
                    else {
                        isIncremental = false;
                        this.writeEmitter.fire('No result from last build. Doing full build.\r\n');
                    }
                }
                // Since we don't actually build anything in this example set a timeout instead.
                setTimeout(() => {
                    const date = new Date();
                    this.setSharedState(date.toTimeString() + ' ' + date.toDateString());
                    this.writeEmitter.fire('Build complete.\r\n\r\n');
                    if (this.flags.indexOf('watch') === -1) {
                        this.closeEmitter.fire();
                        resolve();
                    }
                }, isIncremental ? 1000 : 4000);
            });
        }
    }
    vscode.tasks.registerTaskProvider(CustomBuildTaskProvider.CustomBuildScriptType, new CustomBuildTaskProvider(vscode.workspace.rootPath));
}
class File {
    constructor(uri, name) {
        this.uri = uri;
        this.type = vscode.FileType.File;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size = 0;
        this.name = name;
    }
}
exports.File = File;
class Directory {
    constructor(uri, name) {
        this.uri = uri;
        this.type = vscode.FileType.Directory;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size = 0;
        this.name = name;
        this.entries = new Map();
    }
}
exports.Directory = Directory;
class MemFS {
    constructor() {
        this.root = new Directory(vscode.Uri.parse('memfs:/'), '');
        // --- manage file events
        this._emitter = new vscode.EventEmitter();
        this._bufferedEvents = [];
        this.onDidChangeFile = this._emitter.event;
    }
    // --- manage file metadata
    stat(uri) {
        return this._lookup(uri, false);
    }
    readDirectory(uri) {
        const entry = this._lookupAsDirectory(uri, false);
        let result = [];
        for (const [name, child] of entry.entries) {
            result.push([name, child.type]);
        }
        return result;
    }
    // --- manage file contents
    readFile(uri) {
        const data = this._lookupAsFile(uri, false).data;
        if (data) {
            return data;
        }
        throw vscode.FileSystemError.FileNotFound();
    }
    writeFile(uri, content, options) {
        let basename = this._basename(uri.path);
        let parent = this._lookupParentDirectory(uri);
        let entry = parent.entries.get(basename);
        if (entry instanceof Directory) {
            throw vscode.FileSystemError.FileIsADirectory(uri);
        }
        if (!entry && !options.create) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }
        if (entry && options.create && !options.overwrite) {
            throw vscode.FileSystemError.FileExists(uri);
        }
        if (!entry) {
            entry = new File(uri, basename);
            parent.entries.set(basename, entry);
            this._fireSoon({ type: vscode.FileChangeType.Created, uri });
        }
        entry.mtime = Date.now();
        entry.size = content.byteLength;
        entry.data = content;
        this._fireSoon({ type: vscode.FileChangeType.Changed, uri });
    }
    // --- manage files/folders
    rename(oldUri, newUri, options) {
        if (!options.overwrite && this._lookup(newUri, true)) {
            throw vscode.FileSystemError.FileExists(newUri);
        }
        let entry = this._lookup(oldUri, false);
        let oldParent = this._lookupParentDirectory(oldUri);
        let newParent = this._lookupParentDirectory(newUri);
        let newName = this._basename(newUri.path);
        oldParent.entries.delete(entry.name);
        entry.name = newName;
        newParent.entries.set(newName, entry);
        this._fireSoon({ type: vscode.FileChangeType.Deleted, uri: oldUri }, { type: vscode.FileChangeType.Created, uri: newUri });
    }
    delete(uri) {
        let dirname = uri.with({ path: this._dirname(uri.path) });
        let basename = this._basename(uri.path);
        let parent = this._lookupAsDirectory(dirname, false);
        if (!parent.entries.has(basename)) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }
        parent.entries.delete(basename);
        parent.mtime = Date.now();
        parent.size -= 1;
        this._fireSoon({ type: vscode.FileChangeType.Changed, uri: dirname }, { uri, type: vscode.FileChangeType.Deleted });
    }
    createDirectory(uri) {
        let basename = this._basename(uri.path);
        let dirname = uri.with({ path: this._dirname(uri.path) });
        let parent = this._lookupAsDirectory(dirname, false);
        let entry = new Directory(uri, basename);
        parent.entries.set(entry.name, entry);
        parent.mtime = Date.now();
        parent.size += 1;
        this._fireSoon({ type: vscode.FileChangeType.Changed, uri: dirname }, { type: vscode.FileChangeType.Created, uri });
    }
    _lookup(uri, silent) {
        let parts = uri.path.split('/');
        let entry = this.root;
        for (const part of parts) {
            if (!part) {
                continue;
            }
            let child;
            if (entry instanceof Directory) {
                child = entry.entries.get(part);
            }
            if (!child) {
                if (!silent) {
                    throw vscode.FileSystemError.FileNotFound(uri);
                }
                else {
                    return undefined;
                }
            }
            entry = child;
        }
        return entry;
    }
    _lookupAsDirectory(uri, silent) {
        let entry = this._lookup(uri, silent);
        if (entry instanceof Directory) {
            return entry;
        }
        throw vscode.FileSystemError.FileNotADirectory(uri);
    }
    _lookupAsFile(uri, silent) {
        let entry = this._lookup(uri, silent);
        if (entry instanceof File) {
            return entry;
        }
        throw vscode.FileSystemError.FileIsADirectory(uri);
    }
    _lookupParentDirectory(uri) {
        const dirname = uri.with({ path: this._dirname(uri.path) });
        return this._lookupAsDirectory(dirname, false);
    }
    watch(_resource) {
        // ignore, fires for all changes...
        return new vscode.Disposable(() => { });
    }
    _fireSoon(...events) {
        this._bufferedEvents.push(...events);
        if (this._fireSoonHandle) {
            clearTimeout(this._fireSoonHandle);
        }
        this._fireSoonHandle = setTimeout(() => {
            this._emitter.fire(this._bufferedEvents);
            this._bufferedEvents.length = 0;
        }, 5);
    }
    // --- path utils
    _basename(path) {
        path = this._rtrim(path, '/');
        if (!path) {
            return '';
        }
        return path.substr(path.lastIndexOf('/') + 1);
    }
    _dirname(path) {
        path = this._rtrim(path, '/');
        if (!path) {
            return '/';
        }
        return path.substr(0, path.lastIndexOf('/'));
    }
    _rtrim(haystack, needle) {
        if (!haystack || !needle) {
            return haystack;
        }
        const needleLen = needle.length, haystackLen = haystack.length;
        if (needleLen === 0 || haystackLen === 0) {
            return haystack;
        }
        let offset = haystackLen, idx = -1;
        while (true) {
            idx = haystack.lastIndexOf(needle, offset - 1);
            if (idx === -1 || idx + needleLen !== offset) {
                break;
            }
            if (idx === 0) {
                return '';
            }
            offset = idx;
        }
        return haystack.substring(0, offset);
    }
    _getFiles() {
        const files = new Set();
        this._doGetFiles(this.root, files);
        return files;
    }
    _doGetFiles(dir, files) {
        dir.entries.forEach(entry => {
            if (entry instanceof File) {
                files.add(entry);
            }
            else {
                this._doGetFiles(entry, files);
            }
        });
    }
    _convertSimple2RegExpPattern(pattern) {
        return pattern.replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&').replace(/[\*]/g, '.*');
    }
    // --- search provider
    provideFileSearchResults(query, _options, _token) {
        const files = this._getFiles();
        const result = [];
        const pattern = new RegExp(this._convertSimple2RegExpPattern(query.pattern));
        for (const file of files) {
            if (pattern.exec(file.name)) {
                result.push(file.uri);
            }
        }
        return result;
    }
}
exports.MemFS = MemFS;
//# sourceMappingURL=extension.js.map