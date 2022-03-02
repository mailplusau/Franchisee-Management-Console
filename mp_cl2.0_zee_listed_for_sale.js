/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-12-24T09:19:53+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-02-28T14:33:29+11:00
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
      zeeSalesLeadSet = [];
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


      $(".viewZeeLead").click(function() {
        var zeeLeadInternalID = $(this).attr("data-id");
        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1430&deploy=1&zeeid=' +
          zeeLeadInternalID;
        window.location.href = url;

      });

      afterSubmit()
    }

    //Initialise the DataTable with headers.
    function submitSearch() {

      dataTable = $('#listedForSaleZees').DataTable({
        destroy: true,
        data: zeeSalesLeadDataSet,
        pageLength: 1000,
        order: [],
        columns: [{
          title: 'LINK'
        }, {
          title: 'Date Listed for Sale'
        }, {
          title: 'Franchisee'
        }, {
          title: 'Contact'
        }, {
          title: 'Mobile'
        }, {
          title: 'Email'
        }],
        columnDefs: [{
          targets: [1, 2],
          className: 'bolded'
        }, {
          className: "col-sm-2",
          "targets": [0, 1]
        }, {
          className: "text-center",
          targets: [0, 1, 2, 3, 4]
        }],
        rowCallback: function(row, data, index) {}
      });

      loadZeeSalesLeadSearch();

      console.log('Loaded Results');
      afterSubmit()

    }

    function loadZeeSalesLeadSearch() {

      //NetSuite Search: Franchisee Sales Leads - Website
      var searchZeeListedforSale = search.load({
        id: 'customsearch_zee_listed_for_sales',
        type: 'partner'
      });

      searchZeeListedforSale.run().each(function(
        zeeListedforSaleReseultSet) {

        var internalID = zeeListedforSaleReseultSet.getValue({
          name: 'internalid'
        });
        var dateListedForSale = zeeListedforSaleReseultSet.getValue({
          name: 'custentity_date_listed_for_sale'
        });
        var zeeName = zeeListedforSaleReseultSet.getValue({
          name: 'companyname'
        });
        var zeeEmail = zeeListedforSaleReseultSet.getValue({
          name: 'email'
        });
        var zeeEmail = zeeListedforSaleReseultSet.getValue({
          name: 'email'
        });
        var mainContact = zeeListedforSaleReseultSet.getValue({
          name: 'custentity3'
        });
        var zeeMobile = zeeListedforSaleReseultSet.getValue({
          name: 'custentity2'
        });

        zeeSalesLeadSet.push({
          internalID: internalID,
          date: dateListedForSale,
          zeeName: zeeName,
          mainContact: mainContact,
          zeeEmail: zeeEmail,
          zeeMobile: zeeMobile,
        });

        return true;
      });


      loadDatatable(zeeSalesLeadSet);
      zeeSalesLeadSet = [];

    }

    function loadDatatable(zeeSalesLeads_rows) {

      zeeSalesLeadDataSet = [];
      zeeSalesLeadDataSet2 = [];
      csvSet = [];

      if (!isNullorEmpty(zeeSalesLeads_rows)) {
        zeeSalesLeads_rows.forEach(function(zeeSalesLeads_row, index) {

          var linkURL =
            '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            zeeSalesLeads_row.internalID +
            '" class="viewZeeLead" style="cursor: pointer !important;color: white;">VIEW</a></button>';

          zeeSalesLeadDataSet.push([linkURL, zeeSalesLeads_row.date,
            zeeSalesLeads_row.zeeName,
            zeeSalesLeads_row.mainContact, zeeSalesLeads_row.zeeMobile,
            zeeSalesLeads_row.zeeEmail
          ]);
        });
      }
      console.log(zeeSalesLeadDataSet)
      var datatable = $('#listedForSaleZees').DataTable();
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
