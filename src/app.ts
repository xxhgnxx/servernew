import * as socketio from "socket.io";
import {myEmitter} from './util/myemitter';
import {getconfig} from './util/schema';

let fs = require('fs');
var config = getconfig();
if (!config) {
    console.log("配置文件错误!!");
} else {
    console.log("端口", config.port);
    console.log("重试次数", config.sendtrytime);
    console.log("超时时间", config.sendtimeout);
}

let io = socketio.listen(config.port);
let newsend = true;
let socketIdtoSocket = new Map();

io.on('connection', socket => {
    console.log(Date().toString().slice(15, 25), "有人连接", socket.id);
    socket.emit("ok");

    socket.on("disconnect", () => {
        socketIdtoSocket.delete(socket.id);
    });
    socket.on("system", (data : Data) => {
        console.log("sytem_data");
        io.emit(data.key);
    });
    socket.on("back", (key : string) => {
        //  发送消息返回的消息确认器
        myEmitter.emit(key);
    });
})

function send(data : Data, who?: any) {
    if (who) {
        if (typeof who === 'Array') {
            sendAny(data, who);
        } else {
            sendOne(data, who);
        }
    } else {
        sendAll(data);
    }
}
function sendAll(data : Data) {
    sendAny(data, userlist);
}
function sendAny(data : Data, list : User[]) {
    for (let user of list) {
        sendOne(data, user);
    }
}
function sendOne(data : Data, who : User) {
    msgList[who.userID].push(data);
}

async function netemit(who : User, data : Data) {
    if (msgList[who.userID][1]) { // 确认是否有发送器正在处理该玩家的消息队列
        let trytime = config.sendtrytime; // 尝试次数
        while (msgList[who.userID][0] && trytime <= 5) {
            trytime++;
            let key = idgen();
            let tmpemit = io
                .sockets[who.socketid]
                .emit('system', msgList[who.userID][1], key);
            let sendres = await new Promise(resolve => {
                let timeout = setTimeout(() => {
                    tmpemit.close();
                    myEmitter.removeListener(key, () => {});
                    resolve(false);
                }, config.sendtimeout);
                myEmitter.once(key, () => {
                    clearTimeout(timeout);
                    resolve(true);
                })
            });
            if (sendres) {
                msgList.splice(1, 1);
            } else {
                console.log("消息发送失败");
            }
        }
        console.log("消息发送结束");
    } else {
        console.log("消息正在发送中..");
    }
}
