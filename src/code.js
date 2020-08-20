function sendText(chatId, text, keyBoard) {
  var data = {
    method: 'post',
    payload: {
      method: 'sendMessage',
      chat_id: String(chatId),
      text: text,
      parse_mode: 'HTML',
      reply_markup: JSON.stringify(keyBoard),
    },
  };
  return UrlFetchApp.fetch(
    'https://api.telegram.org/bot' + telegramBotToken + '/',
    data
  );
}

//
// function flatten(arrayOfArrays) {
//  return [].concat.apply([], arrayOfArrays);
// }

// -----------------------------------------SIGNUP ANGELA------------------------------------------------------

/*
 FUNCTION userExists = checks if user exists in google sheets already/
 if user exists, returns chatID, room, zone, firstName and all booking timings
 else returns an empty {}
 */

function userExists(id){
  var sheet = SpreadsheetApp.openById(userSheetId).getSheetByName("Users");
  var rangeData = sheet.getDataRange();
  var lastColumn = rangeData.getLastColumn();
  var lastRow = rangeData.getLastRow();
  
  if (lastRow == 1) {
    return {};
  } 
  
  var searchRange = sheet.getRange(2,1, lastRow-1, lastColumn); 
  var rangeValues = searchRange.getValues();
  
  var person = {}  

    for ( j = 0 ; j < lastRow - 1; j++){
      if(rangeValues[j][0] == id){
        person["chatID"] = rangeValues[j][0];
        person["room"] = rangeValues[j][1];
        person["zone"] = rangeValues[j][2];
        person["firstName"] = rangeValues[j][3];
//        var bookings = [];
//        for (i = 4; i < lastColumn; i++) {
//          bookings.push(rangeValues[j][i])
//        }
//        person["bookings"] = bookings;
        person["bookings"] = rangeValues[j][4];
        break;
      }
    };
  return person;
}
/*
FUNCTION isRoomValid = checks if the user is already existing in our database and if room is a valid one
*/

function isRoomValid(data) {
  var room = data.message.text; 
  var id = data.message.chat.id;
  var user = userExists(id);
  
  if (Object.getOwnPropertyNames(user).length === 0) {
    var sheet = SpreadsheetApp.openById(userSheetId).getSheetByName('Zones');
    
    var searchRange = sheet.getRange(93,1, 497, 2); 
    var rangeValues = searchRange.getValues();
   
    for ( j = 0 ; j < 497; j++) {
      if(rangeValues[j][0] == room){
        return true;
        
      }
    }
  }
  return false; 
}

// FUNCTION register = checks if the user is already registered
// if registered, returns details of individual and prompts individual for next action
// if not register, prompts user to input room number

function register(id) {
  var user = userExists(id); 
  var text = "failed";
  
  if (Object.getOwnPropertyNames(user).length === 0) {
    var text = "Welcome to Eusoff Gym Bot. You do not exist in our system yet. Let's change that." + '\n\n' + "<b> What is your room number? </b>";
    sendText(id, text);
    text = "Please input in the format: <b> A101 </b>" + "\n" +
      "Ensure that you key in the correct room number in your first try." + "\n\n" + 
      "If not, there will be no way to reset the system unless you contact @EusoffHackers, which will take 3 workings days. "+ "\n" +
      "If you are caught with inputting the wrong room without notifying @EusoffHackers, you will be barred from booking the gym." + "\n\n" +
      "Let us all do our parts to fight COVID-19 together.";
  } else {
    var text = "Welcome back " + user['firstName'] + "!!" + '\n\n' +
      "Your room number is " + user['room'] + " and you are in Zone " + user['zone'] + '.\n\n' +
      "Would you like to make a booking? /UPDATEHERE" + '\n' +
      "Would you like to check your bookings? /UPDATEHERE" + '\n' +
      "Would you like to check the available timeslots? /UPDATEHERE";
   }
  sendText(id, text);
}

/*
 FUNCTION addUser = should only be triggered after isRoomValid check
 uses the user's room input to add user into the google sheet
 if his zone cannot be found, invalid input is triggered
 if successful, user's new details are returned and prompts user's next step
*/

