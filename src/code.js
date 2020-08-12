function sendText(chatId, text, keyBoard) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramBotToken + '/', data);
}

//
//function flatten(arrayOfArrays) {
//  return [].concat.apply([], arrayOfArrays); 
//}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


//-----------------------------------------SIGNUP ANGELA------------------------------------------------------

// FUNCTION userExists = checks if user exists in google sheets already/
// if user exists, returns chatID, room, zone, firstName and all booking timings
// else returns an empty {}

function userExists(userID){
  Logger.log("userExistsRan");
  var sheet = SpreadsheetApp.openById(userSheetId).getSheetByName("Users");
  var rangeData = sheet.getDataRange();
  var lastColumn = rangeData.getLastColumn();
  var lastRow = rangeData.getLastRow();
  var searchRange = sheet.getRange(2,2, lastRow-1, lastColumn-1); 
  var rangeValues = searchRange.getValues();

  var person = {}

    for ( j = 0 ; j < lastRow - 1; j++){
      if(rangeValues[j][0] == userID){
        person["chatID"] = rangeValues[j][0];
        person["room"] = rangeValues[j][1];
        person["zone"] = rangeValues[j][2];
        person["firstName"] = rangeValues[j][3];
        var bookings = [];
        for (i = 4; i < lastColumn; i++) {
          bookings.push(rangeValues[j][i])
        }
        person["bookings"] = bookings
        break;
      }
    };
  return person;
  
  
}

//FUNCTION isRoomValid = checks if the chatID already exists, then checks if the input is an alphabat within A to E 
// and if floor is < 5 
// and if room is < 25
function isRoomValid(content) {
  var room = content.messge.text;
  if (userExists(content.message.chat.id) == {}) {
    if (".[A-E][0-9]{3}".test(room)) { //CHECK REGEX NOT SURE IF CORRECT
      if (parseInt(room.slice(0)) < 5 && parseInt(room.slice(-2)) < 25) {
        return true;
      }
    }
  }
  return false;
}


// FUNCTION register = checks if the user is already registered
// if registered, returns details of individual and prompts individual for next action
// if not register, prompts user to input room number
function register(content) {
  Logger.log("running register");
  var chatID = content.message.chat.id;
  Logger.log(chatID);
  var user = userExists(chatID);
  
  
  if (user == {}) {
    var reply = {
      'chat_id': chatID,
      'text': "You do not exist yet. " + '\n\n' +
      "Let's change that. What is your room number?"
    };
    var method = 'sendMessage';
    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(reply)
    };
    var response = UrlFetchApp.fetch(telegramUrl + '/' + method, options);
    
    
  } else {
    var reply = {
      'chat_id': chatID,
      'text': "Welcome back " + user['firstName'] + "!!" + '\n' +
      "RoomNumber: " + user['room'] + '\n' +
      "Zone: " + user['zone'] + '\n\n' +
      "Would you like to make a booking? /UPDATEHERE" + '\n' +
      "Would you like to check your bookings? /UPDATEHERE" + '\n' +
      "Would you like to check the available timeslots? /UPDATEHERE"
    };
    var method = 'sendMessage';
    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(reply)
    };
    var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
  }
}


