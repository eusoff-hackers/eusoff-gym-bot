function weekRefresh() {
  

    var sheet = SpreadsheetApp.openById(gymSheetId);
    var originSheet = sheet.getSheetByName("Current Week");
    var tz = sheet.getSpreadsheetTimeZone();
  
    //Date manipulation
    var today = new Date();
    var lastweek = Utilities.formatDate(new Date(today.getTime() - 24 * 60 * 60 * 1000 * 6), tz, 'MM/dd');
    var monday ="Monday " + Utilities.formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000*1), tz, 'MM/dd');
    var tuesday = "Tuesday " + Utilities.formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000*2), tz, 'MM/dd');
    var wednesday = "Wednesday " + Utilities.formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000*3), tz, 'MM/dd');
    var thursday = "Thursday " + Utilities.formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000*4), tz, 'MM/dd');
    var friday = "Friday " + Utilities.formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000*5), tz, 'MM/dd');
    var saturday = "Saturday " + Utilities.formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000*6), tz, 'MM/dd');
    var sunday = "Sunday " + Utilities.formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000*7), tz, 'MM/dd');
    
    //Copying past weeks data to new sheet and naming it the Monday of that week
    destinationSheet = originSheet.copyTo(sheet);
    destinationSheet.setName(lastweek);
    
    //Reseting the Current Week
    originSheet.getRange('B2:H72').clearContent();
    originSheet.getRange('B1').setValue(monday);
    originSheet.getRange('C1').setValue(tuesday);
    originSheet.getRange('D1').setValue(wednesday);
    originSheet.getRange('E1').setValue(thursday);
    originSheet.getRange('F1').setValue(friday);
    originSheet.getRange('G1').setValue(saturday);
    originSheet.getRange('H1').setValue(sunday);
    
  }