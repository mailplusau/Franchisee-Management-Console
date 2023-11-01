/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * Author:               Ankith Ravindran
 * Created on:           Thu Oct 26 2023
 * Modified on:          Thu Oct 26 2023 10:19:13
 * SuiteScript Version:   
 * Description:           
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
 */


define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect', 'N/format'
],
    function (ui, email, runtime, search, record, http, log, redirect, format) {
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


        var franchiseeStdSuburbs = "";
        var franchiseeExpressSuburbs = "";
        var franchiseePartnershipSuburbs = "";

        var mpexLodgementPointsString = null;
        var mpstdLodgementPointsString = null;
        var sendleexpLodgementPointsString = null;

        var masterclass = null;
        var customerReviews = null;

        var color_array = ['blue', 'red', 'green', 'orange', 'black'];

        function onRequest(context) {
            var baseURL = 'https://system.na2.netsuite.com';
            if (runtime.EnvType == "SANDBOX") {
                baseURL = 'https://system.sandbox.netsuite.com';
            }
            zee = runtime.getCurrentUser().id;
            role = runtime.getCurrentUser().role;

            if (context.request.method === 'GET') {

                var form = ui.createForm({
                    title: 'Franchisee Leave Register'
                });

                if (role != 1000) {
                    if (isNullorEmpty(context.request.parameters.zee)) {
                        zee = 794958;
                    }
                } else {

                }

                //INITIALIZATION OF JQUERY AND BOOTSTRAP
                var inlineHtml =
                    '<meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><script src="//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.3.1/leaflet-omnivore.min.js"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&callback=initMap&libraries=places"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js"></script></script><link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" /><script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script><link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css"><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&amp;c=1048144&amp;h=9ee6accfd476c9cae718&amp;_xt=.css"><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&amp;c=1048144&amp;h=ef2cda20731d146b5e98&amp;_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.7/angular-resource.min.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><style>.mandatory{color:red;}.clearfix:after {clear: both;content: "";display: block;height: 0;}.wrapper {vertical-align: middle;}.nav {margin-top: 40px;}.pull-right {float: right;}a, a:active {color: #212121;text-decoration: none;}a:hover {color: #999;}.arrow-steps .step {font-size: 14px;text-align: center;color: #fff;cursor: default;margin: 0 3px;padding: 10px 10px 10px 30px;float: left;position: relative;background-color: #095c7b;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none; transition: background-color 0.2s ease;}.arrow-steps .step:after,.arrow-steps .step:before {content: " ";position: absolute;top: 0;right: -17px;width: 0;height: 40px;border-top: 19px solid transparent;border-bottom: 17px solid transparent;border-left: 17px solid #095c7b;	z-index: 2;transition: border-color 0.2s ease;}.arrow-steps .step:before {right: auto;left: 0;border-left: 17px solid #fff;	z-index: 0;}.arrow-steps .step:first-child:before {border: none;}.arrow-steps .step:first-child {border-top-left-radius: 4px;border-bottom-left-radius: 4px;}.arrow-steps .step span {position: relative;}.arrow-steps .step span:before {opacity: 0;content: "✔";position: absolute;top: -2px;left: -20px;color: #095c7b;}.arrow-steps .step.done span:before {opacity: 1;-webkit-transition: opacity 0.3s ease 0.5s;-moz-transition: opacity 0.3s ease 0.5s;-ms-transition: opacity 0.3s ease 0.5s;transition: opacity 0.3s ease 0.5s;}.arrow-steps .step.current {color: #103d39;font-weight: bold;background-color: #fbea51;}.arrow-steps .step.current:after {border-left: 17px solid #fbea51;	}.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095c7b; color: #fff }.nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095c7b; color: #095c7b; }</style>';

                inlineHtml += '<div class="container instruction_div hide" style="background-color: lightblue;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p><b><u>Instructions</u></b></br><ol><li><b>Deadline for Leave Entry</b>: Please enter your leave details before Friday, December 1. </li><li><b>Choosing the Operator</b>: Simply add which operator will be on leave (you can add multiple). Then, simply fill in the relevant drop-down fields that appear.</li><li><b>Relief Driver Details</b>: It\'s crucial to provide comprehensive details about your relief driver to ensure a smooth transition.</li><li><b>App Access</b>:We need to know if your driver need app access. If they do, our IT team will in touch. </li><li><b>Notes</b>: The more information you provide, the better. Use the notes section to communicate any additional details or specific instructions.</li><li><b>Click "Save"</b>: Once you click "save," the record will be stored and the relevant team will be instantly notified.</li></ol></br></div></br>';

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
                    id: 'custpage_operatorleavestartdate',
                    type: ui.FieldType.TEXT,
                    label: 'Day'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                });
                form.addField({
                    id: 'custpage_operatorleaveenddate',
                    type: ui.FieldType.TEXT,
                    label: 'Day'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                });
                form.addField({
                    id: 'custpage_operatorreliefdriverrequired',
                    type: ui.FieldType.TEXT,
                    label: 'Day'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                });
                form.addField({
                    id: 'custpage_operatorreliefdrivername',
                    type: ui.FieldType.TEXT,
                    label: 'Day'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                });
                form.addField({
                    id: 'custpage_operatorreliefdrivermobile',
                    type: ui.FieldType.TEXT,
                    label: 'Day'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                });
                form.addField({
                    id: 'custpage_operatorreliefdriveremail',
                    type: ui.FieldType.TEXT,
                    label: 'Day'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                });
                form.addField({
                    id: 'custpage_operatorleavenotes',
                    type: ui.FieldType.TEXT,
                    label: 'Day'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                });
                form.addField({
                    id: 'custpage_customernotified',
                    type: ui.FieldType.TEXT,
                    label: 'Day'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                });

                form.addField({
                    id: 'custpage_app_access_required',
                    type: ui.FieldType.TEXT,
                    label: 'Day'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                });

                form.addField({
                    id: 'custpage_sharing_app',
                    type: ui.FieldType.TEXT,
                    label: 'Day'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                });



                inlineHtml +=
                    '<div class="se-pre-con"></div><div ng-app="myApp" ng-controller="myCtrl">';

                inlineHtml += spacing()

                if (zee != 0 && !isNullorEmpty(zee)) {

                    var zeeRecord = record.load({
                        type: record.Type.PARTNER,
                        id: zee
                    });

                    var zeeProjects = zeeRecord.getValue({
                        fieldId: 'custentity_mp_projects'
                    });

                    var zeeProjectsArray = zeeProjects.toString();

                    form.addField({
                        id: 'custpage_zee_projects',
                        type: ui.FieldType.TEXT,
                        label: 'Day'
                    }).updateDisplayType({
                        displayType: ui.FieldDisplayType.HIDDEN
                    }).defaultValue = zeeProjectsArray;

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

                    inlineHtml +=
                        '<div class="form-group container row_partnership hide">';
                    inlineHtml += '<div class="row">';

                    inlineHtml +=
                        '<div class="col-xs-12"><div class="input-group"><span class="input-group-addon">PARTNERSHIP PROGRAM ACTIVE?<span class="mandatory">*</span></span><select id="partnership" class="form-control partnership" readonly>';
                    if ((zeeProjects.indexOf("2") > -1) || (zeeProjects.indexOf("9") > -1)) {
                        inlineHtml +=
                            '<option value=1 selected>Yes</option><option value=2>No</option>';
                    } else {
                        inlineHtml +=
                            '<option value=1>Yes</option><option value=2 selected>No</option>';
                    }
                    inlineHtml += '</select></div></div>';

                    inlineHtml += '</div>';
                    inlineHtml += '</div>';


                    inlineHtml += tabSection(zee, role, resultSetOperators, zeeProjects)
                    // inlineHtml += spacing()
                    // inlineHtml += line()
                    // inlineHtml += mainButtons(role)
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

                form.clientScriptFileId = 6663123
                context.response.writePage(form);

            } else {
                var zeeId = parseInt(context.request.parameters.custpage_zee);

                var operatorids = context.request.parameters.custpage_operatorids;
                var operatorids_delete = context.request.parameters.custpage_operatorids_delete;
                var operatorname = context.request.parameters.custpage_operatorname;
                var operatoremail = context.request.parameters.custpage_operatoremail;
                var operatormobile = context.request.parameters.custpage_operatormobile;
                var operatorleavestartdate = context.request.parameters.custpage_operatorleavestartdate;
                var operatorleaveenddate = context.request.parameters.custpage_operatorleaveenddate;
                var reliefdriverrequired = context.request.parameters.custpage_operatorreliefdriverrequired;
                var reliefdrivername = context.request.parameters.custpage_operatorreliefdrivername;
                var reliefdrivermobile = context.request.parameters.custpage_operatorreliefdrivermobile;
                var reliefdriveremail = context.request.parameters.custpage_operatorreliefdriveremail;
                var leavenotes = context.request.parameters.custpage_operatorleavenotes;
                var customernotified = context.request.parameters.custpage_customernotified;
                var appAccessRequired = context.request.parameters.custpage_app_access_required;
                var sharingApp = context.request.parameters.custpage_sharing_app;
                var zeeProjects = context.request.parameters.custpage_zee_projects;

                zeeProjectsArray = zeeProjects.split(',');

                log.debug({
                    title: 'operatorleavestartdate',
                    details: operatorleavestartdate
                });
                log.debug({
                    title: 'operatorleaveenddate',
                    details: operatorleaveenddate
                });

                // var operatoridsArrys = operatorids.split(',')
                // var operatoridsdeleteArrys = operatorids_delete.split(',')
                // var operatornameArrys = operatorname.split(',')
                // var operatoremailArrys = operatoremail.split(',')
                // var operatormobileArrys = operatormobile.split(',')
                // var operatorleavestartdateArrays = operatorleavestartdate.split(',')
                // var operatorleaveenddateArrays = operatorleaveenddate.split(',')
                // var reliefdriverrequiredArrays = reliefdriverrequired.split(',')
                // var reliefdrivernameArrays = reliefdrivername.split(',')
                // var reliefdrivermobileArrays = reliefdrivermobile.split(',')
                // var reliefdriveremailArrays = reliefdriveremail.split(',')
                // var leavenotesArrays = leavenotes.split(',')
                // var customernotifiedArrays = customernotified.split(',')

                var operatorleavestartdateArray = operatorleavestartdate.split('-')
                var operatorleavestartdateString = operatorleavestartdateArray[2] + '/' + operatorleavestartdateArray[1] + '/' + operatorleavestartdateArray[0]
                var emailLeaveStartDate = operatorleavestartdateString

                var operatorleavestartdateString = operatorleavestartdateArray[1] + '/' + operatorleavestartdateArray[2] + '/' + operatorleavestartdateArray[0]
                operatorleavestartdate = getDate(operatorleavestartdateString);
                var operatorLeave1DayAgoStartDate = get1DayAgoDate(operatorleavestartdateString);

                var operatorleaveenddateArray = operatorleaveenddate.split('-')
                var operatorleaveenddateString = operatorleaveenddateArray[2] + '/' + operatorleaveenddateArray[1] + '/' + operatorleaveenddateArray[0]
                var emailLeaveEndDate = operatorleaveenddateString
                var operatorleaveenddateString = operatorleaveenddateArray[1] + '/' + operatorleaveenddateArray[2] + '/' + operatorleaveenddateArray[0]
                operatorleaveenddate = getDate(operatorleaveenddateString)
                var operatorLeave1DayAgoEndDate = get1DayAgoDate(operatorleaveenddateString);

                log.debug({
                    title: 'operatorids',
                    details: operatorids
                });
                log.debug({
                    title: 'operatorname',
                    details: operatorname
                });
                log.debug({
                    title: 'operatorleavestartdate',
                    details: operatorleavestartdate
                });
                log.debug({
                    title: 'operatorleaveenddate',
                    details: operatorleaveenddate
                });
                log.debug({
                    title: 'reliefdriverrequired',
                    details: reliefdriverrequired
                });
                log.debug({
                    title: 'reliefdrivername',
                    details: reliefdrivername
                });
                log.debug({
                    title: 'reliefdrivermobile',
                    details: reliefdrivermobile
                });
                log.debug({
                    title: 'reliefdriveremail',
                    details: reliefdriveremail
                });
                log.debug({
                    title: 'leavenotes',
                    details: leavenotes
                });
                log.debug({
                    title: 'customernotified',
                    details: customernotified
                });
                log.debug({
                    title: 'appAccessRequired',
                    details: appAccessRequired
                });
                log.debug({
                    title: 'sharingApp',
                    details: sharingApp
                });

                log.debug({
                    title: 'operatorLeave1DayAgoStartDate',
                    details: operatorLeave1DayAgoStartDate
                });

                log.debug({
                    title: 'operatorLeave1DayAgoEndDate',
                    details: operatorLeave1DayAgoEndDate
                });

                var operatorCount = 0;
                var emailOperatorDetails = '';

                if (!isNullorEmpty(reliefdriveremail)) {
                    //NetSuite Search: APP - Operator Load
                    var searchOperators = search.load({
                        id: 'customsearch_app_operator_load',
                        type: 'customrecord_operator'
                    });

                    searchOperators.filters.push(search.createFilter({
                        name: 'custrecord_operator_email',
                        join: null,
                        operator: search.Operator.IS,
                        values: reliefdriveremail
                    }));

                    var resultSetOperators = searchOperators.run();

                    emailOperatorDetails += '\n\nBelow are the operators matched to email: ' + reliefdriveremail + '\n';
                    resultSetOperators.each(function (searchResultOperators) {

                        operatorID = searchResultOperators.getValue('internalid');
                        operatorName = searchResultOperators.getValue('name');
                        operatorPhone = searchResultOperators.getValue(
                            'custrecord_operator_phone');
                        operatorEmail = searchResultOperators.getValue(
                            'custrecord_operator_email');
                        linkedZee = searchResultOperators.getValue(
                            'custrecord_operator_franchisee');

                        emailOperatorDetails += '\n Operator NS ID: ' + operatorID;
                        emailOperatorDetails += '\n Operator Name: ' + operatorName;
                        emailOperatorDetails += '\n Operator Mobile: ' + operatorPhone;
                        emailOperatorDetails += '\n Operator Email: ' + operatorEmail;

                        operatorCount++;
                        return true;
                    });
                }

                var operatorRecord = record.load({
                    type: 'customrecord_operator',
                    id: operatorids
                });

                var zeeName = operatorRecord.getText({
                    fieldId: 'custrecord_operator_franchisee'
                })

                operatorRecord.setValue({
                    fieldId: 'custrecord_customer_notified',
                    value: customernotified
                })
                operatorRecord.setValue({
                    fieldId: 'custrecord_relief_driver_required',
                    value: reliefdriverrequired
                })
                operatorRecord.setValue({
                    fieldId: 'custrecord_leave_start_date',
                    value: operatorleavestartdate
                })
                operatorRecord.setValue({
                    fieldId: 'custrecord_leave_end_date',
                    value: operatorleaveenddate
                })
                operatorRecord.setValue({
                    fieldId: 'custrecord_leave_notes',
                    value: leavenotes
                })

                operatorRecord.setValue({
                    fieldId: 'custrecord_relief_driver_name',
                    value: reliefdrivername
                })
                operatorRecord.setValue({
                    fieldId: 'custrecord_relief_driver_mobile',
                    value: reliefdrivermobile
                })
                operatorRecord.setValue({
                    fieldId: 'custrecord_relief_driver_email',
                    value: reliefdriveremail
                })

                if (!isNullorEmpty(appAccessRequired)) {
                    operatorRecord.setValue({
                        fieldId: 'custrecord_relief_driver_app_access',
                        value: appAccessRequired
                    })
                }

                if (!isNullorEmpty(sharingApp)) {
                    operatorRecord.setValue({
                        fieldId: 'custrecord_relief_driver_sharing_login',
                        value: sharingApp
                    })
                }

                operatorRecord.save();

                var emailSubject = zeeName + ' Franchisee Leave Regsiter - ' + operatorname;
                var emailBody = 'Please be informed of the upcoming holiday leave details for ' + zeeName + ' - ' + operatorname + '\n';
                emailBody += '\nLeave Start Date: ' + emailLeaveStartDate;
                emailBody += '\nLeave End Date: ' + emailLeaveEndDate + '\n';

                var allStaffEmailBody = emailBody;

                var taskTitleLeaveStartDate = 'Update Suburb Mapping from operator ' + operatorname + ' to Relief Driver ' + reliefdrivername
                var taskTitleLeaveEndDate = 'Update Suburb Mapping from relief driver ' + reliefdrivername + ' to operator ' + operatorname

                if (reliefdriverrequired == '1') {
                    emailBody += '\nRelief Driver Required?: Yes';
                } else {
                    emailBody += '\nRelief Driver Required?: No';
                }
                if (customernotified == '1') {
                    emailBody += '\nCustomer Notified?: Yes';
                } else {
                    emailBody += '\nCustomer Notified?: No';
                }
                if (appAccessRequired == '1') {
                    emailBody += '\nApp Access Required?: Yes';
                } else {
                    emailBody += '\nApp Access Required?: No';
                    if (sharingApp == '1') {
                        emailBody += '\nSharing App?: Yes';
                    } else {
                        emailBody += '\nSharing App?: No';
                    }
                }
                emailBody += '\n\nLeave Notes: ' + leavenotes;

                var emailNewReliefDriverDetails = '\n\nBelow are the details of the relief driver: ';
                emailNewReliefDriverDetails += '\n Operator Name: ' + reliefdrivername;
                emailNewReliefDriverDetails += '\n Operator Mobile: ' + reliefdrivermobile;
                emailNewReliefDriverDetails += '\n Operator Email: ' + reliefdriveremail;
                emailBody += emailNewReliefDriverDetails;

                allStaffEmailBody += emailNewReliefDriverDetails;

                if (operatorCount != 0 && !isNullorEmpty(reliefdriveremail)) {
                    emailBody += emailOperatorDetails
                }

                emailBody += '\n\n You now have this information in your inbox to help you provide customer service when needed and to ensure smooth operations during this period.\n\n';
                emailBody += 'Thank you,\nIT Team  '

                //Email to Popie & Fiona
                email.send({
                    author: 112209,
                    recipients: ['fiona.harrison@mailplus.com.au', 'popie.popie@mailplus.com.au'],
                    subject: emailSubject,
                    body: emailBody,
                    cc: ['ankith.ravindran@mailplus.com.au']
                });

                if (reliefdriverrequired == '1' && ((zeeProjectsArray.indexOf("2") > -1) || (zeeProjectsArray.indexOf("9") > -1))) {
                    // if (reliefdriverrequired == '1') {

                    //Create Task to update suburb mapping from relief driver to main operator
                    var task_record = record.create({
                        type: 'task'
                    });
                    task_record.setValue({
                        fieldId: 'startdate',
                        value: operatorLeave1DayAgoStartDate
                    });
                    task_record.setValue({
                        fieldId: 'duedate',
                        value: operatorLeave1DayAgoStartDate
                    });

                    task_record.setValue({
                        fieldId: 'sendemail',
                        value: true
                    });
                    // task_record.setValue({
                    //     fieldId: 'status',
                    //     value: 3
                    // });
                    task_record.setValue({
                        fieldId: 'title',
                        value: taskTitleLeaveStartDate
                    });
                    task_record.setValue({
                        fieldId: 'custevent_organiser',
                        value: 1552795 //Fiona
                    });
                    task_record.setValue({
                        fieldId: 'assigned',
                        value: 1552795 //Fiona
                    });
                    task_record.setValue({
                        fieldId: 'message',
                        value: emailBody
                    });

                    task_record.save();



                    //Create Task to update suburb mapping from relief driver to main operator
                    var task_record = record.create({
                        type: 'task'
                    });
                    task_record.setValue({
                        fieldId: 'startdate',
                        value: operatorLeave1DayAgoEndDate
                    });
                    task_record.setValue({
                        fieldId: 'duedate',
                        value: operatorLeave1DayAgoEndDate
                    });

                    task_record.setValue({
                        fieldId: 'sendemail',
                        value: true
                    });
                    // task_record.setValue({
                    //     fieldId: 'status',
                    //     value: 3
                    // });
                    task_record.setValue({
                        fieldId: 'title',
                        value: taskTitleLeaveEndDate
                    });
                    task_record.setValue({
                        fieldId: 'custevent_organiser',
                        value: 1552795 //Fiona
                    });
                    task_record.setValue({
                        fieldId: 'assigned',
                        value: 1552795 //Fiona
                    });
                    task_record.setValue({
                        fieldId: 'message',
                        value: emailBody
                    });

                    task_record.save();

                }

                //All Staff Email
                email.send({
                    author: 112209,
                    recipients: ['ankith.ravindran@mailplus.com.au'],
                    // recipients: ['AllStaff@mailplus.com.au'],
                    subject: emailSubject,
                    body: emailBody
                });

                redirect.toSuitelet({
                    scriptId: 'customscript_sl2_zee_leave_register',
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
        * PURPOSE : BUTTONS SECTION AT THE END OF THE PAGE.
        *  PARAMS : USER ROLE
        * RETURNS : INLINEHTML
        *   NOTES :
        */
        function mainButtons(role) {

            var inlineHtml = ''

            inlineHtml +=
                '<div class="form-group container zee_available_buttons_section">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-3 updateDetails"></div>'
            inlineHtml +=
                '<div class="col-xs-6 updateDetails"><input type="button" value="SAVE DETAILS" class="form-control btn btn-primary" id="updateDetails" style="border-radius: 30px;"/></div>'
            inlineHtml +=
                '<div class="col-xs-3 updateDetails"></div>'

            inlineHtml += '</div>';
            inlineHtml += '</div>';


            return inlineHtml
        }


        /*
         * PURPOSE : CREATES THE TAB SECTION FOR THE PAGE
         *  PARAMS : ZEE ID, USER ROLE & OPERATOR SEARCH RESULT
         * RETURNS : INLINEHTML
         *   NOTES :
         */
        function tabSection(zee, role, resultSetOperators, zeeProjects) {
            //TAB HEADERS
            var inlineHtml =
                '<div>'
            // inlineHtml +=
            //     '<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-tabs nav-justified main-tabs-sections " style="margin:0%;border-bottom-color: #fbea50 !important;border-bottom-width: 5px !important;border-bottom-style: solid;">';

            // inlineHtml +=
            //     '<li role="presentation" class="active"><a data-toggle="tab" href="#operatorDetails"><b>OPERATION DETAILS</b></a></li>';

            // inlineHtml += '</ul></div>';

            // //TAB CONTENT
            // inlineHtml += '<div class="tab-content">';


            // inlineHtml +=
            //     '<div role="tabpanel" class="tab-pane active" id="operatorDetails">';
            inlineHtml += franchiseeOperatorDetails(zee, resultSetOperators, zeeProjects)
            inlineHtml += '</div>';


            // inlineHtml += '</div></div>';

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

            resultSetZees.each(function (searchResultZees) {
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

            var inlineHtml =
                '<div class="form-group container">';
            inlineHtml += '<div class="row">';

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
         * PURPOSE : Autogenerates function contract comments
         *  PARAMS : functio -
         * RETURNS :  -
         *   NOTES :
         */
        function franchiseeOperatorDetails(zee, resultSetOperators, zeeProjects) {

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
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">OPERATOR DETAILS</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            //ERROR SECTION
            inlineHtml +=
                '<div class="error_container container" style=""><div id="alert" class="alert alert-danger fade in"></div></div>';

            inlineHtml +=
                '<div class="form-group container row_operator_details hide">'
            inlineHtml += '<div class="row">';
            inlineHtml += '<input id="operatorInternalId" value="" type="hidden"/>'
            inlineHtml +=
                '<div class="col-xs-4 operatorName_section"><div class="input-group"><span class="input-group-addon">Name <span class="mandatory">*</span></span><input id="operatorName" class="form-control operatorName" readonly/></div></div>';
            inlineHtml +=
                '<div class="col-xs-4 operatorEmail_section"><div class="input-group"><span class="input-group-addon">EMAIL <span class="mandatory">*</span></span><input id="operatorEmail" class="form-control operatorEmail" readonly/></div></div>';
            inlineHtml +=
                '<div class="col-xs-4 operatorMobile_section"><div class="input-group"><span class="input-group-addon">MOBILE NO. <span class="mandatory">*</span></span><input id="operatorMobile" class="form-control operatorMobile" readonly/></div></div>';

            inlineHtml += '</div>';
            inlineHtml += '</div>';


            inlineHtml +=
                '<div class="form-group container row_operatorRole hide">'
            inlineHtml += '<div class="row">';

            inlineHtml +=
                '<div class="col-xs-4 leaveStartDate_section"><div class="input-group"><span class="input-group-addon">LEAVE START DATE <span class="mandatory">*</span></span><input type="date" id="leaveStartDate" class="form-control leaveStartDate" /></div></div>';
            inlineHtml +=
                '<div class="col-xs-4 leaveEndDate_section"><div class="input-group"><span class="input-group-addon">LEAVE END DATE <span class="mandatory">*</span></span><input type="date" id="leaveEndDate" class="form-control leaveEndDate" /></div></div>';
            inlineHtml +=
                '<div class="col-xs-4"><div class="input-group"><span class="input-group-addon">CUSTOMER NOTIFIED?<span class="mandatory">*</span></span><select id="customerNotified" class="form-control customerNotified" >';
            inlineHtml +=
                '<option value=0></option><option value=1>Yes</option><option value=2>No</option>';
            inlineHtml += '</select></div></div>';


            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml +=
                '<div class="form-group container row_relief_required hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12"><div class="input-group"><span class="input-group-addon">RELIEF DRIVER REQUIRED?<span class="mandatory">*</span></span><select id="relief_required" class="form-control relief_required" >';
            if ((zeeProjects.indexOf("2") > -1) || (zeeProjects.indexOf("9") > -1)) {
                inlineHtml +=
                    '<option value=0></option><option value=1 selected>Yes</option><option value=2 >No</option>';
            } else {
                inlineHtml +=
                    '<option value=0></option><option value=1>Yes</option><option value=2 >No</option>';
            }

            inlineHtml += '</select></div></div>';

            inlineHtml += '</div>';
            inlineHtml += '</div>';


            inlineHtml +=
                '<div class="form-group container relief_driver_section hide">';
            inlineHtml += '<div class="row">';

            inlineHtml +=
                '<div class="col-xs-4 reliefDriverName_section"><div class="input-group"><span class="input-group-addon">RELIEF DRIVER NAME <span class="mandatory">*</span></span><input id="reliefDriverName" class="form-control reliefDriverName" /></div></div>';
            inlineHtml +=
                '<div class="col-xs-4 reliefDriverMobile_section"><div class="input-group"><span class="input-group-addon">RELIEF DRIVER MOBILE <span class="mandatory">*</span></span><input type="number" id="reliefDriverMobile" class="form-control reliefDriverMobile" /></div></div>';
            inlineHtml +=
                '<div class="col-xs-4 reliefDriverEmail_section"><div class="input-group"><span class="input-group-addon">RELIEF DRIVER EMAIL <span class="mandatory">*</span></span><input type="email" id="reliefDriverEmail" type="email"  class="form-control reliefDriverEmail" /></div></div>';

            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml +=
                '<div class="form-group container row_app_access_required_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12"><div class="input-group"><span class="input-group-addon">APP ACCESS REQUIRED?<span class="mandatory">*</span></span><select id="app_access_required" class="form-control app_access_required" >';
            inlineHtml +=
                '<option value=0></option><option value=1>Yes</option><option value=2 >No</option>';
            inlineHtml += '</select></div></div>';

            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml +=
                '<div class="form-group container relief_sharing_app_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12"><div class="input-group"><span class="input-group-addon">SHARING APP ACCESS?<span class="mandatory">*</span></span><select id="sharing_app" class="form-control sharing_app" >';
            inlineHtml +=
                '<option value=0></option><option value=1>Yes</option><option value=2 >No</option>';
            inlineHtml += '</select></div></div>';

            inlineHtml += '</div>';
            inlineHtml += '</div>';



            inlineHtml +=
                '<div class="form-group container saveoperator_section hide">';
            inlineHtml += '<div class="row">';

            inlineHtml +=
                '<div class="col-xs-12 reliefDriverName_section"><div class="input-group"><span class="input-group-addon">LEAVE NOTES </span><textarea id="leaveNotes" placeholder="Enter Leave Notes" style="width: 100%;height: 100px;"></textarea></div></div>';



            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml +=
                '<div class="form-group container saveoperator_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-2 "></div>';
            inlineHtml +=
                '<div class="col-xs-4 reviewaddress"><input type="button" value="SAVE" class="form-control btn btn-success"  id="saveOperator" style="border-radius: 30px;"/></div>';
            inlineHtml +=
                '<div class="col-xs-4 cancel"><input type="button" value="CANCEL" class="form-control btn btn-secondary"  id="cancel" style="border-radius: 30px;"/></div>';
            inlineHtml += '<div class="col-xs-2 "></div>';

            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += line();

            inlineHtml +=
                '<div class="form-group container" style="width: 100% !important;">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<style>table#operatorTable {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#operatorTable th{text-align: center;} .bolded{font-weight: bold;}</style>';
            inlineHtml +=
                '<table id="operatorTable" class="table table-responsive table-striped operatorTable tablesorter" style="width: 100%;border: 1px solid #103d39;">';
            inlineHtml +=
                '<thead style="color: white;background-color: #095c7b;font-weight: bold;">';
            inlineHtml += '<tr class="text-center">';
            inlineHtml += '<td>LINK</td>'
            inlineHtml += '<td class="col-xs-2">NAME</td>'
            inlineHtml += '<td>LEAVE START DATE</td>'
            inlineHtml += '<td>LEAVE END DATE</td>'
            inlineHtml += '<td>CUSTOMER NOTIFIED?</td>'
            inlineHtml += '<td>RELIEF DRIVER REQUIRED?</td>'
            inlineHtml += '<td>RELIEF DRIVER NAME</td>'
            inlineHtml += '<td>RELIEF DRIVER MOBILE</td>'
            inlineHtml += '<td>RELIEF DRIVER EMAIL</td>'
            inlineHtml += '<td>LEAVE NOTES</td>'
            inlineHtml += '</tr>';
            inlineHtml += '</thead>';

            inlineHtml +=
                '<tbody id="resultOperatorTable" class="">';

            resultSetOperators.each(function (searchResultOperators) {

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

                operatorMobileDev = searchResultOperators.getText(
                    'custrecord_operator_mobdev_platform');

                operatorDDS = searchResultOperators.getText(
                    'custrecord_dds_operator');

                operatorPrimaryOperator = searchResultOperators.getText(
                    'custrecord_primary_operator');
                var operatorPrimaryOperatorID = searchResultOperators.getValue(
                    'custrecord_primary_operator');

                var customerNotified = searchResultOperators.getText(
                    'custrecord_customer_notified');
                var customerNotifiedID = searchResultOperators.getValue(
                    'custrecord_customer_notified');


                var operatorReliefDriverRequired = searchResultOperators.getText(
                    'custrecord_relief_driver_required');
                var operatorReliefDriverRequiredID = searchResultOperators.getValue(
                    'custrecord_relief_driver_required');

                var operatorLeaveStartDate = searchResultOperators.getValue(
                    'custrecord_leave_start_date');
                var operatorLeaveStartEndDate = searchResultOperators.getValue(
                    'custrecord_leave_end_date');
                var operatorLeaveNotes = searchResultOperators.getValue(
                    'custrecord_leave_notes');

                var operatorReliefDriverName = searchResultOperators.getValue(
                    'custrecord_relief_driver_name');
                var operatorReliefDriverMobile = searchResultOperators.getValue(
                    'custrecord_relief_driver_mobile');
                var operatorReliefDriverEmail = searchResultOperators.getValue(
                    'custrecord_relief_driver_email');


                inlineHtml += '<tr>'
                if (isNullorEmpty(operatorLeaveStartDate)) {
                    inlineHtml +=
                        '<td><a data-id="' +
                        operatorID +
                        '" class="btn btn-md btn-primary editOperatorTable" data-changed="notchanged" style="border-radius: 30px;">ADD</a></td>'
                } else {
                    inlineHtml +=
                        '<td><a data-id="' +
                        operatorID +
                        '" class="btn btn-md btn-warning editOperatorTable" data-changed="notchanged" style="border-radius: 30px;">EDIT</a></br><a data-id="' +
                        operatorID +
                        '" class="btn btn-md btn-danger deleteOperatorTable" data-changed="notchanged" style="border-radius: 30px;">DELETE</a></td>'
                }

                inlineHtml += '<td><input value="' + operatorName +
                    '" readonly class="form-control operatorNameTable" /></td>'

                if (isNullorEmpty(operatorLeaveStartDate)) {
                    inlineHtml += '<td><input value="" readonly class="form-control operatorLeaveStartDateTable" /></td>'
                } else {
                    inlineHtml += '<td><input value="' + operatorLeaveStartDate +
                        '" readonly class="form-control operatorLeaveStartDateTable"/></td>'
                }

                if (isNullorEmpty(operatorLeaveStartEndDate)) {
                    inlineHtml += '<td><input value="" readonly class="form-control operatorLeaveEndDateTable" /></td>'
                } else {
                    inlineHtml += '<td><input value="' + operatorLeaveStartEndDate +
                        '" readonly class="form-control operatorLeaveEndDateTable" /></td>'
                }

                if (isNullorEmpty(customerNotified)) {
                    inlineHtml += '<td><input value="" readonly class="form-control customerNotifiedTable" /><input id="" class="customerNotifiedID" value="0" type="hidden"/></td>'
                } else {
                    inlineHtml += '<td><input value="' + customerNotified +
                        '" readonly class="form-control customerNotifiedTable" /><input id="" class="customerNotifiedID" value="' +
                        customerNotifiedID + '" type="hidden"/></td>'
                }

                if (isNullorEmpty(operatorReliefDriverRequired)) {
                    inlineHtml += '<td><input value="" readonly class="form-control operatorReliefDriverRequiredTable" /><input id="" class="operatorReliefDriverRequiredID" value="0" type="hidden"/></td>'
                } else {
                    inlineHtml += '<td><input value="' + operatorReliefDriverRequired +
                        '" readonly class="form-control operatorReliefDriverRequiredTable" /><input id="" class="operatorReliefDriverRequiredID" value="' +
                        operatorReliefDriverRequiredID + '" type="hidden"/></td>'
                }

                if (isNullorEmpty(operatorReliefDriverName)) {
                    inlineHtml += '<td><input value="" readonly class="form-control operatorReliefDriverNameTable" /></td>'
                } else {
                    inlineHtml += '<td><input value="' + operatorReliefDriverName +
                        '" readonly class="form-control operatorReliefDriverNameTable" /></td>'
                }

                if (isNullorEmpty(operatorReliefDriverMobile)) {
                    inlineHtml += '<td><input value="" readonly class="form-control operatorReliefDriverMobileTable" /></td>'
                } else {
                    inlineHtml += '<td><input value="' + operatorReliefDriverMobile +
                        '" readonly class="form-control operatorReliefDriverMobileTable" /></td>'
                }


                if (isNullorEmpty(operatorReliefDriverEmail)) {
                    inlineHtml += '<td><input value="" readonly class="form-control operatorReliefDriverEmailTable" /></td>'
                } else {
                    inlineHtml += '<td><input value="' + operatorReliefDriverEmail +
                        '" readonly class="form-control operatorReliefDriverEmailTable" /></td>'
                }

                if (isNullorEmpty(operatorLeaveNotes)) {
                    inlineHtml += '<td><textarea readonly class="form-control operatorLeaveNotesTable" ></textarea></td>'
                } else {
                    inlineHtml += '<td><textarea readonly class="form-control operatorLeaveNotesTable" >' + operatorLeaveNotes +
                        '</textarea></td>'
                }




                inlineHtml += '</tr>';


                return true;
            });

            inlineHtml += '</tbody></table>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            // inlineHtml += franchiseeAddOperator()

            return inlineHtml;
        }


        function addressContactsSection(resultSetAddresses) {

            var inlineQty =
                '<div class="form-group container contacts_section" style="font-size: xx-small;">';
            inlineQty += '<div class="row">';
            inlineQty += '<div class="col-xs-12 address_div">';
            inlineQty +=
                '<table border="0" cellpadding="15" id="address" class="table table-responsive table-striped address tablesorter" cellspacing="0" style="width: 100%;border: 1px solid #103d39;font-size: 12px;text-align: center;"><thead style="color: white;background-color: #095c7b;"><tr><th style="vertical-align: middle;text-align: center;">LINK</th><th style="vertical-align: middle;text-align: center;">ID</th><th style="vertical-align: middle;text-align: center;"><b>SUIT/LEVEL/UNIT </b></th><th style="vertical-align: middle;text-align: center;"><b>STREET NO. & NAME </b></th><th style="vertical-align: middle;text-align: center;"><b>SUBURB </b></th><th style="vertical-align: middle;text-align: center;"><b>STATE </b></th><th style="vertical-align: middle;text-align: center;"><b>POSTCODE </b></th></tr></thead><tbody>';

            if (!isNullorEmpty(resultSetAddresses)) {
                //console.log("addresses work");

                resultSetAddresses.each(function (searchResultAddresses) {
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

        function get1DayAgoDate(inputDate) {
            var date = new Date(inputDate);
            log.debug('get1DayAgoDate > inputed date: ' + date);
            date.setDate(date.getDate() - 1);
            log.debug('get1DayAgoDate > updated date: ' + date);
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
