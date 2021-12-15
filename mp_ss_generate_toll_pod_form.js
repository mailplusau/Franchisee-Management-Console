/**
 * Module Description
 *
 * NSVersion    Date                        Author
 * 1.00         2021-11-15 13:18:23         Ankith
 *
 * Description: Create TOLL Proof of Delivery Form
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-12-06T08:47:33+11:00
 *
 */

var tollPODPDF = 324;

var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();
var usageThreshold = 50;

function main() {

  //SEARCH: TOLL Proof of Delivery - Data Entered
  var tollPODUploads = nlapiLoadSearch('customrecord_toll_pod',
    'customsearch4432');

  var resultTOLLPODUploads = tollPODUploads.runSearch();

  resultTOLLPODUploads.forEachResult(function(searchResult) {

    var internalID = searchResult.getValue("internalid")
    var name = searchResult.getValue("name")
    var operator = searchResult.getText(
      "custrecord_toll_pod_upload_operator")
    var jsonImageToText = searchResult.getValue(
      "custrecord_image_text_json")
    var podLocations = searchResult.getText(
      "custrecord_toll_pod_locations")
    var uploadDate = searchResult.getValue("custrecord_upload_date")
    var uploadTime = searchResult.getValue("custrecord_upload_time")
    var receiverName = searchResult.getValue("custrecord_receiver_fullname")
    var addressfull = searchResult.getValue("custrecord_receiver_address1")
    var suburb = searchResult.getValue("custrecord_receiver_city")
    var postcode = searchResult.getValue("custrecordreceiver_zip")
    var connote = searchResult.getValue("custrecord_connote_no")

    podLocations = podLocations.toString()

    nlapiLogExecution('DEBUG', 'podLocations', podLocations)

    var dateSplit = uploadDate.split('/')
    var timeSplit = uploadTime.split(':')
    var ampm = timeSplit[1].split(' ');

    var dd = dateSplit[0]
    var mm = dateSplit[1]
    var yyyy = dateSplit[2]

    var hours;

    if (ampm[1] == 'PM') {
      hours = parseInt(timeSplit[0]) + 12
    } else {
      hours = timeSplit[0]
    }
    var minutes = ampm[0]

    nlapiLogExecution('DEBUG', 'hours', hours)
    nlapiLogExecution('DEBUG', 'minutes', minutes)
    nlapiLogExecution('DEBUG', 'dd', dd)
    nlapiLogExecution('DEBUG', 'receiverName', receiverName)
    nlapiLogExecution('DEBUG', 'address', addressfull)
    nlapiLogExecution('DEBUG', 'suburb', suburb)
    nlapiLogExecution('DEBUG', 'postcode', postcode)
    nlapiLogExecution('DEBUG', 'connote', connote)

    var fileNameSplit = name.split('.');
    name = fileNameSplit[0]
    name = name.replace(" ", "_")

    var merge = new Array();
    merge['NLOPERATOR'] = operator;
    merge['NLDATEDD'] = dd;
    merge['NLDATEMM'] = mm;
    merge['NLDATEYYYY'] = yyyy;
    merge['NLHOUR'] = hours;
    merge['NLMINUTES'] = minutes;
    merge['NLRECEIVERNAME'] = receiverName;
    merge['NLADDRESSFULL'] = addressfull;
    merge['NLSUBURB'] = suburb;
    merge['NLPOSTCODE'] = postcode;
    merge['NLCONNOTE'] = connote;

    if (podLocations == 'Reception') {
      merge['Reception'] = 'Yes'
    } else if (podLocations == 'Mailroom') {
      merge['Mailroom'] = 'Yes'
    } else if (podLocations == 'Receiving Docks') {
      merge['receiving docks'] = 'Yes'
    } else if (podLocations == 'Counter') {
      merge['Counter'] = 'Yes'
    } else if (podLocations == 'Store') {
      merge['Store'] = 'Yes'
    } else if (podLocations == 'Front Door') {
      merge['frontdoor'] = 'Yes'
    } else if (podLocations == 'Lift') {
      merge['lift'] = 'Yes'
    } else if (podLocations == 'Security') {
      merge['security'] = 'Yes'
    } else if (podLocations == 'Theatres') {
      merge['theatres'] = 'Yes'
    }
    merge['NLOTHERPOD'] = podLocations



    var fileSCFORM = nlapiMergeRecord(tollPODPDF,
      'customrecord_toll_pod', internalID, null, null, merge);
    fileSCFORM.setName(name + '.pdf');
    fileSCFORM.setIsOnline(true);
    fileSCFORM.setFolder(3073074);

    var id = nlapiSubmitFile(fileSCFORM);

    nlapiLogExecution('DEBUG', 'id', id)
    nlapiLogExecution('DEBUG', 'internalID', internalID)

    var tollPODRecord = nlapiLoadRecord('customrecord_toll_pod', internalID)
    nlapiLogExecution('DEBUG', 'tollPODRecord', tollPODRecord)
    tollPODRecord.setFieldValue('custrecord_pod_form_created', id)
    tollPODRecord.setFieldValue('custrecord_created', 1)
    nlapiSubmitRecord(tollPODRecord)

    // reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy, null);
    // nlapiLogExecution('EMERGENCY', 'Reschedule Return', reschedule);
    // if (reschedule == false) {
    //   return false;
    // }
    return true;
  });
}

function getDate() {
  var date = new Date();
  if (date.getHours() > 6) {
    date = nlapiAddDays(date, 1);
  }
  date = nlapiDateToString(date);
  return date;
}
