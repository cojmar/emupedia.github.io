// noinspection DuplicatedCode,ThisExpressionReferencesGlobalObjectJS,JSUnusedLocalSymbols
(function(global) {
	console.log('╔═╗╔╦╗╦ ╦╔═╗╔═╗╔╦═╗╦╔═╗\n' +
				'╠═ ║║║║ ║╠═╝╠═  ║ ║║╠═╣\n' +
				'╚═╝╩ ╩╚═╝╩  ╚═╝═╩═╝╩╩ ╩');

	var $document						= null;
	var $window							= null;
	var $html							= null;
	var $body							= null;
	var $container						= null;

	var dbx								= null;
	var video							= null;

	// noinspection JSFileReferences,JSUnresolvedFunction
	requirejs.config({
		waitSeconds: 300,
		paths: {
			browserfs: '../../../../js/libraries/browserfs-1.4.3.min',
			dropbox: '../../../../js/libraries/dropbox-4.0.30.min',
			simplestorage: '../../../../js/libraries/simplestorage-0.2.1.min',
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
		'es6fetch',
		'simplestorage'
	], function($, browserfs, dropbox, fetch, simplestorage) {
		// noinspection DuplicatedCode
		$(function() {
			// noinspection JSUnresolvedFunction
			dbx = new dropbox.Dropbox({accessToken: window['DROPBOX_TOKEN'], fetch: fetch.fetch});

			$document			= $(document);
			$window				= $(window);
			$html				= $('html');
			$body				= $('body');
			$container			= $('.container');

			// noinspection JSUnresolvedVariable
			if (SYSTEM_FEATURE_CANVAS && SYSTEM_FEATURE_TYPED_ARRAYS && SYSTEM_FEATURE_ASMJS) {
				if (typeof simplestorage.get('intro') === 'undefined') {
					video = $('<video />', {
						class: 'fullscreen',
						src: 'media/sierra.mp4',
						type: 'video/mp4',
						preload: 'auto',
						autoplay: true
					});

					// noinspection DuplicatedCode
					$(video).off('ended').one('ended', function() {
						$(video).attr('src', 'media/valve.mp4');
						$(video).off('ended').one('ended', function() {
							$(video).remove();

							video = $('<video />', {
								src: 'media/logo.mp4',
								type: 'video/mp4',
								preload: 'auto',
								autoplay: true,
								muted: true,
								loop: true
							});

							simplestorage.set('intro', true);
							$container.find('.logo').append(video);
						});
					}).off('click').one('click', function() {
						$(video).attr('src', 'media/valve.mp4');
						$(video).off('click').one('click', function() {
							$(video).remove();

							video = $('<video />', {
								src: 'media/logo.mp4',
								type: 'video/mp4',
								preload: 'auto',
								autoplay: true,
								muted: true,
								loop: true
							});

							simplestorage.set('intro', true);
							$container.find('.logo').append(video);
						});
					});

					$container.prepend(video);
				} else {
					video = $('<video />', {
						src: 'media/logo.mp4',
						type: 'video/mp4',
						preload: 'auto',
						autoplay: true,
						muted: true,
						loop: true
					});

					$container.find('.logo').append(video);
				}

				// noinspection DuplicatedCode
				$window.off('resize').on('resize', function() {

				});
				$window.trigger('resize');
			} else {
				alert('Half-Life cannot work because your browser is not supported!')
			}
		});
	});
} (this));