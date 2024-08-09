/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * Author:               Ankith Ravindran
 * Created on:           Tue Feb 13 2024
 * Modified on:          2024-02-20T03:06:50.942Z
 * SuiteScript Version:  2.0
 * Description:          ClientScript for the suitelet that displays the list of LPO Leads that have come through from the webpage, https://mailplus.com.au/lpo-owner-info-page/   

 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */


define(['SuiteScripts/jQuery Plugins/Moment JS/moment.min', 'N/email',
    'N/runtime', 'N/search', 'N/record', 'N/http', 'N/log',
    'N/error', 'N/url', 'N/format', 'N/currentRecord'
],
    function (moment, email, runtime, search, record, http, log, error, url,
        format,
        currentRecord) {

        var baseURL = 'https://1048144.app.netsuite.com';
        if (runtime.EnvType == "SANDBOX") {
            baseURL = 'https://1048144-sb3.app.netsuite.com';
        }

        //Fade out the Loading symbol
        function afterLoad() {
            $('.loading_section').addClass('hide');
            $(".instruction_div").removeClass("hide");
            $(".lead_mp_details_section").removeClass("hide");
            $(".lpo_profile_leads_div").removeClass("hide");
            $(".zee_list_div").removeClass("hide");
            $(".apply_filter_buttons_section").removeClass("hide");
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
            autocomplete = new google.maps.places.Autocomplete((document.getElementById('lpo_lead_address2')), options);

            // When the user selects an address from the dropdown, populate the address fields in the form.
            autocomplete.addListener('place_changed', fillInAddress);
        }

        function setupClickListener(id, types) {
            // var radioButton = document.getElementById(id);
            // radioButton.addEventListener('click', function() {
            autocomplete.setTypes([]);
            // });
        }

        function fillInAddress() {

            // Get the place details from the autocomplete object.
            var place = autocomplete.getPlace();

            // $('#lat').val(place.geometry.location.lat());
            // $('#lng').val(place.geometry.location.lng());

            // Get each component of the address from the place details and fill the corresponding field on the form.
            var addressComponent = "";

            for (var i = 0; i < place.address_components.length; i++) {

                if (place.address_components[i].types[0] == 'street_number' || place.address_components[
                    i].types[0] == 'route') {
                    addressComponent += place.address_components[i]['short_name'] + " ";
                    $('#lpo_lead_address2').val(addressComponent);
                }
                if (place.address_components[i].types[0] == 'postal_code') {
                    $('#lpo_lead_postcode').val(place.address_components[i]['short_name']);
                }
                if (place.address_components[i].types[0] == 'administrative_area_level_1') {
                    $('#lpo_lead_state').val(place.address_components[i]['short_name']);
                }
                if (place.address_components[i].types[0] == 'locality') {
                    $('#lpo_lead_city').val(place.address_components[i]['short_name']);
                }
            }
        }


        //On page load
        function pageInit() {

            //Backgorund color of the page
            $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
            $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
            $("#body").css("background-color", "#CFE0CE");
            $(".body_2010").css("background-color", "#CFE0CE");

            $('#tbl_submitter').css('display', 'none');

            $(document).ready(function () {
                $('.js-example-basic-multiple').select2();
            });

            //Hide the alert section on the page
            $('#alert').hide();
            $('.error_container').hide();


            var dataTable2 = $('#zee_list').DataTable({
                pageLength: 150,
                // order: [[0, 'asc']],
                layout: {
                    topStart: {
                        buttons: [{
                            extend: 'copy', text: 'Copy',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'csv', text: 'CSV',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'excel', text: 'Excel',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'pdf', text: 'PDF',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'print', text: 'Print',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }],
                    }
                },
                columnDefs: [{
                    targets: [1, 2, 6, 7],
                    className: 'bolded'
                },
                ], rowCallback: function (row, data, index) {

                    if (isNullorEmpty(data[7]) && isNullorEmpty(data[6])) {
                        $('td', row).css('background-color', '#f0f0f0');
                    } else if (data[6] == 'YES' && isNullorEmpty(data[7])) {
                        $('td', row).css('background-color', '#8ACDD7');
                    } else if (data[6] == 'YES' && !isNullorEmpty(data[7])) {
                        $('td', row).css('background-color', '#6096B4');
                        $('td', row).css('color', 'white');
                    } else if (isNullorEmpty(data[6]) && !isNullorEmpty(data[7])) {
                        $('td', row).css('background-color', '#C1EFFF');
                    }

                }, footerCallback: function (row, data, start, end, display) {

                }
            });
            afterLoad();

            /**
             * Close the Alert box on click
             */
            $(document).on('click', '#alert .close', function (e) {
                $(this).parent().hide();
            });

            $("#applyFilter").click(function () {
                var parentLPO = $('#parentLPO option:selected').val();

                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1793&deploy=1&compid=1048144&h=c1e27a923d5465a1a31c&lpo=" + parentLPO;

                window.location.href = url;
            });

            $('#saveEOI').click(function () {
                var input_error = false;
                var error_color = '#f4524d';
                var zeeInternalId = $("#zeeInternalId").val();
                var lpo_notes = $('#lpo_notes').val();
                var eoi_lpo = $('.lpo_eoi').val();
                var lpo_profiles = $('#lpo_profile').val();
                var newLPOCreate = $('#newLPOCreate').val()

                $('#saveEOI').removeClass('btn-primary');
                $('#saveEOI').addClass('btn-success');
                $('#saveEOI').attr('disabled', true);
                $('#saveEOI').attr('value', "SAVING...");

                console.log(' lpo_notes:' + lpo_notes)
                console.log(' eoi_lpo:' + eoi_lpo)
                console.log(' lpo_profiles:' + lpo_profiles)
                console.log(' newLPOCreate:' + newLPOCreate)

                if (isNullorEmpty(eoi_lpo)) {
                    console.log('inside null eoi_lpo')
                    input_error = true;
                    $('.lpo_eoi').addClass('input-field-error');
                    setTimeout(function () {
                        $('.lpo_eoi').removeClass('input-field-error');
                    }, 10000);
                }

                if (newLPOCreate == 'YES') {

                    var lpo_name = $('#lpo_name').val();
                    var lpo_contact_name = $('#lpo_contact_name').val();
                    var lpo_contact_email = $('#lpo_contact_email').val();
                    var lpo_contact_number = $('#lpo_contact_number').val();

                    var lpo_lead_address1 = $('#lpo_lead_address1').val();
                    var lpo_lead_address2 = $('#lpo_lead_address2').val();
                    var lpo_lead_city = $('#lpo_lead_city').val();
                    var lpo_lead_state = $('#lpo_lead_state').val();
                    var lpo_lead_postcode = $('#lpo_lead_postcode').val();

                    if (lpo_name == " " || lpo_name == "" || isNullorEmpty(lpo_name)) {
                        $('#saveEOI').addClass('btn-primary');
                        $('#saveEOI').removeClass('btn-success');
                        $('#saveEOI').attr('disabled', false);
                        $('#saveEOI').attr('value', "SAVE");
                        input_error = true;
                        jQuery('#lpo_name').addClass('input-field-error');
                        setTimeout(function () {
                            jQuery('#lpo_name').removeClass('input-field-error');
                        }, 10000);
                    }
                    if (lpo_contact_name == " " || lpo_contact_name == "" || isNullorEmpty(lpo_contact_name)) {
                        $('#saveEOI').addClass('btn-primary');
                        $('#saveEOI').removeClass('btn-success');
                        $('#saveEOI').attr('disabled', false);
                        $('#saveEOI').attr('value', "SAVE");
                        input_error = true;
                        jQuery('#lpo_contact_name').addClass('input-field-error');
                        setTimeout(function () {
                            jQuery('#lpo_contact_name').removeClass('input-field-error');
                        }, 10000);
                    }
                    if (lpo_contact_email == " " || lpo_contact_email == "" || IsEmail(lpo_contact_email)) {
                        $('#saveEOI').addClass('btn-primary');
                        $('#saveEOI').removeClass('btn-success');
                        $('#saveEOI').attr('disabled', false);
                        $('#saveEOI').attr('value', "SAVE");
                        input_error = true;
                        jQuery('#lpo_contact_email').addClass('input-field-error');
                        setTimeout(function () {
                            jQuery('#lpo_contact_email').removeClass('input-field-error');
                        }, 10000);
                    }
                    if (lpo_contact_number == " " || lpo_contact_number == "" || isNullorEmpty(lpo_contact_number)) {
                        $('#saveEOI').addClass('btn-primary');
                        $('#saveEOI').removeClass('btn-success');
                        $('#saveEOI').attr('disabled', false);
                        $('#saveEOI').attr('value', "SAVE");
                        input_error = true;
                        jQuery('#lpo_contact_number').addClass('input-field-error');
                        setTimeout(function () {
                            jQuery('#lpo_contact_number').removeClass('input-field-error');
                        }, 10000);
                    }
                    if (isNullorEmpty(lpo_lead_address2)) {
                        $('#saveEOI').addClass('btn-primary');
                        $('#saveEOI').removeClass('btn-success');
                        $('#saveEOI').attr('disabled', false);
                        $('#saveEOI').attr('value', "SAVE");
                        input_error = true;
                        jQuery('#lpo_lead_address2').addClass('input-field-error');
                        setTimeout(function () {
                            jQuery('#lpo_lead_address2').removeClass('input-field-error');
                        }, 10000);
                    }

                    if (isNullorEmpty(lpo_lead_postcode)) {
                        $('#saveEOI').addClass('btn-primary');
                        $('#saveEOI').removeClass('btn-success');
                        $('#saveEOI').attr('disabled', false);
                        $('#saveEOI').attr('value', "SAVE");
                        input_error = true;
                        jQuery('#lpo_lead_postcode').addClass('input-field-error');
                        setTimeout(function () {
                            jQuery('#lpo_lead_postcode').removeClass('input-field-error');
                        }, 10000);
                    }


                } else {

                    if (isNullorEmpty(lpo_profiles)) {
                        $('#saveEOI').addClass('btn-primary');
                        $('#saveEOI').removeClass('btn-success');
                        $('#saveEOI').attr('disabled', false);
                        $('#saveEOI').attr('value', "SAVE");
                        input_error = true;
                        $('#lpo_profile').addClass('input-field-error');
                        setTimeout(function () {
                            $('#lpo_profile').removeClass('input-field-error');
                        }, 10000);
                    }

                }

                var newLPOLeadProfileID = null;
                if (input_error == true) {
                    return true;
                } else {

                    if (newLPOCreate == 'YES') {

                        var state_id;

                        switch (lpo_lead_state) {
                            case 'NSW':
                                state_id = 1;
                                break;
                            case 'QLD':
                                state_id = 2;
                                break;
                            case 'VIC':
                                state_id = 3;
                                break;
                            case 'SA':
                                state_id = 4;
                                break;
                            case 'TAS':
                                state_id = 5;
                                break;
                            case 'ACT':
                                state_id = 6;
                                break;
                            case 'WA':
                                state_id = 7;
                                break;
                            case 'NT':
                                state_id = 8;
                                break;
                            case 'NZ':
                                state_id = 9;
                                break;
                        }


                        var lpoLeadprofileRecord = record.create({
                            type: 'customrecord_lpo_lead_form',
                        });
                        lpoLeadprofileRecord.setValue({
                            fieldId: 'custrecord_lpo_lead_status',
                            value: 1
                        })
                        lpoLeadprofileRecord.setValue({
                            fieldId: 'custrecord_lpo_lead_name',
                            value: lpo_name
                        })
                        lpoLeadprofileRecord.setValue({
                            fieldId: 'custrecord_lpo_lead_contact_name',
                            value: lpo_contact_name
                        })
                        lpoLeadprofileRecord.setValue({
                            fieldId: 'custrecord_lpo_lead_contact_email',
                            value: lpo_contact_email
                        })
                        lpoLeadprofileRecord.setValue({
                            fieldId: 'custrecord_lpo_lead_contact_number',
                            value: lpo_contact_number
                        })
                        lpoLeadprofileRecord.setValue({
                            fieldId: 'custrecord_lpo_lead_st_num_name',
                            value: lpo_lead_address1
                        })
                        lpoLeadprofileRecord.setValue({
                            fieldId: 'custrecord_lpo_lead_address_level',
                            value: lpo_lead_address2
                        })
                        lpoLeadprofileRecord.setValue({
                            fieldId: 'custrecord_lpo_lead_address_suburb',
                            value: lpo_lead_city
                        })
                        lpoLeadprofileRecord.setValue({
                            fieldId: 'custrecord_lpo_lead_address_state',
                            value: state_id
                        })
                        lpoLeadprofileRecord.setValue({
                            fieldId: 'custrecord_lpo_lead_address_postcode',
                            value: lpo_lead_postcode
                        })
                        lpoLeadprofileRecord.setValue({
                            fieldId: 'custrecord_webpage_url_source',
                            value: 'Franchisee Nominated'
                        })

                        newLPOLeadProfileID = lpoLeadprofileRecord.save();

                        console.log('after creating new LPO Profile Lead')
                    }


                    var zee_record = record.load({
                        type: record.Type.PARTNER,
                        id: zeeInternalId,
                    });

                    var buttonClickedJSON = zee_record.getValue({ fieldId: 'custentity_zee_mass_email' });

                    if (eoi_lpo == 1) {
                        var parsedButtonClickedJSON = null;
                        if (!isNullorEmpty(buttonClickedJSON)) {
                            parsedButtonClickedJSON = JSON.parse(buttonClickedJSON)
                        } else {
                            var data_set = [];
                            data_set.push({
                                leadcampaigncount: 0,
                                lpocount: 0,
                                premiumcount: 0,
                                buycustomerscount: 0,
                                callwithchriscount: 0,
                            });

                            parsedButtonClickedJSON = data_set
                        }

                        var lpocount = parseInt(parsedButtonClickedJSON[0].lpocount);
                        lpocount++;
                        parsedButtonClickedJSON[0].lpocount = lpocount;

                        zee_record.setValue({
                            fieldId: 'custentity_zee_mass_email',
                            value: JSON.stringify(parsedButtonClickedJSON)
                        })
                    }

                    zee_record.setValue({
                        fieldId: 'custentity_eoi_lpo_notes',
                        value: lpo_notes
                    })
                    if (!isNullorEmpty(lpo_profiles)) {
                        if (!isNullorEmpty(newLPOLeadProfileID)) {
                            var lpo_profile_array = lpo_profiles.split(',');
                            lpo_profile_array.push(newLPOLeadProfileID);
                            lpo_profiles = lpo_profile_array;
                        }
                    } else {
                        lpo_profiles = newLPOLeadProfileID
                    }

                    zee_record.setValue({
                        fieldId: 'custentity_lpo_nominated',
                        value: lpo_profiles
                    })

                    zee_record.save();

                    var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1841&deploy=1";

                    window.location.href = url;
                }

            });


            //On click of close icon in the modal
            $('.closeModal').click(function () {
                $("#zee_lpo_eoi").hide();
                $('.create_lpo_lead_section').addClass('hide');
                $('.lpo_profile').attr('disabled', false);
            });
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

        function isNullorEmpty(strVal) {
            return (strVal == null || strVal == '' || strVal == 'null' || strVal == undefined || strVal == 'undefined' || strVal == '- None -' || strVal == '0' || strVal == 0);
        }

        //Email validations
        function IsEmail(email) {
            var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            // console.log(regex.test(email));
            if (regex.test(email)) {
                return false;
            } else {
                return true;
            }
        }
        //Phone validation
        function validatePhone(val) {
            var digits = val.replace(/[^0-9]/g, '');
            var australiaPhoneFormat = /^(\+\d{2}[ \-]{0,1}){0,1}(((\({0,1}[ \-]{0,1})0{0,1}\){0,1}[2|3|7|8]{1}\){0,1}[ \-]*(\d{4}[ \-]{0,1}\d{4}))|(1[ \-]{0,1}(300|800|900|902)[ \-]{0,1}((\d{6})|(\d{3}[ \-]{0,1}\d{3})))|(13[ \-]{0,1}([\d \-]{5})|((\({0,1}[ \-]{0,1})0{0,1}\){0,1}4{1}[\d \-]{8,10})))$/;
            var phoneFirst6 = digits.substring(0, 6);
            var phone_error = true;
            //Check if all phone characters are numerals
            if (val != digits) {
                phone_error = false;
            } else if (digits.length != 10) {
                console.log('10 Numbers only');
                //Check if phone is not blank, need to contains 10 digits
                phone_error = false;
            } else if (!(australiaPhoneFormat.test(digits))) {
                console.log('Australian Format Numbers only');
                //Check if valid Australian phone numbers have been entered
                phone_error = false;
            } else if (digits.length == 10) {
                //Check if all 10 digits are the same numbers using checkDuplicate function
                if (checkDuplicate(digits)) {
                    phone_error = false;
                }
            }
            console.log(phone_error);
            return phone_error;
        }

        return {
            pageInit: pageInit,
            saveRecord: saveRecord
        }
    });