function addUser(data) {
  Logger.log('addUser');
  var sheet = SpreadsheetApp.openById(userSheetId).getSheetByName("Users");
  var sheet_zone = SpreadsheetApp.openById(userSheetId).getSheetByName("Zones");

  var searchRange = sheet_zone.getRange(1,1, 87, 10); 
  var rangeValues = searchRange.getValues();  
  
  var room = data.message.text;  
  var id = data.message.chat.id;
  var name = data.message.chat.first_name;
  
  var block = room.slice(0,1);
  var floor = parseInt(room.slice(1,2));
  var number = parseInt(room.slice(-2)) - 1;
  var zone = "";

  if (block === "A") {
    if (floor === 1) {
      zone = rangeValues[number][1];
    } else if (floor === 2) {
      zone = rangeValues[number + 18][1];
    } else if (floor === 3) {
      zone = rangeValues[number + 38][1];
    } else if (floor === 4) {
      zone = rangeValues[number + 60][1];
    }
  } else if (block === "B") {
    if (floor === 1) {
      zone = rangeValues[number][3];
    } else if (floor === 2) {
      zone = rangeValues[number + 17][3];
    } else if (floor === 3) {
      zone = rangeValues[number + 36][3];
    } else if (floor === 4) {
      zone = rangeValues[number + 57][3];
    }
  } else if (block === "C") {
    if (floor === 1) {
      zone = rangeValues[number][5];
    } else if (floor === 2) {
      zone = rangeValues[number + 19][5];
    } else if (floor === 3) {
      zone = rangeValues[number + 40][5];
    } else if (floor === 4) {
      zone = rangeValues[number + 63][5];
    }
  } else if (block === "D") {
    if (floor === 1) {
      zone = rangeValues[number][7];
    } else if (floor === 2) {
      zone = rangeValues[number + 18][7];
    } else if (floor === 3) {
      zone = rangeValues[number + 38][7];
    } else if (floor === 4) {
      zone = rangeValues[number + 60][7];
    }
  } else if (block === "E") {
    if (floor === 1) {
      zone = rangeValues[number][9];
    } else if (floor === 2) {
      zone = rangeValues[number + 18][9];
    } else if (floor === 3) {
      zone = rangeValues[number + 38][9];
    } else if (floor === 4) {
      zone = rangeValues[number + 60][9];
    }
  }
  
  if (zone == "") {
    invalid(id);
  } else {
    sheet.appendRow([id, room, zone, name]);
    
    var text = "Hello " + name + "! You are successfully added to Gymbot." + '\n\n'+ 
      "Please check your details." + '\n' +
       "Room: " + room + '\n' +
       "Zone: " + zone + '\n' +
       "To check your slots use /UPDATEHERE & to book a slot /UPDATEHERE";
    
    sendText(id, text);
  }  
}


/*
FUNCTION invalid = informs the user that we are unaware of his input.
*/

function invalid(id) {
  var text = "Oops! Looks like you entered an incorrect command.";
  sendText(id, text);
}

function testExist() {
  userExists(582348636);
  // Logger.log('ranTestExist');
}
// ---------------------------------------SIGNUP ANGELA---------------------------------------------------------------------

// -----------------------------------------CREATE WQ------------------------------------------------------
function eligibleSlots(userID) {
  var curruser = userExists(userID);
  Logger.log(curruser.firstName.length);
  if (curruser.firstName.length === 0) {
    sendText(
      userID,
      "Hey there! We couldn't find you in our user database, join us using /register"
    );
  } else {
    var dkeyboard = {
      inline_keyboard: [
        [
          {
            text: 'Mon 8am-3pm',
            callback_data: 'eligible-Mon morn',
          },
        ],
        [
          {
            text: 'Thurs 8am-3pm',
            callback_data: 'eligible-Thurs morn',
          },
        ],
        [
          {
            text: 'Sun 4pm-11pm',
            callback_data: 'eligible-Sun night',
          },
        ],
      ],
    };

    var ckeyboard = {
      inline_keyboard: [
        [
          {
            text: 'Mon 4pm-11pm',
            callback_data: 'eligible-Mon night',
          },
        ],
        [
          {
            text: 'Tues 8am-3pm',
            callback_data: 'eligible-Tues morn',
          },
        ],
        [
          {
            text: 'Fri 8am-3pm',
            callback_data: 'eligible-Fri morn',
          },
        ],
        [
          {
            text: 'Sat 4pm-11pm',
            callback_data: 'eligible-Sat night',
          },
        ],
      ],
    };

    var bkeyboard = {
      inline_keyboard: [
        [
          {
            text: 'Wed 4pm-11pm',
            callback_data: 'eligible-Wed night',
          },
        ],
        [
          {
            text: 'Fri 4pm-11pm',
            callback_data: 'eligible-Fri night',
          },
        ],
        [
          {
            text: 'Sat 8am-3pm',
            callback_data: 'eligible-Sat morn',
          },
        ],
      ],
    };

    var akeyboard = {
      inline_keyboard: [
        [
          {
            text: 'Tues 4pm-11pm',
            callback_data: 'eligible-Tues night',
          },
        ],
        [
          {
            text: 'Wed 8am-3pm',
            callback_data: 'eligible-Wed morn',
          },
        ],
        [
          {
            text: 'Thurs 4pm-11pm',
            callback_data: 'eligible-Thurs night',
          },
        ],
        [
          {
            text: 'Sun 8am-3pm',
            callback_data: 'eligible-Sun morn',
          },
        ],
      ],
    };

    // mapping zone to available sessions
    if (curruser.zone === 'A') {
      sendText(userID, 'Which session?', akeyboard);
    } else if (curruser.zone === 'B') {
      sendText(userID, 'Which session?', bkeyboard);
    } else if (curruser.zone === 'C') {
      sendText(userID, 'Which session?', ckeyboard);
    } else {
      sendText(userID, 'Which session?', dkeyboard);
    }
  }
}

