/**
 * Module Description
 *
 * NSVersion    Date                        Author
 * 1.00         2019-10-15 13:18:23         Ankith
 *
 * Description: Prefill Franchisee IM
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-04-29T09:07:50+10:00
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
  merge['NLAPTERRITORYMAPURL'] = 'https://1048144.app.netsuite.com/' +
    territoryMapURL;
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

  var mergeResult = nlapiCreateEmailMerger(343).merge();
  var emailBody = mergeResult.getBody();

  var records = new Array();
  records['record'] = zeeLeadID;
  records['recordtype'] = 'customrecord_zee_sales_leads';

  var arrAttachments = [];
  arrAttachments.push(nlapiLoadFile(parseInt(id)));
  nlapiSendEmail(690145, email, 'Information Memorandum Brochure', emailBody, [
    'michael.mcdaid@mailplus.com.au', 'ankith.ravindran@mailplus.com.au',
    'david.gdanski@mailplus.com.au', 'luke.forbes@mailplus.com.au'
  ], null, records, arrAttachments);



}

function getDate() {
  var date = new Date();
  if (date.getHours() > 6) {
    date = nlapiAddDays(date, 1);
  }
  date = nlapiDateToString(date);
  return date;
}
