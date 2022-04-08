/**
 * Module Description
 *
 * NSVersion    Date                        Author
 * 1.00         2019-10-15 13:18:23         Ankith
 *
 * Description: Prefill NDA
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-04-07T09:24:22+10:00
 *
 */

var nda_template = [341];

var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();
var usageThreshold = 50;

function main() {

  var zeeLeadID = ctx.getSetting('SCRIPT', 'custscript_mmc_zee_lead_id');
  var email_type = ctx.getSetting('SCRIPT', 'custscript_email_type');

  var zeeSalesLeadRecord = nlapiLoadRecord('customrecord_zee_sales_leads',
    zeeLeadID);

  var firstName = zeeSalesLeadRecord.getFieldValue('custrecord_zee_leads_fname');
  var lastName = zeeSalesLeadRecord.getFieldValue('custrecord_zee_leads_lname');
  var mobile = zeeSalesLeadRecord.getFieldValue('custrecord_zee_lead_mobile');
  var email = zeeSalesLeadRecord.getFieldValue('custrecord_zee_lead_email');
  var tradingEntityName = zeeSalesLeadRecord.getFieldValue(
    'custrecord_trading_entity_name');
  var acn = zeeSalesLeadRecord.getFieldValue('custrecord_acn');
  var abn = zeeSalesLeadRecord.getFieldValue('custrecord_abn');
  var ndaaddress1 = zeeSalesLeadRecord.getFieldValue('custrecord_address1');
  var ndaaddress2 = zeeSalesLeadRecord.getFieldValue('custrecord_address2');
  var ndasuburb = zeeSalesLeadRecord.getFieldValue('custrecord_suburb');
  var ndastate = zeeSalesLeadRecord.getFieldValue('custrecord_address_state');
  var ndapostcode = zeeSalesLeadRecord.getFieldValue('custrecord_postcode');
  var nda_id = zeeSalesLeadRecord.getFieldValue('custrecord_signed_nda_doc');
  var eoi_id = zeeSalesLeadRecord.getFieldValue('custrecord_eoi_doc_id');

  var records = new Array();
  records['record'] = zeeLeadID;
  records['recordtype'] = 'customrecord_zee_sales_leads';

  var arrAttachments = [];

  if(email_type == 'nda'){
    arrAttachments.push(nlapiLoadFile(parseInt(nda_id)));
    nlapiSendEmail(690145, ['michael.mcdaid@mailplus.com.au'], 'Uploaded Signed Non-Disclosure Agreement', 'Please view attached signed uploaded NDA', [
      'greg.hart@mailplus.com.au', 'ankith.ravindran@mailplus.com.au', 'luke.forbes@mailplus.com.au'
    ], null, records, arrAttachments);
  } else if(email_type == 'eoi'){
    arrAttachments.push(nlapiLoadFile(parseInt(eoi_id)));
    nlapiSendEmail(690145, ['michael.mcdaid@mailplus.com.au'], 'Uploaded Signed Expression of Interest', 'Please view attached signed uploaded EOI', [
      'greg.hart@mailplus.com.au', 'ankith.ravindran@mailplus.com.au', 'luke.forbes@mailplus.com.au'
    ], null, records, arrAttachments);
  }





}

function getDate() {
  var date = new Date();
  if (date.getHours() > 6) {
    date = nlapiAddDays(date, 1);
  }
  date = nlapiDateToString(date);
  return date;
}
