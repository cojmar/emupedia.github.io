// noinspection ThisExpressionReferencesGlobalObjectJS,JSUnusedLocalSymbols
(function(global) {
	'use strict';

	var $html							= null;
	var $body							= null;
	var $window							= null;
	var $document						= null;
	var $canvas							= null;
	var $version_dropdown				= null;
	var $list_dropdown_v1				= null;
	var $list_dropdown_v2				= null;
	var $options_dropdown				= null;
	var $list_table						= null;
	var $preview						= null;
	var $start							= null;

	var dbx								= null;
	var perfect_scrollbar				= null;
	var lightslider						= null;
	var first							= true;
	var started							= false;

	// noinspection JSFileReferences,JSUnresolvedFunction
	requirejs.config({
		waitSeconds: 300,
		paths: {
			bootstrap: '../../../../js/libraries/bootstrap-4.3.1.min',
			browserfs: '../../../../js/libraries/browserfs-1.4.3.min',
			'datatables.net': '../../../../js/libraries/datatables-1.10.20.min',
			'datatables.net-bs4': '../../../../js/libraries/datatables-bootstrap4-1.10.20.min',
			'datatables.net-editor': '../../../../js/libraries/datatables-editor-1.6.7.min',
			'datatables.net-buttons': '../../../../js/libraries/datatables-buttons-1.6.1.min',
			'datatables.net-buttons-colvis': '../../../../js/libraries/datatables-buttons-colvis-1.6.1.min',
			'datatables.net-buttons-html5': '../../../../js/libraries/datatables-buttons-html5-1.6.1.min',
			'datatables.net-buttons-print': '../../../../js/libraries/datatables-buttons-print-1.6.1.min',
			'datatables.net-buttons-bs4': '../../../../js/libraries/datatables-buttons-bootstrap4-1.6.1.min',
			'datatables.net-colreorder': '../../../../js/libraries/datatables-colreorder-1.5.2.min',
			'datatables.net-colreorder-bs4': '../../../../js/libraries/datatables-colreorder-bootstrap4-1.5.2.min',
			'datatables.net-fixedcolumns': '../../../../js/libraries/datatables-fixedcolumns-3.3.0.min',
			'datatables.net-fixedcolumns-bs4': '../../../../js/libraries/datatables-fixedcolumns-bootstrap4-3.3.0.min',
			'datatables.net-fixedheader': '../../../../js/libraries/datatables-fixedheader-3.1.6.min',
			'datatables.net-fixedheader-bs4': '../../../../js/libraries/datatables-fixedheader-bootstrap4-3.1.6.min',
			'datatables.net-responsive': '../../../../js/libraries/datatables-responsive-2.2.3.min',
			'datatables.net-responsive-bs4': '../../../../js/libraries/datatables-responsive-bootstrap4-2.2.3.min',
			'datatables.net-select': '../../../../js/libraries/datatables-select-1.3.1.min',
			'datatables.net-select-bs4': '../../../../js/libraries/datatables-select-bootstrap4-1.3.1.min',
			dropbox: '../../../../js/libraries/dropbox-4.0.30.min',
			es6promise: '../../../../js/polyfills/es6-promise-auto-4.2.8.min',
			es6fetch: '../../../../js/polyfills/es6-fetch-3.0.0',
			jquery: '../../../../js/libraries/jquery-3.4.1.min',
			jsdos: '../../../../js/libraries/js-dos-6.22.46.min',
			json: '../../../../js/libraries/requirejs-json-1.0.3',
			jsonpath: '../../../../js/libraries/jsonpath-1.0.2.min',
			jszip: '../../../../js/libraries/jszip-3.2.2.min',
			'lightgallery': '../../../../js/libraries/lightgallery-1.6.12.min',
			'lightgallery-autoplay': '../../../../js/libraries/lightgallery-autoplay-1.6.12.min',
			'lightgallery-fullscreen': '../../../../js/libraries/lightgallery-fullscreen-1.6.12.min',
			'lightgallery-hash': '../../../../js/libraries/lightgallery-hash-1.6.12.min',
			'lightgallery-pager': '../../../../js/libraries/lightgallery-pager-1.6.12.min',
			'lightgallery-share': '../../../../js/libraries/lightgallery-share-1.6.12.min',
			'lightgallery-thumbnail': '../../../../js/libraries/lightgallery-thumbnail-1.6.12.min',
			'lightgallery-video': '../../../../js/libraries/lightgallery-video-1.6.12.min',
			'lightgallery-zoom': '../../../../js/libraries/lightgallery-zoom-1.6.12.min',
			'lightslider': '../../../../js/libraries/lightslider-1.1.6.min',
			loader: '../../../../js/libraries/emularity',
			moment: '../../../../js/libraries/moment-2.24.0.min',
			'moment-timezone': '../../../../js/libraries/moment-timezone-0.5.27.min',
			pdfmake: '../../../../js/libraries/pdfmake-0.1.62.min',
			'pdfmake-fonts': '../../../../js/libraries/pdfmake-fonts-0.1.62',
			'perfect-scrollbar': '../../../../js/libraries/perfect-scrollbar-1.4.0.min',
			popper: '../../../../js/libraries/popper-1.16.0.min',
			purl: '../../../../js/libraries/purl-2.3.1',
			select2: '../../../../js/libraries/select2-4.0.11.min',
			text: '../../../../js/libraries/requirejs-text-2.0.15'
		},
		shim: {
			bootstrap: {
				deps: ['jquery', 'popper', 'lightslider']
			},
			browserfs: {
				exports: 'BrowserFS',
				deps: ['es6promise'],
				init: function(es6promise) {
					window.Promise = es6promise;
				}
			},
			'datatables.net-bs4': {
				deps: ['datatables.net-editor']
			},
			'datatables.net-buttons-bs4': {
				deps: ['datatables.net-buttons-colvis', 'datatables.net-buttons-html5', 'datatables.net-buttons-print']
			},
			'datatables.net-buttons-html5': {
				deps: ['pdfmake-fonts']
			},
			es6promise: {
				exports: 'Promise'
			},
			jsdos: {
				exports: 'Dos'
			},
			'lightgallery-autoplay': {
				deps: ['lightgallery']
			},
			'lightgallery-fullscreen': {
				deps: ['lightgallery']
			},
			'lightgallery-pager': {
				deps: ['lightgallery']
			},
			'lightgallery-hash': {
				deps: ['lightgallery']
			},
			'lightgallery-share': {
				deps: ['lightgallery']
			},
			'lightgallery-thumbnail': {
				deps: ['lightgallery']
			},
			'lightgallery-video': {
				deps: ['lightgallery']
			},
			'lightgallery-zoom': {
				deps: ['lightgallery']
			},
			lightslider: {
				deps: ['jquery']
			},
			purl: {
				deps: ['jquery']
			},
			'pdfmake-fonts': {
				exports: 'pdfMake',
				deps: ['jszip', 'pdfmake', 'moment-timezone'],
				init: function(JSZip, pdfMake, moment) {
					window.JSZip = JSZip;
					window.moment = moment;
				}
			},
			loader: {
				deps: ['browserfs'],
				init: function(browserfs) {
					window.BrowserFS = browserfs;
				}
			},
			'moment-timezone': {
				exports: 'moment',
				deps: ['moment']
			}
		}
	});

	// noinspection JSCheckFunctionSignatures,JSUnusedLocalSymbols
	requirejs([
		'jquery',
		'json!config/games-v1.json',
		'json!config/games-v2.json',
		'json!config/games-v3.json',
		'purl',
		'browserfs',
		'jsdos',
		'dropbox',
		'es6fetch',
		'jsonpath',
		'loader',
		'bootstrap',
		'datatables.net',
		'datatables.net-bs4',
		'datatables.net-buttons-bs4',
		'datatables.net-colreorder-bs4',
		'datatables.net-fixedcolumns-bs4',
		'datatables.net-fixedheader-bs4',
		'datatables.net-responsive-bs4',
		'datatables.net-select-bs4',
		'perfect-scrollbar',
		'select2'
	], function($, games_v1, games_v2, games_v3, purl, browserfs, Dos, dropbox, fetch, jp, loader, bootstrap, dt, datatablesbs4, datatablesbuttonsbs4, datatablescolreorderbs4, datatablesfixedcolumnsbs4, datatablesfixedheaderbs4, datatablesresponsivebs4, datatablesselectbs4, PerfectScrollbar, select2) {
		$(function() {
			// noinspection JSUnusedLocalSymbols
			function format_name(name) {
				return typeof name !== 'undefined' ? name : '?';
			}

			function format_version(version) {
				return typeof version !== 'undefined' ? version : '-';
			}

			function format_bytes(bytes, decimals) {
				if (bytes === 0) {
					return '0 Bytes';
				}

				var k = 1024,
					dm = decimals <= 0 ? 0 : decimals || 2,
					sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
					i = Math.floor(Math.log(bytes) / Math.log(k));
					i = i === 1 && bytes >= 1000000 ? 2 : i;

				return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
			}

			// noinspection JSUnusedLocalSymbols
			function v1_to_v2(v1) {
				var v2 = {
					"format": {
						"version": "2.0"
					},
					"software": {
						"type": [{
							"id": "action",
							"name": "Action",
							"games": []
						} , {
							"id": "adventure",
							"name": "Adventure",
							"games": []
						} , {
							"id": "arcade",
							"name": "Arcade",
							"games": []
						} , {
							"id": "artillery",
							"name": "Artillery",
							"games": []
						} , {
							"id": "apaddle",
							"name": "Arcade Paddle",
							"games": []
						} , {
							"id": "aplatformer",
							"name": "Arcade Platformer",
							"games": []
						} , {
							"id": "ashooter",
							"name": "Arcade Shooter",
							"games": []
						} , {
							"id": "sports",
							"name": "Arcade Sports",
							"games": []
						} , {
							"id": "board",
							"name": "Board Game",
							"games": []
						} , {
							"id": "economic",
							"name": "Economic Simulator",
							"games": []
						} , {
							"id": "fighting",
							"name": "Fighting Game",
							"games": []
						} , {
							"id": "fps",
							"name": "First Person Shooter (FPS)",
							"games": []
						} , {
							"id": "platformer",
							"name": "Platformer",
							"games": []
						} , {
							"id": "puzzle",
							"name": "Puzzle",
							"games": []
						} , {
							"id": "pplatformer",
							"name": "Puzzle Platformer",
							"games": []
						} , {
							"id": "racing",
							"name": "Racing",
							"games": []
						} , {
							"id": "rts",
							"name": "Real-Time Strategy (RTS)",
							"games": []
						} , {
							"id": "rpg",
							"name": "Role-Playing Game (RPG)",
							"games": []
						} , {
							"id": "snake",
							"name": "Snake",
							"games": []
						} , {
							"id": "tbs",
							"name": "Turn-Based Strategy (TBS)",
							"games": []
						} , {
							"id": "os",
							"name": "Operating System (OS)",
							"games": []
						} , {
							"id": "software",
							"name": "Software",
							"games": []
						}]
					}
				};

				var v2_category_template = function(id, name, hardware, language, year, developer, publisher, copyright, links, screenshots, versions) {
					return {
						"id": id,
						"name": name,
						"hardware": hardware,
						"language": language,
						"year": year,
						"developer": developer,
						"publisher": publisher,
						"copyright": copyright,
						"links": links,
						"screenshots": screenshots,
						"versions": versions
					}
				};

				var v2_software_template = function(id, name, file, size, executable, mode, sync, license, status, links, screenshots) {
					return {
						"id": id,
						"name": name,
						"file": file,
						"size": size,
						"executable": executable,
						"mode": mode,
						"sync": sync,
						"cycles": undefined,
						"license": license,
						"status": status,
						"links": links,
						"screenshots": screenshots
					}
				};

				for (var game in v1.games) {
					for (var categ in v2.software.type) {
						// noinspection JSUnfilteredForInLoop
						var g = v1.games[game];
						// noinspection JSUnfilteredForInLoop
						var c = v2.software.type[categ];

						// noinspection DuplicatedCode
						if (g.genre === c.name) {
							var vers = [];

							vers.push(v2_software_template(g.id, g.name, g.file, g.size, g.executable, g.mode, g.sync, g.license, g.status, g.links, g.screenshots));

							for (var clone in g.clones) {
								// noinspection JSUnfilteredForInLoop
								var cl = g.clones[clone];

								vers.push(v2_software_template(cl.id, cl.name, cl.file, cl.size, cl.executable, cl.mode, cl.sync, cl.license, cl.status, cl.links, cl.screenshots));
							}

							//console.log(v2_category_template(g.id, g.group, g.hardware, g.language, g.year, g.developer, g.publisher, g.copyright, g.links, g.screenshots, vers));

							c.games.push(v2_category_template(g.id, g.group, g.hardware, g.language, g.year, g.developer, g.publisher, g.copyright, g.links, g.screenshots, vers));
						}
					}
				}

				return v2;
			}

			function solve_aspect_ratio(width, height, numerator, denominator) {
				if (width !== undefined) {
					return Math.round(width / (numerator / denominator));
				} else if (height !== undefined) {
					return Math.round(height * (numerator / denominator));
				} else {
					return undefined;
				}
			}

			// noinspection DuplicatedCode
			function render_list_dropdown_v1(games) {
				var html = '';

				var i = 0;

				for (var game in games['games']) {
					var list = '';

					// noinspection JSUnfilteredForInLoop
					if (typeof games['games'][game]['clones'] !== 'undefined') {
						// noinspection JSUnfilteredForInLoop
						list += '<optgroup label="' + (typeof games['games'][game]['group'] !== 'undefined' ? games['games'][game]['group'] : (typeof games['games'][game]['description'] !== 'undefined' ? games['games'][game]['description'] : games['games'][game]['name'])) + ' (' + games['games'][game]['genre'] + ')' + '">';
						// noinspection JSUnfilteredForInLoop
						list +=		'<option value="' + i + '" data-game-id="' + games['games'][game]['id'] + '">' + games['games'][game]['name'] + ' (' + games['games'][game]['year'] + ')' + (typeof games['games'][game]['retail'] !== 'undefined' ? (games['games'][game]['retail'] === true ? ' (' + 'Retail' + ')' : '') : '') + ' (' + format_bytes(parseInt(games['games'][game]['size'], 10)) + ')</option>';

						i++;

						// noinspection JSUnfilteredForInLoop
						for (var clone in games['games'][game]['clones']) {
							// noinspection JSUnfilteredForInLoop,DuplicatedCode
							if (typeof games['games'][game]['clones'][clone]['enabled'] !== 'undefined') {
								// noinspection JSUnfilteredForInLoop
								if (games['games'][game]['clones'][clone]['enabled'] === true) {
									// noinspection JSUnfilteredForInLoop,DuplicatedCode
									list += '<option value="' + i + '" data-game-id="' + (typeof games['games'][game]['clones'][clone]['id'] !== 'undefined' ? games['games'][game]['clones'][clone]['id'] : games['games'][game]['id']) + '">' + (typeof games['games'][game]['clones'][clone]['name'] !== 'undefined' ? games['games'][game]['clones'][clone]['name'] : games['games'][game]['name']) + ' (' + (typeof games['games'][game]['clones'][clone]['year'] !== 'undefined' ? games['games'][game]['clones'][clone]['year'] : games['games'][game]['year']) + ')' + (typeof games['games'][game]['clones'][clone]['retail'] !== 'undefined' ? (games['games'][game]['clones'][clone]['retail'] === true ? ' (' + 'Retail' + ')' : '') : '') + ' (' + format_bytes(parseInt((typeof games['games'][game]['clones'][clone]['size'] !== 'undefined' ? games['games'][game]['clones'][clone]['size'] : games['games'][game]['size']), 10)) + ')</option>';
								}
							} else {
								// noinspection JSUnfilteredForInLoop,DuplicatedCode
								list += '<option value="' + i + '" data-game-id="' + (typeof games['games'][game]['clones'][clone]['id'] !== 'undefined' ? games['games'][game]['clones'][clone]['id'] : games['games'][game]['id']) + '">' + (typeof games['games'][game]['clones'][clone]['name'] !== 'undefined' ? games['games'][game]['clones'][clone]['name'] : games['games'][game]['name']) + ' (' + (typeof games['games'][game]['clones'][clone]['year'] !== 'undefined' ? games['games'][game]['clones'][clone]['year'] : games['games'][game]['year']) + ')' + (typeof games['games'][game]['clones'][clone]['retail'] !== 'undefined' ? (games['games'][game]['clones'][clone]['retail'] === true ? ' (' + 'Retail' + ')' : '') : '') + ' (' + format_bytes(parseInt((typeof games['games'][game]['clones'][clone]['size'] !== 'undefined' ? games['games'][game]['clones'][clone]['size'] : games['games'][game]['size']), 10)) + ')</option>';
							}

							i++;
						}

						list += '</optgroup>';
					} else {
						// noinspection JSUnfilteredForInLoop
						list += '<option value="' + i + '" data-game-id="' + games['games'][game]['id'] + '">' + games['games'][game]['name'] + ' (' + games['games'][game]['year'] + ')' + ' (' + games['games'][game]['genre'] + ')' + (typeof games['games'][game]['retail'] !== 'undefined' ? (games['games'][game]['retail'] === true ? ' (' + 'Retail' + ')' : '') : '') + ' (' + format_bytes(parseInt(games['games'][game]['size'], 10)) + ')</option>';

						i++;
					}

					// noinspection JSUnfilteredForInLoop
					if (typeof games['games'][game]['enabled'] !== 'undefined') {
						// noinspection JSUnfilteredForInLoop
						if (games['games'][game]['enabled'] === true) {
							html += list;
						}
					} else {
						html += list;
					}
				}

				return html;
			}

			// noinspection DuplicatedCode
			function render_list_dropdown_v2(games) {
				var html = '';

				var i = 0;

				for (var genre in games['software']['type']) {
					var list = '';

					// noinspection JSUnfilteredForInLoop
					list += '<optgroup label="' + games['software']['type'][genre]['name'] + '">';

					// noinspection JSUnfilteredForInLoop
					for (var game in games['software']['type'][genre]['games']) {
						// noinspection JSUnfilteredForInLoop
						list += '<option value="' + i + '" data-genre-index="' + genre + '" data-genre-id="' + games['software']['type'][genre]['id'] + '" data-game-index="' + game + '" data-game-id="' + games['software']['type'][genre]['games'][game]['id'] + '">' + games['software']['type'][genre]['games'][game]['name'] + ' (' + games['software']['type'][genre]['games'][game]['year'] + ')</option>';

						i++;
					}

					list += '</optgroup>';

					html += list;
				}

				return html;
			}

			// noinspection DuplicatedCode
			function render_options_dropdown(options) {
				var html = '';

				var i = 0;

				// noinspection JSUnfilteredForInLoop
				for (var game in options) {
					// noinspection JSUnfilteredForInLoop
					html += '<option value="' + i + '">' + options[game]['name'] + ' (' + format_bytes(parseInt(options[game]['size'], 10)) + ')</option>';

					i++;
				}

				return html;
			}

			function render_list_table(games) {
				var html =	'<table>' +
								'<thead>' +
									'<tr>' +
										//'<th>ID</th>' +
										'<th class="left">Name</th>' +
										'<th>Version</th>' +
										'<th>Year</th>' +
										'<th>Genre</th>' +
										'<th>Size</th>' +
										// '<th>Developer</th>' +
										// '<th>Publisher</th>' +
										// '<th>Copyright</th>' +
										// '<th>License</th>' +
										'<th>Status</th>' +
										'<th>URL</th>' +
										'<th>GOG</th>' +
										'<th>Wiki</th>' +
										'<th>YT</th>' +
									'</tr>' +
								'</thead>' +
								'<tbody>';

				var i = 0;

				for (var game in games['games']) {
					// noinspection JSUnfilteredForInLoop,DuplicatedCode
					var list = 	//'<td>' + games['games'][game]['id'] + '</td>' +
						'<td class="left">' + games['games'][game]['name'] + '</td>' +
						'<td>' + format_version(games['games'][game]['version']) + '</td>' +
						'<td>' + games['games'][game]['year'] + '</td>' +
						'<td>' + games['games'][game]['genre'] + '</td>' +
						'<td>' + format_bytes(parseInt(games['games'][game]['size'], 10)) + '</td>' +
						// '<td>' + format_name(games['games'][game]['developer']) + '</td>' +
						// '<td>' + format_name(games['games'][game]['publisher']) + '</td>' +
						// '<td>' + format_name(games['games'][game]['copyright']) + '</td>' +
						// '<td>' + games['games'][game]['license'] + '</td>' +
						'<td>' + games['games'][game]['status'] + '</td>' +
						'<td>' + (typeof games['games'][game]['links'] !== 'undefined' ? (typeof games['games'][game]['links']['url'] !== 'undefined' ? '<a href="' + games['games'][game]['links']['url'] + '" target="_blank">Link</a>' : '-') : '-') + '</td>' +
						'<td>' + (typeof games['games'][game]['links'] !== 'undefined' ? (typeof games['games'][game]['links']['gog'] !== 'undefined' ? '<a href="' + games['games'][game]['links']['gog'] + '" target="_blank">Buy</a>' : '-') : '-') + '</td>' +
						'<td>' + (typeof games['games'][game]['links'] !== 'undefined' ? (typeof games['games'][game]['links']['wikipedia'] !== 'undefined' ? '<a href="' + games['games'][game]['links']['wikipedia'] + '" target="_blank">Link</a>' : '-') : '-') + '</td>' +
						'<td>' + (typeof games['games'][game]['links'] !== 'undefined' ? (typeof games['games'][game]['links']['youtube'] !== 'undefined' ? '<a href="' + games['games'][game]['links']['youtube'] + '" target="_blank">View</a>' : '-') : '-') + '</td>';

					// noinspection JSUnfilteredForInLoop
					html += '<tr data-index="' + i + '" data-game-id="' + games['games'][game]['id'] + '">' + list + '</tr>';

					// noinspection JSUnfilteredForInLoop
					if (typeof games['games'][game]['clones'] !== 'undefined') {
						list = '';

						i++;

						// noinspection JSUnfilteredForInLoop
						for (var clone in games['games'][game]['clones']) {
							// noinspection JSUnfilteredForInLoop,DuplicatedCode
							list = 	//'<td>' + (typeof games['games'][game]['clones'][clone]['id'] !== 'undefined' ? games['games'][game]['clones'][clone]['id'] : games['games'][game]['id']) + '</td>' +
								'<td class="left">' + (typeof games['games'][game]['clones'][clone]['name'] !== 'undefined' ? games['games'][game]['clones'][clone]['name'] : games['games'][game]['name']) + '</td>' +
								'<td>' + format_version((typeof games['games'][game]['clones'][clone]['version'] !== 'undefined' ? games['games'][game]['clones'][clone]['version'] : games['games'][game]['version'])) + '</td>' +
								'<td>' + (typeof games['games'][game]['clones'][clone]['year'] !== 'undefined' ? games['games'][game]['clones'][clone]['year'] : games['games'][game]['year']) + '</td>' +
								'<td>' + games['games'][game]['genre'] + '</td>' +
								'<td>' + format_bytes(parseInt((typeof games['games'][game]['clones'][clone]['size'] !== 'undefined' ? games['games'][game]['clones'][clone]['size'] : games['games'][game]['size']), 10)) + '</td>' +
								// '<td>' + format_name((typeof games['games'][game]['clones'][clone]['developer'] !== 'undefined' ? games['games'][game]['clones'][clone]['developer'] : games['games'][game]['developer'])) + '</td>' +
								// '<td>' + format_name((typeof games['games'][game]['clones'][clone]['publisher'] !== 'undefined' ? games['games'][game]['clones'][clone]['publisher'] : games['games'][game]['publisher'])) + '</td>' +
								// '<td>' + format_name((typeof games['games'][game]['clones'][clone]['copyright'] !== 'undefined' ? games['games'][game]['clones'][clone]['copyright'] : games['games'][game]['copyright'])) + '</td>' +
								// '<td>' + (typeof games['games'][game]['clones'][clone]['license'] !== 'undefined' ? games['games'][game]['clones'][clone]['license'] : games['games'][game]['license']) + '</td>' +
								'<td>' + (typeof games['games'][game]['clones'][clone]['status'] !== 'undefined' ? games['games'][game]['clones'][clone]['status'] : games['games'][game]['status']) + '</td>' +
								'<td>' + (typeof games['games'][game]['clones'][clone]['links'] !== 'undefined' ? (typeof games['games'][game]['clones'][clone]['links']['url'] !== 'undefined' ? '<a href="' + games['games'][game]['clones'][clone]['links']['url'] + '" target="_blank">Link</a>' : (typeof games['games'][game]['links']['url'] !== 'undefined' ? '<a href="' + games['games'][game]['links']['url'] + '" target="_blank">Link</a>' : '-')) : (typeof games['games'][game]['links'] !== 'undefined' ? (typeof games['games'][game]['links']['url'] !== 'undefined' ? '<a href="' + games['games'][game]['links']['url'] + '" target="_blank">Link</a>' : '-') : '-')) + '</td>' +
								'<td>' + (typeof games['games'][game]['clones'][clone]['links'] !== 'undefined' ? (typeof games['games'][game]['clones'][clone]['links']['gog'] !== 'undefined' ? '<a href="' + games['games'][game]['clones'][clone]['links']['gog'] + '" target="_blank">Buy</a>' : (typeof games['games'][game]['links']['gog'] !== 'undefined' ? '<a href="' + games['games'][game]['links']['gog'] + '" target="_blank">Buy</a>' : '-')) : (typeof games['games'][game]['links'] !== 'undefined' ? (typeof games['games'][game]['links']['gog'] !== 'undefined' ? '<a href="' + games['games'][game]['links']['gog'] + '" target="_blank">Buy</a>' : '-') : '-')) + '</td>' +
								'<td>' + (typeof games['games'][game]['clones'][clone]['links'] !== 'undefined' ? (typeof games['games'][game]['clones'][clone]['links']['wikipedia'] !== 'undefined' ? '<a href="' + games['games'][game]['clones'][clone]['links']['wikipedia'] + '" target="_blank">Link</a>' : (typeof games['games'][game]['links']['wikipedia'] !== 'undefined' ? '<a href="' + games['games'][game]['links']['wikipedia'] + '" target="_blank">Link</a>' : '-')) : (typeof games['games'][game]['links'] !== 'undefined' ? (typeof games['games'][game]['links']['wikipedia'] !== 'undefined' ? '<a href="' + games['games'][game]['links']['wikipedia'] + '" target="_blank">Link</a>' : '-') : '-')) + '</td>' +
								'<td>' + (typeof games['games'][game]['clones'][clone]['links'] !== 'undefined' ? (typeof games['games'][game]['clones'][clone]['links']['youtube'] !== 'undefined' ? '<a href="' + games['games'][game]['clones'][clone]['links']['youtube'] + '" target="_blank">View</a>' : (typeof games['games'][game]['links']['youtube'] !== 'undefined' ? '<a href="' + games['games'][game]['links']['youtube'] + '" target="_blank">View</a>' : '-')) : (typeof games['games'][game]['links'] !== 'undefined' ? (typeof games['games'][game]['links']['youtube'] !== 'undefined' ? '<a href="' + games['games'][game]['links']['youtube'] + '" target="_blank">View</a>' : '-') : '-')) + '</td>';

							// noinspection JSUnfilteredForInLoop
							html += '<tr data-index="' + i + '" data-game-id="' + (typeof games['games'][game]['clones'][clone]['id'] !== 'undefined' ? games['games'][game]['clones'][clone]['id'] : games['games'][game]['id']) + '">' + list + '</tr>';

							i++;
						}
					}
				}

				html += 	'</tbody>' +
						'</table>';

				return html;
			}

			// noinspection DuplicatedCode
			function render_preview(screenshots) {
				var html = '<ul class="lightslider">';

				var width = solve_aspect_ratio(undefined, $preview.height(), 8, 5);
				var height = solve_aspect_ratio($preview.width(), undefined, 8, 5);

				if (width > $preview.width()) {
					width = $preview.width();
				}

				if (height > $preview.height()) {
					height = $preview.height();
				}

				for (var image in screenshots) {
					// noinspection JSUnfilteredForInLoop
					html += '<li><img width="' + width + '" height="' + height + '" alt="" draggable="false" ondragstart="return false;" src="' + screenshots[image] + '" /></li>';
				}

				html += '</ul';

				return html;
			}

			function get_file_order(index, file, files) {
				for (var f in files) {
					// noinspection JSUnfilteredForInLoop
					if (files[f]['metadata']['name'] === file[index]) {
						// noinspection JSUnfilteredForInLoop
						return files[f]['link'];
					}
				}
			}

			function init() {
				$preview.hide();

				// noinspection DuplicatedCode
				if ($body.hasClass('v2')) {
					$list_dropdown_v2.html('').html(render_list_dropdown_v2(games_v2));
					// $list_dropdown_v2.html('').html(render_list_dropdown_v2(v1_to_v2(games_v1)));
					$options_dropdown.html('').html(render_options_dropdown(games_v2['software']['type'][0]['games'][0]['versions']));

					var screenshots = typeof games_v2['software']['type'][0]['games'][0]['versions'][0]['screenshots'] !== 'undefined' ? games_v2['software']['type'][0]['games'][0]['versions'][0]['screenshots'] : (typeof games_v2['software']['type'][0]['games'][0]['screenshots'] !== 'undefined' ? games_v2['software']['type'][0]['games'][0]['screenshots'] : []);
					var screenshot = typeof screenshots[0] !== 'undefined' ? screenshots[0] : '';

					if (!started && screenshot) {
						if ($.fn.lightSlider) {
							$preview.html('').html(render_preview(screenshots)).show();
						} else {
							$preview.css({
								'background-image': 'url(' + screenshot + ')',
								'background-size': 'contain'
							}).show();
						}
					}

					$list_table.html('').html(render_list_table(games_v1));

					var $table = $list_table.find('table');

					if ($.fn.dataTable) {
						$.extend(true, $.fn.dataTable.defaults, {
							dom: "<'row filters'<'col-md-3'l><'col-md-6 toolbar text-center'B><'col-md-3'f>><'row'<'col-sm-12'tr>><'row panel-footer'<'col-sm-6'i><'col-sm-6'p>>",
							paging: true,
							responsive: false,
							stateSave: true,
							altEditor: false,
							select: {
								style: 'multi'
							},
							order: [[1, 'asc']],
							colReorder: {
								fixedColumnsLeft: 1
							},
							lengthMenu: [[5, 10, 15, 20, 25, 50, -1], [5, 10, 15, 20, 25, 50, 'all']],
							displayLength: -1,
							language: {
								infoPostFix: '',
								search: '',
								searchPlaceholder: 'Quick search…',
								paginate: {
									first: '<<',
									last: '>>',
									next: '>',
									previous: '<'
								}
							}
						});

						$.extend(true, $.fn.dataTable.Buttons.defaults, {
							dom: {
								container: {
									tag: 'div',
									className: 'dt-buttons btn-group'
								},
								button: {
									tag: 'button data-toggle="tooltip" data-trigger="hover" data-placement="top" data-boundary="window"',
									className: 'btn btn-sm btn-light'
								},
								collection: {
									tag: 'div',
									className: 'dt-button-collection dropdown-menu',
									button: {
										tag: 'a',
										className: 'dt-button dropdown-item',
										active: 'active',
										disabled: 'disabled'
									}
								}
							}
						});

						$.fn.dataTable.render.ellipsis = function (cutoff, wordbreak, escapeHtml) {
							var esc = function (t) {
								return t
									.replace(/&/g, '&amp;')
									.replace(/</g, '&lt;')
									.replace(/>/g, '&gt;')
									.replace(/"/g, '&quot;');
							};

							// noinspection JSUnusedLocalSymbols
							return function (d, type, row) {
								// Order, search and type get the original data
								if (type !== 'display') {
									return d;
								}

								if (typeof d !== 'number' && typeof d !== 'string') {
									return d;
								}

								d = d.toString(); // cast numbers

								if (d.length <= cutoff) {
									return d;
								}

								var shortened = d.substr(0, cutoff - 1);

								// Find the last white space character in the string
								if (wordbreak) {
									shortened = shortened.replace(/\s([^\s]*)$/, '');
								}

								// Protect against uncontrolled HTML input
								if (escapeHtml) {
									shortened = esc(shortened);
								}

								return '<span class="ellipsis" title="' + esc(d) + '">' + shortened + '&#8230;</span>';
							};
						};

						if ($.fn.dataTable.isDataTable($table)) {
							$table.DataTable().destroy();
						} else {
							$table.DataTable();
						}
					}

					if ($.fn.select2) {
						$.fn.select2.defaults.set('theme', 'bootstrap4');

						if ($list_dropdown_v2.data('select2')) {
							$version_dropdown.select2('destroy');
							$list_dropdown_v2.select2('destroy');
							$options_dropdown.select2('destroy');
						} else {
							$version_dropdown.select2({
								width: 'element',
								minimumResultsForSearch: -1
							}).on('select2:open', function() {
								if (typeof PerfectScrollbar !== 'undefined') {
									perfect_scrollbar = new PerfectScrollbar('.select2-results__options', {});

									setTimeout(function() {
										if (perfect_scrollbar) {
											if (typeof perfect_scrollbar.update === 'function') {
												perfect_scrollbar.update();
											}
										}
									}, 10);
								}
							}).on('select2:close', function() {
								if (perfect_scrollbar) {
									if (typeof perfect_scrollbar.destroy === 'function') {
										perfect_scrollbar.destroy();
									}
								}
							});

							$list_dropdown_v2.select2({
								width: 'element'
							}).on('select2:open', function() {
								$window.trigger('resize');

								if (typeof PerfectScrollbar !== 'undefined') {
									perfect_scrollbar = new PerfectScrollbar('.select2-results__options', {});

									setTimeout(function() {
										if (perfect_scrollbar) {
											if (typeof perfect_scrollbar.update === 'function') {
												perfect_scrollbar.update();
											}
										}
									}, 10);
								}
							}).on('select2:close', function() {
								if (perfect_scrollbar) {
									if (typeof perfect_scrollbar.destroy === 'function') {
										perfect_scrollbar.destroy();
									}
								}
							}).on('select2:select', function (e) {
								if (typeof e.params !== 'undefined') {
									if (typeof e.params.data !== 'undefined') {
										if (typeof e.params.data.element !== 'undefined') {
											// noinspection JSUnresolvedFunction
											//Router.navigate('/' + Router.getRoute() + '/' + parseInt($(e.params.data.element).val(), 10));
										}
									}
								}
							});

							$options_dropdown.select2({
								width: 'element',
								minimumResultsForSearch: -1
							}).on('select2:open', function() {
								if (typeof PerfectScrollbar !== 'undefined') {
									perfect_scrollbar = new PerfectScrollbar('.select2-results__options', {});

									setTimeout(function() {
										if (perfect_scrollbar) {
											if (typeof perfect_scrollbar.update === 'function') {
												perfect_scrollbar.update();
											}
										}
									}, 10);
								}
							}).on('select2:close', function() {
								if (perfect_scrollbar) {
									if (typeof perfect_scrollbar.destroy === 'function') {
										perfect_scrollbar.destroy();
									}
								}
							});
						}
					}

					$body.find('button').addClass('btn btn-light');
				} else {
					$list_dropdown_v1.html('').html(render_list_dropdown_v1(games_v1));
					$list_table.html('').html(render_list_table(games_v1));

					if (!started && games_v1['games'][0]['screenshots'][0]) {
						if ($.fn.lightSlider) {
							$preview.html('').html(render_preview(games_v1['games'][0]['screenshots'])).show();
						} else {
							$preview.css({
								'background-image': 'url(' + games_v1['games'][0]['screenshots'][0] + ')',
								'background-size': 'contain'
							}).show();
						}
					}

					if ($.fn.select2) {
						if ($list_dropdown_v2.data('select2')) {
							$version_dropdown.select2('destroy');
							$list_dropdown_v2.select2('destroy');
							$options_dropdown.select2('destroy');
						}
					}

					$body.find('button').removeClass('btn btn-light');
				}

				if ($.fn.tooltip) {
					$body.find('[data-toggle="tooltip"], [data-toggle="dropdown"]').tooltip();
				}

				if ($.fn.lightSlider) {
					lightslider = $body.find('.lightslider').lightSlider({
						item: 1,
						gallery: true,
						loop: true,
						pager: false,
						auto: true,
						speed: 500,
						slideMargin: 0
					});
				}
			}

			function start_v1(file, executable, args, mode, sync, old) {
				if (typeof sync !== 'undefined') {
					if (sync === true) {
						sync = '';
					} else {
						sync = 'no';
					}
				} else {
					sync = '';
				}

				if (typeof old !== 'undefined') {
					if (old === true) {
						old = '-old';
					} else {
						old = '';
					}
				} else {
					old = '';
				}

				if (Array.isArray(file)) {
					var files = [];

					for (var f in file) {
						// noinspection JSUnfilteredForInLoop
						dbx.filesGetTemporaryLink({path: '/dosbox/' + file[f]}).then(function(response) {
							// noinspection JSUnfilteredForInLoop,JSReferencingMutableVariableFromClosure
							files.push(response);
						}).catch(function(error) {
							console.log(error);
						});
					}

					var int = null;

					int = setInterval(function() {
						if (files.length === file.length) {
							clearInterval(int);
							int = null;
							// noinspection JSUnresolvedFunction,JSUnresolvedVariable,AmdModulesDependencies
							var emulator = new Emulator($canvas.get(0), function() {
									$list_table.hide();
									$preview.hide();
									$start.hide();
									started = true;
									setTimeout(function() {
										$window.trigger('resize');
									}, 2500);
								},
								new DosBoxLoader(DosBoxLoader.emulatorJS(SYSTEM_FEATURE_WEBASSEMBLY && mode !== 'asm' ? 'js/dosbox-' + sync + 'sync-wasm.js' : (SYSTEM_FEATURE_ASMJS ? 'js/dosbox-' + sync + 'sync' + old + '-asm.js' : alert('DOSBox cannot work because WebAssembly and/or ASM.JS is not supported in your browser!'))),
									DosBoxLoader.locateAdditionalEmulatorJS(function(filename) {
										if (filename === 'dosbox.html.mem') {
											return 'js/dosbox-' + sync + 'sync' + old + '.mem';
										}

										if (filename === 'dosbox.wasm') {
											return 'js/dosbox-sync.wasm';
										}

										return filename;
									}),
									DosBoxLoader.mountZip('a', DosBoxLoader.fetchFile('OS File', get_file_order(0, file, files))),
									DosBoxLoader.mountZip('b', DosBoxLoader.fetchFile('Game File', get_file_order(1, file, files))),
									DosBoxLoader.extraArgs(args),
									DosBoxLoader.startExe(executable)));
							emulator.start({waitAfterDownloading: false});
						}
					}, 100);
				} else {
					// noinspection JSUnresolvedFunction
					dbx.filesGetTemporaryLink({path: '/dosbox/' + file}).then(function(response) {
						// noinspection JSUnresolvedFunction,JSUnresolvedVariable,AmdModulesDependencies
						var emulator = new Emulator($canvas.get(0), function() {
								$list_table.hide();
								$preview.hide();
								$start.hide();
								started = true;
								setTimeout(function() {
									$window.trigger('resize');
								}, 2500);
							},
							new DosBoxLoader(DosBoxLoader.emulatorJS(SYSTEM_FEATURE_WEBASSEMBLY && mode !== 'asm' ? 'js/dosbox-' + sync + 'sync-wasm.js' : (SYSTEM_FEATURE_ASMJS ? 'js/dosbox-' + sync + 'sync' + old + '-asm.js' : alert('DOSBox cannot work because WebAssembly and/or ASM.JS is not supported in your browser!'))),
								DosBoxLoader.locateAdditionalEmulatorJS(function(filename) {
									if (filename === 'dosbox.html.mem') {
										return 'js/dosbox-' + sync + 'sync' + old + '.mem';
									}

									if (filename === 'dosbox.wasm') {
										return 'js/dosbox-' + sync + 'sync.wasm';
									}

									return filename;
								}),
								DosBoxLoader.mountZip('c', DosBoxLoader.fetchFile('Game File', response.link)),
								DosBoxLoader.extraArgs(args),
								DosBoxLoader.startExe(executable)));
						emulator.start({waitAfterDownloading: false});

					}).catch(function(error) {
						console.log(error);
					});
				}
			}

			function start_v2(file, args, mode, sync, cycles) {
				// noinspection JSUnresolvedFunction
				Dos($canvas.get(0), {
					cycles: cycles ? cycles : 'auto',
					wdosboxUrl: mode === 'asm' || isIE ? (sync ? 'js/dosbox.js' : 'js/dosbox-nosync.js') : (sync ? 'js/wdosbox.js' : 'js/wdosbox-nosync.js'),
					autolock: true
				}).ready(function(fs, main) {
					dbx.filesGetTemporaryLink({path: '/dosbox/' + file}).then(function(response) {
						fs.extract(response.link).then(function() {
							$list_table.hide();
							$preview.hide();
							$start.hide();
							started = true;

							main(args).then(function(ci) {
								window.ci = ci;
							});
						});
					});
				});
			}

			// noinspection JSUnresolvedFunction
			dbx = new dropbox.Dropbox({accessToken: window['DROPBOX_TOKEN'], fetch: fetch.fetch});

			$document			= $(document);
			$window				= $(window);
			$html				= $('html');
			$body				= $('body');
			$canvas				= $('#canvas');
			$version_dropdown	= $('.version-dropdown');
			$list_dropdown_v1	= $('.list-dropdown-v1');
			$list_dropdown_v2	= $('.list-dropdown-v2');
			$options_dropdown	= $('.options-dropdown');
			$list_table			= $('.list-table');
			$preview			= $('.preview');
			$start				= $('.start');

			// noinspection JSUnresolvedVariable
			if (SYSTEM_FEATURE_CANVAS && SYSTEM_FEATURE_TYPED_ARRAYS && (SYSTEM_FEATURE_ASMJS || SYSTEM_FEATURE_WEBASSEMBLY)) {
				var index_selected;

				first = typeof $.url().param('game') !== 'undefined' ? $.url().param('game') : (typeof $.url().param('gamev2') !== 'undefined' ? $.url().param('gamev2') : false);

				if (typeof $.url().param('gamev2') !== 'undefined') {
					$version_dropdown.find('option').prop('selected', false).removeAttr('selected');
					$version_dropdown.find('option[value="v2"]').prop('selected', true).attr('selected', true);
					$body.removeClass('v1 v2').addClass('v2');
				}

				if (typeof $.url().param('game') !== 'undefined') {
					$body.removeClass('v1 v2').addClass('v1');
				}

				init();

				if (first) {
					$list_table.hide();
					$preview.hide();
					$start.hide();

					if ($body.hasClass('v2')) {
						$list_dropdown_v2.find('option').prop('selected', false).removeAttr('selected');
						$options_dropdown.find('option').prop('selected', false).removeAttr('selected');

						index_selected = 0;

						for (var genre in games_v2['software']['type']) {
							// noinspection JSUnfilteredForInLoop
							for (var g in games_v2['software']['type'][genre]['games']) {
								// noinspection JSUnfilteredForInLoop
								for (var e in games_v2['software']['type'][genre]['games'][g]['versions']) {
									// noinspection JSUnfilteredForInLoop,DuplicatedCode
									if (games_v2['software']['type'][genre]['games'][g]['versions'][e]['id'] === first) {
										$list_dropdown_v2.find('option[value="' + index_selected + '"]').prop('selected', true).attr('selected', true).trigger('change');
										var genre_index_selected = parseInt($list_dropdown_v2.find('option[value="' + index_selected + '"]').data('genre-index'), 10);
										var game_index_selected = parseInt($list_dropdown_v2.find('option[value="' + index_selected + '"]').data('game-index'), 10);
										$options_dropdown.html('').html(render_options_dropdown(games_v2['software']['type'][genre_index_selected]['games'][game_index_selected]['versions']));
										$options_dropdown.find('option[value="' + e + '"]').prop('selected', true).attr('selected', true).trigger('change');
										// noinspection JSUnfilteredForInLoop
										var file = games_v2['software']['type'][genre]['games'][g]['versions'][e]['file'] || '';
										// noinspection JSUnfilteredForInLoop
										var args = games_v2['software']['type'][genre]['games'][g]['versions'][e]['args'] || [];
										// noinspection JSUnfilteredForInLoop
										var mode = games_v2['software']['type'][genre]['games'][g]['versions'][e]['mode'];
										// noinspection JSUnfilteredForInLoop
										var sync = games_v2['software']['type'][genre]['games'][g]['versions'][e]['sync'];
										// noinspection JSUnfilteredForInLoop
										var cycles = games_v2['software']['type'][genre]['games'][g]['versions'][e]['cycles'];
										// noinspection JSUnfilteredForInLoop
										var executable = games_v2['software']['type'][genre]['games'][g]['versions'][e]['executable'] || '';
										args.push('-c', executable.replace('./', ''));
										start_v2(file, args, mode, sync, cycles);
										break;
									}
								}
								index_selected++;
							}
						}
					} else {
						$list_dropdown_v1.find('option').prop('selected', false).removeAttr('selected');

						index_selected = parseInt($.url().param('game'), 10);
						var game_selected = $list_dropdown_v1.find('option[value="'+ index_selected +'"]').prop('selected', true).attr('selected', true).data('game-id');

						// noinspection DuplicatedCode
						for (var game in games_v1['games']) {
							// noinspection JSUnfilteredForInLoop,DuplicatedCode
							if (games_v1['games'][game]['id'] === game_selected) {
								// noinspection JSUnfilteredForInLoop,DuplicatedCode
								start_v1(typeof games_v1['games'][game]['files'] !== 'undefined' ? games_v1['games'][game]['files'] : games_v1['games'][game]['file'], games_v1['games'][game]['executable'], games_v1['games'][game]['args'], games_v1['games'][game]['mode'], games_v1['games'][game]['sync'], games_v1['games'][game]['old']);
								break;
							} else {
								// noinspection JSUnfilteredForInLoop
								if (typeof games_v1['games'][game]['clones'] !== 'undefined') {
									// noinspection JSUnfilteredForInLoop,JSUnusedLocalSymbols
									for (var clone in games_v1['games'][game]['clones']) {
										// noinspection JSUnfilteredForInLoop,DuplicatedCode
										if (games_v1['games'][game]['clones'][clone]['id'] === game_selected) {
											// noinspection JSUnfilteredForInLoop,DuplicatedCode
											start_v1((typeof games_v1['games'][game]['clones'][clone]['files'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['files'] : (typeof games_v1['games'][game]['clones'][clone]['file'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['file'] : (typeof games_v1['games'][game]['files'] !== 'undefined' ? games_v1['games'][game]['files'] : games_v1['games'][game]['file']))), (typeof games_v1['games'][game]['clones'][clone]['executable'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['executable'] : games_v1['games'][game]['executable']), (typeof games_v1['games'][game]['clones'][clone]['args'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['args'] : games_v1['games'][game]['args']), games_v1['games'][game]['clones'][clone]['mode'], (typeof games_v1['games'][game]['clones'][clone]['sync'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['sync'] : games_v1['games'][game]['sync']), (typeof games_v1['games'][game]['clones'][clone]['old'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['old'] : games_v1['games'][game]['old']));
											break;
										}
									}
								}
							}
						}
					}

					first = false;
				}

				// noinspection DuplicatedCode
				$document.off('click', '.list-table table tr').on('click', '.list-table table tr', function() {
					if ($body.hasClass('v2')) {

					} else {
						var $el = $(this);
						var index_selected = parseInt($el.data('index'), 10);
						var game_selected = $el.data('game-id');

						// noinspection DuplicatedCode
						if (first) {
							first = false;

							// noinspection DuplicatedCode
							for (var game in games_v1['games']) {
								// noinspection JSUnfilteredForInLoop,DuplicatedCode
								if (games_v1['games'][game]['id'] === game_selected) {
									$list_table.hide();
									$preview.hide();
									$start.hide();
									// noinspection JSUnfilteredForInLoop,DuplicatedCode
									start_v1(typeof games_v1['games'][game]['files'] !== 'undefined' ? games_v1['games'][game]['files'] : games_v1['games'][game]['file'], games_v1['games'][game]['executable'], games_v1['games'][game]['args'], games_v1['games'][game]['mode'], games_v1['games'][game]['sync'], games_v1['games'][game]['old']);
									break;
								} else {
									// noinspection JSUnfilteredForInLoop,DuplicatedCode
									if (typeof games_v1['games'][game]['clones'] !== 'undefined') {
										// noinspection JSUnfilteredForInLoop,JSUnusedLocalSymbols,DuplicatedCode
										for (var clone in games_v1['games'][game]['clones']) {
											// noinspection JSUnfilteredForInLoop,DuplicatedCode
											if (games_v1['games'][game]['clones'][clone]['id'] === game_selected) {
												$list_table.hide();
												$preview.hide();
												$start.hide();
												// noinspection JSUnfilteredForInLoop,DuplicatedCode
												start_v1((typeof games_v1['games'][game]['clones'][clone]['files'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['files'] : (typeof games_v1['games'][game]['clones'][clone]['file'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['file'] : (typeof games_v1['games'][game]['files'] !== 'undefined' ? games_v1['games'][game]['files'] : games_v1['games'][game]['file']))), (typeof games_v1['games'][game]['clones'][clone]['executable'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['executable'] : games_v1['games'][game]['executable']), (typeof games_v1['games'][game]['clones'][clone]['args'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['args'] : games_v1['games'][game]['args']), games_v1['games'][game]['clones'][clone]['mode'], (typeof games_v1['games'][game]['clones'][clone]['sync'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['sync'] : games_v1['games'][game]['sync']), (typeof games_v1['games'][game]['clones'][clone]['old'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['old'] : games_v1['games'][game]['old']));
												break;
											}
										}
									}
								}
							}
						} else {
							location.href = location.protocol + '//' + location.host + location.pathname + '?game=' + index_selected;
						}
					}
				});
				$document.off('click', '.start').on('click', '.start', function () {
					$('.tooltip, .popover').remove();
					$('.load').trigger('click');
				});
				// noinspection DuplicatedCode
				$document.off('click', '.load').on('click', '.load', function() {
					var index_selected;

					// noinspection DuplicatedCode
					if ($body.hasClass('v2')) {
						index_selected = parseInt($list_dropdown_v2.val(), 10);
						var option_selected = parseInt($options_dropdown.val(), 10);
						var genre_index_selected = parseInt($list_dropdown_v2.find('option[value="' + index_selected + '"]').data('genre-index'), 10);
						var game_index_selected = parseInt($list_dropdown_v2.find('option[value="' + index_selected + '"]').data('game-index'), 10);

						var id = games_v2['software']['type'][genre_index_selected]['games'][game_index_selected]['versions'][option_selected]['id'] || '';
						var file = games_v2['software']['type'][genre_index_selected]['games'][game_index_selected]['versions'][option_selected]['file'] || '';
						var args = games_v2['software']['type'][genre_index_selected]['games'][game_index_selected]['versions'][option_selected]['args'] || [];
						var executable = games_v2['software']['type'][genre_index_selected]['games'][game_index_selected]['versions'][option_selected]['executable'] || '';
						var mode = games_v2['software']['type'][genre_index_selected]['games'][game_index_selected]['versions'][option_selected]['mode'];
						var sync = games_v2['software']['type'][genre_index_selected]['games'][game_index_selected]['versions'][option_selected]['sync'];
						var cycles = games_v2['software']['type'][genre_index_selected]['games'][game_index_selected]['versions'][option_selected]['cycles'];

						args.push('-c', executable.replace('./', ''));

						if (first) {
							first = false;
							$list_table.hide();
							$preview.hide();
							$start.hide();
							start_v2(file, args, mode, sync, cycles);
						} else {
							location.href = location.protocol + '//' + location.host + location.pathname + '?gamev2=' + id;
						}
					} else {
						index_selected = parseInt($list_dropdown_v1.val(), 10);
						var game_selected = $list_dropdown_v1.find('option[value="' + index_selected + '"]').data('game-id');

						// noinspection DuplicatedCode
						if (first) {
							first = false;

							// noinspection DuplicatedCode
							for (var game in games_v1['games']) {
								// noinspection JSUnfilteredForInLoop,DuplicatedCode
								if (games_v1['games'][game]['id'] === game_selected) {
									$list_table.hide();
									$preview.hide();
									$start.hide();
									// noinspection JSUnfilteredForInLoop,DuplicatedCode
									start_v1(typeof games_v1['games'][game]['files'] !== 'undefined' ? games_v1['games'][game]['files'] : games_v1['games'][game]['file'], games_v1['games'][game]['executable'], games_v1['games'][game]['args'], games_v1['games'][game]['mode'], games_v1['games'][game]['sync'], games_v1['games'][game]['old']);
									break;
								} else {
									// noinspection JSUnfilteredForInLoop,DuplicatedCode
									if (typeof games_v1['games'][game]['clones'] !== 'undefined') {
										// noinspection JSUnfilteredForInLoop,JSUnusedLocalSymbols,DuplicatedCode
										for (var clone in games_v1['games'][game]['clones']) {
											// noinspection JSUnfilteredForInLoop,DuplicatedCode
											if (games_v1['games'][game]['clones'][clone]['id'] === game_selected) {
												$list_table.hide();
												$preview.hide();
												$start.hide();
												// noinspection JSUnfilteredForInLoop,DuplicatedCode
												start_v1((typeof games_v1['games'][game]['clones'][clone]['files'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['files'] : (typeof games_v1['games'][game]['clones'][clone]['file'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['file'] : (typeof games_v1['games'][game]['files'] !== 'undefined' ? games_v1['games'][game]['files'] : games_v1['games'][game]['file']))), (typeof games_v1['games'][game]['clones'][clone]['executable'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['executable'] : games_v1['games'][game]['executable']), (typeof games_v1['games'][game]['clones'][clone]['args'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['args'] : games_v1['games'][game]['args']), games_v1['games'][game]['clones'][clone]['mode'], (typeof games_v1['games'][game]['clones'][clone]['sync'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['sync'] : games_v1['games'][game]['sync']), (typeof games_v1['games'][game]['clones'][clone]['old'] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['old'] : games_v1['games'][game]['old']));
											}
										}
									}
								}
							}
						} else {
							location.href = location.protocol + '//' + location.host + location.pathname + '?game=' + index_selected;
						}
					}
				});
				$document.off('click', '.list').on('click', '.list', function() {
					$list_table.toggle();
				});
				$document.off('click', '.fullscreen').on('click', '.fullscreen', function() {
					if ($body.hasClass('v2')) {
						// noinspection JSUnresolvedVariable
						if (window.ci) {
							// noinspection JSUnresolvedVariable
							window.ci.fullscreen();
						}
					} else {
						if (Module) {
							Module.requestFullscreen(true, false);
							started = true;
						}
					}
				});
				$document.off('change', '.list-dropdown-v1, .list-dropdown-v2').on('change', '.list-dropdown-v1, .list-dropdown-v2', function() {
					var index_selected;
					var screenshot;
					started = false;

					if (!started) {
						$start.show();

						// noinspection DuplicatedCode
						if ($body.hasClass('v2')) {
							index_selected = parseInt($list_dropdown_v2.val(), 10);
							var genre_index_selected = parseInt($list_dropdown_v2.find('option[value="' + index_selected + '"]').data('genre-index'), 10);
							var game_index_selected = parseInt($list_dropdown_v2.find('option[value="' + index_selected + '"]').data('game-index'), 10);

							$options_dropdown.html('').html(render_options_dropdown(games_v2['software']['type'][genre_index_selected]['games'][game_index_selected]['versions']));

							// noinspection DuplicatedCode
							if ($.fn.lightSlider) {
								$preview.html('').html(render_preview(games_v2['software']['type'][genre_index_selected]['games'][game_index_selected]['versions'][0]['screenshots'])).show();
							} else {
								$preview.css({
									'background-image': 'url(' + games_v2['software']['type'][genre_index_selected]['games'][game_index_selected]['versions'][0]['screenshots'][0] + ')',
									'background-size': 'contain'
								}).show();
							}
						} else {
							index_selected = parseInt($list_dropdown_v1.val(), 10);
							var game_selected = $list_dropdown_v1.find('option[value="'+ index_selected +'"]').data('game-id');

							// noinspection DuplicatedCode
							for (var game in games_v1['games']) {
								// noinspection JSUnfilteredForInLoop,DuplicatedCode
								if (games_v1['games'][game]['id'] === game_selected) {
									// noinspection JSUnfilteredForInLoop
									if (typeof games_v1['games'][game]['screenshots'] === 'object') {
										// noinspection JSUnfilteredForInLoop
										screenshot = (typeof games_v1['games'][game]['screenshots'] === 'object' ? (typeof games_v1['games'][game]['screenshots'][0] !== 'undefined' ? games_v1['games'][game]['screenshots'][0] : '') : '');

										if (screenshot !== '') {
											if ($.fn.lightSlider) {
												// noinspection JSUnfilteredForInLoop
												$preview.html('').html(render_preview(games_v1['games'][game]['screenshots'])).show();
											} else {
												// noinspection JSUnfilteredForInLoop
												$preview.css({
													'background-image': 'url(' + (typeof games_v1['games'][game]['screenshots'][0] !== 'undefined' ? games_v1['games'][game]['screenshots'][0] : '') + ')',
													'background-size': 'contain'
												}).show();
											}
										} else {
											$preview.hide();
										}
									} else {
										$preview.hide();
									}
									break;
								} else {
									// noinspection JSUnfilteredForInLoop
									if (typeof games_v1['games'][game]['clones'] !== 'undefined') {
										// noinspection JSUnfilteredForInLoop,JSUnusedLocalSymbols
										for (var clone in games_v1['games'][game]['clones']) {
											// noinspection JSUnfilteredForInLoop,DuplicatedCode
											if (games_v1['games'][game]['clones'][clone]['id'] === game_selected) {
												// noinspection JSUnfilteredForInLoop
												if (typeof games_v1['games'][game]['clones'][clone]['screenshots'] === 'object' || typeof games_v1['games'][game]['screenshots'] === 'object') {
													// noinspection JSUnfilteredForInLoop
													screenshot = (typeof games_v1['games'][game]['clones'][clone]['screenshots'] === 'object' ? (typeof games_v1['games'][game]['clones'][clone]['screenshots'][0] !== 'undefined' ? games_v1['games'][game]['clones'][clone]['screenshots'][0] : (typeof games_v1['games'][game]['screenshots'][0] !== 'undefined' ? games_v1['games'][game]['screenshots'][0] : '')) : (typeof games_v1['games'][game]['screenshots'] === 'object' ? (typeof games_v1['games'][game]['screenshots'][0] !== 'undefined' ? games_v1['games'][game]['screenshots'][0] : '') : ''));

													if (screenshot !== '') {
														if ($.fn.lightSlider) {
															// noinspection JSUnfilteredForInLoop
															if (typeof games_v1['games'][game]['clones'][clone]['screenshots'] === 'object') {
																// noinspection JSUnfilteredForInLoop
																$preview.html('').html(render_preview(games_v1['games'][game]['clones'][clone]['screenshots'])).show();
															} else {
																// noinspection JSUnfilteredForInLoop
																if (typeof games_v1['games'][game]['screenshots'] === 'object') {
																	// noinspection JSUnfilteredForInLoop
																	$preview.html('').html(render_preview(games_v1['games'][game]['screenshots'])).show();
																} else {
																	$preview.hide();
																}
															}
														} else {
															// noinspection JSUnfilteredForInLoop
															$preview.css({
																'background-image': 'url(' + screenshot + ')',
																'background-size': 'contain'
															}).show();
														}
													} else {
														$preview.hide();
													}
												} else {
													$preview.hide();
												}
												break;
											}
										}
									}
								}
							}
						}

						if ($.fn.lightSlider) {
							lightslider = $body.find('.lightslider').lightSlider({
								item: 1,
								gallery: true,
								loop: true,
								pager: false,
								auto: true,
								speed: 500,
								slideMargin: 0
							});
						}
					}
				});
				$document.off('change', '.options-dropdown').on('change', '.options-dropdown', function() {
					var index_selected = parseInt($list_dropdown_v2.val(), 10);
					var option_selected = parseInt($options_dropdown.val(), 10);

					if ($body.hasClass('v2')) {
						var genre_index_selected = parseInt($list_dropdown_v2.find('option[value="' + index_selected + '"]').data('genre-index'), 10);
						var game_index_selected = parseInt($list_dropdown_v2.find('option[value="' + index_selected + '"]').data('game-index'), 10);

						// noinspection DuplicatedCode
						if ($.fn.lightSlider) {
							$preview.html('').html(render_preview(games_v2['software']['type'][genre_index_selected]['games'][game_index_selected]['versions'][option_selected]['screenshots'])).show();
						} else {
							$preview.css({
								'background-image': 'url(' + games_v2['software']['type'][genre_index_selected]['games'][game_index_selected]['versions'][option_selected]['screenshots'][0] + ')',
								'background-size': 'contain'
							}).show();
						}

						if ($.fn.lightSlider) {
							lightslider = $body.find('.lightslider').lightSlider({
								item: 1,
								gallery: true,
								loop: true,
								pager: false,
								auto: true,
								speed: 500,
								slideMargin: 0
							});
						}
					}
				});
				$document.off('change', '.version-dropdown').on('change', '.version-dropdown', function() {
					$body.removeClass('v1 v2').addClass($version_dropdown.val());
					init();
				});
				// noinspection DuplicatedCode
				$window.off('resize').on('resize', function() {
					$body.find('.select2-container--bootstrap4 .select2-results > .select2-results__options').css({
						'max-height': $window.height() - 57
					});

					var width = solve_aspect_ratio(undefined, $preview.height(), 8, 5);
					var height = solve_aspect_ratio($preview.width(), undefined, 8, 5);

					if (width > $preview.width()) {
						width = $preview.width();
					}

					if (height > $preview.height()) {
						height = $preview.height();
					}

					if ($body.hasClass('v2')) {
						$body.find('.dosbox-container').width(width).height(height);
					} else {
						$canvas.width(width).height(height);
					}

					$preview.find('img').width(width).height(height);

					if (lightslider) {
						if (typeof lightslider.refresh === 'function') {
							lightslider.refresh();
						}
					}
				});
				$window.trigger('resize');
			} else {
				alert('DOSBox cannot work because your browser is not supported!')
			}
		});
	});
} (this));