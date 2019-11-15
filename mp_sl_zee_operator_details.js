var ctx = nlapiGetContext();

var zee = 0;
var role = ctx.getRole();

var mandatory = false;

if (role == 1000) {
    //Franchisee
    zee = ctx.getUser();
    mandatory = true;
} else if (role == 3) { //Administrator
    zee = 6; //test
} else { // System Support
    zee = 425904; //test-AR
}

var ctx = nlapiGetContext();

var baseURL = 'https://system.na2.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://system.sandbox.netsuite.com';
}



function main(request, response) {
    if (request.getMethod() == "GET") {

        var form = nlapiCreateForm('Franchise Management Console');

        var content = '';
        content += '<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&libraries=places"></script>';
        var fld = form.addField('mainfield', 'inlinehtml');
        fld.setDefaultValue(content);



        /**
         * Franchise Management Console Instructions
         **/
        var inlinehtml2 = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css"><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><button type="button" class="btn btn-sm btn-info instruction_button" data-toggle="collapse" data-target="#demo">Click for Instructions</button><div id="demo" style="background-color: rgba(236, 64, 122, 0.22) !important;border: 1px solid #e91e63;padding: 10px 10px 10px 20px;width:110%;font-size:12px" class="collapse"><b style="font-size:15px">About this Franchisee Management Console:</b><br/><br/>These tabs control the authorised use of your system information including access to the MailPlusGo application.<br/>It is in your interest to maintain the accuracy of this information at all times to ensure you are providing access to your system to authorised people <b style="color:red">ONLY</b>.<br/><br/><i><b>How to complete this form:</i></b><br/>This form has three tabs: <i style="color:grey">(see Tabs with matching colours below)</i><ul><li style="color: white;background-color: #607799; width: 20%"><b>Add / Update Vehicle Details</b></li><li style="color: #00ff82;background-color: #607799;width: 20%"><b>Add / Update Operator Details</b></li><li style="color: #ffcc00;background-color: #607799; width: 20%"><b>Nominate AusPost Corporate PO</b></li></ul><br/>Once you have updated and completed the information on all three tabs - Click the <b style="color:blue">Save</b> button <i style="color:grey">(at the top or bottom left corner of the console)</i>.<br/><br/><br/><i style="color:red; background-color: #c1c1c1"><b>Note:</b> You will get an error message for any missing mandatory information (<b style="color:orange">*</b>) or incomplete tab update.</i><br/><br/><b style="font-size:15px;color:red">LAUNCH NOTE:</b><br/><b><u>ONLY</u></b> active users registered on this <b>Franchisee Management Console</b> will receive access and the link to the <b><i>MailPlusGo</i></b> application needed to make AP product sales and lodgement.<br/>You will not be able to access the <b><i>MailPlusGo</i></b> application or invoice for the enhanced AP products set if you do not complete the registration for yourself and any of your active operators.<br/><br/></div> <br/><br/>';

        // var fldZee = form.addField('franchisee', 'select', 'Franchisee', 'partner');

        if (role != 1000) {

            inlinehtml2 += '<div class="col-xs-4 admin_section" style="width: 100%;"><b>Select Zee</b> <select class="form-control zee_dropdown" >';

            //WS Edit: Updated Search to SMC Franchisee (exc Old/Inactives)
            //Search: SMC - Franchisees
            var searched_zee = nlapiLoadSearch('partner', 'customsearch_smc_franchisee');

            var resultSet_zee = searched_zee.runSearch();

            var count_zee = 0;

            var zee_id;

            inlinehtml2 += '<option value=""></option>'

            resultSet_zee.forEachResult(function(searchResult_zee) {
                zee_id = searchResult_zee.getValue('internalid');
                // WS Edit: Updated entityid to companyname
                zee_name = searchResult_zee.getValue('companyname');

                if (request.getParameter('zee') == zee_id) {
                    inlinehtml2 += '<option value="' + zee_id + '" selected="selected">' + zee_name + '</option>';
                } else {
                    inlinehtml2 += '<option value="' + zee_id + '">' + zee_name + '</option>';
                }

                return true;
            });

            inlinehtml2 += '</select></div>';
        }

        if (!isNullorEmpty(request.getParameter('zee'))) {
            zee = request.getParameter('zee');
        }

        form.addField('franchisee', 'text', 'Franchisee ID').setDisplayType('hidden').setDefaultValue(parseInt(zee));

        form.addField('custpage_html2', 'inlinehtml').setPadding(1).setLayoutType('outsideabove').setDefaultValue(inlinehtml2);

        // fldZee.setDefaultValue(zee);

        // fldZee.setDisplayType('disabled');
        // fldZee.setDisplayType('hidden');

        var zeeState = null;
        var recZee = nlapiLoadRecord('partner', zee);

        var location = recZee.getFieldValue('location');

        if (parseInt(location) == 1) {
            zeeState = 1;
        }
        if (parseInt(location) == 2) {
            zeeState = 2;
        }
        if (parseInt(location) == 3) {
            zeeState = 3;
        }
        if (parseInt(location) == 4) {
            zeeState = 4;
        }
        if (parseInt(location) == 5) {
            zeeState = 5;
        }
        if (parseInt(location) == 6) {
            zeeState = 6;
        }
        if (parseInt(location) == 7) {
            zeeState = 7;
        }
        if (parseInt(location) == 8) {
            zeeState = 8;
        }

        form.addTab('custpage_operators', 'Add / Update Operator Details');
        form.addTab('custpage_vehicle', 'Add / Update Fleet Details');
        form.addTab('custpage_nominatepo', 'Nominate AusPost Corporate PO');
        form.addTab('custpage_nominatetoll', 'Nominate TOLL DX Exchanges');


        /**
         *  Add / Update Vehicle Details
         */

        var vehinstructions = '<div style="background-color: #cfeefc !important;border: 1px solid #417ed9;padding: 10px 10px 10px 20px;">';
        vehinstructions += '<b style="font-size:13px">Instructions for this Fleet Form: </b>';
        vehinstructions += '<ul>';
        vehinstructions += '<li><b>!!!</b> For any vehicle entry which is duplicated in the list below, please set the Vehicle status to "<b>Duplicated</b>".</li>';
        vehinstructions += '<li><b>!!!</b> For any vehicle no longer active, please set the Vehicle Status to “<b>Decommissioned</b>”</li>';
        vehinstructions += '<li><b>!!!</b> If you have accidentally clicked a field in the empty form and you are getting error messages about missing fields, click "<u><b>Clear</b></u>" to reset the form.</li></ul></div>';

        form.addField('instructions0', 'inlinehtml', null, null, 'custpage_vehicle').setLayoutType('outsideabove').setPadding(1).setDefaultValue(vehinstructions);

        var opsSublist = form.addSubList('vehicles', 'editor', 'Vehicle Details', 'custpage_vehicle');
        opsSublist.addField('internalid', 'text', '').setDisplayType('hidden');
        opsSublist.addField('custrecord_vehicle_date_reviewed', 'date', 'Date Last Reviewed').setLayoutType('startrow').setDisplayType('disabled');
        opsSublist.addField('name', 'text', 'Registration Number').setLayoutType('startrow').setMandatory(mandatory);
        opsSublist.addField('custrecord_vehicle_make', 'text', 'Vehicle Make').setLayoutType('startrow').setMandatory(mandatory);
        opsSublist.addField('custrecord_vehicle_model_text', 'text', 'Vehicle Model').setLayoutType('midrow').setMandatory(mandatory);
        opsSublist.addField('custrecord_vehicle_year', 'text', 'Year of Manufacture').setDisplaySize(40).setLayoutType('endrow').setMandatory(mandatory);
        opsSublist.addField('custrecord_vehicle_colour', 'text', 'Vehicle Colour').setDisplaySize(40).setMandatory(mandatory);
        opsSublist.addField('custrecord_vehicle_status', 'select', 'Vehicle Status', 'customlist_vehicle_status').setMandatory(mandatory);
        opsSublist.addField('custrecord_vehicle_owner', 'select', 'Vehicle Ownership', 'customlist_operator_role').setMandatory(mandatory);
        opsSublist.addField('custrecord_vehicle_signage', 'checkbox', 'Mailplus Signage on Vehicle');

        var columnsOps = [];
        columnsOps[columnsOps.length] = new nlobjSearchColumn('internalid');
        columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_vehicle_date_reviewed');
        columnsOps[columnsOps.length] = new nlobjSearchColumn('name');
        columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_vehicle_owner');
        columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_vehicle_model_text');
        columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_vehicle_make');
        columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_vehicle_year');
        columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_vehicle_colour');
        columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_vehicle_signage');
        columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_vehicle_status');


        var filterOps = [];
        filterOps[filterOps.length] = new nlobjSearchFilter('custrecord_vehicle_franchisee', null, 'anyof', zee);
        filterOps[filterOps.length] = new nlobjSearchFilter('custrecord_vehicle_status', null, 'noneof', [2, 3]); // none of Decommissioned and Duplicated

        var searchOps = nlapiSearchRecord('customrecord_vehicle', null, filterOps, columnsOps);

        opsSublist.setLineItemValues(searchOps);



        /**
         * Nominate Corporate PO
         */

        // Nominate Coporate PO Form Instructions
        var nominateinstructions = '<div style="background-color: #cfeefc !important;border: 1px solid #417ed9;padding: 10px 10px 10px 20px;"><br>Please nominate <u>up to 5</u> <b>Australia Post Corporate Post Outlets</b> (Corporate POs) from which you will collect the product supplies for the product orders placed by your customers. <br/>It is anticipated that you will be visiting the Corporate POs you have nominated more than once a day during your run.<br/>It is highly recommended that you nominate the Corporate POs that is the most accessible in your run.</div>';

        form.addField('instructions2', 'inlinehtml', null, null, 'custpage_nominatepo').setLayoutType('outsideabove').setPadding(1).setDefaultValue(nominateinstructions);

        //change to AP lodgement points

        var sublist = form.addSubList('postoffices', 'list', 'Nominate Corporate PO', 'custpage_nominatepo');
        sublist.addField('internalid', 'integer', 'Internal ID').setDisplayType('hidden');
        sublist.addField('custrecord_ap_lodgement_org_id', 'text', 'PO ID');
        sublist.addField('name', 'text', 'Name');
        sublist.addField('custrecord_ap_lodgement_unit_type_code', 'text', 'PO Type');
        sublist.addField('custrecord_ap_lodgement_addr1', 'text', 'Address 1');
        sublist.addField('custrecord_ap_lodgement_addr2', 'text', 'Address 2');
        sublist.addField('custrecord_ap_lodgement_postcode', 'text', 'Postcode');
        sublist.addField('custpage_nominate_po', 'checkbox', 'Nominate Corporate PO');

        /**
         * Initialise Nominate AusPost Corporate PO selection List
         **/

        var filters = [];
        filters[filters.length] = nlobjSearchFilter('custrecord_ap_lodgement_supply', null, 'is', 'T');
        var columns = [];
        columns[columns.length] = new nlobjSearchColumn('internalid');
        columns[columns.length] = new nlobjSearchColumn('name');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_org_id');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_unit_type_code');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_addr1');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_addr2');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_suburb');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_site_state');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_postcode').setSort();
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_supply');

        if (zeeState != null) {
            filters[filters.length] = new nlobjSearchFilter('custrecord_ap_lodgement_site_state', null, 'is', zeeState);
        }
        var searchResults = nlapiSearchRecord('customrecord_ap_lodgment_location', null, filters, columns);

        //Set previous nomination
        sublist.setLineItemValues(searchResults);

        /**
         * Operators Form
         **/

        // Operator Form Instructions
        var opsinstructions = '<div style="background-color: #cfeefc !important;border: 1px solid #417ed9;padding: 10px 10px 10px 20px;">';
        opsinstructions += '<b style="font-size:13px">Instructions for this Operators Form: </b>';
        opsinstructions += '<ul><li><b>!!!</b> If you or your Operator(s) is already listed on this page, please click into each of them to update their details and before clicking the "<u><b style="color:blue">Add/Edit</b></u>" button to save the changes.</li>';
        opsinstructions += '<li><b>!!!</b> For any operator entry who is duplicated in the list below, please set the Operator\'s status to "<b>Duplicated</b>".</li>';
        opsinstructions += '<li><b>!!!</b> For any operator no longer working with you and to remove all system access authorisation, please set the Operator\'s Status to “<b>No longer Employed</b>”</li>';
        opsinstructions += '<li><b>!!!</b> If you have accidentally clicked a field in the empty form and you are getting error messages about missing fields, click "<u><b>Clear</b></u>" to reset the form.</li></ul></div>';

        form.addField('instructions3', 'inlinehtml', null, null, 'custpage_operators').setLayoutType('outsideabove').setPadding(1).setDefaultValue(opsinstructions);

        var opsSublist = form.addSubList('operators', 'editor', 'Operators', 'custpage_operators');
        opsSublist.addField('internalid', 'text', '').setDisplayType('hidden');
        opsSublist.addField('preload', 'text', '').setDisplayType('hidden');
        opsSublist.addField('custrecord_operator_date_reviewed', 'date', 'Date Last Reviewed').setLayoutType('startrow', 'startcol').setDisplayType('disabled');
        opsSublist.addField('custrecord_operator_access_app', 'select', 'Access to Mobile App', 'customlist107_2').setLayoutType('startrow').setMandatory(mandatory);
        opsSublist.addField('custrecord_operator_salutation', 'select', 'Salutation', 'customlist22').setLayoutType('startrow').setMandatory(mandatory);
        opsSublist.addField('custrecord_operator_givennames', 'text', 'First Name').setLayoutType('startrow').setMandatory(mandatory);
        opsSublist.addField('custrecord_operator_surname', 'text', 'Surname').setLayoutType('endrow').setMandatory(mandatory);
        opsSublist.addField('custrecord_operator_phone', 'phone', 'Mobile Phone #').setDisplaySize(40).setLayoutType('startrow');
        opsSublist.addField('custrecord_operator_email', 'email', 'Email').setDisplaySize(40).setLayoutType('startrow');
        // opsSublist.addField('custrecord_operator_address', 'textarea', 'Residential Address').setLayoutType('startrow', 'startcol').setMandatory(mandatory);

        opsSublist.addField('custrecord_operator_address_ln1', 'text', 'Unit/Suite').setLayoutType('startrow', 'startcol').setDisplaySize(40);

        opsSublist.addField('custrecord_operator_address_ln2', 'text', 'Street No. & Name').setLayoutType('startrow').setDisplaySize(40).setMandatory(mandatory);
        opsSublist.addField('custrecord_operator_address_suburb', 'text', 'City').setLayoutType('startrow').setDisplaySize(20).setDisplayType('disabled');
        var fldState = opsSublist.addField('custrecord_operator_address_state', 'text', 'State').setLayoutType('midrow').setDisplayType('disabled').setDisplaySize(10);
        var fldState = opsSublist.addField('country', 'text', 'Country').setDisplayType('hidden');
        opsSublist.addField('custrecord_operator_address_postcode', 'text', 'Postcode').setLayoutType('endrow').setDisplaySize(10).setDisplayType('disabled');

        opsSublist.addField('custrecord_operator_mobdev_platform', 'select', 'Mobile Operating System', 'customlist_mobile_device_platforms').setLayoutType('endrow').setMandatory(mandatory);
        opsSublist.addField('custrecord_operator_phone_model', 'text', 'Mobile Device Model').setLayoutType('endrow').setMandatory(mandatory);


        opsSublist.addField('dontvalidate_add', 'checkbox', 'Dont Validate').setDisplayType('hidden');


        opsSublist.addField('custrecord_operator_employment', 'select', 'Employment Type', 'customlist_operator_employment').setLayoutType('startrow', 'startcol').setMandatory(mandatory);
        opsSublist.addField('custrecord_operator_role', 'select', 'Operator Role', 'customlist_operator_role').setLayoutType('startrow').setMandatory(mandatory);
        // opsSublist.addField('custrecord_operator_attend_pdt_launch', 'select', 'Attending AusPost Product Launch Nov 2016', 'customlist107_2').setLayoutType('startrow').setMandatory(mandatory);
        opsSublist.addField('custrecord_operator_access_product', 'select', 'Access to AusPost Mailplus Account', 'customlist107_2').setLayoutType('startrow').setMandatory(mandatory);
        // opsSublist.addField('custrecord_operator_access_app', 'select', 'Access to Mobile App', 'customlist107_2').setLayoutType('startrow').setMandatory(mandatory);
        opsSublist.addField('custrecord_operator_status', 'select', 'Status', 'customlist_operator_status').setLayoutType('startrow').setMandatory(mandatory);



        // Initialisation of Vehicle Selection on Operator

        // var filters = new Array();
        // filters[0] = new nlobjSearchFilter('custrecord_vehicle_franchisee', null, 'anyof', zee);
        //          filters[1] = new nlobjSearchFilter('custrecord_vehicle_status', null, 'noneof', [2, 3]); // none of Decommissioned and Duplicated

        //          var columns = new Array();
        // columns[0] = new nlobjSearchColumn('internalid');
        // columns[1] = new nlobjSearchColumn('name');

        // //columns[8] = new nlobjSearchColumn('custentitysubt');

        // var vehicleSearchResults = nlapiSearchRecord('customrecord_vehicle', null, filters, columns);

        //          var vechList = opsSublist.addField('custrecord_operator_rego_list', 'select', 'Vehicle Rego').setLayoutType('startrow');

        //          vechList.addSelectOption('', '');

        //          if (!isNullorEmpty(vehicleSearchResults)) {
        //           for(var x = 0; x < vehicleSearchResults.length; x++){
        //           	vechList.addSelectOption(vehicleSearchResults[x].getValue('internalid'), vehicleSearchResults[x].getValue('name'));
        //           }
        //          }

        /**
         * Operator Sublist Initialisation Search
         **/
        // opsSublist.addField('delete', 'checkbox', 'Inactive').setLayoutType('startrow');
        // 


        // var columnsOps = [];
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('internalid');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_date_reviewed');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_salutation');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_givennames');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_surname');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_phone');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_email');

        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_address_ln1');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_address_ln2');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_address_suburb');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_address_state');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_address_postcode');

        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_employment');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_role');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_attend_pdt_launch');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_access_product');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_access_app');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_status');

        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_mobdev_platform');
        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_phone_model');


        // columnsOps[columnsOps.length] = new nlobjSearchColumn('custrecord_operator_rego_list');


        // var filterOps = [];
        // filterOps[filterOps.length] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
        // filterOps[filterOps.length] = new nlobjSearchFilter('custrecord_operator_franchisee', null, 'anyof', zee);
        // filterOps[filterOps.length] = new nlobjSearchFilter('custrecord_operator_status', null, 'noneof', [3, 5]); // none of No Longer Employed and Duplicated

        // var searchOps = nlapiSearchRecord('customrecord_operator', null, filterOps, columnsOps);

        // opsSublist.setLineItemValues(searchOps);

        /**
         * Nominate TOLL DX Exchanges
         */

        var nominatetollinstructions = '<div style="background-color: #cfeefc !important;border: 1px solid #417ed9;padding: 10px 10px 10px 20px;"><b style="font-size:13px">Instructions for TOLL DX Exchanges: </b><br>Please nominate <u>up to 1 </u> <b>TOLL DX Exchanges</b> from which you will collect & lodge the product supplies for the product orders placed by your customers. <br/>It is anticipated that you will be visiting the Corporate POs you have nominated more than once a day during your run.<br/>It is highly recommended that you nominate the Corporate POs that is the most accessible in your run.</div>';

        form.addField('instructions4', 'inlinehtml', null, null, 'custpage_nominatetoll').setLayoutType('outsideabove').setPadding(1).setDefaultValue(nominatetollinstructions);

        //change to AP lodgement points

        var toll_pickup = form.addField('toll_pickup', 'select', 'TOLL Pick Up DX', null, 'custpage_nominatetoll');
        var toll_lodge = form.addField('toll_lodge', 'select', 'TOLL Lodgement DX', null, 'custpage_nominatetoll');

        var filterExpression = [];

        filterExpression = [

            ['custrecord_ap_lodgement_site_state', 'anyof', zeeState], 'and', ['custrecord_noncust_location_type', 'is', 2], 'and', ['isinactive', 'is', 'F']
        ];


        /**
         * Initialise Nominate AusPost Corporate PO selection List
         **/
        var columns = [];
        columns[columns.length] = new nlobjSearchColumn('internalid');
        columns[columns.length] = new nlobjSearchColumn('name');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_org_id');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_unit_type_code');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_addr1');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_addr2');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_suburb');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_site_state');
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_postcode').setSort();
        columns[columns.length] = new nlobjSearchColumn('custrecord_ap_lodgement_supply');


        var searchResults = nlapiSearchRecord('customrecord_ap_lodgment_location', null, filterExpression, columns);

        toll_pickup.addSelectOption('', '');

        for (i = 0; i < searchResults.length; i++) {
            toll_pickup.addSelectOption(searchResults[i].getValue('internalid'), searchResults[i].getValue('name'));
        }

        toll_lodge.addSelectOption('', '');

        for (i = 0; i < searchResults.length; i++) {
            toll_lodge.addSelectOption(searchResults[i].getValue('internalid'), searchResults[i].getValue('name'));
        }

        //Set previous nomination
        // sublist.setLineItemValues(searchResults);

        form.addSubmitButton();

        form.addButton('network_matrix', 'Create / Edit Network Matrix', 'onclick_networkMatrix()');

        form.setScript('customscript_cs_zee_operator_details');

        response.writePage(form);


    } else {

        var recZee = nlapiLoadRecord('partner', parseInt(request.getParameter('franchisee')));

        recZee.setFieldValue('custentity_ap_nominated_corp_po', '');
        recZee.setFieldValue('custentity_ap_nominated_corp_po_2', '');
        recZee.setFieldValue('custentity_ap_nominated_corp_po_3', '');
        recZee.setFieldValue('custentity_ap_nominated_corp_po_4', '');
        recZee.setFieldValue('custentity_ap_nominated_corp_po_5', '');

        // nlapiSubmitRecord(recZee);

        // var recZee2 = nlapiLoadRecord('partner', request.getParameter('franchisee'));

        var toll_pickup = request.getParameter('toll_pickup');
        var toll_lodge = request.getParameter('toll_lodge');

        nlapiLogExecution('DEBUG', 'toll_pickup', toll_pickup)

        var count = 1;
        // var lodgeDX = null;
        for (x = 1; x <= request.getLineItemCount('postoffices'); x++) {
            if (request.getLineItemValue('postoffices', 'custpage_nominate_po', x) == "T") {
                corpPO = request.getLineItemValue('postoffices', 'internalid', x);

                if (count == 1) {
                    nom_po_internal_id = 'custentity_ap_nominated_corp_po';
                    recZee.setFieldValue(nom_po_internal_id, corpPO);
                } else {
                    nom_po_internal_id = 'custentity_ap_nominated_corp_po_' + count;
                    recZee.setFieldValue(nom_po_internal_id, corpPO);
                }



                count = count + 1;
            }

        }
        recZee.setFieldValue('custentity_toll_lodge_dx_no', toll_lodge);
        recZee.setFieldValue('custentity__toll_pickup_dx_no', toll_pickup);
        nlapiSubmitRecord(recZee);

        nlapiSetRedirectURL('TASKLINK', 'CARD_-29');
    }
}