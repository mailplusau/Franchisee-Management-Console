/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-12-24T09:19:53+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-01-17T16:28:47+11:00
 */


define(['N/email', 'N/runtime', 'N/search', 'N/record', 'N/http', 'N/log',
    'N/error', 'N/url', 'N/format', 'N/currentRecord'
  ],
  function(email, runtime, search, record, http, log, error, url, format,
    currentRecord) {
    var zee = '0';
    var userId = 0;
    var role = 0;

    var firstName = '';
    var lastName = '';
    var mobile = '';
    var email = '';
    var franchiseeTypeOfOwner = '0';
    var vehicle = '0';
    var experience = '0';
    var employment = '0';
    var finance = '0';
    var investment = '0';
    var classification = '0';
    var salesStage = '0';
    var comments = '';
    var suburb = '';
    var state = '';
    var postcode = '';
    var interestedZees = []
    var listedForSaleZees = []

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

      $(document).on("click", "#saveZeeLead", function(e) {

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        email = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();

        interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()

        if (validate()) {
          document.getElementById('submitter').click();
        }

      });

      $(document).on("change", "#franchiseeTypeOfOwner", function(e) {
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();

        if (franchiseeTypeOfOwner == 2 || franchiseeTypeOfOwner == 3) {
          $(".progress_section").removeClass("hide");
          $(".employment_section").addClass("hide");
          $(".vehicle_section").addClass("hide");
          $(".finance_main_section").removeClass("hide");
          $(".finance_section").removeClass("hide");
          $(".investment_section").removeClass("hide");
          $(".potentialZees_section").removeClass("hide");
          $(".zee_section").removeClass("hide");
          $(".zeeListedSale_section").removeClass("hide");
          $('.franchiseeTypeOfOwner_section').addClass('col-xs-12').removeClass(
            'col-xs-6');
          $('.experience_section').addClass('col-xs-12').removeClass(
            'col-xs-6');
        } else if (franchiseeTypeOfOwner == 4) {
          $(".progress_section").addClass("hide");
          $(".employment_section").removeClass("hide");
          $(".vehicle_section").removeClass("hide");
          $(".finance_main_section").addClass("hide");
          $(".finance_section").addClass("hide");
          $(".investment_section").addClass("hide");
          $(".potentialZees_section").addClass("hide");
          $(".zee_section").addClass("hide");
          $(".zeeListedSale_section").addClass("hide");
          $('.franchiseeTypeOfOwner_section').addClass('col-xs-6').removeClass(
            'col-xs-12');
          $('.experience_section').addClass('col-xs-6').removeClass(
            'col-xs-12');
        }

      });

      $(document).on('click', '.stageNewLead', function(e) {
        zeeleadid = $(this).attr("data-id");

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeleadid
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_stage',
          value: 1
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_qualified_lead',
          value: null
        });
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_qualified_no_territory',
          value: null
        });
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_opportunity',
          value: null
        });
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_lead_lost',
          value: null
        });
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_opportunity_denied',
          value: null
        });


        zeeSalesLeadRecord.save();

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1411&deploy=1&zeeleadid=' +
          zeeleadid;
        window.location.href = url;

      });

      $(document).on('click', '.stageQualified', function(e) {
        zeeleadid = $(this).attr("data-id");

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeleadid
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_stage',
          value: 2
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_qualified_lead',
          value: getDateToday()
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_opportunity',
          value: null
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_qualified_no_territory',
          value: null
        });
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_opportunity',
          value: null
        });
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_lead_lost',
          value: null
        });
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_opportunity_denied',
          value: null
        });

        zeeSalesLeadRecord.save();

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1411&deploy=1&zeeleadid=' +
          zeeleadid;
        window.location.href = url;

      });

      $(document).on('click', '.stageOpportunity', function(e) {
        zeeleadid = $(this).attr("data-id");

        interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()

        var errorMessage = '';

        var combinedInterestedZees = [];
        if (!isNullorEmpty(listedForSaleZees) && !isNullorEmpty(
            interestedZees)) {
          combinedInterestedZees = listedForSaleZees.concat(
            interestedZees)
        } else if (isNullorEmpty(listedForSaleZees) && !isNullorEmpty(
            interestedZees)) {
          combinedInterestedZees = interestedZees
        } else if (!isNullorEmpty(listedForSaleZees) && isNullorEmpty(
            interestedZees)) {
          combinedInterestedZees = listedForSaleZees
        } else if (isNullorEmpty(listedForSaleZees) && isNullorEmpty(
            interestedZees)) {
          errorMessage += 'Please Select potential franchisees</br>';
          if (!isNullorEmpty(errorMessage)) {
            showAlert(errorMessage);
            return false;
          }
        }

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeleadid
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
          '/app/site/hosting/scriptlet.nl?script=1411&deploy=1&zeeleadid=' +
          zeeleadid;
        window.location.href = url;

      });

      $("#zeeLeadLost").click(function() {
          zeeleadid = $(this).attr("data-id");
          $('.input-group').removeClass('input-group');
          $('.reason_input_group').addClass('input-group');
          console.log('inside modal')
          console.log(zeeleadid)
          $("#zeeleadid").val(zeeleadid);

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

      $('#zeeNoTerritory').click(function() {
        zeeleadid = $(this).attr("data-id");

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeleadid
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_lost_reason',
          value: 3
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
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1'
        window.location.href = url;
      });

      $('#opportunityDenied').click(function() {
        zeeleadid = $(this).attr("data-id");

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeleadid
        });

        // zeeSalesLeadRecord.setValue({
        //   fieldId: 'custrecord_zee_lead_lost_reason',
        //   value: $("#lostReason").val()
        // });

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

      if (isNullorEmpty(email)) {
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

    function saveRecord() {

      console.log('inside save function')
      console.log('zeeleadid: ' + zeeleadid)

      var combinedInterestedZees = [];
      if (!isNullorEmpty(listedForSaleZees) && !isNullorEmpty(interestedZees)) {
        combinedInterestedZees = listedForSaleZees.concat(interestedZees)
      } else if (isNullorEmpty(listedForSaleZees) && !isNullorEmpty(
          interestedZees)) {
        combinedInterestedZees = interestedZees
      } else if (!isNullorEmpty(listedForSaleZees) && isNullorEmpty(
          interestedZees)) {
        combinedInterestedZees = listedForSaleZees
      }

      console.log(combinedInterestedZees)

      if (isNullorEmpty(zeeleadid)) {
        console.log('create record')
        var zeeSalesLeadRecord = record.create({
          type: 'customrecord_zee_sales_leads'
        });
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_date_entered',
          value: getDateToday()
        });
        console.log('set date')
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_stage',
          value: 1
        });
        console.log('set stage')

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_classification',
          value: 5
        });
        console.log('set classification')

      } else {
        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeleadid
        });
      }

      zeeSalesLeadRecord.setValue({
        fieldId: 'custrecord_zee_leads_fname',
        value: firstName
      });
      console.log('set fname')
      zeeSalesLeadRecord.setValue({
        fieldId: 'custrecord_zee_leads_lname',
        value: lastName
      });
      console.log('set lname')
      zeeSalesLeadRecord.setValue({
        fieldId: 'name',
        value: firstName + ' ' + lastName
      });
      console.log('set name')

      zeeSalesLeadRecord.setValue({
        fieldId: 'custrecord_zee_lead_mobile',
        value: mobile
      });
      console.log('set mobile')
      zeeSalesLeadRecord.setValue({
        fieldId: 'custrecord_zee_lead_email',
        value: email
      });
      console.log('set email')
      if (!isNullorEmpty(finance)) {
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_finance_required',
          value: finance
        });
        console.log('set finance')
      }
      if (!isNullorEmpty(investment)) {
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_investment_bracket',
          value: investment
        });
        console.log('set investment')
      }
      if (!isNullorEmpty(vehicle)) {
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_own_a_vehicle',
          value: vehicle
        });
        console.log('set vehicle')
      }
      if (!isNullorEmpty(franchiseeTypeOfOwner)) {
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_type_of_owner',
          value: franchiseeTypeOfOwner
        });
        console.log('set owner')
      }
      if (!isNullorEmpty(experience)) {
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_years_of_experience',
          value: experience
        });
        console.log('set experience')
      }
      if (!isNullorEmpty(employment)) {
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_type_of_employement',
          value: employment
        });
        console.log('set employment')
      }
      if (!isNullorEmpty(combinedInterestedZees)) {
        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_leads_interested_zees',
          value: combinedInterestedZees
        });
        console.log('set interested zees')
      }
      zeeSalesLeadRecord.setValue({
        fieldId: 'custrecord_comments',
        value: comments
      });
      console.log('set comments')
      zeeSalesLeadRecord.setValue({
        fieldId: 'custrecord_areas_of_interest_suburb',
        value: suburb
      });
      console.log('set suburb')
      zeeSalesLeadRecord.setValue({
        fieldId: 'custrecord_areas_of_interest_state',
        value: stateID(state)
      });
      console.log('set state')
      zeeSalesLeadRecord.setValue({
        fieldId: 'custrecord_areas_of_interest_postcode',
        value: postcode
      });
      console.log('set postcode')

      zeeSalesLeadRecord.save();

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