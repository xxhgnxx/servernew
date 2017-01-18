import * as schema from 'jsonschema';

let scheam = {
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

export function getconfig() {
    let fs = require('fs');
    let config = JSON.parse(fs.readFileSync('appconfig.json'));
    let mySchema = new schema.Validator()


    
if (mySchema.validate(config, scheam).valid) {
    return config;
    } else{
        return false;    
}

}

