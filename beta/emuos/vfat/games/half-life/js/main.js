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
	var $canvas							= null;
	var $progress						= null;
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
	], function($, BrowserFS, dropbox, fetch, simplestorage) {
		// noinspection DuplicatedCode
		$(function() {
			$document	= $(document);
			$window		= $(window);
			$html		= $('html');
			$body		= $('body');
			$container	= $('.container');
			$canvas		= $('div.fullscreen');
			$progress	= $body.find('progress').first();
			// noinspection JSUnresolvedFunction
			dbx			= new dropbox.Dropbox({accessToken: window['DROPBOX_TOKEN'], fetch: fetch.fetch});

			(function() {
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

				var canvas = $('<canvas/>', {
					id: 'canvas',
					oncontextmenu: 'event.preventDefault()'
				});

				$canvas.append(canvas);
				$container.find('.menu button').attr('disabled', 'disabled');
			})();

			var moduleCount = 0;
			var run = null;
			var mfs = null;

			function loadModule(name) {
				var script = document.createElement('script');

				script.onload = function() {
					moduleCount++;

					if (moduleCount === 3) {
						initEvents();
					}
				};

				document.body.appendChild(script);
				script.src = name + '.js';
			}

			function mountZIP(data) {
				var Buffer = BrowserFS.BFSRequire('buffer').Buffer;
				// noinspection JSUnresolvedFunction
				mfs.mount('/zip', new BrowserFS.FileSystem.ZipFS(Buffer.from(data)));

				try {
					FS.mount(new BrowserFS.EmscriptenFS(), {root: '/zip'}, '/rodir');
				} catch (e) {
					var canvas = $('<canvas/>', {
						id: 'canvas',
						oncontextmenu: 'event.preventDefault()'
					});

					$canvas.html('').append(canvas).hide();

					FS.unmount('/rodir');
					FS.mount(new BrowserFS.EmscriptenFS(), {root: '/zip'}, '/rodir');
				}
			}

			function fetchZIP(packageName, cb) {
				$progress.css({
					visibility: 'visible'
				});

				dbx.filesGetTemporaryLink({path: '/halflife1/' + packageName}).then(function (response) {
					var xhr = new XMLHttpRequest();
					xhr.open('GET', response.link, true);
					xhr.responseType = 'arraybuffer';
					xhr.onprogress = function (event) {
						var percentComplete = event.loaded / event.total * 100;
						if (Module['setStatus']) Module['setStatus']('Downloading data... (' + event.loaded + '/' + event.total + ')');
					};
					xhr.onload = function (event) {
						if (xhr.status === 200 || xhr.status === 304 || xhr.status === 206 || (xhr.status === 0 && xhr.response)) {
							mountZIP(xhr.response);
							$progress.css({
								visibility: 'hidden'
							});

							$canvas.show();
							cb();
						} else {
							throw new Error(xhr.statusText + " : " + xhr.responseURL);
						}
					};
					xhr.send(null);
				}).catch(function (error) {
					console.log(error);
				});
			}

			function init() {
				run = window.Module.run;
				window.run = window.Module.run = function() {};

				window.ENV.XASH3D_GAMEDIR = 'valve';
				window.ENV.XASH3D_RODIR = '/rodir';

				loadModule('js/server');
				loadModule('js/client');
				loadModule('js/menu');
			}

			function initEvents() {
				$container.find('.menu button.hc, .menu button.uplink, .menu button.hldm, .menu button.dayone').removeAttr('disabled');

				$document.off('click', '.menu button').on('click', '.menu button', function() {
					if (!$(this).is('[disabled]')) {
						start($(this).attr('class'));
					}
				});

				window.onerror = function (event) {
					if (('' + event).indexOf('SimulateInfiniteLoop') > 0) {
						window.location = window.location;
					}
				};
			}

			function start(game) {
				try {
					window.FS.mkdir('/rodir');
					window.FS.mkdir('/xash');
				} catch (e) {}

				mfs = new BrowserFS.FileSystem.MountableFileSystem();
				BrowserFS.initialize(mfs);
				window.FS.chdir('/xash/');
				window.Module.run = window.run = run;
				fetchZIP(game + '.zip', run);
			}

			// noinspection JSUnresolvedVariable
			if (SYSTEM_FEATURE_CANVAS && SYSTEM_FEATURE_TYPED_ARRAYS && SYSTEM_FEATURE_ASMJS) {
				window.Module = {
					TOTAL_MEMORY: 150 * 1024 * 1024,
					preInit: [init],
					preRun: [],
					postRun: [],
					print: function() {},
					printErr: function() {},
					canvas: $container.find('canvas').get(0),
					setStatus: function(text) {
						var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
						var progressElement = $progress.get(0);

						if (m) {
							progressElement.value = parseInt(m[2]) * 100;
							progressElement.max = parseInt(m[4]) * 100;
						} else {
							progressElement.value = null;
							progressElement.max = null;
						}
					},
					totalDependencies: 0,
					monitorRunDependencies: function (left) {
						this.totalDependencies = Math.max(this.totalDependencies, left);

						if (left) {
							Module.setStatus('Preparing... (' + (this.totalDependencies - left) + '/' + this.totalDependencies + ')');
						}
					},
					websocket: {
						url: 'wsproxy://mittorn.fwgs.ru:3000/'
					}
				};
				window.ENV = {};
				window.showElement = function(id, show) {
					console.log(id);
				};

				(function() {
					var memoryInitializer = 'js/xash.html.mem';

					if (typeof Module['locateFile'] === 'function') {
						memoryInitializer = Module['locateFile'](memoryInitializer);
					} else if (Module['memoryInitializerPrefixURL']) {
						memoryInitializer = Module['memoryInitializerPrefixURL'] + memoryInitializer;
					}

					var xhr = Module['memoryInitializerRequest'] = new XMLHttpRequest();
					xhr.open('GET', memoryInitializer, true);
					xhr.responseType = 'arraybuffer';
					xhr.send(null);
				})();

				var script = document.createElement('script');
				script.src = 'js/xash.js';
				document.body.appendChild(script);
			} else {
				alert('Half-Life cannot work because your browser is not supported!')
			}
		});
	});
} (this));