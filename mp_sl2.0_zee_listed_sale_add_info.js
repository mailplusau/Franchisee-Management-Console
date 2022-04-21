/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-12-24T08:26:00+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-04-11T17:00:23+10:00
 */


define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect', 'N/format', 'N/file', 'N/task'
  ],
  function(ui, email, runtime, search, record, http, log, redirect, format,
    file, task) {

    var baseURL = 'https://1048144.app.netsuite.com/';
    if (runtime.EnvType == "SANDBOX") {
      baseURL = 'https://system.sandbox.netsuite.com';
    }

    var zeeId = 0;
    var zeeAgreementId = 0;
    var zeeName = '';
    var mainContact = '';
    var contactNumber = '';
    var email = '';
    var address = '';
    var dateListedForSale = '';
    var abn = '';
    var tradingEntity = '';
    var commencementDate = '';
    var expiryDate = '';
    var ultimateExpiryDate = '';
    var unlimitedTermOffer = '';
    var renewalTerms = '';
    var lowPrice = '';
    var highPrice = '';
    var nabAccreditation = '';
    var nabAccreditationFee = '';
    var salesCommission = '';
    var serviceRevenue = '';
    var serviceRevenueYear = '';
    var mpexRevenue = '';
    var mpexRevenueYear = '';
    var sendleRevenue = '';
    var sendleRevenueYear = '';
    var finalPurchasePrice = '';
    var deedOfVariationSent = 0;
    var deedOfVariationUploaded = 0;
    var dateDeedOfVariationSent = '';
    var deedOfVariation = '';
    var businessStartDate = '';
    var dailyRunTime = '';
    var territoryMapDoc = '';
    var termOnIM = '';

    function onRequest(context) {

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

          log.debug({
            title: 'count',
            details: zeeSalesLeadRecord.getLineCount({
              sublistId: 'addressbook'
            })
          });

          var addressCount = zeeSalesLeadRecord.getLineCount({
            sublistId: 'addressbook'
          });

          address = zeeSalesLeadRecord.getValue({
            fieldId: 'shipaddress'
          });

          dateListedForSale = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_date_listed_for_sale'
          });

          abn = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_abn_franchiserecord'
          });

          lowPrice = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_low_price'
          });
          highPrice = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_high_price'
          });
          nabAccreditation = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_nab_accreditation'
          });
          nabAccreditationFee = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_nab_accreditation_fee'
          });
          salesCommission = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_sales_commission'
          });
          serviceRevenue = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_service_revenue'
          });
          serviceRevenueYear = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_service_revenue_year'
          });
          mpexRevenue = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_mpex_revenue'
          });
          mpexRevenueYear = zeeSalesLeadRecord.getValue({
            fieldId: 'custentitympex_revenue_year'
          });
          sendleRevenue = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_sendle_revenue'
          });
          sendleRevenueYear = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_sendle_revenue_year'
          });
          finalPurchasePrice = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_final_sale_price'
          });
          deedOfVariationSent = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_deed_of_variation_sent'
          });
          dateDeedOfVariationSent = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_date_deed_of_variation_sent'
          });
          deedOfVariationUploaded = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_deed_uploaded'
          });
          businessStartDate = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_business_start_date'
          });
          dailyRunTime = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_total_daily_runtime'
          });
          territoryMapDoc = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_territory_map_doc'
          });
          termOnIM = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_term_on_im'
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
            zeeAgreementId = searchZeeAgreementsResultSet.getValue(
              'internalid');
            tradingEntity = searchZeeAgreementsResultSet.getValue(
              'custrecord_fr_agreement_entity');
            commencementDate = searchZeeAgreementsResultSet.getValue(
              'custrecord_fr_agreement_comm_date');
            expiryDate = searchZeeAgreementsResultSet.getValue(
              'custrecord_fr_agreement_expiry_date');
            ultimateExpiryDate = searchZeeAgreementsResultSet.getValue(
              'custrecord_fr_agreement_ult_expiry_date');
            unlimitedTermOffer = searchZeeAgreementsResultSet.getValue(
              'custrecord_unlimited_term_offer');
            renewalTerms = searchZeeAgreementsResultSet.getValue(
              'custrecord_fr_agreement_yrs_extended');
            deedOfVariation = searchZeeAgreementsResultSet.getValue(
              'custrecord_deed_of_variation_exit_progra');
            address = searchZeeAgreementsResultSet.getValue({
              name: "shipaddress",
              join: "CUSTRECORD_FR_AGREEMENT_FRANCHISEE"
            });
            return true;
          });

          var form = ui.createForm({
            title: zeeName + ' Franchisee Presales'
          });

          form.addField({
            id: 'custpage_zee_agreement2',
            type: ui.FieldType.TEXT,
            label: 'Day'
          }).updateDisplayType({
            displayType: ui.FieldDisplayType.HIDDEN
          }).defaultValue = zeeAgreementId;

          form.addField({
            id: 'custpage_zee2',
            type: ui.FieldType.TEXT,
            label: 'Day'
          }).updateDisplayType({
            displayType: ui.FieldDisplayType.HIDDEN
          }).defaultValue = zeeId;

          form.addField({
            id: 'custpage_dov_sent',
            type: ui.FieldType.TEXT,
            label: 'Day'
          }).updateDisplayType({
            displayType: ui.FieldDisplayType.HIDDEN
          }).defaultValue = deedOfVariationSent;

          form.addField({
            id: 'custpage_trading_entity2',
            type: ui.FieldType.TEXT,
            label: 'Day'
          }).updateDisplayType({
            displayType: ui.FieldDisplayType.HIDDEN
          }).defaultValue = tradingEntity;

          form.addField({
            id: 'custpage_main_contact2',
            type: ui.FieldType.TEXT,
            label: 'Day'
          }).updateDisplayType({
            displayType: ui.FieldDisplayType.HIDDEN
          }).defaultValue = mainContact;

          form.addField({
            id: 'custpage_address2',
            type: ui.FieldType.TEXT,
            label: 'Day'
          }).updateDisplayType({
            displayType: ui.FieldDisplayType.HIDDEN
          }).defaultValue = address;

          form.addField({
            id: 'custpage_email2',
            type: ui.FieldType.TEXT,
            label: 'Day'
          }).updateDisplayType({
            displayType: ui.FieldDisplayType.HIDDEN
          }).defaultValue = email;

          form.addField({
            id: 'custpage_dov_uploaded2',
            type: ui.FieldType.TEXT,
            label: 'Day'
          }).updateDisplayType({
            displayType: ui.FieldDisplayType.HIDDEN
          }).defaultValue = deedOfVariationUploaded;

          form.addField({
            id: 'custpage_terr_map_uploaded',
            type: ui.FieldType.TEXT,
            label: 'Day'
          }).updateDisplayType({
            displayType: ui.FieldDisplayType.HIDDEN
          }).defaultValue = territoryMapDoc;

          form.addField({
            id: 'custpage_dov_zee_name2',
            type: ui.FieldType.TEXT,
            label: 'Day'
          }).updateDisplayType({
            displayType: ui.FieldDisplayType.HIDDEN
          }).defaultValue = zeeName;

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

          if (deedOfVariationSent == 1 && isNullorEmpty(deedOfVariation) &&
            deedOfVariationUploaded != 1) {
            form.addField({
              id: 'upload_file_1',
              type: 'file',
              label: 'Upload Signed Deed of Variation'
            }).updateLayoutType({
              layoutType: ui.FieldLayoutType.OUTSIDEBELOW,
            }).updateBreakType({
              breakType: ui.FieldBreakType.STARTROW
            }).isMandatory = true
          } else if (deedOfVariationSent == 1 &&
            deedOfVariationUploaded == 1 && isNullorEmpty(territoryMapDoc)) {
            form.addField({
              id: 'upload_file_2',
              type: 'file',
              label: 'Upload Territory Map'
            }).updateLayoutType({
              layoutType: ui.FieldLayoutType.OUTSIDEBELOW,
            }).updateBreakType({
              breakType: ui.FieldBreakType.STARTROW
            }).isMandatory = true
          }


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

        var param_zee_agreement_id = context.request.parameters.custpage_zee_agreement2;
        var param_zee_name = context.request.parameters.custpage_dov_zee_name2;
        var param_dov_uploaded = context.request.parameters.custpage_dov_uploaded2;
        var param_dov_sent = context.request.parameters.custpage_dov_sent;
        var param_param_zeeid = context.request.parameters.custpage_zee2;
        var param_tradingEntity = context.request.parameters.custpage_trading_entity2;
        var param_mainContact = context.request.parameters.custpage_main_contact2;
        var param_email = context.request.parameters.custpage_email2;
        var param_address = context.request.parameters.custpage_address2;
        var param_custpage_terr_map_uploaded = context.request.parameters.custpage_terr_map_uploaded;

        if (param_dov_sent != 1) {
          var params = {
            custscript_zee_zeeid: param_param_zeeid,
            custscript_zee_trading_entity: param_tradingEntity,
            custscript_zee_main_contact: param_mainContact,
            custscript_zee_email: param_email,
            custscript_zee_address: param_address,
          };
          var reschedule = task.create({
            taskType: task.TaskType.SCHEDULED_SCRIPT,
            scriptId: 'customscript_ss_prefill_deed_of_variatio',
            deploymentId: 'customdeploy1',
            params: params
          });

          log.debug({
            title: 'rescheduling',
            details: 'rescheduling'
          });

          reschedule.submit();

        } else if (param_dov_sent == 1 && param_dov_uploaded != 1) {
          var file = context.request.files.upload_file_1;
          file.folder = 3200123;
          var file_type = file.fileType;
          var file_name =
            'Deed of Variation - Exit Program Assistance Offer - ' +
            param_zee_name + ' - ' +
            getDateToday() + '.' +
            file_type;
          // Create file and upload it to the file cabinet.
          file.name = file_name;
          var f_id = file.save();

          var rec = record.load({
            type: 'customrecord_fr_agreements',
            id: param_zee_agreement_id
          });
          rec.setValue({
            fieldId: 'custrecord_deed_of_variation_exit_progra',
            value: f_id
          });
          rec.save();

          var zeeRec = record.load({
            type: 'partner',
            id: param_param_zeeid
          });
          zeeRec.setValue({
            fieldId: 'custentity_deed_uploaded',
            value: 1
          });
          zeeRec.save();
        } else if (param_dov_sent == 1 && param_dov_uploaded == 1 &&
          isNullorEmpty(param_custpage_terr_map_uploaded)) {
          var file = context.request.files.upload_file_2;
          file.folder = 3193457;
          file.isonline = true;
          var file_type = file.fileType;
          var file_name = 'Territory Map - ' + param_zee_name + ' - ' +
            getDateToday() + '.' +
            file_type;
          // Create file and upload it to the file cabinet.
          file.name = file_name;
          var f_id2 = file.save();

          log.debug({
            title: 'f_id',
            details: f_id2
          })
          log.debug({
            title: 'file.url',
            details: file.url
          })

          var zeeRec = record.load({
            type: 'partner',
            id: param_param_zeeid
          });
          zeeRec.setValue({
            fieldId: 'custentity_territory_map_doc',
            value: f_id2
          });
          zeeRec.save();
        }

        redirect.toSuitelet({
          scriptId: 'customscript_sl_zee_listed_for_sale',
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
      if (deedOfVariationSent != 1) {
        inlineHtml +=
          '<div class="col-xs-6 sendDeed"><input type="button" value="SEND DEED OF VARIATION - EXIT PROGRAM ASSISTANCE OFFER" class="form-control btn btn-info" id="sendDeed" /></div>'
        inlineHtml +=
          '<div class="col-xs-6 saveZeeLead"><input type="button" value="SAVE" class="form-control btn btn-primary" id="saveZeeLead" /></div>'
      } else if (deedOfVariationSent == 1 && deedOfVariationUploaded != 1) {
        inlineHtml +=
          '<div class="col-xs-12 saveZeeLead"><input type="button" value="UPLOAD SIGNED DEED OF VARIATION - EXIT PROGRAM ASSISTANCE OFFER" class="form-control btn btn-primary" id="uploadDeed" /></div>'
      } else {
        inlineHtml +=
          '<div class="col-xs-12 saveZeeLead"><input type="button" value="SAVE" class="form-control btn btn-primary" id="saveZeeLead" /></div>'
      }

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

      var formattedCommencementDate = '';
      var formattedExpiryDate = '';
      var formattedUltimateExpiryDate = '';
      var formattedBusinessStartDate = '';

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

      if (!isNullorEmpty(commencementDate)) {
        commencementDate = format.format({
          value: commencementDate,
          type: format.Type.DATE
        });

        var commencementDateArray = commencementDate.split('/');
        if (commencementDateArray[1] < 10) {
          commencementDateArray[1] = '0' + commencementDateArray[1];
        }
        if (commencementDateArray[0] < 10) {
          commencementDateArray[0] = '0' + commencementDateArray[0];
        }
        var formattedCommencementDate = commencementDateArray[2] + '-' +
          commencementDateArray[1] +
          '-' + commencementDateArray[0];
      }

      if (!isNullorEmpty(expiryDate)) {
        expiryDate = format.format({
          value: expiryDate,
          type: format.Type.DATE
        });
        var expiryDateArray = expiryDate.split('/');
        if (expiryDateArray[1] < 10) {
          expiryDateArray[1] = '0' + expiryDateArray[1];
        }
        if (expiryDateArray[0] < 10) {
          expiryDateArray[0] = '0' + expiryDateArray[0];
        }
        var formattedExpiryDate = expiryDateArray[2] + '-' +
          expiryDateArray[1] +
          '-' + expiryDateArray[0];
      }

      if (!isNullorEmpty(ultimateExpiryDate)) {
        ultimateExpiryDate = format.format({
          value: ultimateExpiryDate,
          type: format.Type.DATE
        });
        var ultimateExpiryDateArray = ultimateExpiryDate.split('/');
        if (ultimateExpiryDateArray[1] < 10) {
          ultimateExpiryDateArray[1] = '0' + ultimateExpiryDateArray[1];
        }
        if (ultimateExpiryDateArray[0] < 10) {
          ultimateExpiryDateArray[0] = '0' + ultimateExpiryDateArray[0];
        }
        var formattedUltimateExpiryDate = ultimateExpiryDateArray[2] + '-' +
          ultimateExpiryDateArray[1] +
          '-' + ultimateExpiryDateArray[0];
      }
      if (!isNullorEmpty(businessStartDate)) {
        businessStartDate = format.format({
          value: businessStartDate,
          type: format.Type.DATE
        });
        var businessStartDateArray = businessStartDate.split('/');
        if (businessStartDateArray[1] < 10) {
          businessStartDateArray[1] = '0' + businessStartDateArray[1];
        }
        if (businessStartDateArray[0] < 10) {
          businessStartDateArray[0] = '0' + businessStartDateArray[0];
        }
        var formattedBusinessStartDate = businessStartDateArray[2] + '-' +
          businessStartDateArray[1] +
          '-' + businessStartDateArray[0];
      }


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
        tradingEntity + '" readonly/></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">MAIN CONTACT <span class="mandatory">*</span></span><input id="mainContact" class="form-control mainContact" value="' +
        mainContact + '" readonly/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">MOBILE NUMBER <span class="mandatory">*</span></span><input id="contactNumber" class="form-control contactNumber" value="' +
        contactNumber + '" readonly/></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">EMAIL<span class="mandatory">*</span></span><input id="email" class="form-control email" value="' +
        email + '" readonly/></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';


      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">ABN <span class="mandatory">*</span></span><input id="abn" class="form-control abn" value="' +
        abn + '" readonly/></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE LISTED FOR SALE <span class="mandatory">*</span></span><input id="dateListedForSale" class="form-control dateListedForSale" type="date" value="' +
        formattedDateListedForSale + '" readonly/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 name_section"><div class="input-group"><span class="input-group-addon">ADDRESS<span class="mandatory">*</span></span><textarea id="address" class="form-control address" style="height: 125px" readonly/>' +
        address + '</textarea></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">COMMENCEMENT DATE <span class="mandatory">*</span></span><input id="commencementDate" class="form-control commencementDate" type="date" value="' +
        formattedCommencementDate + '" readonly/></div></div>';
      inlineHtml +=
        '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">EXPIRY DATE <span class="mandatory">*</span></span><input id="expiryDate" class="form-control expiryDate" type="date" value="' +
        formattedExpiryDate + '" readonly/></div></div>';
      inlineHtml +=
        '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">ULTIMATE EXPIRY DATE <span class="mandatory">*</span></span><input id="ultimateExpiryDate" class="form-control ultimateExpiryDate" type="date" value="' +
        formattedUltimateExpiryDate + '" readonly/></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 name_section"><div class="input-group"><span class="input-group-addon">UNLIMTED TERM OFFER<span class="mandatory">*</span></span><select id="unlimitedTermOffer" class="form-control unlimitedTermOffer" readonly>';
      if (unlimitedTermOffer == 1) {
        inlineHtml += '<option value="1" selected>Yes</option>';
      } else {
        inlineHtml += '<option value="2">No</option>';
      }
      inlineHtml += '</select></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';



      if (!isNullorEmpty(deedOfVariation) || deedOfVariationUploaded == 1) {


        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">UNLIMTED TERM OFFER<span class="mandatory">*</span></span><select id="unlimitedTermOffer" class="form-control unlimitedTermOffer" readonly>';
        if (unlimitedTermOffer == 1) {
          inlineHtml += '<option value="1" selected>Yes</option>';
        } else {
          inlineHtml += '<option value="2">No</option>';
        }
        inlineHtml += '</select></div></div>';
        if (unlimitedTermOffer == 1) {
          inlineHtml +=
            '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">UNLIMITED TERM FEE ($) <span class="mandatory">*</span></span><input id="unlimitedTermFee" class="form-control unlimitedTermFee" value="25000" readonly/></div></div>';
        } else {
          inlineHtml +=
            '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">UNLIMITED TERM FEE ($) <span class="mandatory">*</span></span><input id="unlimitedTermFee" class="form-control unlimitedTermFee" value="0" readonly/></div></div>';
        }

        inlineHtml +=
          '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">RENEWAL TERMS (YEARS) <span class="mandatory">*</span></span><input id="renewalTerms" class="form-control renewalTerms" value="' +
          renewalTerms + '" readonly/></div></div>';

        inlineHtml += '</div>';
        inlineHtml += '</div>';

        if (!isNullorEmpty(deedOfVariation)) {
          inlineHtml += '<div class="form-group container">';
          inlineHtml += '<div class="row">';
          var fileObj = file.load({
            id: deedOfVariation
          });
          var fullURL = baseURL + fileObj.url;
          inlineHtml +=
            '<div class="col-xs-2"></div>';
          inlineHtml +=
            '<div class="col-xs-8" style="text-align: center;"><iframe id="viewer" frameborder="0" scrolling="no" width="400" height="600" src="' +
            fullURL + '"></iframe></div>';
          inlineHtml +=
            '<div class="col-xs-2"></div>';
          inlineHtml += '</div>';
          inlineHtml += '</div>';
        }

        inlineHtml +=
          '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">PRESALES DETAILS</span></h4></div>';
        inlineHtml += '</div>';
        inlineHtml += '</div>';


        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        if (unlimitedTermOffer == 1) {
          inlineHtml +=
            '<div class="col-xs-12 name_section"><div class="input-group"><span class="input-group-addon">TERM ON FRANCHISEE IM <span class="mandatory">*</span></span><input id="termOnIM" class="form-control termOnIM" value="Unlimited" readonly/></div></div>';
        } else {
          inlineHtml +=
            '<div class="col-xs-12 name_section"><div class="input-group"><span class="input-group-addon">TERM ON FRANCHISEE IM <span class="mandatory">*</span></span><input id="termOnIM" class="form-control termOnIM" value="' +
            termOnIM + '" /></div></div>';
        }
        inlineHtml += '</div>';
        inlineHtml += '</div>';


        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE BUSINESS STARTED <span class="mandatory">*</span></span><input id="businessStartDate" class="form-control businessStartDate" type="date" value="' +
          formattedBusinessStartDate + '"/></div></div>';
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">TOTAL DAILY RUN TIME  <span class="mandatory">*</span></span><input id="dailyRunTime" class="form-control dailyRunTime" value="' +
          dailyRunTime + '"/></div></div>';
        inlineHtml += '</div>';
        inlineHtml += '</div>';


        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">LOW PRICE ($) <span class="mandatory">*</span></span><input id="lowPrice" class="form-control lowPrice" value="' +
          lowPrice + '"/></div></div>';
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">HIGH PRICE ($) <span class="mandatory">*</span></span><input id="highPrice" class="form-control highPrice" value="' +
          highPrice + '"/></div></div>';
        inlineHtml += '</div>';
        inlineHtml += '</div>';

        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">SERVICE REVENUE ($) <span class="mandatory">*</span></span><input id="serviceRevenue" class="form-control serviceRevenue" value="' +
          serviceRevenue + '"/></div></div>';
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">YEAR<span class="mandatory">*</span></span><input id="serviceRevenueYear" class="form-control serviceRevenueYear" value="' +
          serviceRevenueYear + '"/></div></div>';

        inlineHtml += '</div>';
        inlineHtml += '</div>';
        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">MPEX COMMISSION ($) <span class="mandatory">*</span></span><input id="mpexRevenue" class="form-control mpexRevenue" value="' +
          mpexRevenue + '"/></div></div>';
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">YEAR<span class="mandatory">*</span></span><input id="mpexRevenueYear" class="form-control mpexRevenueYear" value="' +
          mpexRevenueYear + '"/></div></div>';
        inlineHtml += '</div>';
        inlineHtml += '</div>';

        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">SENDLE COMMISSION ($) <span class="mandatory">*</span></span><input id="sendleRevenue" class="form-control sendleRevenue" value="' +
          sendleRevenue + '"/></div></div>';
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">YEAR<span class="mandatory">*</span></span><input id="sendleRevenueYear" class="form-control sendleRevenueYear" value="' +
          sendleRevenueYear + '"/></div></div>';
        inlineHtml += '</div>';
        inlineHtml += '</div>';

        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">SALES COMMISSION (%) <span class="mandatory">*</span></span><input id="salesCommission" class="form-control salesCommission" value="' +
          salesCommission + '"/></div></div>';
        inlineHtml +=
          '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">NAB ACCREDITATION<span class="mandatory">*</span></span><select id="nabAccreditation" class="form-control nabAccreditation">';
        if (isNullorEmpty(nabAccreditation) || nabAccreditation == 2) {
          inlineHtml +=
            '<option value="1" >Yes</option><option value="2" selected>No</option>';

        } else {
          inlineHtml +=
            '<option value="1" selected>Yes</option><option value="2">No</option>';

        }

        inlineHtml += '</select></div></div>';
        inlineHtml +=
          '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">NAB ACCREDITATION FEE ($) <span class="mandatory">*</span></span><input id="nabAccreditationFee" class="form-control nabAccreditationFee" value="' +
          nabAccreditationFee + '"/></div></div>';

        inlineHtml += '</div></div>';
        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-12 name_section"><div class="input-group"><span class="input-group-addon">SALE PRICE<span class="mandatory">*</span></span><input id="finalPurchasePrice" class="form-control finalPurchasePrice" value="' +
          finalPurchasePrice + '"/></div></div>';
        inlineHtml += '</div>';
        inlineHtml += '</div>';

        if (!isNullorEmpty(territoryMapDoc)) {
          inlineHtml += '<div class="form-group container">';
          inlineHtml += '<div class="row">';
          var fileObj2 = file.load({
            id: territoryMapDoc
          });
          var fullURL = baseURL + fileObj2.url;
          inlineHtml +=
            '<div class="col-xs-2"></div>';
          inlineHtml +=
            '<div class="col-xs-8" style="text-align: center;"><iframe id="viewer" frameborder="0" scrolling="no" width="400" height="600" src="' +
            fullURL + '"></iframe></div>';
          inlineHtml +=
            '<div class="col-xs-2"></div>';
          inlineHtml += '</div>';
          inlineHtml += '</div>';
        }
      }

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
