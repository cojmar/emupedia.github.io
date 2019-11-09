/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/lifecycle", "vs/platform/files/common/files", "vs/workbench/api/common/extHostCustomers", "../common/extHost.protocol", "vs/workbench/services/textfile/common/textfiles", "vs/platform/progress/common/progress", "vs/nls"], function (require, exports, lifecycle_1, files_1, extHostCustomers_1, extHost_protocol_1, textfiles_1, progress_1, nls_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let MainThreadFileSystemEventService = class MainThreadFileSystemEventService {
        constructor(extHostContext, fileService, textFileService, progressService) {
            this._listener = new lifecycle_1.DisposableStore();
            const proxy = extHostContext.getProxy(extHost_protocol_1.ExtHostContext.ExtHostFileSystemEventService);
            // file system events - (changes the editor and other make)
            const events = {
                created: [],
                changed: [],
                deleted: []
            };
            this._listener.add(fileService.onFileChanges(event => {
                for (let change of event.changes) {
                    switch (change.type) {
                        case 1 /* ADDED */:
                            events.created.push(change.resource);
                            break;
                        case 0 /* UPDATED */:
                            events.changed.push(change.resource);
                            break;
                        case 2 /* DELETED */:
                            events.deleted.push(change.resource);
                            break;
                    }
                }
                proxy.$onFileEvent(events);
                events.created.length = 0;
                events.changed.length = 0;
                events.deleted.length = 0;
            }));
            // BEFORE file operation
            const messages = new Map();
            messages.set(0 /* CREATE */, nls_1.localize('msg-create', "Running 'File Create' participants..."));
            messages.set(1 /* DELETE */, nls_1.localize('msg-delete', "Running 'File Delete' participants..."));
            messages.set(2 /* MOVE */, nls_1.localize('msg-rename', "Running 'File Rename' participants..."));
            this._listener.add(textFileService.onWillRunOperation(e => {
                const p = progressService.withProgress({ location: 10 /* Window */ }, progress => {
                    progress.report({ message: messages.get(e.operation) });
                    const p1 = proxy.$onWillRunFileOperation(e.operation, e.target, e.source);
                    const p2 = new Promise((_resolve, reject) => {
                        setTimeout(() => reject(new Error('timeout')), 5000);
                    });
                    return Promise.race([p1, p2]);
                });
                e.waitUntil(p);
            }));
            // AFTER file operation
            this._listener.add(textFileService.onDidRunOperation(e => proxy.$onDidRunFileOperation(e.operation, e.target, e.source)));
        }
        dispose() {
            this._listener.dispose();
        }
    };
    MainThreadFileSystemEventService = __decorate([
        extHostCustomers_1.extHostCustomer,
        __param(1, files_1.IFileService),
        __param(2, textfiles_1.ITextFileService),
        __param(3, progress_1.IProgressService)
    ], MainThreadFileSystemEventService);
    exports.MainThreadFileSystemEventService = MainThreadFileSystemEventService;
});
//# sourceMappingURL=mainThreadFileSystemEventService.js.map