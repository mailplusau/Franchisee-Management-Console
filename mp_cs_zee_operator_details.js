var max_count = 0;

var ctx = nlapiGetContext();
var todayDate = new Date();
var ctxDate = ctx.getSetting('SCRIPT', 'custscript_invoicedate');
var tranDate = '';

var ctx = nlapiGetContext();

var zee = 0;
var role = ctx.getRole();

if (role == 1000) {
    //Franchisee
    zee = ctx.getUser();
} else if (role == 3) { //Administrator
    zee = 6; //test
} else { // System Support
    zee = 425904; //test-AR
}

if (!isNullorEmpty(ctx.getSetting('SCRIPT', 'custscript_invoicedate'))) {
    todayDate = ctx.getSetting('SCRIPT', 'custscript_invoicedate');
    tranDate = todayDate;
} else {
    // todayDate.setHours(todayDate.getHours() + 17);
    tranDate = nlapiDateToString(todayDate);
}

var baseURL = 'https://system.na2.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://system.sandbox.netsuite.com';
}

$(document).on('click', '.instruction_button', function(e) {

    $('.instruction_button').hide();
});

$(document).on("change", ".zee_dropdown", function(e) {

    var zee = $(this).val();

    var url = baseURL + "/app/site/hosting/scriptlet.nl?script=557&deploy=1";

    url += "&zee=" + zee + "";

    window.location.href = url;
});

function pageInit() {
    document.getElementById("custrecord_operator_address_ln2").onfocus = function() {
        initAutocomplete()
    };

    var recZee = nlapiLoadRecord('partner', parseInt(nlapiGetFieldValue('franchisee')));

    var toll_lodge = recZee.getFieldValue('custentity_toll_lodge_dx_no');
    // var toll_lodge_text = recZee.getFieldText('custentity_toll_lodge_dx_no');
    var toll_pickup = recZee.getFieldValue('custentity__toll_pickup_dx_no');
    // var toll_pickup_text = recZee.getFieldText('custentity__toll_pickup_dx_no');

    if (!isNullorEmpty(recZee.getFieldValue('custentity_ap_nominated_corp_po'))) {

        for (x = 1; x <= nlapiGetLineItemCount('postoffices'); x++) {

            if (nlapiGetLineItemValue('postoffices', 'internalid', x) == recZee.getFieldValue('custentity_ap_nominated_corp_po')) {

                max_count = max_count + 1;
                nlapiSetLineItemValue('postoffices', 'custpage_nominate_po', x, "T");
            } else if (nlapiGetLineItemValue('postoffices', 'internalid', x) == recZee.getFieldValue('custentity_ap_nominated_corp_po_2')) {

                max_count = max_count + 1;
                nlapiSetLineItemValue('postoffices', 'custpage_nominate_po', x, "T");
            } else if (nlapiGetLineItemValue('postoffices', 'internalid', x) == recZee.getFieldValue('custentity_ap_nominated_corp_po_3')) {
                max_count = max_count + 1;
                nlapiSetLineItemValue('postoffices', 'custpage_nominate_po', x, "T");
            } else if (nlapiGetLineItemValue('postoffices', 'internalid', x) == recZee.getFieldValue('custentity_ap_nominated_corp_po_4')) {
                max_count = max_count + 1;
                nlapiSetLineItemValue('postoffices', 'custpage_nominate_po', x, "T");
            } else if (nlapiGetLineItemValue('postoffices', 'internalid', x) == recZee.getFieldValue('custentity_ap_nominated_corp_po_5')) {
                max_count = max_count + 1;
                nlapiSetLineItemValue('postoffices', 'custpage_nominate_po', x, "T");
            }
        }
    }

    if (!isNullorEmpty(document.getElementById('custpage_operatorstxt'))) {
        document.getElementById('custpage_operatorstxt').style = 'color: #00ff82 !important';
    }

    if (!isNullorEmpty(document.getElementById('custpage_nominatepotxt'))) {
        document.getElementById('custpage_nominatepotxt').style = 'color: #ffcc00 !important';
    }

    nlapiSetFieldValue('toll_pickup', toll_pickup)
    nlapiSetFieldValue('toll_lodge', toll_lodge)

    var searched_operators = nlapiLoadSearch('customrecord_operator', 'customsearch_fmc_active_operators');

    var newFilters = new Array();
    newFilters[0] = new nlobjSearchFilter('custrecord_operator_franchisee', null, 'anyof', nlapiGetFieldValue('franchisee'));

    searched_operators.addFilters(newFilters);

    var resultSet = searched_operators.runSearch();

    var count = 1;

    resultSet.forEachResult(function(searchResult) {

        var operator_id = searchResult.getValue("internalid");
        var date_reviewed = searchResult.getValue("custrecord_operator_date_reviewed");
        var salutation = searchResult.getValue("custrecord_operator_salutation");
        var given_name = searchResult.getValue("custrecord_operator_givennames");
        var surname = searchResult.getValue("custrecord_operator_surname");
        var phone = searchResult.getValue("custrecord_operator_phone");
        var email = searchResult.getValue("custrecord_operator_email");
        var address1 = searchResult.getValue("custrecord_operator_address_ln1");
        var street_name = searchResult.getValue("custrecord_operator_address_ln2");
        var suburb = searchResult.getValue("custrecord_operator_address_suburb");
        var state = searchResult.getValue("custrecord_operator_address_state");
        var postcode = searchResult.getValue("custrecord_operator_address_postcode");
        var employment_type = searchResult.getValue("custrecord_operator_employment");
        var role = searchResult.getValue("custrecord_operator_role");
        var access_app = searchResult.getValue("custrecord_operator_access_app");
        var access_product = searchResult.getValue("custrecord_operator_access_product");
        var phone_model = searchResult.getValue("custrecord_operator_phone_model");
        var phone_os = searchResult.getValue("custrecord_operator_mobdev_platform");
        var operator_status = searchResult.getValue("custrecord_operator_status");

        nlapiSelectNewLineItem('operators');
        nlapiSetCurrentLineItemValue('operators', 'internalid', operator_id);
        nlapiSetCurrentLineItemValue('operators', 'preload', 'T');
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_date_reviewed', date_reviewed);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_salutation', salutation);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_givennames', given_name);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_surname', surname);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_phone', phone);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_email', email);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_address_ln1', address1);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_address_ln2', street_name);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_address_suburb', suburb);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_address_state', state);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_address_postcode', postcode);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_employment', employment_type);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_role', role);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_access_app', access_app);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_access_product', access_product);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_phone_model', phone_model);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_mobdev_platform', phone_os);
        nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_status', operator_status);
        nlapiCommitLineItem('operators');
        count++;

        return true;
    });



}

