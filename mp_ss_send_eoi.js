/**
 * Module Description
 *
 * NSVersion    Date                        Author
 * 1.00         2019-10-15 13:18:23         Ankith
 *
 * Description: Prefill Franchisee IM
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-04-21T11:05:11+10:00
 *
 */

var franchisee_im_template = [340];

var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();
var usageThreshold = 50;

function main() {

  var zeeLeadID = ctx.getSetting('SCRIPT', 'custscript_new_zee_lead_id');

  var zeeSalesLeadRecord = nlapiLoadRecord('customrecord_zee_sales_leads',
    zeeLeadID);

  var firstName = zeeSalesLeadRecord.getFieldValue('custrecord_zee_leads_fname');
  var lastName = zeeSalesLeadRecord.getFieldValue('custrecord_zee_leads_lname');
  var mobile = zeeSalesLeadRecord.getFieldValue('custrecord_zee_lead_mobile');
  var email = zeeSalesLeadRecord.getFieldValue('custrecord_zee_lead_email');



  var mergeResult = nlapiCreateEmailMerger(332).merge();
  var emailBody = mergeResult.getBody();

  var records = new Array();
  records['record'] = zeeLeadID;
  records['recordtype'] = 'customrecord_zee_sales_leads';

  var arrAttachments = [];
  arrAttachments.push(nlapiLoadFile(parseInt(5619482)));

  nlapiSendEmail(690145, email, 'MailPlus Expression of Interest Form', emailBody, [
    'michael.mcdaid@mailplus.com.au', 'ankith.ravindran@mailplus.com.au'
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