// FUNCTION addUser = should only be triggered after isRoomValid check
// uses the user's room input to add user into the google sheet
// if his zone cannot be found, invalid input is triggered
// if successful, user's new details are returned and prompts user's next step
function addUser(content) {
  var userSpreadSheet = SpreadsheetApp.openById(userSheetId);
  var userSheet = userSpreadSheet.getSheetByName("Users");
  var zoneSheet = userSpreadSheet.getSheetByName("Zones");
  var room = content.message.text;
  
  var block = room.slice(0);
  var floor = parseInt(room.slice(1));
  var number = parseInt(room.slice(-2));
  var zone = "";
  
  if (block = "A") {
    if (floor == 1) {
      zone = zoneSheet.getRange(number, 2);
    } else if (floor == 2) {
      zone = zoneSheet.getRange(number + 18, 2);
    } else if (floor == 3) {
      zone = zoneSheet.getRange(number + 38, 2);
    } else if (floor == 4) {
      zone = zoneSheet.getRange(number + 60, 2);
    } else {
      invalid(content);
    }
  } else if (block = "B") {
    if (floor == 1) {
      zone = zoneSheet.getRange(number + 83, 2);
    } else if (floor == 2) {
      zone = zoneSheet.getRange(number + 100, 2);
    } else if (floor == 3) {
      zone = zoneSheet.getRange(number + 119, 2);
    } else if (floor == 4) {
      zone = zoneSheet.getRange(number + 140, 2);
    } else {
      invalid(content);
    }
  } else if (block = "C") {
    if (floor == 1) {
      zone = zoneSheet.getRange(number + 162, 2);
    } else if (floor == 2) {
      zone = zoneSheet.getRange(number + 181, 2);
    } else if (floor == 3) {
      zone = zoneSheet.getRange(number + 202, 2);
    } else if (floor == 4) {
      zone = zoneSheet.getRange(number + 225, 2);
    } else {
      invalid(content);
    }
  } else if (block = "D") {
    if (floor == 1) {
      zone = zoneSheet.getRange(number + 249, 2);
    } else if (floor == 2) {
      zone = zoneSheet.getRange(number + 262, 2);
    } else if (floor == 3) {
      zone = zoneSheet.getRange(number + 277, 2);
    } else if (floor == 4) {
      zone = zoneSheet.getRange(number + 299, 2);
    } else {
      invalid(content);
    }
  } else if (block == "E") {
    if (floor == 1) {
      zone = zoneSheet.getRange(number + 322, 2);
    } else if (floor == 2) {
      zone = zoneSheet.getRange(number + 340, 2);
    } else if (floor == 3) {
      zone = zoneSheet.getRange(number + 360, 2);
    } else if (floor == 4) {
      zone = zoneSheet.getRange(number + 383, 2);
    } else {
      invalid(content);
    }
  } else {
    invalid(content);
  }
  
  userSheet.appendRow(content.message.chat.id, room, zone, content.message.from.first_name);
  
  var reply = {
    'chat_id': content.message.chat.id,
    'text': "Hello" + content.message.from.first_name + ". You are successfully added to Gymbot." + '\n\n'+ 
    "Please check your details." + '\n' +
    "Room: " + room + '\n' +
    "Zone: " + zone + '\n' +
    "To check your slots use /UPDATEHERE & to book a slot /UPDATEHERE"
  };
  var method = 'sendMessage';
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(reply)
  };
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
  
}


// FUNCTION invalid = informs the user that we are unaware of his input.
function invalid(content) {
  var reply = {
    'chat_id': content.message.chat.id,
    'text': "Oops! Looks like you entered an incorrect command."
  };
  var method = 'sendMessage';                                                                     
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(reply)
  };
  var response = UrlFetchApp.fetch(telegramUrl + '/' + method, options);
}

function testExist() {
  userExists(582348636);
  Logger.log("ranTestExist");
 }
//-----------------------------------------------------SIGNUP ANGELA---------------------------------------------------------------------
// have not tested out the code, but logic somewhat there. feel free to use my functions but leave a note if you change anything (if there is bug :O)



