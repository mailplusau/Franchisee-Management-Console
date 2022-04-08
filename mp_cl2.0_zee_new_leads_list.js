/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-12-24T09:19:53+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-03-31T14:55:41+11:00
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
    var myRecord = currentRecord.get();

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
      zeeSalesLeadDataSet2 = [];
      zeeSalesLeadSet = [];
      zeeSalesLeadSet2 = [];

      // pageLoad();
      submitSearch();

      $("#reportingPage").click(function() {
        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1415&deploy=1'
        window.location.href = url;
      });

      $(".lostZeeLead").click(function() {
          var zeeLeadInternalID = $(this).attr("data-id");
          $('.input-group').removeClass('input-group');
          $('.reason_input_group').addClass('input-group');
          console.log('inside modal')
          console.log(zeeLeadInternalID)
          $("#zeeleadid").val(zeeLeadInternalID);

          $("#myModal").show();

        })
        //On click of close icon in the modal
      $('.close').click(function() {
        location.reload();
      });
      //Update the customer record on click of the button in the modal
      $('#leadLost').click(function() {
        zeeleadid = $("#zeeleadid").val();

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeleadid
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_lost_reason',
          value: $("#lostReason").val()
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
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1'
        window.location.href = url;
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

      dataTable = $('#investor_owner_table').DataTable({
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
          targets: [1, 6, 10],
          className: 'bolded'
        }, {
          className: "col-sm-2",
          "targets": [0]
        }, {
          className: "text-center",
          targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }],
        rowCallback: function(row, data, index) {}
      });

      dataTable2 = $('#seeking_employment_table').DataTable({
        destroy: true,
        data: zeeSalesLeadDataSet2,
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
          title: 'Postcode of Intesrest'
        }, {
          title: 'State of Intesrest'
        }, {
          title: 'Sales Stage'
        }],
        columnDefs: [{
          targets: [1, 6, 8],
          className: 'bolded'
        }, {
          className: "col-sm-2",
          "targets": [0]
        }, {
          className: "text-center",
          targets: [0, 1, 2, 3, 4, 5, 6, 7, 8]
        }],
        rowCallback: function(row, data, index) {}
      });

      loadZeeSalesLeadSearch();

      console.log('Loaded Results');
      afterSubmit()

    }

    function loadZeeSalesLeadSearch() {

      var dateFrom = myRecord.getValue({
        fieldId: 'custpage_date_from'
      });

      //NetSuite Search: Franchisee Sales Leads - Website
      var searchZeeLeadsList = search.load({
        id: 'customsearch_zee_sales_lead_list',
        type: 'customrecord_zee_sales_leads'
      });

      if (!isNullorEmpty(dateFrom)) {
        searchZeeLeadsList.filters.push(search.createFilter({
          name: 'custrecord_zee_lead_date_entered',
          join: null,
          operator: search.Operator.ONORAFTER,
          values: dateFrom
        }));
      }

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

      //NetSuite Search: Seeking Employment Leads - Website
      var searchZeeLeadsList2 = search.load({
        id: 'customsearch_zee_sales_lead_list_3',
        type: 'customrecord_zee_sales_leads'
      });

      if (!isNullorEmpty(dateFrom)) {
        searchZeeLeadsList2.filters.push(search.createFilter({
          name: 'custrecord_zee_lead_date_entered',
          join: null,
          operator: search.Operator.ONORAFTER,
          values: dateFrom
        }));
      }

      searchZeeLeadsList2.run().each(function(
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

        zeeSalesLeadSet2.push({
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
      console.log(zeeSalesLeadSet2)

      loadDatatable(zeeSalesLeadSet, zeeSalesLeadSet2);
      zeeSalesLeadSet = [];
      zeeSalesLeadSet2 = [];

    }

    function loadDatatable(zeeSalesLeads_rows, zeeSalesLeads2_rows) {

      zeeSalesLeadDataSet = [];
      zeeSalesLeadDataSet2 = [];
      csvSet = [];

      if (!isNullorEmpty(zeeSalesLeads_rows)) {
        zeeSalesLeads_rows.forEach(function(zeeSalesLeads_row, index) {

          if (zeeSalesLeads_row.stageID == 1) {
            var linkURL =
              '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="viewZeeLead" style="cursor: pointer !important;color: white;">VIEW</a></button> <button class="form-control btn btn-xs btn-danger" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
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
              '" class="viewZeeLead" style="cursor: pointer !important;color: white;">VIEW</a></button> <button class="form-control btn btn-xs btn-danger" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
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
              '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="viewZeeLead" style="cursor: pointer !important;color: white;">VIEW</a></button> <button class="form-control btn btn-xs btn-danger" style="cursor: not-allowed !important;width: fit-content;" disabled><a data-id="' +
              zeeSalesLeads_row.internalID +
              '" class="" style="cursor: pointer !important;color: white;" disabled>NO TERRITORY</a></button>';
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
      console.log(zeeSalesLeadDataSet)
      var datatable = $('#investor_owner_table').DataTable();
      datatable.clear();
      datatable.rows.add(zeeSalesLeadDataSet);
      datatable.draw();

      if (!isNullorEmpty(zeeSalesLeads2_rows)) {
        zeeSalesLeads2_rows.forEach(function(zeeSalesLeads2_row, index) {

          var linkURL =
            '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            zeeSalesLeads2_row.internalID +
            '" class="viewZeeLead" style="cursor: pointer !important;color: white;">VIEW</a></button> <button class="form-control btn btn-xs btn-danger" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            zeeSalesLeads2_row.internalID +
            '" class="lostZeeLead" style="cursor: pointer !important;color: white;">LOST</a></button>';

          zeeSalesLeadDataSet2.push([linkURL, zeeSalesLeads2_row.date,
            zeeSalesLeads2_row.fname,
            zeeSalesLeads2_row.lname, zeeSalesLeads2_row.mobile,
            zeeSalesLeads2_row.email, zeeSalesLeads2_row.postcode,
            zeeSalesLeads2_row.state, zeeSalesLeads2_row.stage
          ]);
        });
      }

      console.log(zeeSalesLeadDataSet2)
      var datatable2 = $('#seeking_employment_table').DataTable();
      datatable2.clear();
      datatable2.rows.add(zeeSalesLeadDataSet2);
      datatable2.draw();

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
