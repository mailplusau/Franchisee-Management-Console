/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-15T07:25:50+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-02-24T15:27:26+11:00
 */

define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect', 'N/format'
  ],
  function(ui, email, runtime, search, record, http, log, redirect, format) {
    var role = 0;
    var userId = 0;
    var zee = 0;

    var franchiseeName = '';
    var mainContact = '';
    var mainContactFName = '';
    var mainContactLName = '';
    var mainContactMobile = '';
    var franchiseeTypeOfOwner = '';
    var primaryEmail = '';
    var personalEmail = '';
    var dob = '';
    var vaccinationStatus = '';
    var franchiseeNextOfKinName = '';
    var franchiseeNextOfKinMobile = '';
    var franchiseeNextOfKinRelationship = '';
    var franchiseeABN = '';
    var franchiseeAddress = '';
    var franchiseeTOLLAccountNumber = '';
    var franchiseeTOLLPickupDX = '';
    var franchiseeTOLLLodgementDX = '';
    var franchiseeSendlePrimaryLocations = '';
    var franchiseeLastMileLocations = '';
    var franchiseeSendleSecondaryLocations = '';
    var franchiseeListedForSale = '';

    var color_array = ['blue', 'red', 'green', 'orange', 'black'];

    function onRequest(context) {
      var baseURL = 'https://system.na2.netsuite.com';
      if (runtime.EnvType == "SANDBOX") {
        baseURL = 'https://system.sandbox.netsuite.com';
      }
      userId = runtime.getCurrentUser().id;
      role = runtime.getCurrentUser().role;

      if (context.request.method === 'GET') {

        zee = context.request.parameters.zee;

        if (role == 1000) {
          zee = userId;
          var form = ui.createForm({
            title: 'Franchisee Management Console'
          });
        } else {
          var form = ui.createForm({
            title: 'Franchisee Sales & Management'
          });
        }

        //INITIALIZATION OF JQUERY AND BOOTSTRAP
        var inlineHtml =
          '<meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><script src="//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.3.1/leaflet-omnivore.min.js"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&callback=initMap&libraries=places"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js"></script></script><link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" /><script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script><link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css"><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&amp;c=1048144&amp;h=9ee6accfd476c9cae718&amp;_xt=.css"><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&amp;c=1048144&amp;h=ef2cda20731d146b5e98&amp;_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.7/angular-resource.min.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><style>.mandatory{color:red;}.clearfix:after {clear: both;content: "";display: block;height: 0;}.wrapper {vertical-align: middle;}.nav {margin-top: 40px;}.pull-right {float: right;}a, a:active {color: #212121;text-decoration: none;}a:hover {color: #999;}.arrow-steps .step {font-size: 14px;text-align: center;color: #fff;cursor: default;margin: 0 3px;padding: 10px 10px 10px 30px;float: left;position: relative;background-color: #379e8f;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none; transition: background-color 0.2s ease;}.arrow-steps .step:after,.arrow-steps .step:before {content: " ";position: absolute;top: 0;right: -17px;width: 0;height: 40px;border-top: 19px solid transparent;border-bottom: 17px solid transparent;border-left: 17px solid #379e8f;	z-index: 2;transition: border-color 0.2s ease;}.arrow-steps .step:before {right: auto;left: 0;border-left: 17px solid #fff;	z-index: 0;}.arrow-steps .step:first-child:before {border: none;}.arrow-steps .step:first-child {border-top-left-radius: 4px;border-bottom-left-radius: 4px;}.arrow-steps .step span {position: relative;}.arrow-steps .step span:before {opacity: 0;content: "✔";position: absolute;top: -2px;left: -20px;color: #06ac77;}.arrow-steps .step.done span:before {opacity: 1;-webkit-transition: opacity 0.3s ease 0.5s;-moz-transition: opacity 0.3s ease 0.5s;-ms-transition: opacity 0.3s ease 0.5s;transition: opacity 0.3s ease 0.5s;}.arrow-steps .step.current {color: #103d39;font-weight: bold;background-color: #fbea51;}.arrow-steps .step.current:after {border-left: 17px solid #fbea51;	}.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #379E8F; color: #fff }.nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #379E8F; color: #379E8F; }</style>';

        //ERROR SECTION
        inlineHtml +=
          '<div class="container" style="padding-top: 3%;"><div id="alert" class="alert alert-danger fade in"></div></div>';


        var day = getDay();
        if (day == 0 || day == 6) {
          day = 1; //Monday
        }

        //HIDDEN FIELDS
        form.addField({
          id: 'custpage_zee',
          type: ui.FieldType.TEXT,
          label: 'Zee'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = zee;

        form.addField({
          id: 'custpage_name',
          type: ui.FieldType.TEXT,
          label: 'Zee'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = franchiseeName;

        form.addField({
          id: 'custpage_day',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = day;

        //HIDDEN FIELDS TO STORE VALUE TO BE SAVED ON THE FRANCHISE RECORD
        form.addField({
          id: 'custpage_maincontact',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = mainContact;

        form.addField({
          id: 'custpage_mobilenumber',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = mainContactMobile;

        form.addField({
          id: 'custpage_typeofowner',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = franchiseeTypeOfOwner;

        form.addField({
          id: 'custpage_personalemail',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = primaryEmail;

        form.addField({
          id: 'custpage_dob',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = dob;

        form.addField({
          id: 'custpage_vaccinationstatus',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = vaccinationStatus;

        form.addField({
          id: 'custpage_nextofkinname',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = franchiseeNextOfKinName;

        form.addField({
          id: 'custpage_nextofkinmobile',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = franchiseeNextOfKinMobile;

        form.addField({
          id: 'custpage_nextofkinrelationship',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = franchiseeNextOfKinRelationship;

        //Address Table Hidden Fields
        form.addField({
          id: 'custpage_addressids',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_addressids_delete',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_address1',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_address2',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_suburb',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_state',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_postcode',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });

        //Operator Table Hidden Fields
        form.addField({
          id: 'custpage_operatorids',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_operatorids_delete',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_operatorname',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_operatoremail',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_operatormobile',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_operatorrole',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_operatoremploymentype',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_operatordds',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_operatorprimary',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_operatormobiledev',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });

        //New Operator Table Hidden Fields
        form.addField({
          id: 'custpage_new_operatorids',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_operatorids_delete',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_operatorname',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_operatoremail',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_operatormobile',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_operatorrole',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_operatoremploymentype',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_operatordds',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_operatorprimary',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_operatormobiledev',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });

        //Fleet Table Hidden Details
        form.addField({
          id: 'custpage_fleetids',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_fleetids_delete',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_fleetrego',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_fleetmodel',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_fleetmake',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_fleetcolor',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_fleetyear',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_fleetsignage',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_caregocage',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_owner',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_operator',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });

        //New Fleet DETAILS
        form.addField({
          id: 'custpage_new_fleetids',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_fleetids_delete',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_fleetrego',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_fleetmodel',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_fleetmake',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_fleetcolor',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_fleetyear',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_fleetsignage',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_caregocage',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_owner',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });
        form.addField({
          id: 'custpage_new_operator',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });


        form.addField({
          id: 'custpage_listforsale',
          type: ui.FieldType.TEXT,
          label: 'Day'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        }).defaultValue = 'F';

        inlineHtml +=
          '<div class="se-pre-con"></div><div ng-app="myApp" ng-controller="myCtrl">';

        inlineHtml += spacing()
        if (role != 1000) {
          inlineHtml += progressBar()
          inlineHtml += line()
          inlineHtml += spacing()
          inlineHtml += selectFranchiseeSection(zee)
          inlineHtml += spacing()
        }

        if (zee != 0 && !isNullorEmpty(zee)) {
          //NetSuite Search: APP - Operator Load
          var searchOperators = search.load({
            id: 'customsearch_app_operator_load',
            type: 'customrecord_operator'
          });

          if (!isNullorEmpty(zee)) {
            searchOperators.filters.push(search.createFilter({
              name: 'internalid',
              join: 'CUSTRECORD_OPERATOR_FRANCHISEE2',
              operator: search.Operator.IS,
              values: zee
            }));
          }

          var resultSetOperators = searchOperators.run();

          inlineHtml += tabSection(zee, role, resultSetOperators)
          inlineHtml += spacing()
          inlineHtml += line()
          inlineHtml += mainButtons(role)
        }


        form.addField({
          id: 'preview_table',
          label: 'inlinehtml',
          type: 'inlinehtml'
        }).updateLayoutType({
          layoutType: ui.FieldLayoutType.STARTROW
        }).defaultValue = inlineHtml;

        form.addSubmitButton({
          label: 'SAVE'
        });

        form.clientScriptFileId = 5334734
        context.response.writePage(form);

      } else {
        var zeeId = parseInt(context.request.parameters.custpage_zee);
        var franchiseeMainContact = context.request.parameters.custpage_maincontact;
        var franchiseeMobileNumber = context.request.parameters.custpage_mobilenumber;
        var franchiseeTypeOfOwner = context.request.parameters.custpage_typeofowner;
        var franchiseePersonalEmail = context.request.parameters.custpage_personalemail;
        var FranchiseeDOB = context.request.parameters.custpage_dob;
        var franchiseeVaccinationStatus = context.request.parameters.custpage_vaccinationstatus;
        var franchiseeNextOfKinName = context.request.parameters.custpage_nextofkinname;
        var franchiseeNextOfKinMobile = context.request.parameters.custpage_nextofkinmobile;
        var franchiseeNextOfKinRelationship = context.request.parameters.custpage_nextofkinrelationship;

        var addressids = context.request.parameters.custpage_addressids;
        var addressids_delete = context.request.parameters.custpage_addressids_delete;
        var address1 = context.request.parameters.custpage_address1;
        var address2 = context.request.parameters.custpage_address2;
        var suburb = context.request.parameters.custpage_suburb;
        var state = context.request.parameters.custpage_state;
        var postcode = context.request.parameters.custpage_postcode;
        var listforsale = context.request.parameters.custpage_listforsale;

        log.debug({
          title: 'addressids',
          details: addressids
        })

        var addressidsArrays = addressids.split(',');
        var addressidsdeleteArrays = addressids_delete.split(',');
        var address1Arrays = address1.split(',');
        var address2Arrays = address2.split(',');
        var suburbArrays = suburb.split(',');
        var stateArrays = state.split(',');
        var postcodeArrays = postcode.split(',');

        var operatorids = context.request.parameters.custpage_operatorids;
        var operatorids_delete = context.request.parameters.custpage_operatorids_delete;
        var operatorname = context.request.parameters.custpage_operatorname;
        var operatoremail = context.request.parameters.custpage_operatoremail;
        var operatormobile = context.request.parameters.custpage_operatormobile;
        var operatorrole = context.request.parameters.custpage_operatorrole;
        var operatoremploymentype = context.request.parameters.custpage_operatoremploymentype;
        var operatordds = context.request.parameters.custpage_operatordds;
        var operatorprimary = context.request.parameters.custpage_operatorprimary;
        var operatormobiledev = context.request.parameters.custpage_operatormobiledev;

        var operatoridsArrys = operatorids.split(',')
        var operatoridsdeleteArrys = operatorids_delete.split(',')
        var operatornameArrys = operatorname.split(',')
        var operatoremailArrys = operatoremail.split(',')
        var operatormobileArrys = operatormobile.split(',')
        var operatorroleArrys = operatorrole.split(',')
        var operatoremploymentypeArrys = operatoremploymentype.split(',')
        var operatorddsArrys = operatordds.split(',')
        var operatorprimaryArrys = operatorprimary.split(',')
        var operatormobiledevArrys = operatormobiledev.split(',')

        //New operator
        var newoperatorids = context.request.parameters.custpage_new_operatorids;
        var newoperatorids_delete = context.request.parameters.custpage_new_operatorids_delete;
        var newoperatorname = context.request.parameters.custpage_new_operatorname;
        var newoperatoremail = context.request.parameters.custpage_new_operatoremail;
        var newoperatormobile = context.request.parameters.custpage_new_operatormobile;
        var newoperatorrole = context.request.parameters.custpage_new_operatorrole;
        var newoperatoremploymentype = context.request.parameters.custpage_new_operatoremploymentype;
        var newoperatordds = context.request.parameters.custpage_new_operatordds;
        var newoperatorprimary = context.request.parameters.custpage_new_operatorprimary;
        var newoperatormobiledev = context.request.parameters.custpage_new_operatormobiledev;

        var newoperatoridsArrys = newoperatorids.split(',')
        var newoperatoridsdeleteArrys = newoperatorids_delete.split(',')
        var newoperatornameArrys = newoperatorname.split(',')
        var newoperatoremailArrys = newoperatoremail.split(',')
        var newoperatormobileArrys = newoperatormobile.split(',')
        var newoperatorroleArrys = newoperatorrole.split(',')
        var newoperatoremploymentypeArrys = newoperatoremploymentype.split(
          ',')
        var newoperatorddsArrys = newoperatordds.split(',')
        var newoperatorprimaryArrys = newoperatorprimary.split(',')
        var newoperatormobiledevArrys = newoperatormobiledev.split(',')

        var fleetids = context.request.parameters.custpage_fleetids;
        var fleetids_delete = context.request.parameters.custpage_fleetids_delete;
        var fleetrego = context.request.parameters.custpage_fleetrego;
        var fleetmodel = context.request.parameters.custpage_fleetmodel;
        var fleetmake = context.request.parameters.custpage_fleetmake;
        var fleetcolor = context.request.parameters.custpage_fleetcolor;
        var fleetyear = context.request.parameters.custpage_fleetyear;
        var fleetsignage = context.request.parameters.custpage_fleetsignage;
        var caregocage = context.request.parameters.custpage_caregocage;
        var owner = context.request.parameters.custpage_owner;
        var operator = context.request.parameters.custpage_operator;

        var fleetidsArrys = fleetids.split(',')
        var fleetidsdeleteArrys = fleetids_delete.split(',')
        var fleetregoArrys = fleetrego.split(',')
        var fleetmodelArrys = fleetmodel.split(',')
        var fleetmakeArrys = fleetmake.split(',')
        var fleetcolorArrys = fleetcolor.split(',')
        var fleetyearArrys = fleetyear.split(',')
        var fleetsignageArrys = fleetsignage.split(',')
        var caregocageArrys = caregocage.split(',')
        var ownerArrys = owner.split(',')
        var operatorArrys = operator.split(',')

        //New Fleet details
        var newfleetids = context.request.parameters.custpage_new_fleetids;
        var newfleetids_delete = context.request.parameters.custpage_new_fleetids_delete;
        var newfleetrego = context.request.parameters.custpage_new_fleetrego;
        var newfleetmodel = context.request.parameters.custpage_new_fleetmodel;
        var newfleetmake = context.request.parameters.custpage_new_fleetmake;
        var newfleetcolor = context.request.parameters.custpage_new_fleetcolor;
        var newfleetyear = context.request.parameters.custpage_new_fleetyear;
        var newfleetsignage = context.request.parameters.custpage_new_fleetsignage;
        var newcaregocage = context.request.parameters.custpage_new_caregocage;
        var newowner = context.request.parameters.custpage_new_owner;
        var newoperator = context.request.parameters.custpage_new_operator;

        var newfleetidsArrys = newfleetids.split(',')
        var newfleetidsdeleteArrys = newfleetids_delete.split(',')
        var newfleetregoArrys = newfleetrego.split(',')
        var newfleetmodelArrys = newfleetmodel.split(',')
        var newfleetmakeArrys = newfleetmake.split(',')
        var newfleetcolorArrys = newfleetcolor.split(',')
        var newfleetyearArrys = newfleetyear.split(',')
        var newfleetsignageArrys = newfleetsignage.split(',')
        var newcaregocageArrys = newcaregocage.split(',')
        var newownerArrys = newowner.split(',')
        var newoperatorArrys = newoperator.split(',')

        var dobArray = FranchiseeDOB.split('-')
        var dobString = dobArray[1] + '/' + dobArray[2] + '/' + dobArray[0]

        log.debug({
          title: "dobString",
          details: dobString
        });
        log.debug({
          title: "dateISOToNetsuite",
          details: getDate(dobString)
        });

        //Load Partner Record & Save the main details
        var zeeRecord = record.load({
          type: record.Type.PARTNER,
          id: zeeId
        });

        var zeeName = zeeRecord.getValue({
          fieldId: 'companyname'
        });

        zeeRecord.setValue({
          fieldId: 'custentity3',
          value: franchiseeMainContact
        })
        zeeRecord.setValue({
          fieldId: 'custentity2',
          value: franchiseeMobileNumber
        })
        zeeRecord.setValue({
          fieldId: 'custentity_type_of_owner',
          value: franchiseeTypeOfOwner
        })
        zeeRecord.setValue({
          fieldId: 'custentity_personal_email_address',
          value: franchiseePersonalEmail
        })
        zeeRecord.setValue({
          fieldId: 'custentity_zee_dob',
          value: getDate(dobString)
        })
        zeeRecord.setValue({
          fieldId: 'custentity_vacc_status',
          value: franchiseeVaccinationStatus
        })
        zeeRecord.setValue({
          fieldId: 'custentity_kin_name',
          value: franchiseeNextOfKinName
        })
        zeeRecord.setValue({
          fieldId: 'custentity_kin_mobile',
          value: franchiseeNextOfKinMobile
        })
        zeeRecord.setValue({
          fieldId: 'custentity_kin_relationship',
          value: franchiseeNextOfKinRelationship
        })

        if (listforsale == 'T') {
          zeeRecord.setValue({
            fieldId: 'custentity_listed_for_sale',
            value: 1
          });
          zeeRecord.setValue({
            fieldId: 'custentity_date_listed_for_sale',
            value: getDateToday()
          });

          var email_body = ' Franchisee NS ID: ' + zeeId +
            '</br> Franchisee Name: ' + zeeName +
            '</br> Date: ' + getDateToday() +
            '</br> Franchisee NS ID: ' + zeeRecordId;

          email.send({
            author: 112209,
            recipients: ['michael.mcdaid@mailplus.com.au'],
            subject: 'Listed for Sale - ' + zeeName + ' Franchisee',
            body: email_body,
            cc: ['ankith.ravindran@mailplus.com.au']
          });
        }

        log.debug({
          title: 'isDynamic',
          details: zeeRecord.isDynamic
        })


        //ADD/UPDATE ADDRESS
        if (!isNullorEmptyExcZero(addressidsArrays)) {
          for (var x = 0; x < addressidsArrays.length; x++) {
            log.debug({
              title: 'addressidsArrays[x]',
              details: addressidsArrays[x]
            })
            if (addressidsArrays[x] == 0 || addressidsArrays[x] == '0') {
              log.debug({
                title: 'inside new'
              })
              zeeRecord.insertLine({
                sublistId: 'addressbook',
                line: 0
              })
              var lineIndex = 0;
            } else {
              var lineIndex = zeeRecord.findSublistLineWithValue({
                sublistId: 'addressbook',
                fieldId: 'internalid',
                value: addressidsArrays[x]
              });
              log.debug({
                title: "lineIndex",
                details: lineIndex
              });
            }

            var updateAddress = zeeRecord.getSublistSubrecord({
              sublistId: 'addressbook',
              fieldId: 'addressbookaddress',
              line: lineIndex
            })

            updateAddress.setValue({
              fieldId: 'country',
              value: 'AU'
            });

            updateAddress.setValue({
              fieldId: 'addressee',
              value: franchiseeMainContact
            });

            updateAddress.setValue({
              fieldId: 'addr1',
              value: address1Arrays[x]
            });
            updateAddress.setValue({
              fieldId: 'addr2',
              value: address2Arrays[x]
            });
            updateAddress.setValue({
              fieldId: 'city',
              value: suburbArrays[x]
            });
            updateAddress.setValue({
              fieldId: 'state',
              value: stateArrays[x]
            });
            updateAddress.setValue({
              fieldId: 'zip',
              value: postcodeArrays[x]
            });
            updateAddress.setValue({
              fieldId: 'isresidential',
              value: 'T'
            });
          }
        }

        if (!isNullorEmpty(addressidsdeleteArrays)) {
          for (var x = 0; x < addressidsdeleteArrays.length; x++) {
            var lineIndex = zeeRecord.findSublistLineWithValue({
              sublistId: 'addressbook',
              fieldId: 'internalid',
              value: addressidsdeleteArrays[x]
            });


            var deleteAddress = zeeRecord.removeSublistSubrecord({
                sublistId: 'addressbook',
                fieldId: 'addressbookaddress',
                line: lineIndex
              })
              //
              // deleteAddress.setValue({
              //   fieldId: 'country',
              //   value: 'AU'
              // });
          }
        }

        var zeeRecordId = zeeRecord.save({
          ignoreMandatoryFields: true
        });

        //ADD/UPDATE OPREATOR DETAILS
        if (!isNullorEmpty(operatoridsArrys)) {
          for (var y = 0; y < operatoridsArrys.length; y++) {
            var operatorRecord = record.load({
              type: 'customrecord_operator',
              id: operatoridsArrys[y]
            });

            var spliName = operatornameArrys[y].split(" ");

            operatorRecord.setValue({
              fieldId: 'custrecord_operator_givennames',
              value: spliName[0]
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_surname',
              value: spliName[1]
            })

            operatorRecord.setValue({
              fieldId: 'name',
              value: operatornameArrys[y]
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_email',
              value: operatoremailArrys[y]
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_date_reviewed',
              value: getDateToday()
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_phone',
              value: operatormobileArrys[y]
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_role',
              value: operatorroleArrys[y]
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_employment',
              value: operatoremploymentypeArrys[y]
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_dds_operator',
              value: operatorddsArrys[y]
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_primary_operator',
              value: operatorprimaryArrys[y]
            })
            if (!isNullorEmpty(operatormobiledevArrys[y])) {
              operatorRecord.setValue({
                fieldId: 'custrecord_operator_mobdev_platform',
                value: operatormobiledevArrys[y]
              })
            }

            operatorRecord.save()
          }
        }

        //NEW OPERATOR DETAILS
        if (!isNullorEmpty(newoperatoridsArrys)) {
          log.debug({
            title: 'newoperatoridsArrys.length',
            details: newoperatoridsArrys.length
          })
          for (var y = 0; y < newoperatoridsArrys.length; y++) {
            var operatorRecord = record.create({
              type: 'customrecord_operator'
            });

            if (!isNullorEmpty(newoperatornameArrys[y])) {
              var spliName = newoperatornameArrys[y].split(" ");
              operatorRecord.setValue({
                fieldId: 'custrecord_operator_givennames',
                value: spliName[0]
              })
              if (isNullorEmpty(spliName[1])) {
                operatorRecord.setValue({
                  fieldId: 'custrecord_operator_surname',
                  value: spliName[0]
                })
              } else {
                operatorRecord.setValue({
                  fieldId: 'custrecord_operator_surname',
                  value: spliName[1]
                })
              }

            }


            operatorRecord.setValue({
              fieldId: 'name',
              value: newoperatornameArrys[y]
            })

            operatorRecord.setValue({
              fieldId: 'custrecord_operator_email',
              value: newoperatoremailArrys[y]
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_franchisee',
              value: zeeRecordId
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_franchisee2',
              value: zeeRecordId
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_salutation',
              value: 1
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_status',
              value: 4
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_app_date_link_sent',
              value: getDateToday()
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_date_reviewed',
              value: getDateToday()
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_phone',
              value: newoperatormobileArrys[y]
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_role',
              value: newoperatorroleArrys[y]
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_operator_employment',
              value: newoperatoremploymentypeArrys[y]
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_dds_operator',
              value: newoperatorddsArrys[y]
            })
            operatorRecord.setValue({
              fieldId: 'custrecord_primary_operator',
              value: newoperatorprimaryArrys[y]
            })
            if (!isNullorEmpty(operatormobiledevArrys[y])) {
              operatorRecord.setValue({
                fieldId: 'custrecord_operator_mobdev_platform',
                value: newoperatormobiledevArrys[y]
              })
            }

            var operatorIdNew = operatorRecord.save()

            var email_body = ' New Operator NS ID: ' + operatorIdNew +
              '</br> New Operator Name: ' + newoperatornameArrys[y] +
              '</br> New Operator Email: ' + newoperatoremailArrys[y] +
              '</br> New Operator Mobile: ' + newoperatormobileArrys[y] +
              '</br> Franchisee NS ID: ' + zeeRecordId;

            email.send({
              author: 112209,
              recipients: ['mailplussupport@protechly.com'],
              subject: 'MP Operator Access - New Operator',
              body: email_body,
              cc: ['raine.giderson@mailplus.com.au',
                'ankith.ravindran@mailplus.com.au',
                'fiona.harrison@mailplus.com.au',
                'popie.popie@mailplus.com.au'
              ]
            });

          }
        }

        if (!isNullorEmpty(operatoridsdeleteArrys)) {
          for (var y = 0; y < operatoridsdeleteArrys.length; y++) {
            var deleteOperatorRecord = record.load({
              type: 'customrecord_operator',
              id: operatoridsdeleteArrys[y]
            });

            deleteOperatorRecord.setValue({
              fieldId: 'isinactive',
              value: true
            })
            deleteOperatorRecord.setValue({
              fieldId: 'custrecord_operator_status',
              value: 3
            })

            var getOperatorEmail = deleteOperatorRecord.getValue({
              fieldId: 'custrecord_operator_email'
            })
            var getOperatorName = deleteOperatorRecord.getValue({
              fieldId: 'name'
            })

            deleteOperatorRecord.save();

            var email_body = ' Delete Operator NS ID: ' +
              operatoridsdeleteArrys[y] +
              '</br> Franchisee NS ID: ' + zeeRecordId +
              '</br> Operator Name: ' + getOperatorName +
              '</br> Operator Email: ' + getOperatorEmail;

            email.send({
              author: 112209,
              recipients: ['mailplussupport@protechly.com'],
              subject: 'MP Operator Access - Delete/Inactive Operator',
              body: email_body,
              cc: ['raine.giderson@mailplus.com.au',
                'ankith.ravindran@mailplus.com.au',
                'fiona.harrison@mailplus.com.au',
                'popie.popie@mailplus.com.au'
              ]
            });


          }
        }

        //ADD/EDIT FLEET DETAILS
        if (!isNullorEmpty(fleetidsArrys)) {
          for (var w = 0; w < fleetidsArrys.length; w++) {
            var vehicleRecord = record.load({
              type: 'customrecord_vehicle',
              id: fleetidsArrys[w]
            });

            vehicleRecord.setValue({
              fieldId: 'name',
              value: fleetregoArrys[w]
            })
            vehicleRecord.setValue({
              fieldId: 'custrecord_vehicle_model_text',
              value: fleetmodelArrys[w]
            })
            vehicleRecord.setValue({
              fieldId: 'custrecord_vehicle_make',
              value: fleetmakeArrys[w]
            })
            vehicleRecord.setValue({
              fieldId: 'custrecord_vehicle_colour',
              value: fleetcolorArrys[w]
            })
            vehicleRecord.setValue({
              fieldId: 'custrecord_vehicle_year',
              value: fleetyearArrys[w]
            })

            if (fleetsignageArrys[w] == 1 || fleetsignageArrys[w] == '1') {
              vehicleRecord.setValue({
                fieldId: 'custrecord_vehicle_signage',
                value: true
              })
            }
            vehicleRecord.setValue({
              fieldId: 'custrecord_cargo_cage',
              value: caregocageArrys[w]
            })
            vehicleRecord.setValue({
              fieldId: 'custrecord_vehicle_owner',
              value: ownerArrys[w]
            })
            vehicleRecord.setValue({
              fieldId: 'custrecord_vehicle_date_reviewed',
              value: getDateToday()
            })

            var newFleetID = vehicleRecord.save()

            //SAVE FLEET DETAILS ON THE OPERATOR RECORD
            var operatorRecord = record.load({
              type: 'customrecord_operator',
              id: operatorArrys[w]
            });

            operatorRecord.setValue({
              fieldId: 'custrecord_operator_vehicle',
              value: newFleetID
            })
            operatorRecord.save();


          }
        }

        //CREATE NEW FLEET DETAILS
        if (!isNullorEmpty(newfleetidsArrys)) {
          for (var w = 0; w < newfleetidsArrys.length; w++) {
            var vehicleRecord = record.create({
              type: 'customrecord_vehicle'
            });

            vehicleRecord.setValue({
              fieldId: 'name',
              value: newfleetregoArrys[w]
            })
            vehicleRecord.setValue({
              fieldId: 'custrecord_vehicle_franchisee',
              value: zeeRecordId
            })
            vehicleRecord.setValue({
              fieldId: 'custrecord_vehicle_model_text',
              value: newfleetmodelArrys[w]
            })
            vehicleRecord.setValue({
              fieldId: 'custrecord_vehicle_make',
              value: newfleetmakeArrys[w]
            })
            vehicleRecord.setValue({
              fieldId: 'custrecord_vehicle_colour',
              value: newfleetcolorArrys[w]
            })
            vehicleRecord.setValue({
              fieldId: 'custrecord_vehicle_year',
              value: newfleetyearArrys[w]
            })

            if (newfleetsignageArrys[w] == 1 || newfleetsignageArrys[w] ==
              '1') {
              vehicleRecord.setValue({
                fieldId: 'custrecord_vehicle_signage',
                value: true
              })
            }
            vehicleRecord.setValue({
              fieldId: 'custrecord_cargo_cage',
              value: newcaregocageArrys[w]
            })
            vehicleRecord.setValue({
              fieldId: 'custrecord_vehicle_owner',
              value: newownerArrys[w]
            })
            vehicleRecord.setValue({
              fieldId: 'custrecord_vehicle_date_reviewed',
              value: getDateToday()
            })

            var newFleetID = vehicleRecord.save()

            //SAVE FLEET DETAILS ON THE OPERATOR RECORD
            var operatorRecord = record.load({
              type: 'customrecord_operator',
              id: newoperatorArrys[w]
            });

            operatorRecord.setValue({
              fieldId: 'custrecord_operator_vehicle',
              value: newFleetID
            })
            operatorRecord.save()


          }
        }


        if (!isNullorEmpty(fleetidsdeleteArrys)) {
          for (var y = 0; y < fleetidsdeleteArrys.length; y++) {
            var deleteFleetRecord = record.load({
              type: 'customrecord_vehicle',
              id: fleetidsdeleteArrys[y]
            });

            deleteFleetRecord.setValue({
              fieldId: 'isinactive',
              value: true
            })

            deleteFleetRecord.save()
          }
        }

        redirect.toSuitelet({
          scriptId: 'customscript_sl2_zee_management_console',
          deploymentId: 'customdeploy1',
        });
      }
    }

    /*
     * PURPOSE : ADDS SPACING
     *  PARAMS :
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function spacing() {
      var inlineHtml =
        '<div class="form-group spacing_section">';
      inlineHtml += '<div class="row">';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml;
    }


    /*
     * PURPOSE : ADDS HORIZONTAL LINE TO DIVIDE SECTIONS
     *  PARAMS :
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function line() {
      var inlineHtml =
        '<hr style="height:5px; width:100%; border-width:0; color:red; background-color:#fff">'

      return inlineHtml
    }


    /*
     * PURPOSE : PROGRESS BAR AT THE TOP OF THE PAGE TO SHOW AT WHAT STAGE THE FRANCHISE SALES & MANAGEMENT WORKFLOW IS AT. ONLY SEEN TO THE HEADOFFICE USERS NOT AVAILABLE TO THE FRANCHISEES
     *  PARAMS :
     * RETURNS :  INLINEHTML
     *   NOTES :
     */
    function progressBar() {
      var inlineHtml =
        '<div class="form-group progress_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class=""> <div class="wrapper"> <div class="arrow-steps clearfix"><div class="step"> <span>SALES PROCESS</span> </div><div class="step"> <span>FINANCIALS</span> </div><div class="step"> <span>PRESENTATIONS & INTERVIEW</span> </div><div class="step"> <span>SETTLEMENT</span> </div><div class="step"> <span><span class="glyphicon glyphicon-ok" style="color: #fff"></span>TRAINING</span> </div><div class="step"> <span>FRANCHISE AGREEMENTS</span> </div><div class="step"> <span>NETSUITE SETUP</span> </div><div class="step"> <span>ONBOARDING</span> </div><div class="step current"> <span>UPDATE/EDIT DETAILS</span> </div></div>';
      // inlineHtml += '<div class="nav clearfix"><a href="#" class="prev">Previous</a><a href="#" class="next pull-right">Next</a></div></div></div>'
      inlineHtml += '</div></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    /*
     * PURPOSE : BUTTONS SECTION AT THE END OF THE PAGE.
     *  PARAMS : USER ROLE
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function mainButtons(role) {

      var inlineHtml = ''

      if (role != 1000) {
        inlineHtml +=
          '<div class="form-group container zee_available_buttons_section">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-6 updateDetails"><input type="button" value="UPDATE DETAILS" class="form-control btn btn-primary" id="updateDetails" /></div>'
        if (franchiseeListedForSale != 1) {
          inlineHtml +=
            '<div class="col-xs-6 listForSale"><input type="button" value="LIST FOR SALE" class="form-control btn btn-success" id="listForSale" /></div>'
        } else {
          inlineHtml +=
            '<div class="col-xs-6 listForSale"><input type="button" value="LISTED FOR SALE" class="form-control btn btn-success" id="" disabled/></div>'
        }

        inlineHtml += '</div>';
        inlineHtml += '</div>';
        inlineHtml +=
          '<div class="form-group container zee_admin_section">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-3 sendEmail"><input type="button" value="Send Email" class="form-control btn btn-primary" id="sendEmail" /></div>'
        inlineHtml +=
          '<div class="col-xs-3 sendSMS"><input type="button" value="Send SMS" class="form-control btn btn-primary" id="sendSMS" /></div>'
        inlineHtml +=
          '<div class="col-xs-3 breachNotice"><input type="button" value="Breach Notice" class="form-control btn btn-warning" id="breachNotice" /></div>'
        inlineHtml +=
          '<div class="col-xs-3 termination"><input type="button" value="Termination" class="form-control btn btn-danger" id="termination" /></div>'
        inlineHtml += '</div>';
        inlineHtml += '</div>';
      } else {
        inlineHtml +=
          '<div class="form-group container zee_available_buttons_section">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
          '<div class="col-xs-6 updateDetails"><input type="button" value="UPDATE DETAILS" class="form-control btn btn-primary" id="updateDetails" /></div>'
        if (franchiseeListedForSale != 1) {
          inlineHtml +=
            '<div class="col-xs-6 listForSale"><input type="button" value="LIST FOR SALE" class="form-control btn btn-success" id="listForSale" /></div>'
        } else {
          inlineHtml +=
            '<div class="col-xs-6 listForSale"><input type="button" value="LISTED FOR SALE" class="form-control btn btn-success" id="" disabled/></div>'
        }
        inlineHtml += '</div>';
        inlineHtml += '</div>';
      }
      return inlineHtml
    }


    /*
     * PURPOSE : CREATES THE TAB SECTION FOR THE PAGE
     *  PARAMS : ZEE ID, USER ROLE & OPERATOR SEARCH RESULT
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function tabSection(zee, role, resultSetOperators) {
      //TAB HEADERS
      var inlineHtml =
        '<div>'
      inlineHtml +=
        '<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-tabs nav-justified main-tabs-sections " style="margin:0%;border-bottom-color: #fbea50 !important;border-bottom-width: 5px !important;border-bottom-style: solid;">';
      inlineHtml +=
        '<li role="presentation" class="active"><a data-toggle="tab" href="#zeeDetails"><b>MAIN DETAILS</b></a></li>';
      inlineHtml +=
        '<li role="presentation" class=""><a data-toggle="tab" href="#operatorDetails"><b>OPERATION DETAILS</b></a></li>';
      inlineHtml +=
        '<li role="presentation" class=""><a data-toggle="tab" href="#tollMPEX"><b>PICKUP & LODGEMENT LOCATIONS</b></a></li>';
      if (role != 1000) {
        inlineHtml +=
          '<li role="presentation" class=""><a data-toggle="tab" href="#zeeAgreements"><b>AGREEMENTS</b></a></li>';
        inlineHtml +=
          '<li role="presentation" class=""><a data-toggle="tab" href="#breachDetails"><b>BREACH & TERMINATION DETAILS</b></a></li>';
      }
      inlineHtml += '</ul></div>';

      //TAB CONTENT
      inlineHtml += '<div class="tab-content">';
      inlineHtml +=
        '<div role="tabpanel" class="tab-pane active" id="zeeDetails">';
      inlineHtml += franchiseeMainDetails(zee)
      inlineHtml += franchiseeNextOfKin()
      inlineHtml += '</div>';

      inlineHtml +=
        '<div role="tabpanel" class="tab-pane " id="zeeAgreements">';
      inlineHtml += franchiseeAgreements(zee, role)
      inlineHtml += '</div>';

      inlineHtml +=
        '<div role="tabpanel" class="tab-pane " id="operatorDetails">';
      inlineHtml += franchiseeOperatorDetails(zee, resultSetOperators)
      inlineHtml += franchiseeFleetDetails(zee, resultSetOperators)
      inlineHtml += '</div>';

      inlineHtml += '<div role="tabpanel" class="tab-pane " id="tollMPEX">';
      inlineHtml += franchiseeTOLLMPEX()
      inlineHtml += franchiseeAdhoc()
      inlineHtml += '</div>';

      //BREACH NOTICE & TERMINATION ONLY SEEN BY HEAD OFFICE USERS
      if (role != 1000) {
        inlineHtml +=
          '<div role="tabpanel" class="tab-pane " id="breachDetails">';
        inlineHtml += franchiseeBreachDetails()
        inlineHtml += franchiseeTerminationDetails()
        inlineHtml += '</div>';
      }

      inlineHtml += '</div></div>';

      return inlineHtml;
    }


    /*
     * PURPOSE : SELECT FRANCHISEE TO UPDATE. ONLY AVAILABLE FOR HEADOFFICE USERS
     *  PARAMS : ZEE ID
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function selectFranchiseeSection(zee) {
      var inlineHtml =
        '<div class="form-group container zee_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">SELECT FRANCHISEE</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';
      inlineHtml +=
        '<div class="form-group container zee_select_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 zee"><div class="input-group"><span class="input-group-addon" id="zee_text">FRANCHISEE <span class="mandatory">*</span></span><select id="zee_dropdown" class="form-control zee" ><option value=0></option>';

      //NetSuite Search: Zee Management Console - Franchisees
      var searchZees = search.load({
        id: 'customsearch_zee_management_console_zee',
        type: 'partner'
      });

      var resultSetZees = searchZees.run();

      resultSetZees.each(function(searchResultZees) {
        zeeId = searchResultZees.getValue('internalid');
        franchiseeName = searchResultZees.getValue('companyname');
        mainContact = searchResultZees.getValue('custentity3');
        mainContactFName = searchResultZees.getValue(
          'custentity_franchisee_firstname');
        mainContactLName = searchResultZees.getValue(
          'custentity_franchisee_lastname');
        primaryEmail = searchResultZees.getValue('email');
        personalEmail = searchResultZees.getValue(
          'custentity_personal_email_address');
        mainContactMobile = searchResultZees.getValue(
          'custentity2');
        franchiseeABN = searchResultZees.getValue(
          'custentity_abn_franchiserecord');
        franchiseeAddress = searchResultZees.getValue(
          'shipaddress');

        if (zeeId == zee) {
          inlineHtml += '<option value="' + zeeId + '" selected>' +
            franchiseeName + '</option>';
        } else {
          inlineHtml += '<option value="' + zeeId + '">' + franchiseeName +
            '</option>';
        }

        return true;
      });
      inlineHtml += '</select></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';


      return inlineHtml;
    }

    /*
     * PURPOSE : FRANCHISE MAIN DETAILS TAB
     *  PARAMS : ZEE ID
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function franchiseeMainDetails(zee) {

      //NetSuite Search: Zee Management Console - Franchisees
      var searchZees = search.load({
        id: 'customsearch_zee_management_console_zee',
        type: 'partner'
      });

      if (!isNullorEmpty(zee)) {
        searchZees.filters.push(search.createFilter({
          name: 'internalid',
          join: null,
          operator: search.Operator.IS,
          values: zee
        }));
      }

      var resultSetZees = searchZees.run();

      resultSetZees.each(function(searchResultZees) {
        zeeId = searchResultZees.getValue('internalid');
        franchiseeName = searchResultZees.getValue('companyname');
        mainContact = searchResultZees.getValue('custentity3');
        mainContactFName = searchResultZees.getValue(
          'custentity_franchisee_firstname');
        mainContactLName = searchResultZees.getValue(
          'custentity_franchisee_lastname');
        primaryEmail = searchResultZees.getValue('email');
        personalEmail = searchResultZees.getValue(
          'custentity_personal_email_address');
        mainContactMobile = searchResultZees.getValue(
          'custentity2');
        franchiseeABN = searchResultZees.getValue(
          'custentity_abn_franchiserecord');
        franchiseeAddress = searchResultZees.getValue(
          'shipaddress');
        franchiseeTOLLAccountNumber = searchResultZees.getValue(
          'custentity_toll_acc_number');
        franchiseeTOLLPickupDX = searchResultZees.getText(
          'custentity__toll_pickup_dx_no');
        franchiseeTOLLLodgementDX = searchResultZees.getText(
          'custentity_toll_lodge_dx_no');
        franchiseeSendlePrimaryLocations = searchResultZees.getText(
          'custentity_sendle_hubbed_locations');
        franchiseeLastMileLocations = searchResultZees.getText(
          'custentity_lastmile_suburb');
        franchiseeSendleSecondaryLocations = searchResultZees.getText(
          'custentity_sendle_hubbed_location_sec');
        franchiseeTypeOfOwner = searchResultZees.getValue(
          'custentity_type_of_owner');
        vaccinationStatus = searchResultZees.getValue(
          'custentity_vacc_status');
        dob = searchResultZees.getValue(
          'custentity_zee_dob');
        personalEmail = searchResultZees.getValue(
          'custentity_personal_email_address');
        franchiseeNextOfKinMobile = searchResultZees.getValue(
          'custentity_kin_mobile');
        franchiseeNextOfKinName = searchResultZees.getValue(
          'custentity_kin_name');
        franchiseeNextOfKinRelationship = searchResultZees.getValue(
          'custentity_kin_relationship');
        franchiseeListedForSale = searchResultZees.getValue(
          'custentity_listed_for_sale');

        return true;
      });

      //NetSuite Search: SALESP - Addresses
      var searched_addresses = search.load({
        id: 'customsearch_salesp_address',
        type: 'customer'
      });

      searched_addresses.filters.push(search.createFilter({
        name: 'internalid',
        operator: search.Operator.ANYOF,
        values: zee
      }));

      resultSetAddresses = searched_addresses.run();

      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">FRANCHISEE DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 name_section"><div class="input-group"><span class="input-group-addon">FRANCHISE NAME</span><input id="franchiseeName" class="form-control franchiseeName" value="' +
        franchiseeName + '" readonly/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';
      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">MAIN CONTACT</span><input id="mainContact" data-old="' +
        mainContact + '" class="form-control mainContact" value="' +
        mainContact + '" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">MOBILE NUMBER <span class="mandatory">*</span></span><input id="mainContactMobile" class="form-control mainContact" value="' +
        mainContactMobile + '" data-old="' + mainContactMobile +
        '"/></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 zee"><div class="input-group"><span class="input-group-addon" id="zee_text">TYPE OF OWNER <span class="mandatory">*</span></span><select id="franchiseeTypeOfOwner" class="form-control franchiseeTypeOfOwner" data-old="' +
        franchiseeTypeOfOwner + '">';
      if (franchiseeTypeOfOwner == 0 || isNullorEmpty(franchiseeTypeOfOwner)) {
        inlineHtml +=
          '<option value=0></option><option value=1>COMPANY OWNED</option><option value=2>INVESTOR</option><option value=3>Owner / Operator</option>';
      } else if (franchiseeTypeOfOwner == 1) {
        inlineHtml +=
          '<option value=0></option><option value=1 selected>COMPANY OWNED</option><option value=2>INVESTOR</option><option value=3>Owner / Operator</option>';
      } else if (franchiseeTypeOfOwner == 2) {
        inlineHtml +=
          '<option value=0></option><option value=1>COMPANY OWNED</option><option value=2 selected>INVESTOR</option><option value=3>Owner / Operator</option>';
      } else if (franchiseeTypeOfOwner == 3) {
        inlineHtml +=
          '<option value=0></option><option value=1>COMPANY OWNED</option><option value=2>INVESTOR</option><option value=3 selected>Owner / Operator</option>';
      }

      inlineHtml += '</select></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">ABN</span><input id="franchiseeABN" class="form-control franchiseeABN" readonly value="' +
        franchiseeABN + '" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';


      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">PRIMARY EMAIL</span><input id="primaryEmail" class="form-control primaryEmail" value="' +
        primaryEmail + '" readonly/></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">PERSONAL EMAIL <span class="mandatory">*</span></span><input id="personalEmail" class="form-control personalEmail" value="' +
        personalEmail + '" data-old="' + personalEmail + '" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container company_name_section">';
      inlineHtml += '<div class="row">';
      var dobArray = dob.split('/');
      if (dobArray[1] < 10) {
        dobArray[1] = '0' + dobArray[1];
      }
      if (dobArray[0] < 10) {
        dobArray[0] = '0' + dobArray[0];
      }
      var formattedDOB = dobArray[2] + '-' + dobArray[1] + '-' + dobArray[0]
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">DATE OF BIRTH <span class="mandatory">*</span></span><input id="dob" type="date" class="form-control dob" value="' +
        formattedDOB + '" data-old="' + formattedDOB + '"/></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 zee"><div class="input-group"><span class="input-group-addon" id="zee_text">VACCINATION STATUS <span class="mandatory">*</span></span><select id="vaccinationStatus" class="form-control vaccinationStatus" data-old="' +
        vaccinationStatus + '">';
      if (vaccinationStatus == 1) {
        inlineHtml +=
          '<option value=0></option><option value=1 selected>YES</option><option value=2>NO</option>';
      } else if (vaccinationStatus == 2) {
        inlineHtml +=
          '<option value=0></option><option value=1>YES</option><option value=2 selected>NO</option>';
      } else {
        inlineHtml +=
          '<option value=0 selected></option><option value=1>YES</option><option value=2>NO</option>';
      }

      inlineHtml += '</select></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">ADDRESS DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      //HIDDEN SECTION TO ADD/EDIT ADDRESS DETAILS
      inlineHtml += '<div class="form-group container row_address1 hide">'
      inlineHtml += '<div class="row">';
      inlineHtml += '<input id="internalid" value="" type="hidden"/>'
      inlineHtml +=
        '<div class="col-xs-6 address1_section"><div class="input-group"><span class="input-group-addon">UNIT/LEVEL/SUITE</span><input id="address1" class="form-control address1" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 address2_section"><div class="input-group"><span class="input-group-addon">STREET NO. & NAME <span class="mandatory">*</span></span><input id="address2" class="form-control address2" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container city_state_postcode hide">'
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6"><div class="input-group"><span class="input-group-addon">CITY</span><input id="city" readonly class="form-control city" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">STATE</span><input id="state" readonly class="form-control state" /></div></div>';

      inlineHtml +=
        '<div class="col-xs-3 post_code_section"><div class="input-group"><span class="input-group-addon">POSTCODE</span><input id="postcode" readonly class="form-control postcode" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container saveaddress_section hide">';
      inlineHtml += '<div class="row">';
      inlineHtml += '<div class="col-xs-2 "></div>';
      inlineHtml +=
        '<div class="col-xs-4 reviewaddress"><input type="button" value="SAVE ADDRESSES" class="form-control btn btn-success"  id="saveAddress" /></div>';
      inlineHtml +=
        '<div class="col-xs-4 cancel"><input type="button" value="CANCEL" class="form-control btn btn-secondary"  id="cancel" /></div>';
      inlineHtml += '<div class="col-xs-2 "></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';

      //ADDRESS TABLE
      inlineHtml += addressContactsSection(resultSetAddresses);

      return inlineHtml

    }

    /*
     * PURPOSE : LIST OF FRANCHISEE AGREEMENTS RELATED TO THE ZEE
     *  PARAMS : ZEE ID & USER ROLE
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function franchiseeAgreements(zee, role) {

      //NetSuite Search: Zee Agreement - Search
      var searchZeeAgreements = search.load({
        id: 'customsearch_zee_agree_search',
        type: 'customrecord_fr_agreements'
      });

      if (!isNullorEmpty(zee)) {
        searchZeeAgreements.filters.push(search.createFilter({
          name: 'internalid',
          join: 'CUSTRECORD_FR_AGREEMENT_FRANCHISEE',
          operator: search.Operator.IS,
          values: zee
        }));
      }

      var resultSetZeeAgreements = searchZeeAgreements.run();

      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">FRANCHISE AGREEMENTS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<style>table#zeeAgreementsTable {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#zeeAgreementsTable th{text-align: center;} .bolded{font-weight: bold;}</style>';
      inlineHtml +=
        '<table id="zeeAgreementsTable" class="table table-responsive table-striped zeeAgreementsTable tablesorter" style="width: 100%;border: 1px solid #103d39;">';
      inlineHtml +=
        '<thead style="color: white;background-color: #379E8F;font-weight: bold;">';
      inlineHtml += '<tr class="text-center">';
      //ABILITY TO ADD/EDIT ONLY FOR HEADOFFICE USERS
      if (role != 1000) {
        inlineHtml += '<td>LINK</td>'
      }
      inlineHtml += '<td>NS ID</td>'
      inlineHtml += '<td>NAME</td>'
      inlineHtml += '<td>COMMENCEMENT DATE</td>'
      inlineHtml += '<td>EXPIRY DATE</td>'
      inlineHtml += '<td>ULTIMATE EXPIRY DATE</td>'
      inlineHtml += '<td>RENEWAL TERMS</td>'
      inlineHtml += '<td>AGREEMENT</td>'
      inlineHtml += '<td>AGREEMENT STATUS</td>'
      inlineHtml += '</tr>';
      inlineHtml += '</thead>';

      inlineHtml +=
        '<tbody id="resultOperatorTable" class="">';

      resultSetZeeAgreements.each(function(searchResultZeeAgreements) {

        zeeAgreementID = searchResultZeeAgreements.getValue('internalid');
        zeeAgreementName = searchResultZeeAgreements.getValue('name');
        zeeAgreementCommDate = searchResultZeeAgreements.getValue(
          'custrecord_fr_agreement_comm_date');
        zeeAgreementExpiryDate = searchResultZeeAgreements.getValue(
          'custrecord_fr_agreement_expiry_date');
        zeeAgreementUltExpiryDate = searchResultZeeAgreements.getValue(
          'custrecord_fr_agreement_ult_expiry_date');
        zeeAgreementStatus = searchResultZeeAgreements.getText(
          'custrecord_fr_agreement_status');
        zeeAgreementYearsExtended = searchResultZeeAgreements.getValue(
          'custrecord_fr_agreement_yrs_extended');
        zeeAgreementDeed = searchResultZeeAgreements.getValue(
          'custrecord_fr_agreement_deed');
        1182

        inlineHtml += '<tr>'
          //SHOW EDIT/DELETE LINKS TO ONLY HEADOFFICE USERS
        if (role != 1000) {
          inlineHtml +=
            '<td><button class="form-control btn btn-xs btn-primary glyphicon glyphicon-pencil" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            zeeAgreementID +
            '" class="editOperator" style="cursor: pointer !important;color: white;"></a></button> <button class="form-control btn btn-xs btn-danger glyphicon glyphicon-trash" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            zeeAgreementID +
            '" class="deleteOperator" style="cursor: pointer !important;color: white;"></a></button></td>'
        }
        inlineHtml += '<td>' + zeeAgreementID + '</td>'
        inlineHtml +=
          '<td><b><a href="https://1048144.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=384&id=' +
          zeeAgreementID + '">' + zeeAgreementName + '</a></b></td>'
        inlineHtml += '<td>' + zeeAgreementCommDate + '</td>'
        inlineHtml += '<td>' + zeeAgreementExpiryDate + '</td>'
        inlineHtml += '<td>' + zeeAgreementUltExpiryDate + '</td>'
        inlineHtml += '<td>' + zeeAgreementYearsExtended + '</td>'
        inlineHtml += '<td>' + zeeAgreementDeed + '</td>'
        inlineHtml += '<td>' + zeeAgreementStatus + '</td>'
        inlineHtml += '</tr>';
        return true;
      });

      inlineHtml += '</tbody></table>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      //ABILITY TO CREATE NEW AGREEMENT TO ONLY HEADOFFICE USERS
      if (role != 1000) {
        inlineHtml += franchiseeNewAgreement()
      }

      return inlineHtml;
    }


    /*
     * PURPOSE : TOLL MPEX RELATED DATA.
     *  PARAMS :
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function franchiseeTOLLMPEX() {
      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">TOLL - MPEX</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">TOLL Account Number</span><input id="franchiseeTOLLAccountNumber" class="form-control franchiseeTOLLAccountNumber" value="' +
        franchiseeTOLLAccountNumber + '" readonly/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';
      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">TOLL Pickup DX </span><input id="franchiseeTOLLPickupDX" class="form-control franchiseeTOLLPickupDX" readonly value="' +
        franchiseeTOLLPickupDX + '" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">TOLL Lodgement DX </span><input id="franchiseeTOLLLodgementDX" class="form-control franchiseeTOLLLodgementDX" readonly value="' +
        franchiseeTOLLLodgementDX + '" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml;
    }


    /*
     * PURPOSE : FRANCHISE NEXT OF KIN DETAILS
     *  PARAMS :
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function franchiseeNextOfKin() {
      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">NEXT OF KIN</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-4 name_section"><div class="input-group"><span class="input-group-addon">NAME <span class="mandatory">*</span></span><input id="franchiseeNextOfKinName" type="text" class="form-control franchiseeNextOfKinName" value="' +
        franchiseeNextOfKinName + '" data-old="' + franchiseeNextOfKinName +
        '"/></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 name_section"><div class="input-group"><span class="input-group-addon">MOBILE NUMBER <span class="mandatory">*</span></span><input id="franchiseeNextOfKinMobile" class="form-control franchiseeNextOfKinMobile" value="' +
        franchiseeNextOfKinMobile + '" data-old="' +
        franchiseeNextOfKinMobile + '"/></div></div>';
      inlineHtml +=
        '<div class="col-xs-5 zee"><div class="input-group"><span class="input-group-addon" id="zee_text">RELATIONSHIP <span class="mandatory">*</span></span><select id="franchiseeNextOfKinRelationship" class="form-control franchiseeNextOfKinRelationship" data-old="' +
        franchiseeNextOfKinRelationship + '"><option value=0></option>';
      /*
        Brother	  5
        Daughter	7
        Father	  1
        Friend	  9
        Mother	  2
        Other	    10
        Partner	  4
        Sister	  8
        Son	      6
        Spouse	  3
       */
      log.debug({
        title: 'franchiseeNextOfKinRelationship',
        details: franchiseeNextOfKinRelationship
      })
      switch (parseInt(franchiseeNextOfKinRelationship)) {
        case 5:
          inlineHtml += '<option value=0></option>';
          inlineHtml += '<option value=5 selected>Brother</option>';
          inlineHtml += '<option value=7>Daughter</option>';
          inlineHtml += '<option value=1>Father</option>';
          inlineHtml += '<option value=9>Friend</option>';
          inlineHtml += '<option value=2>Mother</option>';
          inlineHtml += '<option value=4>Partner</option>';
          inlineHtml += '<option value=8>Sister</option>';
          inlineHtml += '<option value=6>Son</option>';
          inlineHtml += '<option value=3>Spouse</option>';
          inlineHtml += '<option value=10>Other</option>';
          break;
        case 7:
          inlineHtml += '<option value=0></option>';
          inlineHtml += '<option value=5>Brother</option>';
          inlineHtml += '<option value=7 selected>Daughter</option>';
          inlineHtml += '<option value=1>Father</option>';
          inlineHtml += '<option value=9>Friend</option>';
          inlineHtml += '<option value=2>Mother</option>';
          inlineHtml += '<option value=4>Partner</option>';
          inlineHtml += '<option value=8>Sister</option>';
          inlineHtml += '<option value=6>Son</option>';
          inlineHtml += '<option value=3>Spouse</option>';
          inlineHtml += '<option value=10>Other</option>';
          break;
        case 1:
          inlineHtml += '<option value=0></option>';
          inlineHtml += '<option value=5>Brother</option>';
          inlineHtml += '<option value=7>Daughter</option>';
          inlineHtml += '<option value=1 selected>Father</option>';
          inlineHtml += '<option value=9>Friend</option>';
          inlineHtml += '<option value=2>Mother</option>';
          inlineHtml += '<option value=4>Partner</option>';
          inlineHtml += '<option value=8>Sister</option>';
          inlineHtml += '<option value=6>Son</option>';
          inlineHtml += '<option value=3>Spouse</option>';
          inlineHtml += '<option value=10>Other</option>';
          break;
        case 9:
          inlineHtml += '<option value=0></option>';
          inlineHtml += '<option value=5>Brother</option>';
          inlineHtml += '<option value=7>Daughter</option>';
          inlineHtml += '<option value=1>Father</option>';
          inlineHtml += '<option value=9 selected>Friend</option>';
          inlineHtml += '<option value=2>Mother</option>';
          inlineHtml += '<option value=4>Partner</option>';
          inlineHtml += '<option value=8>Sister</option>';
          inlineHtml += '<option value=6>Son</option>';
          inlineHtml += '<option value=3>Spouse</option>';
          inlineHtml += '<option value=10>Other</option>';
          break;
        case 2:
          inlineHtml += '<option value=0></option>';
          inlineHtml += '<option value=5>Brother</option>';
          inlineHtml += '<option value=7>Daughter</option>';
          inlineHtml += '<option value=1>Father</option>';
          inlineHtml += '<option value=9>Friend</option>';
          inlineHtml += '<option value=2 selected>Mother</option>';
          inlineHtml += '<option value=4>Partner</option>';
          inlineHtml += '<option value=8>Sister</option>';
          inlineHtml += '<option value=6>Son</option>';
          inlineHtml += '<option value=3>Spouse</option>';
          inlineHtml += '<option value=10>Other</option>';
          break;
        case 10:
          inlineHtml += '<option value=0></option>';
          inlineHtml += '<option value=5>Brother</option>';
          inlineHtml += '<option value=7>Daughter</option>';
          inlineHtml += '<option value=1>Father</option>';
          inlineHtml += '<option value=9>Friend</option>';
          inlineHtml += '<option value=2>Mother</option>';
          inlineHtml += '<option value=4>Partner</option>';
          inlineHtml += '<option value=8>Sister</option>';
          inlineHtml += '<option value=6>Son</option>';
          inlineHtml += '<option value=3>Spouse</option>';
          inlineHtml += '<option value=10 selected>Other</option>';
          break;
        case 4:
          inlineHtml += '<option value=0></option>';
          inlineHtml += '<option value=5>Brother</option>';
          inlineHtml += '<option value=7>Daughter</option>';
          inlineHtml += '<option value=1>Father</option>';
          inlineHtml += '<option value=9>Friend</option>';
          inlineHtml += '<option value=2>Mother</option>';
          inlineHtml += '<option value=4 selected>Partner</option>';
          inlineHtml += '<option value=8>Sister</option>';
          inlineHtml += '<option value=6>Son</option>';
          inlineHtml += '<option value=3>Spouse</option>';
          inlineHtml += '<option value=10>Other</option>';
          break;
        case 8:
          inlineHtml += '<option value=0></option>';
          inlineHtml += '<option value=5>Brother</option>';
          inlineHtml += '<option value=7>Daughter</option>';
          inlineHtml += '<option value=1>Father</option>';
          inlineHtml += '<option value=9>Friend</option>';
          inlineHtml += '<option value=2>Mother</option>';
          inlineHtml += '<option value=4>Partner</option>';
          inlineHtml += '<option value=8 selected>Sister</option>';
          inlineHtml += '<option value=6>Son</option>';
          inlineHtml += '<option value=3>Spouse</option>';
          inlineHtml += '<option value=10>Other</option>';
          break;
        case 6:
          inlineHtml += '<option value=0></option>';
          inlineHtml += '<option value=5>Brother</option>';
          inlineHtml += '<option value=7>Daughter</option>';
          inlineHtml += '<option value=1>Father</option>';
          inlineHtml += '<option value=9>Friend</option>';
          inlineHtml += '<option value=2>Mother</option>';
          inlineHtml += '<option value=4>Partner</option>';
          inlineHtml += '<option value=8>Sister</option>';
          inlineHtml += '<option value=6 selected>Son</option>';
          inlineHtml += '<option value=3>Spouse</option>';
          inlineHtml += '<option value=10>Other</option>';
          break;
        case 3:
          inlineHtml += '<option value=0></option>';
          inlineHtml += '<option value=5>Brother</option>';
          inlineHtml += '<option value=7>Daughter</option>';
          inlineHtml += '<option value=1>Father</option>';
          inlineHtml += '<option value=9>Friend</option>';
          inlineHtml += '<option value=2>Mother</option>';
          inlineHtml += '<option value=4>Partner</option>';
          inlineHtml += '<option value=8>Sister</option>';
          inlineHtml += '<option value=6>Son</option>';
          inlineHtml += '<option value=3 selected>Spouse</option>';
          inlineHtml += '<option value=10>Other</option>';
          break;
        default:
          inlineHtml += '<option value=0 selected></option>';
          inlineHtml += '<option value=5>Brother</option>';
          inlineHtml += '<option value=7>Daughter</option>';
          inlineHtml += '<option value=1>Father</option>';
          inlineHtml += '<option value=9>Friend</option>';
          inlineHtml += '<option value=2>Mother</option>';
          inlineHtml += '<option value=4>Partner</option>';
          inlineHtml += '<option value=8>Sister</option>';
          inlineHtml += '<option value=6>Son</option>';
          inlineHtml += '<option value=3>Spouse</option>';
          inlineHtml += '<option value=10>Other</option>';
          break;
      }
      inlineHtml += '</select></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml;
    }

    /*
     * PURPOSE : FRANCHISEE FIRST & LAST MILE DETAILS
     *  PARAMS :
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function franchiseeAdhoc() {
      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">ADHOC</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">First Mile Primary Location</span><input id="franchiseeSendlePrimaryLocations" class="form-control franchiseeSendlePrimaryLocations" value="' +
        franchiseeSendlePrimaryLocations + '" readonly/></div></div>';
      inlineHtml +=
        '<div class="col-xs-6 name_section"><div class="input-group"><span class="input-group-addon">First Mile Secondary Location</span><input id="franchiseeSendleSecondaryLocations" class="form-control franchiseeSendleSecondaryLocations" value="' +
        franchiseeSendleSecondaryLocations + '" readonly/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      //ABILITY TO ADD/EDIT FIRST MILE SUBURBS
      inlineHtml += franchiseeAddEditFirstMile()

      inlineHtml += '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 name_section"><div class="input-group"><span class="input-group-addon">Last Mile Primary Location</span><input id="franchiseeLastMileLocations" class="form-control franchiseeLastMileLocations" value="' +
        franchiseeLastMileLocations + '" readonly/></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      //BUTTON TO ADD/EDIT LAST MILE SUBURBS
      inlineHtml += franchiseeAddEditLastMile()

      return inlineHtml;
    }


    /*
     * PURPOSE : BUTTON TO REDIRECT PAGE TO FRANCHISE SERVICE NETWORK
     *  PARAMS :
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function franchiseeServiceNetwork() {
      var inlineHtml =
        '<div class="form-group container company_name_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml +=
        '<div class="col-xs-6 heading1"><input type="button" value="Your Franchise Service Network" class="form-control btn btn-primary" id="serviceNetwork" style="background-color: #287587;"/></div>'
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    /*
     * PURPOSE : BUTTON TO REDIRECT PAGE TO CREATION OF NEW AGREEMENT
     *  PARAMS :
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function franchiseeNewAgreement() {

      var inlineHtml =
        '<div class="form-group container company_name_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml +=
        '<div class="col-xs-6 heading1"><input type="button" value="New Agreement" class="form-control btn btn-primary" id="newAgreement" style="background-color: #287587;"/></div>'
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    /*
     * PURPOSE : BUTTON TO ADD NEW OPERATOR TO THE TABLE
     *  PARAMS :
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function franchiseeAddOperator() {
      var inlineHtml =
        '<div class="form-group container company_name_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml +=
        '<div class="col-xs-6 heading1"><input type="button" value="Add New Operator" class="form-control btn btn-primary" id="addOperator" style="background-color: #287587;"/></div>'
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    /*
     * PURPOSE : BUTTON TO ADD NEW VEHICLE TO THE TABLE
     *  PARAMS :
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function franchiseeAddFleet() {
      var inlineHtml =
        '<div class="form-group container company_name_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml +=
        '<div class="col-xs-6 heading1"><input type="button" value="Add New Fleet" class="form-control btn btn-primary" id="addFleet" style="background-color: #287587;"/></div>'
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }


    /*
     * PURPOSE : BUTTON TO REDIRECT PAGE TO FIRST MILE SUBURB SELECTION
     *  PARAMS :
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function franchiseeAddEditFirstMile() {
      var inlineHtml =
        '<div class="form-group container company_name_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml +=
        '<div class="col-xs-6 heading1"><input type="button" value="Add/Edit First-Mile Suburbs" class="form-control btn btn-primary" id="firstMile" style="background-color: #287587;"/></div>'
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    /*
     * PURPOSE : BUTTON TO REDIRECT PAGE TO LAST MILE SUBURB SELECTION
     *  PARAMS :
     * RETURNS : INLINEHTML
     *   NOTES :
     */
    function franchiseeAddEditLastMile() {
      var inlineHtml =
        '<div class="form-group container company_name_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml +=
        '<div class="col-xs-6 heading1"><input type="button" value="Add/Edit Last-Mile Suburbs" class="form-control btn btn-primary" id="lastMile" style="background-color: #287587;"/></div>'
      inlineHtml +=
        '<div class="col-xs-3 heading1"></div>'
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml
    }

    /*
     * PURPOSE : Autogenerates function contract comments
     *  PARAMS : functio -
     * RETURNS :  -
     *   NOTES :
     */
    function franchiseeOperatorDetails(zee, resultSetOperators) {

      var operatorID = '';
      var operatorName = '';
      var operatorPhone = '';
      var operatorEmail = '';
      var operatorEmploymentType = '';
      var operatorRole = '';
      var operatorMobileDev = '';
      var operatorDDS = '';
      var operatorPrimaryOperator = '';

      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">SERVICE NETWORK</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      var directionsPanel_html = '';
      var print_section = '';
      //show the directionsPanel only if one zee selected
      directionsPanel_html +=
        '<div class="col-sm-6 " id="directionsPanel" style="height:500px; overflow:auto"></div>';
      print_section +=
        '</br><div class="row print_section hide"><div class="col-xs-10"></div><div class="col-xs-2"><input type="button" class="btn btn-info" id="printDirections" value="PRINT DIRECTIONS" style="width: 100%;"/></div></div></div>';
      inlineHtml += '</br>';
      inlineHtml +=
        '<div class="container map_section "><div class="row">';
      inlineHtml +=
        '<div class="col-sm-12" id="map" style="height: 500px"><div id="loader"><img src="https://1048144.app.netsuite.com/core/media/media.nl?id=2089999&c=1048144&h=e0aef405c22b65dfe546" alt="loader" /></div></div>';
      inlineHtml += '<div id="legend">';
      inlineHtml +=
        '<div class="hide legend_icons" style="background-color: rgb(255, 255, 255);box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;border-radius: 2px;left: 0px;margin-left: 5px;padding: 3px;"><div><svg height="23" width="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="black" fill="#575756"/></svg><span style="font-family: sans-serif;">Non Customer Location</span></div><div><svg height="23" width="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="black" fill="#008675"/></svg><span style="font-family: sans-serif;">Customer Location</span></div>';
      for (i = 0; i < 1; i++) {
        inlineHtml +=
          '<div><svg height="15" width="32"><line x1="2" y1="10" x2="25" y2="10" style="stroke:' +
          color_array[i] +
          ';stroke-width:2" /></svg><span style="font-family: sans-serif;">' +
          franchiseeName + '</span></div>';
      }
      inlineHtml += '</div>';
      inlineHtml +=
        '<div style="background-color: rgb(255, 255, 255);box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;border-radius: 2px;left: 0px;margin-left: 5px;padding: 3px;"><input class="form-control" type="textarea" placeholder="Territory" id="zee_territory"/></div>';
      inlineHtml += '</div>';

      // inlineHtml += directionsPanel_html;
      inlineHtml += '</div>';
      inlineHtml += print_section;

      inlineHtml += franchiseeServiceNetwork();

      inlineHtml +=
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">OPERATOR DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container row_operator_details hide">'
      inlineHtml += '<div class="row">';
      inlineHtml += '<input id="operatorInternalId" value="" type="hidden"/>'
      inlineHtml +=
        '<div class="col-xs-3 operatorName_section"><div class="input-group"><span class="input-group-addon">Name <span class="mandatory">*</span></span><input id="operatorName" class="form-control operatorName" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 operatorEmail_section"><div class="input-group"><span class="input-group-addon">EMAIL <span class="mandatory">*</span></span><input id="operatorEmail" class="form-control operatorEmail" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 operatorMobile_section"><div class="input-group"><span class="input-group-addon">MOBILE NO. <span class="mandatory">*</span></span><input id="operatorMobile" class="form-control operatorMobile" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">MOBILE DEV </span><select id="operatorMobileDev" class="form-control operatorMobileDev" >';
      /*
        iOS	1
        Android	2
	       Other	5
         */
      inlineHtml +=
        '<option value=0></option><option value=1>iOS</option><option value=2>Android</option><option value=5>Other</option>';
      inlineHtml += '</select></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';


      inlineHtml +=
        '<div class="form-group container row_operatorRole hide">'
      inlineHtml += '<div class="row">';
      /*
        Driver	               2
        Trolley/ Foot Courier	 3
        Franchisee	           5
       */
      inlineHtml +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">ROLE <span class="mandatory">*</span></span><select id="operatorRole" class="form-control operatorRole" >';
      inlineHtml +=
        '<option value=0></option><option value=2>Driver</option><option value=3>Trolley/ Foot Courier</option><option value=5>Franchisee</option>';
      inlineHtml += '</select></div></div>';

      /*
        Employee	       1
        Contractor	     2
        Franchise Owner	 4
       */

      inlineHtml +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">EMPLOYEMENT TYPE <span class="mandatory">*</span></span><select id="operatorEmploymentType" class="form-control operatorEmploymentType" >';
      inlineHtml +=
        '<option value=0></option><option value=1>Employee</option><option value=2>Contractor</option><option value=4>Franchise Owner</option>';
      inlineHtml += '</select></div></div>';

      /*
        Yes	       1
        No	       2
       */
      inlineHtml +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">PRIMARY OPERATOR <span class="mandatory">*</span></span><select id="operatorPrimaryOperator" class="form-control operatorPrimaryOperator" >';
      inlineHtml +=
        '<option value=0></option><option value=1>Yes</option><option value=2>No</option>';
      inlineHtml += '</select></div></div>';

      inlineHtml +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">CONTINGENCY DRIVER <span class="mandatory">*</span></span><select id="operatorContingency" class="form-control operatorContingency" >';
      inlineHtml +=
        '<option value=0></option><option value=1>Yes</option><option value=2>No</option>';
      inlineHtml += '</select></div></div>';


      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container saveoperator_section hide">';
      inlineHtml += '<div class="row">';
      inlineHtml += '<div class="col-xs-2 "></div>';
      inlineHtml +=
        '<div class="col-xs-4 reviewaddress"><input type="button" value="SAVE OPERATOR" class="form-control btn btn-success"  id="saveOperator" /></div>';
      inlineHtml +=
        '<div class="col-xs-4 cancel"><input type="button" value="CANCEL" class="form-control btn btn-secondary"  id="cancel" /></div>';
      inlineHtml += '<div class="col-xs-2 "></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container" style="width: 100% !important;">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<style>table#operatorTable {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#operatorTable th{text-align: center;} .bolded{font-weight: bold;}</style>';
      inlineHtml +=
        '<table id="operatorTable" class="table table-responsive table-striped operatorTable tablesorter" style="width: 100%;border: 1px solid #103d39;">';
      inlineHtml +=
        '<thead style="color: white;background-color: #379E8F;font-weight: bold;">';
      inlineHtml += '<tr class="text-center">';
      inlineHtml += '<td>LINK</td>'
      inlineHtml += '<td>NAME</td>'
      inlineHtml += '<td class="col-xs-2">EMAIL</td>'
      inlineHtml += '<td>PHONE</td>'
      inlineHtml += '<td>ROLE</td>'
      inlineHtml += '<td>EMPLOYMENT TYPE</td>'
      inlineHtml += '<td>CONTINGENCY DRIVER</td>'
      inlineHtml += '<td>PRIMARY DRIVER</td>'
      inlineHtml += '<td>MOBILE DEVICE</td>'
      inlineHtml += '</tr>';
      inlineHtml += '</thead>';

      inlineHtml +=
        '<tbody id="resultOperatorTable" class="">';

      resultSetOperators.each(function(searchResultOperators) {

        operatorID = searchResultOperators.getValue('internalid');
        operatorName = searchResultOperators.getValue('name');
        operatorPhone = searchResultOperators.getValue(
          'custrecord_operator_phone');
        operatorEmail = searchResultOperators.getValue(
          'custrecord_operator_email');
        operatorEmploymentType = searchResultOperators.getText(
          'custrecord_operator_employment');
        var operatorEmploymentTypeID = searchResultOperators.getValue(
          'custrecord_operator_employment');
        operatorRole = searchResultOperators.getText(
          'custrecord_operator_role');
        var operatorRoleID = searchResultOperators.getValue(
          'custrecord_operator_role');
        operatorMobileDev = searchResultOperators.getText(
          'custrecord_operator_mobdev_platform');
        var operatorMobileDevID = searchResultOperators.getValue(
          'custrecord_operator_mobdev_platform');
        operatorDDS = searchResultOperators.getText(
          'custrecord_dds_operator');
        var operatorDDSID = searchResultOperators.getValue(
          'custrecord_dds_operator');
        operatorPrimaryOperator = searchResultOperators.getText(
          'custrecord_primary_operator');
        var operatorPrimaryOperatorID = searchResultOperators.getValue(
          'custrecord_primary_operator');

        log.debug({
          title: 'operatorEmploymentType',
          details: operatorEmploymentType
        })
        log.debug({
          title: 'operatorEmploymentTypeID',
          details: operatorEmploymentTypeID
        })
        log.debug({
          title: 'operatorRole',
          details: operatorRole
        })
        log.debug({
          title: 'operatorRoleID',
          details: operatorRoleID
        })
        log.debug({
          title: 'operatorMobileDevID',
          details: operatorMobileDevID
        })
        log.debug({
          title: 'operatorDDS',
          details: operatorDDS
        })
        log.debug({
          title: 'operatorDDSID',
          details: operatorDDSID
        })
        log.debug({
          title: 'operatorPrimaryOperator',
          details: operatorPrimaryOperator
        })
        log.debug({
          title: 'operatorPrimaryOperatorID',
          details: operatorPrimaryOperatorID
        })

        inlineHtml += '<tr>'
        inlineHtml +=
          '<td><a data-id="' +
          operatorID +
          '" class="btn btn-md btn-primary editOperatorTable" data-changed="notchanged">EDIT</a> <a data-id="' +
          operatorID +
          '" class="btn btn-md btn-danger deleteOperatorTable" >DELETE</a></td>'
        inlineHtml += '<td><input value="' + operatorName +
          '" readonly class="form-control operatorNameTable" /></td>'
        inlineHtml += '<td><input value="' + operatorEmail +
          '" readonly class="form-control operatorEmailTable" /></td>'
        inlineHtml += '<td><input value="' + operatorPhone +
          '" readonly class="form-control operatorPhoneTable" /></td>'
        inlineHtml += '<td><input value="' + operatorRole +
          '" readonly class="form-control operatorRoleTable" /><input id="" class="operatorRoleID" value="' +
          operatorRoleID + '" type="hidden"/></td>'
        inlineHtml += '<td><input value="' + operatorEmploymentType +
          '" readonly class="form-control operatorEmploymentTypeTable"/><input id="" class="operatorEmploymentTypeID" value="' +
          operatorEmploymentTypeID + '" type="hidden"/></td>'
        inlineHtml += '<td><input value="' + operatorDDS +
          '" readonly class="form-control operatorDDSTable" /><input id="" class="operatorDDSID" value="' +
          operatorDDSID + '" type="hidden"/></td>'
        inlineHtml += '<td><input value="' + operatorPrimaryOperator +
          '" readonly class="form-control operatorPrimaryOperatorTable" /><input id="" class="operatorPrimaryOperatorID" value="' +
          operatorPrimaryOperatorID + '" type="hidden"/></td>'
        inlineHtml += '<td><input value="' + operatorMobileDev +
          '" readonly class="form-control operatorMobileDevTable" /><input id="" class="operatorMobileDevID" value="' +
          operatorMobileDevID + '" type="hidden"/></td>'
        inlineHtml += '</tr>';


        return true;
      });

      inlineHtml += '</tbody></table>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += franchiseeAddOperator()

      return inlineHtml;
    }

    function franchiseeFleetDetails(zee, resultSetOperators) {

      //NetSuite Search: Franchisee - Operator Vehicle Details
      var searchZeeVehicles = search.load({
        id: 'customsearch1912',
        type: 'customrecord_vehicle'
      });

      if (!isNullorEmpty(zee)) {
        searchZeeVehicles.filters.push(search.createFilter({
          name: 'internalid',
          join: 'CUSTRECORD_VEHICLE_FRANCHISEE',
          operator: search.Operator.IS,
          values: zee
        }));
      }

      var resultSetZeeVehicles = searchZeeVehicles.run();


      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">FLEET DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container row_fleet_details hide">'
      inlineHtml += '<div class="row">';
      inlineHtml += '<input id="vehicleInternalId" value="" type="hidden"/>'
      inlineHtml +=
        '<div class="col-xs-6 vehicleRego_section"><div class="input-group"><span class="input-group-addon">REGISTRATION <span class="mandatory">*</span></span><input id="vehicleRegistration" class="form-control vehicleRegistration" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container row_fleet_details2 hide">'
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3 operatorEmail_section"><div class="input-group"><span class="input-group-addon">MODEL <span class="mandatory">*</span></span><input id="vehicleModel" class="form-control vehicleModel" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 operatorMobile_section"><div class="input-group"><span class="input-group-addon">MAKE<span class="mandatory">*</span></span><input id="vehicleMake" class="form-control vehicleMake" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 operatorMobile_section"><div class="input-group"><span class="input-group-addon">COLOR <span class="mandatory">*</span></span><input id="vehicleColor" class="form-control vehicleColor" /></div></div>';
      inlineHtml +=
        '<div class="col-xs-3 operatorMobile_section"><div class="input-group"><span class="input-group-addon">YEAR <span class="mandatory">*</span></span><input id="vehicleYear" class="form-control vehicleYear" /></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';


      inlineHtml +=
        '<div class="form-group container row_fleet_details3 hide">'
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">SIGNAGE <span class="mandatory">*</span></span><select id="vehicleSignage" class="form-control vehicleSignage" >';
      inlineHtml +=
        '<option value=0></option><option value=1>Yes</option><option value=2>No</option>';
      inlineHtml += '</select></div></div>';
      inlineHtml +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">CARGO CAGE <span class="mandatory">*</span></span><select id="vehicleCargoCage" class="form-control vehicleCargoCage" >';
      inlineHtml +=
        '<option value=0></option><option value=1>Yes</option><option value=2>No</option>';
      inlineHtml += '</select></div></div>';

      /*
        Employee	       1
        Contractor	     2
        Franchise Owner	 4
       */

      inlineHtml +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">ONWER <span class="mandatory">*</span></span><select id="vehicleOwner" class="form-control vehicleOwner" >';
      inlineHtml +=
        '<option value=0></option><option value=2>Driver</option><option value=3>Trolley/ Foot Courier</option><option value=5>Franchisee</option>';
      inlineHtml += '</select></div></div>';

      inlineHtml +=
        '<div class="col-xs-3"><div class="input-group"><span class="input-group-addon">OPERATOR <span class="mandatory">*</span></span><select id="vehicleOperator" class="form-control vehicleOperator" ><option value=0></option>';

      resultSetOperators.each(function(searchResultOperators) {

        operatorID = searchResultOperators.getValue('internalid');
        operatorName = searchResultOperators.getValue('name');

        inlineHtml +=
          '<option value=' + operatorID + '>' + operatorName +
          '</option>';

        return true;
      });
      inlineHtml += '</select></div></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container savefleet_section hide">';
      inlineHtml += '<div class="row">';
      inlineHtml += '<div class="col-xs-2 "></div>';
      inlineHtml +=
        '<div class="col-xs-4 reviewaddress"><input type="button" value="SAVE FLEET" class="form-control btn btn-success"  id="saveVehicle" /></div>';
      inlineHtml +=
        '<div class="col-xs-4 cancel"><input type="button" value="CANCEL" class="form-control btn btn-secondary"  id="cancel" /></div>';
      inlineHtml += '<div class="col-xs-2 "></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container" style="width: 100% !important;">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<style>table#fleetTable {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#fleetTable th{text-align: center;} .bolded{font-weight: bold;}</style>';
      inlineHtml +=
        '<table id="fleetTable" class="table table-responsive table-striped fleetTable tablesorter" style="width: 100%;border: 1px solid #103d39;">';
      inlineHtml +=
        '<thead style="color: white;background-color: #379E8F;font-weight: bold;">';
      inlineHtml += '<tr class="text-center">';
      inlineHtml += '<td>LINK</td>'
      inlineHtml += '<td>REGISTRATION</td>'
      inlineHtml += '<td>MODEL</td>'
      inlineHtml += '<td>MAKE</td>'
      inlineHtml += '<td>COLOR</td>'
      inlineHtml += '<td>YEAR</td>'
      inlineHtml += '<td>SIGNAGE</td>'
      inlineHtml += '<td>CARGO CAGE</td>'
      inlineHtml += '<td>OWNER</td>'
      inlineHtml += '<td>OPERATOR NAME</td>'
      inlineHtml += '</tr>';
      inlineHtml += '</thead>';

      inlineHtml +=
        '<tbody id="resultOperatorTable" class="">';

      resultSetZeeVehicles.each(function(searchResultZeeVehicles) {
        vehicleID = searchResultZeeVehicles.getValue('internalid');
        vehicleRegistration = searchResultZeeVehicles.getValue('name');
        vehicleModel = searchResultZeeVehicles.getValue(
          'custrecord_vehicle_model_text');
        vehicleMake = searchResultZeeVehicles.getValue(
          'custrecord_vehicle_make');
        vehicleYear = searchResultZeeVehicles.getValue(
          'custrecord_vehicle_year');
        vehicleColor = searchResultZeeVehicles.getValue(
          'custrecord_vehicle_colour');
        vehicleSignage = searchResultZeeVehicles.getValue(
          'custrecord_vehicle_signage');
        vehicleOwnerID = searchResultZeeVehicles.getValue(
          'custrecord_vehicle_owner');
        vehicleOwner = searchResultZeeVehicles.getText(
          'custrecord_vehicle_owner');
        vehicleCargoCageID = searchResultZeeVehicles.getValue(
          'custrecord_cargo_cage');
        vehicleCargoCage = searchResultZeeVehicles.getText(
          'custrecord_cargo_cage');
        vehicleOperatorInternalID = searchResultZeeVehicles.getValue({
          name: "internalid",
          join: "CUSTRECORD_OPERATOR_VEHICLE"
        });
        vehicleOperatorName = searchResultZeeVehicles.getValue({
          name: "custrecord_operator_givennames",
          join: "CUSTRECORD_OPERATOR_VEHICLE"
        });

        inlineHtml += '<tr>'
        inlineHtml +=
          '<td><a data-id="' +
          vehicleID +
          '" class=" btn btn-md btn-primary editFleetTable" data-changed="notchanged">EDIT</a> <a data-id="' +
          vehicleID +
          '" class=" btn btn-md btn-danger deleteFleetTable" >DELETE</a></td>'
        inlineHtml += '<td><input value="' + vehicleRegistration +
          '" readonly class="form-control vehicleRegistrationTable"/></td>'
        inlineHtml += '<td><input value="' + vehicleModel +
          '" readonly class="form-control vehicleModelTable"/></td>'
        inlineHtml += '<td><input value="' + vehicleMake +
          '" readonly class="form-control vehicleMakeTable"/></td>'
        inlineHtml += '<td><input value="' + vehicleColor +
          '" readonly class="form-control vehicleColorTable"/></td>'
        inlineHtml += '<td><input value="' + vehicleYear +
          '" readonly class="form-control vehicleYearTable"/></td>'
        inlineHtml += '<td><input value="' + vehicleSignage +
          '" readonly class="form-control vehicleSignageTable"/><input id="vehicleSignageID" class="vehicleSignageID" value="' +
          vehicleSignage + '" type="hidden"/></td>'
        inlineHtml += '<td><input value="' + vehicleCargoCage +
          '" readonly class="form-control vehicleCargoCageTable"/><input id="vehicleCargoCageID" class="vehicleCargoCageID" value="' +
          vehicleCargoCageID + '" type="hidden"/></td>'
        inlineHtml += '<td><input value="' + vehicleOwner +
          '" readonly class="form-control vehicleOwnerTable"/><input id="vehicleOwnerID" class="vehicleOwnerID" value="' +
          vehicleOwnerID + '" type="hidden"/></td>'
        inlineHtml += '<td><input value="' + vehicleOperatorName +
          '" readonly class="form-control vehicleOperatorNameTable"/><input id="vehicleOperatorID" class="vehicleOperatorID" value="' +
          vehicleOperatorInternalID + '" type="hidden"/></td>'
        inlineHtml += '</tr>';

        return true;
      });

      inlineHtml += '</tbody></table>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += franchiseeAddFleet()

      return inlineHtml;
    }

    function franchiseeBreachDetails() {
      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">BREACH DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml;
    }

    function franchiseeTerminationDetails() {
      var inlineHtml =
        '<div class="form-group container">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">TERMINATION DETAILS</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      return inlineHtml;
    }

    function addressContactsSection(resultSetAddresses) {

      var inlineQty =
        '<div class="form-group container contacts_section" style="font-size: xx-small;">';
      inlineQty += '<div class="row">';
      inlineQty += '<div class="col-xs-12 address_div">';
      inlineQty +=
        '<table border="0" cellpadding="15" id="address" class="table table-responsive table-striped address tablesorter" cellspacing="0" style="width: 100%;border: 1px solid #103d39;font-size: 12px;text-align: center;"><thead style="color: white;background-color: #379E8F;"><tr><th style="vertical-align: middle;text-align: center;">LINK</th><th style="vertical-align: middle;text-align: center;">ID</th><th style="vertical-align: middle;text-align: center;"><b>SUIT/LEVEL/UNIT </b></th><th style="vertical-align: middle;text-align: center;"><b>STREET NO. & NAME </b></th><th style="vertical-align: middle;text-align: center;"><b>SUBURB </b></th><th style="vertical-align: middle;text-align: center;"><b>STATE </b></th><th style="vertical-align: middle;text-align: center;"><b>POSTCODE </b></th></tr></thead><tbody>';

      if (!isNullorEmpty(resultSetAddresses)) {
        //console.log("addresses work");

        resultSetAddresses.each(function(searchResultAddresses) {
          var id = searchResultAddresses.getValue({
            name: 'addressinternalid',
            join: 'Address'
          });
          var addr1 = searchResultAddresses.getValue({
            name: 'address1',
            join: 'Address'
          });
          var addr2 = searchResultAddresses.getValue({
            name: 'address2',
            join: 'Address'
          });
          var city = searchResultAddresses.getValue({
            name: 'city',
            join: 'Address'
          });
          var state = searchResultAddresses.getValue({
            name: 'state',
            join: 'Address'
          });
          var zip = searchResultAddresses.getValue({
            name: 'zipcode',
            join: 'Address'
          });
          var lat = searchResultAddresses.getValue({
            name: 'custrecord_address_lat',
            join: 'Address'
          });
          var lon = searchResultAddresses.getValue({
            name: 'custrecord_address_lon',
            join: 'Address'
          });
          var default_shipping = searchResultAddresses.getValue({
            name: 'isdefaultshipping',
            join: 'Address'
          });
          var default_billing = searchResultAddresses.getValue({
            name: 'isdefaultbilling',
            join: 'Address'
          });
          var default_residential = searchResultAddresses.getValue({
            name: 'isresidential',
            join: 'Address'
          });

          if (isNullorEmpty(addr1) && isNullorEmpty(addr2)) {
            var full_address = city + ', ' + state + ' - ' + zip;
          } else if (isNullorEmpty(addr1) && !isNullorEmpty(addr2)) {
            var full_address = addr2 + ', ' + city + ', ' + state + ' - ' +
              zip;
          } else if (!isNullorEmpty(addr1) && isNullorEmpty(addr2)) {
            var full_address = addr1 + ', ' + city + ', ' + state + ' - ' +
              zip;
          } else {
            var full_address = addr1 + ', ' + addr2 + ', ' + city + ', ' +
              state + ' - ' + zip;
          }


          if (default_shipping == 'T') {
            shipping_state = state;
          }

          inlineQty +=
            '<tr><td><a data-id="' +
            id +
            '" class="btn btn-md btn-primary editAddressTable" data-changed="notchanged">EDIT</a> <a data-id="' +
            id +
            '" class="btn btn-md btn-danger deleteAddressTable" >DELETE</a></td>';
          inlineQty += '<td><input value="' + id +
            '" readonly class="form-control id"/></td>';
          inlineQty += '<td><input value="' + addr1 +
            '" readonly class="form-control addr1Table"/></td>';
          inlineQty += '<td><input value="' + addr2 +
            '" readonly class="form-control addr2Table"/></td>';
          inlineQty += '<td><input value="' + city +
            '" readonly class="form-control cityTable"/></td>';
          inlineQty += '<td><input value="' + state +
            '" readonly class="form-control stateTable"/></td>';
          inlineQty += '<td><input value="' + zip +
            '" readonly class="form-control zipTable"/></td>';


          return true;
        });
      }

      inlineQty += '</tbody></table>';
      inlineQty += '</div>';
      inlineQty += '</div>';
      inlineQty += '</div>';

      inlineQty += '<div class="form-group container reviewaddress_section">';
      inlineQty += '<div class="row">';
      inlineQty += '<div class="col-xs-3 "></div>';
      inlineQty +=
        '<div class="col-xs-6 reviewaddress"><input type="button" value="ADD ADDRESSES" class="form-control btn btn-primary" style="background-color: #287587;" id="reviewaddress" /></div>';
      inlineQty += '<div class="col-xs-3 "></div>';

      inlineQty += '</div>';
      inlineQty += '</div>';

      return inlineQty;
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

    /**
     * The header showing that the results are loading.
     * @returns {String} `inlineQty`
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

    function getDate(inputDate) {
      var date = new Date(inputDate);
      format.format({
        value: date,
        type: format.Type.DATE,
        timezone: format.Timezone.AUSTRALIA_SYDNEY
      })

      return date;
    }

    function getDay() {
      var date = new Date();
      if (date.getHours() > 6) {
        date.setDate(date.getDate() + 1);
      }
      var day = date.getDay();

      return day;
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

    return {
      onRequest: onRequest
    };
  });