//-----------------------------------------CREATE WQ------------------------------------------------------
function eligibleSlots(userID) {
  var curruser = userExists(userID);
  if (Object.getOwnPropertyNames(curruser).length === 0){
    sendText(userID, "Hey there! We couldn't find you in our user database, join us using /signup");
  } else{
    var dkeyboard ={
      inline_keyboard: [
        [{
          text: "Mon 8am-3pm",
          callback_data: 'eligible-mon morn'
        }],
        [{
          text: "Thurs 8am-3pm",
          callback_data: 'eligible-thurs morn'
        }],
        [{
          text: "Sun 4pm-11pm",
          callback_data: 'eligible-sun night'
        }]
      ]
    };

    var ckeyboard ={
      inline_keyboard: [
        [{
          text: "Mon 4pm-11pm",
          callback_data: 'eligible-mon night'
        }],
        [{
          text: "Tues 8am-3pm",
          callback_data: 'eligible-tues morn'
        }],
        [{
          text: "Fri 8am-3pm",
          callback_data: 'eligible-fri morn'
        }],
        [{
          text: "Sat 4pm-11pm",
          callback_data: 'eligible-sat night'
        }]
      ]
    };

    var bkeyboard ={
      inline_keyboard: [
        [{
          text: "Wed 4pm-11pm",
          callback_data: 'eligible-wed night'
        }],
        [{
          text: "Fri 4pm-11pm",
          callback_data: 'eligible-fri night'
        }],
        [{
          text: "Sat 8am-3pm",
          callback_data: 'eligible-sat morn'
        }]
      ]
    };

    var akeyboard ={
      inline_keyboard: [
        [{
          text: "Tues 4pm-11pm",
          callback_data: 'eligible-tues night'
        }],
        [{
          text: "Wed 8am-3pm",
          callback_data: 'eligible-wed morn'
        }],
        [{
          text: "Thurs 4pm-11pm",
          callback_data: 'eligible-thurs night'
        }],
        [{
          text: "Sun 8am-3pm",
          callback_data: 'eligible-sun morn'
        }]
      ]
    };
    
    
    // mapping zone to available sessions
    if (curruser.zone=="A"){
	sendText(userID, "Which session?", akeyboard);
    } else if (curruser.zone=="B"){
	sendText(userID, "Which session?", bkeyboard);
    } else if (curruser.zone=="C"){
	sendText(userID, "Which session?", ckeyboard);
    } else{
	sendText(userID, "Which session?", dkeyboard);
    }
  };

}

function chooseTime(userid,data){
  var bookingsheet = SpreadsheetApp.openById(gymSheetId).getSheetByName("Current Week");
  var bookingrange = bookingsheet.getRange(1,1,73,8);
  var bookingdata = bookingrange.getValues();
  

    if (data.split(" ")[0] == 'eligible-mon'){
      var day = 1;
    } else if (data.split(" ")[0] == 'eligible-tues'){
      var day = 2;
    } else if (data.split(" ")[0] == 'eligible-wed'){
      var day = 3;
    } else if (data.split(" ")[0] == 'eligible-thurs'){
      var day = 4;
    } else if (data.split(" ")[0] == 'eligible-fri'){
      var day = 5;
    } else if (data.split(" ")[0] == 'eligible-sat'){
      var day = 6;
    } else if (data.split(" ")[0] == 'eligible-sun'){
      var day = 7;
    }
    
    var mornkeyboard ={
        inline_keyboard: [
          [{
              text: "8am-9am",
              callback_data: 'book-morn 1'
          }],
          [{
              text: "9am-10am",
              callback_data: 'book-morn 2'
          }],
          [{
              text: "10am-11am",
              callback_data: 'book-morn 3'
          }],
          [{
              text: "11am-12pm",
              callback_data: 'book-morn 4'
          }],
          [{
              text: "12pm - 1pm",
              callback_data: 'book-morn 5'
          }],
          [{
              text: "1pm - 2pm",
              callback_data: 'book-morn 6'
          }],
          [{
              text: "2pm - 3pm",
              callback_data: 'book_morn 7'
          }]
        ]
    };

    var nightkeyboard ={
        inline_keyboard: [
          [{
              text: "4pm-5pm",
              callback_data: 'book-night 1'
          }],
          [{
              text: "5pm-6pm",
              callback_data: 'book-night 2'
          }],
          [{
              text: "6pm-7pm",
              callback_data: 'book-night 3'
          }],
          [{
              text: "7pm-8pm",
              callback_data: 'book-night 4'
          }],
          [{
              text: "8pm-9pm",
              callback_data: 'book-night 5'
          }],
          [{
              text: "9pm-10pm",
              callback_data: 'book-night 6'
          }],
          [{
              text: "10pm-11pm",
              callback_data: 'book-night 7'
          }]
        ]
    };
    
    if (data.split(" ")[1] == "morn"){
      sendText(userid, "What time?", mornkeyboard)
    } else if(data.split (" ")[1] == "night"){
      sendText(userid, "What time?", nightkeyboard)
    }
    return day;
}

