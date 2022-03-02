/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-12-24T09:19:53+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-02-28T14:20:17+11:00
 */


define(['N/email', 'N/runtime', 'N/search', 'N/record', 'N/http', 'N/log',
    'N/error', 'N/url', 'N/format', 'N/currentRecord', 'N/https'
  ],
  function(email, runtime, search, record, http, log, error, url, format,
    currentRecord, https) {
    var zee = '0';
    var userId = 0;
    var role = 0;

    var firstName = '';
    var lastName = '';
    var mobile = '';
    var leadEmail = '';
    var franchiseeTypeOfOwner = '0';
    var vehicle = '0';
    var experience = '0';
    var employment = '0';
    var finance = '0';
    var investment = '0';
    var classification = '0';
    var salesStage = '0';
    var old_comments = '';
    var comments = '';
    var suburb = '';
    var state = '';
    var postcode = '';
    var interestedZees = [];
    var listedForSaleZees = [];
    var eoiSent = 0
    var salePrice = 0;
    var incGST = 0;
    var totalSalePrice = 0.0;
    var reminder;
    var owner = '0';
    var combineComments = '';

    var baseURL = 'https://1048144.app.netsuite.com';
    if (runtime.EnvType == "SANDBOX") {
      baseURL = 'https://1048144-sb3.app.netsuite.com';
    }

    role = runtime.getCurrentUser().role;
    var userName = runtime.getCurrentUser().name;
    var userId = runtime.getCurrentUser().id;
    var currRec = currentRecord.get();
    var myRecord = currentRecord.get();

    var zeeleadid = 0;

    function pageLoad() {

      $('.loading_section').removeClass('hide');
    }

    function afterSubmit() {
      $('.loading_section').addClass('hide');
    }

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

    //Fade out the Loading symbol
    function afterLoad() {
      $(".se-pre-con").fadeOut("slow");
    }


    function pageInit() {

      $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
      $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
      $("#body").css("background-color", "#CFE0CE");

      $("#tdbody_submitter").css("display", "none");

      // Get the value of custom fields
      zeeleadid = (myRecord.getValue({
        fieldId: 'custpage_zeeleadid'
      }));
      eoiSent = (myRecord.getValue({
        fieldId: 'custpage_eoisent'
      }));

      $('.ui.dropdown').dropdown();

      //Google Dropdown for the address2 field
      $(document).on('focus', '#address2', function(event) {
        // alert('onfocus')
        initAutocomplete();
      });

      //Hide the alert section on the page
      $('#alert').hide();
      /**
       * Close the Alert box on click
       */
      $(document).on('click', '#alert .close', function(e) {
        $(this).parent().hide();
      });

      afterLoad();

      $(document).on("click", '#backButton', function(e) {
        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1'
        window.location.href = url;
      });

    }

    /*
     * PURPOSE : Ability to unhide the Alert section and display the error message
     *  PARAMS : Error message
     * RETURNS :
     *   NOTES :
     */
    function showAlert(message) {
      console.log(message)
      $('#alert').html(
        '<button type="button" class="close">&times;</button>' +
        message);
      $('#alert').show();
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0;
      setTimeout(function() {
        $('#alert').hide();
      }, 5000);
    }

    function validate() {
      var errorMessage = '';
      if (isNullorEmpty(firstName)) {
        errorMessage += 'Please Enter First Name</br>';
      }

      if (isNullorEmpty(lastName)) {
        errorMessage += 'Please Enter Last Name</br>';
      }

      if (isNullorEmpty(mobile)) {
        errorMessage += 'Please Enter Mobile No.</br>';
      }

      if (isNullorEmpty(leadEmail)) {
        errorMessage += 'Please Enter Email Address</br>';
      }

      if (isNullorEmpty(franchiseeTypeOfOwner)) {
        errorMessage += 'Please Select Type of Owner</br>';
      } else {
        // if (franchiseeTypeOfOwner != 4) {
        //   if (isNullorEmpty(interestedZees) && isNullorEmpty(
        //       listedForSaleZees)) {
        //     errorMessage += 'Please Select Interested Franchisees</br>';
        //   }
        // }
      }

      if (isNullorEmpty(state) || isNullorEmpty(postcode)) {
        errorMessage += 'Please Select Area of Interest</br>';
      }

      if (!isNullorEmpty(errorMessage)) {
        showAlert(errorMessage);
        return false;
      } else {
        return true;
      }
    }

    function createUpdateRecord() {

    }

    function saveRecord() {

      console.log('inside save function')
      console.log('zeeleadid: ' + zeeleadid)

      createUpdateRecord();

      return true;

    }

    function getDateToday() {
      var date = new Date();
      format.format({
        value: date,
        type: format.Type.DATE,
        timezone: format.Timezone.AUSTRALIA_SYDNEY
      })

      return date;
    }


    function formatDate(testDate) {
      var reminder_date = new Date(testDate);
      reminder_date = format.parse({
        value: reminder_date,
        type: format.Type.DATE,
        timezone: format.Timezone.AUSTRALIA_SYDNEY
      });

      return reminder_date;
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

    function isNullorEmpty(strVal) {
      return (strVal == null || strVal == '' || strVal == 'null' || strVal ==
        undefined || strVal == 'undefined' || strVal == '- None -' ||
        strVal ==
        '0');
    }

    return {
      pageInit: pageInit,
      saveRecord: saveRecord
    }
  });
