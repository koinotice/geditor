// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react';
import ReactDOM from 'react-dom';
import { generateUniqueId } from '../utils/common';

class Solc {
    constructor() {
        this.id = generateUniqueId() + "_solc";
        this._queue = [];
        this.ref = null;
        this._counter = 0;
        this._cbMap = {};
        this._version = "0.5.10";
    }

    init() {
        var setRef = (ref) => {
            this.ref = ref;
            var cb;
            cb = () => {
                if (this.isLoaded()) {
                    this.ref.contentWindow.queueMessageReply = this._response;
                } else {
                    setTimeout(cb, 100);
                }
            };
            cb();
        };

        ReactDOM.render((
            <div style={{display: 'none'}} id={this.id}>
                <iframe ref={setRef} src="/solc/index-v0.5.10.html" frameBorder="0"></iframe>
            </div>
        ), document.getElementById('solc'));

        setInterval(this._processQueue, 100);
    }

    getVersion = () => {
        return this._version;
    };

    _response = (msg) => {
        if (this._cbMap[msg.id]) {
            const cb = this._cbMap[msg.id];
            delete this._cbMap[msg.id];
            cb(msg.data);
        }
    };

    queue = (cmd, cb) => {
        const id = ++this._counter;
        this._cbMap[id] = cb;
        this._queue.push({ data:cmd, id:id });
    };

    isLoaded = () => {
        return this.ref && this.ref.contentWindow && this.ref.contentWindow.queueMessage;
    };

    isReady = () => {
        return this.isLoaded() && this.ref.contentWindow.queueMessageReply;
    };

    _processQueue = () => {
        if (this._processBusy) {
            return;
        }

        this._processBusy = true;

        if (this.isReady() && this._queue.length > 0) {
            this.ref.contentWindow.queueMessage(this._queue.pop());
        }

        this._processBusy = false;
    };
}

export const compilerService = new Solc();
