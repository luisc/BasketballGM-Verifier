// determine if a player:
// started with a fantasy draft in 2015
// made no trades
// did not use god mode

var fs = require('fs');

function logger(output, variable) {
  console.log("---------------");
  console.log(output);
  console.log(variable);
  console.log("---------------");
  console.log("");
}

// check if a file was provided
if (process.argv[2] && process.argv[2].length > 0) {
  
  var filename = process.argv[2];
  
  // check if that argument is a real file
  fs.stat(filename, function(err, stat) {
    
    // good to go!
    if (err == null) {
      
      var league = JSON.parse(fs.readFileSync(filename, 'utf8'));
      
      var hadFantasyDraft = false, hadAnotherFantasyDraft = false, tradedPlayer = false, usedGodMode = false;

      // check for fantasy draft

      // if season is 2015, and type is draft, make sure text has fantasy draft
      // if season is not 2015, make sure draft does not have fantasy draft
      for (var ii = 0; ii < league['events'].length; ii++) {
  
        // check for fantasy draft
        if (league['events'][ii]['type'] === 'draft') {
    
          var haystack = league['events'][ii]['text'].toLowerCase();
    
          if (league['events'][ii]['season'] === 2015) {
      
            if (haystack.indexOf('fantasy draft') !== 0) {
              hadFantasyDraft = true;
              break;
            }
      
          } else if (league['events'][ii]['season'] !== 2015) {
      
            if (haystack.indexOf('fantasy draft') !== 0) {
              hadAnotherFantasyDraft = true;
              break;
            }
      
          }
        }
  
        // check for trades
        if (league['events'][ii]['type'] === 'trade') {
          tradedPlayer = true;
        }
      }


      // check for god mode
      for (var ii = 0; ii < league['gameAttributes'].length; ii++) {
        if (league['gameAttributes'][ii]['key'] === 'godModeInPast') {
          usedGodMode = league['gameAttributes'][ii]['value'];
        }
      }
  
      logger("Had Fantasy Draft in 2015:", hadFantasyDraft);
      logger("Had Fantasy Draft AFTER 2015:", hadAnotherFantasyDraft);
      logger("Traded a Player:", tradedPlayer);
      logger("Used God Mode:", usedGodMode);
      
      
    } else if (err.code == 'ENOENT') {
      console.log('Error');
    } else {
      console.log('Some weird error: ', err.code);
    }
  });
   
} else {
  console.log('Make sure to specify a file!')
}



