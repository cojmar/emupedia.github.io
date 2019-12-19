// noinspection DuplicatedCode,ThisExpressionReferencesGlobalObjectJS,JSUnusedLocalSymbols
(function(global) {
	console.log('╔═╗╔╦╗╦ ╦╔═╗╔═╗╔╦═╗╦╔═╗\n' +
				'╠═ ║║║║ ║╠═╝╠═  ║ ║║╠═╣\n' +
				'╚═╝╩ ╩╚═╝╩  ╚═╝═╩═╝╩╩ ╩');

	var $html							= null;
	var $body							= null;
	var $window							= null;
	var $document						= null;

	var dbx								= null;

	// noinspection JSFileReferences,JSUnresolvedFunction
	requirejs.config({
		waitSeconds: 300,
		paths: {
			browserfs: '../../../../js/libraries/browserfs-1.4.3.min',
			dropbox: '../../../../js/libraries/dropbox-4.0.30.min',
			es6promise: '../../../../js/polyfills/es6-promise-auto-4.2.8.min',
			es6fetch: '../../../../js/polyfills/es6-fetch-3.0.0',
			jquery: '../../../../js/libraries/jquery-3.4.1.min',
			json: '../../../../js/libraries/requirejs-json-1.0.3',
			text: '../../../../js/libraries/requirejs-text-2.0.15'
		},
		shim: {
			browserfs: {
				exports: 'BrowserFS',
				deps: ['es6promise'],
				init: function(es6promise) {
					window.Promise = es6promise;
				}
			},
			es6promise: {
				exports: 'Promise'
			}
		}
	});

	// noinspection JSCheckFunctionSignatures,JSUnusedLocalSymbols
	requirejs([
		'jquery',
		'browserfs',
		'dropbox',
		'es6fetch'
	], function($, browserfs, dropbox, fetch) {
		// noinspection DuplicatedCode
		$(function() {
			// noinspection JSUnresolvedFunction
			dbx = new dropbox.Dropbox({accessToken: window['DROPBOX_TOKEN'], fetch: fetch.fetch});

			$document			= $(document);
			$window				= $(window);
			$html				= $('html');
			$body				= $('body');

			// noinspection JSUnresolvedVariable
			if (SYSTEM_FEATURE_CANVAS && SYSTEM_FEATURE_TYPED_ARRAYS && SYSTEM_FEATURE_ASMJS) {
				// noinspection DuplicatedCode
				$window.off('resize').on('resize', function() {
					$body.find('.select2-container--bootstrap4 .select2-results > .select2-results__options').css({
						'max-height': $window.height() - 57
					});
				});
				$window.trigger('resize');
			} else {
				alert('Half-Life cannot work because your browser is not supported!')
			}
		});
	});
} (this));