/**
 * User
 */
var User = (function () {
    function User(name) {
        this.name = name;
        this.userID = idgen();
        msgList[this.userID] = new Array();
        msgList[this.userID].push(true);
    }
    return User;
}());
/**
 * Act
 */
var Act = (function () {
    function Act(act_name) {
        this.act_name = act_name;
    }
    return Act;
}());
/**
 * Data
 */
var Data = (function () {
    function Data(type) {
        this.type = type;
    }
    return Data;
}());
var msgList;
/**
 * 随机字符串
 */
function idgen() {
    var _printable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var text = '';
    for (var i = 0; i < 22; i++) {
        text += _printable.charAt(Math.floor(Math.random() * _printable.length));
    }
    return text;
}
