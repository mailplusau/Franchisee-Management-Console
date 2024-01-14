/**

 *@NApiVersion 2.0
 *@NScriptType Suitelet
 * @Author: Ankith Ravindran <ankithravindran>
 * @Filename: mp_sl2.0_zee_revenue_comm_report.js
 * Description: To report the total revenue & commissions - Page shared with Franchisee
 */


define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect', 'N/format'
],

    function (ui, email, runtime, search, record, http, log, redirect, format) {
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
        var leadGenerationTraining = null;
        var salesLeadQueryCount = 0;
        var hubLodgementQueryCount = 0;
        var suburbMappingQueryCount = 0;
        var lpoProjectQueryCount = 0;
        var lpoProjectQueryDate;
        var vehicleQueryCount = 0;
        var uniformQueryCount = 0;
        var digitiseRunQueryCount = 0;
        var mpProjects = null;


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
                zee = 1645493; //test
            } else if (role == 1032) { // System Support
                zee = 1645493; //test-AR
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
                    title: 'Your Growth Roadmap'
                });

                var inlineHtml =
                    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/highcharts-more.js"></script><script src="https://code.highcharts.com/modules/solid-gauge.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script><style>.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}.button-shadow{box-shadow:2.8px 2.8px 2.2px rgba(0,0,0,.02),6.7px 6.7px 5.3px rgba(0,0,0,.028),12.5px 12.5px 10px rgba(0,0,0,.035),22.3px 22.3px 17.9px rgba(0,0,0,.042),41.8px 41.8px 33.4px rgba(0,0,0,.05),100px 100px 80px rgba(0,0,0,.07)}.card{font-size: 14px; display: grid;/*place-items:center*/;order:2;margin: 0 auto; border-radius: 50px;padding: 20px;background: #7dc2d5ba;}.card-incomplete{font-size: 14px; display: grid;/*place-items:center*/;order:2;margin: 0 auto; border-radius: 50px;padding: 20px;background: #e4caa7;}.card-complete{font-size: 14px; display: grid;/*place-items:center*/;order:2;margin: 0 auto; border-radius: 50px;padding: 20px;background: #7dd5b8ba;}ul{list-style: none;padding: 0;margin: 0 0 30px;} ul li{display: flex;gap: 10px;align-items: center;padding: 6px 0;}ul li img{width: 16px;}</style>';


                inlineHtml += loadingSection();
                inlineHtml += popUpModal();

                inlineHtml += '<div class="container instruction_div hide" style="background-color: #F0AECB;font-size: 14px;padding: 15px;border-radius: 50px;/*border: 1px solid*/;box-shadow: 0px 1px 26px -10px white;"><p style=""><b><u>Welcome to Your Strategy Roadmap </u></b> </br></br>MailPlus continues to invest and pursue multiple growth strategies that take advantage of our unique 1st mile local network and premium customer service for small business. We are currently working on four related strategies, these are:</br></br><div style="padding-left: 50px;"><b>B2B - Small to Medium Businesses:</b> Delivering tailored mail and parcel solutions for business needs, especially for PO Box holders. </div></br><div style="padding-left: 50px;"><b>B2C - eCommerce Merchants:</b> Providing an exceptional pickup service experience for low-volume e-commerce merchants using the MailPlus booking portal. </div></br><div style="padding-left: 50px;"><b>1st Mile – Carriers & Platforms:</b> Providing an exceptional pickup service experience and consolidated lodgement for low-volume jobs from platforms and carriers (like Sendle, Dash-back, Secure Cash, etc.) </div></br><div style="padding-left: 50px;"><b>LPO - Local Business Partner Program support for LPOs:</b> Providing contracted and adhoc Pickup & Delivery services to support Licensed Post Offices in meeting pickup and delivery demands. </div></br></br>There are specific initiatives that connect your MailPlus franchise business into each of these growth strategies. Aiming for a green tick in each strategy is essential. If one\'s missing, simply click the related action button to progress. Please review this page quarterly to ensure your business is up to date and ready for success. </br></br><div style="padding-left: 50px;"><small><b><u>Initiative Readiness Legend:</u></b></br><div style="padding-left: 50px;"><svg height="25" width="25" style="vertical-align: middle;"><circle cx="12.5" cy="12.5" r="10" stroke="" stroke-width="3" fill="#e4caa7" /></svg> - In Progress</div><div style="padding-left: 50px;"><svg height="25" width="25" style="vertical-align: middle;"><circle cx="12.5" cy="12.5" r="10" stroke="" stroke-width="3" fill="#7dd5b8ba" /></svg> - Completed</div></small></div></p></div></br>';


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
                    leadGenerationTraining = searchResultZees.getValue(
                        'custentity_lead_generation_training');
                    mpProjects = searchResultZees.getValue(
                        'custentity_mp_projects');

                    salesLeadQueryCount = searchResultZees.getValue(
                        'custentity_sales_leads_query_count');
                    if (isNullorEmpty(salesLeadQueryCount)) {
                        salesLeadQueryCount = 0;
                    }
                    hubLodgementQueryCount = searchResultZees.getValue(
                        'custentity_hub_lodgement_query_count');
                    if (isNullorEmpty(hubLodgementQueryCount)) {
                        hubLodgementQueryCount = 0;
                    }
                    suburbMappingQueryCount = searchResultZees.getValue(
                        'custentity_suburb_mapping_query_count');
                    if (isNullorEmpty(suburbMappingQueryCount)) {
                        suburbMappingQueryCount = 0;
                    }
                    lpoProjectQueryCount = searchResultZees.getValue(
                        'custentity_lpo_query_count');
                    lpoProjectQueryDate = searchResultZees.getValue(
                        'custentity_date_lpo_program_interest');
                    if (isNullorEmpty(lpoProjectQueryCount)) {
                        lpoProjectQueryCount = 0;
                    }
                    vehicleQueryCount = searchResultZees.getValue(
                        'custentity_vehicle_query_count');
                    if (isNullorEmpty(vehicleQueryCount)) {
                        vehicleQueryCount = 0;
                    }
                    uniformQueryCount = searchResultZees.getValue(
                        'custentity_uniform_query_count');
                    if (isNullorEmpty(uniformQueryCount)) {
                        uniformQueryCount = 0;
                    }
                    digitiseRunQueryCount = searchResultZees.getValue(
                        'custentity_digitise_run_query_count');
                    if (isNullorEmpty(digitiseRunQueryCount)) {
                        digitiseRunQueryCount = 0;
                    }

                    return true;
                });

                var mpProjectsArray = [];
                if (!isNullorEmpty(mpProjects)) {
                    mpProjectsArray = mpProjects.split(',');
                }

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

                var totalScoringItems = 4;
                var completedItems = 0;

                var startergyCompleted = false;

                inlineHtml +=
                    '<div class="form-group container pud_prospect_support hide" style="">';
                inlineHtml += '<div class="row">';
                inlineHtml += '<div class="col-xs-6">'
                if (customer_signed < 5 && prospecy_quote_sent < 5 && prospect_opportunity < 5 && prospect_in_contact < 5) {
                    inlineHtml += '<article class="card-incomplete">';
                } else {
                    inlineHtml += '<article class="card-complete">';
                }
                inlineHtml += '<img height="200" src="https://1048144.app.netsuite.com/core/media/media.nl?id=6689770&c=1048144&h=95uHiobDnO16P_0lXo1VAV8ni0toSir2BYe3tHrePzLcXXiH" alt="B2B - Small to Medium Businesses" style="align-items: center;display: block;margin-left: auto;margin-right: auto;border-radius: 50%;"><h2 style="text-align:center;border-radius: 30%;">B2B - Small to Medium Businesses</h2>';
                inlineHtml += '<small style="text-align:center;">Your business-as-usual mail and parcel service. Your key contribution for this strategy is to provide quality leads and work with your Sale Rep to signup new customers.</small>';
                inlineHtml += '';
                inlineHtml += '<ul>';

                inlineHtml += '<li>';
                if (leadGenerationTraining == 1) {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Complete the new lead generation learning module.</p>';
                    inlineHtml += '<div style=" text-align: right;"><a class="btn btn-sm" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px" target="_blank" href="https://1048144.app.netsuite.com/core/media/media.nl?id=6699161&c=1048144&h=OS-O_tP1tmSA6eIJ_ocVHSGDDKrBb3yf5xkBnDwkYpYTOkh3&_xt=.pdf">View Training Module</a></div>';
                    startergyCompleted = true;
                } else {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                    inlineHtml += '<p>Complete the new lead generation learning module.</p>'
                    inlineHtml += '<div style=" text-align: right;"><a class="btn btn-sm" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px" id="complete_module" target="_blank" href="https://1048144.app.netsuite.com/core/media/media.nl?id=6699161&c=1048144&h=OS-O_tP1tmSA6eIJ_ocVHSGDDKrBb3yf5xkBnDwkYpYTOkh3&_xt=.pdf">Complete Module</a></div>';
                }

                inlineHtml += '</li>';

                inlineHtml += '<li>';
                if (customer_signed < 5 && prospecy_quote_sent < 5 && prospect_opportunity < 5 && prospect_in_contact < 5) {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                    inlineHtml += '<p>Maintain a minimum of 5 Qualified Leads in your Prospect List via the Franchisee Lead Form.</p>'
                    inlineHtml += '<div style=" text-align: right;"><a class="btn btn-sm" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px" target="_blank" href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1706&deploy=1&compid=1048144&script=1706&deploy=1&compid=1048144&script=1706&deploy=1&whence=https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1706&deploy=1&compid=1048144&script=1706&deploy=1&compid=1048144&script=1706&deploy=1&whence=">Enter Leads Now</a></div>';
                } else {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Maintain a minimum of 5 Qualified Leads in your Prospect List via the Franchisee Lead Form.</p>'
                    startergyCompleted = true;
                }

                inlineHtml += '</li>';

                inlineHtml += '</ul><p style=" text-align: center;"><b>Need further assistance generating leads?</b> </br>Click the button to have a 1:1 training session. </br></br><div style=" text-align: center;"><button class="btn btn-sm" id="prospecting_masterclass" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Book Now</button></div></p></article>';
                inlineHtml += '</div>';

                if (startergyCompleted == true) {
                    completedItems++;
                }

                startergyCompleted = false;

                inlineHtml += '<div class="col-xs-6">'
                if (isNullorEmpty(mpstdLodgementPointsString)) {
                    inlineHtml += '<article class="card-incomplete">';
                } else {
                    inlineHtml += '<article class="card-complete">';
                }

                inlineHtml += '<img height="200" src="https://1048144.app.netsuite.com/core/media/media.nl?id=6689771&c=1048144&h=Q65ItxxSSa1UCN6tBZIlefG2aClYo503VbvuK52qeYTpZDHH" alt="B2C - eCommerce Merchants" style="align-items: center;display: block;margin-left: auto;margin-right: auto;border-radius: 50%;"><h2 style="text-align:center;border-radius: 30%;">B2C - eCommerce Merchants</h2>';
                inlineHtml += '<small style="text-align:center;">Offering the broadest range of shipping products is essential for this market. Your contribution to this initiative is to select consolidated hub options that give your customers access to all product types. Click Activate Now to provide your customers with more options – otherwise a green tick will display if all product options are available to your customers. </small>';
                inlineHtml += '<ul>';

                inlineHtml += '<li>';
                var sendleSuburbMappingCompleted = false;
                var shippitSuburbMappingCompleted = false;
                var apSuburbMappingCompleted = false;
                inlineHtml += '<li>';
                if (isNullorEmpty(mpstdLodgementPointsString)) {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                    inlineHtml += '<p>Open consolidated hub</p>'
                    inlineHtml += '</li>';

                } else {
                    startergyCompleted = true;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Active Hub Lodgement</p>'
                    inlineHtml += '</li>';

                }
                inlineHtml += '</ul>';
                if (isNullorEmpty(mpstdLodgementPointsString)) {
                    inlineHtml += '<p style=" text-align: center;"><b>Want to offer more to your customers?</b> </br>Click the button below to activate more product options.</br></br><div style=" text-align: center;"><button class="btn btn-sm" id="lodgement_locations" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Activate Now</button></p>';
                }
                inlineHtml += '</article>';
                inlineHtml += '</div>';
                inlineHtml += '</div>';
                inlineHtml += '</div></br></br>';

                if (startergyCompleted == true) {
                    completedItems++;
                }

                startergyCompleted = false;

                inlineHtml +=
                    '<div class="form-group container pud_prospect_support hide" style="">';
                inlineHtml += '<div class="row">';
                inlineHtml += '<div class="col-xs-6">'
                if (isNullorEmpty(franchiseeSendleSuburbs)) {
                    inlineHtml += '<article class="card-incomplete">';
                } else {
                    inlineHtml += '<article class="card-complete">';
                }

                inlineHtml += '<img height="200" src="https://1048144.app.netsuite.com/core/media/media.nl?id=6689772&c=1048144&h=PxIs1U0fDgf56NcAeCmvA5o2lbQGnAVcU9QjP0wOljc9z3zF" alt="1st Mile– Carriers & Platforms" style="align-items: center;display: block;margin-left: auto;margin-right: auto;border-radius: 50%;"><h2 style="text-align:center;border-radius: 30%;">1st Mile– Carriers & Platforms</h2>';
                inlineHtml += '<small style="text-align:center;">Have you completed suburb mapping for each available and future carrier (TGE, Sendle, Shippit and StarTrack.)</small>';
                inlineHtml += '';
                inlineHtml += '<ul>';
                inlineHtml += '<li>';
                var sendleSuburbMappingCompleted = false;
                if (isNullorEmpty(franchiseeSendleSuburbs)) {
                    sendleSuburbMappingCompleted = false;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                    inlineHtml += '<p>Suburb Mapping</p>'
                    inlineHtml += '</li>';

                } else {
                    startergyCompleted = true;
                    sendleSuburbMappingCompleted = true;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Suburb Mapping</p>'
                    inlineHtml += '</li>';
                }

                if (startergyCompleted == true) {
                    completedItems++;
                }

                inlineHtml += '</ul>';
                if (isNullorEmpty(franchiseeSendleSuburbs)) {
                    inlineHtml += '<p style=" text-align: center;"><b>Need help mapping your suburbs?</b> </br>Click the button below and our team will assist you.</br></br><div style=" text-align: center;"><button class="btn btn-sm" id="sendle_suburb_mapping" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Map my Suburbs</button></div></p>';
                }
                inlineHtml += '</article>';
                inlineHtml += '</div>';

                startergyCompleted = false;

                inlineHtml += '<div class="col-xs-6">'
                if (!isNullorEmpty(mpProjectsArray) && (mpProjectsArray.indexOf("5") > -1)) {
                    inlineHtml += '<article class="card-complete">';
                } else {
                    inlineHtml += '<article class="card-incomplete">';
                }

                // } 
                inlineHtml += '<img height="200" src="https://1048144.app.netsuite.com/core/media/media.nl?id=6689773&c=1048144&h=a75slIkBu1uI3zMMVjRvUcRAO_LEXmLfm2InTiAawsa0NsGL" alt="LPO - Local Business Partner " style="align-items: center;display: block;margin-left: auto;margin-right: auto;border-radius: 50%;"><h2 style="text-align:center;border-radius: 30%;">LPO - Local Business Partner </h2>';
                inlineHtml += '<small style="text-align:center;">Currently in Pilot Phase, our new partnership with Licensed Post Offices will help you secure more mail and parcel work as we work independently with each LPO to support their Local Business Partner program. </small>';
                inlineHtml += '<ul>';

                var apSuburbMappingCompleted = false;
                inlineHtml += '<li>';
                if (!isNullorEmpty(mpProjectsArray) && (mpProjectsArray.indexOf("5") > -1)) {
                    startergyCompleted = true;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Your territory is linked to a Licensed Post Office active in the Australia Post Local Business Partner program.</p>';
                    inlineHtml += '</li>';
                } else {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';

                    inlineHtml += '<p>You will be notified once your territory is ready to be linked to a Licensed Post Office active in the Australia Post Local Business Partner program. If you are keen to fast track this into your territory, register your interest by clicking the button below.</p>';
                    inlineHtml += '</li>';

                }


                inlineHtml += '</ul>';
                if (isNullorEmpty(mpProjectsArray) || (mpProjectsArray.indexOf("5") == -1)) {

                    if (!isNullorEmpty(lpoProjectQueryDate) || !isNullorEmpty(lpoProjectQueryCount)) {
                        inlineHtml += '<div style=" text-align: center;"><button class="btn btn-sm" id="lpo_project_register" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px" readonly disabled>You have registered your interest</button></div>';
                    } else {
                        inlineHtml += '<div style=" text-align: center;"><button class="btn btn-sm" id="lpo_project_register" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Register Your Interest</button></div>';
                    }

                }
                inlineHtml += '</article>';
                inlineHtml += '</div>';
                inlineHtml += '</div>';
                inlineHtml += '</div></br></br>';

                if (startergyCompleted == true) {
                    completedItems++;
                }

                inlineHtml +=
                    '<div class="form-group container essential_success hide" style="">';
                inlineHtml += '<div class="row">';
                inlineHtml += '<div class="col-xs-3"></div>'
                inlineHtml += '<div class="col-xs-6">'
                inlineHtml += '<article class="card">';
                inlineHtml += '<h2 style="text-align:center;">MailPlus Standard Practice </h2>';
                inlineHtml += '<small style="text-align:center;">A quick sense check to ensure you have the necessary operational tools in place to maintain high industry standards: </small>';
                inlineHtml += '<ul>';

                inlineHtml += '<li>';

                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';

                inlineHtml += '<p>Approved Vehicle and signage <div style=" text-align: right;"><button class="btn btn-sm" id="vehicle" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Learn More</button></div></p>'
                inlineHtml += '';
                inlineHtml += '</li>';

                inlineHtml += '<li>';

                inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';

                inlineHtml += '<p>Compliant Uniform</p>'
                inlineHtml += '<div style=" text-align: right;"><button class="btn btn-sm" id="uniform" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Order Uniform</button></div>';
                inlineHtml += '</li>';


                inlineHtml += '<li>';
                if (customerCount != digitisedCustomerCount) {
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513332&c=1048144&h=Vabzg-Sb95cGUEQcNDUiI04lCM2MBy_WuezJAzgpSWK2uElv">';
                    inlineHtml += '<p>Digitised Run</p>'
                    inlineHtml += '<div style=" text-align: right;"><button class="btn btn-sm" id="digitise_run" style="background-color: #095C7B;color: white;text-align:center;align-items: center;border-radius: 30px">Learn More</button></div>';
                    inlineHtml += '</li>';

                } else {
                    completedItems++;
                    inlineHtml += '<img src="https://1048144.app.netsuite.com/core/media/media.nl?id=6513331&c=1048144&h=xGyROg8CoHweMuavTFJSQN2eFzoaZE5wtK8_rdteKVZCGv0u">';
                    inlineHtml += '<p>Digitised Run</p>'
                    inlineHtml += '</li>';

                }

                inlineHtml += '<p style="text-align: center;"><b>Access to MailPlus App</b></p></br><div class="row"><div class="col-xs-6"><a href="https://play.google.com/store/apps/details?id=com.mailplus.operatorandroid"><img height="50" width="150" src="https://1048144.app.netsuite.com/core/media/media.nl?id=6689895&c=1048144&h=t5jDCyAuWyjddvq98aYU2dBMTEyPkmumdNA64aV1uRy-VM3w" alt="B2B - Small to Medium Businesses" style="align-items: center;display: block;margin-left: auto;margin-right: auto;"></a></div><div class="col-xs-6"><a href="https://apps.apple.com/au/app/mp-operator/id1465447160"><img height="50" width="150" src="https://1048144.app.netsuite.com/core/media/media.nl?id=6689896&c=1048144&h=Uco-i_T9PPbd741yRgm078ALw3k5dE8h-ydQj5kwMsFwWBRc" alt="B2B - Small to Medium Businesses" style="align-items: center;display: block;margin-left: auto;margin-right: auto;"></a></div></div>';

                inlineHtml += '</ul></article>';

                inlineHtml += '</div>';
                inlineHtml += '<div class="col-xs-3"></div>'
                inlineHtml += '</div>';
                inlineHtml += '</div></br></br>';


                form.addField({
                    id: 'custpage_zee',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = zee;

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
                    id: 'custpage_completed_module',
                    type: ui.FieldType.TEXT,
                    label: 'Completed Module'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = leadGenerationTraining;

                form.addField({
                    id: 'custpage_sales_lead_query_count',
                    type: ui.FieldType.TEXT,
                    label: 'Digitise Run'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = salesLeadQueryCount;
                form.addField({
                    id: 'custpage_hub_lodgement_query_count',
                    type: ui.FieldType.TEXT,
                    label: 'Digitise Run'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = hubLodgementQueryCount;
                form.addField({
                    id: 'custpage_suburb_mapping_query_count',
                    type: ui.FieldType.TEXT,
                    label: 'Digitise Run'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = suburbMappingQueryCount;
                form.addField({
                    id: 'custpage_lpo_project_query_count',
                    type: ui.FieldType.TEXT,
                    label: 'Digitise Run'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = lpoProjectQueryCount;
                form.addField({
                    id: 'custpage_lpo_project_query_date',
                    type: ui.FieldType.TEXT,
                    label: 'Digitise Run'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = lpoProjectQueryDate;
                form.addField({
                    id: 'custpage_vehicle_query_count',
                    type: ui.FieldType.TEXT,
                    label: 'Digitise Run'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = vehicleQueryCount;
                form.addField({
                    id: 'custpage_uniform_query_count',
                    type: ui.FieldType.TEXT,
                    label: 'Digitise Run'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = uniformQueryCount;
                form.addField({
                    id: 'custpage_digitise_run_query_count',
                    type: ui.FieldType.TEXT,
                    label: 'Digitise Run'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = digitiseRunQueryCount;

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


                form.clientScriptFileId = 6644242;
                context.response.writePage(form);
            } else {
                var zeeId = parseInt(context.request.parameters.custpage_zee);
                var leadTrainingCompleted = context.request.parameters.custpage_completed_module;
                var salesLeadQueryCount = context.request.parameters.custpage_sales_lead_query_count;
                var hubLodgementQueryCount = context.request.parameters.custpage_hub_lodgement_query_count;
                var suburbMappingQueryCount = context.request.parameters.custpage_suburb_mapping_query_count;
                var lpoProjectQueryCount = context.request.parameters.custpage_lpo_project_query_count;
                var lpoProjectQueryDate = context.request.parameters.custpage_lpo_project_query_date;
                var vehicleQueryCount = context.request.parameters.custpage_vehicle_query_count;
                var uniformQueryCount = context.request.parameters.custpage_uniform_query_count;
                var digitiseRunQueryCount = context.request.parameters.custpage_digitise_run_query_count;

                //Load Partner Record & Save the main details
                var zeeRecord = record.load({
                    type: record.Type.PARTNER,
                    id: zeeId
                });
                zeeRecord.setValue({
                    fieldId: 'custentity_lead_generation_training',
                    value: leadTrainingCompleted
                });

                zeeRecord.setValue({
                    fieldId: 'custentity_sales_leads_query_count',
                    value: salesLeadQueryCount
                });
                zeeRecord.setValue({
                    fieldId: 'custentity_hub_lodgement_query_count',
                    value: hubLodgementQueryCount
                });
                zeeRecord.setValue({
                    fieldId: 'custentity_suburb_mapping_query_count',
                    value: suburbMappingQueryCount
                });
                zeeRecord.setValue({
                    fieldId: 'custentity_lpo_query_count',
                    value: lpoProjectQueryCount
                });
                zeeRecord.setValue({
                    fieldId: 'custentity_date_lpo_program_interest',
                    value: getDateToday()
                });
                zeeRecord.setValue({
                    fieldId: 'custentity_vehicle_query_count',
                    value: vehicleQueryCount
                });
                zeeRecord.setValue({
                    fieldId: 'custentity_uniform_query_count',
                    value: uniformQueryCount
                });
                zeeRecord.setValue({
                    fieldId: 'custentity_digitise_run_query_count',
                    value: digitiseRunQueryCount
                });

                var zeeRecordId = zeeRecord.save({
                    ignoreMandatoryFields: true
                });

                redirect.toSuitelet({
                    scriptId: 'customscript_sl2_zee_scorecard',
                    deploymentId: 'customdeploy1',
                });
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
