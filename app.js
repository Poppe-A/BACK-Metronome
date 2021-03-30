var http = require('http');
var fs = require('fs');
var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();


// Chargement du fichier index.html affiché au client
var server = http.createServer(app);
var list;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // allow requests from any other server
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); // allow these verbs
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
    
    next();
});

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.get('/getSongs', function(req, res) {
    console.log("get songs")

    let jsonData = fs.readFileSync('json/songList.json')

    list = JSON.parse(jsonData).songList;
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(list);
})

app.post('/newSong', [urlencodedParser,jsonParser], function(req, res) {
    console.log("new song", req.body)

    var newSong = {title: req.body.title || "defaultTitle", tempo: parseInt(req.body.tempo || 120), timeSignature: parseInt(req.body.timeSignature || 4)};

    newSong.id = Date.now();
    list.push(newSong);    
    fs.writeFileSync('json/songList.json', JSON.stringify({songList: list}));
    res.status(200).send(list);
})

app.post('/updateSong', [urlencodedParser,jsonParser], function(req, res) {
    console.log("update song", req.body)

    const {title, id, tempo, timeSignature} = req.body;

    var songtoUpdate = list.find((element) => element.id === id)
    songtoUpdate.title = title;
    songtoUpdate.id = id;
    songtoUpdate.tempo = tempo;
    songtoUpdate.timeSignature = timeSignature;

    fs.writeFileSync('json/songList.json', JSON.stringify({songList: list}));
    res.status(200).send(list);
})

app.post('/deleteSong/:id', urlencodedParser, function(req, res) {
    console.log("delete song", req.params.id)

    var id = parseInt(req.params.id);
    var index = list.findIndex((element) => element.id === id)
    if(index !== -1) {
        list.splice(index, 1);
        fs.writeFileSync('json/songList.json', JSON.stringify({songList: list}));
    }
    res.status(200).send(list);    
})

app.get('/', function(req, res) {
    console.log("ok")
});


server.listen(9000);