function chooseTime(userid, data) {
  var bookingsheet = SpreadsheetApp.openById(gymSheetId).getSheetByName(
    'Current Week'
  );
  var bookingrange = bookingsheet.getRange(1, 1, 73, 8);
  var bookingdata = bookingrange.getValues();
  let day;

  if (data.split(' ')[0] === 'eligible-Mon') {
    day = 1;
  } else if (data.split(' ')[0] === 'eligible-Tues') {
    day = 2;
  } else if (data.split(' ')[0] === 'eligible-Wed') {
    day = 3;
  } else if (data.split(' ')[0] === 'eligible-Thurs') {
    day = 4;
  } else if (data.split(' ')[0] === 'eligible-Fri') {
    day = 5;
  } else if (data.split(' ')[0] === 'eligible-Sat') {
    day = 6;
  } else if (data.split(' ')[0] === 'eligible-Sun') {
    day = 7;
  }

  var mornkeyboard = {
    inline_keyboard: [
      [
        {
          text: '8am-9am',
          callback_data: 'book-morn 1 ' + day,
        },
      ],
      [
        {
          text: '9am-10am',
          callback_data: 'book-morn 2 ' + day,
        },
      ],
      [
        {
          text: '10am-11am',
          callback_data: 'book-morn 3 ' + day,
        },
      ],
      [
        {
          text: '11am-12pm',
          callback_data: 'book-morn 4 ' + day,
        },
      ],
      [
        {
          text: '12pm - 1pm',
          callback_data: 'book-morn 5 ' + day,
        },
      ],
      [
        {
          text: '1pm - 2pm',
          callback_data: 'book-morn 6 ' + day,
        },
      ],
      [
        {
          text: '2pm - 3pm',
          callback_data: 'book-morn 7 ' + day,
        },
      ],
    ],
  };

  var nightkeyboard = {
    inline_keyboard: [
      [
        {
          text: '4pm-5pm',
          callback_data: 'book-night 1 ' + day,
        },
      ],
      [
        {
          text: '5pm-6pm',
          callback_data: 'book-night 2 ' + day,
        },
      ],
      [
        {
          text: '6pm-7pm',
          callback_data: 'book-night 3 ' + day,
        },
      ],
      [
        {
          text: '7pm-8pm',
          callback_data: 'book-night 4 ' + day,
        },
      ],
      [
        {
          text: '8pm-9pm',
          callback_data: 'book-night 5 ' + day,
        },
      ],
      [
        {
          text: '9pm-10pm',
          callback_data: 'book-night 6 ' + day,
        },
      ],
      [
        {
          text: '10pm-11pm',
          callback_data: 'book-night 7 ' + day,
        },
      ],
    ],
  };

  if (data.split(' ')[1] === 'morn') {
    sendText(
      userid,
      data.split(' ')[0].split('-')[1] + ' what time?',
      mornkeyboard
    );
  } else if (data.split(' ')[1] === 'night') {
    sendText(
      userid,
      data.split(' ')[0].split('-')[1] + ' what time?',
      nightkeyboard
    );
  }
}

