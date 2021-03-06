/**
 * @license
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const debug = require('debug');
const EventEmitter = require('events').EventEmitter;

function setLevel(level) {
  if (level === 'verbose') {
    debug.enable('*');
  } else if (level === 'error') {
    debug.enable('*:error');
  } else {
    debug.enable('*, -*:verbose');
  }
}

const loggers = {};
function _log(title, logargs) {
  const args = [...logargs].slice(1);
  if (!loggers[title]) {
    loggers[title] = debug(title);
  }
  return loggers[title](...args);
}

class Emitter extends EventEmitter { }
const events = new Emitter();

module.exports = {
  setLevel,
  events,
  log(title) {
    if (title === 'status' || title === 'statusEnd') {
      events.emit(title, arguments);
    }
    return _log(title, arguments);
  },

  warn(title) {
    return _log(`${title}:warn`, arguments);
  },

  error(title) {
    return _log(`${title}:error`, arguments);
  },

  verbose(title) {
    return _log(`${title}:verbose`, arguments);
  }
};
