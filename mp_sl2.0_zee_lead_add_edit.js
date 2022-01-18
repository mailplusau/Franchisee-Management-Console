/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-12-24T08:26:00+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-01-14T09:59:14+11:00
 */


define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect', 'N/format'
  ],
  function(ui, email, runtime, search, record, http, log, redirect, format) {

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
    var interestedZees = [];

    function onRequest(context) {
      var baseURL = 'https://system.na2.netsuite.com';
      if (runtime.EnvType == "SANDBOX") {
        baseURL = 'https://system.sandbox.netsuite.com';
      }
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

        form.addField({
          id: 'custpage_table_csv',
          type: ui.FieldType.TEXT,
          label: 'Table CSV'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })

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

        } else {
          form.addField({
            id: 'custpage_zeeleadid',
            type: ui.FieldType.TEXT,
            label: 'Table CSV'
          }).updateDisplayType({
            displayType: ui.FieldDisplayType.HIDDEN
          }).defaultValue = '0'
        }

        inlineHtml += lostZeeLeadModal();

        //Loading Section that gets displayed when the page is being loaded
        inlineHtml +=
          '<div class="se-pre-con"></div><div ng-app="myApp" ng-controller="myCtrl">';

        inlineHtml += '<div id="container"></div>'
        inlineHtml += spacing();
        inlineHtml += progressBar(salesStage, classification);
        inlineHtml += spacing();
        inlineHtml += line();
        //ERROR SECTION
        inlineHtml +=
          '<div class="container" ><div id="alert" class="alert alert-danger fade in"></div></div>';

        inlineHtml += zeeSalesMainLead();
        inlineHtml += operationsSection();
        inlineHtml += areasOfInterestSection();
        inlineHtml += potentialZeesSection();
        inlineHtml += financeSection();
        inlineHtml += salesWFDateDetails();
        inlineHtml += line();
        inlineHtml += mainButtons()
        inlineHtml += '</div>';

        form.addField({
          id: 'preview_table',
          label: 'inlinehtml',
          type: 'inlinehtml'
        }).updateLayoutType({
          layoutType: ui.FieldLayoutType.STARTROW
        }).defaultValue = inlineHtml;

        form.addSubmitButton({
          label: 'SAVE'
        });

        form.clientScriptFileId = 5403754
        context.response.writePage(form);

      } else {

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
          '" class="stageQualified" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>QUALIFIED LEAD</b></a></span> </div><div class="step"> <span>OPPORTUNITY</span> </div><div class="step"> <span>EOI APPROVED - MICHAEL</span> </div><div class="step"> <span>EOI APPROVED - CHRIS</span> </div><div class="step"> <span>UPLOAD SIGNED EOI</span> </div><div class="step"> <span>FINANCIALS</span> </div><div class="step"> <span>PRESENTATION</span> </div><div class="step"> <span>INTERVIEW</span> </div></div>';
      } else if (salesStage == 2) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="stageNewLead" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>NEW LEAD</b></a></span> </div><div class="step current"> <span>QUALIFIED LEAD</span> </div><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="stageOpportunity" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>OPPORTUNITY</b></a></span> </div><div class="step"> <span>EOI APPROVED - MICHAEL</span> </div><div class="step"> <span>EOI APPROVED - CHRIS</span> </div><div class="step"> <span>UPLOAD SIGNED EOI</span> </div><div class="step"> <span>FINANCIALS</span> </div><div class="step"> <span>PRESENTATION</span> </div><div class="step"> <span>INTERVIEW</span> </div></div>';
      } else if (salesStage == 4) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="stageNewLead" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>NEW LEAD</b></a></span> </div><div class="step current"> <span>QUALIFIED LEAD - NO TERRITORY</span> </div><div class="step"> <span><a data-id="' +
          zeeleadid +
          '" class="stageOpportunity" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>OPPORTUNITY</b></a></span> </div><div class="step"> <span>EOI APPROVED - MICHAEL</span> </div><div class="step"> <span>EOI APPROVED - CHRIS</span> </div><div class="step"> <span>UPLOAD SIGNED EOI</span> </div><div class="step"> <span>FINANCIALS</span> </div><div class="step"> <span>PRESENTATION</span> </div><div class="step"> <span>INTERVIEW</span> </div></div>';
      } else if (salesStage == 5) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>NEW LEAD</span> </div><div class="step "> <span><a data-id="' +
          zeeleadid +
          '" class="stageQualified" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>QUALIFIED LEAD</b></a></span> </div><div class="step current"> <span>OPPORTUNITY</span> </div><div class="step"> <span>EOI APPROVED - MICHAEL</span> </div><div class="step"> <span>EOI APPROVED - CHRIS</span> </div><div class="step"> <span>UPLOAD SIGNED EOI</span> </div><div class="step"> <span>FINANCIALS</span> </div><div class="step"> <span>PRESENTATION</span> </div><div class="step"> <span>INTERVIEW</span> </div></div>';
      } else if (salesStage == 6) {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>NEW LEAD</span> </div><div class="step "> <span><a data-id="' +
          zeeleadid +
          '" class="stageQualified" style="cursor: pointer !important;color: white;text-weight: 800 !important;text-decoration: underline !important;"><b>QUALIFIED LEAD</b></a></span> </div><div class="step current"> <span>OPPORTUNITY - DENIED</span> </div><div class="step"> <span>EOI APPROVED - MICHAEL</span> </div><div class="step"> <span>EOI APPROVED - CHRIS</span> </div><div class="step"> <span>UPLOAD SIGNED EOI</span> </div><div class="step"> <span>FINANCIALS</span> </div><div class="step"> <span>PRESENTATION</span> </div><div class="step"> <span>INTERVIEW</span> </div></div>';
      } else {
        inlineHtml +=
          '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step current"> <span>NEW LEAD</span> </div><div class="step"> <span>QUALIFIED LEAD</span> </div><div class="step"> <span>OPPORTUNITY</span> </div><div class="step"> <span>EOI APPROVED - MICHAEL</span> </div><div class="step"> <span>EOI APPROVED - CHRIS</span> </div><div class="step"> <span>UPLOAD SIGNED EOI</span> </div><div class="step"> <span>FINANCIALS</span> </div><div class="step"> <span>PRESENTATION</span> </div><div class="step"> <span>INTERVIEW</span> </div></div>';
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
        '<option value=0></option><option value=1>Price</option><option value=2>Finance</option><option value=3 selected>Location</option>';

      inlineHtml += '</select></div></div>';
      inlineHtml += '</div></div>';

      inlineHtml +=
        '</div><div class="modal-footer" style="padding: 2px 16px;"><input type="button" value="LEAD LOST" class="form-control btn-danger" id="leadLost" style="" /></div></div></div>';

      return inlineHtml;

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
          inlineHtml +=
            '<div class="col-xs-4 zeeLeadLost"><input type="button" value="SEND EOI" class="form-control btn btn-info" id="zeeLeadLost" data-id="' +
            zeeleadid + '"/></div>'
          inlineHtml +=
            '<div class="col-xs-4 zeeLeadLost"><input type="button" value="OPPORTUNITY DENIED" class="form-control btn btn-danger" id="opportunityDenied" data-id="' +
            zeeleadid + '"/></div>'
          inlineHtml +=
            '<div class="col-xs-4 zeeLeadLost"><input type="button" value="LEAD LOST" class="form-control btn btn-danger" id="zeeLeadLost" data-id="' +
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
      inlineHtml +=
        '<div class="col-xs-4 zee_section ' + defaultHideClass +
        '"><div class="input-group"><span class="input-group-addon" id="zee_text">FRANCHISEE </span><select id="zeeList" class="form-control ui fluid search dropdown zeeList" data-old="" json="" multiple="" style="font-size: 12px;"><option value=0></option>';

      resultSetZees.each(function(searchResultZees) {
        zeeId = searchResultZees.getValue('internalid');
        franchiseeName = searchResultZees.getValue('companyname');
        franchiseeListedForSale = searchResultZees.getValue(
          'custentity_listed_for_sale');

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
        '<div class="col-xs-8 zeeListedSale_section ' + defaultHideClass +
        '"><div class="input-group"><span class="input-group-addon" id="zeeListedSale_text">FRANCHISEES LISTED FOR SALE </span><select id="zeeListedSale" class="form-control ui fluid search dropdown zeeListedSale" data-old="" json="" multiple="" style="font-size: 12px"><option value=0></option>';

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

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="' + defaultHideClass +
        ' vehicle_section"><div class="input-group"><span class="input-group-addon">OWN A VEHICLE? </span><select id="vehicle" class="form-control vehicle" data-old="' +
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
        '<option value=0></option><option value=1>0-1 Years</option><option value=2>1-3 Years</option><option value=3 selected>3-5 Years</option><option value=4>5+ Years</option>';
      } else if (experience == 4) {
        '<option value=0></option><option value=1>0-1 Years</option><option value=2>1-3 Years</option><option value=3>3-5 Years</option><option value=4 selected>5+ Years</option>';
      }
      inlineHtml += '</select></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 comments_section"><div class="input-group"><span class="input-group-addon">COMMENTS </span><textarea id="comments" class="form-control comments" >' +
        comments + '</textarea></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';

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
