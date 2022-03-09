/**
 * Module Description
 *
 * NSVersion    Date                        Author
 * 1.00         2019-10-15 13:18:23         Ankith
 *
 * Description: Create MPEX Usage Report
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-03-09T14:37:39+11:00
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
  fileSCFORM.setName('Deed of Variation - ' + zeeName + ' - ' + getDate() + '.pdf');
  fileSCFORM.setIsOnline(true);
  fileSCFORM.setFolder(3162670);

  var id = nlapiSubmitFile(fileSCFORM);

  zeeRecord.setFieldValue('custentity_deed_of_variation_sent',1);
  zeeRecord.setFieldValue('custentity_date_deed_of_variation_sent',getDate());
  zeeRecord.setFieldValue('custentity_deed_of_variation',id);

  nlapiSubmitRecord(zeeRecord);

}

function getDate() {
  var date = new Date();
  if (date.getHours() > 6) {
    date = nlapiAddDays(date, 1);
  }
  date = nlapiDateToString(date);
  return date;
}
