var http = require('http');
var fs = require('fs');
var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Chargement du fichier index.html affiché au client
var server = http.createServer(app);
var list;
app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "http://10.24.2.41"); // update to match the domain you will make the request from
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  
app.use(express.static('public'));

app.get('/', function(req, res) {
    console.log("hello")
    res.sendFile(__dirname + 'index.html')
});

app.get('/getSongs', function(req, res) {
    console.log("getSongs")
    let jsonData = fs.readFileSync('songList.json')

    list = JSON.parse(jsonData).songList;
    res.setHeader('Content-Type', 'application/json');
    res.send(list);
})

app.post('/newSong', urlencodedParser, function(req, res) {
    console.log("new", res)

    var newSong = {title: req.body.title, tempo: parseInt(req.body.tempo)};
    newSong.id = Date.now();
    list.push(newSong);    
    fs.writeFileSync('songList.json', JSON.stringify({songList: list}));
    res.redirect('/');
})


app.post('/deleteSong/:id', urlencodedParser, function(req, res) {
    console.log("delete", res)
    var id = parseInt(req.params.id);
    var index = list.findIndex((element) => element.id === id)
    if(index !== -1) {
        list.splice(index, 1);
        fs.writeFileSync('songList.json', JSON.stringify({songList: list}));
    }
    res.redirect(301, '/')
    
})



server.listen(9000);