function book(userID, data, room) {
  var bookingsheet = SpreadsheetApp.openById(gymSheetId).getSheetByName(
    'Current Week'
  );
  var bookingrange = bookingsheet.getRange(1, 1, 73, 8);
  var bookingdata = bookingrange.getValues();
  var count = 0;
  var day = Number(data.split(' ')[2]);
  // session to search through whether they have booked 2 slots alr
  var start = 1;
  var end = 36;

  if (data.split(' ')[0] === 'book-night') {
    start = 37;
    end = 72;
  }

  for (i = start; i < end; i++) {
    if (bookingdata[i][day] === room) {
      count += 1;
    }
    if (count >= 2) {
      sendText(
        userID,
        'You have already booked 2 sessions for ' + bookingdata[0][day]
      );
      return;
    }
  }

  if (data.split(' ')[0] === 'book-morn') {
    const bookrow = Number(data.split(' ')[1]) * 5 - 4;
    for (i = bookrow; i <= bookrow + 4; i++) {
      if (bookingdata[i][day] === room) {
        sendText(
          userID,
          'You have booked this slot previously: ' +
          bookingdata[0][day] +
          ' ' +
          bookingdata[bookrow][0]
        );
        return;
      } else if (bookingdata[i][day] === '') {
        bookingsheet.getRange(i + 1, day + 1).setValue(room); // indexing for actual data starts from 1
        sendText(
          userID,
          'Successfully booked ' +
          bookingdata[0][day] +
          ' ' +
          bookingdata[bookrow][0]
        );
        return;
      } else if (i === bookrow + 4) {
        // reach last cell and still hasnt inserted name
        sendText(
          userID,
          bookingdata[0][day] +
          ' ' +
          bookingdata[bookrow][0] +
          ' slot is full, try another one'
        );
        return;
      }
    }
  } else if (data.split(' ')[0] === 'book-night') {
    const bookrow = Number(data.split(' ')[1]) * 5 + 33;
    for (i = bookrow; i <= bookrow + 4; i++) {
      if (bookingdata[i][day] === room) {
        sendText(
          userID,
          'You have booked this slot previously: ' +
          bookingdata[0][day] +
          ' ' +
          bookingdata[bookrow][0]
        );
        return;
      } else if (bookingdata[i][day] === '') {
        bookingsheet.getRange(i + 1, day + 1).setValue(room); // indexing for actual data starts from 1
        sendText(
          userID,
          'Successfully booked ' +
          bookingdata[1][day] +
          ' ' +
          bookingdata[bookrow][1]
        );
        return;
      } else if (i === bookrow + 4) {
        // reach last cell and still hasnt inserted name
        sendText(
          userID,
          bookingdata[0][day] +
          ' ' +
          bookingdata[bookrow][0] +
          ' slot is full, try another one'
        );
        return;
      }
    }
  }
}

function testBook() {
  // Logger.log(book('book-morn 4', 3, 'D404'));
}

// ----------------------------------------END CREATE WQ-----------------------------------------------

// -----------------------------------------VIEW BANGYI------------------------------------------------------

function view(userID) {
  // Logger.log(userID);
  var curruser = userExists(userID);
  // Logger.log(curruser.firstName.length);
  if (curruser.firstName.length === 0) {
    sendText(
      userID,
      "Hey there! We couldn't find you in our user database, join us using /register"
    );
  } else {
    var dkeyboard = {
      inline_keyboard: [
        [
          {
            text: 'Mon 8am-3pm',
            callback_data: 'view-mon morn',
          },
        ],
        [
          {
            text: 'Thurs 8am-3pm',
            callback_data: 'view-thurs morn',
          },
        ],
        [
          {
            text: 'Sun 4pm-11pm',
            callback_data: 'view-sun night',
          },
        ],
      ],
    };

    var ckeyboard = {
      inline_keyboard: [
        [
          {
            text: 'Mon 4pm-11pm',
            callback_data: 'view-mon night',
          },
        ],
        [
          {
            text: 'Tues 8am-3pm',
            callback_data: 'view-tues morn',
          },
        ],
        [
          {
            text: 'Fri 8am-3pm',
            callback_data: 'view-fri morn',
          },
        ],
        [
          {
            text: 'Sat 4pm-11pm',
            callback_data: 'view-sat night',
          },
        ],
      ],
    };

    var bkeyboard = {
      inline_keyboard: [
        [
          {
            text: 'Wed 4pm-11pm',
            callback_data: 'view-wed night',
          },
        ],
        [
          {
            text: 'Fri 4pm-11pm',
            callback_data: 'view-fri night',
          },
        ],
        [
          {
            text: 'Sat 8am-3pm',
            callback_data: 'view-sat morn',
          },
        ],
      ],
    };

    var akeyboard = {
      inline_keyboard: [
        [
          {
            text: 'Tues 4pm-11pm',
            callback_data: 'view-tues night',
          },
        ],
        [
          {
            text: 'Wed 8am-3pm',
            callback_data: 'view-wed morn',
          },
        ],
        [
          {
            text: 'Thurs 4pm-11pm',
            callback_data: 'view-thurs night',
          },
        ],
        [
          {
            text: 'Sun 8am-3pm',
            callback_data: 'view-sun morn',
          },
        ],
      ],
    };

    // mapping zone to available sessions
    if (curruser.zone === 'A') {
      sendText(userID, 'Which session?', akeyboard);
    } else if (curruser.zone === 'B') {
      sendText(userID, 'Which session?', bkeyboard);
    } else if (curruser.zone === 'C') {
      sendText(userID, 'Which session?', ckeyboard);
    } else {
      sendText(userID, 'Which session?', dkeyboard);
    }
  }
}

