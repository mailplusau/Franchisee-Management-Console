/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * Author:               Ankith Ravindran
 * Created on:           Thu Oct 26 2023
 * Modified on:          Thu Oct 26 2023 10:29:43
 * SuiteScript Version:   
 * Description:           
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
 */


define(['SuiteScripts/jQuery Plugins/Moment JS/moment.min', 'N/email',
    'N/runtime', 'N/search', 'N/record', 'N/http', 'N/log',
    'N/error', 'N/url', 'N/format', 'N/currentRecord'
],
    function (moment, email, runtime, search, record, http, log, error, url,
        format,
        currentRecord) {
        var zee = 0;
        var franchiseeName = 0;
        var userId = 0;
        var role = 0;

        var deleteAddressArray = [];
        var deleteOperatorArray = [];
        var deleteFleetArray = [];

        var startPosition

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
        var myRecord = currentRecord.get();

        var tollUploadSet = [];


        //Fade out the Loading symbol
        function afterLoad() {
            $(".se-pre-con").fadeOut("slow");
            $(".instruction_div").removeClass("hide");
            $(".row_partnership").removeClass("hide");
        }

        //On page load
        function pageInit() {

            //Backgorund color of the page
            $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
            $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
            $("#body").css("background-color", "#CFE0CE");

            $('#tbl_submitter').css('display', 'none');

            //Hide the alert section on the page
            $('#alert').hide();
            $('.error_container').hide();

            // Get the value of custom fields
            zee = (myRecord.getValue({
                fieldId: 'custpage_zee'
            }));
            franchiseeName = myRecord.getValue({
                fieldId: 'custpage_name'
            });
            var day = myRecord.getValue({
                fieldId: 'custpage_day'
            });

            if (!isNullorEmpty(zee)) {
                zee = parseInt(zee)
            }

            //On click of the cancel button, hide all the fields
            $(document).on('focus', '#cancel', function (event) {
                $('.row_address1').addClass('hide')
                $('.city_state_postcode').addClass('hide')
                $('.saveaddress_section').addClass('hide')
                $('.row_operator_details').addClass('hide');
                $('.operatorRole').addClass('hide');
                $('.saveoperator_section').addClass('hide');
                $('.relief_driver_section').addClass('hide');
                $('.row_app_access_required_section').addClass('hide');
                $('.row_fleet_details').addClass('hide');
                $('.row_fleet_details2').addClass('hide');
                $('.row_fleet_details3').addClass('hide');
                $('.savefleet_section').addClass('hide');
                $('.row_relief_required').addClass('hide');
                $('.row_operatorRole').addClass('hide');
            });

            //Google Dropdown for the address2 field
            $(document).on('focus', '#address2', function (event) {
                // alert('onfocus')
                initAutocomplete();
            });

            afterLoad();

            //Reload the page with the selected franchisee from the dropdown
            $(document).on("change", "#zee_dropdown", function (e) {
                var zee = $(this).val();
                var url = baseURL +
                    "/app/site/hosting/scriptlet.nl?script=1399&deploy=1";

                url += "&zee=" + zee + "";

                window.location.href = url;
            });

            //ON CHANGE OF RELIEF DRIVER REQUIRED DROPDOWN?
            $(document).on("change", "#relief_required", function (e) {
                var reliefDriverRequired = $(this).val();
                if (reliefDriverRequired == 1) {
                    $('.relief_driver_section').removeClass('hide');
                    $('.row_app_access_required_section').removeClass('hide');
                    $('.operator_change_section').removeClass('hide');
                } else if (reliefDriverRequired == 2 || reliefDriverRequired == 0) {
                    $('.relief_driver_section').addClass('hide');
                    $('.operator_change_section').addClass('hide');
                    $('.row_app_access_required_section').addClass('hide');
                }
            });

            //ON CHANGE OF app access REQUIRED DROPDOWN?
            $(document).on("change", "#app_access_required", function (e) {
                var appAccessRequired = $(this).val();
                if (appAccessRequired == 2) {
                    $('.relief_sharing_app_section').removeClass('hide');
                } else if (appAccessRequired == 1 || appAccessRequired == 0) {
                    $('.relief_sharing_app_section').addClass('hide');
                }
            });

            //On click of Add Address. unhide the fields
            $(document).on("click", "#reviewaddress", function (e) {
                $('.row_address1').removeClass('hide')
                $('.city_state_postcode').removeClass('hide')
                $('.saveaddress_section').removeClass('hide')

            });

            //On click of Add Operator, unhide the fields
            $(document).on("click", "#addOperator", function (e) {
                $('.row_operator_details').removeClass('hide');
                $('.row_operatorRole').removeClass('hide');
                $('.saveoperator_section').removeClass('hide');
                $('.row_relief_required').removeClass('hide');
                // $('.relief_driver_section').removeClass('hide');

            });

            //On click of Edit Operator, populate the fields with the values from the respective row that is being edited
            $(document).on("click", ".editOperatorTable", function (e) {

                //Get the App Operator Internal ID
                var operatorId = $(this).closest('tr').find('.editOperatorTable')
                    .attr(
                        'data-id')
                console.log(operatorId)
                $('#operatorInternalId').val(operatorId);

                var operatorRecord = record.load({
                    type: 'customrecord_operator',
                    id: operatorId
                });

                var operatorEmail = operatorRecord.getValue({
                    fieldId: 'custrecord_operator_email'
                })
                var operatorMobile = operatorRecord.getValue({
                    fieldId: 'custrecord_operator_phone'
                })
                var reliefDriverAppAccessRequired = operatorRecord.getValue({
                    fieldId: 'custrecord_relief_driver_app_access'
                })
                var reliefDriverSharingAppAccess = operatorRecord.getValue({
                    fieldId: 'custrecord_relief_driver_sharing_login'
                })

                //Get the values of the row from the table
                var operatorName = $(this).closest('tr').find(
                    '.operatorNameTable').val()

                var operatorLeaveStartDate = $(this).closest('tr').find(
                    '.operatorLeaveStartDateTable').val()
                var operatorLeaveEndDate = $(this).closest('tr').find(
                    '.operatorLeaveEndDateTable').val()
                var customerNotified = $(this).closest('tr').find(
                    '.customerNotifiedTable').val()
                var customerNotifiedID = $(this).closest('tr').find('.customerNotifiedID')
                    .val()
                var operatorReliefDriverRequired = $(this).closest('tr').find(
                    '.operatorReliefDriverRequiredTable').val()
                var operatorReliefDriverRequiredID = $(this).closest('tr').find('.operatorReliefDriverRequiredID')
                    .val()

                var operatorReliefDriverName = $(this).closest('tr').find(
                    '.operatorReliefDriverNameTable').val()
                var operatorReliefDriverMobile = $(this).closest('tr').find(
                    '.operatorReliefDriverMobileTable').val()
                var operatorReliefDriverEmail = $(this).closest('tr').find(
                    '.operatorReliefDriverEmailTable').val()
                var leaveNotes = $(this).closest('tr').find(
                    '.operatorLeaveNotesTable').val()

                console.log('operatorReliefDriverRequiredID: ' + operatorReliefDriverRequiredID);
                console.log('operatorLeaveStartDate: ' + operatorLeaveStartDate);
                console.log('operatorLeaveEndDate: ' + operatorLeaveEndDate);

                var operatorLeaveStartDateArray = operatorLeaveStartDate.split('/');
                if (operatorLeaveStartDateArray[1] < 10) {
                    operatorLeaveStartDateArray[1] = '0' + operatorLeaveStartDateArray[1];
                }
                if (operatorLeaveStartDateArray[0] < 10) {
                    operatorLeaveStartDateArray[0] = '0' + operatorLeaveStartDateArray[0];
                }
                var formattedoperatorLeaveStartDate = operatorLeaveStartDateArray[2] + '-' + operatorLeaveStartDateArray[1] + '-' + operatorLeaveStartDateArray[0]

                var operatorLeaveEndDateArray = operatorLeaveEndDate.split('/');
                if (operatorLeaveEndDateArray[1] < 10) {
                    operatorLeaveEndDateArray[1] = '0' + operatorLeaveEndDateArray[1];
                }
                if (operatorLeaveEndDateArray[0] < 10) {
                    operatorLeaveEndDateArray[0] = '0' + operatorLeaveEndDateArray[0];
                }
                var formattedoperatorLeaveEndDate = operatorLeaveEndDateArray[2] + '-' + operatorLeaveEndDateArray[1] + '-' + operatorLeaveEndDateArray[0]

                //Populate the fields from the values got from the row of the table
                $('.operatorName').val(operatorName);
                $('.operatorEmail').val(operatorEmail);
                $('.operatorMobile').val(operatorMobile);

                $('.leaveStartDate').val(formattedoperatorLeaveStartDate);
                $('.leaveEndDate').val(formattedoperatorLeaveEndDate);

                if (!isNullorEmpty(operatorReliefDriverRequiredID)) {
                    $('.relief_driver_section').removeClass('hide');
                    $('.operator_change_section').removeClass('hide');
                    $('.row_app_access_required_section').removeClass('hide');
                    $('.relief_required').val(operatorReliefDriverRequiredID);
                } else {
                    var partnershipProgram = $('#partnership').val();
                    if (partnershipProgram == 1) {
                        $('.relief_required').val(1);
                        $('.relief_driver_section').removeClass('hide');
                        $('.operator_change_section').removeClass('hide');
                        $('.row_app_access_required_section').removeClass('hide');
                    } else if (partnershipProgram == 2 || partnershipProgram == 0) {
                        $('.relief_driver_section').addClass('hide');
                        $('.operator_change_section').addClass('hide');
                        $('.row_app_access_required_section').addClass('hide');
                    }
                }

                if (!isNullorEmpty(reliefDriverAppAccessRequired)) {
                    $('.app_access_required').val(reliefDriverAppAccessRequired);
                }
                if (!isNullorEmpty(reliefDriverSharingAppAccess)) {
                    $('.sharing_app').val(reliefDriverSharingAppAccess);
                }

                $('.customerNotified').val(customerNotifiedID);

                $('.reliefDriverName').val(operatorReliefDriverName);
                $('.reliefDriverMobile').val(operatorReliefDriverMobile);
                $('.reliefDriverEmail').val(operatorReliefDriverEmail);
                $('#leaveNotes').val(leaveNotes);



                //Unhide the fields
                $('.row_operator_details').removeClass('hide');
                $('.row_operatorRole').removeClass('hide');
                $('.saveoperator_section').removeClass('hide');
                $('.row_relief_required').removeClass('hide');

            });


            //On click of Save Operator, either create a new row in the table or update the existing row with the values from the fields
            $(document).on("click", "#saveOperator", function (e) {

                //Get values from the fields
                var errorMessage = '';
                var operatorID = $('#operatorInternalId').val();
                var operatorName = $('.operatorName').val();
                var operatorEmail = $('.operatorEmail').val();
                var operatorMobile = $('.operatorMobile').val();

                var operatorLeaveStartDate = $('.leaveStartDate').val();
                var operatorLeaveEndDate = $('.leaveEndDate').val();

                var operatorReliefDriverName = $('.reliefDriverName').val();
                var operatorReliefDriverMobile = $('.reliefDriverMobile').val();
                var operatorReliefDriverEmail = $('.reliefDriverEmail').val();

                var operatorLeaveNotes = $('#leaveNotes').val();

                var reliefDriverRequired = $('.relief_required option:selected').val();
                var reliefDriverRequiredText = $('.relief_required option:selected').text();
                var customerNotified = $('.customerNotified option:selected').val();
                var customerNotifiedText = $('.customerNotified option:selected').text();

                var appAccessRequired = $('.app_access_required option:selected').val();
                var appAccessRequiredText = $('.app_access_required option:selected').text();

                var sharingApp = $('.sharing_app option:selected').val();
                var sharingAppText = $('.sharing_app option:selected').text();

                //Throw error if the Leave Start Date fields is blank
                if (isNullorEmpty(operatorLeaveStartDate)) {
                    errorMessage +=
                        'Please Select Leave Start Date</br>';
                }

                //Throw error if the Leave End Date fields is blank
                if (isNullorEmpty(operatorLeaveEndDate)) {
                    errorMessage +=
                        'Please Select Leave End Date</br>';
                }

                if (isNullorEmpty(customerNotified)) {
                    errorMessage +=
                        'Please Select Customer Notified</br>';
                }

                if (isNullorEmpty(reliefDriverRequired)) {
                    errorMessage +=
                        'Please Select Relief Driver Required</br>';
                }

                if (reliefDriverRequired == 1) {

                    //Throw error if the Relief Driver Name is blank
                    if (isNullorEmpty(operatorReliefDriverName)) {
                        errorMessage +=
                            'Please Enter the Relief Driver Name</br>';
                    }

                    //Throw error if the Relief Driver Mobile is blank
                    if (isNullorEmpty(operatorReliefDriverMobile)) {
                        errorMessage +=
                            'Please Enter the Relief Driver Mobile</br>';
                    }

                    //Throw error if the Relief Driver Email is blank
                    if (isNullorEmpty(operatorReliefDriverEmail)) {
                        errorMessage +=
                            'Please Enter the Relief Driver Email</br>';
                    }

                    if (isNullorEmpty(appAccessRequired)) {
                        errorMessage +=
                            'Please Select App Access Required</br>';
                    } else if (appAccessRequired != 1) {
                        if (isNullorEmpty(sharingApp)) {
                            errorMessage +=
                                'Please Select Sharing App Access</br>';
                        }
                    }

                }

                //Show the error message
                if (!isNullorEmpty(errorMessage)) {
                    showAlert(errorMessage);
                    return false;
                } else {

                    // Set the value of custom fields
                    myRecord.setValue({
                        fieldId: 'custpage_operatorids',
                        value: operatorID
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatorname',
                        value: operatorName
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatorleavestartdate',
                        value: operatorLeaveStartDate
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatorleaveenddate',
                        value: operatorLeaveEndDate
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatorreliefdrivername',
                        value: operatorReliefDriverName
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatorreliefdrivermobile',
                        value: operatorReliefDriverMobile
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatorreliefdriveremail',
                        value: operatorReliefDriverEmail
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatorleavenotes',
                        value: operatorLeaveNotes
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatorreliefdriverrequired',
                        value: reliefDriverRequired
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_customernotified',
                        value: customerNotified
                    });

                    myRecord.setValue({
                        fieldId: 'custpage_app_access_required',
                        value: appAccessRequired
                    });

                    myRecord.setValue({
                        fieldId: 'custpage_sharing_app',
                        value: sharingApp
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operator_notified',
                        value: sharingApp
                    });

                    document.getElementById('submitter').click();

                    //Blank out all the fields
                    $('.operatorName').val("");
                    $('.operatorEmail').val("");
                    $('.operatorMobile').val("");
                    $('.leaveStartDate').val("");
                    $('.leaveEndDate').val("");
                    $('.reliefDriverName').val("");
                    $('.reliefDriverMobile').val("");
                    $('.reliefDriverEmail').val("");
                    $('.leaveNotes').val("");
                    $('.customerNotified').val(0);

                    //Hide the FIELDS
                    $('.row_operator_details').addClass('hide');
                    $('.row_operatorRole').addClass('hide');
                    $('.saveoperator_section').addClass('hide');
                    $('.row_relief_required').addClass('hide');
                    $('.relief_driver_section').addClass('hide');
                    $('.operator_change_section').addClass('hide');
                    $('.row_app_access_required_section').addClass('hide');
                    $('.relief_sharing_app_section').addClass('hide');
                }
            });

            $(document).on("click", ".deleteOperatorTable", function (e) {
                var operatorID = $('#operatorInternalId').val();
                if (confirm(
                    "Are you sure you want to delete the leave registered?\n\nThis action cannot be undone."
                )) {
                    var operatorId = $(this).closest('tr').find('.editOperatorTable')
                        .attr(
                            'data-id');
                    myRecord.setValue({
                        fieldId: 'custpage_operatorids',
                        value: operatorId
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_delete_leave',
                        value: 'true'
                    });

                    document.getElementById('submitter').click();
                }
            });

            /**
             * Close the Alert box on click
             */
            $(document).on('click', '#alert .close', function (e) {
                $(this).parent().hide();
            });

            //On click of the Update Details button, store the values in the hidden fields after validation
            $(document).on("click", "#updateDetails", function (e) {

                console.log('inside update details')

                //MAIN DETAILS
                var mainContact = $('#mainContact').val();
                var mainContactMobile = $('#mainContactMobile').val();
                var franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
                var franchiseeABN = $('#franchiseeABN').val();
                var personalEmail = $('#personalEmail').val();
                var dob = $('#dob').val();
                var vaccinationStatus = $('#vaccinationStatus').val();
                var franchiseeNextOfKinName = $('#franchiseeNextOfKinName').val();
                var franchiseeNextOfKinMobile = $('#franchiseeNextOfKinMobile').val();
                var franchiseeNextOfKinRelationship = $(
                    '#franchiseeNextOfKinRelationship').val();

                //ADDRESS SECTION
                var edit_address_elem = document.getElementsByClassName(
                    "editAddressTable");

                var addr1_elem = document.getElementsByClassName("addr1Table");
                var addr2_elem = document.getElementsByClassName("addr2Table");
                var city_elem = document.getElementsByClassName("cityTable");
                var state_elem = document.getElementsByClassName("stateTable");
                var zip_elem = document.getElementsByClassName("zipTable");

                var masterclass = $('#masterclass').val();
                var reviews = $('#reviews').val();

                var addressIdsArray = []
                var address1Array = []
                var address2Array = []
                var addressSuburbArray = []
                var addressStateArray = []
                var addressPostcodeArray = []

                //Store the address values from the table into arrays
                for (var i = 0; i < edit_address_elem.length; ++i) {
                    var row_address_id = edit_address_elem[i].getAttribute(
                        'data-id');
                    var row_address_changed = edit_address_elem[i].getAttribute(
                        'data-changed');
                    if (row_address_changed == "changed") {
                        addressIdsArray[addressIdsArray.length] = row_address_id
                        address1Array[address1Array.length] = addr1_elem[i].value
                        address2Array[address2Array.length] = addr2_elem[i].value
                        addressSuburbArray[addressSuburbArray.length] = city_elem[i].value
                        addressStateArray[addressStateArray.length] = state_elem[i].value
                        addressPostcodeArray[addressPostcodeArray.length] = zip_elem[
                            i]
                            .value
                    }
                }

                //OPERATOR SECTIONS
                var edit_operator_elem = document.getElementsByClassName(
                    "editOperatorTable");
                var edit_name_elem = document.getElementsByClassName(
                    "operatorNameTable");
                var operator_email_elem = document.getElementsByClassName(
                    "operatorEmailTable");
                var operator_phone_elem = document.getElementsByClassName(
                    "operatorPhoneTable");
                var operator_role_elem = document.getElementsByClassName(
                    "operatorRoleTable");
                var operator_roleid_elem = document.getElementsByClassName(
                    "operatorRoleID");
                var operator_type_elem = document.getElementsByClassName(
                    "operatorEmploymentTypeTable");
                var operator_typeid_elem = document.getElementsByClassName(
                    "operatorEmploymentTypeID");
                var operator_dds_elem = document.getElementsByClassName(
                    "operatorDDSTable");
                var operator_ddsid_elem = document.getElementsByClassName(
                    "operatorDDSID");
                var operator_primary_elem = document.getElementsByClassName(
                    "operatorPrimaryOperatorTable");
                var operator_primaryid_elem = document.getElementsByClassName(
                    "operatorPrimaryOperatorID");
                var operator_mobdev_elem = document.getElementsByClassName(
                    "operatorMobileDevTable");
                var operator_mobdevid_elem = document.getElementsByClassName(
                    "operatorMobileDevID");

                var operator_compliant_uniform_elem = document.getElementsByClassName(
                    "operatorCompliantUniformTable");
                var operator_compliant_uniform_id_elem = document.getElementsByClassName(
                    "operatorCompliantUniformID");

                var operatorIdsArray = []
                var operatorNewIdsArray = []
                var operatorNameArray = []
                var operatorNewNameArray = []
                var operatorEmailArray = []
                var operatorNewEmailArray = []
                var operatorMobileArray = []
                var operatorNewMobileArray = []
                var operatorRoleArray = []
                var operatorNewRoleArray = []
                var operatorEmploymentTypeArray = []
                var operatorNewEmploymentTypeArray = []
                var operatorDDSArray = []
                var operatorNewDDSArray = []
                var operatorPrimaryArray = []
                var operatorNewPrimaryArray = []
                var operatorMobileDevArray = []
                var operatorNewMobileDevArray = []

                var operatorCompliantUniformArray = []
                var operatorNewCompliantUniformArray = []

                for (var i = 0; i < edit_operator_elem.length; ++i) {
                    var row_operator_id = edit_operator_elem[i].getAttribute(
                        'data-id');
                    var row_operator_changed = edit_operator_elem[i].getAttribute(
                        'data-changed');
                    console.log('row_operator_id: ' + row_operator_id);
                    if (!isNullorEmpty(row_operator_id)) {
                        if (row_operator_changed == "changed") {
                            operatorIdsArray[operatorIdsArray.length] = row_operator_id
                            operatorNameArray[operatorNameArray.length] =
                                edit_name_elem[
                                    i]
                                    .value
                            operatorEmailArray[operatorEmailArray.length] =
                                operator_email_elem[i].value
                            operatorMobileArray[operatorMobileArray.length] =
                                operator_phone_elem[i].value
                            operatorRoleArray[operatorRoleArray.length] =
                                operator_roleid_elem[i].value
                            operatorEmploymentTypeArray[operatorEmploymentTypeArray.length] =
                                operator_typeid_elem[i].value
                            operatorDDSArray[operatorDDSArray.length] =
                                operator_ddsid_elem[
                                    i].value
                            operatorPrimaryArray[operatorPrimaryArray.length] =
                                operator_primaryid_elem[i].value
                            operatorMobileDevArray[operatorMobileDevArray.length] =
                                operator_mobdevid_elem[i].value
                            operatorCompliantUniformArray[operatorCompliantUniformArray.length] =
                                operator_compliant_uniform_id_elem[i].value
                        }
                    } else {
                        operatorNewIdsArray[operatorNewIdsArray.length] =
                            edit_name_elem[
                                i]
                                .value
                        operatorNewNameArray[operatorNewNameArray.length] =
                            edit_name_elem[
                                i]
                                .value
                        operatorNewEmailArray[operatorNewEmailArray.length] =
                            operator_email_elem[i].value
                        operatorNewMobileArray[operatorNewMobileArray.length] =
                            operator_phone_elem[i].value
                        operatorNewRoleArray[operatorNewRoleArray.length] =
                            operator_roleid_elem[i].value
                        operatorNewEmploymentTypeArray[operatorNewEmploymentTypeArray
                            .length] =
                            operator_typeid_elem[i].value
                        operatorNewDDSArray[operatorNewDDSArray.length] =
                            operator_ddsid_elem[
                                i].value
                        operatorNewPrimaryArray[operatorNewPrimaryArray.length] =
                            operator_primaryid_elem[i].value
                        operatorNewMobileDevArray[operatorNewMobileDevArray.length] =
                            operator_mobdevid_elem[i].value
                        operatorNewCompliantUniformArray[operatorNewCompliantUniformArray.length] =
                            operator_compliant_uniform_id_elem[i].value
                    }

                }

                //Validation of the franchisee main details
                if (validate()) {
                    myRecord.setValue({
                        fieldId: 'custpage_maincontact',
                        value: mainContact
                    });

                    myRecord.setValue({
                        fieldId: 'custpage_mobilenumber',
                        value: mainContactMobile
                    });

                    myRecord.setValue({
                        fieldId: 'custpage_typeofowner',
                        value: franchiseeTypeOfOwner
                    });

                    myRecord.setValue({
                        fieldId: 'custpage_personalemail',
                        value: personalEmail
                    });

                    myRecord.setValue({
                        fieldId: 'custpage_dob',
                        value: dob
                    });

                    myRecord.setValue({
                        fieldId: 'custpage_vaccinationstatus',
                        value: vaccinationStatus
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_masterclass',
                        value: masterclass
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_reviews',
                        value: reviews
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_nextofkinname',
                        value: franchiseeNextOfKinName
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_nextofkinmobile',
                        value: franchiseeNextOfKinMobile
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_nextofkinrelationship',
                        value: franchiseeNextOfKinRelationship
                    });

                    myRecord.setValue({
                        fieldId: 'custpage_addressids',
                        value: addressIdsArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_address1',
                        value: address1Array.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_address2',
                        value: address2Array.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_suburb',
                        value: addressSuburbArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_state',
                        value: addressStateArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_postcode',
                        value: addressPostcodeArray.toString()
                    });

                    myRecord.setValue({
                        fieldId: 'custpage_operatorids',
                        value: operatorIdsArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatorname',
                        value: operatorNameArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatoremail',
                        value: operatorEmailArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatormobile',
                        value: operatorMobileArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatorrole',
                        value: operatorRoleArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatoremploymentype',
                        value: operatorEmploymentTypeArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatordds',
                        value: operatorDDSArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatorprimary',
                        value: operatorPrimaryArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatormobiledev',
                        value: operatorMobileDevArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_operatorcompliantuniform',
                        value: operatorCompliantUniformArray.toString()
                    });

                    //New Operator Details
                    myRecord.setValue({
                        fieldId: 'custpage_new_operatorids',
                        value: operatorNewIdsArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_new_operatorname',
                        value: operatorNewNameArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_new_operatoremail',
                        value: operatorNewEmailArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_new_operatormobile',
                        value: operatorNewMobileArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_new_operatorrole',
                        value: operatorNewRoleArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_new_operatoremploymentype',
                        value: operatorNewEmploymentTypeArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_new_operatordds',
                        value: operatorNewDDSArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_new_operatorprimary',
                        value: operatorNewPrimaryArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_new_operatormobiledev',
                        value: operatorNewMobileDevArray.toString()
                    });
                    myRecord.setValue({
                        fieldId: 'custpage_new_operatorcompliantuniform',
                        value: operatorNewCompliantUniformArray.toString()
                    });



                    document.getElementById('submitter').click();
                }
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
            $('.error_container').show();
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0;
            setTimeout(function () {
                $('#alert').hide();
                $('.error_container').hide();
            }, 100000);
        }


        /*
         * PURPOSE : Validate the franchisee main details
         *  PARAMS :
         * RETURNS :
         *   NOTES :
         */
        function validate() {
            var mainContact = $('#mainContact').val();
            var mainContactMobile = $('#mainContactMobile').val();
            var franchiseeTypeOfOwner = $('#franchiseeTypeOfOwner').val();
            var franchiseeABN = $('#franchiseeABN').val();
            var personalEmail = $('#personalEmail').val();
            var dob = $('#dob').val();
            var vaccinationStatus = $('#vaccinationStatus').val();
            var franchiseeNextOfKinName = $('#franchiseeNextOfKinName').val();
            var franchiseeNextOfKinMobile = $('#franchiseeNextOfKinMobile').val();
            var franchiseeNextOfKinRelationship = $(
                '#franchiseeNextOfKinRelationship').val();

            var masterclass = $('#masterclass').val();
            var reviews = $('#reviews').val();

            var errorMessage = '';

            console.log('inside validate')

            if (isNullorEmpty(mainContact)) {
                errorMessage += 'Please Enter Main Contact</br>';

            }
            if (isNullorEmpty(mainContactMobile)) {
                errorMessage += 'Please Enter Main Contact Mobile Number</br>';

            }
            if (isNullorEmpty(franchiseeTypeOfOwner)) {
                errorMessage += 'Please Select Type of Owner</br>';

            }
            if (isNullorEmpty(personalEmail)) {
                errorMessage += 'Please Enter Personal Email</br>';

            }
            if (isNullorEmpty(dob)) {
                errorMessage += 'Please Select Date of Birth</br>';

            }
            if (isNullorEmpty(vaccinationStatus)) {
                errorMessage += 'Please Select Vaccination Status</br>';
            }

            if (isNullorEmpty(masterclass)) {
                errorMessage += 'Please Select Prospecting Masterclass Status</br>';
            }
            if (isNullorEmpty(reviews)) {
                errorMessage += 'Please Select Customer Reviews Status</br>';
            }

            if (isNullorEmpty(franchiseeNextOfKinName)) {
                errorMessage += 'Please Enter Next of Kin Name</br>';
            }
            if (isNullorEmpty(franchiseeNextOfKinMobile)) {
                errorMessage += 'Please Enter Next of Kin Mobile Number</br>';
            }
            if (isNullorEmpty(franchiseeNextOfKinRelationship)) {
                errorMessage += 'Please Select Next of Kin Relationship</br>';
            }

            if (!isNullorEmpty(errorMessage)) {
                showAlert(errorMessage);
                return false;
            } else {
                return true;
            }

        }


        /*
         * PURPOSE : Save Record
         *  PARAMS :
         * RETURNS :
         *   NOTES :
         */
        function saveRecord() {
            console.log('inside save record')
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

            resultSetServiceLeg.each(function (searchResult) {
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
                var parsedWayPointProperties = JSON.parse(waypoint_otherproperties[
                    i]);
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
                    } else if (parsedWayPointProperties[x].location_type ==
                        'customer') {
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
                        franchiseeName + '<br/> Service Time: ' + onTimeChange(time) +
                        '';
                    // attachInstructionText(
                    //   stepDisplay, marker, content, map);
                    marker_count++;
                }

            }
        }

        function attachInstructionText(stepDisplay, marker, text, map) {
            google.maps.event.addListener(marker, 'click', function () {
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
                    directionsService.route(request, function (result, status) {
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
                                unsortedResults.sort(function (a, b) {
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
                            setTimeout(function () {
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
            if (val == '' || val == null || val == 0 || val == '0' || val == ' ') {
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
