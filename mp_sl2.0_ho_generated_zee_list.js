/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * Author:               Ankith Ravindran
 * Created on:           Tue Feb 13 2024
 * Modified on:          2024-02-20T03:06:42.906Z
 * SuiteScript Version:  2.0
 * Description:          Displays the list of LPO Leads that have come through from the webpage, https://mailplus.com.au/lpo-owner-info-page/  

 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */

define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect', 'N/format'
],
    function (ui, email, runtime, search, record, http, log, redirect, format) {
        var role = 0;
        var userId = 0;
        var zee = 0;

        function onRequest(context) {
            var baseURL = 'https://system.na2.netsuite.com';
            if (runtime.EnvType == "SANDBOX") {
                baseURL = 'https://system.sandbox.netsuite.com';
            }
            userId = runtime.getCurrentUser().id;
            role = runtime.getCurrentUser().role;

            if (context.request.method === 'GET') {

                //INITIALIZATION OF JQUERY AND BOOTSTRAP
                var inlineHtml = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/2.0.7/css/dataTables.dataTables.css"><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/3.0.2/css/buttons.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/2.0.7/js/dataTables.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/dataTables.buttons.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.dataTables.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.html5.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.print.min.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&callback=initMap&libraries=places"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/drilldown.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script>';

                inlineHtml +=
                    '<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" /><script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>';
                inlineHtml +=
                    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/css/bootstrap-select.min.css">';
                inlineHtml +=
                    '<script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/bootstrap-select.min.js"></script>';
                // Semantic Select
                inlineHtml +=
                    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.css">';
                inlineHtml +=
                    '<script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.js"></script>';

                inlineHtml += '<style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;}.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}.legend-container{display:flex;gap:10px}.legend-item{display:flex;align-items:center}.legend-color{width:20px;height:20px;border-radius:50%}.legend-name{margin-left:5px} .dot{height: 20px;width: 20px;border-radius: 50%;display: inline-block;border:1px solid black;}.input-field-error {border-color: #f4524d !important;color: #f4524d !important;}</style > ';

                var form = ui.createForm({
                    title: 'HO Generated for Franchisee - Franchisee List'
                });

                inlineHtml += loadingSection();

                //Instruction Box
                inlineHtml += '<div class="container instruction_div hide" style="background-color: lightblue;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p><b><u>Instructions</u></b></br><p></p></div></br>';


                //Search: HO Generated for Franchisee Campaign - Zee List
                var searchZees = search.load({
                    type: "partner",
                    id: 'customsearch_smc_franchisee_2_2'
                });
                var resultSetZees = searchZees.run();

                inlineHtml += franchiseeList(resultSetZees);

                inlineHtml += '</div>';

                inlineHtml += '</div>';
                inlineHtml += '</div>';

                form.addField({
                    id: 'preview_table',
                    label: 'inlinehtml',
                    type: 'inlinehtml'
                }).updateLayoutType({
                    layoutType: ui.FieldLayoutType.STARTROW
                }).defaultValue = inlineHtml;

                form.clientScriptFileId = 7115066
                context.response.writePage(form);

            } else {

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



        function franchiseeList(resultSetZees) {

            var inlineHtml =
                '<style>table#zee_list {color: #103D39 !important; font-size: 12px;text-align: center;border: none;vertical-align: middle}.dataTables_wrapper {font-size: 14px;}table#zee_list th{text-align: center;} .bolded{font-weight: bold;} .exportButtons{background-color: #045d7b !important;color: white !important;border-radius: 25px !important;}</style><div class="form-group zee_list_section" style="font-size: xx-small;">';

            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 zee_list_div hide">';
            inlineHtml +=
                '<table border="0" cellpadding="15" id="zee_list" class="table table-responsive row-border cell-border hover zee_list tablesorter display compact" cellspacing="0" style="width: 100%;border: 1px solid #103d39;font-size: 12px;text-align: center;border: 2px solid;"><thead style="color: white;background-color: #095c7b;"><tr><th style="vertical-align: middle;text-align: center;"><b>ACTION</b></th><th style="vertical-align: middle;text-align: center;"><b>FRANCHISEE</b></th><th style="vertical-align: middle;text-align: center;"><b>CONTACT NAME</b></th><th style="vertical-align: middle;text-align: center;"><b>EMAIL</b></th><th style="vertical-align: middle;text-align: center;"><b>PHONE</b></th><th style="vertical-align: middle;text-align: center;"><b>STATE</b></th><th style="vertical-align: middle;text-align: center;"><b>EXPRESSION OF INTEREST</b></th><th style="vertical-align: middle;text-align: center;"><b>FRANCHISEE GENERAETD LEADS</b></th><th style="vertical-align: middle;text-align: center;"><b>HO GENERATED LEADS</b></th><th style="vertical-align: middle;text-align: center;"><b>NOTES</b></th></tr></thead><tbody>';

            var count_zee = 0;

            resultSetZees.each(function (searchResult_zee) {
                var zee_id = searchResult_zee.getValue('internalid');
                var zee_name = searchResult_zee.getValue('companyname');
                var location = searchResult_zee.getText('location');
                var email = searchResult_zee.getValue('email');
                var mobilephone = searchResult_zee.getValue('custentity2');
                var zee_mass_email = searchResult_zee.getValue('custentity_zee_mass_email');
                var main_contact = searchResult_zee.getValue('custentity3');
                var ho_zee_generated_interested = searchResult_zee.getText('custentity_ho_generated_leads_interested');

                log.debug({
                    title: 'zee_id',
                    details: zee_id
                })

                //Search: Franchisee Generated & HO Generated for Franchisee - Lead Count
                var searchHOGeneratedZeeGeneratedLeadCountSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_4__2'
                });

                searchHOGeneratedZeeGeneratedLeadCountSearch.filters.push(search.createFilter({
                    name: 'partner',
                    operator: search.Operator.ANYOF,
                    values: zee_id
                }));

                var zeeGeneratedLeadCount = 0;
                var hoGeneratedForZeeCount = 0;

                var leadCountSearchCount = searchHOGeneratedZeeGeneratedLeadCountSearch.runPaged().count

                log.debug({
                    title: 'leadCountSearchCount',
                    details: leadCountSearchCount
                })

                searchHOGeneratedZeeGeneratedLeadCountSearch.run().each(function (
                    searchHOGeneratedZeeGeneratedLeadCountSearchResultSet) {

                    var salesRecordCampaign = searchHOGeneratedZeeGeneratedLeadCountSearchResultSet.getValue({
                        name: "custrecord_sales_campaign",
                        join: "CUSTRECORD_SALES_CUSTOMER",
                        summary: "GROUP",
                    });
                    var leadCount = searchHOGeneratedZeeGeneratedLeadCountSearchResultSet.getValue({
                        name: "internalid",
                        summary: "COUNT",
                    });

                    if (salesRecordCampaign == 70) {//Campaign is Franchisee Generated
                        zeeGeneratedLeadCount = leadCount
                    } else if (salesRecordCampaign == 82) {//Camapaign is HO Generated for Franchisee
                        hoGeneratedForZeeCount = leadCount
                    }

                    return true;
                });

                log.debug({
                    title: 'zeeGeneratedLeadCount',
                    details: zeeGeneratedLeadCount
                })
                log.debug({
                    title: 'hoGeneratedForZeeCount',
                    details: hoGeneratedForZeeCount
                })

                inlineHtml +=
                    '<tr>';
                inlineHtml += '<td style="vertical-align: middle;text-align: center;"><button type="button" id="zee_add_lpo_profile" class="btn btn-warning zee_add_lpo_profile glyphicon glyphicon-pencil" data-id="' + zee_id + '" style="border-radius: 50%"></button></td>'; // 0
                inlineHtml += '<td style="vertical-align: middle;text-align: center;">' + zee_name + '</td>';//1
                inlineHtml += '<td style="vertical-align: middle;text-align: center;">' + main_contact + '</td>';//2
                inlineHtml += '<td style="vertical-align: middle;text-align: center;">' + email + '</td>';//3
                inlineHtml += '<td style="vertical-align: middle;text-align: center;">' + mobilephone + '</td>';//4
                inlineHtml += '<td style="vertical-align: middle;text-align: center;">' + location + '</td>';//5
                inlineHtml += '<td style="vertical-align: middle;text-align: center;">' + ho_zee_generated_interested + '</td>';//6
                inlineHtml += '<td style="vertical-align: middle;text-align: center;">' + zeeGeneratedLeadCount + '</td>';//7
                inlineHtml += '<td style="vertical-align: middle;text-align: center;">' + hoGeneratedForZeeCount + '</td>';//8
                inlineHtml += '<td style="vertical-align: middle;text-align: center;"></td>';//9
                inlineHtml += '</tr>';


                count_zee++;
                return true;
            });

            inlineHtml += '</tbody></table>';
            inlineHtml += '</div>';

            inlineHtml += '</div>';
            inlineHtml += '</div>';

            return inlineHtml;
        }

        function isNullorEmpty(strVal) {
            return (strVal == null || strVal == '' || strVal == 'null' || strVal ==
                undefined || strVal == 'undefined' || strVal == '- None -' ||
                strVal ==
                '0');
        }

        /**
         * The header showing that the results are loading.
         * @returns {String} `inlineHtml`
         */
        function loadingSection() {

            var inlineHtml = '<div class="wrapper loading_section" style="height: 10em !important;left: 50px !important">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 ">';
            inlineHtml += '<h1 style="color: #095C7B;">Loading</h1>';
            inlineHtml += '</div></div></div></br></br>';
            inlineHtml += '<div class="wrapper loading_section">';
            inlineHtml += '<div class="blue ball"></div>'
            inlineHtml += '<div class="red ball"></div>'
            inlineHtml += '<div class="yellow ball"></div>'
            inlineHtml += '<div class="green ball"></div>'

            inlineHtml += '</div>'

            return inlineHtml;
        }

        return {
            onRequest: onRequest
        };
    });
