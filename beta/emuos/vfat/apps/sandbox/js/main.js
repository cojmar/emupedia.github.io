// noinspection ThisExpressionReferencesGlobalObjectJS,JSUnusedLocalSymbols
(function(global) {
	'use strict';

	// noinspection JSUnusedLocalSymbols,DuplicatedCode
	define('optional', [], {
		load: function(name, req, onload, config) {
			var onLoadSuccess = function(moduleInstance) {
				onload(moduleInstance);
			};

			var onLoadFailure = function(err) {
				var failedId = err.requireModules && err.requireModules[0];
				console.warn('Could not load optional module: ' + failedId);

				requirejs.undef(failedId);

				// noinspection JSRedundantSwitchStatement
				switch (failedId) {
					default:
						define(failedId, [], function(){return {};});
						break;
				}

				req([failedId], onLoadSuccess);
			};

			req([name], onLoadSuccess, onLoadFailure);
		},
		normalize: function (name, normalize) {
			return normalize(name);
		}
	});

	define('github', [], {
		load: function (name, req, onload, config) {
			// noinspection DuplicatedCode
			var obj = {
				use_get_files_contents: false,
				cache_prefix: 'github!',
				cache: {},
				storage_usable: (function() {
					var mod = 'test';

					if (typeof localStorage !== 'undefined') {
						if (typeof localStorage.setItem === 'function' && typeof localStorage.removeItem === 'function') {
							try {
								localStorage.setItem(mod, mod);
								localStorage.removeItem(mod);
								return true;
							} catch (e) {
								return false;
							}
						}
					}

					return false;
				})(),
				get_cache: function (url) {
					var item = obj.cache_prefix + url;
					var ret = !!obj.cache[item] ? obj.cache[item] : false;

					if (!ret && obj.storage_usable) {
						var s_data = localStorage.getItem(item);

						if (s_data) {
							try {
								s_data = JSON.parse(s_data);
							} catch (e) {
								s_data = false;
							}

							if (s_data) {
								ret = obj.cache[url] = s_data;
							}
						}
					}

					return ret;
				},
				set_cache: function (url, data) {
					var item = obj.cache_prefix + url;
					obj.cache[item] = data;

					if (obj.storage_usable) {
						localStorage.setItem(item, JSON.stringify(data));
					}
				},
				get_files_contents: function (data, cb) {
					var tmp_data = JSON.parse(JSON.stringify(data));
					var ret_data = [];
					var files_count = 0;
					var loaded_count = 0;

					for (var file_index in tmp_data) {
						// noinspection JSUnfilteredForInLoop
						if (tmp_data[file_index].type === 'file') {
							files_count++;
						}
					}

					for (var file_data in tmp_data) {
						// noinspection JSUnfilteredForInLoop
						if (tmp_data[file_data].type === 'file') {
							// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
							obj.load_url(obj.get_cache(tmp_data[file_data].download_url) || {url: tmp_data[file_data].download_url}, function (data) {
								for (var file_index in tmp_data) {
									// noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
									if (tmp_data[file_index].download_url === data.url) {
										// noinspection JSUnfilteredForInLoop
										tmp_data[file_index].content = data.response;
										// noinspection JSUnfilteredForInLoop
										ret_data.push(tmp_data[file_index]);
										break;
									}
								}

								loaded_count++;

								if (loaded_count === files_count) {
									if (typeof cb === 'function') {
										cb(ret_data);
									}
								}
							});
						} else {
							// noinspection JSUnfilteredForInLoop
							ret_data.push(tmp_data[file_data]);
						}
					}
				},
				load: function (url, cb) {
					obj.use_get_files_contents = false;

					if (!!url) {
						if (url.indexOf('get-content!') !== -1) {
							obj.use_get_files_contents = true;
							url = url.split('get-content!').join('');
						}

						if (url.indexOf('https://api.github.com/repos/') === -1) {
							url = 'https://api.github.com/repos/' + url;
						}
					}

					var data = obj.get_cache(url) || {url: url};

					obj.load_url(data, function (ret) {
						if (obj.use_get_files_contents) {
							if (Array.isArray(ret.response)) {
								obj.get_files_contents(ret.response, cb);
							} else if (typeof cb === 'function') {
								cb(ret.response);
							}
						} else {
							if (typeof cb === 'function') {
								cb(ret.response);
							}
						}
					});
				},
				load_url: function (data, cb) {
					var xml_http = new XMLHttpRequest();

					xml_http.onreadystatechange = function() {
						if (xml_http.readyState === 4) {
							var response = data.response || false;

							if (xml_http.status === 200) {
								try {
									response = JSON.parse(xml_http.response);
								} catch (e) {
									response = xml_http.response;
								}
							}

							var ret = data.url.indexOf('api.github.com') !== -1 ? {
								url: data.url,
								token: xml_http.getResponseHeader('ETag'),
								limit_remaining: xml_http.getResponseHeader('X-RateLimit-Remaining'),
								limit_reset: xml_http.getResponseHeader('X-RateLimit-Reset'),
								last_modified: xml_http.getResponseHeader('Last-Modified'),
								status: xml_http.status,
								response: response
							} : {
								url: data.url,
								status: xml_http.status,
								response: response
							};

							if (xml_http.status === 200) {
								obj.set_cache(data.url, ret);
							}

							if (typeof cb === 'function') {
								cb(ret);
							}
						}
					};

					xml_http.open('GET', data.url);

					if (data) {
						if (data.token) {
							xml_http.setRequestHeader('If-None-Match', data.token);
						}

						if (data.last_modified) {
							xml_http.setRequestHeader('If-Modified-Since', data.last_modified);
						}
					}

					xml_http.send();
				}
			};

			// noinspection JSUnresolvedVariable
			if (config.isBuild && config.inlineJSON === false) {
				onload(null);
			} else {
				obj.load(name, onload);
			}
		},
		normalize: function (name, normalize) {
			return normalize(name);
		}
	});

	requirejs.config({
		waitSeconds: 300,
		paths: {
			editor: 'editor',
			preview: 'preview',
			jquery: '../../../../js/libraries/jquery-3.4.1.min',
			jqueryresizable: '../../../../js/libraries/jquery-resizable-0.35.0.min',
			vs: '../../../../js/libraries/vs'
		},
		shim: {
			jqueryresizable: {
				deps: ['jquery']
			}
		}
	});

	requirejs(['jquery', 'jqueryresizable', 'editor', 'preview'], function($, resizble, editor, preview) {
		$(function() {
			var app = {
				editor: editor,
				preview: preview,
				current_item_data: ['', '', ''],
				on_editor_change: function() {
					// noinspection JSUnresolvedFunction
					app.current_item_data[1] = app.editor.getValue();

					if (!app.no_preview) {
						// noinspection JSUnresolvedFunction
						app.preview.setValue(app.current_item_data.join(''), app.config);
					}
				},
				init_config: function() {
					app.config = {
						baseurl: false,
						repo: false,
						capsule: false
					};

					var url_params = new URLSearchParams(window.location.search);

					for (var n in app.config) {
						// noinspection JSUnfilteredForInLoop
						if (url_params.has(n)) {
							// noinspection JSUnfilteredForInLoop
							app.config[n] = url_params.getAll(n);
						}
					}

					var menu_url = 'github!get-content!' + app.config.repo;

					if (app.config.repo) {
						require([menu_url], function (data) {
							app.menu_items = data;
							app.init_menu();
						});
					}

					return app;
				},
				init_editor: function() {
					app.editor.on_change = app.on_editor_change;

					return app;
				},
				init_resize: function() {
					$('.panel-left').resizable({
						handleSelector: '.splitter',
						resizeHeight: false,
						onDrag: function() {
							// noinspection JSUnresolvedFunction
							app.editor.layout();
						},
						onDragEnd: function() {
							// noinspection JSUnresolvedFunction
							app.editor.layout();
						}
					});

					return app;
				},
				show_active_menu_item: function() {
					var tmp_val, item = $('.menu-item.active').data('item');
					var ov = tmp_val = app.menu_items[item].content;

					app.no_preview = true;
					// noinspection JSUnresolvedFunction
					app.editor.setValue(ov);
					app.no_preview = false;
					// noinspection JSUnresolvedFunction
					app.editor.do_action('Format Document');
				},
				init_menu: function() {
					for (var n in app.menu_items) {
						// noinspection JSUnfilteredForInLoop
						$('#menu').append('<div class="menu-item" data-item="' + n + '">' + app.menu_items[n].name + '</div>');
					}

					$('.menu-item').addClass('active').off('click').on('click', function() {
						$('.menu-item').removeClass('active');
						$(this).addClass('active');
						app.show_active_menu_item();
					});

					app.show_active_menu_item();

					return app;
				},
				init: function() {
					app.init_config().init_resize().init_editor();
				}
			};

			app.init();
		});
	});
} (this));