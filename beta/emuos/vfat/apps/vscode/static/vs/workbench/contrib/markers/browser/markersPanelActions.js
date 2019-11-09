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
define(["require", "exports", "vs/base/common/async", "vs/base/browser/dom", "vs/base/common/actions", "vs/platform/contextview/browser/contextView", "vs/workbench/browser/panel", "vs/workbench/contrib/markers/browser/messages", "vs/workbench/contrib/markers/browser/constants", "vs/workbench/services/layout/browser/layoutService", "vs/workbench/services/panel/common/panelService", "vs/platform/theme/common/themeService", "vs/platform/theme/common/styler", "vs/base/common/lifecycle", "vs/base/browser/ui/actionbar/actionbar", "vs/platform/theme/common/colorRegistry", "vs/nls", "vs/platform/instantiation/common/instantiation", "vs/platform/browser/contextScopedHistoryWidget", "vs/platform/contextkey/common/contextkey", "vs/base/common/event", "vs/platform/telemetry/common/telemetry", "vs/base/browser/ui/dropdown/dropdown"], function (require, exports, async_1, DOM, actions_1, contextView_1, panel_1, messages_1, constants_1, layoutService_1, panelService_1, themeService_1, styler_1, lifecycle_1, actionbar_1, colorRegistry_1, nls_1, instantiation_1, contextScopedHistoryWidget_1, contextkey_1, event_1, telemetry_1, dropdown_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let ToggleMarkersPanelAction = class ToggleMarkersPanelAction extends panel_1.TogglePanelAction {
        constructor(id, label, layoutService, panelService) {
            super(id, label, constants_1.default.MARKERS_PANEL_ID, panelService, layoutService);
        }
    };
    ToggleMarkersPanelAction.ID = 'workbench.actions.view.problems';
    ToggleMarkersPanelAction.LABEL = messages_1.default.MARKERS_PANEL_TOGGLE_LABEL;
    ToggleMarkersPanelAction = __decorate([
        __param(2, layoutService_1.IWorkbenchLayoutService),
        __param(3, panelService_1.IPanelService)
    ], ToggleMarkersPanelAction);
    exports.ToggleMarkersPanelAction = ToggleMarkersPanelAction;
    let ShowProblemsPanelAction = class ShowProblemsPanelAction extends actions_1.Action {
        constructor(id, label, panelService) {
            super(id, label);
            this.panelService = panelService;
        }
        run() {
            this.panelService.openPanel(constants_1.default.MARKERS_PANEL_ID, true);
            return Promise.resolve();
        }
    };
    ShowProblemsPanelAction.ID = 'workbench.action.problems.focus';
    ShowProblemsPanelAction.LABEL = messages_1.default.MARKERS_PANEL_SHOW_LABEL;
    ShowProblemsPanelAction = __decorate([
        __param(2, panelService_1.IPanelService)
    ], ShowProblemsPanelAction);
    exports.ShowProblemsPanelAction = ShowProblemsPanelAction;
    class MarkersFilterAction extends actions_1.Action {
        constructor(options) {
            super(MarkersFilterAction.ID, messages_1.default.MARKERS_PANEL_ACTION_TOOLTIP_FILTER, 'markers-panel-action-filter', true);
            this._onFocus = this._register(new event_1.Emitter());
            this.onFocus = this._onFocus.event;
            this._showWarnings = true;
            this._showErrors = true;
            this._showInfos = true;
            this._filterText = options.filterText;
            this._showErrors = options.showErrors;
            this._showWarnings = options.showWarnings;
            this._showInfos = options.showInfos;
            this._excludedFiles = options.excludedFiles;
            this._activeFile = options.activeFile;
            this.filterHistory = options.filterHistory;
        }
        get filterText() {
            return this._filterText;
        }
        set filterText(filterText) {
            if (this._filterText !== filterText) {
                this._filterText = filterText;
                this._onDidChange.fire({ filterText: true });
            }
        }
        get excludedFiles() {
            return this._excludedFiles;
        }
        set excludedFiles(filesExclude) {
            if (this._excludedFiles !== filesExclude) {
                this._excludedFiles = filesExclude;
                this._onDidChange.fire({ excludedFiles: true });
            }
        }
        get activeFile() {
            return this._activeFile;
        }
        set activeFile(activeFile) {
            if (this._activeFile !== activeFile) {
                this._activeFile = activeFile;
                this._onDidChange.fire({ activeFile: true });
            }
        }
        get showWarnings() {
            return this._showWarnings;
        }
        set showWarnings(showWarnings) {
            if (this._showWarnings !== showWarnings) {
                this._showWarnings = showWarnings;
                this._onDidChange.fire({ showWarnings: true });
            }
        }
        get showErrors() {
            return this._showErrors;
        }
        set showErrors(showErrors) {
            if (this._showErrors !== showErrors) {
                this._showErrors = showErrors;
                this._onDidChange.fire({ showErrors: true });
            }
        }
        get showInfos() {
            return this._showInfos;
        }
        set showInfos(showInfos) {
            if (this._showInfos !== showInfos) {
                this._showInfos = showInfos;
                this._onDidChange.fire({ showInfos: true });
            }
        }
        focus() {
            this._onFocus.fire();
        }
        layout(width) {
            if (width > 600) {
                this.class = 'markers-panel-action-filter grow';
            }
            else if (width < 400) {
                this.class = 'markers-panel-action-filter small';
            }
            else {
                this.class = 'markers-panel-action-filter';
            }
        }
    }
    exports.MarkersFilterAction = MarkersFilterAction;
    MarkersFilterAction.ID = 'workbench.actions.problems.filter';
    let FiltersDropdownMenuActionViewItem = class FiltersDropdownMenuActionViewItem extends dropdown_1.DropdownMenuActionViewItem {
        constructor(action, filterAction, actionRunner, contextMenuService) {
            super(action, { getActions: () => this.getActions() }, contextMenuService, action => undefined, actionRunner, undefined, action.class, () => { return 1 /* RIGHT */; });
            this.filterAction = filterAction;
        }
        render(container) {
            super.render(container);
            this.updateChecked();
        }
        getActions() {
            return [
                {
                    checked: this.filterAction.showErrors,
                    class: undefined,
                    enabled: true,
                    id: 'showErrors',
                    label: messages_1.default.MARKERS_PANEL_FILTER_LABEL_SHOW_ERRORS,
                    run: async () => this.filterAction.showErrors = !this.filterAction.showErrors,
                    tooltip: '',
                    dispose: () => null
                },
                {
                    checked: this.filterAction.showWarnings,
                    class: undefined,
                    enabled: true,
                    id: 'showWarnings',
                    label: messages_1.default.MARKERS_PANEL_FILTER_LABEL_SHOW_WARNINGS,
                    run: async () => this.filterAction.showWarnings = !this.filterAction.showWarnings,
                    tooltip: '',
                    dispose: () => null
                },
                {
                    checked: this.filterAction.showInfos,
                    class: undefined,
                    enabled: true,
                    id: 'showInfos',
                    label: messages_1.default.MARKERS_PANEL_FILTER_LABEL_SHOW_INFOS,
                    run: async () => this.filterAction.showInfos = !this.filterAction.showInfos,
                    tooltip: '',
                    dispose: () => null
                },
                new actionbar_1.Separator(),
                {
                    checked: this.filterAction.activeFile,
                    class: undefined,
                    enabled: true,
                    id: 'activeFile',
                    label: messages_1.default.MARKERS_PANEL_FILTER_LABEL_ACTIVE_FILE,
                    run: async () => this.filterAction.activeFile = !this.filterAction.activeFile,
                    tooltip: '',
                    dispose: () => null
                },
                {
                    checked: this.filterAction.excludedFiles,
                    class: undefined,
                    enabled: true,
                    id: 'useFilesExclude',
                    label: messages_1.default.MARKERS_PANEL_FILTER_LABEL_EXCLUDED_FILES,
                    run: async () => this.filterAction.excludedFiles = !this.filterAction.excludedFiles,
                    tooltip: '',
                    dispose: () => null
                },
            ];
        }
        updateChecked() {
            DOM.toggleClass(this.element, 'checked', this._action.checked);
        }
    };
    FiltersDropdownMenuActionViewItem = __decorate([
        __param(3, contextView_1.IContextMenuService)
    ], FiltersDropdownMenuActionViewItem);
    let MarkersFilterActionViewItem = class MarkersFilterActionViewItem extends actionbar_1.BaseActionViewItem {
        constructor(action, filterController, instantiationService, contextViewService, themeService, telemetryService, contextKeyService) {
            super(null, action);
            this.action = action;
            this.filterController = filterController;
            this.instantiationService = instantiationService;
            this.contextViewService = contextViewService;
            this.themeService = themeService;
            this.telemetryService = telemetryService;
            this.container = null;
            this.filterInputBox = null;
            this.filterBadge = null;
            this.focusContextKey = constants_1.default.MarkerPanelFilterFocusContextKey.bindTo(contextKeyService);
            this.delayedFilterUpdate = new async_1.Delayer(200);
            this._register(lifecycle_1.toDisposable(() => this.delayedFilterUpdate.cancel()));
            this._register(action.onFocus(() => this.focus()));
            this.filtersAction = new actions_1.Action('markersFiltersAction', messages_1.default.MARKERS_PANEL_ACTION_TOOLTIP_MORE_FILTERS, 'markers-filters codicon-filter');
            this.filtersAction.checked = this.hasFiltersChanged();
            this._register(action.onDidChange(() => this.filtersAction.checked = this.hasFiltersChanged()));
        }
        render(container) {
            this.container = container;
            DOM.addClass(this.container, 'markers-panel-action-filter-container');
            this.element = DOM.append(this.container, DOM.$(''));
            this.element.className = this.action.class || '';
            this.createInput(this.element);
            this.createControls(this.element);
            this.adjustInputBox();
        }
        focus() {
            if (this.filterInputBox) {
                this.filterInputBox.focus();
            }
        }
        hasFiltersChanged() {
            return !this.action.showErrors || !this.action.showWarnings || !this.action.showInfos || this.action.excludedFiles || this.action.activeFile;
        }
        createInput(container) {
            this.filterInputBox = this._register(this.instantiationService.createInstance(contextScopedHistoryWidget_1.ContextScopedHistoryInputBox, container, this.contextViewService, {
                placeholder: messages_1.default.MARKERS_PANEL_FILTER_PLACEHOLDER,
                ariaLabel: messages_1.default.MARKERS_PANEL_FILTER_ARIA_LABEL,
                history: this.action.filterHistory
            }));
            this.filterInputBox.inputElement.setAttribute('aria-labelledby', 'markers-panel-arialabel');
            this._register(styler_1.attachInputBoxStyler(this.filterInputBox, this.themeService));
            this.filterInputBox.value = this.action.filterText;
            this._register(this.filterInputBox.onDidChange(filter => this.delayedFilterUpdate.trigger(() => this.onDidInputChange(this.filterInputBox))));
            this._register(this.action.onDidChange((event) => {
                if (event.filterText) {
                    this.filterInputBox.value = this.action.filterText;
                }
            }));
            this._register(DOM.addStandardDisposableListener(this.filterInputBox.inputElement, DOM.EventType.KEY_DOWN, (e) => this.onInputKeyDown(e, this.filterInputBox)));
            this._register(DOM.addStandardDisposableListener(container, DOM.EventType.KEY_DOWN, this.handleKeyboardEvent));
            this._register(DOM.addStandardDisposableListener(container, DOM.EventType.KEY_UP, this.handleKeyboardEvent));
            const focusTracker = this._register(DOM.trackFocus(this.filterInputBox.inputElement));
            this._register(focusTracker.onDidFocus(() => this.focusContextKey.set(true)));
            this._register(focusTracker.onDidBlur(() => this.focusContextKey.set(false)));
            this._register(lifecycle_1.toDisposable(() => this.focusContextKey.reset()));
        }
        createControls(container) {
            const controlsContainer = DOM.append(container, DOM.$('.markers-panel-filter-controls'));
            this.createBadge(controlsContainer);
            this.createFilters(controlsContainer);
        }
        createBadge(container) {
            const filterBadge = this.filterBadge = DOM.append(container, DOM.$('.markers-panel-filter-badge'));
            this._register(styler_1.attachStylerCallback(this.themeService, { badgeBackground: colorRegistry_1.badgeBackground, badgeForeground: colorRegistry_1.badgeForeground, contrastBorder: colorRegistry_1.contrastBorder }, colors => {
                const background = colors.badgeBackground ? colors.badgeBackground.toString() : '';
                const foreground = colors.badgeForeground ? colors.badgeForeground.toString() : '';
                const border = colors.contrastBorder ? colors.contrastBorder.toString() : '';
                filterBadge.style.backgroundColor = background;
                filterBadge.style.borderWidth = border ? '1px' : '';
                filterBadge.style.borderStyle = border ? 'solid' : '';
                filterBadge.style.borderColor = border;
                filterBadge.style.color = foreground;
            }));
            this.updateBadge();
            this._register(this.filterController.onDidFilter(() => this.updateBadge()));
        }
        createFilters(container) {
            const actionbar = this._register(new actionbar_1.ActionBar(container, {
                actionViewItemProvider: action => {
                    if (action.id === this.filtersAction.id) {
                        return this.instantiationService.createInstance(FiltersDropdownMenuActionViewItem, action, this.action, this.actionRunner);
                    }
                    return undefined;
                }
            }));
            actionbar.push(this.filtersAction, { icon: true, label: false });
        }
        onDidInputChange(inputbox) {
            inputbox.addToHistory();
            this.action.filterText = inputbox.value;
            this.action.filterHistory = inputbox.getHistory();
            this.reportFilteringUsed();
        }
        updateBadge() {
            if (this.filterBadge) {
                const { total, filtered } = this.filterController.getFilterStats();
                DOM.toggleClass(this.filterBadge, 'hidden', total === filtered || filtered === 0);
                this.filterBadge.textContent = nls_1.localize('showing filtered problems', "Showing {0} of {1}", filtered, total);
                this.adjustInputBox();
            }
        }
        adjustInputBox() {
            if (this.element && this.filterInputBox && this.filterBadge) {
                this.filterInputBox.inputElement.style.paddingRight = DOM.hasClass(this.element, 'small') || DOM.hasClass(this.filterBadge, 'hidden') ? '25px' : '150px';
            }
        }
        // Action toolbar is swallowing some keys for action items which should not be for an input box
        handleKeyboardEvent(event) {
            if (event.equals(10 /* Space */)
                || event.equals(15 /* LeftArrow */)
                || event.equals(17 /* RightArrow */)
                || event.equals(9 /* Escape */)) {
                event.stopPropagation();
            }
        }
        onInputKeyDown(event, filterInputBox) {
            let handled = false;
            if (event.equals(9 /* Escape */)) {
                filterInputBox.value = '';
                handled = true;
            }
            if (handled) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
        reportFilteringUsed() {
            const filterOptions = this.filterController.getFilterOptions();
            const data = {
                errors: filterOptions.showErrors,
                warnings: filterOptions.showWarnings,
                infos: filterOptions.showInfos,
            };
            /* __GDPR__
                "problems.filter" : {
                    "errors" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                    "warnings": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                    "infos": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
                }
            */
            this.telemetryService.publicLog('problems.filter', data);
        }
        updateClass() {
            if (this.element && this.container) {
                this.element.className = this.action.class || '';
                DOM.toggleClass(this.container, 'grow', DOM.hasClass(this.element, 'grow'));
                this.adjustInputBox();
            }
        }
    };
    MarkersFilterActionViewItem = __decorate([
        __param(2, instantiation_1.IInstantiationService),
        __param(3, contextView_1.IContextViewService),
        __param(4, themeService_1.IThemeService),
        __param(5, telemetry_1.ITelemetryService),
        __param(6, contextkey_1.IContextKeyService)
    ], MarkersFilterActionViewItem);
    exports.MarkersFilterActionViewItem = MarkersFilterActionViewItem;
    class QuickFixAction extends actions_1.Action {
        constructor(marker) {
            super(QuickFixAction.ID, messages_1.default.MARKERS_PANEL_ACTION_TOOLTIP_QUICKFIX, QuickFixAction.CLASS, false);
            this.marker = marker;
            this._onShowQuickFixes = this._register(new event_1.Emitter());
            this.onShowQuickFixes = this._onShowQuickFixes.event;
            this._quickFixes = [];
        }
        get quickFixes() {
            return this._quickFixes;
        }
        set quickFixes(quickFixes) {
            this._quickFixes = quickFixes;
            this.enabled = this._quickFixes.length > 0;
        }
        autoFixable(autofixable) {
            this.class = autofixable ? QuickFixAction.AUTO_FIX_CLASS : QuickFixAction.CLASS;
        }
        run() {
            this._onShowQuickFixes.fire();
            return Promise.resolve();
        }
    }
    exports.QuickFixAction = QuickFixAction;
    QuickFixAction.ID = 'workbench.actions.problems.quickfix';
    QuickFixAction.CLASS = 'markers-panel-action-quickfix codicon-lightbulb';
    QuickFixAction.AUTO_FIX_CLASS = QuickFixAction.CLASS + ' autofixable';
    let QuickFixActionViewItem = class QuickFixActionViewItem extends actionbar_1.ActionViewItem {
        constructor(action, contextMenuService) {
            super(null, action, { icon: true, label: false });
            this.contextMenuService = contextMenuService;
        }
        onClick(event) {
            DOM.EventHelper.stop(event, true);
            this.showQuickFixes();
        }
        showQuickFixes() {
            if (!this.element) {
                return;
            }
            if (!this.isEnabled()) {
                return;
            }
            const elementPosition = DOM.getDomNodePagePosition(this.element);
            const quickFixes = this.getAction().quickFixes;
            if (quickFixes.length) {
                this.contextMenuService.showContextMenu({
                    getAnchor: () => ({ x: elementPosition.left + 10, y: elementPosition.top + elementPosition.height + 4 }),
                    getActions: () => quickFixes
                });
            }
        }
    };
    QuickFixActionViewItem = __decorate([
        __param(1, contextView_1.IContextMenuService)
    ], QuickFixActionViewItem);
    exports.QuickFixActionViewItem = QuickFixActionViewItem;
    themeService_1.registerThemingParticipant((theme, collector) => {
        const inputActiveOptionBorderColor = theme.getColor(colorRegistry_1.inputActiveOptionBorder);
        if (inputActiveOptionBorderColor) {
            collector.addRule(`.markers-panel-action-filter > .markers-panel-filter-controls > .monaco-action-bar .action-label.markers-filters.checked { border-color: ${inputActiveOptionBorderColor}; }`);
        }
        const inputActiveOptionBackgroundColor = theme.getColor(colorRegistry_1.inputActiveOptionBackground);
        if (inputActiveOptionBackgroundColor) {
            collector.addRule(`.markers-panel-action-filter > .markers-panel-filter-controls > .monaco-action-bar .action-label.markers-filters.checked { background-color: ${inputActiveOptionBackgroundColor}; }`);
        }
    });
});
//# sourceMappingURL=markersPanelActions.js.map