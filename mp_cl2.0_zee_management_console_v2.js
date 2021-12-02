/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-02T08:24:43+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-12-02T09:11:13+11:00
 */


define(['SuiteScripts/jQuery Plugins/Moment JS/moment.min', 'N/email',
    'N/runtime', 'N/search', 'N/record', 'N/http', 'N/log',
    'N/error', 'N/url', 'N/format', 'N/currentRecord'
  ],
  function(moment, email, runtime, search, record, http, log, error, url,
    format,
    currentRecord) {
    var zee = 0;
    var franchiseeName = 0;
    var userId = 0;
    var role = 0;

    var search_markers_array = [];
    var run_markers_array = [];
    var color_array = ['blue', 'red', 'green', 'orange', 'black'];

    var days_of_week = [];
    days_of_week[0] = 0;
    days_of_week[1] = 'custrecord_service_freq_day_mon';
    days_of_week[2] = 'custrecord_service_freq_day_tue';
    days_of_week[3] = 'custrecord_service_freq_day_wed';
    days_of_week[4] = 'custrecord_service_freq_day_thu';
    days_of_week[5] = 'custrecord_service_freq_day_fri';
    days_of_week[6] = 6;

    var baseURL = 'https://1048144.app.netsuite.com';
    if (runtime.EnvType == "SANDBOX") {
      baseURL = 'https://1048144-sb3.app.netsuite.com';
    }

    role = runtime.getCurrentUser().role;
    var userName = runtime.getCurrentUser().name;
    var userId = runtime.getCurrentUser().id;
    var currRec = currentRecord.get();

    var tollUploadSet = [];

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

    function afterLoad() {
      $(".se-pre-con").fadeOut("slow");
    }

    function pageInit() {

      $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
      $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
      $("#body").css("background-color", "#CFE0CE");

      var myRecord = currentRecord.get();

      // Set the value of another custom field
      zee = myRecord.getValue({
        fieldId: 'custpage_zee'
      });
      franchiseeName = myRecord.getValue({
        fieldId: 'custpage_name'
      });
      var day = myRecord.getValue({
        fieldId: 'custpage_day'
      });

      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: {
          lat: -27.833,
          lng: 133.583
        }
      });
      var legend = document.getElementById('legend');
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

      if (role != 1000) {
        map.data.loadGeoJson(
          'https://1048144.app.netsuite.com/core/media/media.nl?id=3772482&c=1048144&h=4579935b386159057056&_xt=.js'
        );
        //map.data.loadGeoJson('https://1048144-sb3.app.netsuite.com/core/media/media.nl?id=3771516&c=1048144_SB3&h=afd38c5aed85b40b9cc0&_xt=.js');
        map.data.addListener('mouseover', function(event) {
          $('#zee_territory').val(event.feature.getProperty('Territory'));
          console.log('event.feature.getProperty(Name)', event.feature.getProperty(
            'Territory'));
        });
        map.data.addListener('mouseout', function(event) {
          $('#zee_territory').val('');
        });
      }

      var runJSON_array = getRunJSON(zee, day);
      console.log('runJSON_array', runJSON_array);
      var parsedStopFreq = runJSON_array[0];
      var firststop_time = runJSON_array[1];
      var laststop_time = runJSON_array[2];

      var stops_number = parsedStopFreq.data.length;
      $('#firststop_' + zee + '').val(firststop_time);
      $('#laststop_' + zee + '').val(laststop_time);
      console.log('stops_number', stops_number);

      var stops_number_temp = 0;
      var waypoint_json = [];
      var waypoint_otherproperties = [];
      var origin = [];
      var destination = [];

      var markerArray = [];


      if (stops_number != 0) {
        var y_length = Math.ceil(stops_number / 25);
        console.log(y_length)
        var each_request_length = parseInt(Math.ceil((stops_number + (
          y_length - 1)) / y_length));
        console.log('each_request_length', each_request_length);
        for (var y = 0; y < y_length; y++) {
          // stops_number_temp = stops_number - 25;
          // origin[y] = parsedStopFreq.data[parseInt(y_length * y)].address;
          // destination[y] = parsedStopFreq.data[parseInt(each_request_length * (y + 1)) - 1].address;
          waypoint_json[y] = '[';
          waypoint_otherproperties[y] = '[';
          for (var x = (parseInt(each_request_length * y)); x < (parseInt(
              each_request_length * (y + 1))); x++) {
            if (!isNullorEmpty(parsedStopFreq.data[x - y] && !isNullorEmpty(
                parsedStopFreq.data[x - y].address))) {
              waypoint_json[y] += '{"location": "' + parsedStopFreq.data[x -
                y].address + '",'; //x - y so that the first element of an array is the last element of the previous array
              if (isNullorEmpty(parsedStopFreq.data[x - y].ncl)) {
                waypoint_otherproperties[y] += '{"name": "' + parsedStopFreq.data[
                  x - y].services[0].customer_text + '",';
                waypoint_otherproperties[y] += '"location_type": "customer",';
              } else {
                waypoint_otherproperties[y] += '{"name": "' + parsedStopFreq.data[
                  x - y].title + '",';
                waypoint_otherproperties[y] += '"location_type": "ncl",';
              }
              waypoint_json[y] += '"stopover": ' + true + '},';
              waypoint_otherproperties[y] += '"time": "' + parsedStopFreq.data[
                x - y].start + '",';
              waypoint_otherproperties[y] += '"lat": "' + parsedStopFreq.data[
                x - y].lat + '",';
              waypoint_otherproperties[y] += '"lng": "' + parsedStopFreq.data[
                x - y].lon + '"},';
            }
          }
          waypoint_json[y] = waypoint_json[y].substring(0, waypoint_json[y].length -
            1);
          waypoint_otherproperties[y] = waypoint_otherproperties[y].substring(
            0, waypoint_otherproperties[y].length - 1);
          waypoint_json[y] += ']';
          waypoint_otherproperties[y] += ']';

        }

        console.log(waypoint_json);
        console.log(waypoint_otherproperties);

        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true,
          //suppressInfoWindows: true,
          polylineOptions: {
            strokeColor: color_array[0],
          },

        });

        var stepDisplay = new google.maps.InfoWindow();

        // var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        // directionsDisplay.setMap(map);

        directionsDisplay.setPanel(document.getElementById('directionsPanel'));
        calculateAndDisplayRoute(directionsDisplay, directionsService,
          waypoint_json, markerArray, stepDisplay, map,
          waypoint_otherproperties, zee);
        addMarker(map, stepDisplay, waypoint_otherproperties, zee);

        $('.row_time').removeClass('hide');
        $('.print_section').removeClass('hide');
      } else {
        $('#run_not_scheduled_' + zee + '').removeClass('hide');
        $('.print_section').addClass('hide');
      }


      $(document).on('focus', '#address2', function(event) {
        // alert('onfocus')
        initAutocomplete();
      });


      afterLoad();

      $(document).on("change", "#zee_dropdown", function(e) {
        var zee = $(this).val();
        var url = baseURL +
          "/app/site/hosting/scriptlet.nl?script=1399&deploy=1";

        url += "&zee=" + zee + "";

        window.location.href = url;
      });

      $(document).on("click", "#serviceNetwork", function(e) {
        var zee = $('#zee_dropdown').val();
        var url = baseURL +
          "/app/site/hosting/scriptlet.nl?script=887&deploy=1";

        url += "&zee=" + zee + "";

        window.location.href = url;
      });

      $(document).on("click", "#newAgreement", function(e) {
        var zee = $('#zee_dropdown').val();
        var url =
          'https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1297&deploy=1&custparam_params={%22new_agreement%22:true,%22zee_id%22:%22' +
          zee + '%22}'

        window.location.href = url;
      });

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

    function getRunJSON(zee, day) {

      day = parseInt(day)

      console.log('zee ' + zee)
      console.log('day ' + day)

      var serviceLegSearch = search.load({
        id: 'customsearch_rp_leg_freq_all_2',
        type: 'customrecord_service_leg'
      });

      serviceLegSearch.filters.push(search.createFilter({
        name: 'custrecord_service_leg_franchisee',
        join: null,
        operator: search.Operator.ANYOF,
        values: zee
      }));
      serviceLegSearch.filters.push(search.createFilter({
        name: days_of_week[day],
        join: 'custrecord_service_freq_stop',
        operator: search.Operator.IS,
        values: 'T'
      }));


      var stop_count = 0;
      var freq_count = 0;

      var old_stop_name = null;
      var service_id_array = [];
      var service_name_array = [];
      var service_descp_array = [];
      var old_customer_id_array = [];
      var old_customer_text_array = [];
      var old_run_plan_array = [];
      var old_run_plan_text_array = [];
      var old_closing_day = [];
      var old_opening_day = [];
      var old_service_notes = [];

      var stop_id;
      var stop_name;
      var address;
      var stop_duration;
      var stop_notes;
      var stop_lat;
      var stop_lon;
      var service_id;
      var service_text;
      var customer_id;
      var customer_text;
      var ncl;
      var freq_id;
      var freq_mon;
      var freq_tue;
      var freq_wed;
      var freq_thu;
      var freq_fri;
      var freq_adhoc;
      var freq_time_current;
      var freq_time_start;
      var freq_time_end;
      var freq_run_plan;

      var old_stop_id = [];
      var old_stop_name;
      var old_service_time;
      var old_address;
      var old_stop_duration;
      var old_stop_notes = '';
      var old_stop_lat;
      var old_stop_lon;
      var old_service_id;

      var old_service_text;
      var old_customer_id;
      var old_customer_text;
      var old_ncl;
      var old_freq_id = [];
      var old_freq_mon;
      var old_freq_tue;
      var old_freq_wed;
      var old_freq_thu;
      var old_freq_fri;
      var old_freq_adhoc;
      var old_freq_time_current;
      var old_freq_time_start;
      var old_freq_time_end;
      var old_freq_run_plan;
      var old_address;

      var firststop_time;
      var laststop_time;


      var freq = [];
      var old_freq = [];

      var stop_freq_json = '{ "data": [';

      var resultSetServiceLeg = serviceLegSearch.run();

      resultSetServiceLeg.each(function(searchResult) {
        stop_id = searchResult.getValue({
          name: 'internalid',
          join: null,
          summary: "GROUP"
        });
        stop_name = searchResult.getValue({
          name: 'name',
          join: null,
          summary: "GROUP"
        });
        stop_duration = parseInt(searchResult.getValue({
          name: 'custrecord_service_leg_duration',
          join: null,
          summary: "GROUP"
        }));
        stop_notes = searchResult.getValue({
          name: 'custrecord_service_leg_notes',
          join: null,
          summary: "GROUP"
        });
        stop_lat = searchResult.getValue({
          name: "custrecord_service_leg_addr_lat",
          join: null,
          summary: "GROUP"
        });
        stop_lon = searchResult.getValue({
          name: "custrecord_service_leg_addr_lon",
          join: null,
          summary: "GROUP"
        });
        service_id = searchResult.getValue({
          name: 'custrecord_service_leg_service',
          join: null,
          summary: "GROUP"
        });
        service_text = searchResult.getText({
          name: 'custrecord_service_leg_service',
          join: null,
          summary: "GROUP"
        });
        customer_id =
          searchResult.getValue({
            name: 'custrecord_service_leg_customer',
            join: null,
            summary: "GROUP"
          });
        customer_text =
          searchResult.getText({
            name: 'custrecord_service_leg_customer',
            join: null,
            summary: "GROUP"
          });
        customer_id_text =
          searchResult.getValue({
            name: "entityid",
            join: "CUSTRECORD_SERVICE_LEG_CUSTOMER",
            summary: "GROUP"
          });
        customer_name_text =
          searchResult.getValue({
            name: "companyname",
            join: "CUSTRECORD_SERVICE_LEG_CUSTOMER",
            summary: "GROUP"
          });
        ncl =
          searchResult.getValue({
            name: 'custrecord_service_leg_non_cust_location',
            join: null,
            summary: "GROUP"
          });

        if (!isNullorEmpty(stop_notes)) {
          if (isNullorEmpty(ncl)) {
            stop_notes = '</br><b>Stop Notes</b> - ' + stop_notes +
              '</br>';
          } else {
            // stop_notes = '</br><b>Stop Notes</b> - '+customer_name_text + ' : ' + stop_notes + '</br>';
            stop_notes = '<b>Stop Notes</b> - ' + stop_notes +
              '</br>';
          }

        } else {
          stop_notes = '';
        }

        freq_id = searchResult.getValue({
          name: "internalid",
          join: "CUSTRECORD_SERVICE_FREQ_STOP",
          summary: "GROUP"
        });
        freq_mon =
          searchResult.getValue({
            name: "custrecord_service_freq_day_mon",
            join: "CUSTRECORD_SERVICE_FREQ_STOP",
            summary: "GROUP"
          });
        freq_tue =
          searchResult.getValue({
            name: "custrecord_service_freq_day_tue",
            join: "CUSTRECORD_SERVICE_FREQ_STOP",
            summary: "GROUP"
          });
        freq_wed =
          searchResult.getValue({
            name: "custrecord_service_freq_day_wed",
            join: "CUSTRECORD_SERVICE_FREQ_STOP",
            summary: "GROUP"
          });
        freq_thu =
          searchResult.getValue({
            name: "custrecord_service_freq_day_thu",
            join: "CUSTRECORD_SERVICE_FREQ_STOP",
            summary: "GROUP"
          });
        freq_fri =
          searchResult.getValue({
            name: "custrecord_service_freq_day_fri",
            join: "CUSTRECORD_SERVICE_FREQ_STOP",
            summary: "GROUP"
          });
        freq_adhoc =
          searchResult.getValue({
            name: "custrecord_service_freq_day_adhoc",
            join: "CUSTRECORD_SERVICE_FREQ_STOP",
            summary: "GROUP"
          });
        freq_time_current =
          convertTo24Hour(searchResult.getValue({
            name: "custrecord_service_freq_time_current",
            join: "CUSTRECORD_SERVICE_FREQ_STOP",
            summary: "GROUP"
          }));
        freq_time_start =
          convertTo24Hour(searchResult.getValue({
            name: "custrecord_service_freq_time_start",
            join: "CUSTRECORD_SERVICE_FREQ_STOP",
            summary: "GROUP"
          }));
        freq_time_end =
          convertTo24Hour(searchResult.getValue({
            name: "custrecord_service_freq_time_end",
            join: "CUSTRECORD_SERVICE_FREQ_STOP",
            summary: "GROUP"
          }));
        freq_run_plan =
          searchResult.getValue({
            name: "custrecord_service_freq_run_plan",
            join: "CUSTRECORD_SERVICE_FREQ_STOP",
            summary: "GROUP"
          });
        closing_day =
          searchResult.getValue({
            name: "custrecord_service_leg_closing_date",
            join: null,
            summary: "GROUP"
          });
        opening_day =
          searchResult.getValue({
            name: "custrecord_service_leg_opening_date",
            join: null,
            summary: "GROUP"
          });
        freq_run_plan_text =
          searchResult.getText({
            name: "custrecord_service_freq_run_plan",
            join: "CUSTRECORD_SERVICE_FREQ_STOP",
            summary: "GROUP"
          });
        freq_run_st_no =
          searchResult.getValue({
            name: "custrecord_service_leg_addr_st_num_name",
            join: null,
            summary: "GROUP"
          });
        freq_run_suburb =
          searchResult.getValue({
            name: "custrecord_service_leg_addr_suburb",
            join: null,
            summary: "GROUP"
          });
        freq_run_state =
          searchResult.getValue({
            name: "custrecord_service_leg_addr_state",
            join: null,
            summary: "GROUP"
          });
        freq_run_postcode =
          searchResult.getValue({
            name: "custrecord_service_leg_addr_postcode",
            join: null,
            summary: "GROUP"
          });

        if (!isNullorEmpty(freq_run_st_no)) {
          address = freq_run_st_no + ', ' + freq_run_suburb + ', ' +
            freq_run_state + ' - ' + freq_run_postcode;
        } else {
          address = freq_run_suburb + ', ' + freq_run_state + ' - ' +
            freq_run_postcode;
        }

        if (stop_count == 0) { //GET FIRST STOP TIME
          firststop_time = onTimeChange(freq_time_current);
        }

        freq = [];

        if (freq_mon == 'T') {
          freq[freq.length] = 1
        }

        if (freq_tue == 'T') {
          freq[freq.length] = 2
        }

        if (freq_wed == 'T') {
          freq[freq.length] = 3
        }

        if (freq_thu == 'T') {
          freq[freq.length] = 4
        }

        if (freq_fri == 'T') {
          freq[freq.length] = 5
        }

        if (isNullorEmpty(ncl)) {
          // stop_name = customer_id_text + ' ' + customer_name_text + ' - ' + address;
          stop_name = customer_name_text + ' \\n Address: ' + address;
        }


        if (stop_count != 0 && old_stop_name != stop_name) {
          if (!isNullorEmpty(old_freq_id.length)) {
            var freq_time_current_array = old_freq_time_current.split(
              ':');

            var min_array = convertSecondsToMinutes(old_stop_duration);

            min_array[0] = min_array[0] + parseInt(
              freq_time_current_array[1]);

            if (isNullorEmpty(old_ncl)) {
              var bg_color = '#3a87ad';
            } else {
              var bg_color = '#009688';
            }


            var date = moment().day(day).date();
            var month = moment().day(day).month();
            var year = moment().day(day).year();

            var date_of_week = date + '/' + (month + 1) + '/' + year;

            stop_freq_json += '{"id": "' + old_stop_id + '",';
            stop_freq_json += '"closing_days": "' + old_closing_day +
              '",';
            stop_freq_json += '"opening_days": "' + old_opening_day +
              '",';
            stop_freq_json += '"lat": "' + old_stop_lat + '",';
            stop_freq_json += '"lon": "' + old_stop_lon + '",';
            stop_freq_json += '"address": "' + old_address + '",';
            if (isNullorEmpty(old_ncl)) {
              for (var i = 0; i < service_id_array.length; i++) {
                if (date_of_week >= old_closing_day[i] &&
                  date_of_week <
                  old_opening_day[i]) {
                  stop_freq_json += '"title": "CLOSED - ' +
                    old_stop_name +
                    '",';
                  stop_freq_json += '"color": "#ad3a3a",';
                } else {
                  stop_freq_json += '"title": "' + old_stop_name +
                    '",';
                  stop_freq_json += '"color": "' + bg_color + '",';

                }
              }
            } else {
              stop_freq_json += '"title": "' + old_stop_name + '",';
              stop_freq_json += '"color": "' + bg_color + '",';
            }

            //var start_time = moment().day(day).hours(freq_time_current_array[0]).minutes(freq_time_current_array[1]).seconds(0).format();
            var start_time = old_freq_time_current;
            var end_time = moment().add({
              seconds: min_array[1]
            }).day(day).hours(freq_time_current_array[0]).minutes(
              min_array[0]).format();

            stop_freq_json += '"start": "' + start_time + '",';
            stop_freq_json += '"end": "' + end_time + '",';
            stop_freq_json += '"description": "' + old_stop_notes +
              '",';
            stop_freq_json += '"ncl": "' + old_ncl + '",';
            stop_freq_json += '"freq_id": "' + old_freq_id + '",';
            stop_freq_json += '"services": ['

            for (var i = 0; i < service_id_array.length; i++) {
              // nlapiLogExecution('DEBUG', 'customer', old_customer_text_array[i]);
              // nlapiLogExecution('DEBUG', 'closing day', old_closing_day[i]);
              stop_freq_json += '{';
              stop_freq_json += '"customer_id": "' +
                old_customer_id_array[i] + '",';
              stop_freq_json += '"customer_notes": "' +
                old_service_notes[
                  i] + '",';
              if (date_of_week >= old_closing_day[i] && date_of_week <
                old_opening_day[i]) {
                stop_freq_json += '"customer_text": "CLOSED - ' +
                  old_customer_text_array[i] + '",';
              } else {
                stop_freq_json += '"customer_text": "' +
                  old_customer_text_array[i] + '",';
              }



              stop_freq_json += '"run_plan": "' + old_run_plan_array[
                  i] +
                '",';
              stop_freq_json += '"run_plan_text": "' +
                old_run_plan_text_array[i] + '",';
              stop_freq_json += '"service_id": "' + service_id_array[
                  i] +
                '",';
              stop_freq_json += '"service_text": "' +
                service_name_array[
                  i] + '"';
              stop_freq_json += '},'
            }
            stop_freq_json = stop_freq_json.substring(0,
              stop_freq_json.length -
              1);
            stop_freq_json += ']},'



            old_stop_name = null;
            old_address = null;
            old_stop_lat;
            old_stop_lon;
            old_stop_id = [];
            old_closing_day = [];
            old_opening_day = [];
            service_id_array = [];
            service_name_array = [];
            old_customer_id_array = [];
            old_customer_text_array = [];
            old_freq_id = [];
            old_run_plan_array = [];
            old_run_plan_text_array = [];
            old_stop_notes = '';
            old_service_notes = [];


            old_freq = [];
            freq = [];

            if (freq_mon == 'T') {
              freq[freq.length] = 1
            }

            if (freq_tue == 'T') {
              freq[freq.length] = 2
            }

            if (freq_wed == 'T') {
              freq[freq.length] = 3
            }

            if (freq_thu == 'T') {
              freq[freq.length] = 4
            }

            if (freq_fri == 'T') {
              freq[freq.length] = 5
            }



            service_id_array[service_id_array.length] = service_id;
            old_service_notes[old_service_notes.length] = stop_notes;
            service_name_array[service_name_array.length] =
              service_text;
            old_customer_id_array[old_customer_id_array.length] =
              customer_id;
            old_customer_text_array[old_customer_text_array.length] =
              customer_id_text + ' ' + customer_name_text;
            old_run_plan_array[old_run_plan_array.length] =
              freq_run_plan;
            old_run_plan_text_array[old_run_plan_text_array.length] =
              freq_run_plan_text;
            old_closing_day[old_closing_day.length] = closing_day;
            old_opening_day[old_opening_day.length] = opening_day;
            // stop_count++;
          }
        } else {

          //var result = arraysEqual(freq, old_freq);
          if (old_service_time != freq_time_current && stop_count !=
            0) {
            if (!isNullorEmpty(old_freq_id.length)) {
              var freq_time_current_array = old_freq_time_current.split(
                ':');

              var min_array = convertSecondsToMinutes(
                old_stop_duration);

              min_array[0] = min_array[0] + parseInt(
                freq_time_current_array[1]);

              if (isNullorEmpty(old_ncl)) {
                var bg_color = '#3a87ad';
              } else {
                var bg_color = '#009688';
              }


              var date = moment().day(day).date();
              var month = moment().day(day).month();
              var year = moment().day(day).year();

              var date_of_week = date + '/' + (month + 1) + '/' +
                year;

              stop_freq_json += '{"id": "' + old_stop_id + '",';
              stop_freq_json += '"closing_days": "' + old_closing_day +
                '",';
              stop_freq_json += '"opening_days": "' + old_opening_day +
                '",';
              stop_freq_json += '"lat": "' + old_stop_lat + '",';
              stop_freq_json += '"lon": "' + old_stop_lon + '",';
              stop_freq_json += '"address": "' + old_address + '",';
              if (isNullorEmpty(old_ncl)) {
                for (var i = 0; i < service_id_array.length; i++) {
                  if (date_of_week >= old_closing_day[i] &&
                    date_of_week <
                    old_opening_day[i]) {
                    stop_freq_json += '"title": "CLOSED - ' +
                      old_stop_name + '",';
                    stop_freq_json += '"color": "#ad3a3a",';
                  } else {
                    stop_freq_json += '"title": "' + old_stop_name +
                      '",';
                    stop_freq_json += '"color": "' + bg_color + '",';

                  }
                }
              } else {
                stop_freq_json += '"title": "' + old_stop_name + '",';
                stop_freq_json += '"color": "' + bg_color + '",';
              }

              //var start_time = moment().day(day).hours(freq_time_current_array[0]).minutes(freq_time_current_array[1]).seconds(0).format();
              var start_time = old_freq_time_current;
              var end_time = moment().add({
                seconds: min_array[1]
              }).day(day).hours(freq_time_current_array[0]).minutes(
                min_array[0]).format();


              stop_freq_json += '"start": "' + start_time + '",';
              stop_freq_json += '"end": "' + end_time + '",';
              stop_freq_json += '"description": "' + old_stop_notes +
                '",';
              stop_freq_json += '"ncl": "' + old_ncl + '",';
              stop_freq_json += '"freq_id": "' + old_freq_id + '",';
              stop_freq_json += '"services": ['

              for (var i = 0; i < service_id_array.length; i++) {
                // nlapiLogExecution('DEBUG', 'customer', old_customer_text_array[i]);
                // nlapiLogExecution('DEBUG', 'closing day', old_closing_day[i]);
                stop_freq_json += '{';
                stop_freq_json += '"customer_id": "' +
                  old_customer_id_array[i] + '",';
                stop_freq_json += '"customer_notes": "' +
                  old_service_notes[i] + '",';
                if (date_of_week >= old_closing_day[i] &&
                  date_of_week <
                  old_opening_day[i]) {
                  stop_freq_json += '"customer_text": "CLOSED - ' +
                    old_customer_text_array[i] + '",';
                } else {
                  stop_freq_json += '"customer_text": "' +
                    old_customer_text_array[i] + '",';
                }



                stop_freq_json += '"run_plan": "' +
                  old_run_plan_array[i] +
                  '",';
                stop_freq_json += '"run_plan_text": "' +
                  old_run_plan_text_array[i] + '",';
                stop_freq_json += '"service_id": "' +
                  service_id_array[i] +
                  '",';
                stop_freq_json += '"service_text": "' +
                  service_name_array[i] + '"';
                stop_freq_json += '},'
              }
              stop_freq_json = stop_freq_json.substring(0,
                stop_freq_json
                .length - 1);
              stop_freq_json += ']},'



              old_stop_name = null;
              old_address = null;
              old_service_time = null;
              old_stop_id = [];
              old_closing_day = [];
              old_opening_day = [];
              service_id_array = [];
              service_name_array = [];
              old_customer_id_array = [];
              old_customer_text_array = [];
              old_run_plan_array = [];
              old_run_plan_text_array = [];
              old_freq_id = [];
              old_freq = [];
              freq = [];
              old_stop_notes = '';
              old_closing_day = [];
              old_opening_day = [];
              old_service_notes = [];


              if (freq_mon == 'T') {
                freq[freq.length] = 1
              }

              if (freq_tue == 'T') {
                freq[freq.length] = 2
              }

              if (freq_wed == 'T') {
                freq[freq.length] = 3
              }

              if (freq_thu == 'T') {
                freq[freq.length] = 4
              }

              if (freq_fri == 'T') {
                freq[freq.length] = 5
              }

              service_id_array[service_id_array.length] = service_id;
              old_service_notes[old_service_notes.length] =
                stop_notes;
              service_name_array[service_name_array.length] =
                service_text;
              old_customer_id_array[old_customer_id_array.length] =
                customer_id;
              old_customer_text_array[old_customer_text_array.length] =
                customer_id_text + ' ' + customer_name_text;
              old_run_plan_array[old_run_plan_array.length] =
                freq_run_plan;
              old_run_plan_text_array[old_run_plan_text_array.length] =
                freq_run_plan_text;
              old_closing_day[old_closing_day.length] = closing_day;
              old_opening_day[old_opening_day.length] = opening_day;
            }
          } else {
            service_id_array[service_id_array.length] = service_id;
            old_service_notes[old_service_notes.length] = stop_notes;
            service_name_array[service_name_array.length] =
              service_text;
            old_customer_id_array[old_customer_id_array.length] =
              customer_id;
            old_customer_text_array[old_customer_text_array.length] =
              customer_id_text + ' ' + customer_name_text;
            old_run_plan_array[old_run_plan_array.length] =
              freq_run_plan;
            old_run_plan_text_array[old_run_plan_text_array.length] =
              freq_run_plan_text;
            old_closing_day[old_closing_day.length] = closing_day;
            old_opening_day[old_opening_day.length] = opening_day;
          }

        }



        old_stop_name = stop_name;
        old_service_time =
          freq_time_current;
        old_address = address;

        old_stop_id[old_stop_id.length] = stop_id;
        old_stop_lat =
          stop_lat;
        old_stop_lon = stop_lon;


        old_stop_duration = stop_duration;
        old_stop_notes +=
          stop_notes;

        old_ncl = ncl;
        old_freq_id[old_freq_id.length] = freq_id;
        old_freq_mon =
          freq_mon;
        old_freq_tue = freq_tue;
        old_freq_wed = freq_wed;
        old_freq_thu =
          freq_thu;
        old_freq_fri = freq_fri;
        old_freq_adhoc =
          freq_adhoc;
        old_freq_time_current = freq_time_current;
        old_freq_time_start =
          freq_time_start;
        old_freq_time_end = freq_time_end;
        old_freq_run_plan =
          freq_run_plan;

        old_freq = freq;

        stop_count++;

        return true;
      });

      if (stop_count > 0) {
        var freq_time_current_array = old_freq_time_current.split(':');
        var laststop_time = onTimeChange(old_freq_time_current); //AM/PM format

        var min_array = convertSecondsToMinutes(old_stop_duration);

        min_array[0] = min_array[0] + parseInt(freq_time_current_array[1]);

        if (isNullorEmpty(old_ncl)) {
          var bg_color = '#3a87ad';
        } else {
          var bg_color = '#009688';
        }


        var date = moment().day(day).date();
        var month = moment().day(day).month();
        var year = moment().day(day).year();

        var date_of_week = date + '/' + (month + 1) + '/' + year;

        stop_freq_json += '{"id": "' + old_stop_id + '",';
        stop_freq_json += '"closing_days": "' + old_closing_day + '",';
        stop_freq_json += '"opening_days": "' + old_opening_day + '",';
        stop_freq_json += '"lat": "' + old_stop_lat + '",';
        stop_freq_json += '"lon": "' + old_stop_lon + '",';
        stop_freq_json += '"address": "' + old_address + '",';
        if (isNullorEmpty(old_ncl)) {
          for (var i = 0; i < service_id_array.length; i++) {
            if (date_of_week >= old_closing_day[i] && date_of_week <
              old_opening_day[i]) {
              stop_freq_json += '"title": "CLOSED - ' + old_stop_name +
                '",';
              stop_freq_json += '"color": "#ad3a3a",';
            } else {
              stop_freq_json += '"title": "' + old_stop_name + '",';
              stop_freq_json += '"color": "' + bg_color + '",';

            }
          }
        } else {
          stop_freq_json += '"title": "' + old_stop_name + '",';
          stop_freq_json += '"color": "' + bg_color + '",';
        }

        //var start_time = moment().day(day).hours(freq_time_current_array[0]).minutes(freq_time_current_array[1]).seconds(0).format();
        var start_time = old_freq_time_current;
        var end_time = moment().add({
            seconds: min_array[1]
          }).day(day).hours(freq_time_current_array[0]).minutes(min_array[
            0])
          .format();


        stop_freq_json += '"start": "' + start_time + '",';
        stop_freq_json += '"end": "' + end_time + '",';
        stop_freq_json += '"description": "' + old_stop_notes + '",';
        stop_freq_json += '"ncl": "' + old_ncl + '",';
        stop_freq_json += '"freq_id": "' + old_freq_id + '",';
        stop_freq_json += '"services": ['

        for (var i = 0; i < service_id_array.length; i++) {
          stop_freq_json += '{';
          stop_freq_json += '"customer_id": "' + old_customer_id_array[i] +
            '",';
          stop_freq_json += '"customer_notes": "' + old_service_notes[i] +
            '",';
          if (date_of_week >= old_closing_day[i] && date_of_week <
            old_opening_day[i]) {
            stop_freq_json += '"customer_text": "CLOSED - ' +
              old_customer_text_array[i] + '",';
          } else {
            stop_freq_json += '"customer_text": "' +
              old_customer_text_array[
                i] + '",';
          }



          stop_freq_json += '"run_plan": "' + old_run_plan_array[i] +
            '",';
          stop_freq_json += '"run_plan_text": "' +
            old_run_plan_text_array[i] +
            '",';
          stop_freq_json += '"service_id": "' + service_id_array[i] +
            '",';
          stop_freq_json += '"service_text": "' + service_name_array[i] +
            '"';
          stop_freq_json += '},'
        }
        stop_freq_json = stop_freq_json.substring(0, stop_freq_json.length -
          1);
        stop_freq_json += ']},';


        stop_freq_json = stop_freq_json.substring(0, stop_freq_json.length -
          1);
      }

      stop_freq_json += ']}';

      console.log(stop_freq_json);
      var parsedStopFreq = JSON.parse(stop_freq_json);
      //console.log(parsedStopFreq);

      return [parsedStopFreq, firststop_time, laststop_time];
    }

    function convertSecondsToHours(secs) {
      var hours = Math.floor(secs / (60 * 60));

      var divisor_for_minutes = secs % (60 * 60);
      var minutes = Math.floor(divisor_for_minutes / 60);

      var divisor_for_seconds = divisor_for_minutes % 60;
      var seconds = Math.ceil(divisor_for_seconds);

      var hours_array = [];
      hours_array[0] = hours;
      hours_array[1] = minutes;
      hours_array[2] = seconds;
      return hours_array;
    }

    function convertSecondsToMinutes(seconds) {
      var min = Math.floor(seconds / 60);
      var sec = seconds % 60;

      var minutes_array = [];

      minutes_array[0] = min;
      minutes_array[1] = sec;

      return minutes_array;
    }

    function convertTo24Hour(time) {
      // nlapiLogExecution('DEBUG', 'time', time);
      var hours = parseInt(time.substr(0, 2));
      if (time.indexOf('AM') != -1 && hours == 12) {
        time = time.replace('12', '0');
      }
      if (time.indexOf('AM') != -1 && hours < 10) {
        time = time.replace(hours, ('0' + hours));
      }
      if (time.indexOf('PM') != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
      }
      return time.replace(/( AM| PM)/, '');
    }

    function onTimeChange(value) {
      // console.log('value: ' + value)
      if (!isNullorEmpty(value)) {
        var timeSplit = value.split(':'),
          hours,
          minutes,
          meridian;
        hours = timeSplit[0];
        minutes = timeSplit[1];
        if (hours > 12) {
          meridian = 'PM';
          hours -= 12;
        } else if (hours < 12) {
          meridian = 'AM';
          if (hours == 0) {
            hours = 12;
          }
        } else {
          meridian = 'PM';
        }
        return (hours + ':' + minutes + ' ' + meridian);
      }
    }

    function arraysEqual(_arr1, _arr2) {

      if (!Array.isArray(_arr1) || !Array.isArray(_arr2) || _arr1.length !==
        _arr2.length)
        return false;

      var arr1 = _arr1.concat().sort();
      var arr2 = _arr2.concat().sort();

      for (var i = 0; i < arr1.length; i++) {

        if (arr1[i] !== arr2[i])
          return false;

      }

      return true;

    }

    function convertTo24Hour(time) {
      // nlapiLogExecution('DEBUG', 'time', time);
      var hours = parseInt(time.substr(0, 2));
      if (time.indexOf('AM') != -1 && hours == 12) {
        time = time.replace('12', '0');
      }
      if (time.indexOf('AM') != -1 && hours < 10) {
        time = time.replace(hours, ('0' + hours));
      }
      if (time.indexOf('PM') != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
      }
      return time.replace(/( AM| PM)/, '');
    }

    function addMarker(map, stepDisplay, waypoint_otherproperties, zee) {
      var marker_count = 0;
      //for markers at the exact same location - OverlappingMarkerSpiderfier to spiderfy the markers on click
      var oms = new OverlappingMarkerSpiderfier(map, {
        markersWontMove: true, // we promise not to move any markers, allowing optimizations
        markersWontHide: true, // we promise not to change visibility of any markers, allowing optimizations
        basicFormatEvents: true, // allow the library to skip calculating advanced formatting information
        ignoreMapClick: true, //markers do not unspiderfy on click of anywhere on the map
        keepSpiderfied: true //to see the infowindow of each marker - markers stay spiderfied on click of one of the markers
      });
      for (var i = 0; i < waypoint_otherproperties.length; i++) {
        var parsedWayPointProperties = JSON.parse(waypoint_otherproperties[i]);
        for (x = 0; x < parsedWayPointProperties.length; x++) {
          if (x == parsedWayPointProperties.length - 1 && i !=
            waypoint_otherproperties.length - 1) { //do not display the last element unless it is the end location (because last element is also the first of the next array)
            continue;
          }

          //Get the position of the marker
          var lat = parseFloat(parsedWayPointProperties[x].lat);
          var lng = parseFloat(parsedWayPointProperties[x].lng);
          position = {
            lat: lat,
            lng: lng
          };
          //console.log('position', position);

          //Letter for the order : A,B,..,Z,AA,AB,..
          var letter = String.fromCharCode("A".charCodeAt(0) + marker_count);
          var marker_quotient = Math.floor(marker_count / 26);
          var marker_remainder = marker_count % 26;
          if (marker_quotient > 0) {
            var letter = String.fromCharCode("A".charCodeAt(0) +
              marker_quotient - 1) + String.fromCharCode("A".charCodeAt(0) +
              marker_remainder)
          } else {
            var letter = String.fromCharCode("A".charCodeAt(0) +
              marker_remainder)
          }
          //console.log('letter', letter);

          //Customer location or NCL
          // Marker SVG Path:
          var MAP_MARKER =
            'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z';
          if (parsedWayPointProperties[x].location_type == 'ncl') {
            color = '#575756'
          } else if (parsedWayPointProperties[x].location_type == 'customer') {
            color = '#008675'
          }
          var icon;
          icon = {
            path: MAP_MARKER,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: 'black',
            strokeWeight: 1,
            anchor: {
              x: 13,
              y: 22
            },
            scale: 1.5,
            //scaledSize: new google.maps.Size(27, 43),
            labelOrigin: new google.maps.Point(12, 10),
          }

          //Create the marker
          var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: icon,
            title: parsedWayPointProperties[x].name,
            label: {
              text: letter,
              fontSize: '12px',
              color: 'white',
            }

          });
          oms.addMarker(marker); //add the marker to the OverlappingMarkerSpiderfier instance
          run_markers_array[run_markers_array.length] = marker; //store the markers created to be able to delete them

          //Marker InfoWindow
          var name = parsedWayPointProperties[x].name;
          var time = parsedWayPointProperties[x].time;
          var content = '<b>' + name + '</b><br/> Franchisee: ' +
            franchiseeName + '<br/> Service Time: ' + onTimeChange(time) + '';
          // attachInstructionText(
          //   stepDisplay, marker, content, map);
          marker_count++;
        }

      }
    }

    function attachInstructionText(stepDisplay, marker, text, map) {
      google.maps.event.addListener(marker, 'click', function() {
        // Open an info window when the marker is clicked on, containing the text
        // of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
      });
    }

    function calculateAndDisplayRoute(directionsDisplay, directionsService,
      waypoint_json, markerArray, stepDisplay, map,
      waypoint_otherproperties,
      zee) {
      for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
      }
      for (var i = 0; i < waypoint_json.length; i++) {
        var parsedWayPoint = JSON.parse(waypoint_json[i]);
        console.log('parsedWayPoint', parsedWayPoint);
        console.log('parsedWayPoint.length', parsedWayPoint.length);

        var parsedWayPointProperties = JSON.parse(waypoint_otherproperties[
          i]);
        console.log('parsedWayPointProperties', parsedWayPointProperties);
        console.log('parsedWayPointProperties.length',
          parsedWayPointProperties.length);

        var lastIndex = parsedWayPoint.length - 1;
        var start = parsedWayPoint[0].location;
        var end = parsedWayPoint[lastIndex].location;
        console.log('start', start);
        console.log('end', end);
        var waypts = [];
        waypts = parsedWayPoint;
        waypts.splice(0, 1);
        waypts.splice(waypts.length - 1, 1);

        var combinedResults;
        var unsortedResults = [{}]; // to hold the counter and the results themselves as they come back, to later sort
        var directionsResultsReturned = 0;

        var request = {
          origin: start,
          destination: end,
          waypoints: waypts,
          provideRouteAlternatives: true,
          optimizeWaypoints: false,
          travelMode: window.google.maps.TravelMode.DRIVING
        };

        var delayFactor = 0;
        (function m_get_directions_route(kk) {
          directionsService.route(request, function(result, status) {
            if (status == window.google.maps.DirectionsStatus.OK) {

              var unsortedResult = {
                order: kk,
                result: result
              };
              unsortedResults.push(unsortedResult);

              directionsResultsReturned++;

              if (directionsResultsReturned == waypoint_json.length) // we've received all the results. put to map
              {
                // sort the returned values into their correct order
                unsortedResults.sort(function(a, b) {
                  return parseFloat(a.order) - parseFloat(b.order);
                });
                var count = 0;
                for (var key in unsortedResults) {
                  if (unsortedResults[key].result != null) {
                    if (unsortedResults.hasOwnProperty(key)) {
                      if (count == 0) // first results. new up the combinedResults object
                        combinedResults = unsortedResults[key].result;
                      else {
                        // only building up legs, overview_path, and bounds in my consolidated object. This is not a complete
                        // directionResults object, but enough to draw a path on the map, which is all I need
                        combinedResults.routes[0].legs =
                          combinedResults.routes[0].legs.concat(
                            unsortedResults[key].result.routes[0].legs
                          );
                        combinedResults.routes[0].overview_path =
                          combinedResults.routes[0].overview_path.concat(
                            unsortedResults[key].result.routes[0].overview_path
                          );

                        combinedResults.routes[0].bounds =
                          combinedResults.routes[0].bounds.extend(
                            unsortedResults[key].result.routes[0].bounds
                            .getNorthEast());
                        combinedResults.routes[0].bounds =
                          combinedResults.routes[0].bounds.extend(
                            unsortedResults[key].result.routes[0].bounds
                            .getSouthWest());
                      }
                      count++;
                    }
                  }
                }

                directionsDisplay.setDirections(combinedResults);
                console.log('combinedResults', combinedResults);
                //getTravellingDetails(combinedResults);
                $('#travelling_time_' + zee + '').val(
                  getTravellingDetails(combinedResults)[0]);
                $('#travelling_distance_' + zee + '').val(
                  getTravellingDetails(combinedResults)[1] + ' km');
                //showSteps(combinedResults, markerArray, stepDisplay, map, parsedWayPointProperties);
              }
            } else if (status == window.google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
              console.log('OVER_QUERY_LIMIT');
              delayFactor++;
              setTimeout(function() {
                m_get_directions_route(kk);
              }, delayFactor * 1000);
            } else {
              console.log("Route: " + status);
            }
          });
        })(i);
      }
    }

    function getTravellingDetails(directionResult) {
      var travellingTime = '';
      var travellingDistance = 0;
      var travellingTime_sec = 0;
      var legs = directionResult.routes[0].legs;
      for (i = 0; i < legs.length; i++) {
        //console.log('directionResult.routes[0].legs[i].duration.value', directionResult.routes[0].legs[i].duration.value);
        travellingTime_sec += directionResult.routes[0].legs[i].duration.value;
        travellingDistance += directionResult.routes[0].legs[i].distance.value;
      }
      //console.log('travellingTime_sec', travellingTime_sec);
      travellingTime_array = convertSecondsToHours(travellingTime_sec);
      if (!isNullorEmpty(travellingTime_array[0])) {
        travellingTime += '' + travellingTime_array[0] + 'h';
      }
      travellingTime += '' + travellingTime_array[1] + 'm';
      travellingTime += '' + travellingTime_array[2] + 's';

      travellingDistance = travellingDistance / 1000;
      return [travellingTime, travellingDistance]

    }

    function showSteps(directionResult, markerArray, stepDisplay, map,
      parsedWayPointProperties) {
      // For each step, place a marker, and add the text to the marker's infowindow.
      // Also attach the marker to an array so we can keep track of it and remove it
      // when calculating new routes.
      var myRoute = directionResult.routes[0].legs[0];
      console.log('myRoute', myRoute);
      for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
        marker.setMap(map);
        console.log('myRoute.steps[i].start_location', myRoute.steps[i].start_location);
        marker.setPosition(myRoute.steps[i].start_location);
        attachInstructionText(
          stepDisplay, marker, myRoute.steps[i].instructions, map);
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
