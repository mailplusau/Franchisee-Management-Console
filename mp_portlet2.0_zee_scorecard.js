/**

 *@NApiVersion 2.0
 *@NScriptType Portlet
 * @Author: Ankith Ravindran <ankithravindran>
 * @Filename: mp_sl2.0_zee_revenue_comm_report.js
 * Description: To report the total revenue & commissions - Page shared with Franchisee
 */


define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect'
],

    function (ui, email, runtime, search, record, http, log, redirect) {
        var role = 0;
        var zee = 0;

        var mpexLodgementPointsString = null;
        var mpstdLodgementPointsString = null;
        var sendleexpLodgementPointsString = null;
        var shippitLodgementPointsString = null;
        var franchiseeStdSuburbs = "";
        var franchiseeExpressSuburbs = "";
        var franchiseeSendleSuburbs = "";
        var franchiseeShippitSuburbs = "";
        var franchiseeAPSuburbs = "";
        var prospectingMasterclass = null;
        var customerReviews = null;


        function render(params) {
            var portlet = params.portlet;
            var baseURL = 'https://system.na2.netsuite.com';
            if (runtime.EnvType == "SANDBOX") {
                baseURL = 'https://system.sandbox.netsuite.com';
            }
            zee = 0;
            role = runtime.getCurrentUser().role;

            //If role is Franchisee
            if (role == 1000) {
                zee = runtime.getCurrentUser().id;
            } else {
                zee = 1645493;
            }

            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            //If begining of the year, show the current financial year, else show the current 
            // if (m < 5) {
            //     //Calculate the Current inancial Year

            //     var firstDay = new Date(y, m, 1);
            //     var lastDay = new Date(y, m + 1, 0);

            //     firstDay.setHours(0, 0, 0, 0);
            //     lastDay.setHours(0, 0, 0, 0);

            //     if (m >= 6) {
            //         var first_july = new Date(y, 6, 1);
            //     } else {
            //         var first_july = new Date(y - 1, 6, 1);
            //     }
            //     date_from = first_july;
            //     date_to = lastDay;

            //     var start_date = GetFormattedDate(date_from);
            //     var last_date = GetFormattedDate(date_to);
            // } else {
            //Calculate the Current Calendar Year
            // var today_day_in_month = date.getDate();
            // var today_date = new Date(Date.UTC(y, m, today_day_in_month))
            // var first_day_in_year = new Date(Date.UTC(y, 0));
            // var date_from = first_day_in_year.toISOString().split('T')[0];
            // var date_to = today_date.toISOString().split('T')[0];

            // var start_date = date_from;
            // var last_date = last_date;
            //Last 3 months rolling
            var i = 0;
            var lastDay = new Date(y, m + 1, 0);
            do {
                if (m == 1) {
                    m = 12;
                    y--;
                } else {
                    m--;
                }
                i++;
            } while (i < 4);

            var firstDay = new Date(y, m, 1);
            firstDay.setHours(0, 0, 0, 0);
            lastDay.setHours(0, 0, 0, 0);

            var start_date = GetFormattedDate(firstDay);
            var last_date = GetFormattedDate(lastDay);
            // }


            portlet.title = 'Profile';

            var inlineHtml =
                '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script></script><style>.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}.button-shadow{box-shadow:2.8px 2.8px 2.2px rgba(0,0,0,.02),6.7px 6.7px 5.3px rgba(0,0,0,.028),12.5px 12.5px 10px rgba(0,0,0,.035),22.3px 22.3px 17.9px rgba(0,0,0,.042),41.8px 41.8px 33.4px rgba(0,0,0,.05),100px 100px 80px rgba(0,0,0,.07)}.card{font-size: 14px; display: grid;place-items:center;order:2;margin: 0 auto; border-radius: 6px;padding: 20px;background: #CFE0CE;}ul{list-style: none;padding: 0;margin: 0 0 30px;} ul li{display: flex;gap: 10px;align-items: center;padding: 6px 0;}ul li img{width: 16px;}</style>';


            inlineHtml += loadingSection();

            inlineHtml += '<div class="container instruction_div hide" style="background-color: #F0AECB;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p><b><u>Profile Information:</u></b></br></p></div></br>';

            //NetSuite Search: Zee Management Console - Franchisees
            var searchZees = search.load({
                type: 'partner',
                id: 'customsearch_zee_management_console_zee'
            });

            searchZees.filters.push(search.createFilter({
                name: 'internalid',
                join: null,
                operator: search.Operator.IS,
                values: zee
            }));

            searchZees.run().each(function (searchResultZees) {
                mpexLodgementPointsString = searchResultZees.getValue(
                    'custentity_mpex_lodgement_point');
                mpstdLodgementPointsString = searchResultZees.getValue(
                    'custentity_mp_std_lodgement_point');
                sendleexpLodgementPointsString = searchResultZees.getValue(
                    'custentity_sendle_exp_lodgement_point');
                shippitLodgementPointsString = searchResultZees.getValue(
                    'custentity_shippit_lodgement_point');
                franchiseeExpressSuburbs = searchResultZees.getValue(
                    'custentity_zee_territory');
                franchiseeStdSuburbs = searchResultZees.getValue(
                    'custentity_network_matrix_main');
                franchiseeSendleSuburbs = searchResultZees.getValue(
                    'custentity_sendle_recovery_suburbs_main');
                franchiseeShippitSuburbs = searchResultZees.getValue(
                    'custentity_shippit_suburbs');
                franchiseeAPSuburbs = searchResultZees.getValue(
                    'custentity_ap_suburbs');
                prospectingMasterclass = searchResultZees.getValue(
                    'custentity_zee_prospect_masterclass');
                customerReviews = searchResultZees.getValue(
                    'custentity_zee_customer_reviews');

                return true;
            });

            // Website New Leads by Status - Monthly Reporting
            var leadsListBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_3'
            });
            if (!isNullorEmpty(start_date) && !isNullorEmpty(last_date)) {
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: start_date
                }));

                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: last_date
                }));
            }

            leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                name: 'leadsource',
                join: null,
                operator: search.Operator.IS,
                values: -4
            }));

            leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                name: 'partner',
                join: null,
                operator: search.Operator.IS,
                values: zee
            }));

            var count1 = 0;
            var oldDate1 = null;

            var customer_signed = 0;
            var suspect_hot_lead = 0;
            var suspect_reassign = 0;
            var suspect_lost = 0;
            var suspect_oot = 0;
            var suspect_customer_lost = 0;
            var suspect_off_peak_pipeline = 0;
            var prospect_opportunity = 0;
            var prospecy_quote_sent = 0;
            var prospect_no_answer = 0;
            var prospect_in_contact = 0;
            var suspect_follow_up = 0;
            var suspect_new = 0;


            leadsListBySalesRepWeeklySearch.run().each(function (
                prospectListBySalesRepWeeklyResultSet) {


                var prospectCount = parseInt(prospectListBySalesRepWeeklyResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP"
                });
                var custStatus = parseInt(prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                }));
                var custStatusText = prospectListBySalesRepWeeklyResultSet.getText({
                    name: "entitystatus",
                    summary: "GROUP"
                });

                if (custStatus == 13) {
                    //CUSTOMER _ SIGNED
                    customer_signed += parseInt(prospectCount);
                } else if (custStatus == 57) {
                    //SUSPECT - HOT LEAD
                    suspect_hot_lead += parseInt(prospectCount);
                } else if (custStatus == 59) {
                    //SUSPECT - LOST
                    suspect_lost += parseInt(prospectCount);
                } else if (custStatus == 64) {
                    //SUSPECT - OUT OF TERRITORY
                    suspect_oot = parseInt(prospectCount);
                } else if (custStatus == 22) {
                    //SUSPECT - CUSTOMER - LOST
                    suspect_customer_lost += parseInt(prospectCount);
                } else if (custStatus == 60 || custStatus == 40) {
                    //SUSPECT - REP REASSIGN
                    suspect_reassign += parseInt(prospectCount);
                } else if (custStatus == 50) {
                    //PROSPECT - QUOTE SENT
                    prospecy_quote_sent += parseInt(prospectCount);
                } else if (custStatus == 35) {
                    //PROSPECT - NO ANSWER
                    prospect_no_answer += parseInt(prospectCount);
                } else if (custStatus == 8) {
                    //PROSPECT - IN CONTACT
                    prospect_in_contact += parseInt(prospectCount);
                } else if (custStatus == 62) {
                    //SUSPECT - OFF PEAK PIPELINE
                    suspect_off_peak_pipeline += parseInt(prospectCount);
                } else if (custStatus == 58) {
                    //PROSPECT - OPPORTUNITY
                    prospect_opportunity += parseInt(prospectCount);
                } else if (custStatus == 18) {
                    //SUSPECT - FOLLOW UP
                    suspect_follow_up += parseInt(prospectCount);
                } else if (custStatus == 6) {
                    //SUSPECT - NEW
                    suspect_new += parseInt(prospectCount);
                }

                total_leads = customer_signed +
                    suspect_hot_lead +
                    suspect_lost +
                    suspect_customer_lost +
                    suspect_reassign +
                    prospecy_quote_sent +
                    prospect_no_answer +
                    prospect_in_contact +
                    suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new

                count1++;
                return true;
            });

            var totalItems =




                inlineHtml +=
                '<div class="form-group container pud_prospect_support " style="">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-4">'
            inlineHtml += '<article class="card">';
            inlineHtml += '<h2 style="text-align:center;">PUD/B2C Prospecting Support</h2>';
            inlineHtml += '<small style="text-align:center;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id cursus metus aliquam eleifend mi in nulla posuere.</small>';
            inlineHtml += '<ul>';
            inlineHtml += '<li>';
            if (isNullorEmpty(prospectingMasterclass)) {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
            } else {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
            }
            inlineHtml += '<p>Prospecting Masterclass</p>'
            inlineHtml += '</li>';
            inlineHtml += '<li>';
            if (isNullorEmpty(mpexLodgementPointsString)) {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
            } else {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
            }
            inlineHtml += '<p>Active MP Express Lodgement</p>'
            inlineHtml += '</li>';
            inlineHtml += '<li>';
            if (isNullorEmpty(mpstdLodgementPointsString)) {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
            } else {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
            }
            inlineHtml += '<p>Active MP Standard Lodgement</p>'
            inlineHtml += '</li>';

            inlineHtml += '<li>';
            if (isNullorEmpty(customerReviews)) {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
            } else {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
            }
            inlineHtml += '<p>Customer Reviews</p>'
            inlineHtml += '</li>';

            inlineHtml += '</ul></article>';
            inlineHtml += '</div>';


            inlineHtml += '<div class="col-xs-4">'
            inlineHtml += '<article class="card">';
            inlineHtml += '<h2 style="text-align:center;">Partnership Requirements</h2>';
            inlineHtml += '<small style="text-align:center;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id cursus metus aliquam eleifend mi in nulla posuere.</small>';
            inlineHtml += '<ul>';

            inlineHtml += '<li>';
            if (isNullorEmpty(franchiseeSendleSuburbs)) {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
            } else {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
            }
            inlineHtml += '<p>Sendle AU Express Suburb Mapping</p>'
            inlineHtml += '</li>';


            inlineHtml += '<li>';
            if (isNullorEmpty(franchiseeShippitSuburbs)) {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
            } else {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
            }
            inlineHtml += '<p>Shippit Suburb Mapping</p>'
            inlineHtml += '</li>';


            inlineHtml += '<li>';
            if (isNullorEmpty(franchiseeAPSuburbs)) {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
            } else {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
            }
            inlineHtml += '<p>Australia Post Suburb Mapping</p>'
            inlineHtml += '</li>';

            inlineHtml += '<li>';
            if ((isNullorEmpty(franchiseeSendleSuburbs) && isNullorEmpty(sendleexpLodgementPointsString)) && (isNullorEmpty(franchiseeStdSuburbs) && isNullorEmpty(mpstdLodgementPointsString)) && (isNullorEmpty(franchiseeShippitSuburbs) && isNullorEmpty(shippitLodgementPointsString))) {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
            } else {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
            }
            inlineHtml += '<p>Trained on MailPlus App</p>'
            inlineHtml += '</li>';

            inlineHtml += '</ul></article>';
            inlineHtml += '</div>';


            inlineHtml += '<div class="col-xs-4">'
            inlineHtml += '<article class="card">';
            inlineHtml += '<h2 style="text-align:center;">Additional Requirements</h2>';
            inlineHtml += '<small style="text-align:center;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id cursus metus aliquam eleifend mi in nulla posuere.</small>';
            inlineHtml += '<ul>';

            inlineHtml += '<li>';
            if (customer_signed == 0 && prospecy_quote_sent == 0 && prospect_opportunity == 0 && prospect_in_contact == 0) {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
            } else {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
            }
            inlineHtml += '<p>Qualified Leads</p>'
            inlineHtml += '</li>';

            
            inlineHtml += '<li>';
            // if (isNullorEmpty(prospectingMasterclass)) {
            inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
            // } else {
            //     inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
            // }
            inlineHtml += '<p>Compliant Uniform</p>'
            inlineHtml += '</li>';
            inlineHtml += '<li>';
            // if (isNullorEmpty(prospectingMasterclass)) {
            inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
            // } else {
            //     inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
            // }
            inlineHtml += '<p>Approved Vehicle and signage</p>'
            inlineHtml += '</li>';
            inlineHtml += '<li>';
            // if (isNullorEmpty(prospectingMasterclass)) {
            inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
            // } else {
            //     inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
            // }
            inlineHtml += '<p>Digitised Run</p>'
            inlineHtml += '</li>';
            inlineHtml += '</ul></article>';
            inlineHtml += '</div>';




            inlineHtml += '</div>';
            inlineHtml += '</div>';


            // inlineHtml +=
            //     '<div class="form-group container pud_prospect_support hide">';
            // inlineHtml += '<div class="row">';
            // inlineHtml +=
            //     '<div class="col-xs-12">Minimum requirements for PUD/B2C prospecting support:</div>'

            // inlineHtml += '</div>';
            // inlineHtml += '</div>';

            // inlineHtml +=
            //     '<div class="form-group container pud_prospect_support hide">';
            // inlineHtml += '<div class="row">';
            // inlineHtml +=
            //     '<div class="col-xs-3">Prospecting Masterclass</div>';
            // inlineHtml +=
            //     '<div class="col-xs-3">Prospecting Masterclass</div>';
            // inlineHtml +=
            //     '<div class="col-xs-3">Prospecting Masterclass</div>';

            // inlineHtml += '</div>';
            // inlineHtml += '</div>';



            // portlet.html = inlineHtml;
            portlet.addField({
                id: 'preview_table',
                label: 'inlinehtml',
                type: 'inlinehtml'
            }).updateLayoutType({
                layoutType: ui.FieldLayoutType.STARTROW
            }).defaultValue = inlineHtml;
            portlet.clientScriptFileId = 6513130;

        }


        /**
         * The header showing that the results are loading.
         * @returns {String} `inlineQty`
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

        function GetFormattedDate(todayDate) {

            var month = pad(todayDate.getMonth() + 1);
            var day = pad(todayDate.getDate());
            var year = (todayDate.getFullYear());

            return day + '/' + month + '/' + year;

            // return year + "-" + month + "-" + day;
        }

        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }

        function isNullorEmpty(val) {
            if (val == '' || val == null) {
                return true;
            } else {
                return false;
            }
        }
        return {
            render: render
        };
    });
