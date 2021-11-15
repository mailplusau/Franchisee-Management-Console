/**
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-15T07:25:50+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-15T13:56:21+11:00
 */

var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
  baseURL = 'https://system.sandbox.netsuite.com';
}
var ctx = nlapiGetContext();
var role = ctx.getRole();
var zee = 0;
if (role == 1000) {
  //Franchisee
  zee = ctx.getUser();
}

var tollPODRecordID = null

function main(request, response) {
  if (request.getMethod() == "GET") {

    var form = nlapiCreateForm('TOLL Proof Of Delivery Upload');

    tollPODRecordID = parseInt(request.getParameter('tollPODRecordID'));

    //INITIALIZATION OF JQUERY AND BOOTSTRAP
    var inlineHtml =
      '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css"><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&amp;c=1048144&amp;h=9ee6accfd476c9cae718&amp;_xt=.css"><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&amp;c=1048144&amp;h=ef2cda20731d146b5e98&amp;_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><style>.mandatory{color:red;}</style>';

      inlineHtml += '<div class="se-pre-con"></div><div ng-app="myApp" ng-controller="myCtrl">'

    if(tollPODRecordID != null){
      inlineHtml +=
        '<div class="container" style="padding-top: 3%;"><div id="alert_success" class="alert alert-success fade in">TOLL POD has been successfully Uploaded</div>';
    } else {
      inlineHtml +=
        '<div class="container" style="padding-top: 3%;"><div id="alert" class="alert alert-danger fade in"></div>';
    }


    inlineHtml += '<div class="form-group container zee_section">';
    inlineHtml += '<div class="row">';
    inlineHtml +=
      '<div class="col-xs-6 zee"><div class="input-group"><span class="input-group-addon" id="zee_text">FRANCHISEE <span class="mandatory">*</span></span><select id="zee" class="form-control zee" ><option value="0"></option>';
    inlineHtml += '<option value="621">Zhao Yang Lin (St. Kilda Road)</opion>'
    inlineHtml += '<option value="108">Vlado Nikoloski (Sunshine)</opion>'
    inlineHtml += '<option value="687">Jason Knight (Mulgrave)</opion>'
    inlineHtml += '<option value="655">David Hicks (Moorabin)</opion>'
    inlineHtml += '</select></div></div>';
    inlineHtml += '</div>';
    inlineHtml += '</div>';

    inlineHtml += '<div class="form-group container zee_section">';
    inlineHtml += '<div class="row">';
    inlineHtml +=
      '<div class="col-xs-6 location_div"><div class="input-group"><span class="input-group-addon" id="location_text">LOCATION DROPPED OFF <span class="mandatory">*</span></span><select name="LocationLeft" class="form-control location" aria-required="true" aria-invalid="false"><option></option><option value="1" >Reception</option><option value="2">Mailroom</option><option value="3">Counter</option><option value="4">Store</option><option value="5" selected="selected">Front Door</option><option value="6">Outside Lift</option><option value="7">Security</option><option value="8">Theatres</option><option value="9">Receiving Dock</option><option value="11">Garage</option><option value="12">Back Door</option><option value="10">Other</option></select></div></div>';
    inlineHtml += '</div>';
    inlineHtml += '</div>';

    form.addField('preview_table_extras', 'inlinehtml', '').setLayoutType(
      'startrow').setDefaultValue(inlineHtml);

    form.addField('upload_file_1', 'file', 'TOLL POD Form').setLayoutType(
      'outsidebelow', 'startrow').setDisplaySize(40).setMandatory(true);

    form.addField('custpage_operator', 'text', 'Operator').setDisplayType(
      'hidden');
    form.addField('custpage_location', 'text', 'Location').setDisplayType(
      'hidden');
    form.addField('custpage_json', 'text', 'Image to Text JSON').setDisplayType(
      'hidden');


    form.addSubmitButton('UPLOAD');
    form.addButton('back', 'Reset', 'onclick_reset()');
    form.setScript('customscript_cl_toll_pod_upload_form');
    response.writePage(form);

  } else {
    var file = request.getFile('upload_file_1');
    var zee = request.getParameter('custpage_operator');
    var location = request.getParameter('custpage_location');
    var jsonImageToText = request.getParameter('custpage_json');

    nlapiLogExecution('DEBUG','zee',zee)
    nlapiLogExecution('DEBUG','location',location)
    nlapiLogExecution('DEBUG','jsonImageToText',jsonImageToText)

    var d = new Date();
    var momentDate = moment().add(18,
      'hours').format('hh:mm A');

    if (!isNullorEmpty(file)) {
      file.setFolder(3057381);

      var type = file.getType();
      if (type == 'JPGIMAGE') {
        type = 'jpg';
      } else if (type == 'PDF') {
        type == 'pdf';
      } else if (type == 'PNGIMAGE') {
        type == 'png';
      } else if (type == 'PJPGIMAGE') {
        type == 'png';
      }

      var file_name = getDate() + '_' + momentDate + '_' + zee + '.' + type;

      file.setName(file_name);

      // Create file and upload it to the file cabinet.
      var id = nlapiSubmitFile(file);

      var tollPODRecord = nlapiCreateRecord(
        'customrecord_toll_pod');


      tollPODRecord.setFieldValue('name', file_name)
      tollPODRecord.setFieldValue('custrecord_toll_pod_upload_operator', zee)
      tollPODRecord.setFieldValue('custrecord_pod_form', id)
      tollPODRecord.setFieldValue('custrecord_toll_pod_locations', location)
      tollPODRecord.setFieldValue('custrecord_upload_time', momentDate)
      tollPODRecord.setFieldValue('custrecord_upload_date', getDate())
      tollPODRecord.setFieldValue('custrecord_image_text_json', jsonImageToText)

      var tollPODRecordID = nlapiSubmitRecord(tollPODRecord);
      var params = new Array();
      params['tollPODRecordID'] = tollPODRecordID;
      nlapiSetRedirectURL('EXTERNAL', 'https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1388&deploy=1&compid=1048144&h=718b6164fd2f1ca09435',null,null,params);

    }
  }
}

function isNullorEmpty(strVal) {
  return (strVal == null || strVal == '' || strVal == 'null' || strVal ==
    undefined || strVal == 'undefined' || strVal == '- None -' || strVal ==
    '0');
}

function getDate() {
  var date = new Date();
  if (date.getHours() > 6) {
    date = nlapiAddDays(date, 1);
  }
  date = nlapiDateToString(date);
  return date;
}
