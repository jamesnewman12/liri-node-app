require('dotenv').config();

const keys = require("./keys.js");

const Twitter = require("twitter");

const Spotify = require("node-spotify-api");

const request = require("request");

const fs = require("fs");

const spotify = new Spotify({
  id: "0138177a93da40f9a83c4f901ceba572",
  secret: "f93226ca830b43edba8d44ddff40a2f3"
});

const getArtistNames = function(artist) {
  return artist.name;
};

const getMeSpotify = function(songName) {
  if (songName === undefined) {
    songName = "I want it that way";
  }

  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      const songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(getArtistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};


const getMyTweets = function() {
  let client = new Twitter(keys);

  let params = {
    screen_name: "cnn"
  };
  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at);
        console.log("");
        console.log(tweets[i].text);
      }
    }
  });
};

const getMeMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  const urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=8faba279";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const jsonData = JSON.parse(body);

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotton Tomatoes URL: " + jsonData.tomatoURL);
    }
  });
};


const doWhatItSays = function() {
  fs.readFile("random.txt", function(error, data) {
    console.log(data);

    const dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    }
    else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};


const pick = function(caseData, functionData) {

  switch (caseData) {
    case "my-tweets":
      getMyTweets();
      break;
    case "spotify-this-song":
      getMeSpotify(functionData);
      break;
    case "movie-this":
      getMeMovie(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("LIRI has't heard of that.");
  }
};

const runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
}


runThis(process.argv[2], process.argv[3]);