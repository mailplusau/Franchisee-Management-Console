/**
 * Module Description
 *
 * NSVersion    Date                        Author
 * 1.00         2019-10-15 13:18:23         Ankith
 *
 * Description: CPrefill Deed of Variation - Exit Program
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-03-24T09:46:12+11:00
 *
 */

var deed_of_variation = [339];

var month = moment().utc().format('MMMM')

var adhoc_inv_deploy = 'customdeploy2';
var prev_inv_deploy = null;
var ctx = nlapiGetContext();
var usageThreshold = 50;

function main() {

  var zeeId = ctx.getSetting('SCRIPT', 'custscript_zee_zeeid');
  var tradingEntity = ctx.getSetting('SCRIPT', 'custscript_zee_trading_entity');
  var mainContact = ctx.getSetting('SCRIPT', 'custscript_zee_main_contact');
  var email = ctx.getSetting('SCRIPT', 'custscript_zee_email');
  var address = ctx.getSetting('SCRIPT', 'custscript_zee_address');

  nlapiLogExecution('DEBUG', 'tradingEntity', tradingEntity);
  nlapiLogExecution('DEBUG', 'mainContact', mainContact);
  nlapiLogExecution('DEBUG', 'email', email);
  nlapiLogExecution('DEBUG', 'address', address);

  var billaddressfull = '';



  var zeeRecord = nlapiLoadRecord('partner', zeeId);
  var zeeName = zeeRecord.getFieldValue('companyname');

  for (p = 1; p <= zeeRecord.getLineItemCount('addressbook'); p++) {
    if (zeeRecord.getLineItemValue('addressbook',
        'defaultshipping', p) == "T") {
      if (!isNullorEmpty(zeeRecord.getLineItemValue(
          'addressbook', 'addr1', p))) {
        billaddressfull += zeeRecord.getLineItemValue(
          'addressbook', 'addr1', p) + ',';
      }
      if (!isNullorEmpty(zeeRecord.getLineItemValue(
          'addressbook', 'addr2', p))) {
        billaddressfull += zeeRecord.getLineItemValue(
          'addressbook', 'addr2', p) + ', ';
      }
      if (!isNullorEmpty(zeeRecord.getLineItemValue(
          'addressbook', 'city', p))) {
        billaddressfull += zeeRecord.getLineItemValue(
          'addressbook', 'city', p) + ' ';
      }
      if (!isNullorEmpty(zeeRecord.getLineItemValue(
          'addressbook', 'state', p))) {
        billaddressfull += zeeRecord.getLineItemValue(
          'addressbook', 'state', p) + ' ';
      }
      if (!isNullorEmpty(zeeRecord.getLineItemValue(
          'addressbook', 'zip', p))) {
        billaddressfull += zeeRecord.getLineItemValue(
          'addressbook', 'zip', p);
      }
    }
  }

  var merge = new Array();
  merge['NLAPDATE'] = getDate();
  merge['NLAPADDRESS'] = billaddressfull;
  merge['NLAPTRADINGENTITY'] = tradingEntity;
  merge['NLAPMAINCONTACT'] = mainContact;

  var fileSCFORM = nlapiMergeRecord(deed_of_variation,
    'partner', zeeId, null, null, merge);
  fileSCFORM.setName('Deed of Variation - ' + zeeName + ' - ' + getDate() +
    '.pdf');
  fileSCFORM.setIsOnline(true);
  fileSCFORM.setFolder(3171368);

  var id = nlapiSubmitFile(fileSCFORM);

  zeeRecord.setFieldValue('custentity_deed_of_variation_sent', 1);
  zeeRecord.setFieldValue('custentity_date_deed_of_variation_sent', getDate());
  zeeRecord.setFieldValue('custentity_deed_of_variation', id);

  nlapiSubmitRecord(zeeRecord);

  var records = new Array();
  records['partner'] = zeeId;

  var subject = 'Deed of Variation – Exit Program';
  var body =
    'Dear Franchisee, \n\nAs discussed, to support you in selling your MailPlus Franchise Business, can I kindly ask you to execute & return the attached deed of variation exit program assistance offer, whilst remembering to select your preferred option.\n\nOn receipt of your executed deed, our Franchise Development manager will be in touch to formally commence the exit program.\n\nThanks\nMichael McDaid';

  var arrAttachments = [];
  arrAttachments.push(nlapiLoadFile(parseInt(id)));

  nlapiSendEmail(25537, email, subject, body, [
    'michael.mcdaid@mailplus.com.au', 'ankith.ravindran@mailplus.com.au'
  ], null, records, arrAttachments)


}

function getDate() {
  var date = new Date();
  if (date.getHours() > 6) {
    date = nlapiAddDays(date, 1);
  }
  date = nlapiDateToString(date);
  return date;
}
