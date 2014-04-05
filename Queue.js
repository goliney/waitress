/* 
The MIT License (MIT)

Copyright (c) 2014, Serge Goliney

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/*
    Based on Dustin Diaz's code snippet
    SEE: http://www.dustindiaz.com/async-method-queues
*/

VIO.Queue = function () {
    // store your callbacks
    this._methods = [];
    // keep a reference to response you had flushed
    this._params = {
        'thisArg': null,
        'args': null
    }
    // all queues start off unflushed
    this._flushed = false;
};


VIO.Queue.prototype = {
    _parseParams: function (args_array) {
        var args = [];
        for (var i = 1; i < args_array.length; i++) {
            args.push(args_array[i]);
        }
        return {
            'thisArg': args_array[0],
            'args': args
        }
    },

    _apply: function(method, params, forced) {
        if (method.params && !forced) {
            params = this._parseParams(method.params)
        }
        method.callback.apply(params.thisArg, params.args);
    },

    // adds callbacks and arguments to your queue
    add: function (fn, args_array) {
        // if the queue had been flushed, return immediately
        if (this._flushed) {
            var params = this._params;
            if (args_array && args_array.length > 0) {
                params = this._parseParams(args_array);
            }
            fn.apply(params.thisArg, params.args);
            // otherwise push it on the queue
        } else {
            this._methods.push({
                'callback': fn,
                'params': args_array
            });
        }
    },

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

    run: function () {
        var parsedParams = this._parseParams(arguments);
        for (var i = 0; i < this._methods.length; i++) {
            this._apply(this._methods[i], parsedParams);
        }
    }
};