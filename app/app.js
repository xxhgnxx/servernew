"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var socketio = require("socket.io");
var myemitter_1 = require("./util/myemitter");
var schema_1 = require("./util/schema");
var fs = require('fs');
var config = schema_1.getconfig();
if (!config) {
    console.log("配置文件错误!!");
}
else {
    console.log("端口", config.port);
    console.log("重试次数", config.sendtrytime);
    console.log("超时时间", config.sendtimeout);
}
var io = socketio.listen(config.port);
var newsend = true;
var socketIdtoSocket = new Map();
io.on('connection', function (socket) {
    console.log(Date().toString().slice(15, 25), "有人连接", socket.id);
    socket.emit("ok");
    socket.on("disconnect", function () {
        socketIdtoSocket.delete(socket.id);
    });
    socket.on("system", function (data) {
        console.log("sytem_data");
        io.emit(data.key);
    });
    socket.on("back", function (key) {
        //  发送消息返回的消息确认器
        myemitter_1.myEmitter.emit(key);
    });
});
function send(data, who) {
    if (who) {
        if (typeof who === 'Array') {
            sendAny(data, who);
        }
        else {
            sendOne(data, who);
        }
    }
    else {
        sendAll(data);
    }
}
function sendAll(data) {
    sendAny(data, userlist);
}
function sendAny(data, list) {
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var user = list_1[_i];
        sendOne(data, user);
    }
}
function sendOne(data, who) {
    msgList[who.userID].push(data);
}
function netemit(who, data) {
    return __awaiter(this, void 0, void 0, function () {
        var trytime, _loop_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!msgList[who.userID][1]) return [3 /*break*/, 4];
                    trytime = config.sendtrytime;
                    _loop_1 = function () {
                        var key, tmpemit, sendres;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    trytime++;
                                    key = idgen();
                                    tmpemit = io
                                        .sockets[who.socketid]
                                        .emit('system', msgList[who.userID][1], key);
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            var timeout = setTimeout(function () {
                                                tmpemit.close();
                                                myemitter_1.myEmitter.removeListener(key, function () { });
                                                resolve(false);
                                            }, config.sendtimeout);
                                            myemitter_1.myEmitter.once(key, function () {
                                                clearTimeout(timeout);
                                                resolve(true);
                                            });
                                        })];
                                case 1:
                                    sendres = _a.sent();
                                    if (sendres) {
                                        msgList.splice(1, 1);
                                    }
                                    else {
                                        console.log("消息发送失败");
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!(msgList[who.userID][0] && trytime <= 5)) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3:
                    console.log("消息发送结束");
                    return [3 /*break*/, 5];
                case 4:
                    console.log("消息正在发送中..");
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