function onclick_networkMatrix() {

    var upload_url = baseURL + nlapiResolveURL('SUITELET', 'customscript_sl_network_map', 'customdeploy_network_map');
    window.open(upload_url, "_self", "height=750,width=650,modal=yes,alwaysRaised=yes");
}


function fieldChanged(type, name, linenum) {

    if (name == 'editaddress') {

        if (nlapiGetFieldValue(name) == "T") {
            nlapiDisableField(name, true);
            nlapiDisableField('addr1', false);
            nlapiDisableField('addr2', false);
            nlapiDisableField('city', false);
            nlapiDisableField('state', false);
            nlapiDisableField('zip', false);
        }

    }

    if (name == 'editpoaddress') {
        if (nlapiGetFieldValue(name) == 1) {

            nlapiDisableField('poaddr1', false);
            nlapiDisableField('pocity', false);
            nlapiDisableField('postate', false);
            nlapiDisableField('pozip', false);
        } else {
            nlapiDisableField('poaddr1', true);
            nlapiDisableField('pocity', true);
            nlapiDisableField('postate', true);
            nlapiDisableField('pozip', true);

        }
    }

    if (type == 'postoffices' && (name == 'custpage_nominate_po')) {
        if (nlapiGetLineItemValue(type, name, linenum) == "T") {
            if (max_count < 5) {
                max_count = max_count + 1;
            } else {
                alert('You can select a Max of only 5 AusPost Corporate Post Offices');
                nlapiSetLineItemValue(type, name, linenum, 'F');
                return false;
            }
        } else {
            max_count = max_count - 1;
        }

    }

    if (type == 'operators') {
        if (name == 'custrecord_operator_access_app') {
            if (nlapiGetCurrentLineItemValue('operators', name) == 1) {
                $('#custrecord_operator_phone').addClass('inputreq');
                $('#custrecord_operator_email').addClass('inputreq');

            }
        }
    }


}

