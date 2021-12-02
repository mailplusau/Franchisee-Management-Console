/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-15T07:25:50+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-12-02T15:46:56+11:00
 */

define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect'
  ],
  function(ui, email, runtime, search, record, http, log, redirect) {
    var role = 0;
    var userId = 0;
    var zee = 0;

    var franchiseeName = '';
    var mainContact = '';
    var mainContactFName = '';
    var mainContactLName = '';
    var mainContactMobile = '';
    var primaryEmail = '';
    var personalEmail = '';
    var dob = '';
    var vaccinationStatus = '';
    var franchiseeABN = '';
    var franchiseeAddress = '';
    var franchiseeTOLLAccountNumber = '';
    var franchiseeTOLLPickupDX = '';
    var franchiseeTOLLLodgementDX = '';
    var franchiseeSendlePrimaryLocations = '';
    var franchiseeSendleSecondaryLocations = '';

    var color_array = ['blue', 'red', 'green', 'orange', 'black'];

    function onRequest(context) {
      var baseURL = 'https://system.na2.netsuite.com';
      if (runtime.EnvType == "SANDBOX") {
        baseURL = 'https://system.sandbox.netsuite.com';
      }
      userId = runtime.getCurrentUser().id;

      role = runtime.getCurrentUser().role;

      if (context.request.method === 'GET') {

        zee = context.request.parameters.zee;

        var form = ui.createForm({
          title: 'Franchisee Management Console'
        });

        //INITIALIZATION OF JQUERY AND BOOTSTRAP

        var inlineHtml =
          '<meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><script src="//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.3.1/leaflet-omnivore.min.js"></script><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&libraries=places"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&callback=initMap&libraries=places"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js"></script></script><link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" /><script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script><link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css"><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&amp;c=1048144&amp;h=9ee6accfd476c9cae718&amp;_xt=.css"><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&amp;c=1048144&amp;h=ef2cda20731d146b5e98&amp;_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.7/angular-resource.min.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><style>.mandatory{color:red;}.clearfix:after {clear: both;content: "";display: block;height: 0;}.wrapper {vertical-align: middle;}.nav {margin-top: 40px;}.pull-right {float: right;}a, a:active {color: #212121;text-decoration: none;}a:hover {color: #999;}.arrow-steps .step {font-size: 14px;text-align: center;color: #fff;cursor: default;margin: 0 3px;padding: 10px 10px 10px 30px;float: left;position: relative;background-color: #379e8f;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none; transition: background-color 0.2s ease;}.arrow-steps .step:after,.arrow-steps .step:before {content: " ";position: absolute;top: 0;right: -17px;width: 0;height: 40px;border-top: 19px solid transparent;border-bottom: 17px solid transparent;border-left: 17px solid #379e8f;	z-index: 2;transition: border-color 0.2s ease;}.arrow-steps .step:before {right: auto;left: 0;border-left: 17px solid #fff;	z-index: 0;}.arrow-steps .step:first-child:before {border: none;}.arrow-steps .step:first-child {border-top-left-radius: 4px;border-bottom-left-radius: 4px;}.arrow-steps .step span {position: relative;}.arrow-steps .step span:before {opacity: 0;content: "✔";position: absolute;top: -2px;left: -20px;color: #06ac77;}.arrow-steps .step.done span:before {opacity: 1;-webkit-transition: opacity 0.3s ease 0.5s;-moz-transition: opacity 0.3s ease 0.5s;-ms-transition: opacity 0.3s ease 0.5s;transition: opacity 0.3s ease 0.5s;}.arrow-steps .step.current {color: #103d39;font-weight: bold;background-color: #fbea51;}.arrow-steps .step.current:after {border-left: 17px solid #fbea51;	}.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #379E8F; color: #fff }.nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #379E8F; color: #379E8F; }</style>';


        var day = getDay();
        if (day == 0 || day == 6) {
          day = 1; //Monday
        }

        form.addField({
          id: 'custpage_zee',
          type: ui.FieldType.TEXT,
          label: 'Zee'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = zee;

        form.addField({
          id: 'custpage_name',
          type: ui.FieldType.TEXT,
          label: 'Zee'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = franchiseeName;

        form.addField({
          id: 'custpage_day',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = day;



        inlineHtml +=
          '<div class="se-pre-con"></div><div ng-app="myApp" ng-controller="myCtrl">';

        inlineHtml += spacing()
        inlineHtml += progressBar()
        inlineHtml += line()
        inlineHtml += spacing()


        inlineHtml += selectFranchiseeSection(zee)
        inlineHtml += spacing()

        inlineHtml += tabSection(role)

        inlineHtml += spacing()
        inlineHtml += line()
        inlineHtml += mainButtons(role)


        form.addField({
          id: 'preview_table',
          label: 'inlinehtml',
          type: 'inlinehtml'
        }).updateLayoutType({
          layoutType: ui.FieldLayoutType.STARTROW
        }).defaultValue = inlineHtml;

        form.clientScriptFileId = 5334734
        context.response.writePage(form);

      } else {

      }
    }

    function spacing() {
      var inlineHtml =
        '<div class="form-group spacing_section">';
      inlineHtml += '<div class="row">';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml;
    }

    function line() {
      var inlineHtml =
        '<hr style="height:5px; width:100%; border-width:0; color:red; background-color:#fff">'

      return inlineHtml
    }

    function progressBar() {
      var inlineHtml =
        '<div class="form-group progress_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="container"> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>SETUP</span> </div><div class="step"> <span>OPERATIONS TRAINING</span> </div><div class="step"> <span><span class="glyphicon glyphicon-ok" style="color: #fff"></span>IT TRAINING</span> </div><div class="step"> <span>AGREEMENTS SIGNED & UPLOADED</span> </div><div class="step"> <span>NETSUITE DATA ADMIN</span> </div><div class="step current"> <span>UPDATE/EDIT DETAILS</span> </div></div>';
      // inlineHtml += '<div class="nav clearfix"><a href="#" class="prev">Previous</a><a href="#" class="next pull-right">Next</a></div></div></div>'
      inlineHtml += '</div></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    function mainButtons(role) {

      var inlineHtml =
        '<div class="form-group container company_name_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 heading1"><input type="button" value="Send Email" class="form-control btn btn-primary" id="sendEmail" /></div>'
      inlineHtml +=
        '<div class="col-xs-3 heading1"><input type="button" value="Send SMS" class="form-control btn btn-primary" id="sendSMS" /></div>'
      inlineHtml +=
        '<div class="col-xs-3 heading1"><input type="button" value="Breach Notice" class="form-control btn btn-warning" id="breachNotice" /></div>'
      inlineHtml +=
        '<div class="col-xs-3 heading1"><input type="button" value="Termination" class="form-control btn btn-danger" id="breachNotice" /></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';



      return inlineHtml
    }


    function tabSection(zee) {
      // Tabs headers
      var inlineHtml =
        '<div>'
      inlineHtml +=
        '<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-tabs nav-justified main-tabs-sections " style="margin:0%;border-bottom-color: #fbea50 !important;border-bottom-width: 5px !important;border-bottom-style: solid;">';
      inlineHtml +=
        '<li role="presentation" class="active"><a data-toggle="tab" href="#zeeDetails"><b>MAINDETAILS</b></a></li>';
      inlineHtml +=
        '<li role="presentation" class=""><a data-toggle="tab" href="#operatorDetails"><b>OPERATION DETAILS</b></a></li>';
      inlineHtml +=
        '<li role="presentation" class=""><a data-toggle="tab" href="#zeeAgreements"><b>AGREEMENTS</b></a></li>';
      inlineHtml +=
        '<li role="presentation" class=""><a data-toggle="tab" href="#tollMPEX"><b>PICKUP & LODGEMENT LOCATIONS</b></a></li>';
      inlineHtml +=
        '<li role="presentation" class=""><a data-toggle="tab" href="#breachDetails"><b>BREACH & TERMINATION DETAILS</b></a></li>';
      inlineHtml += '</ul></div>';

      inlineHtml += '<div class="tab-content">';
      inlineHtml +=
        '<div role="tabpanel" class="tab-pane active" id="zeeDetails">';
      inlineHtml += franchiseeMainDetails(zee)
      inlineHtml += franchiseeNextOfKin()
      inlineHtml += '</div>';

      inlineHtml +=
        '<div role="tabpanel" class="tab-pane " id="zeeAgreements">';
      inlineHtml += franchiseeAgreements(zee)
      inlineHtml += '</div>';

      inlineHtml +=
        '<div role="tabpanel" class="tab-pane " id="operatorDetails">';
      inlineHtml += franchiseeOperatorDetails(zee)
      inlineHtml += franchiseeFleetDetails(zee)
      inlineHtml += '</div>';


      inlineHtml += '<div role="tabpanel" class="tab-pane " id="tollMPEX">';
      inlineHtml += franchiseeTOLLMPEX()
      inlineHtml += franchiseeAdhoc()
      inlineHtml += '</div>';

      inlineHtml +=
        '<div role="tabpanel" class="tab-pane " id="breachDetails">';
      inlineHtml += franchiseeBreachDetails()
      inlineHtml += franchiseeTerminationDetails()
      inlineHtml += '</div>';


      inlineHtml += '</div></div>';

      return inlineHtml;
    }

    function selectFranchiseeSection(zee) {
      var inlineHtml =
        '<div class="form-group container zee_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">SELECT FRANCHISEE</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';
      inlineHtml +=
        '<div class="form-group container zee_select_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 zee"><div class="input-group"><span class="input-group-addon" id="zee_text">FRANCHISEE <span class="mandatory">*</span></span><select id="zee_dropdown" class="form-control zee" ><option value=0></option>';

      //NetSuite Search: Zee Management Console - Franchisees
      var searchZees = search.load({
        id: 'customsearch_zee_management_console_zee',
        type: 'partner'
      });

      var resultSetZees = searchZees.run();

      resultSetZees.each(function(searchResultZees) {
        zeeId = searchResultZees.getValue('internalid');
        franchiseeName = searchResultZees.getValue('companyname');
        mainContact = searchResultZees.getValue('custentity3');
        mainContactFName = searchResultZees.getValue(
          'custentity_franchisee_firstname');
        mainContactLName = searchResultZees.getValue(
          'custentity_franchisee_lastname');
        primaryEmail = searchResultZees.getValue('email');
        personalEmail = searchResultZees.getValue(
          'custentity_personal_email_address');
        mainContactMobile = searchResultZees.getValue(
          'custentity2');
        franchiseeABN = searchResultZees.getValue(
          'custentity_abn_franchiserecord');
        franchiseeAddress = searchResultZees.getValue(
          'shipaddress');

        if (zeeId == zee) {
          inlineHtml += '<option value="' + zeeId + '" selected>' +
            franchiseeName + '</option>';
        } else {
          inlineHtml += '<option value="' + zeeId + '">' + franchiseeName +
            '</option>';
        }

        return true;
      });
      inlineHtml += '</select></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';


      return inlineHtml;
    }

    function franchiseeMainDetails(zee) {

      //NetSuite Search: Zee Management Console - Franchisees
      var searchZees = search.load({
        id: 'customsearch_zee_management_console_zee',
        type: 'partner'
      });

      if (!isNullorEmpty(zee)) {
        searchZees.filters.push(search.createFilter({
          name: 'internalid',
          join: null,
          operator: search.Operator.IS,
          values: zee
        }));
      }

      var resultSetZees = searchZees.run();

      resultSetZees.each(function(searchResultZees) {
        zeeId = searchResultZees.getValue('internalid');
        franchiseeName = searchResultZees.getValue('companyname');
        mainContact = searchResultZees.getValue('custentity3');
        mainContactFName = searchResultZees.getValue(
          'custentity_franchisee_firstname');
        mainContactLName = searchResultZees.getValue(
          'custentity_franchisee_lastname');
        primaryEmail = searchResultZees.getValue('email');
        personalEmail = searchResultZees.getValue(
          'custentity_personal_email_address');
        mainContactMobile = searchResultZees.getValue(
          'custentity2');
        franchiseeABN = searchResultZees.getValue(
          'custentity_abn_franchiserecord');
        franchiseeAddress = searchResultZees.getValue(
          'shipaddress');
        franchiseeTOLLAccountNumber = searchResultZees.getValue(
          'custentity_toll_acc_number');
        franchiseeTOLLPickupDX = searchResultZees.getText(
          'custentity__toll_pickup_dx_no');
        franchiseeTOLLLodgementDX = searchResultZees.getText(
          'custentity_toll_lodge_dx_no');
        franchiseeSendlePrimaryLocations = searchResultZees.getText(
          'custentity_sendle_hubbed_locations');
        franchiseeSendleSecondaryLocations = searchResultZees.getText(
          'custentity_sendle_hubbed_location_sec');

        return true;
      });
      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">FRANCHISEE DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 name_section"><div class="input-group"><span class="input-group-addon">FRANCHISE NAME</span><input id="file_name" class="form-control mainContact" value="' +
        franchiseeName + '" readonly/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';
      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">MAIN CONTACT</span><input id="file_name" class="form-control mainContact" value="' +
        mainContact + '" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">MOBILE NUMBER <span class="mandatory">*</span></span><input id="file_name" class="form-control mainContact" value="' +
        mainContactMobile + '" /></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 zee"><div class="input-group"><span class="input-group-addon" id="zee_text">TYPE OF OWNER <span class="mandatory">*</span></span><select id="zee" class="form-control zee" ><option value=0></option><option value=1>COMPANY OWNED</option><option value=2>INVESTOR</option><option value=3>Owner / Operator</option>';
      inlineHtml += '</select></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">ABN</span><input id="file_name" class="form-control mainContact" value="' +
        franchiseeABN + '" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';


      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">PRIMARY EMAIL</span><input id="file_name" class="form-control mainContact" value="' +
        primaryEmail + '" readonly/></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">PERSONAL EMAIL <span class="mandatory">*</span></span><input id="file_name" class="form-control mainContact" value="' +
        personalEmail + '" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container company_name_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE OF BIRTH <span class="mandatory">*</span></span><input id="file_name" type="date" class="form-control mainContact" value="" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 zee"><div class="input-group"><span class="input-group-addon" id="zee_text">VACCINATION STATUS <span class="mandatory">*</span></span><select id="zee" class="form-control zee" ><option value=0></option><option value=1>YES</option><option value=2>NO</option>';
      inlineHtml += '</select></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';
      //
      //


      inlineHtml +=
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">ADDRESS DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container row_address1 ">'
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 address1_section"><div class="input-group"><span class="input-group-addon">UNIT/LEVEL/SUITE</span><input id="address1" class="form-control address1" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 address2_section"><div class="input-group"><span class="input-group-addon">STREET NO. & NAME</span><input id="address2" class="form-control address2" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';


      inlineHtml += '<div class="form-group container ">'
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6"><div class="input-group"><span class="input-group-addon">CITY</span><input id="city" readonly class="form-control city" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">STATE</span><input id="state" readonly class="form-control state" /></div></div>';

      inlineHtml +=
        '<div class="col-xs-3 post_code_section"><div class="input-group"><span class="input-group-addon">POSTCODE</span><input id="postcode" readonly class="form-control postcode" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';


      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 name_section"><div class="input-group"><span class="input-group-addon">ADDRESS</span><textarea id="file_name" class="form-control mainContact" style="height:100px;" readonly>' +
        franchiseeAddress + '</textarea></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml

    }

    function franchiseeAgreements(zee) {

      //NetSuite Search: Zee Agreement - Search
      var searchZeeAgreements = search.load({
        id: 'customsearch_zee_agree_search',
        type: 'customrecord_fr_agreements'
      });

      if (!isNullorEmpty(zee)) {
        searchZeeAgreements.filters.push(search.createFilter({
          name: 'internalid',
          join: 'CUSTRECORD_FR_AGREEMENT_FRANCHISEE',
          operator: search.Operator.IS,
          values: zee
        }));
      }

      var resultSetZeeAgreements = searchZeeAgreements.run();

      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">FRANCHISE AGREEMENTS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<style>table#zeeAgreementsTable {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#zeeAgreementsTable th{text-align: center;} .bolded{font-weight: bold;}</style>';
      inlineHtml +=
        '<table id="zeeAgreementsTable" class="table table-responsive table-striped zeeAgreementsTable tablesorter" style="width: 100%;border: 1px solid #103d39;">';
      inlineHtml +=
        '<thead style="color: white;background-color: #379E8F;font-weight: bold;">';
      inlineHtml += '<tr class="text-center">';
      inlineHtml += '<td>LINK</td>'
      inlineHtml += '<td>NS ID</td>'
      inlineHtml += '<td>NAME</td>'
      inlineHtml += '<td>COMMENCEMENT DATE</td>'
      inlineHtml += '<td>EXPIRY DATE</td>'
      inlineHtml += '<td>ULTIMATE EXPIRY DATE</td>'
      inlineHtml += '<td>RENEWAL TERMS</td>'
      inlineHtml += '<td>AGREEMENT</td>'
      inlineHtml += '<td>AGREEMENT STATUS</td>'
      inlineHtml += '</tr>';
      inlineHtml += '</thead>';

      inlineHtml +=
        '<tbody id="resultOperatorTable" class="">';

      resultSetZeeAgreements.each(function(searchResultZeeAgreements) {

        zeeAgreementID = searchResultZeeAgreements.getValue('internalid');
        zeeAgreementName = searchResultZeeAgreements.getValue('name');
        zeeAgreementCommDate = searchResultZeeAgreements.getValue(
          'custrecord_fr_agreement_comm_date');
        zeeAgreementExpiryDate = searchResultZeeAgreements.getValue(
          'custrecord_fr_agreement_expiry_date');
        zeeAgreementUltExpiryDate = searchResultZeeAgreements.getValue(
          'custrecord_fr_agreement_ult_expiry_date');
        zeeAgreementStatus = searchResultZeeAgreements.getText(
          'custrecord_fr_agreement_status');
        zeeAgreementYearsExtended = searchResultZeeAgreements.getValue(
          'custrecord_fr_agreement_yrs_extended');
        zeeAgreementDeed = searchResultZeeAgreements.getValue(
          'custrecord_fr_agreement_deed');
        1182

        inlineHtml += '<tr>'
        inlineHtml +=
          '<td><button class="form-control btn btn-xs btn-primary glyphicon glyphicon-pencil" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
          zeeAgreementID +
          '" class="editOperator" style="cursor: pointer !important;color: white;"></a></button> <button class="form-control btn btn-xs btn-danger glyphicon glyphicon-trash" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
          zeeAgreementID +
          '" class="deleteOperator" style="cursor: pointer !important;color: white;"></a></button></td>'
        inlineHtml += '<td>' + zeeAgreementID + '</td>'
        inlineHtml +=
          '<td><b><a href="https://1048144.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=384&id=' +
          zeeAgreementID + '">' + zeeAgreementName + '</a></b></td>'
        inlineHtml += '<td>' + zeeAgreementCommDate + '</td>'
        inlineHtml += '<td>' + zeeAgreementExpiryDate + '</td>'
        inlineHtml += '<td>' + zeeAgreementUltExpiryDate + '</td>'
        inlineHtml += '<td>' + zeeAgreementYearsExtended + '</td>'
        inlineHtml += '<td>' + zeeAgreementDeed + '</td>'
        inlineHtml += '<td>' + zeeAgreementStatus + '</td>'
        inlineHtml += '</tr>';


        return true;
      });

      inlineHtml += '</tbody></table>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += franchiseeNewAgreement()

      return inlineHtml;
    }


    function franchiseeTOLLMPEX() {
      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">TOLL - MPEX</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">TOLL Account Number</span><input id="file_name" class="form-control mainContact" value="' +
        franchiseeTOLLAccountNumber + '" readonly/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';
      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">TOLL Pickup DX <span class="mandatory">*</span></span><input id="file_name" class="form-control mainContact" value="' +
        franchiseeTOLLPickupDX + '" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">TOLL Lodgement DX <span class="mandatory">*</span></span><input id="file_name" class="form-control mainContact" value="' +
        franchiseeTOLLLodgementDX + '" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml;
    }

    function franchiseeNextOfKin() {
      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">NEXT OF KIN</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 name_section"><div class="input-group"><span class="input-group-addon">FIRST NAME <span class="mandatory">*</span></span><input id="kinFirstName" type="text" class="form-control kinFirstName" value="" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 name_section"><div class="input-group"><span class="input-group-addon">LAST NAME <span class="mandatory">*</span></span><input id="kinLastName" class="form-control kinLastName" value="" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 name_section"><div class="input-group"><span class="input-group-addon">MOBILE NUMBER <span class="mandatory">*</span></span><input id="kinMobile" class="form-control kinMobile" value="" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 zee"><div class="input-group"><span class="input-group-addon" id="zee_text">RELATIONSHIP <span class="mandatory">*</span></span><select id="zee" class="form-control zee" ><option value=0></option>';
      inlineHtml += '</select></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';


      return inlineHtml;
    }

    function franchiseeAdhoc() {
      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">ADHOC</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">Sendle Primary Location</span><input id="file_name" class="form-control mainContact" value="' +
        franchiseeSendlePrimaryLocations + '" readonly/></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">Sendle Secondary Location</span><input id="file_name" class="form-control mainContact" value="' +
        franchiseeSendleSecondaryLocations + '" readonly/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml;
    }

    function franchiseeServiceNetwork() {
      var inlineHtml =
        '<div class="form-group container company_name_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml +=
        '<div class="col-xs-6 heading1"><input type="button" value="Your Franchise Service Network" class="form-control btn btn-primary" id="serviceNetwork" style="background-color: #287587;"/></div>'
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    function franchiseeNewAgreement() {

      var inlineHtml =
        '<div class="form-group container company_name_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml +=
        '<div class="col-xs-6 heading1"><input type="button" value="New Agreement" class="form-control btn btn-primary" id="newAgreement" style="background-color: #287587;"/></div>'
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    function franchiseeAddOperator() {
      var inlineHtml =
        '<div class="form-group container company_name_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml +=
        '<div class="col-xs-6 heading1"><input type="button" value="Add New Operator" class="form-control btn btn-primary" id="addOperator" style="background-color: #287587;"/></div>'
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    function franchiseeAddFleet() {
      var inlineHtml =
        '<div class="form-group container company_name_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml +=
        '<div class="col-xs-6 heading1"><input type="button" value="Add New Fleet" class="form-control btn btn-primary" id="addFleet" style="background-color: #287587;"/></div>'
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    function franchiseeOperatorDetails(zee) {

      //NetSuite Search: APP - Operator Load
      var searchOperators = search.load({
        id: 'customsearch_app_operator_load',
        type: 'customrecord_operator'
      });

      if (!isNullorEmpty(zee)) {
        searchOperators.filters.push(search.createFilter({
          name: 'internalid',
          join: 'CUSTRECORD_OPERATOR_FRANCHISEE2',
          operator: search.Operator.IS,
          values: zee
        }));
      }

      var resultSetOperators = searchOperators.run();

      var operatorID = '';
      var operatorName = '';
      var operatorPhone = '';
      var operatorEmail = '';
      var operatorEmploymentType = '';
      var operatorRole = '';
      var operatorMobileDev = '';

      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">SERVICE NETWORK</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      var directionsPanel_html = '';
      var print_section = '';
      //show the directionsPanel only if one zee selected
      directionsPanel_html +=
        '<div class="col-sm-6 " id="directionsPanel" style="height:500px; overflow:auto"></div>';
      print_section +=
        '</br><div class="row print_section hide"><div class="col-xs-10"></div><div class="col-xs-2"><input type="button" class="btn btn-info" id="printDirections" value="PRINT DIRECTIONS" style="width: 100%;"/></div></div></div>';
      inlineHtml += '</br>';
      inlineHtml +=
        '<div class="container map_section "><div class="row">';
      inlineHtml +=
        '<div class="col-sm-12" id="map" style="height: 500px"><div id="loader"><img src="https://1048144.app.netsuite.com/core/media/media.nl?id=2089999&c=1048144&h=e0aef405c22b65dfe546" alt="loader" /></div></div>';
      inlineHtml += '<div id="legend">';
      inlineHtml +=
        '<div class="hide legend_icons" style="background-color: rgb(255, 255, 255);box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;border-radius: 2px;left: 0px;margin-left: 5px;padding: 3px;"><div><svg height="23" width="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="black" fill="#575756"/></svg><span style="font-family: sans-serif;">Non Customer Location</span></div><div><svg height="23" width="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="black" fill="#008675"/></svg><span style="font-family: sans-serif;">Customer Location</span></div>';
      for (i = 0; i < 1; i++) {
        inlineHtml +=
          '<div><svg height="15" width="32"><line x1="2" y1="10" x2="25" y2="10" style="stroke:' +
          color_array[i] +
          ';stroke-width:2" /></svg><span style="font-family: sans-serif;">' +
          franchiseeName + '</span></div>';
      }
      inlineHtml += '</div>';
      inlineHtml +=
        '<div style="background-color: rgb(255, 255, 255);box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;border-radius: 2px;left: 0px;margin-left: 5px;padding: 3px;"><input class="form-control" type="textarea" placeholder="Territory" id="zee_territory"/></div>';
      inlineHtml += '</div>';

      // inlineHtml += directionsPanel_html;
      inlineHtml += '</div>';
      inlineHtml += print_section;

      inlineHtml += franchiseeServiceNetwork();

      inlineHtml +=
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">OPERATOR DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<style>table#operatorTable {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#operatorTable th{text-align: center;} .bolded{font-weight: bold;}</style>';
      inlineHtml +=
        '<table id="operatorTable" class="table table-responsive table-striped operatorTable tablesorter" style="width: 100%;border: 1px solid #103d39;">';
      inlineHtml +=
        '<thead style="color: white;background-color: #379E8F;font-weight: bold;">';
      inlineHtml += '<tr class="text-center">';
      inlineHtml += '<td>LINK</td>'
      inlineHtml += '<td>NS ID</td>'
      inlineHtml += '<td>NAME</td>'
      inlineHtml += '<td>EMAIL</td>'
      inlineHtml += '<td>PHONE</td>'
      inlineHtml += '<td>ROLE</td>'
      inlineHtml += '<td>EMPLOYMENT TYPE</td>'
      inlineHtml += '<td>MOBILE DEVICE</td>'
      inlineHtml += '</tr>';
      inlineHtml += '</thead>';

      inlineHtml +=
        '<tbody id="resultOperatorTable" class="">';

      resultSetOperators.each(function(searchResultOperators) {

        operatorID = searchResultOperators.getValue('internalid');
        operatorName = searchResultOperators.getValue('name');
        operatorPhone = searchResultOperators.getValue(
          'custrecord_operator_phone');
        operatorEmail = searchResultOperators.getValue(
          'custrecord_operator_email');
        operatorEmploymentType = searchResultOperators.getText(
          'custrecord_operator_employment');
        operatorRole = searchResultOperators.getText(
          'custrecord_operator_role');
        operatorMobileDev = searchResultOperators.getText(
          'custrecord_operator_mobdev_platform');

        inlineHtml += '<tr>'
        inlineHtml +=
          '<td><button class="form-control btn btn-xs btn-primary glyphicon glyphicon-pencil" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
          operatorID +
          '" class="editOperator" style="cursor: pointer !important;color: white;"></a></button> <button class="form-control btn btn-xs btn-danger glyphicon glyphicon-trash" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
          operatorID +
          '" class="deleteOperator" style="cursor: pointer !important;color: white;"></a></button></td>'
        inlineHtml += '<td>' + operatorID + '</td>'
        inlineHtml += '<td>' + operatorName + '</td>'
        inlineHtml += '<td>' + operatorEmail + '</td>'
        inlineHtml += '<td>' + operatorPhone + '</td>'
        inlineHtml += '<td>' + operatorRole + '</td>'
        inlineHtml += '<td>' + operatorEmploymentType + '</td>'
        inlineHtml += '<td>' + operatorMobileDev + '</td>'
        inlineHtml += '</tr>';


        return true;
      });

      inlineHtml += '</tbody></table>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += franchiseeAddOperator()

      return inlineHtml;
    }

    function franchiseeFleetDetails(zee) {

      //NetSuite Search: Franchisee - Operator Vehicle Details
      var searchZeeVehicles = search.load({
        id: 'customsearch1912',
        type: 'customrecord_vehicle'
      });

      if (!isNullorEmpty(zee)) {
        searchZeeVehicles.filters.push(search.createFilter({
          name: 'internalid',
          join: 'CUSTRECORD_VEHICLE_FRANCHISEE',
          operator: search.Operator.IS,
          values: zee
        }));
      }

      var resultSetZeeVehicles = searchZeeVehicles.run();


      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">FLEET DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<style>table#operatorTable {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#operatorTable th{text-align: center;} .bolded{font-weight: bold;}</style>';
      inlineHtml +=
        '<table id="operatorTable" class="table table-responsive table-striped operatorTable tablesorter" style="width: 100%;border: 1px solid #103d39;">';
      inlineHtml +=
        '<thead style="color: white;background-color: #379E8F;font-weight: bold;">';
      inlineHtml += '<tr class="text-center">';
      inlineHtml += '<td>LINK</td>'
      inlineHtml += '<td>NS ID</td>'
      inlineHtml += '<td>REGISTRATION</td>'
      inlineHtml += '<td>MODEL</td>'
      inlineHtml += '<td>MAKE</td>'
      inlineHtml += '<td>COLOR</td>'
      inlineHtml += '<td>YEAR</td>'
      inlineHtml += '<td>SIGNAGE</td>'
      inlineHtml += '<td>OWNER</td>'
      inlineHtml += '<td>OPERATOR NAME</td>'
      inlineHtml += '</tr>';
      inlineHtml += '</thead>';

      inlineHtml +=
        '<tbody id="resultOperatorTable" class="">';

      resultSetZeeVehicles.each(function(searchResultZeeVehicles) {
        vehicleID = searchResultZeeVehicles.getValue('internalid');
        vehicleRegistration = searchResultZeeVehicles.getValue('name');
        vehicleModel = searchResultZeeVehicles.getValue(
          'custrecord_vehicle_model_text');
        vehicleMake = searchResultZeeVehicles.getValue(
          'custrecord_vehicle_make');
        vehicleYear = searchResultZeeVehicles.getValue(
          'custrecord_vehicle_year');
        vehicleColor = searchResultZeeVehicles.getValue(
          'custrecord_vehicle_colour');
        vehicleSignage = searchResultZeeVehicles.getValue(
          'custrecord_vehicle_signage');
        vehicleOwner = searchResultZeeVehicles.getText(
          'custrecord_vehicle_owner');
        vehicleOperatorName = searchResultZeeVehicles.getValue({
          name: "custrecord_operator_givennames",
          join: "CUSTRECORD_OPERATOR_VEHICLE"
        });

        inlineHtml += '<tr>'
        inlineHtml +=
          '<td><button class="form-control btn btn-xs btn-primary glyphicon glyphicon-pencil" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
          vehicleID +
          '" class="editOperator" style="cursor: pointer !important;color: white;"></a></button> <button class="form-control btn btn-xs btn-danger glyphicon glyphicon-trash" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
          vehicleID +
          '" class="deleteOperator" style="cursor: pointer !important;color: white;"></a></button></td>'
        inlineHtml += '<td>' + vehicleID + '</td>'
        inlineHtml += '<td>' + vehicleRegistration + '</td>'
        inlineHtml += '<td>' + vehicleModel + '</td>'
        inlineHtml += '<td>' + vehicleMake + '</td>'
        inlineHtml += '<td>' + vehicleYear + '</td>'
        inlineHtml += '<td>' + vehicleColor + '</td>'
        inlineHtml += '<td>' + vehicleSignage + '</td>'
        inlineHtml += '<td>' + vehicleOwner + '</td>'
        inlineHtml += '<td>' + vehicleOperatorName + '</td>'
        inlineHtml += '</tr>';

        return true;
      });

      inlineHtml += '</tbody></table>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += franchiseeAddFleet()

      return inlineHtml;
    }

    function franchiseeBreachDetails() {
      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">BREACH DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml;
    }

    function franchiseeTerminationDetails() {
      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">TERMINATION DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml;
    }

    function isNullorEmpty(strVal) {
      return (strVal == null || strVal == '' || strVal == 'null' || strVal ==
        undefined || strVal == 'undefined' || strVal == '- None -' ||
        strVal ==
        '0');
    }

    /**
     * The header showing that the results are loading.
     * @returns {String} `inlineQty`
     */
    function loadingSection() {
      var inlineHtml =
        '<div id="loading_section" class="form-group container loading_section " style="text-align:center">';
      inlineHtml += '<div class="row">';
      inlineHtml += '<div class="col-xs-12 loading_div">';
      inlineHtml += '<h1>Loading...</h1>';
      inlineHtml += '</div></div></div>';

      return inlineHtml;
    }

    function getDay() {
      var date = new Date();
      if (date.getHours() > 6) {
        date.setDate(date.getDate() + 1);
      }
      var day = date.getDay();

      return day;
    }


    /**
     * Used to pass the values of `date_from` and `date_to` between the scripts and to Netsuite for the records and the search.
     * @param   {String} date_iso       "2020-06-01"
     * @returns {String} date_netsuite  "1/6/2020"
     */
    function dateISOToNetsuite(date_iso) {
      var date_netsuite = '';
      if (!isNullorEmpty(date_iso)) {
        var date_utc = new Date(date_iso);
        // var date_netsuite = nlapiDateToString(date_utc);
        var date_netsuite = format.format({
          value: date_utc,
          type: format.Type.DATE
        });
      }
      return date_netsuite;
    }

    return {
      onRequest: onRequest
    };
  });