function book(data,day,room){
  var bookingsheet = SpreadsheetApp.openById(gymSheetId).getSheetByName("Current Week");
  var bookingrange = bookingsheet.getRange(1,1,73,8);
  var bookingdata = bookingrange.getValues();
  var count = 0;
  
  for (i=0;i<73;i++){
    for (j=0;j<8;j++){
      if (bookingdata[i][j] == room){
        count += 1;
      }
      if (count>=2){
        return "You have already booked 2 sessions for this week!"
      }
    }
  }
  
  if (data.split(" ")[0] == "book-morn"){
      var bookrow = Number(data.split(" ")[1])*5 -4;
      for (i = bookrow ; i <= bookrow+4 ; i++){
        if(bookingdata[i][day]==""){
          bookingsheet.getRange(i,day).setValue(room);
          return "Successfully booked " + bookingdata[0][day] + " " + bookingdata[bookrow][0];
        }else if (i == bookrow + 4){ // reach last cell and still hasnt inserted name
          return "That slot is full, try another one";//, mornkeyboard);
        }
      }
    } else if (data.split(" ")[0] == "book-night"){
          var bookrow = Number(data.split(" ")[1])*5 +33;
          for (i = bookrow ; i <= bookrow+4 ; i++){
            if(bookingdata[i][day]==""){
              bookingsheet.getRange(i,day).setValue(room);
              return "Successfully booked " + bookingdata[1][day] + " " + bookingdata[bookrow][1];
            } else if (i == bookrow + 4){ // reach last cell and still hasnt inserted name
              return "That slot is full, try another one";//, nightkeyboard);
            } 
          }
    }
}

function testBook(){
  Logger.log(book("book-morn 4",3,"D404"));
}

//----------------------------------------END CREATE WQ-----------------------------------------------    
      

//-----------------------------------------VIEW BANGYI------------------------------------------------------

function view(userID) {
  var curruser = userExists(userID);
  if (Object.getOwnPropertyNames(curruser).length === 0){
    sendText(userID, "Hey there! We couldn't find you in our user database, join us using /register");
  } else{
    var dkeyboard ={
      inline_keyboard: [
        [{
          text: "Mon 8am-3pm",
          callback_data: 'view-mon morn'
        }],
        [{
          text: "Thurs 8am-3pm",
          callback_data: 'view-thurs morn'
        }],
        [{
          text: "Sun 4pm-11pm",
          callback_data: 'view-sun night'
        }]
      ]
    };

    var ckeyboard ={
      inline_keyboard: [
        [{
          text: "Mon 4pm-11pm",
          callback_data: 'view-mon night'
        }],
        [{
          text: "Tues 8am-3pm",
          callback_data: 'view-tues morn'
        }],
        [{
          text: "Fri 8am-3pm",
          callback_data: 'view-fri morn'
        }],
        [{
          text: "Sat 4pm-11pm",
          callback_data: 'view-sat night'
        }]
      ]
    };

    var bkeyboard ={
      inline_keyboard: [
        [{
          text: "Wed 4pm-11pm",
          callback_data: 'view-wed night'
        }],
        [{
          text: "Fri 4pm-11pm",
          callback_data: 'view-fri night'
        }],
        [{
          text: "Sat 8am-3pm",
          callback_data: 'view-sat morn'
        }]
      ]
    };

    var akeyboard ={
      inline_keyboard: [
        [{
          text: "Tues 4pm-11pm",
          callback_data: 'view-tues night'
        }],
        [{
          text: "Wed 8am-3pm",
          callback_data: 'view-wed morn'
        }],
        [{
          text: "Thurs 4pm-11pm",
          callback_data: 'view-thurs night'
        }],
        [{
          text: "Sun 8am-3pm",
          callback_data: 'view-sun morn'
        }]
      ]
    };
    
    
    // mapping zone to available sessions
    if (curruser.zone=="A"){
	sendText(userID, "Which session?", akeyboard);
    } else if (curruser.zone=="B"){
	sendText(userID, "Which session?", bkeyboard);
    } else if (curruser.zone=="C"){
	sendText(userID, "Which session?", ckeyboard);
    } else{
	sendText(userID, "Which session?", dkeyboard);
    }
  };

}


