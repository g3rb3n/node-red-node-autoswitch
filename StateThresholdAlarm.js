module.exports = function(RED) {
    "use strict";

    function StateThresholdAlarm(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.thresholdSeconds = config.thresholdSeconds;
        node.onState = config.onState;
        node.on('input', function(msg) {
            try{
                var context = node.context();
                let state = msg.payload;
                let match = state == node.onState;
                let lastOtherState = context.get('lastOtherState');
                let now = new Date();

                if (!lastOtherState){
                    lastOtherState = new Date();
                    context.set('lastOtherState', now);
                }

                if (!match){
                    lastOtherState = now;
                    context.set('lastOtherState', now);
                }

                let seconds = (now - lastOtherState)/1000;

                if (match && seconds > node.thresholdSeconds){
                    msg.alarm = true;
                    msg.message = '@' + state + ' for more than ' +  node.thresholdSeconds + ' seconds';
                    node.status({fill:"red",shape:"ring",text:"ALARM " + state + " for " +  Math.round(seconds) + "s"});
                    node.send(msg);
                }else if (!match){
                    node.status({fill:"green",shape:"dot",text:"OK " + state + " is not " + node.onState});
                }else{
                    node.status({fill:"green",shape:"dot",text:"OK " + state + " for " +  Math.round(seconds) + "s"});
                }
            }
            catch (err) {
                node.error(err);
            }
        })
    }
    RED.nodes.registerType("StateThresholdAlarm", StateThresholdAlarm);
}
