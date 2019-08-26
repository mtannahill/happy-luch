function getLunch() {

  // Get the spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Get the list of places
  var s_places = ss.getSheetByName('places');
  var places = s_places.getDataRange().getValues();

  // Grab a random place
  var e = Math.floor(Math.random() * places.length);
  var rand_place = places[e][0];

  talk(rand_place);
}

function listLunch() {

  // Get the spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Get the list of places
  var s_places = ss.getSheetByName('places');
  var places = s_places.getDataRange().getValues();

  var msg = "";

  for (var i = 0; i < places.length; i++) {
    msg += " \n ";
    msg += places[i][0];
  }
  talk(msg);
}

function addLunch(commandReceieved){
    // Get the spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Get the list of places
  var s_places = ss.getSheetByName('places');
  var places = s_places.getDataRange().getValues();

  //Get place to add
  Logger.log(commandReceieved);
  var new_place = commandReceieved.replace('!lunch-add','').trim();

  var duplicate = false;

  for (var i = 0; i < places.length; i++) {
    if(places[i][0].trim().equals(new_place)) duplicate = true;
  }

  var msg = "";
  if(duplicate){
    msg = new_place.concat(" is already in happy-lunch!");
  }
  else if(new_place.indexOf(":") !== -1 || new_place.indexOf("!") !== -1 || new_place.match(/[^a-zA-Z0-9]/)){
    msg = new_place.concat(" can not be added to happy-lunch!");
  }
  else{
    //Add to spreadsheet
    s_places.appendRow([new_place]);
    msg = new_place.concat(" was added to happy-lunch!");
  }

  talk(msg)
}

function printHelp(){
  var msg = "*Help Commands:*\n\n";
  msg += "- *!lunch-help*: To see lunch help commands\n";
  msg += "- *!lunch*: To pick a lunch place at random\n";
  msg += "- *!lunch-list*: To list the lunch places in happy-lunch!\n";
  msg += "- *!lunch-add <Place>*: to add a new lunch spot to happy-lunch!\n";
  talk(msg);
}


var payload = {
  'link_names': 1
}

var opts = {
  'method': 'post',
  'contentType': 'application/json'
}

// Utility fn to send an ad hoc message as happy lunch
function talk(msg) {

  payload.text = msg;
  opts.payload = JSON.stringify(payload);

  Logger.log(payload.text);

  var url = getProperty("SLACK_WEBHOOK");

  result = UrlFetchApp.fetch(url, opts);

}

function getProperty(propertyName){
  return PropertiesService.getScriptProperties().getProperty(propertyName);
}

function doPost(e){
 var token = e.parameter["token"]
 if (token.equals(getProperty("TOKEN"))){
   var commandReceived = e.parameter["text"];

    Logger.log(commandReceived);
    if(commandReceived.match(/lunch-help/)) printHelp();
    else if (commandReceived.match(/lunch-add*/)) addLunch(commandReceived);
    else if (commandReceived.match(/lunch-remove*/)) removeLunch(commandReceived);
    else if (commandReceived.match(/lunch-list/)) listLunch();
    else if (commandReceived.match(/lunch/)) getLunch();
    else talk("Happy Lunch Command Not Found!");
  }
}

function doGet(e){
  Logger.log('getLunch');
}
