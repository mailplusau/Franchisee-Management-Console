/**

 *@NApiVersion 2.0
 *@NScriptType Suitelet
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


        function onRequest(context) {
            var baseURL = 'https://system.na2.netsuite.com';
            if (runtime.EnvType == "SANDBOX") {
                baseURL = 'https://system.sandbox.netsuite.com';
            }
            zee = 0;
            role = runtime.getCurrentUser().role;

            if (role == 1000) {
                zee = runtime.getCurrentUser().id;
            } else if (role == 3) { //Administrator
                zee = 6; //test
            } else if (role == 1032) { // System Support
                zee = 425904; //test-AR
            }

            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();

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

            if (context.request.method === 'GET') {
                var form = ui.createForm({
                    title: 'Your Performance Profile'
                });

                var inlineHtml =
                    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/highcharts-more.js"></script><script src="https://code.highcharts.com/modules/solid-gauge.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script><style>.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}.button-shadow{box-shadow:2.8px 2.8px 2.2px rgba(0,0,0,.02),6.7px 6.7px 5.3px rgba(0,0,0,.028),12.5px 12.5px 10px rgba(0,0,0,.035),22.3px 22.3px 17.9px rgba(0,0,0,.042),41.8px 41.8px 33.4px rgba(0,0,0,.05),100px 100px 80px rgba(0,0,0,.07)}.card{font-size: 14px; display: grid;place-items:center;order:2;margin: 0 auto; border-radius: 6px;padding: 20px;background: #7dc2d5ba;}ul{list-style: none;padding: 0;margin: 0 0 30px;} ul li{display: flex;gap: 10px;align-items: center;padding: 6px 0;}ul li img{width: 16px;}</style>';


                inlineHtml += loadingSection();
                inlineHtml += popUpModal();

                inlineHtml += '<div class="container instruction_div hide" style="background-color: #F0AECB;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p style="text-align: center;"><b><u>Welcome to your Performance Profile</u></b> </br></br>This dashboard provides an overview and status of the minimum requirements needed to grow your business. By completing your profile, you will unlock new opportunities to collaborate with our Sales and Marketing teams, thereby increasing the value of the business. Once you meet all the requirements (indicated by the green ticks below), you will be eligible to book resources for a joint growth and strategy program. </p></div></br>';

                inlineHtml += '<div class="container mp_roadmap hide" style="font-size: 14px;padding: 15px;box-shadow: 0px 1px 26px -10px white;text-align: center;border-radius: 10px"><iframe id="viewer" height="650" width="100%" src="https://1048144.app.netsuite.com/core/media/media.nl?id=6634474&c=1048144&h=ObkuXnE_XrlZHBqqfw9QKKpp72nCi4QwoktqnhV4rQZp_36k&_xt=.pdf#toolbar=0&navpanes=0&scrollbar=0"></iframe></div></br>'

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

                // Zee Scorecard - Customer Count - Excluding Partnerships
                var mainCustomerCount = search.load({
                    type: 'customer',
                    id: 'customsearch_smc_customer_3_3_2'
                });


                mainCustomerCount.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee
                }));

                customerCount = 0;
                digitisedCustomerCount = 0;

                mainCustomerCount.run().each(function (
                    mainCustomerCountResultSet) {

                    customerCount = parseInt(mainCustomerCountResultSet.getValue({
                        name: 'internalid',
                        summary: 'COUNT'
                    }));
                    return true;
                });


                // Zee Scorecard - Service Leg Frequency - Customer Count
                var digitisedCustomerCount = search.load({
                    type: 'customrecord_service_leg',
                    id: 'customsearch_rp_leg_freq_create_app_jo_2'
                });


                digitisedCustomerCount.filters.push(search.createFilter({
                    name: 'custrecord_service_leg_franchisee',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee
                }));

                digitisedCustomerCount.run().each(function (
                    digitisedCustomerCountResultSet) {

                    digitisedCustomerCount = parseInt(digitisedCustomerCountResultSet.getValue({
                        name: "internalid",
                        join: "CUSTRECORD_SERVICE_LEG_CUSTOMER",
                        summary: "COUNT",
                    }));
                    return true;
                });



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

                var totalScoringItems = 12;
                var completedItems = 0;




                inlineHtml +=
                    '<div class="form-group container pud_prospect_support hide" style="">';
                inlineHtml += '<div class="row">';
                inlineHtml += '<div class="col-xs-6">'
                inlineHtml += '<article class="card">';
                inlineHtml += '<h2 style="text-align:center;">Customer Growth</h2>';
                inlineHtml += '<small style="text-align:center;">This scorecard reflects the key elements driving your success in expanding your customer base and revenue streams. </small>';
                inlineHtml += '<ul>';

                inlineHtml += '<li>';
                if (isNullorEmpty(customerReviews) || customerReviews == 2) {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                    inlineHtml += '<p>Customer Reviews</p>'
                    inlineHtml += '</li>';
                    inlineHtml += '<div style=" text-align: center;"><button class="btn btn-sm" id="customer_reviews" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Learn More</button></div>';
                } else {
                    completedItems++;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Customer Reviews</p>'
                    inlineHtml += '</li>';
                    // inlineHtml += '<div style=" text-align: center;"><button class="btn" style="background-color: #095C7B;color: white;text-align:center;align-items: center">How do i collect reviews?</button></div>';
                }

                inlineHtml += '<li>';
                if (customer_signed == 0 && prospecy_quote_sent == 0 && prospect_opportunity == 0 && prospect_in_contact == 0) {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                    inlineHtml += '<p>Provide Qualified Leads </p>'
                    inlineHtml += '</li>';
                    inlineHtml += '<div style=" text-align: center;"><button class="btn btn-sm" id="qualified_leads" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Enter Lead Now</button></div>';
                } else {
                    completedItems++;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Provide Qualified Leads s</p>'
                    inlineHtml += '</li>';
                }

                inlineHtml += '<li>';
                if (isNullorEmpty(prospectingMasterclass) || prospectingMasterclass == 2) {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                    inlineHtml += '<p>Attended a Prospecting Masterclass</p>'
                    inlineHtml += '</li>';
                    inlineHtml += '<small>Our specialised Prospecting Masterclass equips you with the techniques and strategies to identify and engage with potential customers proactively. Through this training, we ensure our prospecting efforts are efficient and effective. </small></br></br><div style=" text-align: center;"><button class="btn btn-sm" id="prospecting_masterclass" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Enquire Now</button></div>';
                } else {
                    completedItems++;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Attended a Prospecting Masterclass</p>'
                    inlineHtml += '</li>';
                    // inlineHtml += '<small>Our specialised Prospecting Masterclass equips you with the techniques and strategies to identify and engage with potential customers proactively. Through this training, we ensure our prospecting efforts are efficient and effective. </small><div style=" text-align: center;"><button class="btn" style="background-color: #095C7B;color: white;text-align:center;align-items: center">Express interest now</button></div>';
                }


                // inlineHtml += '<p>Active MP Standard Lodgement</p>'
                // inlineHtml += '</li>';
                // inlineHtml += '<div style=" text-align: center;"><button class="btn" style="background-color: #095C7B;color: white;text-align:center;align-items: center">Open a new lodgement</button></div>';

                // inlineHtml += '<p>Customer Reviews</p>'
                // inlineHtml += '</li>';
                // inlineHtml += '<div style=" text-align: center;"><button class="btn" style="background-color: #095C7B;color: white;text-align:center;align-items: center">How do i collect reviews?</button></div>';
                inlineHtml += '</ul></article>';
                inlineHtml += '</div>';


                inlineHtml += '<div class="col-xs-6">'
                inlineHtml += '<article class="card">';
                inlineHtml += '<h2 style="text-align:center;">Local Network Ready</h2>';
                inlineHtml += '<small style="text-align:center;">Below are the minimum items required to be part of the MailPlus adhoc network for programs such as Australia Post, Shippit and Sendle.</small>';
                inlineHtml += '<ul>';

                inlineHtml += '<li>';
                var sendleSuburbMappingCompleted = false;
                var shippitSuburbMappingCompleted = false;
                var apSuburbMappingCompleted = false;
                if (isNullorEmpty(franchiseeSendleSuburbs)) {
                    sendleSuburbMappingCompleted = false;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                    inlineHtml += '<p>Sendle AU Express Suburb Mapping</p>'
                    inlineHtml += '</li>';
                    inlineHtml += '<div style=" text-align: center;"><button class="btn btn-sm" id="sendle_suburb_mapping" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Complete Now</button></div>';
                } else {
                    completedItems++;
                    sendleSuburbMappingCompleted = true;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Sendle AU Express Suburb Mapping</p>'
                    inlineHtml += '</li>';
                }



                inlineHtml += '<li>';
                if (isNullorEmpty(franchiseeShippitSuburbs)) {
                    shippitSuburbMappingCompleted = false;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                    inlineHtml += '<p>Shippit Suburb Mapping</p>'
                    inlineHtml += '</li>';
                    inlineHtml += '<div style=" text-align: center;"><button class="btn btn-sm" id="shippit_suburb_mapping" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Complete Now</button></div>';
                } else {
                    completedItems++;
                    shippitSuburbMappingCompleted = true;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Shippit Suburb Mapping</p>'
                    inlineHtml += '</li>';
                }



                inlineHtml += '<li>';
                if (isNullorEmpty(franchiseeAPSuburbs)) {
                    apSuburbMappingCompleted = false;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                } else {
                    completedItems++;
                    apSuburbMappingCompleted = true;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                }
                inlineHtml += '<p>Australia Post Suburb Mapping</p>'
                inlineHtml += '</li>';
                if (apSuburbMappingCompleted == false) {
                    inlineHtml += '<div style=" text-align: center;"><button class="btn btn-sm" id="ap_suburb_mapping" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Complete Now</button></div>';
                }

                inlineHtml += '<li>';
                if (isNullorEmpty(mpexLodgementPointsString)) {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                } else {
                    completedItems++;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                }
                inlineHtml += '<p>Active MP Express Lodgement</p>'
                inlineHtml += '</li>';
                inlineHtml += '<li>';
                if (isNullorEmpty(mpstdLodgementPointsString)) {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                    inlineHtml += '<p>Active MP Standard Lodgement</p>'
                    inlineHtml += '</li>';
                    inlineHtml += '<div style=" text-align: center;"><button class="btn btn-sm" id="lodgement_locations" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Activate Now</button></div>';
                } else {
                    completedItems++;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Active Hub Lodgement</p>'
                    inlineHtml += '</li>';
                    // inlineHtml += '<div style=" text-align: center;"><button class="btn" style="background-color: #095C7B;color: white;text-align:center;align-items: center">Open a new lodgement</button></div>';
                }

                inlineHtml += '<li>';
                if ((isNullorEmpty(franchiseeSendleSuburbs) && isNullorEmpty(sendleexpLodgementPointsString)) && (isNullorEmpty(franchiseeShippitSuburbs) && isNullorEmpty(shippitLodgementPointsString))) {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                    inlineHtml += '<p>Trained on MailPlus App</p>'
                    inlineHtml += '</li>';
                    inlineHtml += '<div style=" text-align: center;"><button class="btn btn-sm" id="app_training" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Complete Training </button></div>';
                } else {
                    completedItems++;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Trained on MailPlus App</p>'
                    inlineHtml += '</li>';
                }
                // inlineHtml += '<p>Trained on MailPlus App</p>'
                // inlineHtml += '</li>';

                inlineHtml += '</ul></article>';
                inlineHtml += '</div>';
                inlineHtml += '</div>';
                inlineHtml += '</div></br></br>';



                inlineHtml +=
                    '<div class="form-group container scorecard_percentage " style="">';
                inlineHtml += '<div class="row">';
                inlineHtml += '<div class="col-xs-12">'
                inlineHtml += '<article class="card">';
                inlineHtml += '<h2 style="text-align:center;">Essentials for Success </h2>';
                inlineHtml += '<small style="text-align:center;">This scorecard reflects the vital aspects that you need to adhere to maintain MailPlus business standards and uphold our reputation. </small>';
                inlineHtml += '<ul>';


                inlineHtml += '<li>';
                // if (isNullorEmpty(prospectingMasterclass)) {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                // } else {
                //     inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                // }
                inlineHtml += '<p>Compliant Uniform</p>'
                inlineHtml += '</li>';
                inlineHtml += '<div style=" text-align: center;"><button class="btn btn-sm" id="uniform" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Order Uniform</button></div>';
                inlineHtml += '<li>';
                // if (isNullorEmpty(prospectingMasterclass)) {
                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                // } else {
                //     inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                // }
                inlineHtml += '<p>Approved Vehicle and signage</p>'
                inlineHtml += '</li>';
                inlineHtml += '<div style=" text-align: center;"><button class="btn btn-sm" id="vehicle" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Learn More</button></div>';
                inlineHtml += '<li>';
                if (customerCount != digitisedCustomerCount) {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                    inlineHtml += '<p>Digitised Run</p>'
                    inlineHtml += '</li>';
                    inlineHtml += '<div style=" text-align: center;"><button class="btn btn-sm" id="digitise_run" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Learn More</button></div>';
                } else {
                    completedItems++;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Digitised Run</p>'
                    inlineHtml += '</li>';

                }

                inlineHtml += '</ul></article>';

                inlineHtml += '</div>';
                inlineHtml += '</div>';
                inlineHtml += '</div></br></br>';


                inlineHtml +=
                    '<div class="form-group container scorecard_percentage " style="">';
                inlineHtml += '<div class="row">';
                inlineHtml += '<div class="col-xs-12">'
                inlineHtml += '<article class="card">';
                inlineHtml += '<h2 style="text-align:center;">See Your Progress </h2>';
                inlineHtml += '<small style="text-align:center;font-size: 12px;">A franchise profile score of 12 is essential to maintain your business\'s value relative to the franchise network and unlock further growth and strategy support from the sales and marketing team. Look out for the \'green\' button appearing  below the score, indicating you have achieved this milestone. Let\'s work together to propel your business towards success! </small>';
                inlineHtml += '<div id="container-progress"></div>';
                inlineHtml += '</article>';
                inlineHtml += '</div>';
                inlineHtml += '</div>';
                inlineHtml += '</div>';

                form.addField({
                    id: 'custpage_total_items',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = totalScoringItems;

                form.addField({
                    id: 'custpage_completed_items',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = completedItems;

                form.addField({
                    id: 'preview_table',
                    label: 'inlinehtml',
                    type: 'inlinehtml'
                }).updateLayoutType({
                    layoutType: ui.FieldLayoutType.STARTROW
                }).defaultValue = inlineHtml;


                form.clientScriptFileId = 6644242;
                context.response.writePage(form);
            }


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

        function popUpModal() {


            var inlineHtml =
                '<div id="myModal" class="modal" style="display: none; position: fixed; z-index: 1; padding-top: 100px;left: 0;top: 0;width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); "><div class="modal-content" style="position: absolute;transform: translate(-50%, -50%);background-color: #fefefe;/* margin: auto; *//* padding: 0; */border: 1px solid #888;/* width: 80%; */left: 50%;top: 50%;/* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); */-webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 0.4s;"><div class="modal-header" style="padding: 2px 16px;text-align: center;"><span class="close" style="color: black;float: right;font-size: 28px;font-weight: bold;"">&times;</span><h3 class="modal-title" id="modal-title">Thank you for you taking the initiative</h3></div>';

            inlineHtml +=
                '<div class="modal-body" style="padding: 2px 16px;font-size: 14px;">';
            inlineHtml +=
                '</div><div class="modal-footer" style="padding: 2px 16px;"></div></div></div>';

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
            onRequest: onRequest
        };
    });
