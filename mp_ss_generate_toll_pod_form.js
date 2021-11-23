/**
 * Module Description
 *
 * NSVersion    Date                        Author
 * 1.00         2021-11-15 13:18:23         Ankith
 *
 * Description: Create TOLL Proof of Delivery Form
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-16T14:36:18+11:00
 *
 */

var prod_usage_report = [324];

var month = moment().utc().format('MMMM')

var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();
var usageThreshold = 50;

function main() {

  //SEARCH: TOLL Proof of Delivery Search
  var tollPODUploads = nlapiLoadSearch('customrecord_toll_pod',
    'customsearch4423');

  var resultTOLLPODUploads = tollPODUploads.runSearch();

  resultTOLLPODUploads.forEachResult(function(searchResult) {

    var internalID = searchResult.getValue("internalid")
    var name = searchResult.getValue("name")
    var operator = searchResult.getText(
      "custrecord_toll_pod_upload_operator")
    var jsonImageToText = searchResult.getValue(
      "custrecord_image_text_json")
    var podLocations = searchResult.getValue(
      "custrecord_toll_pod_locations")
    var uploadDate = searchResult.getValue("custrecord_upload_date")
    var uploadTime = searchResult.getValue("custrecord_upload_time")

    var dateSplit = uploadDate.split('/')
    var timeSplit = uploadTime.split(':')

    var merge = new Array();
    merge['NLOPERATOR'] = operator;
    merge['NLDATEDD'] = dateSplit[0];
    merge['NLDATEMM'] = dateSplit[1];
    merge['NLDATEYYYY'] = dateSplit[2];
    merge['NLHOURS'] = timeSplit[0];
    merge['NLMINUTES'] = timeSplit[1];

    var parsedJSON = JSON.parse(jsonImageToText);



    // var fileSCFORM = nlapiMergeRecord(prod_usage_report[x],
    //   'customer', old_customer_id, null, null, merge);
    // fileSCFORM.setName('TOLL_POD_Form' + getDate() +
    //   '_' + old_customer_id + '_' + (x + 1) + '.pdf');
    // fileSCFORM.setIsOnline(true);
    // fileSCFORM.setFolder(2177205);
    //
    // var id = nlapiSubmitFile(fileSCFORM);
    //
    // reschedule = rescheduleScript(prev_inv_deploy, adhoc_inv_deploy, null);
    // nlapiLogExecution('EMERGENCY', 'Reschedule Return', reschedule);
    // if (reschedule == false) {
    //   return false;
    // }
    // return true;
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
