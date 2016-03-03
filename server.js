var express = require('express');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/WeatherPOC', function (error) {
    if (error) {
        console.log(error);
    }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connection :D");
});

var WeatherSchema = new Schema({
  dateTime: String,
  atmosphericPressureMBar : Number,
  rainfallMM : Number,
  windSpeedMS : Number,
  windDirectionDegrees : Number,
  surfaceTemperatureC : Number,
  relativeHumidityPercent : Number,
  solarFluxKwM2 : Number,
  batteryV : Number
})

var Weather = mongoose.model('weatherstats', WeatherSchema);

/*
var test = new Weather({
  "dateTime" : "2052/01/01 00:01",
  "atmosphericPressureMBar" : 1016,
  "rainfallMM" : 0,
  "windSpeedMS" : 7.65,
  "windDirectionDegrees" : 199.9,
  "surfaceTemperatureC" : 8.98,
  "relativeHumidityPercent" : 71.59999999999999,
  "solarFluxKwM2" : 0,
  "batteryV" : 13.75
});

test.save(function(err, thor) {
  if (err)  {
    return console.error(err)
  } else {
    console.log("Saved")
    console.dir(JSON.stringify(thor));
  }
});*/


//console.log(Weather);



app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  res.render('index.ejs');
});

app.get('/data', function (req, res) {
  Weather.find({"dateTime" : {$regex : ".*2015/01/01.*"}}, function (err, docs) {
    if(!err) {
      console.log("Success");
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(docs));
    } else {
      console.log("Error");
      console.log(err)
    }
  });


})

http.listen(3000, function () {
  app.use(express.static(__dirname + '/public'));
  console.log(__dirname + '/public');
  console.log('Example app listening on port 3000!');
});