function saveRecord() {

    var incOp = 0;

    for (x = 1; x <= nlapiGetLineItemCount('operators'); x++) {
        if (isNullorEmpty(nlapiGetLineItemValue('operators', 'custrecord_operator_access_product', x)) || isNullorEmpty(nlapiGetLineItemValue('operators', 'custrecord_operator_salutation', x)) || isNullorEmpty(nlapiGetLineItemValue('operators', 'custrecord_operator_employment', x))) {
            incOp = incOp + 1;
        }
    }

    if (incOp > 0) {
        if (role == 1000) {
            alert('Add/Update Operator Details:\n\nPlease verify and complete fields for ALL Operator(s) listed before proceeding.');
            return false;
        }
    }

    // var recZee = nlapiLoadRecord('partner', nlapiGetFieldValue('franchisee'));

    if (max_count == 0) {
        if (role == 1000) {
            alert('Nominate AusPost Corporate PO:\n\nPlease nominate a primary Corporate Post Office');
            return false;
        }
    }


    return true;
}

function validateLine(type) {
    if (role == 1000) {
        if (type == 'operators') {

            try {

                var opNotice = 'Operator Field Error: ';
                var australiaMobileFormat = /^(?:\+?61|0)4 ?(?:(?:[01] ?[0-9]|2 ?[0-57-9]|3 ?[1-9]|4 ?[7-9]|5 ?[018]) ?[0-9]|3 ?0 ?[0-5])(?: ?[0-9]){5}$/;
                var phone = nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_phone');

                //!(australiaMobileFormat.test(phone))

                if (phone.length != 10 && nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_access_app') == 1) {
                    alert(opNotice + '\n\nPlease enter a valid Australian mobile number \n- Without spaces or special characters.\n\nNote: Landline phone numbers are not accepted');
                    return false;
                }

                if (isNullorEmpty(nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_email')) && nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_access_app') == 1) {
                    alert(opNotice + '\n\nPlease enter a valid Email ID \n');
                    return false;
                }

                var searchResult = null;

                if ((!isNullorEmpty(phone) || !isNullorEmpty(nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_email'))) && isNullorEmpty(nlapiGetCurrentLineItemValue('operators', 'preload'))) {
                    var searchedOperators = nlapiLoadSearch('customrecord_operator', 'customsearch_app_operator_load');

                    var newFilters_operators = new Array();
                    newFilters_operators[newFilters_operators.length] = new nlobjSearchFilter('custrecord_operator_email', null, 'is', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_email'));
                    newFilters_operators[newFilters_operators.length] = new nlobjSearchFilter('custrecord_operator_phone', null, 'is', phone);

                    searchedOperators.addFilters(newFilters_operators);

                    var resultSet_operators = searchedOperators.runSearch();

                    searchResult = resultSet_operators.getResults(0, 1);

                }

                // alert(searchResult);

                if (!isNullorEmpty(searchResult) && searchResult.length > 0) {
                    alert(opNotice + '\n\nDuplicate Email ID or Mobile No.\nNote: Please enter unique email address and mobile number.');
                    return false;
                }



                var op_first = nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_givennames');
                var op_last = nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_surname');

                if (!isNullorEmpty(nlapiGetCurrentLineItemValue('operators', 'internalid'))) {
                    var recOp = nlapiLoadRecord('customrecord_operator', nlapiGetCurrentLineItemValue('operators', 'internalid'));

                } else {
                    var recOp = nlapiCreateRecord('customrecord_operator');
                }


                //recOp.setFieldValue('custrecord_operator_franchisee', nlapiGetFieldValue('franchisee'));
                recOp.setFieldValue('custrecord_operator_date_reviewed', tranDate);
                recOp.setFieldValue('custrecord_operator_salutation', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_salutation'));
                recOp.setFieldValue('custrecord_operator_givennames', op_first);
                recOp.setFieldValue('custrecord_operator_surname', op_last);
                recOp.setFieldValue('name', op_first + " " + op_last);
                recOp.setFieldValue('custrecord_operator_phone', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_phone'));
                recOp.setFieldValue('custrecord_operator_email', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_email'));

                recOp.setFieldValue('custrecord_operator_address_ln1', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_address_ln1'));
                recOp.setFieldValue('custrecord_operator_address_ln2', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_address_ln2'));
                recOp.setFieldValue('custrecord_operator_address_suburb', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_address_suburb'));
                recOp.setFieldValue('custrecord_operator_address_state', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_address_state'));
                recOp.setFieldValue('custrecord_operator_address_postcode', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_address_postcode'));

                recOp.setFieldValue('custrecord_operator_mobdev_platform', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_mobdev_platform'));
                recOp.setFieldValue('custrecord_operator_phone_model', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_phone_model'));


                recOp.setFieldValue('custrecord_operator_employment', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_employment'));
                recOp.setFieldValue('custrecord_operator_role', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_role'));
                // recOp.setFieldValue('custrecord_operator_rego_list', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_rego_list'));
                // 
                // 
                recOp.setFieldValue('custrecord_operator_status', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_status'));
                recOp.setFieldValue('custrecord_operator_access_product', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_access_product'));
                recOp.setFieldValue('custrecord_operator_app_status', 1);
                recOp.setFieldValue('custrecord_operator_access_app', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_access_app'));


                //If status is set to duplicate or No Longer Active, set access to app and products to No
                if (nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_status') == 3 || nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_status') == 5) {
                    recOp.setFieldValue('custrecord_operator_access_product', 2);
                    recOp.setFieldValue('custrecord_operator_access_app', 2);
                }

                // recOp.setFieldValue('custrecord_operator_attend_pdt_launch', nlapiGetCurrentLineItemValue('operators', 'custrecord_operator_attend_pdt_launch'));

                // if (request.getLineItemValue('operators', 'delete', x) == 'T') {
                //     recOp.setFieldValue('isinactive', 'T');
                // }

                nlapiSubmitRecord(recOp);

            } catch (e) {
                if (e instanceof nlobjError) {
                    alert(e.getDetails());
                    return false;
                }

            }
        }

        if (type == 'vehicles') {

            try {

                var rego = nlapiGetCurrentLineItemValue('vehicles', 'name');

                rego = rego.replace(/ /g, '');

                rego = rego.toUpperCase();

                if (!isNullorEmpty(nlapiGetCurrentLineItemValue('vehicles', 'internalid'))) {
                    var vecOp = nlapiLoadRecord('customrecord_vehicle', nlapiGetCurrentLineItemValue('vehicles', 'internalid'));

                } else {
                    var vecOp = nlapiCreateRecord('customrecord_vehicle');
                }

                //vecOp.setFieldValue('custrecord_vehicle_franchisee', nlapiGetFieldValue('franchisee'));
                vecOp.setFieldValue('custrecord_vehicle_date_reviewed', tranDate);
                vecOp.setFieldValue('name', rego);
                vecOp.setFieldValue('custrecord_vehicle_owner', nlapiGetCurrentLineItemValue('vehicles', 'custrecord_vehicle_owner'));
                vecOp.setFieldValue('custrecord_vehicle_make', nlapiGetCurrentLineItemValue('vehicles', 'custrecord_vehicle_make'));
                vecOp.setFieldValue('custrecord_vehicle_model_text', nlapiGetCurrentLineItemValue('vehicles', 'custrecord_vehicle_model_text'));
                vecOp.setFieldValue('custrecord_vehicle_signage', nlapiGetCurrentLineItemValue('vehicles', 'custrecord_vehicle_signage'));
                vecOp.setFieldValue('custrecord_vehicle_year', nlapiGetCurrentLineItemValue('vehicles', 'custrecord_vehicle_year'));
                vecOp.setFieldValue('custrecord_vehicle_colour', nlapiGetCurrentLineItemValue('vehicles', 'custrecord_vehicle_colour'));
                vecOp.setFieldValue('custrecord_vehicle_status', nlapiGetCurrentLineItemValue('vehicles', 'custrecord_vehicle_status'));

                nlapiSubmitRecord(vecOp);
            } catch (e) {
                if (e instanceof nlobjError) {
                    alert(e.getDetails());
                    return false;
                }

            }

        }
    }

    return true;
}

function validateDelete(type) {
    if (type == 'operators') {
        if (role == 1000) {
            alert('Operator Removal Error: \n\nPlease note that you cannot remove Operators by clicking the "Remove" button.\nInstead, to delete duplicated or inactive entries on the list, please select the appropriate "Status" - "No Longer Employed" or "Duplicated".');
            return false;
        }
    }
}

function validateField(type, field) {

    if (field == 'mobile') {

        if (!isNullorEmpty(nlapiGetFieldValue(field))) {

            //Regex of Phone number field
            var val = nlapiGetFieldValue(field);
            var digits = val.replace(/[^0-9]/g, '');
            var australiaPhoneFormat = /^\(?(?:\+?61|0)(?:(?:2\)?[ -]?(?:3[ -]?[38]|[46-9][ -]?[0-9]|5[ -]?[0-35-9])|3\)?(?:4[ -]?[0-57-9]|[57-9][ -]?[0-9]|6[ -]?[1-67])|7\)?[ -]?(?:[2-4][ -]?[0-9]|5[ -]?[2-7]|7[ -]?6)|8\)?[ -]?(?:5[ -]?[1-4]|6[ -]?[0-8]|[7-9][ -]?[0-9]))(?:[ -]?[0-9]){6}|4\)?[ -]?(?:(?:[01][ -]?[0-9]|2[ -]?[0-57-9]|3[ -]?[1-9]|4[ -]?[7-9]|5[ -]?[018])[ -]?[0-9]|3[ -]?0[ -]?[0-5])(?:[ -]?[0-9]){5})$/;
            var australiaMobileFormat = /^(?:\+?61|0)4 ?(?:(?:[01] ?[0-9]|2 ?[0-57-9]|3 ?[1-9]|4 ?[7-9]|5 ?[018]) ?[0-9]|3 ?0 ?[0-5])(?: ?[0-9]){5}$/;
            var phoneFirst6 = digits.substring(0, 6);

            //Check if all phone characters are numerals
            if (val != digits) {
                alert('Error: Phone numbers should contain numbers only.\nPlease re-enter the phone number without spaces or special characters.');
                return false;
            } else if (digits.length != 10) {
                //Check if phone is not blank, need to contains 10 digits
                alert('Error: Please enter a 10 digit phone number with area code.');
                return false;
            } else if (!(australiaMobileFormat.test(digits))) {
                //Check if valid Australian phone numbers have been entered
                //alert('Error: Please enter a valid Australian Mobile number.\n\nNote: landline numbers are not accepted');
                //return false;
            }
        }
    }

    if (field == 'abn') {
        var abn = nlapiGetFieldValue(field);
        if (abn.length != 11) {
            alert('Error: ABN should only contain numbers.\nPlease re-enter the ABN without spaces or special characters.');
            return false;
        }
        CheckABN((nlapiGetFieldValue(field)));
    }

    return true;
}


function CheckABN(abn) {
    weights = new Array(10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19);

    ABN = (abn.charAt(0) - 1) + abn.substr(1, 10);

    if (abn.length != 11) {
        alert("Error: the Australian Business Number should contain exactly 11 characters !\nPlease remove any spaces.")
        return false;
    }

    total = 0;

    for (i = 0; i < 11; i++) {
        total += weights[i] * ABN.charAt(i);
    }

    if (total == 0 || total % 89 != 0) {
        alert("Error: the ABN " + abn + " is invalid !");
        return false;
    } else {
        return true;
    }

}

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical location types.
    var options = {
        types: ['geocode'],
        componentRestrictions: {
            country: 'au'
        }
    }

    autocomplete = new google.maps.places.Autocomplete((document.getElementById('custrecord_operator_address_ln2')), options);

    // When the user selects an address from the dropdown, populate the address fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}


//Fill the Street No. & Street Name after selecting an address from the dropdown
function fillInAddress() {

    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    // Enable the following fields once the address is selected from the dropdown. 
    // document.getElementById('city').removeAttribute('disabled');
    // document.getElementById('state').removeAttribute('disabled');
    // document.getElementById('zipcode').removeAttribute('disabled');

    // Get each component of the address from the place details and fill the corresponding field on the form.
    var addressComponent = "";

    for (var i = 0; i < place.address_components.length; i++) {

        if (place.address_components[i].types[0] == 'street_number' || place.address_components[i].types[0] == 'route') {
            addressComponent += place.address_components[i]['short_name'] + " ";
            nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_address_ln2', addressComponent);
        }
        if (place.address_components[i].types[0] == 'postal_code') {
            nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_address_postcode', place.address_components[i]['short_name']);
        }
        if (place.address_components[i].types[0] == 'administrative_area_level_1') {
            nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_address_state', place.address_components[i]['short_name']);
        }
        if (place.address_components[i].types[0] == 'locality') {
            nlapiSetCurrentLineItemValue('operators', 'custrecord_operator_address_suburb', place.address_components[i]['short_name']);
        }

    }
}