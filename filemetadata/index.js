//Config settings

var express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const formidable = require('formidable');
const bodyParser = require('body-parser');
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
//Database - not needed here // single time use
// mongoose.connect("mongodb+srv://joshiaj33:akanksha@cluster0.kpspvds.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })

//Endpoints
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/fileanalyse", function(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const file = files.upfile;
      const fileName = file[0].originalFilename;
      const fileSize = file[0].size;
      const fileType = file[0].mimetype;
         res.json({
      name: fileName,
      type: fileType,
      size: fileSize
    })
    }
  })
});

//Server
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Your app is listening on port ' + port)
});
