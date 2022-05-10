/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-12-24T08:26:00+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-05-10T13:11:13+10:00
 */


define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect', 'N/format', 'N/file', 'N/task'
  ],
  function(ui, email, runtime, search, record, http, log, redirect, format,
    file, task) {

    var color_array = ['blue', 'red', 'green', 'orange', 'black'];

    var zeeleadid = 0;
    var firstName = '';
    var lastName = '';
    var mobile = '';
    var email = '';
    var franchiseeTypeOfOwner = 0;
    var vehicle = 0;
    var experience = 0;
    var employment = 0;
    var finance = 0;
    var investment = 0;
    var classification = 0;
    var salesStage = 0;
    var comments = '';
    var suburb = '';
    var state = '';
    var postcode = '';
    var dateEntered = ''
    var dateLost = '';
    var dateQualified = ''
    var dateOpportunity = '';
    var dateQualifiedNoTerritory = ''
    var dateOpportunityDenied = ''
    var dateEOIMichaelApproved = '';
    var dateEOIChrisApproved = '';
    var dateFinanceStage = '';
    var interestedZees = [];
    var eoiSent = '2';
    var imSent = '2';
    var ndaSent = '2';
    var eoiFileId = 0;
    var salePrice = 0;
    var incGST = 2;
    var totalSalePrice = 0;
    var owner = '0';
    var reminder;
    var owner_list = '';
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
    var zeeAgreementId = '';
    var tradingEntity = '';
    var commencementDate = '';
    var expiryDate = '';
    var ultimateExpiryDate = '';
    var unlimitedTermOffer = '';
    var renewalTerms = '';
    var territoryMapDoc = '';
    var territoryMapURL = '';
    var tradingEntityName = '';
    var acn = '';
    var abn = '';
    var ndaaddress1 = '';
    var ndaaddress2 = '';
    var ndasuburb = '';
    var ndastate = '';
    var ndapostcode = '';
    var deposit = '';
    var startDate;

    var readonlyFields = ''

    var baseURL = 'https://1048144.app.netsuite.com/';
    if (runtime.EnvType == "SANDBOX") {
      baseURL = 'https://system.sandbox.netsuite.com';
    }

    function onRequest(context) {

      userId = runtime.getCurrentUser().id;
      role = runtime.getCurrentUser().role;

      if (context.request.method === 'GET') {

        zeeleadid = context.request.parameters.zeeleadid;

        if (zeeleadid == 0 || isNullorEmpty(zeeleadid)) {
          var form = ui.createForm({
            title: 'Add Franchisee Sales Lead'
          });
        } else {
          var form = ui.createForm({
            title: 'Edit Franchisee Sales Lead'
          });
        }

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
        if (!isNullorEmpty(zeeleadid)) {

          form.addField({
            id: 'custpage_zeeleadid',
            type: ui.FieldType.TEXT,
            label: 'Table CSV'
          }).updateDisplayType({
            displayType: ui.FieldDisplayType.HIDDEN
          }).defaultValue = zeeleadid

          var zeeSalesLeadRecord = record.load({
            type: 'customrecord_zee_sales_leads',
            id: zeeleadid
          });

          firstName = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_zee_leads_fname'
          });
          lastName = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_zee_leads_lname'
          });
          mobile = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_zee_lead_mobile'
          });
          email = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_zee_lead_email'
          });
          finance = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_finance_required'
          });
          investment = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_investment_bracket'
          });
          vehicle = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_own_a_vehicle'
          });
          franchiseeTypeOfOwner = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_type_of_owner'
          });
          experience = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_years_of_experience'
          });

          employment = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_type_of_employement'
          });
          comments = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_comments'
          });

          interestedZees = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_zee_leads_interested_zees'
          });

          suburb = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_areas_of_interest_suburb'
          });
          state = zeeSalesLeadRecord.getText({
            fieldId: 'custrecord_areas_of_interest_state'
          });
          postcode = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_areas_of_interest_postcode'
          });


          classification = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_classification'
          });
          salesStage = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_zee_lead_stage'
          });


          dateEntered = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_zee_lead_date_entered'
          });
          dateLost = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_date_lead_lost'
          });
          dateQualified = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_date_qualified_lead'
          });
          dateOpportunity = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_date_opportunity'
          });
          dateQualifiedNoTerritory = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_date_qualified_no_territory'
          });
          dateOpportunityDenied = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_date_opportunity_denied'
          });
          eoiSent = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_eoi_sent'
          });
          dateEOIMichaelApproved = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_date_michael_approved'
          });
          dateEOIChrisApproved = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_date_chris_approved'
          });
          eoiFileId = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_eoi_doc_id'
          });
          salePrice = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_sale_price'
          });
          incGST = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_inc_gst'
          });
          if (isNullorEmpty(incGST)) {
            incGST = 2
          }
          totalSalePrice = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_total_sale_price'
          });
          dateFinanceStage = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_date_finance_stage'
          });
          owner = zeeSalesLeadRecord.getValue({
            fieldId: 'owner'
          });
          reminder = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_reminder_date'
          });
          imSent = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_im_sent'
          });
          ndaSent = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_nda_sent'
          });
          if (isNullorEmpty(ndaSent)) {
            ndaSent = '2';
          }
          tradingEntityName = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_trading_entity_name'
          });
          acn = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_acn'
          });
          abn = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_abn'
          });
          ndaaddress1 = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_address1'
          });
          ndaaddress2 = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_address2'
          });
          ndasuburb = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_suburb'
          });
          ndastate = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_address_state'
          });
          ndapostcode = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_postcode'
          });
          deposit = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_deposit'
          });
          startDate = zeeSalesLeadRecord.getValue({
            fieldId: 'custrecord_new_zee_start_date'
          });

          if (salesStage == 14) {
            readonlyFields = 'readonly'
          }


          log.debug({
            title: 'owner',
            details: owner
          })
          log.debug({
            title: 'reminder',
            details: reminder
          })

        } else {
          form.addField({
            id: 'custpage_zeeleadid',
            type: ui.FieldType.TEXT,
            label: 'Table CSV'
          }).updateDisplayType({
            displayType: ui.FieldDisplayType.HIDDEN
          }).defaultValue = '0'
        }

        form.addField({
          id: 'custpage_eoisent',
          type: ui.FieldType.TEXT,
          label: 'Table CSV'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = eoiSent

        form.addField({
          id: 'custpage_eoitobesent',
          type: ui.FieldType.TEXT,
          label: 'Table CSV'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })

        form.addField({
          id: 'custpage_imsent',
          type: ui.FieldType.TEXT,
          label: 'Table CSV'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = imSent

        form.addField({
          id: 'custpage_ndasent',
          type: ui.FieldType.TEXT,
          label: 'Table CSV'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = ndaSent

        form.addField({
          id: 'custpage_interestedzees',
          type: ui.FieldType.TEXT,
          label: 'Table CSV'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = interestedZees

        form.addField({
          id: 'custpage_upload_nda_clicked',
          type: ui.FieldType.TEXT,
          label: 'Table CSV'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = false


        inlineHtml += lostZeeLeadModal();

        //Loading Section that gets displayed when the page is being loaded
        inlineHtml +=
          '<div class="se-pre-con"></div><div ng-app="myApp" ng-controller="myCtrl">';

        inlineHtml += '<div id="container"></div>'
        inlineHtml += backButton();
        inlineHtml += line();
        inlineHtml += progressBar(salesStage, classification);
        inlineHtml += spacing();
        inlineHtml += line();
        //ERROR SECTION
        inlineHtml +=
          '<div class="container" ><div id="alert" class="alert alert-danger fade in"></div></div>';

        inlineHtml += zeeSalesMainLead();
        inlineHtml += operationsSection();
        inlineHtml += areasOfInterestSection();
        if (zeeleadid != 0 && !isNullorEmpty(zeeleadid)) {
          if (salesStage != 1 && salesStage != 4 && salesStage != 6) {
            inlineHtml += potentialZeesSection();
            inlineHtml += presalesDetails();
          }
        }
        inlineHtml += prefillNDASection();
        inlineHtml += financeSection();
        inlineHtml += reminderCommentsSection();
        inlineHtml += salesWFDateDetails();
        inlineHtml += line();
        inlineHtml += mainButtons()
        inlineHtml += '</div>';

        form.addField({
          id: 'preview_table',
          label: 'inlinehtml',
          type: 'inlinehtml'
        }).updateLayoutType({
          layoutType: ui.FieldLayoutType.MIDROW,
        }).defaultValue = inlineHtml;

        if (salesStage == '7') {
          form.addField({
            id: 'upload_file_2',
            type: 'file',
            label: 'Upload Signed NDA'
          }).updateLayoutType({
            layoutType: ui.FieldLayoutType.OUTSIDEBELOW,
          }).updateBreakType({
            breakType: ui.FieldBreakType.STARTROW
          }).isMandatory = true
        } else if (salesStage == 10 && eoiSent == 1) {
          form.addField({
            id: 'upload_file_1',
            type: 'file',
            label: 'Upload Signed EOI'
          }).updateLayoutType({
            layoutType: ui.FieldLayoutType.OUTSIDEBELOW,
          }).updateBreakType({
            breakType: ui.FieldBreakType.STARTROW
          }).isMandatory = true
        }

        form.addSubmitButton({
          label: 'SAVE'
        });

        form.clientScriptFileId = 5403754
        context.response.writePage(form);

      } else {

        var file = context.request.files.upload_file_1;
        var file2 = context.request.files.upload_file_2;
        var param_zeeleadid = context.request.parameters.custpage_zeeleadid;
        var param_imsent = context.request.parameters.custpage_imsent;
        var param_ndasent = context.request.parameters.custpage_ndasent;
        var param_interestedzees = context.request.parameters.custpage_interestedzees;
        var param_upload_nda_clicked = context.request.parameters.custpage_upload_nda_clicked;
        var param_eoi_to_be_sent = context.request.parameters.custpage_eoitobesent;

        log.debug({
          title: 'param_zeeleadid',
          details: param_zeeleadid
        });
        log.debug({
          title: 'param_imsent',
          details: param_imsent
        });
        log.debug({
          title: 'param_ndasent',
          details: param_ndasent
        });
        log.debug({
          title: 'param_interestedzees',
          details: param_interestedzees
        });

        if (param_imsent == '1' && param_ndasent == '2') {
          var params = {
            custscript_zeeleadid: param_zeeleadid,
            custscript_interestedzees: param_interestedzees
          };
          var reschedule = task.create({
            taskType: task.TaskType.SCHEDULED_SCRIPT,
            scriptId: 'customscript_ss_prefill_im',
            deploymentId: 'customdeploy1',
            params: params
          });

          log.debug({
            title: 'rescheduling',
            details: 'rescheduling'
          });

          reschedule.submit();
        } else if (param_imsent == '1' && param_ndasent == '1' &&
          param_upload_nda_clicked == 'false' && isNullorEmpty(file)) {

          var params = {
            custscript_zeeleadid_nda: param_zeeleadid
          };
          var reschedule = task.create({
            taskType: task.TaskType.SCHEDULED_SCRIPT,
            scriptId: 'customscript_ss_prefill_nda',
            deploymentId: 'customdeploy1',
            params: params
          });

          log.debug({
            title: 'rescheduling',
            details: 'rescheduling'
          });

          reschedule.submit();
        } else if (param_eoi_to_be_sent == '1') {
          var params = {
            custscript_new_zee_lead_id: param_zeeleadid
          };
          var reschedule = task.create({
            taskType: task.TaskType.SCHEDULED_SCRIPT,
            scriptId: 'customscript_ss_send_eoi',
            deploymentId: 'customdeploy1',
            params: params
          });

          log.debug({
            title: 'rescheduling',
            details: 'rescheduling'
          });

          reschedule.submit();
        }

        if (!isNullorEmpty(file)) {

          file.folder = 3162671;
          var file_type = file.fileType;
          if (!isNullorEmpty(file_type) && file_type != 'undefined') {
            var file_name = 'EOI_' + getDateToday() + '_' + param_zeeleadid +
              '.' +
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

            var params = {
              custscript_mmc_zee_lead_id: param_zeeleadid,
              custscript_email_type: 'eoi'
            };
            var reschedule = task.create({
              taskType: task.TaskType.SCHEDULED_SCRIPT,
              scriptId: 'customscript_ss_send_email_mmc',
              deploymentId: 'customdeploy1',
              params: params
            });

            log.debug({
              title: 'rescheduling',
              details: 'rescheduling'
            });

            reschedule.submit();

          }


        }
        if (!isNullorEmpty(file2)) {

          file2.folder = 3199521;
          var file_type2 = file2.fileType;
          log.debug({
            title: 'file_type2',
            value: file_type2
          })
          if (!isNullorEmpty(file_type2) && file_type2 != 'undefined') {
            var file_name2 = 'NDA_' + getDateToday() + '_' + param_zeeleadid +
              '.' +
              file_type2;
            // Create file and upload it to the file cabinet.
            file2.name = file_name2;
            var f_id2 = file2.save();

            var rec = record.load({
              type: 'customrecord_zee_sales_leads',
              id: param_zeeleadid
            });
            rec.setValue({
              fieldId: 'custrecord_signed_nda_doc',
              value: f_id2
            });
            rec.setValue({
              fieldId: 'custrecord_zee_lead_stage',
              value: 8
            });
            rec.setValue({
              fieldId: 'custrecord_date_signed_nda_uploaded',
              value: getDateToday()
            });
            rec.setValue({
              fieldId: 'custrecord_date_michael_approved',
              value: getDateToday()
            });
            rec.save();

            var params = {
              custscript_mmc_zee_lead_id: param_zeeleadid,
              custscript_email_type: 'nda'
            };
            var reschedule = task.create({
              taskType: task.TaskType.SCHEDULED_SCRIPT,
              scriptId: 'customscript_ss_send_email_mmc',
              deploymentId: 'customdeploy1',
              params: params
            });

            log.debug({
              title: 'rescheduling',
              details: 'rescheduling'
            });

            reschedule.submit();

          }

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
     * PURPOSE : PROGRESS BAR AT THE TOP OF THE PAGE TO SHOW AT WHAT STAGE THE FRANCHISE SALES & MANAGEMENT WORKFLOW IS AT. ONLY SEEN TO THE HEADOFFICE USERS NOT AVAILABLE TO THE FRANCHISEES
     *  PARAMS :
     * RETURNS :  INLINEHTML
     *   NOTES :
     */
    function progressBar(salesStage, classification) {

      if (franchiseeTypeOfOwner != 4) {
        var defaultHideClass = '';
      } else {
        var defaultHideClass = 'hide'
      }

      var inlineHtml =
        '<div class="form-group progress_section ' + defaultHideClass +
        '" style="margin: auto;width: 100%;padding: 10px;">';
      inlineHtml += '<div class="row">';
      if (salesStage == 1) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step current"> <span>NEW LEAD</span> </div><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="stageQualified" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>QUALIFIED LEAD</b></a></span> </div><div class="step"> <span>OPPORTUNITY</span> </div><div class="step"> <span>IM SENT</span> </div><div class="step"> <span>NDA SENT</span> </div><div class="step"> <span>OPERATIONS MEETING</span> </div><div class="step"> <span>SALES MEETING</span> </div><div class="step"> <span>FINANCE MEETING</span> </div><div class="step"> <span>EOI & DEPOSIT</span> </div><div class="step"> <span>INTERVIEW</span> </div><div class="step"> <span>WON</span> </div></div>';
      } else if (salesStage == 2) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="stageNewLead" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>NEW LEAD</b></a></span> </div><div class="step current"> <span>QUALIFIED LEAD</span> </div><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="stageOpportunity" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>OPPORTUNITY</b></a></span> </div><div class="step"> <span>IM SENT</span> </div><div class="step"> <span>NDA SENT</span> </div><div class="step"> <span>OPERATIONS MEETING</span> </div><div class="step"> <span>SALES MEETING</span> </div><div class="step"> <span>FINANCE MEETING</span> </div><div class="step"> <span>EOI & DEPOSIT</span> </div><div class="step"> <span>INTERVIEW</span> </div><div class="step"> <span>WON</span> </div></div>';
      } else if (salesStage == 4) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="stageNewLead" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>NEW LEAD</b></a></span> </div><div class="step current"> <span>QUALIFIED LEAD - NO TERRITORY</span> </div><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="stageOpportunity" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>OPPORTUNITY</b></a></span> </div><div class="step"> <span>IM SENT</span> </div><div class="step"> <span>NDA SENT</span> </div><div class="step"> <span>OPERATIONS MEETING</span> </div><div class="step"> <span>SALES MEETING</span> </div><div class="step"> <span>FINANCE MEETING</span> </div><div class="step"> <span>EOI & DEPOSIT</span> </div><div class="step"> <span>INTERVIEW</span> </div><div class="step"> <span>WON</span> </div></div>';
      } else if (salesStage == 5) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>NEW LEAD</span> </div><div class="step "> <span><a data-id="' +
          zeeleadid +
          '" class="stageQualified" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>QUALIFIED LEAD</b></a></span> </div><div class="step current"> <span>OPPORTUNITY</span> </div><div class="step"><span>IM SENT</span></div><div class="step"> <span>NDA SENT</span> </div><div class="step"> <span>OPERATIONS MEETING</span> </div><div class="step"> <span>SALES MEETING</span> </div><div class="step"> <span>FINANCE MEETING</span> </div><div class="step"> <span>EOI & DEPOSIT</span> </div><div class="step"> <span>INTERVIEW</span> </div><div class="step"> <span>WON</span> </div></div>';
      } else if (salesStage == 6) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>NEW LEAD</span> </div><div class="step "> <span><a data-id="' +
          zeeleadid +
          '" class="stageQualified" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>QUALIFIED LEAD</b></a></span> </div><div class="step current"> <span>OPPORTUNITY - DENIED</span> </div><div class="step"> <span>IM SENT</span> </div><div class="step"> <span>EOI APPROVED - MICHAEL</span> </div><div class="step"> <span>EOI APPROVED - CHRIS</span> </div><div class="step"> <span>UPLOAD SIGNED EOI</span> </div><div class="step"> <span>FINANCIALS</span> </div><div class="step"> <span>PRESENTATION</span> </div><div class="step"> <span>INTERVIEW</span> </div><div class="step"> <span>WON</span> </div></div>';
      } else if (salesStage == 7) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>NEW LEAD</span> </div><div class="step "> <span>QUALIFIED LEAD</span> </div><div class="step"> <span>OPPORTUNITY</span> </div><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="stageIMSent" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>IM SENT</b></a></span> </div><div class="step current"> <span><b>NDA SENT</b></span> </div><div class="step"> <span>OPERATIONS MEETING</span> </div><div class="step"> <span>SALES MEETING</span> </div><div class="step"> <span>FINANCE MEETING</span> </div><div class="step"> <span>EOI & DEPOSIT</span> </div><div class="step"> <span>INTERVIEW</span> </div><div class="step"> <span>WON</span> </div></div>';
      } else if (salesStage == 13) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>NEW LEAD</span> </div><div class="step "> <span>QUALIFIED LEAD</span> </div><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="stageOpportunity" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>OPPORTUNITY</b></a></span> </div><div class="step current"> <span>IM SENT</span> </div><div class="step"> <span>NDA SENT</span> </div><div class="step"> <span>OPERATIONS MEETING</span> </div><div class="step"> <span>SALES MEETING</span> </div><div class="step"> <span>FINANCE MEETING</span> </div><div class="step"> <span>EOI & DEPOSIT</span> </div><div class="step"> <span>INTERVIEW</span> </div><div class="step"> <span>WON</span> </div></div>';
      } else if (salesStage == 8) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>NEW LEAD</span> </div><div class="step "> <span>QUALIFIED LEAD</span> </div><div class="step"> <span>OPPORTUNITY</span> </div><div class="step"> <span>IM SENT</span> </div><div class="step"> <span>NDA SENT</span> </div><div class="step current"> <span>OPERATIONS MEETING</span> </div><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="salesMeeting" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>SALES MEETING</b></a></span> </div><div class="step"> <span>FINANCE MEETING</span> </div><div class="step"> <span>EOI & DEPOSIT</span> </div><div class="step"> <span>INTERVIEW</span> </div><div class="step"> <span>WON</span> </div></div>';
      } else if (salesStage == 9) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>NEW LEAD</span> </div><div class="step "> <span>QUALIFIED LEAD</span> </div><div class="step"> <span>OPPORTUNITY</span> </div><div class="step"> <span>IM SENT</span> </div><div class="step"> <span>NDA SENT</span> </div><div class="step"> <span>OPERATIONS MEETING</span> </div><div class="step"> <span>SALES MEETING</span> </div><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="financeMeeting" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>FINANCE MEETING</b></a></span> </div><div class="step current"> <span>EOI & DEPOSIT</span> </div><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="interview" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>INTERVIEW</b></a></span> </div><div class="step"> <span>WON</span> </div></div>';
      } else if (salesStage == 10) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>NEW LEAD</span> </div><div class="step "> <span>QUALIFIED LEAD</span> </div><div class="step"> <span>OPPORTUNITY</span> </div><div class="step"> <span>IM SENT</span> </div><div class="step"> <span>NDA SENT</span> </div><div class="step"> <span>OPERATIONS MEETING</span> </div><div class="step"> <span>SALES MEETING</span> </div><div class="step current"> <span>FINANCE MEETING</span> </div><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="financeMeeting" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>EOI & DEPOSIT</b></a></span> </div><div class="step"> <span>INTERVIEW</span> </div><div class="step"> <span>WON</span> </div></div>';
      } else if (salesStage == 11) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>NEW LEAD</span> </div><div class="step "> <span>QUALIFIED LEAD</span> </div><div class="step"> <span>OPPORTUNITY</span> </div><div class="step"> <span>IM SENT</span> </div><div class="step"> <span>NDA SENT</span> </div><div class="step"> <span>OPERATIONS MEETING</span> </div><div class="step current"> <span>SALES MEETING</span> </div><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="financeMeeting" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>FINANCE MEETING</b></a></span> </div><div class="step"> <span>EOI & DEPOSIT</span> </div><div class="step"> <span>INTERVIEW</span> </div><div class="step"> <span>WON</span> </div></div>';
      } else if (salesStage == 12) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>NEW LEAD</span> </div><div class="step "> <span>QUALIFIED LEAD</span> </div><div class="step"> <span>OPPORTUNITY</span> </div><div class="step"> <span>IM SENT</span> </div><div class="step"> <span>NDA SENT</span> </div><div class="step"> <span>OPERATIONS MEETING</span> </div><div class="step"> <span>SALES MEETING</span> </div><div class="step"> <span>FINANCE MEETING</span> </div><div class="step"> <span>EOI & DEPOSIT</span> </div><div class="step current"> <span>INTERVIEW</span> </div><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="leadWon" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>WON</b></a></span> </div></div>';
      } else if (salesStage == 14) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>NEW LEAD</span> </div><div class="step "> <span>QUALIFIED LEAD</span> </div><div class="step"> <span>OPPORTUNITY</span> </div><div class="step"> <span>IM SENT</span> </div><div class="step"> <span>NDA SENT</span> </div><div class="step"> <span>OPERATIONS MEETING</span> </div><div class="step"> <span>SALES MEETING</span> </div><div class="step"> <span>FINANCE MEETING</span> </div><div class="step"> <span>EOI & DEPOSIT</span> </div><div class="step"> <span>INTERVIEW</span> </div><div class="step current"> <span>WON</span> </div></div>';
      } else {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step current"> <span>NEW LEAD</span> </div><div class="step"> <span>QUALIFIED LEAD</span> </div><div class="step"> <span>OPPORTUNITY</span> </div><div class="step"> <span>IM SENT</span> </div><div class="step"> <span>EOI APPROVED - MICHAEL</span> </div><div class="step"> <span>EOI APPROVED - CHRIS</span> </div><div class="step"> <span>UPLOAD SIGNED EOI</span> </div><div class="step"> <span>FINANCIALS</span> </div><div class="step"> <span>PRESENTATION</span> </div><div class="step"> <span>INTERVIEW</span> </div><div class="step"> <span>WON</span> </div></div>';
      }

      // inlineHtml += '<div class="nav clearfix" style="margin-top: 10px !important;"><a href="#" class="prev btn btn-sm btn-info" style="border-radius: 15px !important;background-color: #103D39;border-color: transparent;">Previous Stage</a><a href="#" class="next pull-right btn btn-sm btn-info" style="border-radius: 15px !important;background-color: #103D39;border-color: transparent;">Next Stage</a></div></div></div>'

      inlineHtml += '</div></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    /*
     * PURPOSE : HTML code to generate the Modal Pop-up
     *  PARAMS :  -
     * RETURNS : HTML
     *   NOTES :
     */
    function lostZeeLeadModal() {

      var inlineHtml =
        '<div id="myModal" class="modal" style="display: none; position: fixed; z-index: 1; padding-top: 100px;left: 0;top: 0;width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); "><div class="modal-content" style="position: absolute;transform: translate(-50%, -50%);background-color: #fefefe;/* margin: auto; *//* padding: 0; */border: 1px solid #888;/* width: 80%; */left: 50%;top: 50%;/* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); */-webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 0.4s;"><div class="modal-header" style="padding: 2px 16px;text-align: center;"><span class="close" style="color: black;float: right;font-size: 28px;font-weight: bold;"">&times;</span><h3 class="modal-title" id="modal-title">Franchisee Lead Lost</h3></div>';

      inlineHtml +=
        '<div class="modal-body" style="padding: 2px 16px;">';
      inlineHtml +=
        '<div class="form-group container zee_lead_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-4 zee_lead"><input type="text" id="zeeleadid" value="' +
        zeeleadid +
        '" hidden/><div class="input-group reason_input_group"><span class="input-group-addon" id="reason_text">REASON </span><select id="lostReason" class="form-control lostReason">';
      inlineHtml +=
        '<option value=0></option><option value=1>Price</option><option value=2>Finance</option><option value=3 selected>Location</option><option value=4>Not a lead</option><option value=5>No Response</option><option value=6>Unsuitable candidate</option>';

      inlineHtml += '</select></div></div>';
      inlineHtml += '</div></div>';

      inlineHtml +=
        '</div><div class="modal-footer" style="padding: 2px 16px;"><input type="button" value="LEAD LOST" class="form-control btn-danger" id="leadLost" style="" /></div></div></div>';

      return inlineHtml;

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

      if (eoiSent == 1 || eoiSent == '1') {
        var disableEOIButton = 'disabled';
        var eoiButtonLabel = 'EOI SENT'
        var eoiButtonClass = 'btn-light'
      } else {
        var disableEOIButton = '';
        var eoiButtonLabel = 'SEND EOI';
        var eoiButtonClass = 'btn-info'
      }

      if (imSent == 1 || imSent == '1') {
        var disableIMButton = 'disabled';
        var imButtonLabel = 'IM SENT'
        var imButtonClass = 'btn-light'
      } else {
        var disableIMButton = '';
        var imButtonLabel = 'SEND IM';
        var imButtonClass = 'btn-info'
      }

      if (ndaSent == 1 || ndaSent == '1') {
        var disableNDAButton = 'disabled';
        var ndaButtonLabel = 'NDA SENT'
        var ndaButtonClass = 'btn-light'
      } else {
        var disableNDAButton = '';
        var ndaButtonLabel = 'SEND NDA';
        var ndaButtonClass = 'btn-info'
      }

      var inlineHtml = ''
      inlineHtml +=
        '<div class="form-group container zee_available_buttons_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 saveZeeLead"><input type="button" value="SAVE" class="form-control btn btn-primary" id="saveZeeLead" /></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      if (!isNullorEmpty(zeeleadid)) {
        inlineHtml +=
          '<div class="form-group container zee_available_buttons_section">';
        inlineHtml += '<div class="row">';
        if (salesStage == 2) {
          inlineHtml +=
            '<div class="col-xs-6 zeeNoTerritory"><input type="button" value="NO TERRITORY" class="form-control btn btn-warning" id="zeeNoTerritory" data-id="' +
            zeeleadid + '"/></div>'
          inlineHtml +=
            '<div class="col-xs-6 zeeLeadLost"><input type="button" value="LEAD LOST" class="form-control btn btn-danger" id="zeeLeadLost" data-id="' +
            zeeleadid + '" /></div>'

        } else if (salesStage == 5) {
          // inlineHtml +=
          //   '<div class="col-xs-4 sendEOI"><input type="button" value="' +
          //   eoiButtonLabel + '" class="form-control btn ' + eoiButtonClass +
          //   '" id="sendEOI" data-id="' +
          //   zeeleadid + '" ' + disableEOIButton + '/></div>'
          inlineHtml +=
            '<div class="col-xs-4 sendIM"><input type="button" value="' +
            imButtonLabel + '" class="form-control btn ' + imButtonClass +
            '" id="sendIM" data-id="' +
            zeeleadid + '" ' + disableIMButton + '/></div>'
          inlineHtml +=
            '<div class="col-xs-4 opportunityDenied"><input type="button" value="OPPORTUNITY DENIED" class="form-control btn btn-danger" id="opportunityDenied" data-id="' +
            zeeleadid + '"/></div>'
          inlineHtml +=
            '<div class="col-xs-4 zeeLeadLost"><input type="button" value="LEAD LOST" class="form-control btn btn-danger" id="zeeLeadLost" data-id="' +
            zeeleadid + '"/></div>'
        } else if (salesStage == 13) {
          inlineHtml +=
            '<div class="col-xs-6 sendNDA"><input type="button" value="SEND NDA" class="form-control btn btn-info" id="sendNDA" data-id="' +
            zeeleadid + '" /></div>'
          inlineHtml +=
            '<div class="col-xs-6 zeeLeadLost"><input type="button" value="LEAD LOST" class="form-control btn btn-danger" id="zeeLeadLost" data-id="' +
            zeeleadid + '"/></div>'
        } else if (salesStage == 7) {
          inlineHtml +=
            '<div class="col-xs-6 uploadNDA"><input type="button" value="UPLOAD SIGNED NDA" class="form-control btn btn-info" id="uploadNDA" data-id="' +
            zeeleadid + '" /></div>'
          inlineHtml +=
            '<div class="col-xs-6 zeeLeadLost"><input type="button" value="LEAD LOST" class="form-control btn btn-danger" id="zeeLeadLost" data-id="' +
            zeeleadid + '"/></div>'
        } else if (salesStage == 10) {
          if (eoiSent == 1) {
            inlineHtml +=
              '<div class="col-xs-3 sendEOI"><input type="button" value="' +
              eoiButtonLabel + '" class="form-control btn ' + eoiButtonClass +
              '" id="sendEOI" data-id="' +
              zeeleadid + '" ' + disableEOIButton + '/></div>';
            inlineHtml +=
              '<div class="col-xs-3 uploadEOI"><input type="button" value="UPLOAD EOI" class="form-control btn btn-info" id="uploadEOI" data-id="' +
              zeeleadid + '" /></div>';
          } else {
            inlineHtml +=
              '<div class="col-xs-6 sendEOI"><input type="button" value="' +
              eoiButtonLabel + '" class="form-control btn ' + eoiButtonClass +
              '" id="sendEOI" data-id="' +
              zeeleadid + '" ' + disableEOIButton + '/></div>';
          }

          inlineHtml +=
            '<div class="col-xs-6 zeeLeadLost"><input type="button" value="LEAD LOST" class="form-control btn btn-danger" id="zeeLeadLost" data-id="' +
            zeeleadid + '"/></div>'
        } else {
          inlineHtml +=
            '<div class="col-xs-12 zeeLeadLost"><input type="button" value="LEAD LOST" class="form-control btn btn-danger" id="zeeLeadLost" data-id="' +
            zeeleadid + '"/></div>'
        }

        inlineHtml += '</div>';
        inlineHtml += '</div>';
      }


      return inlineHtml
    }

    function presalesDetails() {

      if (salesStage != 1 && salesStage != 2) {
        var display_div = '';

        var zeeSalesLeadRecord = record.load({
          type: record.Type.PARTNER,
          id: interestedZees
        });

        var lowPrice = zeeSalesLeadRecord.getValue({
          fieldId: 'custentity_low_price'
        });
        var highPrice = zeeSalesLeadRecord.getValue({
          fieldId: 'custentity_high_price'
        });
        var nabAccreditation = zeeSalesLeadRecord.getValue({
          fieldId: 'custentity_nab_accreditation'
        });
        var nabAccreditationFee = zeeSalesLeadRecord.getValue({
          fieldId: 'custentity_nab_accreditation_fee'
        });
        var salesCommission = zeeSalesLeadRecord.getValue({
          fieldId: 'custentity_sales_commission'
        });
        var serviceRevenue = zeeSalesLeadRecord.getValue({
          fieldId: 'custentity_service_revenue'
        });
        var serviceRevenueYear = zeeSalesLeadRecord.getValue({
          fieldId: 'custentity_service_revenue_year'
        });
        var mpexRevenue = zeeSalesLeadRecord.getValue({
          fieldId: 'custentity_mpex_revenue'
        });
        var mpexRevenueYear = zeeSalesLeadRecord.getValue({
          fieldId: 'custentitympex_revenue_year'
        });
        var sendleRevenue = zeeSalesLeadRecord.getValue({
          fieldId: 'custentity_sendle_revenue'
        });
        var sendleRevenueYear = zeeSalesLeadRecord.getValue({
          fieldId: 'custentity_sendle_revenue_year'
        });
        var finalPurchasePrice = zeeSalesLeadRecord.getValue({
          fieldId: 'custentity_final_sale_price'
        });
        var territoryMapDoc = zeeSalesLeadRecord.getValue({
          fieldId: 'custentity_territory_map_doc'
        });

        if (!isNullorEmpty(territoryMapDoc)) {
          var fileObj = file.load({
            id: territoryMapDoc
          });

          territoryMapURL = fileObj.url;

          fileObj.isonline = true;

          fileObj.save();

          zeeSalesLeadRecord.setValue({
            fieldId: 'custentity_territory_map',
            value: territoryMapURL
          });
          zeeSalesLeadRecord.save();
        }



        var searchZeeAgreements = search.load({
          id: 'customsearch_zee_agreements_listed_for_s',
          type: 'customrecord_fr_agreements'
        });

        var new_filter = search.createFilter({
          name: 'internalid',
          join: 'custrecord_fr_agreement_franchisee',
          operator: 'anyof',
          values: interestedZees,
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

          return true;
        });



      } else {
        var display_div = 'hide'
      }

      var inlineHtml =
        '<div class="presales_div ' + display_div +
        '"><div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">PRESALES DETAILS & IM DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      var formattedCommencementDate = '';
      var formattedExpiryDate = '';
      var formattedUltimateExpiryDate = '';

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

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 name_section"><div class="input-group"><span class="input-group-addon">TRADING ENTITY <span class="mandatory">*</span></span><input id="tradingEntity" class="form-control tradingEntity" value="' +
        tradingEntity + '" readonly/></div></div>';

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


      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      if (!isNullorEmpty(lowPrice)) {
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">LOW PRICE ($) </span><input id="lowPrice" class="form-control lowPrice" value="' +
          lowPrice.toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g, "$&,") + '" readonly/></div></div>';
      } else {
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">LOW PRICE ($) </span><input id="lowPrice" class="form-control lowPrice" value="' +
          lowPrice + '" readonly/></div></div>';
      }
      if (!isNullorEmpty(highPrice)) {
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">HIGH PRICE ($) </span><input id="highPrice" class="form-control highPrice" value="' +
          highPrice.toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g, "$&,") + '" readonly/></div></div>';
      } else {
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">HIGH PRICE ($) </span><input id="highPrice" class="form-control highPrice" value="' +
          highPrice + '" readonly/></div></div>';
      }

      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      if (!isNullorEmpty(serviceRevenue)) {
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">SERVICE REVENUE ($) </span><input id="serviceRevenue" class="form-control serviceRevenue" value="' +
          serviceRevenue.toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g, "$&,") + '" /></div></div>';
      } else {
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">SERVICE REVENUE ($) </span><input id="serviceRevenue" class="form-control serviceRevenue" value="' +
          serviceRevenue + '" /></div></div>';
      }

      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">YEAR</span><input id="serviceRevenueYear" class="form-control serviceRevenueYear" value="' +
        serviceRevenueYear + '" /></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';
      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      if (!isNullorEmpty(mpexRevenue)) {
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">MPEX REVENUE ($) </span><input id="mpexRevenue" class="form-control mpexRevenue" value="' +
          mpexRevenue.toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g, "$&,") + '" /></div></div>';
      } else {
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">MPEX REVENUE ($) </span><input id="mpexRevenue" class="form-control mpexRevenue" value="' +
          mpexRevenue + '" /></div></div>';
      }

      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">YEAR</span><input id="mpexRevenueYear" class="form-control mpexRevenueYear" value="' +
        mpexRevenueYear + '" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      if (!isNullorEmpty(sendleRevenue)) {
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">SENDLE REVENUE ($) </span><input id="sendleRevenue" class="form-control sendleRevenue" value="' +
          sendleRevenue.toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g, "$&,") + '" /></div></div>';
      } else {
        inlineHtml +=
          '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">SENDLE REVENUE ($) </span><input id="sendleRevenue" class="form-control sendleRevenue" value="' +
          sendleRevenue + '" /></div></div>';
      }

      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">YEAR</span><input id="sendleRevenueYear" class="form-control sendleRevenueYear" value="' +
        sendleRevenueYear + '" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">SALES COMMISSION ($) </span><input id="salesCommission" class="form-control salesCommission" value="' +
        salesCommission + '" readonly/></div></div>';
      inlineHtml +=
        '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">NAB ACCREDITATION</span><select id="nabAccreditation" class="form-control nabAccreditation" readonly>';
      if (nabAccreditation == 1) {
        inlineHtml +=
          '<option value="1" selected>Yes</option><option value="2">No</option>';
      } else {
        inlineHtml +=
          '<option value="1" >Yes</option><option value="2" selected>No</option>';
      }


      inlineHtml += '</select></div></div>';
      if (!isNullorEmpty(nabAccreditationFee)) {
        inlineHtml +=
          '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">NAB ACCREDITATION FEE ($) </span><input id="nabAccreditationFee" class="form-control nabAccreditationFee" value="' +
          parseFloat(nabAccreditationFee).toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g, "$&,") + '" readonly/></div></div>';
      } else {
        inlineHtml +=
          '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">NAB ACCREDITATION FEE ($) </span><input id="nabAccreditationFee" class="form-control nabAccreditationFee" value="' +
          nabAccreditationFee + '" readonly/></div></div>';
      }


      inlineHtml += '</div></div>';
      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      if (!isNullorEmpty(finalPurchasePrice)) {
        inlineHtml +=
          '<div class="col-xs-12 name_section"><div class="input-group"><span class="input-group-addon">SALE PRICE ($) </span><input id="finalPurchasePrice" class="form-control finalPurchasePrice" value="' +
          finalPurchasePrice + '" readonly/></div></div>';
      } else {
        inlineHtml +=
          '<div class="col-xs-12 name_section"><div class="input-group"><span class="input-group-addon">SALE PRICE ($) </span><input id="finalPurchasePrice" class="form-control finalPurchasePrice" value="' +
          finalPurchasePrice + '" readonly/></div></div>';
      }

      inlineHtml += '</div>';
      inlineHtml += '</div>';

      if (!isNullorEmpty(territoryMapURL)) {
        var fullURL = baseURL + territoryMapURL;
        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-12 editPresales"><div class="input-group"><span class="input-group-addon">TERRITORY MAP URL </span><input type="" value="' +
          fullURL +
          '" class="form-control" id="" readonly/></div></div>'
        inlineHtml += '</div>';
        inlineHtml += '</div>';

        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';

        inlineHtml +=
          '<div class="col-xs-2"></div>';
        inlineHtml +=
          '<div class="col-xs-8" style="text-align: center;"><img id="viewer" src="' +
          territoryMapURL + '" style="width: 100%; height: 100%;"/><div>';
        inlineHtml +=
          '<div class="col-xs-2"></div>';
        inlineHtml += '</div>';
        inlineHtml += '</div>';
      }

      inlineHtml += '</div>';


      return inlineHtml

    }

    /*
     * PURPOSE : FIELDS THAT NEEDS TO BE FILLED TO GET THE NDA PREFILLED
     *  PARAMS :  -
     * RETURNS :  INLINEHTML
     *   NOTES :
     */

    function prefillNDASection() {

      if (!isNullorEmpty(zeeleadid) && salesStage != 1 && salesStage != 2 &&
        salesStage != 5) {
        var display_div = '';
      } else {
        var display_div = 'hide';
      }

      var inlineHtml =
        '<div class="' + display_div + '">';
      inlineHtml +=
        '<div class="form-group container ' + display_div + '">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">PREFILL NDA DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">TRADING ENTITY NAME <span class="mandatory">*</span></span><input id="tradingEntityName" class="form-control tradingEntityName" type="" value="' +
        tradingEntityName + '"/></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 name_section"><div class="input-group"><span class="input-group-addon">ACN </span><input id="acn" class="form-control acn" type="" value="' +
        acn + '" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 name_section"><div class="input-group"><span class="input-group-addon">ABN </span><input id="abn" class="form-control abn" type="" value="' +
        abn + '" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container row_address1 ">'
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 address1_section"><div class="input-group"><span class="input-group-addon">UNIT/LEVEL/SUITE</span><input id="ndaaddress1" class="form-control ndaaddress1" value="' +
        ndaaddress1 + '" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 ndaaddress2_section"><div class="input-group"><span class="input-group-addon">STREET NO. & NAME <span class="mandatory">*</span></span><input id="ndaaddress2" class="form-control ndaaddress2" value="' +
        ndaaddress2 + '"/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container city_state_postcode ">'
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6"><div class="input-group"><span class="input-group-addon">SUBURB</span><input id="ndacity" readonly class="form-control ndacity" value="' +
        ndasuburb + '"/></div></div>';
      inlineHtml +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">STATE</span><input id="ndastate" readonly class="form-control ndastate" value="' +
        ndastate + '"/></div></div>';

      inlineHtml +=
        '<div class="col-xs-3 ndapost_code_section"><div class="input-group"><span class="input-group-addon">POSTCODE</span><input id="ndapostcode" readonly class="form-control ndapostcode" value="' +
        ndapostcode + '"/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml;
    }

    /*
     * PURPOSE : FRANCHISE MAIN DETAILS TAB
     *  PARAMS : ZEE ID
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function zeeSalesMainLead() {

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
        '<div class="col-xs-3 name_section"><div class="input-group"><span class="input-group-addon">FIRST NAME <span class="mandatory">*</span></span><input id="firstName" class="form-control firstName" value="' +
        firstName + '" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 name_section"><div class="input-group"><span class="input-group-addon">LAST NAME <span class="mandatory">*</span></span><input id="lastName" data-old="' +
        lastName + '" class="form-control lastName" value="' +
        lastName + '" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 name_section"><div class="input-group"><span class="input-group-addon">MOBILE <span class="mandatory">*</span></span><input id="mobile" class="form-control mobile" value="' +
        mobile + '" data-old="' + mobile +
        '"/></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 name_section"><div class="input-group"><span class="input-group-addon">EMAIL<span class="mandatory">*</span></span><input id="email" class="form-control email" value="' +
        email + '" data-old="' + email +
        '"/></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';



      return inlineHtml

    }

    /*
     * PURPOSE : AREAS OF INTEREST SECTION
     *  PARAMS : -
     * RETURNS : INLINE HTML
     *   NOTES :
     */
    function areasOfInterestSection() {

      if (franchiseeTypeOfOwner != 4) {
        var defaultHideClass = 'hide';
      } else {
        var defaultHideClass = ''
      }

      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 areas_section "><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">AREAS OF INTEREST DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container row_address1">'
      inlineHtml += '<div class="row">';
      inlineHtml += '<input id="internalid" value="" type="hidden"/>'
      inlineHtml +=
        '<div class="col-xs-6 address2_section"><div class="input-group"><span class="input-group-addon">AREA OF INTEREST - SUBURB <span class="mandatory">*</span></span><input id="address2" class="form-control address2" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container city_state_postcode">'
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6"><div class="input-group"><span class="input-group-addon">SUBURB</span><input id="city" readonly class="form-control city" value="' +
        suburb + '"/></div></div>';
      inlineHtml +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">STATE</span><input id="state" readonly class="form-control state" value="' +
        state + '"/></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 post_code_section"><div class="input-group"><span class="input-group-addon">POSTCODE</span><input id="postcode" readonly class="form-control postcode" value="' +
        postcode + '"/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    /*
     * PURPOSE : POTENTIAL FRANCHISEES LEAD INTERESTED IN SECTION
     *  PARAMS : -
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function potentialZeesSection() {

      if (franchiseeTypeOfOwner != 4) {
        var defaultHideClass = '';
      } else {
        var defaultHideClass = 'hide'
      }

      if (salesStage >= 13) {
        var readonlyField = 'readonly';
      } else {
        var readonlyField = ''
      }

      //NetSuite Search: Interested Franchisees - Franchisees
      var searchZees = search.load({
        id: 'customsearch_zee_management_console_ze_2',
        type: 'partner'
      });

      var resultSetZees = searchZees.run();

      //NetSuite Search: Franchisees Listed for Sales
      var searchListedZees = search.load({
        id: 'customsearch_zee_listed_for_sales',
        type: 'partner'
      });

      var resultSetZeesListed = searchListedZees.run();

      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 potentialZees_section ' + defaultHideClass +
        '"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">POTENTIAL FRANCHISEES</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      // inlineHtml +=
      //   '<div class="col-xs-4 zee_section ' + defaultHideClass +
      //   '"><div class="input-group"><span class="input-group-addon" id="zee_text">TERRITORIES OF INTEREST </span><select id="zeeList" class="form-control ui fluid search dropdown zeeList" data-old="" json="" multiple="" style="font-size: 12px;"><option value=0></option>';
      //
      // resultSetZees.each(function(searchResultZees) {
      //   zeeId = searchResultZees.getValue('internalid');
      //   franchiseeName = searchResultZees.getValue('companyname');
      //   franchiseeListedForSale = searchResultZees.getValue(
      //     'custentity_listed_for_sale');
      //
      //   var indexValue = interestedZees.indexOf(zeeId);
      //
      //   if (indexValue != -1) {
      //     inlineHtml += '<option value=' + zeeId + ' selected>' +
      //       franchiseeName + '</option>';
      //   } else {
      //     inlineHtml += '<option value=' + zeeId + '>' + franchiseeName +
      //       '</option>';
      //   }
      //
      //
      //
      //   return true;
      // });
      //
      // inlineHtml += '</select></div></div>';
      inlineHtml +=
        '<div class="col-xs-8 zeeListedSale_section ' + defaultHideClass +
        '"><div class="input-group"><span class="input-group-addon" id="zeeListedSale_text">TERRITORIES AVAILABLE </span><select id="zeeListedSale" class="form-control ui fluid search dropdown zeeListedSale" data-old="" json="" style="font-size: 12px" ' +
        readonlyField + '><option value=0></option>';

      resultSetZeesListed.each(function(searchResultZeesListed) {
        zeeId = searchResultZeesListed.getValue('internalid');
        franchiseeName = searchResultZeesListed.getValue('companyname');

        var indexValue = interestedZees.indexOf(zeeId);

        if (indexValue != -1) {
          inlineHtml += '<option value=' + zeeId + ' selected>' +
            franchiseeName + '</option>';
        } else {
          inlineHtml += '<option value=' + zeeId + '>' + franchiseeName +
            '</option>';
        }

        return true;
      });

      inlineHtml += '</select></div></div>';
      inlineHtml +=
        '<div class="col-xs-4 listforSale"><input type="button" value="LIST FRANCHISEES FOR SALE" class="form-control btn btn-primary" id="listforSale" /></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml

    }

    /*
     * PURPOSE : OPERATION DETAILS SECTION
     *  PARAMS : -
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function operationsSection() {

      if (franchiseeTypeOfOwner != 4) {
        var defaultHideClass = 'col-xs-6 hide';
        var defaultColSpan = 'col-xs-12'
      } else {
        var defaultHideClass = 'col-xs-6'
        var defaultColSpan = 'col-xs-6'
      }

      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">OPERATIONAL DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="' + defaultColSpan +
        ' franchiseeTypeOfOwner_section"><div class="input-group"><span class="input-group-addon" id="franchiseeTypeOfOwner_text">TYPE OF OWNER <span class="mandatory">*</span></span><select id="franchiseeTypeOfOwner" class="form-control franchiseeTypeOfOwner" data-old="' +
        franchiseeTypeOfOwner + '">';
      if (franchiseeTypeOfOwner == 0 || isNullorEmpty(franchiseeTypeOfOwner)) {
        inlineHtml +=
          '<option value=0></option><option value=4>Seeking Employment</option><option value=2>Investor</option><option value=3>Owner / Operator</option>';
      } else if (franchiseeTypeOfOwner == 4) {
        inlineHtml +=
          '<option value=0></option><option value=4 selected>Seeking Employment</option><option value=2>Investor</option><option value=3>Owner / Operator</option>';
      } else if (franchiseeTypeOfOwner == 2) {
        inlineHtml +=
          '<option value=0></option><option value=4>Seeking Employment</option><option value=2 selected>Investor</option><option value=3>Owner / Operator</option>';
      } else if (franchiseeTypeOfOwner == 3) {
        inlineHtml +=
          '<option value=0></option><option value=4>Seeking Employment</option><option value=2>Investor</option><option value=3 selected>Owner / Operator</option>';
      }

      inlineHtml += '</select></div></div>';
      inlineHtml +=
        '<div class="' + defaultHideClass +
        ' employment_section"><div class="input-group"><span class="input-group-addon">TYPE OF EMPLOYMENT </span><select id="employment" class="form-control employment" data-old="' +
        employment + '">';
      if (employment == 0 || isNullorEmpty(employment)) {
        inlineHtml +=
          '<option value=0></option><option value=1>Full-Time</option><option value=2>Part-Time</option><option value=3>Contract</option><option value=4>Casual</option>';
      } else if (employment == 1) {
        inlineHtml +=
          '<option value=0></option><option value=1 selected>Full-Time</option><option value=2>Part-Time</option><option value=3>Contract</option><option value=4>Casual</option>';
      } else if (employment == 2) {
        inlineHtml +=
          '<option value=0></option><option value=1>Full-Time</option><option value=2 selected>Part-Time</option><option value=3>Contract</option><option value=4>Casual</option>';
      } else if (employment == 3) {
        inlineHtml +=
          '<option value=0></option><option value=1>Full-Time</option><option value=2>Part-Time</option><option value=3 selected>Contract</option><option value=4>Casual</option>';
      } else if (employment == 4) {
        inlineHtml +=
          '<option value=0></option><option value=1>Full-Time</option><option value=2>Part-Time</option><option value=3>Contract</option><option value=4 selected>Casual</option>';
      }
      inlineHtml += '</select></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      if (franchiseeTypeOfOwner != 2) {
        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';

        inlineHtml +=
          '<div class=" vehicle_section"><div class="input-group"><span class="input-group-addon">OWN A VEHICLE? </span><select id="vehicle" class="form-control vehicle" data-old="' +
          vehicle + '">';
        if (vehicle == 0 || isNullorEmpty(vehicle)) {
          inlineHtml +=
            '<option value=0></option><option value=1>Yes</option><option value=2>No</option>';
        } else if (vehicle == 1) {
          inlineHtml +=
            '<option value=0></option><option value=1 selected>Yes</option><option value=2>No</option>';
        } else if (vehicle == 2) {
          inlineHtml +=
            '<option value=0></option><option value=1>Yes</option><option value=2 selected>No</option>';
        }
        inlineHtml += '</select></div></div>';
        inlineHtml += '</div>';
        inlineHtml += '</div>';
      }
      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="' + defaultColSpan +
        ' experience_section"><div class="input-group"><span class="input-group-addon">YEARS OF EXPERIENCE </span><select id="experience" class="form-control experience" data-old="' +
        experience + '">';
      if (experience == 0 || isNullorEmpty(experience)) {
        inlineHtml +=
          '<option value=0></option><option value=1>0-1 Years</option><option value=2>1-3 Years</option><option value=3>3-5 Years</option><option value=4>5+ Years</option>';
      } else if (experience == 1) {
        inlineHtml +=
          '<option value=0></option><option value=1 selected>0-1 Years</option><option value=2>1-3 Years</option><option value=3>3-5 Years</option><option value=4>5+ Years</option>';
      } else if (experience == 2) {
        inlineHtml +=
          '<option value=0></option><option value=1>0-1 Years</option><option value=2 selected>1-3 Years</option><option value=3>3-5 Years</option><option value=4>5+ Years</option>';
      } else if (experience == 3) {
        inlineHtml +=
          '<option value=0></option><option value=1>0-1 Years</option><option value=2>1-3 Years</option><option value=3 selected>3-5 Years</option><option value=4>5+ Years</option>';
      } else if (experience == 4) {
        inlineHtml +=
          '<option value=0></option><option value=1>0-1 Years</option><option value=2>1-3 Years</option><option value=3>3-5 Years</option><option value=4 selected>5+ Years</option>';
      }
      inlineHtml += '</select></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      if (salesStage == 12) {
        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        inlineHtml += '<div class="col-xs-6 reminder">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
          '<span class="input-group-addon" id="startDate_text">START DATE<span class="mandatory">*</span></span>';
        if (!isNullorEmpty(startDate)) {
          startDate = format.format({
            value: startDate,
            type: format.Type.DATE
          });
          var startDateArray = startDate.split('/');
          if (startDateArray[1] < 10) {
            startDateArray[1] = '0' + startDateArray[1];
          }
          if (startDateArray[0] < 10) {
            startDateArray[0] = '0' + startDateArray[0];
          }
          var formattedStartDate = startDateArray[2] + '-' + startDateArray[1] +
            '-' + startDateArray[0];

          inlineHtml +=
            '<input id="startDate" class="form-control startDate" type="date" value="' +
            formattedStartDate + '"/>';
        } else {
          inlineHtml +=
            '<input id="startDate" class="form-control startDate" type="date" />';
        }
        inlineHtml += '</div>';
        inlineHtml += '</div>';
        inlineHtml += '</div>';
        inlineHtml += '</div>';
      }


      return inlineHtml
    }

    /*
     * PURPOSE : SALES WF DATES BASED ON CHANGES IN STAGES
     *  PARAMS : -
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function salesWFDateDetails() {
      var inlineHtml =
        '<div class="form-group container ">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">SALES WORKFLOW DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE ENTERED </span><input id="dateEntered" class="form-control dateEntered" value="' +
        dateEntered + '" readonly/></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE LEAD LOST </span><input id="dateLost" class="form-control dateLost" value="' +
        dateLost + '" readonly/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE QUALIFIED </span><input id="dateQualified" class="form-control dateQualified" value="' +
        dateQualified + '" readonly/></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE QUALIFIED NO TERRITORY </span><input id="dateQualifiedNoTerritory" class="form-control dateQualifiedNoTerritory" value="' +
        dateQualifiedNoTerritory + '" readonly/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';
      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE OPPORTUNITY </span><input id="dateOpportunity" class="form-control dateOpportunity" value="' +
        dateOpportunity + '" readonly/></div></div>';

      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE OPPORTUNITY DENIED </span><input id="dateOpportunityDenied" class="form-control dateOpportunityDenied" value="' +
        dateOpportunityDenied + '" readonly/></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE OPERATIONS MEETING </span><input id="dateOpportunity" class="form-control dateOpportunity" value="' +
        dateEOIMichaelApproved + '" readonly/></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE SALES MEETING </span><input id="dateOpportunity" class="form-control dateOpportunity" value="' +
        dateEOIChrisApproved + '" readonly/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';

      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE FINANCE STAGE </span><input id="dateOpportunity" class="form-control dateOpportunity" value="' +
        dateFinanceStage + '" readonly/></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    /*
     * PURPOSE : FINANCE SECTION
     *  PARAMS : -
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function financeSection() {
      if (franchiseeTypeOfOwner != 4) {
        var defaultHideClass = '';
      } else {
        var defaultHideClass = 'hide'
      }
      var inlineHtml =
        '<div class="form-group container finance_main_section ' +
        defaultHideClass + '">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">FINANCIALS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 finance_section ' + defaultHideClass +
        '"><div class="input-group"><span class="input-group-addon" id="finance_text">FINANCE REQUIRED </span><select id="finance" class="form-control finance" data-old="' +
        finance + '">';
      if (finance == 0 || isNullorEmpty(finance)) {
        inlineHtml +=
          '<option value=0></option><option value=1>Yes</option><option value=2>No</option>';
      } else if (finance == 1) {
        inlineHtml +=
          '<option value=0></option><option value=1 selected>Yes</option><option value=2>No</option>';
      } else if (finance == 2) {
        inlineHtml +=
          '<option value=0></option><option value=1>Yes</option><option value=2 selected>No</option>';
      }
      inlineHtml += '</select></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 investment_section ' + defaultHideClass +
        '"><div class="input-group"><span class="input-group-addon">INVESTMENT BRACKET </span><select id="investment" class="form-control investment" data-old="' +
        investment + '">';
      if (investment == 0 || isNullorEmpty(investment)) {
        inlineHtml +=
          '<option value=0></option><option value=1>< 100K</option><option value=2>100 - 200K</option><option value=3>200 - 300K</option><option value=4>300K ></option>';
      } else if (investment == 1) {
        inlineHtml +=
          '<option value=0></option><option value=1 selected>< 100K</option><option value=2>100 - 200K</option><option value=3>200 - 300K</option><option value=4>300K ></option>';
      } else if (investment == 2) {
        inlineHtml +=
          '<option value=0></option><option value=1>< 100K</option><option value=2 selected>100 - 200K</option><option value=3>200 - 300K</option><option value=4>300K ></option>';
      } else if (investment == 3) {
        '<option value=0></option><option value=1>< 100K</option><option value=2>100 - 200K</option><option value=3 selected>200 - 300K</option><option value=4>300K ></option>';
      } else if (investment == 4) {
        '<option value=0></option><option value=1>< 100K</option><option value=2>100 - 200K</option><option value=3>200 - 300K</option><option value=4 selected>300K ></option>';
      }
      inlineHtml += '</select></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      if (salesStage == 9 || salesStage == '9' || salesStage == 12 ||
        salesStage == '12' || salesStage == 14 || salesStage == '14') {
        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-3 sale_price_section"><div class="input-group"><span class="input-group-addon">DEPOSIT $: <span class="mandatory">*</span></span><input id="deposit" class="form-control deposit" value="' +
          deposit + '" /></div></div>';
        inlineHtml +=
          '<div class="col-xs-3 sale_price_section"><div class="input-group"><span class="input-group-addon">FINAL SALE PRICE $: <span class="mandatory">*</span></span><input id="salePrice" class="form-control salePrice" value="' +
          salePrice + '" /></div></div>';
        inlineHtml +=
          '<div class="col-xs-2 gst_section "><div class="input-group"><span class="input-group-addon" id="gst_text">INC GST <span class="mandatory">*</span></span><select id="incGST" class="form-control incGST" data-old="' +
          finance + '">';
        if (incGST == 0 || isNullorEmpty(incGST)) {
          inlineHtml +=
            '<option value=0></option><option value=1>Yes</option><option value=2>No</option>';
        } else if (incGST == 1) {
          inlineHtml +=
            '<option value=0></option><option value=1 selected>Yes</option><option value=2>No</option>';
        } else if (incGST == 2) {
          inlineHtml +=
            '<option value=0></option><option value=1>Yes</option><option value=2 selected>No</option>';
        }
        inlineHtml += '</select></div></div>';
        inlineHtml +=
          '<div class="col-xs-4 total_price_section"><div class="input-group"><span class="input-group-addon">TOTAL PRICE $: <span class="mandatory">*</span></span><input id="totalPrice" class="form-control totalPrice" value="' +
          totalSalePrice + '" disabled/></div></div>';
        inlineHtml += '</div>';
        inlineHtml += '</div>';

      }

      if (eoiFileId != 0) {
        inlineHtml += '<div class="form-group container">';
        inlineHtml += '<div class="row">';
        var fileObj = file.load({
          id: eoiFileId
        });
        inlineHtml +=
          '<div class="col-xs-2"></div>';
        inlineHtml +=
          '<div class="col-xs-8" style="text-align: center;"><iframe id="viewer" frameborder="0" scrolling="no" width="400" height="600" src="' +
          fileObj.url + '"></iframe></div>';
        inlineHtml +=
          '<div class="col-xs-2"></div>';
        inlineHtml += '</div>';
        inlineHtml += '</div>';
      }

      return inlineHtml

    }

    /*
     * PURPOSE : REMINDER AND COMMENTS SECTION
     *  PARAMS :  -
     * RETURNS :  INLINEHTML
     *   NOTES :
     */

    function reminderCommentsSection() {

      if (isNullorEmpty(owner) || owner == -4) {
        var userId = runtime.getCurrentUser().id;
        log.debug({
          title: 'userId',
          details: userId
        })
        owner_list = [userId];
      } else {
        owner_list = [owner];
      }

      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">REMINDERS & COMMENTS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      if (salesStage >= 2) {
        inlineHtml += '<div class="form-group container ">';
        inlineHtml += '<div class="row">';
        // Reminder field
        inlineHtml += '<div class="col-xs-6 reminder">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
          '<span class="input-group-addon" id="reminder_text">REMINDER<span class="mandatory">*</span></span>';
        if (!isNullorEmpty(reminder)) {
          reminder = format.format({
            value: reminder,
            type: format.Type.DATE
          });
          var reminderArray = reminder.split('/');
          if (reminderArray[1] < 10) {
            reminderArray[1] = '0' + reminderArray[1];
          }
          if (reminderArray[0] < 10) {
            reminderArray[0] = '0' + reminderArray[0];
          }
          var formattedReminder = reminderArray[2] + '-' + reminderArray[1] +
            '-' + reminderArray[0];

          inlineHtml +=
            '<input id="reminder" class="form-control reminder" type="date" value="' +
            formattedReminder + '"/>';
        } else {
          inlineHtml +=
            '<input id="reminder" class="form-control reminder" type="date" />';
        }

        inlineHtml += '</div></div>';


        inlineHtml += '<div class="col-xs-6 owner">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
          '<span class="input-group-addon" id="owner_text">OWNER<span class="mandatory">*</span></span>';
        inlineHtml += '<select id="owner" class="form-control owner" >';

        var employeeSearch = search.load({
          type: 'employee',
          id: 'customsearch_active_employees'
        });
        var employeeResultSet = employeeSearch.run();
        employeeResultSet.each(function(employeeResult) {
          var employee_id = employeeResult.id;
          var employee_firstname = employeeResult.getValue('firstname');
          var employee_lastname = employeeResult.getValue('lastname');
          var employee_email = employeeResult.getValue('email');


          if (owner == employee_id) {
            inlineHtml += '<option value="' + employee_id +
              '" data-email="' + employee_email + '" selected>' +
              employee_firstname + ' ' + employee_lastname + '</option>';
          } else {
            inlineHtml += '<option value="' + employee_id +
              '" data-email="' + employee_email + '">' +
              employee_firstname + ' ' + employee_lastname + '</option>';
          }
          return true;
        });

        inlineHtml += '</select>';
        inlineHtml += '</div></div>';

        inlineHtml += '</div></div>';
      }


      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 old_comments_section"><div class="input-group"><span class="input-group-addon">PREVIOUS COMMENTS </span><textarea id="old_comments" class="form-control old_comments" readonly style="height: 150px">' +
        comments + '</textarea></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';
      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 comments_section"><div class="input-group"><span class="input-group-addon">COMMENTS </span><textarea id="comments" class="form-control comments" ></textarea></div></div>';

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
