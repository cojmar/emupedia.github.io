/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/arrays", "vs/base/common/event", "vs/base/common/lifecycle", "vs/base/common/map", "vs/editor/contrib/codeAction/codeAction", "vs/editor/contrib/codeAction/types", "vs/nls", "vs/platform/configuration/common/configurationRegistry", "vs/platform/registry/common/platform"], function (require, exports, arrays_1, event_1, lifecycle_1, map_1, codeAction_1, types_1, nls, configurationRegistry_1, platform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const codeActionsOnSaveDefaultProperties = Object.freeze({
        'source.fixAll': {
            type: 'boolean',
            description: nls.localize('codeActionsOnSave.fixAll', "Controls whether auto fix action should be run on file save.")
        }
    });
    const codeActionsOnSaveSchema = {
        type: 'object',
        properties: codeActionsOnSaveDefaultProperties,
        'additionalProperties': {
            type: 'boolean'
        },
        default: {},
        description: nls.localize('codeActionsOnSave', "Code action kinds to be run on save."),
        scope: 4 /* RESOURCE */
    };
    exports.editorConfiguration = Object.freeze({
        id: 'editor',
        order: 5,
        type: 'object',
        title: nls.localize('editorConfigurationTitle', "Editor"),
        overridable: true,
        properties: {
            'editor.codeActionsOnSave': codeActionsOnSaveSchema,
            'editor.codeActionsOnSaveTimeout': {
                type: 'number',
                default: 750,
                description: nls.localize('codeActionsOnSaveTimeout', "Timeout in milliseconds after which the code actions that are run on save are cancelled."),
                scope: 4 /* RESOURCE */
            },
        }
    });
    class CodeActionWorkbenchContribution extends lifecycle_1.Disposable {
        constructor(codeActionsExtensionPoint, keybindingService) {
            super();
            this._contributedCodeActions = [];
            this._onDidChangeContributions = this._register(new event_1.Emitter());
            codeActionsExtensionPoint.setHandler(extensionPoints => {
                this._contributedCodeActions = arrays_1.flatten(extensionPoints.map(x => x.value));
                this.updateConfigurationSchema(this._contributedCodeActions);
                this._onDidChangeContributions.fire();
            });
            keybindingService.registerSchemaContribution({
                getSchemaAdditions: () => this.getSchemaAdditions(),
                onDidChange: this._onDidChangeContributions.event,
            });
        }
        updateConfigurationSchema(codeActionContributions) {
            const newProperties = Object.assign({}, codeActionsOnSaveDefaultProperties);
            for (const [sourceAction, props] of this.getSourceActions(codeActionContributions)) {
                newProperties[sourceAction] = {
                    type: 'boolean',
                    description: nls.localize('codeActionsOnSave.generic', "Controls whether '{0}' actions should be run on file save.", props.title)
                };
            }
            codeActionsOnSaveSchema.properties = newProperties;
            platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration)
                .notifyConfigurationSchemaUpdated(exports.editorConfiguration);
        }
        getSourceActions(contributions) {
            const defaultKinds = Object.keys(codeActionsOnSaveDefaultProperties).map(value => new types_1.CodeActionKind(value));
            const sourceActions = new Map();
            for (const contribution of contributions) {
                for (const action of contribution.actions) {
                    const kind = new types_1.CodeActionKind(action.kind);
                    if (types_1.CodeActionKind.Source.contains(kind)
                        // Exclude any we already included by default
                        && !defaultKinds.some(defaultKind => defaultKind.contains(kind))) {
                        sourceActions.set(kind.value, action);
                    }
                }
            }
            return sourceActions;
        }
        getSchemaAdditions() {
            const conditionalSchema = (command, actions) => {
                return {
                    if: {
                        properties: {
                            'command': { const: command }
                        }
                    },
                    then: {
                        required: ['args'],
                        properties: {
                            'args': {
                                required: ['kind'],
                                properties: {
                                    'kind': {
                                        anyOf: [
                                            {
                                                enum: actions.map(action => action.kind),
                                                enumDescriptions: actions.map(action => { var _a; return _a = action.description, (_a !== null && _a !== void 0 ? _a : action.title); }),
                                            },
                                            { type: 'string' },
                                        ]
                                    }
                                }
                            }
                        }
                    }
                };
            };
            const getActions = (ofKind) => {
                const allActions = arrays_1.flatten(this._contributedCodeActions.map(desc => desc.actions.slice()));
                const out = new Map();
                for (const action of allActions) {
                    if (!out.has(action.kind) && ofKind.contains(new types_1.CodeActionKind(action.kind))) {
                        out.set(action.kind, action);
                    }
                }
                return map_1.values(out);
            };
            return [
                conditionalSchema(codeAction_1.codeActionCommandId, getActions(types_1.CodeActionKind.Empty)),
                conditionalSchema(codeAction_1.refactorCommandId, getActions(types_1.CodeActionKind.Refactor)),
                conditionalSchema(codeAction_1.sourceActionCommandId, getActions(types_1.CodeActionKind.Source)),
            ];
        }
    }
    exports.CodeActionWorkbenchContribution = CodeActionWorkbenchContribution;
});
//# sourceMappingURL=configuration.js.map