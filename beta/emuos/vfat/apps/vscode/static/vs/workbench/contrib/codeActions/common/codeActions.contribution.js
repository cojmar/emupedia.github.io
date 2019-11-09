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
define(["require", "exports", "vs/platform/configuration/common/configurationRegistry", "vs/platform/keybinding/common/keybinding", "vs/platform/registry/common/platform", "vs/workbench/common/contributions", "vs/workbench/contrib/codeActions/common/configuration", "vs/workbench/contrib/codeActions/common/extensionPoint", "vs/workbench/services/extensions/common/extensionsRegistry"], function (require, exports, configurationRegistry_1, keybinding_1, platform_1, contributions_1, configuration_1, extensionPoint_1, extensionsRegistry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const codeActionsExtensionPoint = extensionsRegistry_1.ExtensionsRegistry.registerExtensionPoint(extensionPoint_1.codeActionsExtensionPointDescriptor);
    platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration)
        .registerConfiguration(configuration_1.editorConfiguration);
    let WorkbenchContribution = class WorkbenchContribution {
        constructor(keybindingsService) {
            // tslint:disable-next-line: no-unused-expression
            new configuration_1.CodeActionWorkbenchContribution(codeActionsExtensionPoint, keybindingsService);
        }
    };
    WorkbenchContribution = __decorate([
        __param(0, keybinding_1.IKeybindingService)
    ], WorkbenchContribution);
    platform_1.Registry.as(contributions_1.Extensions.Workbench)
        .registerWorkbenchContribution(WorkbenchContribution, 4 /* Eventually */);
});
//# sourceMappingURL=codeActions.contribution.js.map