/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-02T08:24:43+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-23T16:02:10+11:00
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
      $('.loading_section').addClass('hide');


      if (!isNullorEmpty($('#result_customer_benchmark').val())) {
        $('#customer_benchmark_preview').removeClass('hide');
        $('#customer_benchmark_preview').show();
      }

      $('#result_customer_benchmark').on('change', function() {
        $('#customer_benchmark_preview').removeClass('hide');
        $('#customer_benchmark_preview').show();
      });

      $('#customer_benchmark_preview').removeClass('hide');
      $('#customer_benchmark_preview').show();
    }


    function pageInit() {

      $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
      $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
      $("#body").css("background-color", "#CFE0CE");

      tollUploadDataSet = [];
      tollUploadSet = [];


      pageLoad();
      submitSearch();

      $(".imageToText").click(function() {
        var formInternalID = $(this).attr("data-id");

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1396&deploy=1&tollPODInternalID=' +
          formInternalID;
        window.location.href = url;

      });


      afterSubmit()

      // });

    }

    //Initialise the DataTable with headers.
    function submitSearch() {


      dataTable = $('#customer_benchmark_preview').DataTable({
        destroy: true,
        data: tollUploadDataSet,
        pageLength: 1000,
        order: [],
        columns: [{
          title: 'LINK'
        }, {
          title: 'Name'
        }, {
          title: 'Operator'
        }, {
          title: 'TOLL POD Locations'
        }, {
          title: 'Upload Date'
        }, {
          title: 'Upload Time'
        }, {
          title: 'Label Uploaded'
        }],
        columnDefs: [{
          targets: [],
          className: 'bolded'
        }],
        rowCallback: function(row, data, index) {}
      });

      loadTOLLPODSearch();

      console.log('Loaded Results');
      afterSubmit()

    }

    function loadTOLLPODSearch() {

      //TOLL Proof of Delivery - Uploaded Labels
      var tollUploadedLabelsResults = search.load({
        type: 'customrecord_toll_pod',
        id: 'customsearch4423'
      });


      tollUploadedLabelsResults.run().each(function(
        tollUploadedLabelsResultSet) {

        var internalID = tollUploadedLabelsResultSet.getValue({
          name: 'internalid'
        });
        var name = tollUploadedLabelsResultSet.getValue({
          name: 'name'
        });
        var operatorID = tollUploadedLabelsResultSet.getValue({
          name: 'custrecord_toll_pod_upload_operator'
        });
        var operator = tollUploadedLabelsResultSet.getText({
          name: 'custrecord_toll_pod_upload_operator'
        });
        var formID = tollUploadedLabelsResultSet.getValue({
          name: 'custrecord_pod_form'
        });
        var imageToText = tollUploadedLabelsResultSet.getValue({
          name: 'custrecord_image_text_json'
        });
        var podLocations = tollUploadedLabelsResultSet.getText({
          name: 'custrecord_toll_pod_locations'
        });
        var uploadDate = tollUploadedLabelsResultSet.getValue({
          name: 'custrecord_upload_date'
        });
        var uploadTime = tollUploadedLabelsResultSet.getValue({
          name: 'custrecord_upload_time'
        });


        tollUploadSet.push({
          internalID: internalID,
          name: name,
          operatorID: operatorID,
          operator: operator,
          formID: formID,
          imageToText: imageToText,
          podLocations: podLocations,
          uploadDate: uploadDate,
          uploadTime: uploadTime,
        });

        return true;
      });
      console.log(tollUploadSet)

      loadDatatable(tollUploadSet);
      tollUploadSet = [];

    }

    function loadDatatable(tollUpload_rows) {

      tollUploadDataSet = [];
      csvSet = [];

      if (!isNullorEmpty(tollUpload_rows)) {
        tollUpload_rows.forEach(function(tollUpload_row, index) {

          var linkURL =
            '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            tollUpload_row.internalID +
            '" class="imageToText" style="cursor: pointer !important;color: white;">CREATE TOLL PDF FORM</a></button> ';


          tollUploadDataSet.push([linkURL, tollUpload_row.name,
            tollUpload_row.operator,
            tollUpload_row.podLocations, tollUpload_row.uploadDate,
            tollUpload_row.uploadTime, tollUpload_row.formID
          ]);
        });
      }

      var datatable = $('#customer_benchmark_preview').DataTable();
      datatable.clear();
      datatable.rows.add(tollUploadDataSet);
      datatable.draw();

      return true;
    }

    function saveRecord() {}


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
