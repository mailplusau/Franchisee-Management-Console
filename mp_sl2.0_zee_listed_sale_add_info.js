/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-12-24T08:26:00+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-03-02T09:30:37+11:00
 */


define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect', 'N/format', 'N/file'
  ],
  function(ui, email, runtime, search, record, http, log, redirect, format,
    file) {

    var zeeId = 0;
    var zeeName = '';
    var mainContact = '';
    var contactNumber = '';
    var email = '';
    var address = '';
    var dateListedForSale = '';
    var abn = '';
    var tradingEntity = '';

    function onRequest(context) {
      var baseURL = 'https://system.na2.netsuite.com';
      if (runtime.EnvType == "SANDBOX") {
        baseURL = 'https://system.sandbox.netsuite.com';
      }
      userId = runtime.getCurrentUser().id;
      role = runtime.getCurrentUser().role;

      if (context.request.method === 'GET') {

        zeeId = context.request.parameters.zeeid;

        //INITIALIZATION OF JQUERY AND BOOTSTRAP
        var inlineHtml =
          '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&callback=initMap&libraries=places"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/drilldown.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script>';
        inlineHtml +=
          '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/css/bootstrap-select.min.css">';
        inlineHtml +=
          '<script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/bootstrap-select.min.js"></script>';
        // Semantic Select
        inlineHtml +=
          '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.css">';
        inlineHtml +=
          '<script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.js"></script>';
        inlineHtml +=
          '<style>.mandatory{color:red;}.clearfix:after {clear: both;content: "";display: block;height: 0;}.wrapper {vertical-align: middle;}.nav {margin-top: 40px;}.pull-right {float: right;}a, a:active {color: #212121;text-decoration: none;}a:hover {color: #999;}.arrow-steps .step {font-size: 14px;text-align: center;color: #fff;cursor: default;margin: 0 3px;padding: 10px 10px 10px 30px;float: left;position: relative;background-color: #379e8f;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none; transition: background-color 0.2s ease;}.arrow-steps .step:after,.arrow-steps .step:before {content: " ";position: absolute;top: 0;right: -17px;width: 0;height: 40px;border-top: 19px solid transparent;border-bottom: 17px solid transparent;border-left: 17px solid #379e8f;	z-index: 2;transition: border-color 0.2s ease;}.arrow-steps .step:before {right: auto;left: 0;border-left: 17px solid #fff;	z-index: 0;}.arrow-steps .step:first-child:before {border: none;}.arrow-steps .step:first-child {border-top-left-radius: 4px;border-bottom-left-radius: 4px;}.arrow-steps .step span {position: relative;}.arrow-steps .step span:before {opacity: 0;content: "✔";position: absolute;top: -2px;left: -20px;color: #06ac77;}.arrow-steps .step.done span:before {opacity: 1;-webkit-transition: opacity 0.3s ease 0.5s;-moz-transition: opacity 0.3s ease 0.5s;-ms-transition: opacity 0.3s ease 0.5s;transition: opacity 0.3s ease 0.5s;}.arrow-steps .step.current {color: #103d39;font-weight: bold;background-color: #fbea51;}.arrow-steps .step.current:after {border-left: 17px solid #fbea51;	}.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #379E8F; color: #fff }.nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #379E8F; color: #379E8F; }</style>';

        //For Edit Screen, get all the info from the record
        if (!isNullorEmpty(zeeId)) {

          var zeeSalesLeadRecord = record.load({
            type: record.Type.PARTNER,
            id: zeeId
          });

          zeeName = zeeSalesLeadRecord.getValue({
            fieldId: 'companyname'
          });

          mainContact = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity3'
          });

          contactNumber = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity2'
          });

          email = zeeSalesLeadRecord.getValue({
            fieldId: 'email'
          });

          address = zeeSalesLeadRecord.getValue({
            fieldId: 'defaultaddress'
          });

          dateListedForSale = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_date_listed_for_sale'
          });

          abn = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_abn_franchiserecord'
          });

          var searchZeeAgreements = search.load({
            id: 'customsearch_zee_agreements_listed_for_s',
            type: 'customrecord_fr_agreements'
          });

          var new_filter = search.createFilter({
            name: 'internalid',
            join: 'custrecord_fr_agreement_franchisee',
            operator: 'anyof',
            values: zeeId,
          });

          searchZeeAgreements.filters.push(new_filter);

          searchZeeAgreements.run().each(function(
            searchZeeAgreementsResultSet) {
              tradingEntity = searchZeeAgreementsResultSet.getValue('custrecord_fr_agreement_entity');
              return true;
          });

          var form = ui.createForm({
            title: zeeName + ' Franchisee Presales'
          });

          //Loading Section that gets displayed when the page is being loaded
          inlineHtml +=
            '<div class="se-pre-con"></div><div ng-app="myApp" ng-controller="myCtrl">';

          inlineHtml += '<div id="container"></div>'
          inlineHtml += backButton();
          inlineHtml += spacing();
          inlineHtml += line();
          //ERROR SECTION
          inlineHtml +=
            '<div class="container" ><div id="alert" class="alert alert-danger fade in"></div></div>';

          inlineHtml += mainSection();
          inlineHtml += mainButtons()
          inlineHtml += '</div>';

          form.addField({
            id: 'preview_table',
            label: 'inlinehtml',
            type: 'inlinehtml'
          }).updateLayoutType({
            layoutType: ui.FieldLayoutType.MIDROW,
          }).defaultValue = inlineHtml;

          // if (salesStage == 8 || salesStage == '7') {
          //   form.addField({
          //       id: 'upload_file_1',
          //       type: 'file',
          //       label: 'Approved Expression of Interest'
          //     }).updateLayoutType({
          //       layoutType: ui.FieldLayoutType.OUTSIDEBELOW,
          //     }).updateBreakType({
          //       breakType: ui.FieldBreakType.STARTROW
          //     }).isMandatory = true
          //     // form.addField('upload_file_1', 'file',
          //     //   'Approved Expression of Interest').setLayoutType(
          //     //   'outsidebelow', 'startrow').setDisplaySize(40);
          // }

          form.addSubmitButton({
            label: 'SAVE'
          });

        } else {

          var form = ui.createForm({
            title: 'Franchise PreSales - No Territory Chosen'
          });

        }

        form.clientScriptFileId = 5515492
        context.response.writePage(form);

      } else {

        var file = context.request.files.upload_file_1;
        var param_zeeleadid = context.request.parameters.custpage_zeeleadid;

        if (!isNullorEmpty(file)) {

          file.folder = 3162671;
          var file_type = file.fileType;
          var file_name = getDateToday() + '_' + param_zeeleadid + '.' +
            file_type;
          // Create file and upload it to the file cabinet.
          file.name = file_name;
          var f_id = file.save();

          var rec = record.load({
            type: 'customrecord_zee_sales_leads',
            id: param_zeeleadid
          });
          rec.setValue({
            fieldId: 'custrecord_eoi_doc_id',
            value: f_id
          });
          rec.save();

        }

        redirect.toSuitelet({
          scriptId: 'customscript_sl2_zee_new_leads_list',
          deploymentId: 'customdeploy1',
        });

      }
    }

    /*
     * PURPOSE : ADDS SPACING
     *  PARAMS :
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function spacing() {
      var inlineHtml =
        '<div class="form-group spacing_section">';
      inlineHtml += '<div class="row">';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml;
    }


    /*
     * PURPOSE : ADDS HORIZONTAL LINE TO DIVIDE SECTIONS
     *  PARAMS :
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function line() {
      var inlineHtml =
        '<hr style="height:5px; width:100%; border-width:0; color:red; background-color:#fff">'

      return inlineHtml
    }

    /*
     * PURPOSE : BUTTONS ON TOP OF THE PAGE TO GO BACK
     *  PARAMS : USER ROLE
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function backButton(role) {

      var inlineHtml = ''
      inlineHtml +=
        '<div class="form-group back_buttons_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-1 backButton"><input type="button" value="BACK" class="form-control btn btn-primary" id="backButton" /></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';


      return inlineHtml
    }

    /*
     * PURPOSE : BUTTONS SECTION AT THE END OF THE PAGE.
     *  PARAMS : USER ROLE
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function mainButtons(role) {


      var inlineHtml = ''
      inlineHtml +=
        '<div class="form-group container zee_available_buttons_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 sendDeed"><input type="button" value="SEND DEED OF VARIATION" class="form-control btn btn-info" id="sendDeed" /></div>'
      inlineHtml +=
        '<div class="col-xs-6 saveZeeLead"><input type="button" value="SAVE" class="form-control btn btn-primary" id="saveZeeLead" /></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    /*
     * PURPOSE : FRANCHISE MAIN DETAILS TAB
     *  PARAMS : ZEE ID
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function mainSection() {

      dateListedForSale = format.format({
        value: dateListedForSale,
        type: format.Type.DATE
      });
      var dateListedForSaleArray = dateListedForSale.split('/');
      if (dateListedForSaleArray[1] < 10) {
        dateListedForSaleArray[1] = '0' + dateListedForSaleArray[1];
      }
      if (dateListedForSaleArray[0] < 10) {
        dateListedForSaleArray[0] = '0' + dateListedForSaleArray[0];
      }
      var formattedDateListedForSale = dateListedForSaleArray[2] + '-' +
        dateListedForSaleArray[1] +
        '-' + dateListedForSaleArray[0];

      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">MAIN DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">TRADING ENTITY <span class="mandatory">*</span></span><input id="tradingEntity" class="form-control tradingEntity" value="' +
        tradingEntity + '" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">MAIN CONTACT <span class="mandatory">*</span></span><input id="mainContact" class="form-control mainContact" value="' +
        mainContact + '" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">MOBILE NUMBER <span class="mandatory">*</span></span><input id="contactNumber" class="form-control contactNumber" value="' +
        contactNumber + '" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">EMAIL<span class="mandatory">*</span></span><input id="email" class="form-control email" value="' +
        email + '" /></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';


      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">ABN <span class="mandatory">*</span></span><input id="abn" class="form-control abn" value="' +
        abn + '" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE LISTED FOR SALE <span class="mandatory">*</span></span><input id="dateListedForSale" class="form-control dateListedForSale" type="date" value="' +
        formattedDateListedForSale + '" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 name_section"><div class="input-group"><span class="input-group-addon">ADDRESS<span class="mandatory">*</span></span><textarea id="address" class="form-control address" style="height: 125px" />' +
        address + '</textarea></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';



      return inlineHtml

    }

    /*
     * PURPOSE : CHECK IF VARIABLE IS NULL/EMPTY/0
     *  PARAMS : STRING VARIABLE
     * RETURNS : BOOLEAN
     *   NOTES :
     */
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

    /*
     * PURPOSE : GET TODAYS DATE IN CORRECT FORMAT
     *  PARAMS : -
     * RETURNS : TODAYS DATE
     *   NOTES :
     */
    function getDateToday() {
      var date = new Date();
      log.debug({
        title: 'date',
        details: date
      })
      format.format({
        value: date,
        type: format.Type.DATE,
        timezone: format.Timezone.AUSTRALIA_SYDNEY
      })

      return date;
    }

    function getDate(inputDate) {
      var date = new Date(inputDate);
      log.debug({
        title: 'date',
        details: date
      })
      format.format({
        value: date,
        type: format.Type.DATE,
        timezone: format.Timezone.AUSTRALIA_SYDNEY
      })

      return date;
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
