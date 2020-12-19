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

  var times = ['8am-9am', '9am-10am', '10am-11am', '11am-12pm', '12pm-1pm', '1pm-2pm', '2pm-3pm',
  '4pm-5pm', '5pm-6pm', '6pm-7pm', '7pm-8pm', '8pm-9pm', '9pm-10pm', '10pm-11pm', 
  '11pm-12am', '12am-1am', '1am-2am', '2am-3am'];
  
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
  
  function userExists(id) {
    var sheet = SpreadsheetApp.openById(userSheetId).getSheetByName('Users');
    var rangeData = sheet.getDataRange();
    var lastColumn = rangeData.getLastColumn();
    var lastRow = rangeData.getLastRow();
  
    if (lastRow === 1) {
      return {};
    }
  
    var searchRange = sheet.getRange(2, 1, lastRow - 1, lastColumn);
    var rangeValues = searchRange.getValues();
  
    var person = {};
  
    for (j = 0; j < lastRow - 1; j++) {
      if (rangeValues[j][0] === id) {
        person.chatID = rangeValues[j][0];
        person.room = rangeValues[j][1];
        person.zone = rangeValues[j][2];
        person.firstName = rangeValues[j][3];
        //        var bookings = [];
        //        for (i = 4; i < lastColumn; i++) {
        //          bookings.push(rangeValues[j][i])
        //        }
        //        person["bookings"] = bookings;
        person.bookings = rangeValues[j][4];
        break;
      }
    }
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
  
      var searchRange = sheet.getRange(93, 1, 497, 2);
      var rangeValues = searchRange.getValues();
  
      for (j = 0; j < 497; j++) {
        if (rangeValues[j][0] === room) {
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
    var text = 'failed';
  
    if (Object.getOwnPropertyNames(user).length === 0) {
      text =
        "Welcome to Eusoff Gym Bot. You do not exist in our system yet. Let's change that." +
        '\n\n' +
        '<b> What is your room number? </b>';
      sendText(id, text);
      text =
        'Please input in the format: <b> A101 </b>' +
        '\n' +
        'Ensure that you key in the correct room number in your first try.' +
        '\n\n' +
        'If not, there will be no way to reset the system unless you contact @qiiwenn, which will take 3 workings days. ' +
        '\n' +
        'If you are caught with inputting the wrong room without notifying @qiiwenn, you will be barred from booking the gym.' +
        '\n\n' +
        'Let us all do our parts to fight COVID-19 together.';
    } else {
      text =
        'Welcome back ' +
        user.firstName +
        '!!' +
        '\n\n' +
        'Your room number is ' +
        user.room +
        ' and you are in Zone ' +
        user.zone +
        '.\n\n' +
        'Would you like to make a booking? /book' +
        '\n' +
        'Would you like to delete your booking? /delete' +
        '\n' +
        'Would you like to check the available timeslots? /view';
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
    // Logger.log('addUser');
    var sheet = SpreadsheetApp.openById(userSheetId).getSheetByName('Users');
    var sheetZone = SpreadsheetApp.openById(userSheetId).getSheetByName('Zones');
  
    var searchRange = sheetZone.getRange(1, 1, 405, 2);
    var rangeValues = searchRange.getValues();
  
    var room = data.message.text;
    var id = data.message.chat.id;
    var name = data.message.chat.first_name;

    var zonedict = {};

    for (i = 0; i < 405; i++) {
        zonedict[rangeValues[i][0]] = rangeValues[i][1];
    }

    if (zonedict[room]) {
        sheet.appendRow([id, room, zonedict[room], name]);  
        var text =
            'Hello ' +
            name +
            '! You are successfully added to Gymbot.' +
            '\n\n' +
            'Please check your details.' +
            '\n' +
            'Room: ' +
            room +
            '\n' +
            'Zone: ' +
            zonedict[room] +
            '\n' +
            'To book a slot use /book, view available slots use /view & to delete a booking /delete';
    
        sendText(id, text);
    } else {
        invalid(id);
    }    
  }
  
  /*
  FUNCTION invalid = informs the user that we are unaware of his input.
  */
  
  function invalid(id) {
    var text = 'Oops! Looks like you entered an incorrect command.';
    sendText(id, text);
  }
  
  function testExist() {
    userExists(582348636);
    // Logger.log('ranTestExist');
  }
  // ---------------------------------------SIGNUP ANGELA---------------------------------------------------------------------
  
  // -----------------------------------------CREATE WQ------------------------------------------------------
  function dayKeyboard(data) {
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var keyboard = [];
    for (i = 0; i < 7; i++) {
        keyboard[i] = [
            {
                text: days[i],
                callback_data: data + ' ' + i,
            },
        ];
    }    
    return {inline_keyboard: keyboard};
  }
  

  
  function eligibleSlots(userID) {
    var curruser = userExists(userID);
    // Logger.log(curruser.firstName.length);
    if (curruser.firstName.length === 0) {
      sendText(userID, "Hey there! We couldn't find you in our user database, join us using /register");
    } else {
      sendText(userID, 'Which day?', dayKeyboard('eligible-'));
    }
  }

  function chooseTime(userID, data) {
    var bookingsheet = SpreadsheetApp.openById(gymSheetId).getSheetByName('Current Week');
    var bookingrange = bookingsheet.getRange(1, 1, 93, 8);
    var bookingdata = bookingrange.getValues();    

    var keyboard = [];
    for (i = 0; i < 18; i++) {
        keyboard[i] = [
            {
                text: times[i],
                callback_data: 'book-' + data + ' ' + i,
            },
        ];
    }

    sendText(userID, bookingdata[0][data.split(' ')[1] + 1] + ' what time?', {inline_keyboard: keyboard});
  }
  
  function book(userID, data, room) {
    var bookingsheet = SpreadsheetApp.openById(gymSheetId).getSheetByName('Current Week');
    var bookingrange = bookingsheet.getRange(1, 1, 93, 8);
    var bookingdata = bookingrange.getValues();
    var count = 0;
    sendText(1165718697, data);
    var day = Number(data.split(' ')[2]);
    var prevDay = day - 1;
  
    if (day === 1) {
      prevDay = 7;
    }
  
    // search through morn and night session
    for (i = 1; i < 77; i++) {
      if (bookingdata[i][day] === room) {
        count += 1;
        if (count >= 2) {
          sendText(userID, 'You have already booked 2 sessions for ' + bookingdata[0][day]);
          return;
        }
      }
    }
  
    // search through midnight session, in previous column
    for (i = 77; i < 92; i++) {
      if (bookingdata[i][prevDay] === room) {
        count += 1;
        if (count >= 2) {
            sendText(userID, 'You have already booked 2 sessions for ' + bookingdata[0][day]);
          return;
        }
      }
    }

    var day = Number(data.split(' ')[1]) + 1;
    var bookrow = Number(data.split(' ')[2]);
    sendText(1165718697, day + bookrow);

    for (i = bookrow*5 + 1; i <= bookrow*5 + 5; i++) {
        if (bookingdata[i][day] === room) {
          sendText(
            userID,
            'You have booked this slot previously: ' +
              bookingdata[0][day] +
              ' ' +
              bookingdata[bookrow*5 + 1][0]
          );
          return;
        } else if (bookingdata[i][day] === '') {
          bookingsheet.getRange(i + 1, day + 1).setValue(room); // indexing for actual data starts from 1
          sendText(
            userID,
            'Successfully booked ' +
              bookingdata[0][day] +
              ' ' +
              bookingdata[bookrow*5 + 1][0]
          );
          return;
        } else if (i === bookrow*5 + 5) {
          // reach last cell and still hasnt inserted name
          sendText(
            userID,
            bookingdata[0][day] +
              ' ' +
              bookingdata[bookrow*5 + 1][0] +
              ' slot is full, try another one'
          );
          return;
        }
      }
  }
  
  function testBook() {
    // Logger.log(book('book-morn 4', 3, 'D404'));
  }
  
  // ----------------------------------------END CREATE WQ-----------------------------------------------
  // ----------------------------------------DELETE FUNCTION-----------------------------------------------
  function viewOwn(userID) {
    var curruser = userExists(userID);
    var room = curruser.room;
    var bookingsheet = SpreadsheetApp.openById(gymSheetId).getSheetByName(
      'Current Week'
    );
    var bookingrange = bookingsheet.getRange(1, 1, 93, 8);
    var bookingdata = bookingrange.getValues();
    var count = 0;
    var keyboard = [];
  
    for (i = 0; i < 8; i++) {
      for (j = 0; j < 77; j++) {
        if (bookingdata[j][i] === room) {
          keyboard[count] = [
            {
              text: bookingdata[0][i] + ' ' + bookingdata[j][0],
              callback_data: 'delete-' + (i + 1) + '-' + (j + 1),
            },
          ];
          count++;
        }
      }
    }
  
    for (i = 0; i < 8; i++) {
      for (j = 77; j < 92; j++) {
        if (bookingdata[j][i] === room) {
          keyboard[count] = [
            {
              text: bookingdata[0][i + 1] + ' ' + bookingdata[j][0],
              callback_data: 'delete-' + (i + 1) + '-' + (j + 1),
            },
          ];
          count++;
        }
      }
    }
  
    var deleteKeyboard = {
      inline_keyboard: keyboard,
    };
    if (count === 0) {
      return false;
    } else {
      return deleteKeyboard;
    }
  }
  function deleteBooking(col, row, userID) {
    var bookingsheet = SpreadsheetApp.openById(gymSheetId).getSheetByName(
      'Current Week'
    );
    var curruser = userExists(userID);
    var room = curruser.room;
    // Logger.log(row, col);
    // Logger.log(bookingsheet.getRange(row,col).getValue());
    // if (row < 78) {
    if (room === bookingsheet.getRange(row, col).getValue()) {
      bookingsheet.getRange(row, col).clearContent();
      return 'Booking deleted!';
    } else {
      return 'You have no bookings for this day!';
    }
    // } else {
    //   if (room === bookingsheet.getRange(row, Number(col) - 1).getValue()) {
    //     bookingsheet.getRange(row, col).clearContent();
    //     return 'Booking deleted!';
    //   } else {
    //     return 'You have no bookings for this day!';
    //   }
    // }
  }
  
  // ----------------------------------------DELETE FUNCTION-----------------------------------------------
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
      sendText(userID, 'Which session?', zoneKeyboard('view', curruser.zone));
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
  function countCol(x, y, z) {
    var sheet = SpreadsheetApp.openById(gymSheetId).getSheetByName(
      'Current Week'
    );
    var day = sheet.getRange(1, y).getValue();
    var result = '';
    for (j = 0; j < z; j++) {
      result += count(x + j * 5, y);
    }
  
    return day + '\n' + '---------------------' + '\n' + result;
  }
  
  function viewTime(data) {
    if (data === 'mon morn') {
      return countCol(2, 2, 7);
    } else if (data === 'mon night') {
      return countCol(38, 2, 8);
    } else if (data === 'tues midnight') {
      return countCol(78, 2, 3);
    } else if (data === 'tues morn') {
      return countCol(2, 3, 7);
    } else if (data === 'tues night') {
      return countCol(38, 3, 8);
    } else if (data === 'wed midnight') {
      return countCol(78, 3, 3);
    } else if (data === 'wed morn') {
      return countCol(2, 4, 7);
    } else if (data === 'wed night') {
      return countCol(38, 4, 8);
    } else if (data === 'thurs midnight') {
      return countCol(78, 4, 3);
    } else if (data === 'thurs morn') {
      return countCol(2, 5, 7);
    } else if (data === 'thurs night') {
      return countCol(38, 5, 8);
    } else if (data === 'fri midnight') {
      return countCol(78, 5, 3);
    } else if (data === 'fri morn') {
      return countCol(2, 6, 7);
    } else if (data === 'fri night') {
      return countCol(38, 6, 8);
    } else if (data === 'sat midnight') {
      return countCol(78, 6, 3);
    } else if (data === 'sat morn') {
      return countCol(2, 7, 7);
    } else if (data === 'sat night') {
      return countCol(38, 7, 8);
    } else if (data === 'sun midnight') {
      return countCol(78, 7, 3);
    } else if (data === 'sun morn') {
      return countCol(2, 8, 7);
    } else if (data === 'sun night') {
      return countCol(38, 8, 8);
    } else if (data === 'mon midnight') {
      return countCol(78, 8, 3);
    }
  }
  
  // -----------------------------------------VIEW BANGYI END------------------------------------------------------
 
  function doPost(e) {
    // parse user data
    // Logger.log(e.postData.contents);
    var contents = JSON.parse(e.postData.contents);
    if (contents.callback_query) {
      // Logger.log('found callback');
      var idCallback = contents.callback_query.message.chat.id;
      var name = contents.callback_query.from.first_name;
      var userID = contents.callback_query.from.id;
      var data = contents.callback_query.data;
      var command = data.split('-')[0];
      // Logger.log(command);
      if (command === 'view') {
        // Logger.log(data.split('-')[1]);
        // Logger.log(viewTime(data.split('-')[1]));
        sendText(idCallback, viewTime(data.split('-')[1]));
      } else if (command === 'eligible') {
        chooseTime(idCallback, data);
      } else if (command === 'book') {
        // Logger.log('room:' + userExists(idCallback).room);
        book(idCallback, data, userExists(idCallback).room);
      } else if (command === 'delete') {
        sendText(
          idCallback,
          deleteBooking(data.split('-')[1], data.split('-')[2], userID)
        );
      }
    } else if (contents.message) {
      var idMessage = contents.message.chat.id;
      var text = contents.message.text;
      var firstName = contents.message.from.first_name;
      var userId = contents.message.from.id;
  
      if (text === '/view') {
        view(userId);
      } else if (text === '/register') {
        register(userId);
      } else if (text === '/book') {
        eligibleSlots(userId);
      } else if (text === '/delete') {
        if (viewOwn(userId) === false) {
          sendText(idMessage, 'You have no bookings to delete');
        } else {
          sendText(
            idMessage,
            'Which booking do you want to delete?',
            viewOwn(userId)
          );
        }
      } else if (text === '/start') {
        sendText(
          idMessage,
          "Welcome to Eusoff's Gym Bot! \n To sign up /register \n To view availabilities /view \n To delete or view your current bookings /delete\n To book the gym /book"
        );
      } else if (isRoomValid(contents)) {
        addUser(contents);
      } else {
        invalid(userId);
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
  