//counts how many of the 5 cells are occupied
function count(x,y) {
  var sheet = SpreadsheetApp.openById(gymSheetId).getSheetByName("Current Week");
  var searchRange = sheet.getRange(x,y, 5);
  var rangeValues = searchRange.getValues();
  var count = 0;
  var time = sheet.getRange(x,1).getValue();
  
  for (i = 0; i < rangeValues.length; i++) {
    if ( rangeValues[i] != "") {
      count++;     
    }
  } 
  return time + ": " + count + "/5" + "\n";
}

//compiles counting of column from col x range y
function countCol(x,y) {
  var sheet = SpreadsheetApp.openById(gymSheetId).getSheetByName(" Week");
  var day = sheet.getRange(1,y).getValue();
    var result = "";   
    for (j = 0 ; j < 7; j++) {
      result += count((x + j*5), y);     
    };
    
    return day + "\n" + "---------------------" + "\n" + result;
 }

function viewTime(data) {
      
  if(data == "mon morn") {
    return countCol(2,2);  
  } else if ( data == "mon night") {
    return countCol(38,2);  
  } else if ( data == "tues morn") {
    return countCol(2,3);  
  } else if ( data == "tues night") {
    return countCol(38,3);  
  } else if ( data == "wed morn") {
    return countCol(2,4);  
  } else if ( data == "wed night") {
    return countCol(38,4);  
  } else if ( data == "thurs morn") {
    return countCol(2,5);
  } else if ( data == "thurs night") {
    return countCol(38,5);  
  } else if ( data == "fri morn") {
    return countCol(2,6);  
  } else if ( data == "fri night") {
    return countCol(38,6);  
  } else if ( data == "sat morn") {
    return countCol(2,7);  
  } else if ( data == "sat night") {
    return countCol(38,7);
  } else if ( data == "sun morn") {
    return countCol(2,8);  
  } else if ( data == "sun night") {
    return countCol(38,8);  
  }
  
 }


//-----------------------------------------VIEW BANGYI END------------------------------------------------------

function invalid(content) {
  var reply = {
    'chat_id': content.message.chat.id,
    'text': "Oops! Looks like you entered an incorrect command."
  };
  var method = 'sendMessage';                                                                     
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(reply)
  };
  var response = UrlFetchApp.fetch(telegramUrl + '/' + method, options);
}
  


function doPost(e) {
  //parse user data
  var contents = JSON.parse(e.postData.contents);
  Logger.log(contents);

  var id_message = contents.message.chat.id; 
  var text = contents.message.text; 
  var firstName = contents.message.from.first_name;
  var userID = contents.message.from.id;

  
  if (contents.callback_query) {
    var id_callback = contents.callback_query.message.chat.id;
    var name = contents.callback_query.from.first_name;
    var data = contents.callback_query.data;
    var command = data.split("-")[0];
    if (command == 'view') {
      Logger.log(data.split("-")[1]);
      Logger.log(viewTime(data.split("-")[1]));
      sendText(id_callback, viewTime(data.split("-")[1]));
    }
    
  } 
  //SIGNUP ANGELA 
  else if (text == "/view") {
    Logger.log("viewing");
    view(userID);
  } else if (text == "/register") { 
    register(contents);
  } else if (text=="/book"){
    eligibleSlots(userID);
    sendText(id_message,book("book-morn 3",4,"C206"));
  } else if (isRoomValid(contents)) {
    addUser(contents);
  }  else {
    invalid(contents);
  }
}
  //SIGNUP ANGELA 
  
  
  //  } if ( text == "/book@bblk_lounge_bot") {
  //    sendText(id_message,"ok, when would you like to book the lounge", keyBoard); 
  //  } else if ( text == "/view") {
  //    sendText(id_message, view());
  //  } else if ( text == "/view@bblk_lounge_bot") {
  //    sendText(id_message, view());
  //  } else {
  //    sendText(id_message, "i dont understand")
  //  }

function doGet(e) {
  deleteWebHook();
  const response = setWebHook();
  if (response.getResponseCode() !== 200) {
    return HtmlService.createHtmlOutput('<p>webhook not set :(</p>');
  }
  return HtmlService.createHtmlOutput('<p>webhook set!</p>');
}




