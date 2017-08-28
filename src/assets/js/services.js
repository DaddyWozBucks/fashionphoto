
angular.module('sportium.services', [])
.factory('Results', ['$http', '$q', function($http, $q){
  function parseFootball(str){
    var deferred = $q.defer();
    var teams = str.split('-');
    var team1A = teams[0].split(" ");
    var team2A = teams[1].split(" ");
    var score1 = team1A[team1A.length -1]
    var score2 = team2A[0];
    var team1 = "";
    var team2 = "";
    angular.forEach(team1A, function(str){
      if (str != team1A[team1A.length -1]) {
        team1 += " ";
        team1 += str;
      }
    })
    angular.forEach(team2A, function(str){
      if (str != team2A[0]) {
        team2 += " ";
        team2 += str;
      }
    })
  deferred.resolve({
    "teamAName": team1,
    "teamBName": team2,
    "teamAScore": score1,
    "teamBScore": score2,
    "sport": "football"
  })
    return deferred.promise;
  }
  function parseTennis(str){
    var deferred = $q.defer();
    var players = str.split('-');
    var bserve = false;
    var setReg = /\(([^)]+)\)/;
    if (players[1].indexOf("*") >= 0) {

      bserve = true;
    } else{

      bserve = false;
    }
    var player1A = players[0].split(" ");
    var player2A = players[1].split(" ");
    var score1 = player1A[player1A.length -1]
    var score2 = player2A[0];
    var player1 = players[0].split('(')[0].slice(0,players[0].split('(')[0].length -1).replace(/\*/, "");
    var player2 =  players[1].split(')')[1].slice(1,players[1].split(')')[1].length).replace(/\*/, "");;
    var games1 = player1A[player1A.length -2];
    var games2 = player2A[1];

    var sets1 = setReg.exec(players[0])[1];
    var sets2 = setReg.exec(players[1])[1];



    var resp = {
      "sport": "tennis",
        "teamAName": player1,
        "teamBName": player2,
        "teamAScore": score1,
        "teamBScore": score2,
        "teamAGames": games1,
        "teamBGames": games2,
        "teamBServing": bserve,
        "scoreboard": { "elements": [ { "title": "Sets", "teamAScore": sets1, "teamBScore": sets2 } ] }
    }

  deferred.resolve(resp)
    return deferred.promise;
  }
  function parseNfl(str){
    var deferred = $q.defer();
    var players = str.split('-');
    var quarter = "";
    var pl2 = "";
    var setReg = /\(([^)]+)\)/;
    if (players[1].indexOf("1st") >= 0) {
      quarter = players[1].slice(players[1].indexOf("1st"),players[1].length)
      pl2 = players[1].slice(0, players[1].indexOf("1st") - 1)
    } else if (players[1].indexOf("2nd") >= 0) {
      quarter = players[1].slice(players[1].indexOf("2nd"),players[1].length)
      pl2 = players[1].slice(0, players[1].indexOf("2nd") - 1)
    } else if (players[1].indexOf("3rd") >= 0) {
      quarter = players[1].slice(players[1].indexOf("3rd"),players[1].length)
      pl2 = players[1].slice(0, players[1].indexOf("3rd") - 1)
    }
    else if (players[1].indexOf("4th") >= 0) {
      quarter = players[1].slice(players[1].indexOf("4th"),players[1].length)
      pl2 = players[1].slice(0, players[1].indexOf("4th") - 1)
    }

    var player1A = players[0].split(" ");
    var player2A = pl2.split(" ");
    var score1 = player1A.splice(player1A.length -1,1)[0]
    var score2 = player2A.splice(0,1)[0];
    var player1 = player1A.join(" ");
    var player2 =  player2A.join(" ");




    var resp = {
      "sport": "nfl",
      "teamAName": player1,
      "teamBName": player2,
      "teamAScore": score1,
      "teamBScore": score2,
      "currentPeriod": quarter
    }

  deferred.resolve(resp)
    return deferred.promise;
  }
  function determineSport(str){
    if (str.indexOf("Quarter") > -1) {
      return parseNfl(str);
    } else if (str.indexOf("*") > -1) {
      return parseTennis(str)
    } else  {
        return parseFootball(str);
    }
  }

  function parse(sport, str){
    switch (sport) {
      case 'football':
          return parseFootball(str);
      case 'nfl':
          return parseNfl(str);
      case 'tennis':
          return parseTennis(str)
      case 'auto':
          return determineSport(str)
      default:
          return " "
  }
  }
	return {
    parse: function(sport, str){
      return parse(sport, str)
    }
	}
}])
