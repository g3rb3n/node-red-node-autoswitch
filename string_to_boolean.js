module.exports = function(RED) {
    "use strict";
    // var fileType = require('file-type');

    var twitterRateTimeout;
    var retry = 60000; // 60 secs backoff for now

    var localUserCache = {};
    var userObjectCache = {};


    function AutoSwitchNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {
            try{
                let state = msg.payload;
                if (state === "on")
                    msg.payload = true;
                if (state === "off")
                    msg.payload = false;
                    if (state === "On")
                        msg.payload = true;
                    if (state === "Off")
                        msg.payload = false;
                return msg;
            }
            catch (err) {
                node.error(err);
            }
        })
    }
    RED.nodes.registerType("autoswitch", AutoSwitchNode);
}
