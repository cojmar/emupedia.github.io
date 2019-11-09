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
define(["require", "exports", "vs/platform/contextkey/common/contextkey", "vs/platform/configuration/common/configurationRegistry", "vs/workbench/services/panel/common/panelService", "vs/workbench/common/actions", "vs/platform/keybinding/common/keybindingsRegistry", "vs/nls", "vs/workbench/contrib/markers/browser/markersModel", "vs/workbench/contrib/markers/browser/markersPanel", "vs/platform/actions/common/actions", "vs/workbench/browser/panel", "vs/platform/registry/common/platform", "vs/workbench/contrib/markers/browser/markersPanelActions", "vs/workbench/contrib/markers/browser/constants", "vs/workbench/contrib/markers/browser/messages", "vs/workbench/common/contributions", "vs/workbench/contrib/markers/browser/markers", "vs/platform/instantiation/common/extensions", "vs/platform/clipboard/common/clipboardService", "vs/workbench/common/panel", "vs/base/common/lifecycle", "vs/workbench/services/statusbar/common/statusbar", "vs/platform/markers/common/markers", "vs/platform/commands/common/commands", "vs/platform/configuration/common/configuration", "vs/platform/instantiation/common/instantiation", "vs/base/common/event", "vs/editor/browser/editorExtensions", "vs/base/common/resources", "vs/base/common/arrays", "vs/editor/common/core/range", "vs/base/common/strings", "vs/workbench/contrib/markers/browser/markersFileDecorations"], function (require, exports, contextkey_1, configurationRegistry_1, panelService_1, actions_1, keybindingsRegistry_1, nls_1, markersModel_1, markersPanel_1, actions_2, panel_1, platform_1, markersPanelActions_1, constants_1, messages_1, contributions_1, markers_1, extensions_1, clipboardService_1, panel_2, lifecycle_1, statusbar_1, markers_2, commands_1, configuration_1, instantiation_1, event_1, editorExtensions_1, resources_1, arrays_1, range_1, strings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    extensions_1.registerSingleton(markers_1.IMarkersWorkbenchService, markers_1.MarkersWorkbenchService, false);
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: constants_1.default.MARKER_OPEN_SIDE_ACTION_ID,
        weight: 200 /* WorkbenchContrib */,
        when: contextkey_1.ContextKeyExpr.and(constants_1.default.MarkerFocusContextKey),
        primary: 2048 /* CtrlCmd */ | 3 /* Enter */,
        mac: {
            primary: 256 /* WinCtrl */ | 3 /* Enter */
        },
        handler: (accessor, args) => {
            const markersPanel = accessor.get(panelService_1.IPanelService).getActivePanel();
            markersPanel.openFileAtElement(markersPanel.getFocusElement(), false, true, true);
        }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: constants_1.default.MARKER_SHOW_PANEL_ID,
        weight: 200 /* WorkbenchContrib */,
        when: undefined,
        primary: undefined,
        handler: (accessor, args) => {
            accessor.get(panelService_1.IPanelService).openPanel(constants_1.default.MARKERS_PANEL_ID);
        }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: constants_1.default.MARKER_SHOW_QUICK_FIX,
        weight: 200 /* WorkbenchContrib */,
        when: constants_1.default.MarkerFocusContextKey,
        primary: 2048 /* CtrlCmd */ | 84 /* US_DOT */,
        handler: (accessor, args) => {
            const markersPanel = accessor.get(panelService_1.IPanelService).getActivePanel();
            const focusedElement = markersPanel.getFocusElement();
            if (focusedElement instanceof markersModel_1.Marker) {
                markersPanel.showQuickFixes(focusedElement);
            }
        }
    });
    // configuration
    platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).registerConfiguration({
        'id': 'problems',
        'order': 101,
        'title': messages_1.default.PROBLEMS_PANEL_CONFIGURATION_TITLE,
        'type': 'object',
        'properties': {
            'problems.autoReveal': {
                'description': messages_1.default.PROBLEMS_PANEL_CONFIGURATION_AUTO_REVEAL,
                'type': 'boolean',
                'default': true
            },
            'problems.showCurrentInStatus': {
                'description': messages_1.default.PROBLEMS_PANEL_CONFIGURATION_SHOW_CURRENT_STATUS,
                'type': 'boolean',
                'default': false
            }
        }
    });
    // markers panel
    platform_1.Registry.as(panel_1.Extensions.Panels).registerPanel(new panel_1.PanelDescriptor(markersPanel_1.MarkersPanel, constants_1.default.MARKERS_PANEL_ID, messages_1.default.MARKERS_PANEL_TITLE_PROBLEMS, 'markersPanel', 10, markersPanelActions_1.ToggleMarkersPanelAction.ID));
    // workbench
    const workbenchRegistry = platform_1.Registry.as(contributions_1.Extensions.Workbench);
    workbenchRegistry.registerWorkbenchContribution(markers_1.ActivityUpdater, 3 /* Restored */);
    // actions
    const registry = platform_1.Registry.as(actions_1.Extensions.WorkbenchActions);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(markersPanelActions_1.ToggleMarkersPanelAction, markersPanelActions_1.ToggleMarkersPanelAction.ID, markersPanelActions_1.ToggleMarkersPanelAction.LABEL, {
        primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 43 /* KEY_M */
    }), 'View: Toggle Problems (Errors, Warnings, Infos)', messages_1.default.MARKERS_PANEL_VIEW_CATEGORY);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(markersPanelActions_1.ShowProblemsPanelAction, markersPanelActions_1.ShowProblemsPanelAction.ID, markersPanelActions_1.ShowProblemsPanelAction.LABEL), 'View: Focus Problems (Errors, Warnings, Infos)', messages_1.default.MARKERS_PANEL_VIEW_CATEGORY);
    actions_2.registerAction({
        id: constants_1.default.MARKER_COPY_ACTION_ID,
        title: { value: nls_1.localize('copyMarker', "Copy"), original: 'Copy' },
        async handler(accessor) {
            await copyMarker(accessor.get(panelService_1.IPanelService), accessor.get(clipboardService_1.IClipboardService));
        },
        menu: {
            menuId: 28 /* ProblemsPanelContext */,
            when: constants_1.default.MarkerFocusContextKey,
            group: 'navigation'
        },
        keybinding: {
            weight: 200 /* WorkbenchContrib */,
            keys: {
                primary: 2048 /* CtrlCmd */ | 33 /* KEY_C */
            },
            when: constants_1.default.MarkerFocusContextKey
        }
    });
    actions_2.registerAction({
        id: constants_1.default.MARKER_COPY_MESSAGE_ACTION_ID,
        title: { value: nls_1.localize('copyMessage', "Copy Message"), original: 'Copy Message' },
        async handler(accessor) {
            await copyMessage(accessor.get(panelService_1.IPanelService), accessor.get(clipboardService_1.IClipboardService));
        },
        menu: {
            menuId: 28 /* ProblemsPanelContext */,
            when: constants_1.default.MarkerFocusContextKey,
            group: 'navigation'
        }
    });
    actions_2.registerAction({
        id: constants_1.default.RELATED_INFORMATION_COPY_MESSAGE_ACTION_ID,
        title: { value: nls_1.localize('copyMessage', "Copy Message"), original: 'Copy Message' },
        async handler(accessor) {
            await copyRelatedInformationMessage(accessor.get(panelService_1.IPanelService), accessor.get(clipboardService_1.IClipboardService));
        },
        menu: {
            menuId: 28 /* ProblemsPanelContext */,
            when: constants_1.default.RelatedInformationFocusContextKey,
            group: 'navigation'
        }
    });
    actions_2.registerAction({
        id: constants_1.default.FOCUS_PROBLEMS_FROM_FILTER,
        handler(accessor) {
            focusProblemsView(accessor.get(panelService_1.IPanelService));
        },
        keybinding: {
            when: constants_1.default.MarkerPanelFilterFocusContextKey,
            weight: 200 /* WorkbenchContrib */,
            keys: {
                primary: 2048 /* CtrlCmd */ | 18 /* DownArrow */
            },
        }
    });
    actions_2.registerAction({
        id: constants_1.default.MARKERS_PANEL_FOCUS_FILTER,
        handler(accessor) {
            focusProblemsFilter(accessor.get(panelService_1.IPanelService));
        },
        keybinding: {
            when: constants_1.default.MarkerPanelFocusContextKey,
            weight: 200 /* WorkbenchContrib */,
            keys: {
                primary: 2048 /* CtrlCmd */ | 36 /* KEY_F */
            },
        }
    });
    actions_2.registerAction({
        id: constants_1.default.MARKERS_PANEL_SHOW_MULTILINE_MESSAGE,
        handler(accessor) {
            const panelService = accessor.get(panelService_1.IPanelService);
            const panel = panelService.getActivePanel();
            if (panel instanceof markersPanel_1.MarkersPanel) {
                panel.markersViewModel.multiline = true;
            }
        },
        title: { value: nls_1.localize('show multiline', "Show message in multiple lines"), original: 'Problems: Show message in multiple lines' },
        category: nls_1.localize('problems', "Problems"),
        menu: {
            menuId: 0 /* CommandPalette */,
            when: panel_2.ActivePanelContext.isEqualTo(constants_1.default.MARKERS_PANEL_ID)
        }
    });
    actions_2.registerAction({
        id: constants_1.default.MARKERS_PANEL_SHOW_SINGLELINE_MESSAGE,
        handler(accessor) {
            const panelService = accessor.get(panelService_1.IPanelService);
            const panel = panelService.getActivePanel();
            if (panel instanceof markersPanel_1.MarkersPanel) {
                panel.markersViewModel.multiline = false;
            }
        },
        title: { value: nls_1.localize('show singleline', "Show message in single line"), original: 'Problems: Show message in single line' },
        category: nls_1.localize('problems', "Problems"),
        menu: {
            menuId: 0 /* CommandPalette */,
            when: panel_2.ActivePanelContext.isEqualTo(constants_1.default.MARKERS_PANEL_ID)
        }
    });
    async function copyMarker(panelService, clipboardService) {
        const activePanel = panelService.getActivePanel();
        if (activePanel instanceof markersPanel_1.MarkersPanel) {
            const element = activePanel.getFocusElement();
            if (element instanceof markersModel_1.Marker) {
                await clipboardService.writeText(`${element}`);
            }
        }
    }
    async function copyMessage(panelService, clipboardService) {
        const activePanel = panelService.getActivePanel();
        if (activePanel instanceof markersPanel_1.MarkersPanel) {
            const element = activePanel.getFocusElement();
            if (element instanceof markersModel_1.Marker) {
                await clipboardService.writeText(element.marker.message);
            }
        }
    }
    async function copyRelatedInformationMessage(panelService, clipboardService) {
        const activePanel = panelService.getActivePanel();
        if (activePanel instanceof markersPanel_1.MarkersPanel) {
            const element = activePanel.getFocusElement();
            if (element instanceof markersModel_1.RelatedInformation) {
                await clipboardService.writeText(element.raw.message);
            }
        }
    }
    function focusProblemsView(panelService) {
        const activePanel = panelService.getActivePanel();
        if (activePanel instanceof markersPanel_1.MarkersPanel) {
            activePanel.focus();
        }
    }
    function focusProblemsFilter(panelService) {
        const activePanel = panelService.getActivePanel();
        if (activePanel instanceof markersPanel_1.MarkersPanel) {
            activePanel.focusFilter();
        }
    }
    actions_2.MenuRegistry.appendMenuItem(26 /* MenubarViewMenu */, {
        group: '4_panels',
        command: {
            id: markersPanelActions_1.ToggleMarkersPanelAction.ID,
            title: nls_1.localize({ key: 'miMarker', comment: ['&& denotes a mnemonic'] }, "&&Problems")
        },
        order: 4
    });
    commands_1.CommandsRegistry.registerCommand('workbench.actions.view.toggleProblems', accessor => {
        const panelService = accessor.get(panelService_1.IPanelService);
        const panel = accessor.get(panelService_1.IPanelService).getActivePanel();
        if (panel && panel.getId() === constants_1.default.MARKERS_PANEL_ID) {
            panelService.hideActivePanel();
        }
        else {
            panelService.openPanel(constants_1.default.MARKERS_PANEL_ID, true);
        }
    });
    let MarkersStatusBarContributions = class MarkersStatusBarContributions extends lifecycle_1.Disposable {
        constructor(markerService, statusbarService) {
            super();
            this.markerService = markerService;
            this.statusbarService = statusbarService;
            this.markersStatusItem = this._register(this.statusbarService.addEntry(this.getMarkersItem(), 'status.problems', nls_1.localize('status.problems', "Problems"), 0 /* LEFT */, 50 /* Medium Priority */));
            this.markerService.onMarkerChanged(() => this.markersStatusItem.update(this.getMarkersItem()));
        }
        getMarkersItem() {
            const markersStatistics = this.markerService.getStatistics();
            return {
                text: this.getMarkersText(markersStatistics),
                tooltip: this.getMarkersTooltip(markersStatistics),
                command: 'workbench.actions.view.toggleProblems'
            };
        }
        getMarkersTooltip(stats) {
            const errorTitle = (n) => nls_1.localize('totalErrors', "{0} Errors", n);
            const warningTitle = (n) => nls_1.localize('totalWarnings', "{0} Warnings", n);
            const infoTitle = (n) => nls_1.localize('totalInfos', "{0} Infos", n);
            const titles = [];
            if (stats.errors > 0) {
                titles.push(errorTitle(stats.errors));
            }
            if (stats.warnings > 0) {
                titles.push(warningTitle(stats.warnings));
            }
            if (stats.infos > 0) {
                titles.push(infoTitle(stats.infos));
            }
            if (titles.length === 0) {
                return nls_1.localize('noProblems', "No Problems");
            }
            return titles.join(', ');
        }
        getMarkersText(stats) {
            const problemsText = [];
            // Errors
            problemsText.push('$(error) ' + this.packNumber(stats.errors));
            // Warnings
            problemsText.push('$(warning) ' + this.packNumber(stats.warnings));
            // Info (only if any)
            if (stats.infos > 0) {
                problemsText.push('$(info) ' + this.packNumber(stats.infos));
            }
            return problemsText.join(' ');
        }
        packNumber(n) {
            const manyProblems = nls_1.localize('manyProblems', "10K+");
            return n > 9999 ? manyProblems : n > 999 ? n.toString().charAt(0) + 'K' : n.toString();
        }
    };
    MarkersStatusBarContributions = __decorate([
        __param(0, markers_2.IMarkerService),
        __param(1, statusbar_1.IStatusbarService)
    ], MarkersStatusBarContributions);
    workbenchRegistry.registerWorkbenchContribution(MarkersStatusBarContributions, 3 /* Restored */);
    let ShowCurrentMarkerInStatusbarContribution = class ShowCurrentMarkerInStatusbarContribution extends lifecycle_1.Disposable {
        constructor(editor, configurationService, instantiationService) {
            super();
            this.editor = editor;
            this.configurationService = configurationService;
            this.instantiationService = instantiationService;
            this.rendererDisposable = new lifecycle_1.MutableDisposable();
            this.onDidConfigurationChange();
            this._register(event_1.Event.filter(configurationService.onDidChangeConfiguration, e => e.affectsConfiguration('problems.showCurrentInStatus'))(() => this.onDidConfigurationChange()));
        }
        onDidConfigurationChange() {
            this.rendererDisposable.clear();
            if (this.configurationService.getValue('problems.showCurrentInStatus')) {
                this.rendererDisposable.value = this.instantiationService.createInstance(ShowCurrentMarkerInStatusbarRenderer, this.editor);
            }
        }
    };
    ShowCurrentMarkerInStatusbarContribution.ID = 'editor.contrib.showCurrentMarkerInStatusbar';
    ShowCurrentMarkerInStatusbarContribution = __decorate([
        __param(1, configuration_1.IConfigurationService),
        __param(2, instantiation_1.IInstantiationService)
    ], ShowCurrentMarkerInStatusbarContribution);
    let ShowCurrentMarkerInStatusbarRenderer = class ShowCurrentMarkerInStatusbarRenderer extends lifecycle_1.Disposable {
        constructor(editor, statusbarService, markerService) {
            super();
            this.editor = editor;
            this.statusbarService = statusbarService;
            this.markerService = markerService;
            this.markers = [];
            this.currentMarker = null;
            this.statusBarEntryAccessor = this._register(new lifecycle_1.MutableDisposable());
            this._register(markerService.onMarkerChanged(changedResources => this.onMarkerChanged(changedResources)));
            this._register(editor.onDidChangeModel(() => this.updateMarkers()));
            this._register(editor.onDidChangeCursorPosition(() => this.render()));
            this.render();
        }
        render() {
            const previousMarker = this.currentMarker;
            this.currentMarker = this.getMarker();
            if (this.hasToUpdateStatus(previousMarker, this.currentMarker)) {
                this.updateStatus();
            }
        }
        hasToUpdateStatus(previousMarker, currentMarker) {
            if (!currentMarker) {
                return true;
            }
            if (!previousMarker) {
                return true;
            }
            return markers_2.IMarkerData.makeKey(previousMarker) !== markers_2.IMarkerData.makeKey(currentMarker);
        }
        updateStatus() {
            if (this.currentMarker) {
                const line = this.currentMarker.message.split(/\r\n|\r|\n/g)[0];
                const text = `${this.getType(this.currentMarker)} ${line}`;
                if (this.statusBarEntryAccessor.value) {
                    this.statusBarEntryAccessor.value.update({ text });
                }
                else {
                    this.statusBarEntryAccessor.value = this.statusbarService.addEntry({ text }, 'statusbar.currentProblem', nls_1.localize('currentProblem', "Current Problem"), 0 /* LEFT */);
                }
            }
            else {
                this.statusBarEntryAccessor.clear();
            }
        }
        getType(marker) {
            switch (marker.severity) {
                case markers_2.MarkerSeverity.Error: return '$(error)';
                case markers_2.MarkerSeverity.Warning: return '$(warning)';
                case markers_2.MarkerSeverity.Info: return '$(info)';
            }
            return '';
        }
        getMarker() {
            const model = this.editor.getModel();
            if (!model) {
                return null;
            }
            const position = this.editor.getPosition();
            if (!position) {
                return null;
            }
            return arrays_1.find(this.markers, marker => range_1.Range.containsPosition(marker, position)) || null;
        }
        onMarkerChanged(changedResources) {
            const editorModel = this.editor.getModel();
            if (editorModel && !changedResources.some(r => resources_1.isEqual(editorModel.uri, r))) {
                return;
            }
            this.updateMarkers();
        }
        updateMarkers() {
            const editorModel = this.editor.getModel();
            if (editorModel) {
                this.markers = this.markerService.read({
                    resource: editorModel.uri,
                    severities: markers_2.MarkerSeverity.Error | markers_2.MarkerSeverity.Warning | markers_2.MarkerSeverity.Info
                });
                this.markers.sort(compareMarker);
            }
            else {
                this.markers = [];
            }
            this.render();
        }
    };
    ShowCurrentMarkerInStatusbarRenderer = __decorate([
        __param(1, statusbar_1.IStatusbarService),
        __param(2, markers_2.IMarkerService)
    ], ShowCurrentMarkerInStatusbarRenderer);
    function compareMarker(a, b) {
        let res = strings_1.compare(a.resource.toString(), b.resource.toString());
        if (res === 0) {
            res = markers_2.MarkerSeverity.compare(a.severity, b.severity);
        }
        if (res === 0) {
            res = range_1.Range.compareRangesUsingStarts(a, b);
        }
        return res;
    }
    editorExtensions_1.registerEditorContribution(ShowCurrentMarkerInStatusbarContribution.ID, ShowCurrentMarkerInStatusbarContribution);
});
//# sourceMappingURL=markers.contribution.js.map