// counts how many of the 5 cells are occupied
function count(x, y) {
  var sheet = SpreadsheetApp.openById(gymSheetId).getSheetByName(
    'Current Week'
  );
  var searchRange = sheet.getRange(x, y, 5);
  var rangeValues = searchRange.getValues();
  var count = 0;
  var time = sheet.getRange(x, 1).getValue();

  for (i = 0; i < rangeValues.length; i++) {
    if (rangeValues[i].toString().length !== 0) {
      count++;
    }
  }
  return time + ': ' + count + '/5' + '\n';
}

// compiles counting of column from col x range y
function countCol(x, y) {
  var sheet = SpreadsheetApp.openById(gymSheetId).getSheetByName(
    'Current Week'
  );
  var day = sheet.getRange(1, y).getValue();
  var result = '';
  for (j = 0; j < 7; j++) {
    result += count(x + j * 5, y);
  }

  return day + '\n' + '---------------------' + '\n' + result;
}

function viewTime(data) {
  if (data === 'mon morn') {
    return countCol(2, 2);
  } else if (data === 'mon night') {
    return countCol(38, 2);
  } else if (data === 'tues morn') {
    return countCol(2, 3);
  } else if (data === 'tues night') {
    return countCol(38, 3);
  } else if (data === 'wed morn') {
    return countCol(2, 4);
  } else if (data === 'wed night') {
    return countCol(38, 4);
  } else if (data === 'thurs morn') {
    return countCol(2, 5);
  } else if (data === 'thurs night') {
    return countCol(38, 5);
  } else if (data === 'fri morn') {
    return countCol(2, 6);
  } else if (data === 'fri night') {
    return countCol(38, 6);
  } else if (data === 'sat morn') {
    return countCol(2, 7);
  } else if (data === 'sat night') {
    return countCol(38, 7);
  } else if (data === 'sun morn') {
    return countCol(2, 8);
  } else if (data === 'sun night') {
    return countCol(38, 8);
  }
}

// -----------------------------------------VIEW BANGYI END------------------------------------------------------

function doPost(e) {
  // parse user data
  Logger.log(e.postData.contents);
  var contents = JSON.parse(e.postData.contents);

  if (contents.callback_query) {
    // Logger.log('found callback');
    var idCallback = contents.callback_query.message.chat.id;
    var name = contents.callback_query.from.first_name;
    var data = contents.callback_query.data;
    // Logger.log(data);
    var command = data.split('-')[0];
    if (command === 'view') {
      // Logger.log(data.split('-')[1]);
      // Logger.log(viewTime(data.split('-')[1]));
      sendText(idCallback, viewTime(data.split('-')[1]));
    } else if (command === 'eligible') {
      chooseTime(idCallback, data);
    } else if (command === 'book') {
      Logger.log('room:' + userExists(idCallback).room);
      book(idCallback, data, userExists(idCallback).room);
    }
  } else if (contents.message) {
    var data = JSON.parse(e.postData.contents);
    var text = data.message.text;
    var id = data.message.chat.id;
    
    if (text == "/register") {
      register(id);
    } else if (isValid(data)) {
      addUser(data);
    } else {
      invalid(id);
    }
  }
}


function doGet(e) {
  deleteWebHook();
  const response = setWebHook();
  if (response.getResponseCode() !== 200) {
    return HtmlService.createHtmlOutput('<p>webhook not set :(</p>');
  }
  return HtmlService.createHtmlOutput('<p>webhook set!</p>');
}
