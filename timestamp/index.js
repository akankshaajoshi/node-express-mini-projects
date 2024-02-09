// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.get("/api/", function(req, res){
  let date = new Date();
  let unix = date.getTime();
  let utc = date.toUTCString();
  res.json({
    "unix": unix,
    "utc": utc
  });

});
// your first API endpoint... 
app.get("/api/:date", function(req, res) {
  
  let date = req.params.date;
  const checkValid = new Date(date);
  
  let unixDate;
  let utcDate;
  //handle timestamp as date
  if(date.match(/\d{5,}/)){
  unixDate = parseInt(date);
  utcDate = new Date(unixDate).toUTCString();
  res.json({
    unix: unixDate,
    utc: utcDate
  })
  }

  //if it matches valid date format
  if(date.match(/\d{4}-\d{2}-\d{2}/) || new Date(date)){
    unixDate = new Date(date).getTime();
    utcDate = new Date(date).toUTCString();
  //handle invalid dates - OK
  if (!utcDate || !unixDate) {
  res.send({error: checkValid.toString()})
  }
    
    res.json({
      unix: unixDate,
      utc: utcDate });
}
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
