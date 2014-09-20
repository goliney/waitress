/**
 * Simple asynchronous queue.
 * Based on [snippet]{@link http://www.dustindiaz.com/async-method-queues}
 *
 * @constructor
 * */

Waitress = function () {
    /**
     * Store callbacks and arguments to apply it with
     * @type {Array}
     * @private
     * */
    this._methods = [];

    /**
     * Keep a reference to response you had flushed
     * @type {{thisArg: null, args: null}}
     * @private
     */
    this._params = {
        'thisArg': null,
        'args': null
    };

    /**
     * Flush marker. All queues start off unflushed
     * @type {boolean}
     * @private
     */
    this._flushed = false;
};


Waitress.prototype = {

    /**
     * Detaches `this` variable from arguments array.
     *
     * @param args_array {Array} - Arguments array which begins with `this` variable (args_array[0])
     * @returns {{thisArg: *, args: Array}}
     * @private
     */
    _parseParams: function (args_array) {
        var args = [];
        for (var i = 1; i < args_array.length; i++) {
            args.push(args_array[i]);
        }
        return {
            'thisArg': args_array[0],
            'args': args
        };
    },

    /**
     * Apply callback with arguments
     *
     * @param method {Object} - Item of this._methods
     * @param [params] {Object} - Arguments passed to method. Contains `this` reference and arguments
     * @param [forced] {boolean} - If True, method will be applied with arguments from `params` and not `method.params`
     * @private
     */
    _apply: function (method, params, forced) {
        if (method.params && forced !== true) {
            params = this._parseParams(method.params);
        }
        method.callback.apply(params.thisArg, params.args);
    },

    /**
     * Adds callbacks and arguments to queue. If the queue had been flushed, returns immediately.
     * Otherwise push it on the queue
     *
     * @param fn {Function} - Actual callback
     * @param [args_array] {Array} - Arguments array, containing `this` reference.
     *                               If present, `fn` may be applied with `args_array` eventually
     */
    add: function (fn, args_array) {
        if (this._flushed) {
            var params = this._params;
            // if .add() was called with params, use them instead of flushed params
            if (args_array && args_array.length > 0) {
                params = this._parseParams(args_array);
            }
            fn.apply(params.thisArg, params.args);
        } else {
            this._methods.push({
                'callback': fn,
                'params': args_array
            });
        }
    },

    /**
     * Applies all callbacks in queue and flushes it. Can be called once, as there is no methods left after
     * @param {*} - Arguments .flush() method is called with will be passed to methods in queue
     */
    flush: function () {
        // note: flush only ever happens once
        if (this._flushed) {
            return;
        }
        // store your response for subsequent calls after flush()
        this._params = this._parseParams(arguments);
        // shift 'em out and call 'em back
        while (this._methods[0]) {
            this._apply(this._methods.shift(), this._params);
        }
        // mark that it's been flushed
        this._flushed = true;
    },

    /**
     * Similar to .flush() except it can be called more than once and it doesn't flushes methods from queue.
     * @param {*} - Arguments .run() method is called with will be passed to methods in queue
     */
    run: function () {
        var parsedParams = this._parseParams(arguments);
        for (var i = 0; i < this._methods.length; i++) {
            this._apply(this._methods[i], parsedParams);
        }
    }
};