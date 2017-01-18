"use strict";
var RandomString = (function () {
    function RandomString() {
        this._printable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    }
    RandomString.prototype.idgen = function () {
        var text = "";
        for (var i = 0; i < 22; i++) {
            text += this
                ._printable
                .charAt(Math.floor(Math.random() * this._printable.length));
        }
        return text;
    };
    return RandomString;
}());
exports.RandomString = RandomString;
