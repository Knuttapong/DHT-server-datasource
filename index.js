var MicroGear = require('microgear');
const KEY    = 'TkdcJIZBObXnhOv';
const SECRET = 'B79VxX1lcjFbZZv6bIB37BlfR';
const APPID     = 'BonuZzTest001'; 

var microgear = MicroGear.create({
	key : KEY,
	secret : SECRET
});

//var timeserie = require('./series');
var timeserie = [
  {"target": "temp", "datapoints": [ ]},
  {"target": "humid", "datapoints": [ ]}
];

var temp = 0;
var humid = 0;
var count = 0;

microgear.on('connected', function() {
	console.log('Connected...');
	microgear.setalias("nodejs-server");
	microgear.subscribe("/dht");
	setInterval(function() {
		//microgear.chat('nodejs', 'Hello world.');

    now = Date.now();
    timeserie[0].datapoints[count] = [temp, now];
    timeserie[1].datapoints[count] = [humid, now];

    console.log(timeserie[0].datapoints[count][0]+' '+timeserie[1].datapoints[count][0]+' '+now);
    count++;
	},5000);
});

microgear.on('message', function(topic,body) {
  dht = body+"";
  data = dht.split(",");
  temp = data[1];
  humid = data[0];
	console.log('incoming: '+topic+' : '+body + ' at: '+Date.now());
  
});

microgear.on('closed', function() {
	console.log('Closed...');
});

microgear.connect(APPID);

//==============================================================================

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();

app.use(bodyParser.json());

//microgear
//var microgear = require('./js/microgear');
//microgear.connect();

var annotation = {
  name : "annotation name",
  enabled: true,
  datasource: "generic datasource",
  showLine: true,
}
  
function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "accept, content-type");  
}

app.all('/', function(req, res) {
  setCORSHeaders(res);
  res.send('I have a quest for you!');
  res.end();
});

app.all('/search', function(req, res){
  setCORSHeaders(res);
  var result = [];
  _.each(timeserie, function(ts) {
    result.push(ts.target);
  });

  res.json(result);
  res.end();
});

app.all('/annotations', function(req, res) {
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  res.json([]);//annotations 
  res.end();
})

app.all('/query', function(req, res){
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  var tsResult = [];
  _.each(req.body.targets, function(target) {
    if (target.type === 'table') {
      tsResult.push({});//table
    } else {
      var k = _.filter(timeserie, function(t) {
        return t.target === target.target;
      });

      _.each(k, function(kk) {
        tsResult.push(kk)
      });
    }
  });

  res.json(tsResult);
  res.end();
});

app.all('/ledon', function(req, res) {
  setCORSHeaders(res);
  res.send('LED on');
  res.end();
  microgear.chat('DHT', '1');
  console.log('LED on');
})

app.all('/ledoff', function(req, res) {
  setCORSHeaders(res);
  res.send('LED off');
  res.end();
  microgear.chat('DHT', '0');
  console.log('LED off');
})

app.listen(3333);

console.log("Server is listening to port 3333");


