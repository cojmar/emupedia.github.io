/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createDecorator(mapFn) {
        return (target, key, descriptor) => {
            let fnKey = null;
            let fn = null;
            if (typeof descriptor.value === 'function') {
                fnKey = 'value';
                fn = descriptor.value;
            }
            else if (typeof descriptor.get === 'function') {
                fnKey = 'get';
                fn = descriptor.get;
            }
            if (!fn) {
                throw new Error('not supported');
            }
            descriptor[fnKey] = mapFn(fn, key);
        };
    }
    exports.createDecorator = createDecorator;
    let memoizeId = 0;
    function createMemoizer() {
        const memoizeKeyPrefix = `$memoize${memoizeId++}`;
        let self = undefined;
        const result = function memoize(target, key, descriptor) {
            let fnKey = null;
            let fn = null;
            if (typeof descriptor.value === 'function') {
                fnKey = 'value';
                fn = descriptor.value;
                if (fn.length !== 0) {
                    console.warn('Memoize should only be used in functions with zero parameters');
                }
            }
            else if (typeof descriptor.get === 'function') {
                fnKey = 'get';
                fn = descriptor.get;
            }
            if (!fn) {
                throw new Error('not supported');
            }
            const memoizeKey = `${memoizeKeyPrefix}:${key}`;
            descriptor[fnKey] = function (...args) {
                self = this;
                if (!this.hasOwnProperty(memoizeKey)) {
                    Object.defineProperty(this, memoizeKey, {
                        configurable: true,
                        enumerable: false,
                        writable: true,
                        value: fn.apply(this, args)
                    });
                }
                return this[memoizeKey];
            };
        };
        result.clear = () => {
            if (typeof self === 'undefined') {
                return;
            }
            Object.getOwnPropertyNames(self).forEach(property => {
                if (property.indexOf(memoizeKeyPrefix) === 0) {
                    delete self[property];
                }
            });
        };
        return result;
    }
    exports.createMemoizer = createMemoizer;
    function memoize(target, key, descriptor) {
        return createMemoizer()(target, key, descriptor);
    }
    exports.memoize = memoize;
    function debounce(delay, reducer, initialValueProvider) {
        return createDecorator((fn, key) => {
            const timerKey = `$debounce$${key}`;
            const resultKey = `$debounce$result$${key}`;
            return function (...args) {
                if (!this[resultKey]) {
                    this[resultKey] = initialValueProvider ? initialValueProvider() : undefined;
                }
                clearTimeout(this[timerKey]);
                if (reducer) {
                    this[resultKey] = reducer(this[resultKey], ...args);
                    args = [this[resultKey]];
                }
                this[timerKey] = setTimeout(() => {
                    fn.apply(this, args);
                    this[resultKey] = initialValueProvider ? initialValueProvider() : undefined;
                }, delay);
            };
        });
    }
    exports.debounce = debounce;
});
//# sourceMappingURL=decorators.js.map