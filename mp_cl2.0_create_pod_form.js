/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-02T08:24:43+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-12-06T12:08:37+11:00
 */

var sample_toll_pod_form = [324]

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

    function initAutocomplete() {
      // Create the autocomplete object, restricting the search to geographical location types.
      // types is empty to get all places, not only address. Previously it was types: ['geocode']
      var options = {
        types: [],
        componentRestrictions: {
          country: 'au'
        }
      }
      autocomplete = new google.maps.places.Autocomplete((document.getElementById(
        'address2')), options);

      // When the user selects an address from the dropdown, populate the address fields in the form.
      autocomplete.addListener('place_changed', fillInAddress);
    }

    function setupClickListener(id, types) {
      // var radioButton = document.getElementById(id);
      // radioButton.addEventListener('click', function() {
      autocomplete.setTypes([]);
      // });
    }

    //Fill the Street No. & Street Name after selecting an address from the dropdown
    function fillInAddress() {

      // Get the place details from the autocomplete object.
      var place = autocomplete.getPlace();

      // Get each component of the address from the place details and fill the corresponding field on the form.
      var addressComponent = "";

      for (var i = 0; i < place.address_components.length; i++) {

        console.log(place.address_components[i])

        if (place.address_components[i].types[0] == 'street_number' || place.address_components[
            i].types[0] == 'route') {
          addressComponent += place.address_components[i]['short_name'] + " ";
          $('#address2').val(addressComponent);
        }
        if (place.address_components[i].types[0] == 'postal_code') {
          $('#postcode').val(place.address_components[i]['short_name']);
        }
        if (place.address_components[i].types[0] ==
          'administrative_area_level_1') {
          $('#state').val(place.address_components[i]['short_name']);
        }
        if (place.address_components[i].types[0] == 'locality') {
          $('#city').val(place.address_components[i]['short_name']);
        }
      }
    }

    function pageInit() {

      $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
      $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
      $("#body").css("background-color", "#CFE0CE");

      $('.loading_section').addClass('hide');


      $(document).on('focus', '#address2', function(event) {
        // alert('onfocus')
        initAutocomplete();
      });

      $("#createForm").click(function() {
        var tollPODInternalID = $('#tollPODInternalID').val()
        var fileName = $('#file_name').val()
        var operatorName = $('#operatorname').val()
        var podLocations = $('#podlocations').val()
        var uploadDate = $('#uploaddate').val()
        var uploadTime = $('#uploadtime').val()
        var receiverName = $('#receiver_name').val()
        var address1 = $('#address1').val()
        var streetNameNumber = $('#address2').val()
        var suburb = $('#city').val()
        var state = $('#state').val()
        var postcode = $('#postcode').val()
        var connote = $('#connote').val()

        console.log(streetNameNumber)

        var finalAddress = address1 + '\n' + streetNameNumber;
        var dateSplit = uploadDate.split('/');
        var dd = dateSplit[0]
        var mm = dateSplit[1]
        var yyyy = dateSplit[2]

        var timeSplit = uploadTime.split(':')
        var ampm = timeSplit[1].split(' ');

        var hours;

        if (ampm[1] == 'PM') {
          hours = timeSplit[0] + 12
        } else {
          hours = timeSplit[0]
        }

        var minutes = ampm[0]

        var tollPODRecord = record.load({
          type: 'customrecord_toll_pod',
          id: tollPODInternalID
        });

        tollPODRecord.setValue({
          fieldId: 'custrecord_connote_no',
          value: connote
        })
        tollPODRecord.setValue({
          fieldId: 'custrecord_receiver_address1',
          value: finalAddress
        })
        tollPODRecord.setValue({
          fieldId: 'custrecord_receiver_city',
          value: suburb
        })
        tollPODRecord.setValue({
          fieldId: 'custrecordreceiver_zip',
          value: postcode
        })
        tollPODRecord.setValue({
          fieldId: 'custrecord_receiver_fullname',
          value: receiverName
        })

        tollPODRecord.save({
          ignoreMandatoryFields: true
        });

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1394&deploy=1'
        window.location.href = url;
      });

      $("#deleteForm").click(function() {
        var tollPODInternalID = $('#tollPODInternalID').val()

        var tollPODRecord = record.load({
          type: 'customrecord_toll_pod',
          id: tollPODInternalID
        });

        tollPODRecord.setValue({
          fieldId: 'isinactive',
          value: true
        })

        tollPODRecord.save({
          ignoreMandatoryFields: true
        });

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1394&deploy=1'
        window.location.href = url;
      });

    }


    function saveRecord() {
      console.log('inside save record');


      return true;

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
