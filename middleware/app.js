var http = require('http');
var express = require('express');
var app = express();
var artistName = "Taylor";
var bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000 );
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.post('/searchCelebrity', function(req, response){
    var imageUrls = {};
    artistName = req.body.searchValue;
    var options = {
        host: 'api-3283.iheart.com',
        port: 80,
        path: '/api/v1/catalog/searchAll?keywords='+artistName+'&queryTrack=false&queryArtist=true&queryFeaturedStation=false&queryTalkShow=false&queryTalkTheme=false&queryKeyword=false&countryCode=US',
        method: 'GET'
    };


    http.request(options, function(res){
        var body = '';

        res.on('data', function(chunk){
            body+= chunk;
        })

        res.on('end', function(){
            var artistList = JSON.parse(body);
            var artistArray = artistList.trackBundles;
            if(typeof artistArray !== 'undefined' && artistArray.length > 0){
                var artistResponseInfo ={
                    artistName:[],
                    imageUrls:[]
                }

                var imageUrls =[];
                if(artistArray.length > 6){
                    for(var i=0; i<=5; i++){
                        var artistId = artistArray[i].artistId;
                        artistResponseInfo.artistName.push(artistArray[i].artist);
                        artistResponseInfo.imageUrls.push("http://iscale.iheart.com/catalog/artist/"+artistId + "?ops=fit(250,0)");
                    }
                }
                else{
                    for(var i=0; i<artistArray.length; i++){
                        var artistId = artistArray[i].artistId;
                        artistResponseInfo.artistName.push(artistArray[i].artist);
                        artistResponseInfo.imageUrls.push("http://iscale.iheart.com/catalog/artist/"+artistId + "?ops=fit(250,0)");
                    }
                }

                response.send(artistResponseInfo);
            }
            else{
                response.send(false);
            }

        })
        res.on('error', function(err, result){
            if(err){
                return console.log('Error while fetching the artist: ', err);
            }
            console.log(result);
        });
    }).on('error', function(err, result){
        if(err){
            return console.log('Error while fetching the artist: ', err);
        }
        console.log(result);
    }).end();
});

app.listen(app.get('port'), function() {
    console.log('Listening on port ' + app.get('port'));
});