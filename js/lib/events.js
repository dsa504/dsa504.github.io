"use strict";

var _vue = require("vue");

var _vue2 = _interopRequireDefault(_vue);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

require("babel-polyfill");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var getPrettyDate, createVm, configResponse, config, vm;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    getPrettyDate = function getPrettyDate(uglydateTime) {
                        var theMoment = (0, _moment2.default)(uglydateTime);

                        var day = theMoment.format("dddd");
                        var month = theMoment.format("MMMM");
                        var date = theMoment.format("Do");
                        var year = theMoment.format("YYYY");
                        var time = theMoment.format("h:mm");
                        var ampm = theMoment.format("a");
                        var output = { day: day, month: month, date: date, year: year, time: time, ampm: ampm };

                        return output;
                    };

                    createVm = function createVm(config) {
                        var _vm = {
                            el: '#dsa-cal-app',
                            data: {
                                calEvents: [],
                                showErrors: false
                            },
                            methods: {},
                            //showErrors:false,
                            mounted: function () {
                                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                                    var today, uri, response, theEvents;
                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    today = (0, _moment2.default)(new Date());
                                                    // only get upcoming events:

                                                    uri = "https://www.googleapis.com/calendar/v3/calendars/" + config.calendarId + "/events?key=" + config.apiKey + "&timeMin=" + today.toISOString();
                                                    response = void 0;
                                                    _context.prev = 3;
                                                    _context.next = 6;
                                                    return fetch(uri);

                                                case 6:
                                                    response = _context.sent;
                                                    _context.next = 13;
                                                    break;

                                                case 9:
                                                    _context.prev = 9;
                                                    _context.t0 = _context["catch"](3);

                                                    _vm.showErrors = true;
                                                    return _context.abrupt("return");

                                                case 13:
                                                    if (response.ok) {
                                                        _context.next = 15;
                                                        break;
                                                    }

                                                    return _context.abrupt("return", _vm.showErrors = true);

                                                case 15:
                                                    _context.next = 17;
                                                    return response.json();

                                                case 17:
                                                    theEvents = _context.sent.items;


                                                    _vm.data.calEvents = theEvents
                                                    // all day events don't have a dateTime, so will screw up the chonological order- so if there's no dateTime, just use date
                                                    .map(function (e) {
                                                        var hasStartTime = e.start.dateTime != undefined;
                                                        var startTime = hasStartTime ? e.start.dateTime : e.start.date;

                                                        var hasEndTime = e.end.dateTime != undefined;
                                                        var endTime = hasEndTime ? e.end.dateTime : e.end.date;

                                                        return Object.assign({}, e, {
                                                            hasStartTime: hasStartTime,
                                                            hasEndTime: hasEndTime,
                                                            prettyStartTime: getPrettyDate(startTime),
                                                            prettyEndTime: getPrettyDate(endTime)
                                                        });
                                                    })
                                                    // sort to make sure the events are in chron order
                                                    .sort(function (x, y) {
                                                        var a = new Date(x.theStart);
                                                        var b = new Date(y.theStart);
                                                        return a < b ? -1 : a > b ? 1 : 0;
                                                    });

                                                case 19:
                                                case "end":
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, undefined, [[3, 9]]);
                                }));

                                function mounted() {
                                    return _ref2.apply(this, arguments);
                                }

                                return mounted;
                            }()
                        };

                        return _vm;
                    };

                    configResponse = void 0;
                    _context2.prev = 3;
                    _context2.next = 6;
                    return fetch("/calendarconfig.json");

                case 6:
                    configResponse = _context2.sent;
                    _context2.next = 12;
                    break;

                case 9:
                    _context2.prev = 9;
                    _context2.t0 = _context2["catch"](3);

                    console.log(_context2.t0);

                case 12:
                    _context2.next = 14;
                    return configResponse.json();

                case 14:
                    config = _context2.sent;
                    vm = createVm(config);


                    window.vm = vm;
                    new _vue2.default(vm);

                case 18:
                case "end":
                    return _context2.stop();
            }
        }
    }, _callee2, undefined, [[3, 9]]);
}))();