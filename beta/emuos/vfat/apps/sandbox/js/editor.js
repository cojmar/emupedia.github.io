define(['vs/editor/editor.main'], function(monaco) {
	// noinspection DuplicatedCode
	var obj = {
		editor: false,
		dom_object: function (dom_id) {
			var selector = $('#' + dom_id);

			if (!selector.length > 0) {
				$('body').append('<div id="' + dom_id + '"></div>');
				selector = $('#' + dom_id);
			}

			if (!selector.length > 0) {
				return false;
			}

			return selector;
		},
		monaco_layout: function() {
			if (!obj.editor) return false;
			obj.editor.layout();
		},
		timeout_editor_changed: false,
		on_editor_change: function() {
			if (!obj.editor) return false;
			clearTimeout(obj.timeout_editor_changed);
			obj.timeout_editor_changed = setTimeout(function () {
				if (typeof obj.editor.on_change === 'function') obj.editor.on_change();
			}, 100);
		},
		init_monaco: function() {
			if (obj.editor_selector = obj.dom_object('editor')) {
				obj.editor_selector = obj.editor_selector.get(0);

				obj.editor = monaco.editor.create(obj.editor_selector, {
					value: '',
					theme: 'vs-dark',
					language: 'html',
					scrollBeyondLastColumn: true,
					scrollBeyondLastLine: true
				});
				obj.editor.onDidChangeModelContent(obj.on_editor_change);
				obj.editor.do_action = function (action) {
					var actions = obj.editor.getActions();
					for (var editor_action_index in actions) {
						var editor_action = actions[editor_action_index];
						if (editor_action.label === action) {
							editor_action.run();
							break;
						}
					}
				}
			}

			$(window).off('resize').on('resize', function () {
				obj.monaco_layout();
			});
			$(window).trigger('resize');

			return obj.editor;
		},
		init: function() {
			return obj.init_monaco();
		}
	};

	return obj.init();
});