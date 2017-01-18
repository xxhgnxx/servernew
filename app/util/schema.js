"use strict";
var schema = require("jsonschema");
var scheam = {
    "type": "object",
    "properties": {
        "port": {
            "type": "integer",
            "default": 81
        },
        "sendtrytime": {
            "type": "integer",
            "default": 5
        },
        "sendtimeout": {
            "type": "integer",
            "default": 2000
        }
    },
    "required": ["port", "sendtrytime", "sendtimeout"]
};
function getconfig() {
    var fs = require('fs');
    var config = JSON.parse(fs.readFileSync('appconfig.json'));
    var mySchema = new schema.Validator();
    if (mySchema.validate(config, scheam).valid) {
        return config;
    }
    else {
        return false;
    }
}
exports.getconfig = getconfig;
