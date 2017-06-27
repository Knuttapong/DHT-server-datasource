var MicroGear = require('microgear');



module.exports = {
    data : '1',
    connect: function () {

        const KEY    = 'TkdcJIZBObXnhOv';
        const SECRET = 'B79VxX1lcjFbZZv6bIB37BlfR';
        const APPID     = 'BonuZzTest001'; 

        var microgear = MicroGear.create({
            key : KEY,
            secret : SECRET
        });

        microgear.on('connected', function() {
            console.log('Connected...');
            microgear.setalias("nodejs-server");
            microgear.subscribe("/dht");
            setInterval(function() {
                //microgear.chat('nodejs', 'Hello world.');
            },5000);
        });

        microgear.on('message', function(topic,body) {
            console.log('incoming: '+topic+' : '+body + ' at: '+Date.now());
        });

        microgear.on('closed', function() {
            console.log('Closed...');
        });

        microgear.connect(APPID);

    }
};


