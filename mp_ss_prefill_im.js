/**
 * Module Description
 *
 * NSVersion    Date                        Author
 * 1.00         2019-10-15 13:18:23         Ankith
 *
 * Description: Create MPEX Usage Report
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-03-15T16:07:50+11:00
 *
 */

var franchisee_im_template = [340];

var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();
var usageThreshold = 50;

function main() {

  var zeeLeadID = ctx.getSetting('SCRIPT', 'custscript_zeeleadid');
  var interestedZee = ctx.getSetting('SCRIPT', 'custscript_interestedzees');

  var zeeRecord = nlapiLoadRecord('partner', interestedZee);
  var zeeName = zeeRecord.getFieldValue('companyname');
  var serviceRevenue = zeeRecord.getFieldValue('custentity_service_revenue');
  var serviceRevenueYear = zeeRecord.getFieldValue(
    'custentity_service_revenue_year');
  var mpexRevenue = zeeRecord.getFieldValue('custentity_mpex_revenue');
  var mpexRevenueYear = zeeRecord.getFieldValue('custentitympex_revenue_year');
  var sendleRevenue = zeeRecord.getFieldValue('custentity_sendle_revenue');
  var sendleRevenueYear = zeeRecord.getFieldValue(
    'custentity_sendle_revenue_year');
  var finalPurchasePrice = zeeRecord.getFieldValue(
    'custentity_final_sale_price');
  var territoryMapURL = zeeRecord.getFieldValue('custentity_territory_map');
  var dailyRunTime = zeeRecord.getFieldValue('custentity_total_daily_runtime');
  var dailyRunTime = zeeRecord.getFieldValue('custentity_total_daily_runtime');
  var businessStartDate = zeeRecord.getFieldValue(
    'custentity_business_start_date');

  var zeeSalesLeadRecord = nlapiLoadRecord('customrecord_zee_sales_leads',
    zeeLeadID);

  var firstName = zeeSalesLeadRecord.getFieldValue('custrecord_zee_leads_fname');
  var lastName = zeeSalesLeadRecord.getFieldValue('custrecord_zee_leads_lname');
  var mobile = zeeSalesLeadRecord.getFieldValue('custrecord_zee_lead_mobile');
  var email = zeeSalesLeadRecord.getFieldValue('custrecord_zee_lead_email');


  var merge = new Array();
  // merge['NLAPDATE'] = getDate();
  merge['NLAPTERRITORYNAME'] = zeeName;
  merge['NLAPDATESTARTED'] = businessStartDate;
  merge['NLAPSERVICEREVENUE'] = '$' + (parseFloat(serviceRevenue).toFixed(2).replace(
    /\d(?=(\d{3})+\.)/g, "$&,")).toString() + ' (exc GST) ';
  merge['NLAPSERVICEREVENUEDATE'] = serviceRevenueYear;
  merge['NLAPMPEXREVENUE'] = '$' + (parseFloat(mpexRevenue).toFixed(2).replace(
    /\d(?=(\d{3})+\.)/g, "$&,")).toString() + ' (exc GST) ';
  merge['NLAPMPEXREVENUEDATE'] = mpexRevenueYear;
  merge['NLAPSENDLEREVENUE'] = '$' + (parseFloat(sendleRevenue).toFixed(2).replace(
    /\d(?=(\d{3})+\.)/g, "$&,")).toString() + ' (exc GST) ';
  merge['NLAPSENDLEREVENUEDATE'] = sendleRevenueYear;
  merge['NLAPHOURS'] = dailyRunTime + ' hours per day';
  merge['NLAPTERM'] = "Unlimited";
  merge['NLAPTERRITORYMAPURL'] = territoryMapURL;
  merge['NLAPSALEPRICE'] = '$' + (parseFloat(finalPurchasePrice).toFixed(2).replace(
    /\d(?=(\d{3})+\.)/g, "$&,")).toString() + ' plus GST';

  nlapiLogExecution('DEBUG', 'merge', merge)


  var fileSCFORM = nlapiMergeRecord(franchisee_im_template,
    'partner', interestedZee, null, null, merge);
  fileSCFORM.setName('IM - ' + zeeName + ' - ' + getDate() +
    '.pdf');
  fileSCFORM.setIsOnline(true);
  fileSCFORM.setFolder(3194160);

  var id = nlapiSubmitFile(fileSCFORM);

  zeeSalesLeadRecord.setFieldValue('custrecord_im_sent', 1);
  zeeSalesLeadRecord.setFieldValue('custrecord_date_im_sent', getDate());
  zeeSalesLeadRecord.setFieldValue('custrecord_im_document', id);
  zeeSalesLeadRecord.setFieldValue('custrecord_zee_lead_stage', 13);

  nlapiSubmitRecord(zeeSalesLeadRecord);

  // var records = new Array();
  //
  //
  // nlapiSendEmail(409635, email, subject, body, [
  //   'michael.mcdaid@mailplus.com.au', 'ankith.ravindran@mailplus.com.au'
  // ], null, records);

}

function getDate() {
  var date = new Date();
  if (date.getHours() > 6) {
    date = nlapiAddDays(date, 1);
  }
  date = nlapiDateToString(date);
  return date;
}
