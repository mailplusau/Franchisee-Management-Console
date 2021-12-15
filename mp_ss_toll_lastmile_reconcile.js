/**
 * Module Description
 *
 * NSVersion    Date                        Author
 * 1.00         2021-11-15 13:18:23         Ankith
 *
 * Description: Reconcile the TOLL Last Mile daily Scans with the Uploaded Data in NetSuite
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-12-06T12:08:38+11:00
 *
 */

var tollPODPDF = 324;

var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();
var usageThreshold = 50;

function main() {

  //SEARCH: TOLL Proof of Delivery - Uploaded Data
  var tollPODUploads = nlapiLoadSearch('customrecord_toll_pod',
    'customsearch_toll_lastmile_uploaded_data');

  var resultTOLLPODUploads = tollPODUploads.runSearch();

  resultTOLLPODUploads.forEachResult(function(searchResult) {

    var internalID = searchResult.getValue("internalid")
    var name = searchResult.getValue("name");
    var connote = searchResult.getValue("custrecord_connote_no");

    nlapiLogExecution('DEBUG','Connote',connote)

    //NetSuite Search: Global Express Last Mile - Daily Scans
    var dailyTOLLLastMileScanSyncSearch = nlapiLoadSearch(
      'customrecord_customer_product_stock',
      'customsearch_global_express_last_mile');

    var newFilters = new Array();
    newFilters[0] = new nlobjSearchFilter('name',
      null, 'is', connote);

    dailyTOLLLastMileScanSyncSearch.addFilters(newFilters);

    var resultSetTOLLLastMileDailyScanSync = dailyTOLLLastMileScanSyncSearch.runSearch();

    var dailyScanInternalID = null;

    resultSetTOLLLastMileDailyScanSync.forEachResult(function(searchResultTOLLLastMile) {

      dailyScanInternalID = searchResultTOLLLastMile.getValue("internalid")

      return true;
    });

    nlapiLogExecution('DEBUG','dailyScanInternalID',dailyScanInternalID)

    if(dailyScanInternalID != null){
      var tollPODRecord = nlapiLoadRecord('customrecord_toll_pod', internalID)
      tollPODRecord.setFieldValue('custrecord_scanned_barcode', dailyScanInternalID)
      tollPODRecord.setFieldValue('custrecord_reconcilled', 1)
      nlapiSubmitRecord(tollPODRecord)
    }

    return true;
  });
}
