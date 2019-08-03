(window.webpackJsonp = window.webpackJsonp || []).push([[4], {
	57: function (e, t, n) {
		"use strict";
		n.r(t);
		var r = n(8), a = Object(r.a)();
		window.addEventListener("message", function (e) {
			var t = e.data, n = e.source;
			"transfer" === t.method ? a.then(function (e) {
				var t = e.files;
				n.postMessage({method: "storage", files: t}, "*")
			}) : "clear" === t.method && a.then(function (e) {
				return (0, e.clear)()
			})
		})
	}, 8: function (e, t, n) {
		"use strict";
		n.d(t, "a", function () {
			return i
		});
		var r = n(2), a = n.n(r), s = n(7), c = n(5), u = n(9), o = n.n(u);

		function i() {
			return f.apply(this, arguments)
		}

		function f() {
			return (f = Object(c.a)(a.a.mark(function e() {
				var t, n, r, c, u, i, f, l;
				return a.a.wrap(function (e) {
					for (; ;) switch (e.prev = e.next) {
						case 0:
							return e.prev = 0, t = new o.a("diablo_fs"), n = new Map, r = 0, e.t0 = Object, e.next = 7, t.json();
						case 7:
							e.t1 = e.sent, c = e.t0.entries.call(e.t0, e.t1);
						case 9:
							if (!(r < c.length)) {
								e.next = 18;
								break
							}
							u = c[r], i = Object(s.a)(u, 2), f = i[0], l = i[1], n.set(f, l);
						case 15:
							r++, e.next = 9;
							break;
						case 18:
							return e.abrupt("return", {
								files: n, update: function (e, n) {
									return t.set(e, n)
								}, delete: function (e) {
									return t.remove(e)
								}, clear: function () {
									return t.clear()
								}
							});
						case 21:
							return e.prev = 21, e.t2 = e.catch(0), e.abrupt("return", {
								files: new Map, update: function () {
									return Promise.resolve()
								}, delete: function () {
									return Promise.resolve()
								}, clear: function () {
									return Promise.resolve()
								}
							});
						case 24:
						case"end":
							return e.stop()
					}
				}, e, null, [[0, 21]])
			}))).apply(this, arguments)
		}
	}
}, [[57, 3, 0]]]);
//# sourceMappingURL=storage.97895d82.chunk.js.map