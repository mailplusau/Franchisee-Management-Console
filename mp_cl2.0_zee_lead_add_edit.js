/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-12-24T09:19:53+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-03-15T15:57:32+11:00
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

      $(document).on("click", "#sendEOI", function(e) {

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        leadEmail = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        old_comments = $('#old_comments').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();
        // interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()

        if (validate()) {
          var zeeSalesLeadRecord = record.load({
            type: 'customrecord_zee_sales_leads',
            id: zeeleadid
          });

          zeeSalesLeadRecord.setValue({
            fieldId: 'custrecord_eoi_sent',
            value: 1
          });

          zeeSalesLeadRecord.save();
          createUpdateRecord();

          var suiteletUrl =
            'https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1'

          suiteletUrl += '&rectype=customer&template=130';
          suiteletUrl += '&recid=1646178&salesrep=409635&dear=' + '' +
            '&contactid=' + null + '&userid=' + userId;

          console.log(suiteletUrl);

          var response = https.get({
            url: suiteletUrl
          });

          var emailHtml = response.body;

          console.log(emailHtml);

          email.send({
            author: 112209,
            body: emailHtml,
            recipients: leadEmail,
            subject: 'MailPlus Expression of Interest Form'
          });


          var url = baseURL +
            '/app/site/hosting/scriptlet.nl?script=1411&deploy=1&zeeleadid=' +
            zeeleadid;
          window.location.href = url;
        }

      });

      $(document).on("click", "#sendIM", function(e) {

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        leadEmail = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        old_comments = $('#old_comments').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();
        // interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()

        if (validate()) {

          myRecord.setValue({
            fieldId: 'custpage_imsent',
            value: '1'
          })

          myRecord.setValue({
            fieldId: 'custpage_interestedzees',
            value: listedForSaleZees
          });

          createUpdateRecord();
          document.getElementById('submitter').click();
        }

      });

      $(document).on("click", "#saveZeeLead", function(e) {

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        leadEmail = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        old_comments = $('#old_comments').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();

        // interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()

        salePrice = $('#salePrice').val()
        incGST = $('#incGST').val()
        totalSalePrice = $('#totalPrice').val()

        if (validate()) {
          document.getElementById('submitter').click();
        }

      });

      $('#salePrice').focusout(function(e) {
        salePrice = $('#salePrice').val()
        incGST = $('#incGST').val()

        if (incGST == 1) {
          totalSalePrice = parseFloat(salePrice) + (parseFloat(salePrice) *
            0.1);
        } else {
          totalSalePrice = parseFloat(salePrice);
        }

        $('#totalPrice').val(totalSalePrice)
      });


      $(document).on("change", "#zeeListedSale", function(e) {
        selectedZees = $(this).val();
        for (var i = 0; i < selectedZees.length; i++) {

          var zeeSalesLeadRecord = record.load({
            type: record.Type.PARTNER,
            id: selectedZees[i]
          });

          lowPrice = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_low_price'
          });
          highPrice = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_high_price'
          });
          nabAccreditation = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_nab_accreditation'
          });
          nabAccreditationFee = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_nab_accreditation_fee'
          });
          salesCommission = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_sales_commission'
          });
          serviceRevenue = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_service_revenue'
          });
          serviceRevenueYear = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_service_revenue_year'
          });
          mpexRevenue = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_mpex_revenue'
          });
          mpexRevenueYear = zeeSalesLeadRecord.getValue({
            fieldId: 'custentitympex_revenue_year'
          });
          sendleRevenue = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_sendle_revenue'
          });
          sendleRevenueYear = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_sendle_revenue_year'
          });
          finalPurchasePrice = zeeSalesLeadRecord.getValue({
            fieldId: 'custentity_final_sale_price'
          });
          // finalPurchasePrice = zeeSalesLeadRecord.getValue({
          //   fieldId: 'custentity_territory_map'
          // });
          $('#lowPrice').val(lowPrice.toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g, "$&,"));
          $('#highPrice').val(highPrice.toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g, "$&,"));
          $('#nabAccreditation').val(nabAccreditation);
          $('#nabAccreditationFee').val(parseFloat(nabAccreditationFee).toFixed(
            2).replace(/\d(?=(\d{3})+\.)/g, "$&,"));
          $('#salesCommission').val(salesCommission.toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g, "$&,"));
          $('#serviceRevenue').val(serviceRevenue.toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g, "$&,"));
          $('#serviceRevenueYear').val(serviceRevenueYear);
          $('#mpexRevenue').val(mpexRevenue.toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g, "$&,"));
          $('#mpexRevenueYear').val(mpexRevenueYear);
          $('#sendleRevenue').val(sendleRevenue.toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g, "$&,"));
          $('#sendleRevenueYear').val(sendleRevenueYear);
          $('#finalPurchasePrice').val(finalPurchasePrice.toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g, "$&,"));
          $('.presales_div').removeClass('hide');

        }

      });

      $(document).on("change", "#incGST", function(e) {
        salePrice = $('#salePrice').val()
        incGST = $('#incGST').val()

        if (incGST == 1) {
          totalSalePrice = parseFloat(salePrice) + (parseFloat(salePrice) *
            0.1);
        } else {
          totalSalePrice = parseFloat(salePrice);
        }

        $('#totalPrice').val(totalSalePrice)
      });

      $(document).on("change", "#franchiseeTypeOfOwner", function(e) {
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();

        if (franchiseeTypeOfOwner == 2 || franchiseeTypeOfOwner == 3) {
          $(".progress_section").removeClass("hide");
          $(".employment_section").addClass("hide");
          if (franchiseeTypeOfOwner == 2) {
            $(".vehicle_section").addClass("hide");
          }
          $(".finance_main_section").removeClass("hide");
          $(".finance_section").removeClass("hide");
          $(".investment_section").removeClass("hide");
          $(".potentialZees_section").removeClass("hide");
          $(".zee_section").removeClass("hide");
          $(".zeeListedSale_section").removeClass("hide");

          $('.franchiseeTypeOfOwner_section').addClass('col-xs-12').removeClass(
            'col-xs-6');
          if (franchiseeTypeOfOwner == 2) {
            $('.experience_section').addClass('col-xs-12').removeClass(
              'col-xs-6');
          }
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

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        leadEmail = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        old_comments = $('#old_comments').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();

        // interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()

        if (validate()) {
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

          createUpdateRecord();

          var url = baseURL +
            '/app/site/hosting/scriptlet.nl?script=1411&deploy=1&zeeleadid=' +
            zeeleadid;
          window.location.href = url;
        }

      });

      $(document).on('click', '.stageQualified', function(e) {
        zeeleadid = $(this).attr("data-id");

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        leadEmail = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        old_comments = $('#old_comments').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();

        // interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()

        if (validate()) {

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

          createUpdateRecord();

          var url = baseURL +
            '/app/site/hosting/scriptlet.nl?script=1411&deploy=1&zeeleadid=' +
            zeeleadid;
          window.location.href = url;
        }

      });

      $(document).on('click', '.stageOpportunity', function(e) {
        zeeleadid = $(this).attr("data-id");

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        leadEmail = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        old_comments = $('#old_comments').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();
        reminder = $('#reminder').val();
        owner = $('#owner').val();
        owner_text = $("#owner option:selected").text();

        // interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()

        if (validate()) {

          // interestedZees = $('#zeeList').val()
          listedForSaleZees = $('#zeeListedSale').val()

          var errorMessage = '';

          var combinedInterestedZees = [];
          if (isNullorEmpty(listedForSaleZees)) {
            errorMessage += 'Please Select potential franchisees</br>';
            if (!isNullorEmpty(errorMessage)) {
              showAlert(errorMessage);
              return false;
            }
          }

          if (isNullorEmpty(reminder)) {
            errorMessage += 'Please Select Reminder Date</br>';
            if (!isNullorEmpty(errorMessage)) {
              showAlert(errorMessage);
              return false;
            }
          } else {
            var reminderArray = reminder.split('-')
            reminder = reminderArray[1] + '/' + reminderArray[2] + '/' +
              reminderArray[0]

          }

          if (isNullorEmpty(owner)) {
            errorMessage += 'Please Select Owner</br>';
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
            fieldId: 'custrecord_reminder_date',
            value: formatDate(reminder)
          });

          zeeSalesLeadRecord.setValue({
            fieldId: 'owner',
            value: owner
          });

          combineComments += old_comments + "\n";
          var dateToday = getDateToday().toString();
          var dateReminder = formatDate(reminder).toString();
          var dateSplitToday = dateToday.split("GMT");
          var dateSplitReminder = dateReminder.split("GMT");
          combineComments += dateSplitToday[0] +
            ' - Comment: Reminder Set for ' + dateSplitReminder[0] +
            ' for ' + owner_text;

          console.log(combineComments);

          zeeSalesLeadRecord.setValue({
            fieldId: 'custrecord_comments',
            value: combineComments
          });

          zeeSalesLeadRecord.setValue({
            fieldId: 'custrecord_date_opportunity',
            value: getDateToday()
          });

          zeeSalesLeadRecord.save();

          createUpdateRecord();

          var url = baseURL +
            '/app/site/hosting/scriptlet.nl?script=1411&deploy=1&zeeleadid=' +
            zeeleadid;
          window.location.href = url;
        }

      });

      $(document).on('click', '.eoiApprovedMichael', function(e) {
        zeeleadid = $(this).attr("data-id");

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        leadEmail = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        old_comments = $('#old_comments').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();

        // interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()
        var errorMessage = '';
        if (eoiSent == 1 || eoiSent == '1') {
          if (validate()) {

            // interestedZees = $('#zeeList').val()
            listedForSaleZees = $('#zeeListedSale').val()

            var combinedInterestedZees = [];
            if (isNullorEmpty(listedForSaleZees)) {
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
              value: 7
            });

            zeeSalesLeadRecord.setValue({
              fieldId: 'custrecord_date_michael_approved',
              value: getDateToday()
            });

            zeeSalesLeadRecord.save();

            createUpdateRecord();

            var url = baseURL +
              '/app/site/hosting/scriptlet.nl?script=1411&deploy=1&zeeleadid=' +
              zeeleadid;
            window.location.href = url;
          }
        } else {
          errorMessage += 'Please Send Expression of Interest.</br>';
          if (!isNullorEmpty(errorMessage)) {
            showAlert(errorMessage);
            return false;
          }
        }


      });

      $(document).on('click', '.eoiApprovedChris', function(e) {
        zeeleadid = $(this).attr("data-id");

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        leadEmail = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        old_comments = $('#old_comments').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();

        // interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()
        var errorMessage = '';
        if (eoiSent == 1 || eoiSent == '1') {
          if (validate()) {

            // interestedZees = $('#zeeList').val()
            listedForSaleZees = $('#zeeListedSale').val()

            var combinedInterestedZees = [];
            if (isNullorEmpty(listedForSaleZees)) {
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
              value: 8
            });

            zeeSalesLeadRecord.setValue({
              fieldId: 'custrecord_date_chris_approved',
              value: getDateToday()
            });

            zeeSalesLeadRecord.save();

            createUpdateRecord();

            var url = baseURL +
              '/app/site/hosting/scriptlet.nl?script=1411&deploy=1&zeeleadid=' +
              zeeleadid;
            window.location.href = url;
          }
        } else {
          errorMessage += 'Please Send Expression of Interest.</br>';
          if (!isNullorEmpty(errorMessage)) {
            showAlert(errorMessage);
            return false;
          }
        }


      });

      $(document).on('click', '.uploadEOI', function(e) {
        zeeleadid = $(this).attr("data-id");

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        leadEmail = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        old_comments = $('#old_comments').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();

        // interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()
        var errorMessage = '';
        if (eoiSent == 1 || eoiSent == '1') {
          if (validate()) {

            // interestedZees = $('#zeeList').val()
            listedForSaleZees = $('#zeeListedSale').val()

            var combinedInterestedZees = [];
            if (isNullorEmpty(listedForSaleZees)) {
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
              value: 9
            });

            zeeSalesLeadRecord.setValue({
              fieldId: 'custrecord_date_eoi_uploaded',
              value: getDateToday()
            });

            zeeSalesLeadRecord.save();

            document.getElementById('submitter').click();
          }
        } else {
          errorMessage += 'Please Send Expression of Interest.</br>';
          if (!isNullorEmpty(errorMessage)) {
            showAlert(errorMessage);
            return false;
          }
        }


      });

      $(document).on('click', '.financialsStep', function(e) {
        zeeleadid = $(this).attr("data-id");

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        leadEmail = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        old_comments = $('#old_comments').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();

        // interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()

        salePrice = $('#salePrice').val()
        incGST = $('#incGST').val()
        totalSalePrice = $('#totalPrice').val()


        var errorMessage = '';
        if (eoiSent == 1 || eoiSent == '1') {
          if (validate()) {

            // interestedZees = $('#zeeList').val()
            listedForSaleZees = $('#zeeListedSale').val()

            var combinedInterestedZees = [];
            if (isNullorEmpty(listedForSaleZees)) {
              errorMessage += 'Please Select potential franchisees</br>';
              if (!isNullorEmpty(errorMessage)) {
                showAlert(errorMessage);
                return false;
              }
            }

            if (isNullorEmpty(salePrice)) {
              errorMessage += 'Please Enter Sale Price</br>';
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
              value: 10
            });
            zeeSalesLeadRecord.setValue({
              fieldId: 'custrecord_sale_price',
              value: salePrice
            });
            zeeSalesLeadRecord.setValue({
              fieldId: 'custrecord_inc_gst',
              value: incGST
            });
            zeeSalesLeadRecord.setValue({
              fieldId: 'custrecord_total_sale_price',
              value: totalSalePrice
            });

            zeeSalesLeadRecord.setValue({
              fieldId: 'custrecord_date_finance_stage',
              value: getDateToday()
            });

            zeeSalesLeadRecord.save();

            document.getElementById('submitter').click();
          }
        } else {
          errorMessage += 'Please Send Expression of Interest.</br>';
          if (!isNullorEmpty(errorMessage)) {
            showAlert(errorMessage);
            return false;
          }
        }


      });

      $('#listforSale').click(function() {
        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1399&deploy=1';
        window.location.href = url;
      });

      $('#editPresales').click(function() {
        var zeeid = $(this).attr("data-id");
        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1430&deploy=1&zeeid=' +
          zeeid;
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

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        leadEmail = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        old_comments = $('#old_comments').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();
        interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()

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

        createUpdateRecord();

        var suiteletUrl =
          'https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1'

        suiteletUrl += '&rectype=customer&template=131';
        suiteletUrl += '&recid=1646178&salesrep=409635&dear=' + '' +
          '&contactid=' + null + '&userid=' + userId;

        console.log(suiteletUrl);

        var response = https.get({
          url: suiteletUrl
        });

        var emailHtml = response.body;

        console.log(emailHtml);

        email.send({
          author: 112209,
          body: emailHtml,
          recipients: leadEmail,
          subject: 'Your MailPlus enquiry is now closed.'
        });

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1'
        window.location.href = url;
      });

      $('#zeeNoTerritory').click(function() {
        zeeleadid = $(this).attr("data-id");

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        leadEmail = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        old_comments = $('#old_comments').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();
        interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()

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

        createUpdateRecord();

        var suiteletUrl =
          'https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1'

        suiteletUrl += '&rectype=customer&template=132';
        suiteletUrl += '&recid=1646178&salesrep=409635&dear=' + '' +
          '&contactid=' + null + '&userid=' + userId;

        console.log(suiteletUrl);

        var response = https.get({
          url: suiteletUrl
        });

        var emailHtml = response.body;

        console.log(emailHtml);

        email.send({
          author: 112209,
          body: emailHtml,
          recipients: leadEmail,
          subject: 'Your MailPlus Franchise enquiry'
        });


        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1'
        window.location.href = url;
      });

      $('#opportunityDenied').click(function() {
        zeeleadid = $(this).attr("data-id");

        firstName = $('#firstName').val();
        lastName = $('#lastName').val();
        mobile = $('#mobile').val();
        leadEmail = $('#email').val();
        franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
        vehicle = $('#vehicle').val();
        experience = $('#experience').val();
        employment = $('#employment').val();
        finance = $('#finance').val();
        investment = $('#investment').val();
        old_comments = $('#old_comments').val();
        comments = $('#comments').val();
        state = $('#state').val();
        postcode = $('#postcode').val();
        suburb = $('#city').val();
        // interestedZees = $('#zeeList').val()
        listedForSaleZees = $('#zeeListedSale').val()

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

        createUpdateRecord();

        var suiteletUrl =
          'https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1'

        suiteletUrl += '&rectype=customer&template=133';
        suiteletUrl += '&recid=1646178&salesrep=409635&dear=' + '' +
          '&contactid=' + null + '&userid=' + userId;

        console.log(suiteletUrl);

        var response = https.get({
          url: suiteletUrl
        });

        var emailHtml = response.body;

        console.log(emailHtml);

        email.send({
          author: 112209,
          body: emailHtml,
          recipients: leadEmail,
          subject: 'MailPlus EOI outcome '
        });

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
      var combinedInterestedZees = [];
      if (!isNullorEmpty(listedForSaleZees)) {
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
        value: leadEmail
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
      if (!isNullorEmpty(comments)) {
        combineComments += +"\n" + old_comments + "\n";
        var dateToday = getDateToday().toString();
        var dateSplit = dateToday.split("GMT");
        combineComments += dateSplit[0] + ' By: ' + runtime.getCurrentUser()
          .name + ' - Comment: ' + comments;

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_comments',
          value: combineComments
        });
        console.log('set comments')
      }

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
