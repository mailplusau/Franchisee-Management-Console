/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-12-24T09:19:53+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-04-11T17:00:25+10:00
 */


define(['N/email', 'N/runtime', 'N/search', 'N/record', 'N/http', 'N/log',
  'N/error', 'N/url', 'N/format', 'N/currentRecord', 'N/https'
],
  function (email, runtime, search, record, http, log, error, url, format,
    currentRecord, https) {
    var zee = '0';
    var userId = 0;
    var role = 0;

    var zeeleadid = 0;
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
    var businessStartDate = '';
    var dailyRunTime = '';
    var termOnIM = '';


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
        fieldId: 'custpage_zee2'
      }));

      $('.ui.dropdown').dropdown();

      //Google Dropdown for the address2 field
      $(document).on('focus', '#address2', function (event) {
        // alert('onfocus')
        initAutocomplete();
      });

      //Hide the alert section on the page
      $('#alert').hide();
      /**
       * Close the Alert box on click
       */
      $(document).on('click', '#alert .close', function (e) {
        $(this).parent().hide();
      });

      $(document).on("click", "#sendDeed", function (e) {

        tradingEntity = $('#tradingEntity').val();
        mainContact = $('#mainContact').val();
        contactNumber = $('#contactNumber').val();
        email = $('#email').val();
        address = $('#address').val();

        console.log(tradingEntity)
        console.log(mainContact)
        console.log(contactNumber)
        console.log(email)
        console.log(address)


        if (validate()) {

          myRecord.setValue({
            fieldId: 'custpage_trading_entity2',
            value: tradingEntity
          });
          myRecord.setValue({
            fieldId: 'custpage_main_contact2',
            value: mainContact
          });
          myRecord.setValue({
            fieldId: 'custpage_email2',
            value: email
          });
          myRecord.setValue({
            fieldId: 'custpage_address2',
            value: address
          });

          document.getElementById('submitter').click();

        }

      });

      $(document).on("click", "#uploadDeed", function (e) {

        tradingEntity = $('#tradingEntity').val();
        mainContact = $('#mainContact').val();
        contactNumber = $('#contactNumber').val();
        email = $('#email').val();
        address = $('#address').val();

        console.log(tradingEntity)
        console.log(mainContact)
        console.log(contactNumber)
        console.log(email)
        console.log(address)


        if (validate()) {

          myRecord.setValue({
            fieldId: 'custpage_trading_entity2',
            value: tradingEntity
          });
          myRecord.setValue({
            fieldId: 'custpage_main_contact2',
            value: mainContact
          });
          myRecord.setValue({
            fieldId: 'custpage_email2',
            value: email
          });
          myRecord.setValue({
            fieldId: 'custpage_address2',
            value: address
          });

          document.getElementById('submitter').click();

        }

      });

      $(document).on("click", "#businessValuationApproved", function (e) {

        if (zeeleadid != 0) {
          var zeeRecord = record.load({
            type: record.Type.PARTNER,
            id: zeeleadid
          });

          zeeRecord.setValue({
            fieldId: 'custentity_valuation_approved',
            value: 1
          });
          zeeRecord.save();
        }

        document.getElementById('submitter').click();
      });

      $(document).on("click", "#saveZeeLead", function (e) {

        tradingEntity = $('#tradingEntity').val();
        mainContact = $('#mainContact').val();
        contactNumber = $('#contactNumber').val();
        email = $('#email').val();
        address = $('#address').val();

        lowPrice = $('#lowPrice').val();
        highPrice = $('#highPrice').val();
        serviceRevenue = $('#serviceRevenue').val();
        serviceRevenueYear = $('#serviceRevenueYear').val();
        mpexRevenue = $('#mpexRevenue').val();
        mpexRevenueYear = $('#mpexRevenueYear').val();
        sendleRevenue = $('#sendleRevenue').val();
        sendleRevenueYear = $('#sendleRevenueYear').val();
        salesCommission = $('#salesCommission').val();
        nabAccreditation = $('#nabAccreditation').val();
        nabAccreditationFee = $('#nabAccreditationFee').val();
        finalPurchasePrice = $('#finalPurchasePrice').val();
        businessStartDate = $('#businessStartDate').val();
        dailyRunTime = $('#dailyRunTime').val();
        termOnIM = $('#termOnIM').val();

        console.log('finalPurchasePrice ' + finalPurchasePrice);

        if (validateRevenueComms()) {

          if (zeeleadid != 0) {
            var zeeRecord = record.load({
              type: record.Type.PARTNER,
              id: zeeleadid
            });

            zeeRecord.setValue({
              fieldId: 'custentity_low_price',
              value: lowPrice
            });
            zeeRecord.setValue({
              fieldId: 'custentity_high_price',
              value: highPrice
            });
            zeeRecord.setValue({
              fieldId: 'custentity_nab_accreditation',
              value: nabAccreditation
            });
            zeeRecord.setValue({
              fieldId: 'custentity_nab_accreditation_fee',
              value: nabAccreditationFee
            });
            zeeRecord.setValue({
              fieldId: 'custentity_sales_commission',
              value: salesCommission
            });
            zeeRecord.setValue({
              fieldId: 'custentity_service_revenue',
              value: serviceRevenue
            });
            zeeRecord.setValue({
              fieldId: 'custentity_service_revenue_year',
              value: serviceRevenueYear
            });
            zeeRecord.setValue({
              fieldId: 'custentity_mpex_revenue',
              value: mpexRevenue
            });
            zeeRecord.setValue({
              fieldId: 'custentitympex_revenue_year',
              value: mpexRevenueYear
            });
            zeeRecord.setValue({
              fieldId: 'custentity_sendle_revenue',
              value: sendleRevenue
            });
            zeeRecord.setValue({
              fieldId: 'custentity_sendle_revenue_year',
              value: sendleRevenueYear
            });
            zeeRecord.setValue({
              fieldId: 'custentity_final_sale_price',
              value: finalPurchasePrice
            });

            zeeRecord.setValue({
              fieldId: 'custentity_business_start_date',
              value: formatDate(businessStartDate)
            });

            zeeRecord.setValue({
              fieldId: 'custentity_total_daily_runtime',
              value: dailyRunTime
            });

            zeeRecord.setValue({
              fieldId: 'custentity_term_on_im',
              value: termOnIM
            });

            zeeRecord.save();

          }

          document.getElementById('submitter').click();

        }

      });

      afterLoad();

      $(document).on("click", '#backButton', function (e) {
        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1427&deploy=1'
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
      setTimeout(function () {
        $('#alert').hide();
      }, 5000);
    }

    function validate() {
      var errorMessage = '';
      if (isNullorEmpty(tradingEntity)) {
        errorMessage += 'Please Enter Trading Entity</br>';
      }

      if (isNullorEmpty(mainContact)) {
        errorMessage += 'Please Enter Main Contact</br>';
      }

      if (isNullorEmpty(contactNumber)) {
        errorMessage += 'Please Enter Mobile Number</br>';
      }

      if (isNullorEmpty(email)) {
        errorMessage += 'Please Enter Email</br>';
      }

      if (isNullorEmpty(address)) {
        errorMessage += 'Please Enter Address</br>';
      }

      if (!isNullorEmpty(errorMessage)) {
        showAlert(errorMessage);
        return false;
      } else {
        return true;
      }
    }

    function validateRevenueComms() {
      var errorMessage = '';
      if (isNullorEmpty(tradingEntity)) {
        errorMessage += 'Please Enter Trading Entity</br>';
      }

      if (isNullorEmpty(mainContact)) {
        errorMessage += 'Please Enter Main Contact</br>';
      }

      if (isNullorEmpty(contactNumber)) {
        errorMessage += 'Please Enter Mobile Number</br>';
      }

      if (isNullorEmpty(email)) {
        errorMessage += 'Please Enter Email</br>';
      }

      if (isNullorEmpty(address)) {
        errorMessage += 'Please Enter Address</br>';
      }

      if (isNullorEmpty(businessStartDate)) {
        errorMessage += 'Please Enter Business Start Date</br>';
      }
      if (isNullorEmpty(dailyRunTime)) {
        errorMessage += 'Please Enter Total Daily Runtime</br>';
      }
      if (isNullorEmptyExcZero(lowPrice)) {
        errorMessage += 'Please Enter Low Price</br>';
      }

      if (isNullorEmptyExcZero(highPrice)) {
        errorMessage += 'Please Enter High Price</br>';
      }

      if (isNullorEmptyExcZero(serviceRevenue)) {
        errorMessage += 'Please Enter Service Revenue</br>';
      }

      if (isNullorEmpty(serviceRevenueYear)) {
        errorMessage += 'Please Enter Service Revenue Year</br>';
      }

      if (isNullorEmptyExcZero(mpexRevenue)) {
        errorMessage += 'Please Enter MPEX Revenue</br>';
      }

      if (isNullorEmpty(mpexRevenueYear)) {
        errorMessage += 'Please Enter MPEX Revenue Year</br>';
      }

      if (isNullorEmptyExcZero(sendleRevenue)) {
        errorMessage += 'Please Enter Sendle Revenue</br>';
      }

      if (isNullorEmpty(sendleRevenueYear)) {
        errorMessage += 'Please Enter Sendle Revenue Year</br>';
      }

      if (isNullorEmptyExcZero(salesCommission)) {
        errorMessage += 'Please Enter Sales Commission</br>';
      }

      if (isNullorEmpty(nabAccreditation)) {
        errorMessage += 'Please Select NAB Accreditation</br>';
      }

      if (isNullorEmptyExcZero(nabAccreditationFee)) {
        errorMessage += 'Please Enter NAB Accreditation Fee</br>';
      }

      if (isNullorEmptyExcZero(finalPurchasePrice)) {
        errorMessage += 'Please Enter Sale Price</br>';
      }

      if (isNullorEmpty(termOnIM)) {
        errorMessage +=
          'Please Enter Term that needs to be shown in the Franchisee IM</br>';
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

    function isNullorEmptyExcZero(strVal) {
      return (strVal == null || strVal == '' || strVal == 'null' || strVal ==
        undefined || strVal == 'undefined' || strVal == '- None -');
    }

    return {
      pageInit: pageInit,
      saveRecord: saveRecord
    }
  });
