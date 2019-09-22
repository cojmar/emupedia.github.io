define(['jquery'], function ($) {
	// noinspection DuplicatedCode
	var obj = {
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
		preview_selector: false,
		process_data: function (data, config) {
			var ret = data;

			if (config.baseurl) {
				// noinspection HtmlRequiredTitleElement
				ret = ret.replace('<head>', '<head><base href="' + config.baseurl + '">');
			}

			return ret;
		},
		set_preview: function (data, config) {
			if (!obj.preview_selector.html) {
				return false;
			}

			obj.preview_selector.html('<iframe id="preview_frame" />');

			var iframe = document.getElementById('preview_frame');
			iframe = iframe.contentWindow || (iframe.contentDocument.document || iframe.contentDocument);
			iframe.document.open();
			iframe.document.write(obj.process_data(data, config));
			iframe.document.close();
		},
		init_preview: function() {
			obj.preview_selector = obj.dom_object('preview');
		},
		init: function() {
			obj.init_preview();

			return {
				setValue: obj.set_preview
			}
		}
	};

	return obj.init();
});