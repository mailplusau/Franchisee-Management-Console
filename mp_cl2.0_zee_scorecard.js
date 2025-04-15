/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-09-21T09:19:38+10:00
 * @Filename: mp_cl2.0_customer_benchmark.js
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-01-20T11:54:13+11:00
 */

define([
	"N/email",
	"N/runtime",
	"N/search",
	"N/record",
	"N/http",
	"N/log",
	"N/error",
	"N/url",
	"N/format",
	"N/currentRecord",
	"N/portlet",
], function (
	email,
	runtime,
	search,
	record,
	http,
	log,
	error,
	url,
	format,
	currentRecord,
	portlet
) {
	var zee = 0;
	var cust_id = 0;
	var role = 0;

	var baseURL = "https://1048144.app.netsuite.com";
	if (runtime.EnvType == "SANDBOX") {
		baseURL = "https://1048144-sb3.app.netsuite.com";
	}

	role = runtime.getCurrentUser().role;
	var userName = runtime.getCurrentUser().name;
	var userId = runtime.getCurrentUser().id;
	var zeeLocation = runtime.getCurrentUser().location;
	var zeeState = null;
	var sales_rep_email = null;
	var sales_rep_name = "";
	var currRec = currentRecord.get();

	var total_months = 14;

	var today = new Date();
	var today_day_in_month = today.getDate();
	var today_day_in_week = today.getDay();
	var today_month = today.getMonth() + 1;
	var today_year = today.getFullYear();

	if (today_day_in_month < 10) {
		today_day_in_month = "0" + today_day_in_month;
	}

	if (today_month < 10) {
		today_month = "0" + today_month;
	}

	var todayString = today_day_in_month + "/" + today_month + "/" + today_year;
	// console.log('Todays Date: ' + todayString);

	var current_year_month = today_year + "-" + today_month;
	// console.log('Current Year-Month: ' + current_year_month);

	var difference_months = total_months - parseInt(today_month);

	if (role == 1000) {
		zee = runtime.getCurrentUser().id;
	} else {
		zee = 1645493;
	}

	function isWeekday(year, month, day) {
		var day = new Date(year, month, day).getDay();
		return day != 0 && day != 6;
	}

	function getWeekdaysInMonth(month, year) {
		var days = daysInMonth(month, year);
		var weekdays = 0;
		for (var i = 0; i < days; i++) {
			if (isWeekday(year, month, i + 1)) weekdays++;
		}
		return weekdays;
	}

	function daysInMonth(iMonth, iYear) {
		return 32 - new Date(iYear, iMonth, 32).getDate();
	}

	function afterSubmit() {
		$(".loading_section").addClass("hide");
		$(".instruction_div").removeClass("hide");
		$(".mp_roadmap").removeClass("hide");
		$(".pud_prospect_support").removeClass("hide");
		$(".essential_success").removeClass("hide");
	}

	function setZeeStateAndSalesRepEmail() {
		switch (zeeLocation) {
			case 1:
				zeeState = "NSW";
				sales_rep_email = "kerina.helliwell@mailplus.com.au";
				sales_rep_name = "Kerina";
				break;
			case 2:
				zeeState = "QLD";
				sales_rep_email = "lee.russell@mailplus.com.au";
				sales_rep_name = "Lee";
				break;
			case 3:
				zeeState = "VIC";
				sales_rep_email = "belinda.urbani@mailplus.com.au";
				sales_rep_name = "Belinda";
				break;
			case 4:
				zeeState = "SA";
				sales_rep_email = "belinda.urbani@mailplus.com.au";
				sales_rep_name = "Belinda";
				break;
			case 5:
				zeeState = "TAS";
				sales_rep_email = "belinda.urbani@mailplus.com.au";
				sales_rep_name = "Belinda";
				break;
			case 6:
				zeeState = "ACT";
				sales_rep_email = "kerina.helliwell@mailplus.com.au";
				sales_rep_name = "Kerina";
				break;
			case 7:
				zeeState = "WA";
				sales_rep_email = "lee.russell@mailplus.com.au";
				sales_rep_name = "Lee";
				break;
			case 8:
				zeeState = "NT";
				sales_rep_email = "lee.russell@mailplus.com.au";
				sales_rep_name = "Lee";
				break;

			default:
				break;
		}
	}

	function pageInit() {
		$("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
		$("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
		$("#body").css("background-color", "#CFE0CE");

		$("#tbl_submitter").css("display", "none");

		setZeeStateAndSalesRepEmail();

		// portlet.resize();
		afterSubmit();

		var val1 = currentRecord.get();
		var totalItems = val1.getValue({
			fieldId: "custpage_total_items",
		});
		var completedItems = val1.getValue({
			fieldId: "custpage_completed_items",
		});

		console.log(totalItems);
		console.log(completedItems);

		//On click of close icon in the modal
		$(".close").click(function () {
			$("#myModal").hide();
		});

		$("#prospecting_masterclass").click(function () {
			var salesLeadQueryCount = val1.getValue({
				fieldId: "custpage_sales_lead_query_count",
			});

			val1.setValue({
				fieldId: "custpage_sales_lead_query_count",
				value: parseInt(salesLeadQueryCount) + 1,
			});

			$("#myModal").show();

			$("#myModal .modal-body").text(
				sales_rep_name +
					" has received your notification that you want to book a training session and will contact you directly with the next steps."
			);

			var emailBody =
				"Hi Team, \n \nBelow franchisee is enquiring about the Prospecting Masterclass.\n Franchisee Name: " +
				userName;

			email.send({
				author: 112209,
				body: emailBody,
				recipients: sales_rep_email,
				subject: "Prospecting Masterclass Enquire - " + userName,
				cc: ["luke.forbes@mailplus.com.au"],
				relatedRecords: { entityId: userId },
			});

			document.getElementById("submitter").click();
		});

		$("#complete_module").click(function () {
			var url =
				"https://1048144.app.netsuite.com/core/media/media.nl?id=6699161&c=1048144&h=OS-O_tP1tmSA6eIJ_ocVHSGDDKrBb3yf5xkBnDwkYpYTOkh3&_xt=.pdf";

			window.open(
				url,
				"_blank" // <- This is what makes it open in a new window.
			);

			val1.setValue({
				fieldId: "custpage_completed_module",
				value: 1,
			});

			document.getElementById("submitter").click();
		});

		$("#lodgement_locations").click(function () {
			var hubLodgementQueryCount = val1.getValue({
				fieldId: "custpage_hub_lodgement_query_count",
			});

			val1.setValue({
				fieldId: "custpage_hub_lodgement_query_count",
				value: parseInt(hubLodgementQueryCount) + 1,
			});

			$("#myModal").show();

			$("#myModal .modal-body").text(
				"Fiona has received a notification that you want to improve your scorecard. They will reach out to you with the next steps directly."
			);

			var emailBody =
				"Hi Team, \n \nBelow franchisee is enquiring about selecting Lodgement Locations.\n Franchisee Name: " +
				userName;

			email.send({
				author: 112209,
				body: emailBody,
				recipients: "fiona.harrison@mailplus.com.au",
				subject: "Activating Hub Lodgement - " + userName,
				cc: ["popie.popie@mailplus.com.au", "ankith.ravindran@mailplus.com.au"],
				relatedRecords: { entityId: userId },
			});

			document.getElementById("submitter").click();
		});

		$("#customer_reviews").click(function () {
			$("#myModal").show();

			$("#myModal .modal-body").text(
				"Alexandra has received a notification that you want to improve your scorecard. They will reach out to you with the next steps directly."
			);

			var emailBody =
				"Hi Team, \n \nBelow franchisee is enquiring about customer reviews.\n Franchisee Name: " +
				userName;

			email.send({
				author: 112209,
				body: emailBody,
				recipients: "alexandra.bathman@mailplus.com.au",
				subject: "Customer Reviews Enquiry - " + userName,
				cc: ["luke.forbes@mailplus.com.au"],
				relatedRecords: { entityId: userId },
			});
		});

		$("#sendle_suburb_mapping").click(function () {
			var suburbMappingQueryCount = val1.getValue({
				fieldId: "custpage_suburb_mapping_query_count",
			});

			val1.setValue({
				fieldId: "custpage_suburb_mapping_query_count",
				value: parseInt(suburbMappingQueryCount) + 1,
			});

			$("#myModal").show();

			$("#myModal .modal-body").text(
				"Fiona has received a notification that you want to improve your scorecard. They will reach out to you with the next steps directly."
			);

			var emailBody =
				"Hi Team, \n \nBelow franchisee is enquiring about Sendle Suburb Mapping.\n Franchisee Name: " +
				userName;

			email.send({
				author: 112209,
				body: emailBody,
				recipients: "fiona.harrison@mailplus.com.au",
				subject: "Sendle Suburb Mapping Enquiry - " + userName,
				cc: ["popie.popie@mailplus.com.au", "ankith.ravindran@mailplus.com.au"],
				relatedRecords: { entityId: userId },
			});

			document.getElementById("submitter").click();
		});

		$("#shippit_suburb_mapping").click(function () {
			$("#myModal").show();

			$("#myModal .modal-body").text(
				"Fiona has received a notification that you want to improve your scorecard. They will reach out to you with the next steps directly."
			);

			var emailBody =
				"Hi Team, \n \nBelow franchisee is enquiring about Shippit Suburb Mapping.\n Franchisee Name: " +
				userName;

			email.send({
				author: 112209,
				body: emailBody,
				recipients: "fiona.harrison@mailplus.com.au",
				subject: "Shippit Suburb Mapping Enquiry - " + userName,
				cc: ["popie.popie@mailplus.com.au", "ankith.ravindran@mailplus.com.au"],
				relatedRecords: { entityId: userId },
			});
		});

		$("#ap_suburb_mapping").click(function () {
			$("#myModal").show();

			$("#myModal .modal-body").text(
				"Fiona has received a notification that you want to improve your scorecard. They will reach out to you with the next steps directly."
			);

			var emailBody =
				"Hi Team, \n \nBelow franchisee is enquiring about Australia Post Suburb Mapping.\n Franchisee Name: " +
				userName;

			email.send({
				author: 112209,
				body: emailBody,
				recipients: "fiona.harrison@mailplus.com.au",
				subject: "Australia Post Suburb Mapping Enquiry - " + userName,
				cc: ["popie.popie@mailplus.com.au", "ankith.ravindran@mailplus.com.au"],
				relatedRecords: { entityId: userId },
			});
		});

		$("#app_training").click(function () {
			$("#myModal").show();

			$("#myModal .modal-body").text(
				"Fiona has received a notification that you want to improve your scorecard. They will reach out to you with the next steps directly."
			);

			var emailBody =
				"Hi Team, \n \nBelow franchisee is enquiring about MailPlus Operator App Training.\n Franchisee Name: " +
				userName;

			email.send({
				author: 112209,
				body: emailBody,
				recipients: "fiona.harrison@mailplus.com.au",
				subject: "Operator App Training Enquiry - " + userName,
				cc: ["popie.popie@mailplus.com.au", "ankith.ravindran@mailplus.com.au"],
				relatedRecords: { entityId: userId },
			});
		});

		$("#lpo_project_register").click(function () {
			var lpoProjectQueryCount = val1.getValue({
				fieldId: "custpage_lpo_project_query_count",
			});

			val1.setValue({
				fieldId: "custpage_lpo_project_query_count",
				value: parseInt(lpoProjectQueryCount) + 1,
			});
			val1.setValue({
				fieldId: "custpage_lpo_project_query_date",
				value: getDate(),
			});

			$("#myModal").show();

			$("#myModal .modal-body").text(
				sales_rep_name +
					" has received a notification that you want to improve your scorecard. They will reach out to you with the next steps directly."
			);

			var emailBody =
				"Hi Team, \n \nBelow franchisee is enquiring about LPO Project.\n Franchisee Name: " +
				userName;

			email.send({
				author: 112209,
				body: emailBody,
				recipients: sales_rep_email,
				subject: "LPO Project Enquiry - " + userName,
				cc: ["luke.forbes@mailplus.com.au", "michael.mcdaid@mailplus.com.au"],
				relatedRecords: { entityId: userId },
			});

			document.getElementById("submitter").click();
		});

		$("#uniform").click(function () {
			var uniformQueryCount = val1.getValue({
				fieldId: "custpage_uniform_query_count",
			});

			val1.setValue({
				fieldId: "custpage_uniform_query_count",
				value: parseInt(uniformQueryCount) + 1,
			});

			$("#myModal").show();

			$("#myModal .modal-body").text(
				"Michael has received a notification that you want to improve your scorecard. They will reach out to you with the next steps directly."
			);

			var emailBody =
				"Hi Team, \n \nBelow franchisee is enquiring about placing an order for Compliant Uniform.\n Franchisee Name: " +
				userName;

			email.send({
				author: 112209,
				body: emailBody,
				recipients: "michael.mcdaid@mailplus.com.au",
				subject: "Compliant Uniform Enquiry - " + userName,
				cc: ["greg.hart@mailplus.com.au"],
				relatedRecords: { entityId: userId },
			});

			document.getElementById("submitter").click();
		});

		$("#vehicle").click(function () {
			var vehicleQueryCount = val1.getValue({
				fieldId: "custpage_vehicle_query_count",
			});

			val1.setValue({
				fieldId: "custpage_vehicle_query_count",
				value: parseInt(vehicleQueryCount) + 1,
			});

			$("#myModal").show();

			$("#myModal .modal-body").text(
				"Michael has received a notification that you want to improve your scorecard. They will reach out to you with the next steps directly."
			);

			var emailBody =
				"Hi Team, \n \nBelow franchisee is enquiring about Approved Vehicle & Signage.\n Franchisee Name: " +
				userName;

			email.send({
				author: 112209,
				body: emailBody,
				recipients: "michael.mcdaid@mailplus.com.au",
				subject: "Approved Vehicle & Signage Enquiry - " + userName,
				cc: ["greg.hart@mailplus.com.au"],
				relatedRecords: { entityId: userId },
			});

			document.getElementById("submitter").click();
		});

		$("#digitise_run").click(function () {
			var digitiseRunQueryCount = val1.getValue({
				fieldId: "custpage_digitise_run_query_count",
			});

			val1.setValue({
				fieldId: "custpage_digitise_run_query_count",
				value: parseInt(digitiseRunQueryCount) + 1,
			});

			$("#myModal").show();

			$("#myModal .modal-body").text(
				"Popie has received a notification that you want to improve your scorecard. They will reach out to you with the next steps directly."
			);

			var emailBody =
				"Hi Team, \n \nBelow franchisee is enquiring about Digitising their run.\n Franchisee Name: " +
				userName;

			email.send({
				author: 112209,
				body: emailBody,
				recipients: "popie.popie@mailplus.com.au",
				subject: "Run Digitalisation Enquiry - " + userName,
				cc: [
					"fiona.harrison@mailplus.com.au",
					"ankith.ravindran@mailplus.com.au",
				],
				relatedRecords: { entityId: userId },
			});

			document.getElementById("submitter").click();
		});

		// portlet.resize();
	}

	function saveRecord() {
		return true;
	}

	function pad(s) {
		return s < 10 ? "0" + s : s;
	}

	function formatDate(testDate) {
		console.log("testDate: " + testDate);
		var responseDate = format.format({
			value: testDate,
			type: format.Type.DATE,
		});
		console.log("responseDate: " + responseDate);
		return responseDate;
	}

	function replaceAll(string) {
		return string.split("/").join("-");
	}

	function selectDate() {
		var period_selected = $("#period_dropdown option:selected").val();
		var today = new Date();
		var today_day_in_month = today.getDate();
		var today_day_in_week = today.getDay();
		var today_month = today.getMonth();
		var today_year = today.getFullYear();

		var today_date = new Date(
			Date.UTC(today_year, today_month, today_day_in_month)
		);

		switch (period_selected) {
			case "this_week":
				// This method changes the variable "today" and sets it on the previous monday
				if (today_day_in_week == 0) {
					var monday = new Date(
						Date.UTC(today_year, today_month, today_day_in_month - 6)
					);
				} else {
					var monday = new Date(
						Date.UTC(
							today_year,
							today_month,
							today_day_in_month - today_day_in_week + 1
						)
					);
				}
				var date_from = monday.toISOString().split("T")[0];
				var date_to = today_date.toISOString().split("T")[0];
				break;

			case "last_week":
				var today_day_in_month = today.getDate();
				var today_day_in_week = today.getDay();
				// This method changes the variable "today" and sets it on the previous monday
				if (today_day_in_week == 0) {
					var previous_sunday = new Date(
						Date.UTC(today_year, today_month, today_day_in_month - 7)
					);
				} else {
					var previous_sunday = new Date(
						Date.UTC(
							today_year,
							today_month,
							today_day_in_month - today_day_in_week
						)
					);
				}

				var previous_sunday_year = previous_sunday.getFullYear();
				var previous_sunday_month = previous_sunday.getMonth();
				var previous_sunday_day_in_month = previous_sunday.getDate();

				var monday_before_sunday = new Date(
					Date.UTC(
						previous_sunday_year,
						previous_sunday_month,
						previous_sunday_day_in_month - 6
					)
				);

				var date_from = monday_before_sunday.toISOString().split("T")[0];
				var date_to = previous_sunday.toISOString().split("T")[0];
				break;

			case "this_month":
				var first_day_month = new Date(Date.UTC(today_year, today_month));
				var date_from = first_day_month.toISOString().split("T")[0];
				var date_to = today_date.toISOString().split("T")[0];
				break;

			case "last_month":
				var first_day_previous_month = new Date(
					Date.UTC(today_year, today_month - 1)
				);
				var last_day_previous_month = new Date(
					Date.UTC(today_year, today_month, 0)
				);
				var date_from = first_day_previous_month.toISOString().split("T")[0];
				var date_to = last_day_previous_month.toISOString().split("T")[0];
				break;

			case "full_year":
				var first_day_in_year = new Date(Date.UTC(today_year, 0));
				var date_from = first_day_in_year.toISOString().split("T")[0];
				var date_to = today_date.toISOString().split("T")[0];
				break;

			case "financial_year":
				if (today_month >= 6) {
					var first_july = new Date(Date.UTC(today_year, 6));
				} else {
					var first_july = new Date(Date.UTC(today_year - 1, 6));
				}
				var date_from = first_july.toISOString().split("T")[0];
				var date_to = today_date.toISOString().split("T")[0];
				break;

			default:
				var date_from = "";
				var date_to = "";
				break;
		}
		$("#date_from").val(date_from);
		$("#date_to").val(date_to);
	}

	function formatAMPM() {
		var date = new Date();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? "pm" : "am";
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? "0" + minutes : minutes;
		var strTime = hours + ":" + minutes + " " + ampm;
		return strTime;
	}
	/**
	 * @param   {Number} x
	 * @returns {String} The same number, formatted in Australian dollars.
	 */
	function financial(x) {
		if (typeof x == "string") {
			x = parseFloat(x);
		}
		if (isNullorEmpty(x) || isNaN(x)) {
			return "$0.00";
		} else {
			return x.toLocaleString("en-AU", {
				style: "currency",
				currency: "AUD",
			});
		}
	}
	/**
	 * Used to pass the values of `date_from` and `date_to` between the scripts and to Netsuite for the records and the search.
	 * @param   {String} date_iso       "2020-06-01"
	 * @returns {String} date_netsuite  "1/6/2020"
	 */
	function dateISOToNetsuite(date_iso) {
		var date_netsuite = "";
		if (!isNullorEmpty(date_iso)) {
			var date_utc = new Date(date_iso);
			// var date_netsuite = nlapiDateToString(date_utc);
			var date_netsuite = format.format({
				value: date_utc,
				type: format.Type.DATE,
			});
		}
		return date_netsuite;
	}
	/**
	 * [getDate description] - Get the current date
	 * @return {[String]} [description] - return the string date
	 */
	function getDate() {
		var date = new Date();
		date = format.format({
			value: date,
			type: format.Type.DATE,
			timezone: format.Timezone.AUSTRALIA_SYDNEY,
		});

		return date;
	}

	function isNullorEmpty(val) {
		if (val == "" || val == null) {
			return true;
		} else {
			return false;
		}
	}
	return {
		pageInit: pageInit,
		saveRecord: saveRecord,
	};
});
