require("dotenv").config();

var request = require("request");

var Spotify = require("node-spotify-api");

var moment = require("moment");

var fs = require("fs");

var spotifyKeys = require("./keys");

var nodeCommand = process.argv[2];
var nodeArgs = process.argv;
var name = "";


function getInfo(){
  for (let i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      name = name + "+" + nodeArgs[i];
    } else {
      name += nodeArgs[i];
    }
  }
};

//concert-this 
function bandsInTown() {
  getInfo();

  var queryUrl = `https://rest.bandsintown.com/artists/${name}/events?app_id=codingbootcamp`

  request(queryUrl, function (error, response, body){
    var result = JSON.parse(body);
    if (!error && response.statusCode === 200) {
      for (let i = 0; i < result.length; i++) {
        console.log(`
        Venue Name: ${result[i].venue.name}
        Location: ${result[i].venue.city}, ${result[i].venue.region}, ${result[i].venue.country}
        Event Date: ${moment(result[i].datetime, "YYYY-MM-DDTHH:mm:ss").format("HH:mm MMMM Do YYYY")}`)
      }
    };
  });
};

const spotify = new Spotify(spotifyKeys.spotify)

//spotify-this song

function spotifyThis() {
  getInfo();

  if (nodeArgs.length < 4) {
    name = "The+Sign";
  }

  spotify.search({
    type: 'track',
    query: name,
    limit: 5
  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    };
    const result = data.tracks.items;

    for (let i = 0; i < result.length; i++) {
      console.log(`
      Artists: ${result[i].artists[0].name}
      Song Name: ${result[i].name}
      Preview Link: ${result[i].external_urls.spotify}
      Album: ${result[i].album.name}`)
    }
  });
};


//movie this
function movie() {
  getInfo();

  if (nodeArgs.length < 4) {
    name = "Armageddon";
  }

  var queryUrl = `http://www.omdbapi.com/?t=${name}&apikey=trilogy`;

  request(queryUrl, function (error, response, body) {
    const result = JSON.parse(body);
    if (!error && response.statusCode === 200) {
      console.log(`
        Title: ${result.Title}
        Year: ${result.Year}
        IMDB Rating: ${result.imdbRating}
        Rotten Tomatoes Rating: ${result.Ratings[1].Value}
        Country: ${result.Country}
        Language: ${result.Language}
        Plot: ${result.Plot}
        Actors: ${result.Actors}`)
    };
  });
};

//do what it says

function random() {
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    data = data.split(",");

    process.argv[3] = data[1];

    nodeCommand = data[0];

    switch (nodeCommand) {
      case "concert-this":
        bandsInTown();
        break;
      case "spotify-this-song":
        spotifyThis();
        break;
      case "movie-name":
        movie();
        break;
    };
  });
};

switch (nodeCommand) {
  case "concert-this":
    bandsInTown();
    break;
  case "spotify-this-song":
    spotifyThis();
    break;
  case "movie-this":
    movie();
    break;
  case "do-what-it-says":
    random();
    break;
};





