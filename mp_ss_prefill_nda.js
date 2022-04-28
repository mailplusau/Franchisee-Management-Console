/**
 * Module Description
 *
 * NSVersion    Date                        Author
 * 1.00         2019-10-15 13:18:23         Ankith
 *
 * Description: Prefill NDA
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-04-29T09:07:02+10:00
 *
 */

var nda_template = [341];

var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();
var usageThreshold = 50;

function main() {

  var zeeLeadID = ctx.getSetting('SCRIPT', 'custscript_zeeleadid_nda');

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

  if (isNullorEmpty(ndaaddress1)) {
    var combinedAddress = ndaaddress2 + ', ' + ndasuburb + ' ' + ndastate +
      ' - ' + ndapostcode
  } else {
    var combinedAddress = ndaaddress1 + ', ' + ndaaddress2 + ', ' + ndasuburb +
      ' ' + ndastate + ' - ' + ndapostcode
  }

  var merge = new Array();
  merge['NLAPDATE'] = getDate();
  merge['NLAPTRADINGENTITY'] = tradingEntityName;
  merge['NLAPACN'] = acn;
  merge['NLAPABN'] = abn
  merge['NLAPADDRESS'] = combinedAddress;
  merge['NLAPEMAIL'] = email;
  merge['NLAPCONTACT'] = mobile;

  nlapiLogExecution('DEBUG', 'merge', merge)


  var fileSCFORM = nlapiMergeRecord(nda_template,
    'customrecord_zee_sales_leads', zeeLeadID, null, null, merge);
  fileSCFORM.setName('NDA - ' + tradingEntityName + ' - ' + getDate() +
    '.pdf');
  fileSCFORM.setIsOnline(true);
  fileSCFORM.setFolder(3196883);

  var id = nlapiSubmitFile(fileSCFORM);

  zeeSalesLeadRecord.setFieldValue('custrecord_nda_sent', 1);
  zeeSalesLeadRecord.setFieldValue('custrecord_date_nda_sent', getDate());
  zeeSalesLeadRecord.setFieldValue('custrecord_signed_nda_doc', id);
  zeeSalesLeadRecord.setFieldValue('custrecord_zee_lead_stage', 7);

  nlapiSubmitRecord(zeeSalesLeadRecord);

  var mergeResult = nlapiCreateEmailMerger(342).merge();
  var emailBody = mergeResult.getBody();

  var records = new Array();
  records['record'] = zeeLeadID;
  records['recordtype'] = 'customrecord_zee_sales_leads';

  var arrAttachments = [];
  arrAttachments.push(nlapiLoadFile(parseInt(id)));

  nlapiSendEmail(690145, email, 'Non-Disclosure Agreement', emailBody, [
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
