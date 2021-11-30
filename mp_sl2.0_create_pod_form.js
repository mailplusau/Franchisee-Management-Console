/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-01T09:59:04+11:00
 * Module Description: Page that lists customres that are commencing today or have not been onboarded.
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-24T14:31:17+11:00
 */



define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect', 'N/file'
  ],
  function(ui, email, runtime, search, record, http, log, redirect, file) {
    var role = 0;
    var userId = 0;
    var zee = 0;

    function onRequest(context) {
      var baseURL = 'https://system.na2.netsuite.com';
      if (runtime.EnvType == "SANDBOX") {
        baseURL = 'https://system.sandbox.netsuite.com';
      }
      userId = runtime.getCurrentUser().id;

      role = runtime.getCurrentUser().role;

      if (context.request.method === 'GET') {

        var tollPODInternalID = context.request.parameters.tollPODInternalID;

        var tollPODRecord = record.load({
          type: 'customrecord_toll_pod',
          id: tollPODInternalID
        });

        var fileName = tollPODRecord.getText({
          fieldId: 'name'
        })
        fileNameSplit = fileName.split('.');
        fileName = fileNameSplit[0]
        fileName = fileName.replace(" ", "_")
        var operatorName = tollPODRecord.getText({
          fieldId: 'custrecord_toll_pod_upload_operator'
        })
        var uploadDate = tollPODRecord.getText({
          fieldId: 'custrecord_upload_date'
        })
        var uploadTime = tollPODRecord.getValue({
          fieldId: 'custrecord_upload_time'
        })
        var podLocations = tollPODRecord.getText({
          fieldId: 'custrecord_toll_pod_locations'
        })
        var uploadedLabel = tollPODRecord.getValue({
          fieldId: 'custrecord_pod_form'
        })


        var form = ui.createForm({
          title: 'TOLL Proof of Delivery - Create PDF Form'
        });


        var inlineHtml =
          '<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&libraries=places"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/drilldown.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script><style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;} @-webkit-keyframes animatetop {from {top:-300px; opacity:0} to {top:0; opacity:1}}@keyframes animatetop {from {top:-300px; opacity:0}to {top:0; opacity:1}}</style>';



        form.addField({
          id: 'custpage_internalid',
          type: ui.FieldType.TEXT,
          label: 'Operator'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })
        form.addField({
          id: 'custpage_operator',
          type: ui.FieldType.TEXT,
          label: 'Operator'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })
        form.addField({
          id: 'custpage_date_dd',
          type: ui.FieldType.TEXT,
          label: 'Date Upload'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })
        form.addField({
          id: 'custpage_date_mm',
          type: ui.FieldType.TEXT,
          label: 'Date Upload'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })
        form.addField({
          id: 'custpage_date_yyyy',
          type: ui.FieldType.TEXT,
          label: 'Date Upload'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })
        form.addField({
          id: 'custpage_time_hours',
          type: ui.FieldType.TEXT,
          label: 'Upload Time'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })
        form.addField({
          id: 'custpage_time_minutes',
          type: ui.FieldType.TEXT,
          label: 'Upload Time'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })
        form.addField({
          id: 'custpage_pod',
          type: ui.FieldType.TEXT,
          label: 'POD Locations'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })
        form.addField({
          id: 'custpage_receiver_name',
          type: ui.FieldType.TEXT,
          label: 'Receiver Name'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })
        form.addField({
          id: 'custpage_address1',
          type: ui.FieldType.TEXT,
          label: 'Address 1'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })
        form.addField({
          id: 'custpage_suburb',
          type: ui.FieldType.TEXT,
          label: 'Suburb'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })
        form.addField({
          id: 'custpage_postcode',
          type: ui.FieldType.TEXT,
          label: 'Postcode'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })
        form.addField({
          id: 'custpage_connote',
          type: ui.FieldType.TEXT,
          label: 'Connote'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        })

        //Display the modal pop-up to edit the customer details
        // inlineHtml += updateCustomerModal();

        //Loading Section that gets displayed when the page is being loaded
        inlineHtml += loadingSection();
        inlineHtml += '<div id="container"></div>'
        inlineHtml += tollPODCreateForm(tollPODInternalID, fileName, operatorName, uploadDate,
          uploadTime,
          podLocations, uploadedLabel);

        form.addSubmitButton({
          label: 'CREATE PDF FORM'
        })

        // form.addSubmitButton({
        //   id: 'submit_search',
        //   label: 'Submit Search',
        //   functionName: 'addFilters()'
        // });


        form.addField({
          id: 'preview_table',
          label: 'inlinehtml',
          type: 'inlinehtml'
        }).updateLayoutType({
          layoutType: ui.FieldLayoutType.STARTROW
        }).defaultValue = inlineHtml;

        form.clientScriptFileId = 5328019;

        context.response.writePage(form);
      } else {

      }
    }

    function tollPODCreateForm(tollPODInternalID, fileName, operatorName, uploadDate, uploadTime,
      podLocations, uploadedLabel) {

      var inlineHtml2 =
        '<div class="form-group container commencement_section">';
      inlineHtml2 += '<div class="row">';
      inlineHtml2 +=
        '<div class="col-xs-12 heading4"><h4><span class="label label-default col-xs-12">LABEL UPLOAD DETAILS</span></h4></div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '</div>';

      inlineHtml2 +=
        '<div class="form-group container dateofupload_section">';
      inlineHtml2 += '<div class="row">';

      inlineHtml2 +=
        '<div class="col-xs-3 operatorname"><div class="input-group"><span class="input-group-addon" id="operatorname_text">OPERATOR</span><input type="text" id="operatorname" class="form-control operatorname" value="' +
        operatorName + '" readonly/><input type="text" id="tollPODInternalID" class="form-control tollPODInternalID" value="' +
        tollPODInternalID + '" style="display: none;"/></div></div>';

      inlineHtml2 +=
        '<div class="col-xs-3 podlocations"><div class="input-group"><span class="input-group-addon" id="podlocations_text">POD Locations</span><input type="text" id="podlocations" class="form-control podlocations" value="' +
        podLocations + '" readonly/></div></div>';

      inlineHtml2 +=
        '<div class="col-xs-3 uploaddate"><div class="input-group"><span class="input-group-addon" id="uploaddate_text">UPLOAD DATE</span><input type="text" id="uploaddate" class="form-control uploaddate" value="' +
        uploadDate + '" readonly/></div></div>';

      inlineHtml2 +=
        '<div class="col-xs-3 uploadtime"><div class="input-group"><span class="input-group-addon" id="uploadtime_text">UPLOAD TIME</span><input type="text" id="uploadtime" class="form-control uploadtime" value="' +
        uploadTime + '" readonly/></div></div>';

      inlineHtml2 += '</div>';
      inlineHtml2 += '</div>';


      inlineHtml2 += '<div class="form-group container labelview_section">';
      inlineHtml2 += '<div class="row">';


      var fileRecord = file.load({
        id: uploadedLabel
      });

      inlineHtml2 += '<div class="col-xs-6 ">';
      inlineHtml2 +=
        '<div class="form-group container ">';
      inlineHtml2 += '<div class="row">';
      inlineHtml2 +=
        '<div class="col-xs-6 heading4"><h4><span class="label label-default col-xs-12">UPLOADED LABEL</span></h4></div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '<div class="form-group container row_file_name ">'
      inlineHtml2 += '<div class="row">';

      inlineHtml2 +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">FILE NAME</span><input id="file_name" class="form-control file_name" value="' +
        fileName + '" /></div></div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '<img id="viewer" src="' +
        fileRecord.url + '" style="width: 100%; height: 100%;"/></div>';
      inlineHtml2 += '<div class="col-xs-6 fillForm">';
      inlineHtml2 +=
        '<div class="form-group container ">';
      inlineHtml2 += '<div class="row">';
      inlineHtml2 +=
        '<div class="col-xs-6 heading4"><h4><span class="label label-default col-xs-12">FIELDS TO BE FILLED OUT</span></h4></div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '<div class="form-group container row_receiver ">'
      inlineHtml2 += '<div class="row">';

      inlineHtml2 +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">RECEIVER NAME</span><input id="receiver_name" class="form-control receiver_name" /></div></div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '</div>';

      inlineHtml2 += '<div class="form-group container row_address1 ">'
      inlineHtml2 += '<div class="row">';
      inlineHtml2 +=
        '<div class="col-xs-6 address1_section"><div class="input-group"><span class="input-group-addon">UNIT/LEVEL/SUIT</span><input id="address1" class="form-control address1" /></div></div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '</div>';

      inlineHtml2 += '<div class="form-group container row_address2 ">'
      inlineHtml2 += '<div class="row">';
      inlineHtml2 +=
        '<div class="col-xs-6 address2_section"><div class="input-group"><span class="input-group-addon">STREET NO. & NAME</span><input id="address2" class="form-control address2" /></div></div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '<div class="form-group container ">'
      inlineHtml2 += '<div class="row">';
      inlineHtml2 +=
        '<div class="col-xs-6"><div class="input-group"><span class="input-group-addon">CITY</span><input id="city" readonly class="form-control city" /></div></div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '<div class="form-group container ">'
      inlineHtml2 += '<div class="row">';
      inlineHtml2 +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">STATE</span><input id="state" readonly class="form-control state" /></div></div>';


      inlineHtml2 +=
        '<div class="col-xs-3 post_code_section"><div class="input-group"><span class="input-group-addon">POSTCODE</span><input id="postcode" readonly class="form-control postcode" /></div></div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '<div class="form-group container ">'
      inlineHtml2 += '<div class="row">';
      inlineHtml2 +=
        '<div class="col-xs-6 connote_section"><div class="input-group"><span class="input-group-addon">CONNOTE</span><input id="connote"  class="form-control connote" /></div></div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '<div class="form-group container ">'
      inlineHtml2 += '<div class="row">';
      inlineHtml2 +=
        '<div class="col-xs-6 reviewaddress"><input type="button" value="CREATE" class="form-control btn btn-primary" id="createForm" /></div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '</div>';
      inlineHtml2 += '</div>';

      return inlineHtml2;

    }

    /**
     * The header showing that the results are loading.
     * @returns {String} `inlineHtml2`
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

    function isNullorEmpty(val) {
      if (val == '' || val == null) {
        return true;
      } else {
        return false;
      }
    }
    return {
      onRequest: onRequest
    };
  });
