/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/browser/dom", "vs/base/common/actions", "vs/base/common/errors", "vs/base/common/lazy", "vs/base/common/lifecycle", "vs/editor/common/core/position", "vs/editor/contrib/codeAction/codeAction", "vs/editor/contrib/codeAction/types"], function (require, exports, dom_1, actions_1, errors_1, lazy_1, lifecycle_1, position_1, codeAction_1, types_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CodeActionAction extends actions_1.Action {
        constructor(action, callback) {
            super(action.command ? action.command.id : action.title, action.title, undefined, true, callback);
            this.action = action;
        }
    }
    class CodeActionWidget extends lifecycle_1.Disposable {
        constructor(_editor, _contextMenuService, keybindingService, _delegate) {
            super();
            this._editor = _editor;
            this._contextMenuService = _contextMenuService;
            this._delegate = _delegate;
            this._visible = false;
            this._showingActions = this._register(new lifecycle_1.MutableDisposable());
            this._keybindingResolver = new CodeActionKeybindingResolver(keybindingService);
        }
        get isVisible() {
            return this._visible;
        }
        async show(codeActions, at) {
            if (!codeActions.actions.length) {
                this._visible = false;
                return;
            }
            if (!this._editor.getDomNode()) {
                // cancel when editor went off-dom
                this._visible = false;
                throw errors_1.canceled();
            }
            this._visible = true;
            this._showingActions.value = codeActions;
            const actions = codeActions.actions.map(action => new CodeActionAction(action, () => this._delegate.onSelectCodeAction(action)));
            const anchor = position_1.Position.isIPosition(at) ? this._toCoords(at) : at || { x: 0, y: 0 };
            const resolver = this._keybindingResolver.getResolver();
            this._contextMenuService.showContextMenu({
                getAnchor: () => anchor,
                getActions: () => actions,
                onHide: () => {
                    this._visible = false;
                    this._editor.focus();
                },
                autoSelectFirstItem: true,
                getKeyBinding: action => action instanceof CodeActionAction ? resolver(action.action) : undefined,
            });
        }
        _toCoords(position) {
            if (!this._editor.hasModel()) {
                return { x: 0, y: 0 };
            }
            this._editor.revealPosition(position, 1 /* Immediate */);
            this._editor.render();
            // Translate to absolute editor position
            const cursorCoords = this._editor.getScrolledVisiblePosition(position);
            const editorCoords = dom_1.getDomNodePagePosition(this._editor.getDomNode());
            const x = editorCoords.left + cursorCoords.left;
            const y = editorCoords.top + cursorCoords.top + cursorCoords.height;
            return { x, y };
        }
    }
    exports.CodeActionWidget = CodeActionWidget;
    class CodeActionKeybindingResolver {
        constructor(_keybindingProvider) {
            this._keybindingProvider = _keybindingProvider;
        }
        getResolver() {
            // Lazy since we may not actually ever read the value
            const allCodeActionBindings = new lazy_1.Lazy(() => this._keybindingProvider.getKeybindings()
                .filter(item => CodeActionKeybindingResolver.codeActionCommands.indexOf(item.command) >= 0)
                .filter(item => item.resolvedKeybinding)
                .map((item) => {
                // Special case these commands since they come built-in with VS Code and don't use 'commandArgs'
                let commandArgs = item.commandArgs;
                if (item.command === codeAction_1.organizeImportsCommandId) {
                    commandArgs = { kind: types_1.CodeActionKind.SourceOrganizeImports.value };
                }
                else if (item.command === codeAction_1.fixAllCommandId) {
                    commandArgs = { kind: types_1.CodeActionKind.SourceFixAll.value };
                }
                return Object.assign({ resolvedKeybinding: item.resolvedKeybinding }, types_1.CodeActionCommandArgs.fromUser(commandArgs, {
                    kind: types_1.CodeActionKind.None,
                    apply: "never" /* Never */
                }));
            }));
            return (action) => {
                var _a;
                if (action.kind) {
                    const binding = this.bestKeybindingForCodeAction(action, allCodeActionBindings.getValue());
                    return (_a = binding) === null || _a === void 0 ? void 0 : _a.resolvedKeybinding;
                }
                return undefined;
            };
        }
        bestKeybindingForCodeAction(action, candidates) {
            if (!action.kind) {
                return undefined;
            }
            const kind = new types_1.CodeActionKind(action.kind);
            return candidates
                .filter(candidate => candidate.kind.contains(kind))
                .filter(candidate => {
                if (candidate.preferred) {
                    // If the candidate keybinding only applies to preferred actions, the this action must also be preferred
                    return action.isPreferred;
                }
                return true;
            })
                .reduceRight((currentBest, candidate) => {
                if (!currentBest) {
                    return candidate;
                }
                // Select the more specific binding
                return currentBest.kind.contains(candidate.kind) ? candidate : currentBest;
            }, undefined);
        }
    }
    exports.CodeActionKeybindingResolver = CodeActionKeybindingResolver;
    CodeActionKeybindingResolver.codeActionCommands = [
        codeAction_1.refactorCommandId,
        codeAction_1.codeActionCommandId,
        codeAction_1.sourceActionCommandId,
        codeAction_1.organizeImportsCommandId,
        codeAction_1.fixAllCommandId
    ];
});
//# sourceMappingURL=codeActionWidget.js.map