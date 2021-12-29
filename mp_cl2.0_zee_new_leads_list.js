/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-12-24T09:19:53+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-12-29T07:50:25+11:00
 */


define(['N/email', 'N/runtime', 'N/search', 'N/record', 'N/http', 'N/log',
    'N/error', 'N/url', 'N/format', 'N/currentRecord'
  ],
  function(email, runtime, search, record, http, log, error, url, format,
    currentRecord) {
    var zee = 0;
    var userId = 0;
    var role = 0;

    var baseURL = 'https://1048144.app.netsuite.com';
    if (runtime.EnvType == "SANDBOX") {
      baseURL = 'https://1048144-sb3.app.netsuite.com';
    }

    role = runtime.getCurrentUser().role;
    var userName = runtime.getCurrentUser().name;
    var userId = runtime.getCurrentUser().id;
    var currRec = currentRecord.get();

    var tollUploadSet = [];

    function pageLoad() {

      $('.loading_section').removeClass('hide');
    }

    function afterSubmit() {
      $(".se-pre-con").fadeOut("slow");


      if (!isNullorEmpty($('#result_zee_leads_list').val())) {
        $('#zee_leads_list_preview').removeClass('hide');
        $('#zee_leads_list_preview').show();
      }

      $('#result_zee_leads_list').on('change', function() {
        $('#zee_leads_list_preview').removeClass('hide');
        $('#zee_leads_list_preview').show();
      });

      $('#zee_leads_list_preview').removeClass('hide');
      $('#zee_leads_list_preview').show();
    }


    function pageInit() {

      $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
      $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
      $("#body").css("background-color", "#CFE0CE");

      zeeSalesLeadDataSet = [];
      zeeSalesLeadSet = [];

      // pageLoad();
      submitSearch();

      $(".lostZeeLead").click(function() {
        var zeeLeadInternalID = $(this).attr("data-id");

        if (confirm(
            "Are you sure you want to continue?\n\nThis action cannot be undone."
          )) {
          var zeeSalesLeadRecord = record.load({
            type: 'customrecord_zee_sales_leads',
            id: zeeLeadInternalID
          });

          zeeSalesLeadRecord.setValue({
            fieldId: 'custrecord_zee_lead_stage',
            value: 3
          });

          zeeSalesLeadRecord.setValue({
            fieldId: 'custrecord_date_lead_lost',
            value: getDateToday()
          });

          zeeSalesLeadRecord.save();

          var url = baseURL +
            '/app/site/hosting/scriptlet.nl?script=1409&deploy=1';
          window.location.href = url;
        }

      });

      $(".qualifyZeeLead").click(function() {
        var zeeLeadInternalID = $(this).attr("data-id");

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeLeadInternalID
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_stage',
          value: 2
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_qualified_lead',
          value: getDateToday()
        });

        zeeSalesLeadRecord.save();

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1';
        window.location.href = url;

      });

      $(".opportunityZeeLead").click(function() {
        var zeeLeadInternalID = $(this).attr("data-id");

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeLeadInternalID
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_stage',
          value: 5
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_opportunity',
          value: getDateToday()
        });

        zeeSalesLeadRecord.save();

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1';
        window.location.href = url;

      });

      $(".deniedZeeLead").click(function() {
        var zeeLeadInternalID = $(this).attr("data-id");

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeLeadInternalID
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_stage',
          value: 6
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_opportunity_denied',
          value: getDateToday()
        });

        zeeSalesLeadRecord.save();

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1';
        window.location.href = url;

      });

      $(".noTerritoryZeeLead").click(function() {
        var zeeLeadInternalID = $(this).attr("data-id");

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeLeadInternalID
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_stage',
          value: 4
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_qualified_no_territory',
          value: getDateToday()
        });

        zeeSalesLeadRecord.save();

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1';
        window.location.href = url;

      });

      $(".createLead").click(function() {
        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1411&deploy=1';
        window.location.href = url;

      });

      $(".viewZeeLead").click(function() {
        var zeeLeadInternalID = $(this).attr("data-id");
        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1411&deploy=1&zeeleadid=' +
          zeeLeadInternalID;
        window.location.href = url;

      });

      afterSubmit()
    }

    //Initialise the DataTable with headers.
    function submitSearch() {


      dataTable = $('#zee_leads_list_preview').DataTable({
        destroy: true,
        data: zeeSalesLeadDataSet,
        pageLength: 1000,
        order: [],
        columns: [{
          title: 'LINK'
        }, {
          title: 'Date Lead Entered'
        }, {
          title: 'First Name'
        }, {
          title: 'Last Name'
        }, {
          title: 'Mobile'
        }, {
          title: 'Email'
        }, {
          title: 'Type of Lead'
        }, {
          title: 'Suburb of Intesrest'
        }, {
          title: 'Postcode of Intesrest'
        }, {
          title: 'State of Intesrest'
        }, {
          title: 'Sales Stage'
        }],
        columnDefs: [{
          targets: [],
          className: 'bolded'
        }, {
          className: "col-sm-2",
          "targets": [0]
        }],
        rowCallback: function(row, data, index) {}
      });

      loadZeeSalesLeadSearch();

      console.log('Loaded Results');
      afterSubmit()

    }

    function loadZeeSalesLeadSearch() {

      //NetSuite Search: Franchisee Sales Leads - Website
      var searchZeeLeadsList = search.load({
        id: 'customsearch_zee_sales_lead_list',
        type: 'customrecord_zee_sales_leads'
      });

      searchZeeLeadsList.run().each(function(
        tzeeLeadsListResultSet) {

        var internalID = tzeeLeadsListResultSet.getValue({
          name: 'internalid'
        });
        var date = tzeeLeadsListResultSet.getValue({
          name: 'custrecord_zee_lead_date_entered'
        });
        var fname = tzeeLeadsListResultSet.getValue({
          name: 'custrecord_zee_leads_fname'
        });
        var lname = tzeeLeadsListResultSet.getValue({
          name: 'custrecord_zee_leads_lname'
        });
        var mobile = tzeeLeadsListResultSet.getValue({
          name: 'custrecord_zee_lead_mobile'
        });
        var email = tzeeLeadsListResultSet.getValue({
          name: 'custrecord_zee_lead_email'
        });
        var type = tzeeLeadsListResultSet.getText({
          name: 'custrecord_type_of_owner'
        });
        var suburb = tzeeLeadsListResultSet.getValue({
          name: 'custrecord_areas_of_interest_suburb'
        });
        var postcode = tzeeLeadsListResultSet.getValue({
          name: 'custrecord_areas_of_interest_postcode'
        });
        var state = tzeeLeadsListResultSet.getText({
          name: 'custrecord_areas_of_interest_state'
        });
        var stage = tzeeLeadsListResultSet.getText({
          name: 'custrecord_zee_lead_stage'
        });
        var stageID = tzeeLeadsListResultSet.getValue({
          name: 'custrecord_zee_lead_stage'
        });

        zeeSalesLeadSet.push({
          internalID: internalID,
          date: date,
          fname: fname,
          lname: lname,
          mobile: mobile,
          email: email,
          type: type,
          suburb: suburb,
          postcode: postcode,
          state: state,
          stage: stage,
          stageID: stageID
        });

        return true;
      });
      console.log(zeeSalesLeadSet)

      loadDatatable(zeeSalesLeadSet);
      zeeSalesLeadSet = [];

    }

    function loadDatatable(zeeSalesLeads_rows) {

      zeeSalesLeadDataSet = [];
      csvSet = [];

      if (!isNullorEmpty(zeeSalesLeads_rows)) {
        zeeSalesLeads_rows.forEach(function(zeeSalesLeads_row, index) {

          if (zeeSalesLeads_row.stageID == 1) {
            var linkURL =
              '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="viewZeeLead" style="cursor: pointer !important;color: white;">VIEW</a></button> <button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="qualifyZeeLead" style="cursor: pointer !important;color: white;">QUALIFY</a></button> <button class="form-control btn btn-xs btn-danger" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="lostZeeLead" style="cursor: pointer !important;color: white;">LOST</a></button>';
          } else if (zeeSalesLeads_row.stageID == 3) {
            var linkURL =
              '<button class="form-control btn btn-xs btn-danger" style="cursor: not-allowed !important;width: fit-content;" disabled><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="" style="cursor: pointer !important;color: white;" disabled>LOST</a></button>';
          } else if (zeeSalesLeads_row.stageID == 2) {
            var linkURL =
              '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="viewZeeLead" style="cursor: pointer !important;color: white;">VIEW</a></button> <button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="opportunityZeeLead" style="cursor: pointer !important;color: white;">OPPORTUNITY</a></button> <button class="form-control btn btn-xs btn-danger" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="noTerritoryZeeLead" style="cursor: pointer !important;color: white;">NO TERRITORY</a></button>';
          } else if (zeeSalesLeads_row.stageID == 5) {
            var linkURL =
              '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="viewZeeLead" style="cursor: pointer !important;color: white;">VIEW</a></button> <button class="form-control btn btn-xs btn-danger" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="deniedZeeLead" style="cursor: pointer !important;color: white;">OPPORTUNITY DENIED</a></button>';
          } else if (zeeSalesLeads_row.stageID == 4) {
            var linkURL =
              '<button class="form-control btn btn-xs btn-danger" style="cursor: not-allowed !important;width: fit-content;" disabled><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="" style="cursor: pointer !important;color: white;" disabled>NO TERRITORY</a></button> <button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="opportunityZeeLead" style="cursor: pointer !important;color: white;">OPPORTUNITY</a></button>';
          } else if (zeeSalesLeads_row.stageID == 6) {
            var linkURL =
              '<button class="form-control btn btn-xs btn-danger" style="cursor: not-allowed !important;width: fit-content;" disabled><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="" style="cursor: pointer !important;color: white;" disabled>OPPORTUNITY DENIED</a></button>';
          }



          zeeSalesLeadDataSet.push([linkURL, zeeSalesLeads_row.date,
            zeeSalesLeads_row.fname,
            zeeSalesLeads_row.lname, zeeSalesLeads_row.mobile,
            zeeSalesLeads_row.email, zeeSalesLeads_row.type,
            zeeSalesLeads_row.suburb, zeeSalesLeads_row.postcode,
            zeeSalesLeads_row.state, zeeSalesLeads_row.stage
          ]);
        });
      }

      var datatable = $('#zee_leads_list_preview').DataTable();
      datatable.clear();
      datatable.rows.add(zeeSalesLeadDataSet);
      datatable.draw();

      return true;
    }

    function saveRecord() {}

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


    function formatDate(testDate) {
      console.log('testDate: ' + testDate);
      var responseDate = format.format({
        value: testDate,
        type: format.Type.DATE
      });
      console.log('responseDate: ' + responseDate);
      return responseDate;
    }

    function replaceAll(string) {
      return string.split("/").join("-");
    }

    function stateIDPublicHolidaysRecord(state) {
      switch (state) {
        case 1:
          return 1; //NSW
          break;
        case 2:
          return 6; //QLD
          break;
        case 3:
          return 5; //VIC
          break;
        case 4:
          return 3; //SA
          break;
        case 5:
          return 7; //TAS
          break;
        case 6:
          return 4; //ACT
          break;
        case 7:
          return 2; //WA
          break;
        case 8:
          return 8; //NT
          break;
        default:
          return null;
          break;
      }
    }

    function stateID(state) {
      state = state.toUpperCase();
      switch (state) {
        case 'ACT':
          return 6
          break;
        case 'NSW':
          return 1
          break;
        case 'NT':
          return 8
          break;
        case 'QLD':
          return 2
          break;
        case 'SA':
          return 4
          break;
        case 'TAS':
          return 5
          break;
        case 'VIC':
          return 3
          break;
        case 'WA':
          return 7
          break;
        default:
          return 0;
          break;
      }
    }



    function isNullorEmpty(val) {
      if (val == '' || val == null) {
        return true;
      } else {
        return false;
      }
    }
    return {
      pageInit: pageInit,
      saveRecord: saveRecord
    }
  });
