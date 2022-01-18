/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-12-24T09:19:53+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-01-18T15:51:02+11:00
 */


define(['N/email', 'N/runtime', 'N/search', 'N/record', 'N/http', 'N/log',
    'N/error', 'N/url', 'N/format', 'N/currentRecord'
  ],
  function(email, runtime, search, record, http, log, error, url, format,
    currentRecord) {
    var zee = 0;
    var userId = 0;
    var role = 0;

    var baseURL = 'https://1048144.app.netsuite.com';
    if (runtime.EnvType == "SANDBOX") {
      baseURL = 'https://1048144-sb3.app.netsuite.com';
    }

    role = runtime.getCurrentUser().role;
    var userName = runtime.getCurrentUser().name;
    var userId = runtime.getCurrentUser().id;
    var currRec = currentRecord.get();

    var tollUploadSet = [];

    function pageLoad() {

      $('.loading_section').removeClass('hide');
    }

    function afterSubmit() {
      $(".se-pre-con").fadeOut("slow");


      if (!isNullorEmpty($('#result_zee_leads_list').val())) {
        $('#zee_leads_list_preview').removeClass('hide');
        $('#zee_leads_list_preview').show();
      }

      $('#result_zee_leads_list').on('change', function() {
        $('#zee_leads_list_preview').removeClass('hide');
        $('#zee_leads_list_preview').show();
      });

      $('#zee_leads_list_preview').removeClass('hide');
      $('#zee_leads_list_preview').show();
    }


    function pageInit() {

      $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
      $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
      $("#body").css("background-color", "#CFE0CE");

      zeeSalesLeadDataSet = [];
      zeeSalesLeadDataSetByState = [];
      zeeSalesLeadSet = [];
      zeeSalesLeadSetByState = [];

      // pageLoad();
      submitSearch();

      $(".viewZeeLead").click(function() {
          var dateFrom = $(this).attr("data-id");
          var url = baseURL +
            '/app/site/hosting/scriptlet.nl?script=1409&deploy=1&date_from=' + dateFrom
          window.location.href = url;

        })

      $(".lostZeeLead").click(function() {
          var zeeLeadInternalID = $(this).attr("data-id");
          $('.input-group').removeClass('input-group');
          $('.reason_input_group').addClass('input-group');
          console.log('inside modal')
          console.log(zeeLeadInternalID)
          $("#zeeleadid").val(zeeLeadInternalID);

          $("#myModal").show();

        })
        //On click of close icon in the modal
      $('.close').click(function() {
        location.reload();
      });
      //Update the customer record on click of the button in the modal
      $('#leadLost').click(function() {
        zeeleadid = $("#zeeleadid").val();

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeleadid
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_lost_reason',
          value: $("#lostReason").val()
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_stage',
          value: 3
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_lead_lost',
          value: getDateToday()
        });

        zeeSalesLeadRecord.save();

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1'
        window.location.href = url;
      });


      $(".qualifyZeeLead").click(function() {
        var zeeLeadInternalID = $(this).attr("data-id");

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeLeadInternalID
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_stage',
          value: 2
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_qualified_lead',
          value: getDateToday()
        });

        zeeSalesLeadRecord.save();

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1';
        window.location.href = url;

      });

      $(".opportunityZeeLead").click(function() {
        var zeeLeadInternalID = $(this).attr("data-id");

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeLeadInternalID
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_stage',
          value: 5
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_opportunity',
          value: getDateToday()
        });

        zeeSalesLeadRecord.save();

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1';
        window.location.href = url;

      });

      $(".deniedZeeLead").click(function() {
        var zeeLeadInternalID = $(this).attr("data-id");

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeLeadInternalID
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_stage',
          value: 6
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_opportunity_denied',
          value: getDateToday()
        });

        zeeSalesLeadRecord.save();

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1';
        window.location.href = url;

      });

      $(".noTerritoryZeeLead").click(function() {
        var zeeLeadInternalID = $(this).attr("data-id");

        var zeeSalesLeadRecord = record.load({
          type: 'customrecord_zee_sales_leads',
          id: zeeLeadInternalID
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_zee_lead_stage',
          value: 4
        });

        zeeSalesLeadRecord.setValue({
          fieldId: 'custrecord_date_qualified_no_territory',
          value: getDateToday()
        });

        zeeSalesLeadRecord.save();

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1';
        window.location.href = url;

      });

      $(".createLead").click(function() {
        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1411&deploy=1';
        window.location.href = url;

      });

      afterSubmit()
    }

    //Initialise the DataTable with headers.
    function submitSearch() {

      dataTable = $('#zee_leads_list_preview').DataTable({
        destroy: true,
        data: zeeSalesLeadDataSet,
        pageLength: 1000,
        order: [],
        columns: [{
          title: 'LINK'
        }, {
          title: 'Date Lead Entered - Week'
        }, {
          title: 'Investor/Manager - Lead Count'
        }, {
          title: 'Owner/Operaror - Lead Count'
        }, {
          title: 'Employment - Lead Count'
        }, {
          title: 'Total Lead Count'
        }],
        columnDefs: [{
          targets: [1, 5],
          className: 'bolded'
        }],
        rowCallback: function(row, data, index) {}
      });

      dataTable = $('#state_table').DataTable({
        destroy: true,
        data: zeeSalesLeadDataSetByState,
        pageLength: 1000,
        order: [],
        columns: [{
          title: 'LINK'
        }, {
          title: 'Date Lead Entered - Week'
        }, {
          title: 'ACT'
        }, {
          title: 'NSW'
        }, {
          title: 'SA'
        }, {
          title: 'QLD'
        }, {
          title: 'VIC'
        }, {
          title: 'WA'
        }, {
          title: 'TAS'
        }, {
          title: 'Total Lead Count'
        }],
        columnDefs: [{
          targets: [1, 9],
          className: 'bolded'
        }],
        rowCallback: function(row, data, index) {}
      });



      loadZeeSalesLeadSearch();

      console.log('Loaded Results');
      afterSubmit()

    }

    function loadZeeSalesLeadSearch() {

      var old_date = null;
      var total_count = 0;
      var count = 0;

      var investor = [];
      var investorCount = 0;
      var owner = [];
      var ownerCount = 0;
      var employment = [];
      var employmentCount = 0;

      //NetSuite Search: Franchisee Weekly Sales Leads - Website
      var searchZeeLeadsList = search.load({
        id: 'customsearch_zee_sales_lead_list_2',
        type: 'customrecord_zee_sales_leads'
      });

      searchZeeLeadsList.run().each(function(
        zeeLeadsListResultSet) {

        var leadCount = zeeLeadsListResultSet.getValue({
          name: 'internalid',
          summary: "COUNT"
        });
        var date = zeeLeadsListResultSet.getValue({
          name: "custrecord_zee_lead_date_entered",
          summary: "GROUP"
        });

        var type = zeeLeadsListResultSet.getText({
          name: "custrecord_type_of_owner",
          summary: "GROUP",
        });
        var typeId = zeeLeadsListResultSet.getValue({
          name: "custrecord_type_of_owner",
          summary: "GROUP",
        });

        if(old_date != null && old_date != date){
          zeeSalesLeadSet.push({
            leadCount: total_count,
            investorCount: investorCount,
            ownerCount: ownerCount,
            employmentCount: employmentCount,
            date: old_date
          });
          total_count = 0;
          investorCount = 0;
          ownerCount = 0;
          employmentCount = 0;

          if(typeId == 2){ // Investor/Manager
            investorCount = investorCount + leadCount
            total_count = total_count + parseInt(leadCount);
          } else if(typeId == 3){ // Owner/Operator
            ownerCount = ownerCount + leadCount
            total_count = total_count + parseInt(leadCount);
          } else if(typeId == 4){// Seeking Employment
            employmentCount = employmentCount + leadCount
            total_count = total_count + parseInt(leadCount);
          }
        } else {

          if(typeId == 2){ // Investor/Manager
            investorCount = investorCount + leadCount
            total_count = total_count + parseInt(leadCount);
          } else if(typeId == 3){ // Owner/Operator
            ownerCount = ownerCount + leadCount
            total_count = total_count + parseInt(leadCount);
          } else if(typeId == 4){// Seeking Employment
            employmentCount = employmentCount + leadCount
            total_count = total_count + parseInt(leadCount);
          }

        }

        old_date = date;
        count++;
        return true;
      });

      if(count > 0){
        zeeSalesLeadSet.push({
          leadCount: total_count,
          investorCount: investorCount,
          ownerCount: ownerCount,
          employmentCount: employmentCount,
          date: old_date
        });
      }
      console.log(zeeSalesLeadSet);

      var old_date2 = null;
      var total_count2 = 0;
      var count2 = 0;

      var nswCount = 0;
      var actCount = 0;
      var saCount = 0;
      var waCount = 0;
      var vicCount = 0;
      var qldCount = 0;
      var tasCount = 0;

      //NetSuite Search: Franchisee Weekly Sales Leads - Website (By State)
      var searchZeeLeadsList2 = search.load({
        id: 'customsearch_zee_sales_lead_list_2_2',
        type: 'customrecord_zee_sales_leads'
      });

      searchZeeLeadsList2.run().each(function(
        zeeLeadsListResultSet2) {

        var leadCount = parseInt(zeeLeadsListResultSet2.getValue({
          name: 'internalid',
          summary: "COUNT"
        }));
        var date = zeeLeadsListResultSet2.getValue({
          name: "custrecord_zee_lead_date_entered",
          summary: "GROUP"
        });

        var state = zeeLeadsListResultSet2.getText({
          name: "custrecord_areas_of_interest_state",
          summary: "GROUP",
        });


        if(old_date2 != null && old_date2 != date){
          zeeSalesLeadSetByState.push({
            date: old_date2,
            leadCount: total_count2,
            nswCount: nswCount,
            actCount: actCount,
            saCount: saCount,
            waCount: waCount,
            vicCount: vicCount,
            qldCount: qldCount,
            tasCount: tasCount
          });

          total_count2 = 0;
          nswCount = 0;
          actCount = 0;
          saCount = 0;
          waCount = 0;
          vicCount = 0;
          qldCount = 0;
          tasCount = 0;

          if(state == 'ACT'){
            actCount = actCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if(state == 'NSW'){
            nswCount = nswCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if(state == 'SA'){
            saCount = saCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          }else if(state == 'WA'){
            waCount = waCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          }else if(state == 'TAS'){
            tasCount = tasCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          }else if(state == 'QLD'){
            qldCount = qldCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          }else if(state == 'VIC'){
            vicCount = vicCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          }

        } else {

          if(state == 'ACT'){
            actCount = actCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if(state == 'NSW'){
            nswCount = nswCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if(state == 'SA'){
            saCount = saCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          }else if(state == 'WA'){
            waCount = waCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          }else if(state == 'TAS'){
            tasCount = tasCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          }else if(state == 'QLD'){
            qldCount = qldCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          }else if(state == 'VIC'){
            vicCount = vicCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          }

        }

        old_date2 = date;
        count2++;
        return true;
      });

      if(count2 > 0){
        zeeSalesLeadSetByState.push({
          date: old_date2,
          leadCount: total_count2,
          nswCount: nswCount,
          actCount: actCount,
          saCount: saCount,
          waCount: waCount,
          vicCount: vicCount,
          qldCount: qldCount,
          tasCount: tasCount
        });
      }
      console.log(zeeSalesLeadSetByState)

      loadDatatable(zeeSalesLeadSet, zeeSalesLeadSetByState);
      zeeSalesLeadSet = [];

    }

    function loadDatatable(zeeSalesLeads_rows, zeeSalesLeadSetByState_rows) {

      zeeSalesLeadDataSet = [];
      zeeSalesLeadDataSetByState = [];
      csvSet = [];

      var chartDataSet = [];

      if (!isNullorEmpty(zeeSalesLeads_rows)) {
        zeeSalesLeads_rows.forEach(function(zeeSalesLeads_row, index) {

          var linkURL =
            '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            zeeSalesLeads_row.date +
            '" class="viewZeeLead" style="cursor: pointer !important;color: white;">VIEW</a></button>';

          zeeSalesLeadDataSet.push([linkURL, zeeSalesLeads_row.date, parseInt(zeeSalesLeads_row.investorCount), parseInt(zeeSalesLeads_row.ownerCount), parseInt(zeeSalesLeads_row.employmentCount),
            zeeSalesLeads_row.leadCount
          ]);
        });
      }

      /*
      {
        title: 'ACT'
      }, {
        title: 'NSW'
      }, {
        title: 'SA'
      }, {
        title: 'QLD'
      }, {
        title: 'VIC'
      }, {
        title: 'WA'
      }, {
        title: 'TAS'
      }
       */

      if (!isNullorEmpty(zeeSalesLeadSetByState_rows)) {
        zeeSalesLeadSetByState_rows.forEach(function(zeeSalesLeadSetByState_row, index) {

          var linkURL =
            '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            zeeSalesLeadSetByState_row.date +
            '" class="viewZeeLead" style="cursor: pointer !important;color: white;">VIEW</a></button>';

          zeeSalesLeadDataSetByState.push([linkURL, zeeSalesLeadSetByState_row.date, parseInt(zeeSalesLeadSetByState_row.actCount), parseInt(zeeSalesLeadSetByState_row.nswCount), parseInt(zeeSalesLeadSetByState_row.saCount), parseInt(zeeSalesLeadSetByState_row.qldCount), parseInt(zeeSalesLeadSetByState_row.vicCount), parseInt(zeeSalesLeadSetByState_row.waCount), parseInt(zeeSalesLeadSetByState_row.tasCount),
            zeeSalesLeadSetByState_row.leadCount
          ]);
        });
      }


      var datatable = $('#zee_leads_list_preview').DataTable();
      datatable.clear();
      datatable.rows.add(zeeSalesLeadDataSet);
      datatable.draw();

      var datatable2 = $('#state_table').DataTable();
      datatable2.clear();
      datatable2.rows.add(zeeSalesLeadDataSetByState);
      datatable2.draw();

      var data = datatable.rows().data();
      var data2 = datatable2.rows().data();

      var week = [];
      var week2 = [];
      var leadCount = [];
      var leadCount2 = [];
      var investorCountArray = [];
      var ownerCountArray = [];
      var employmentCountArray = [];

      var actCountArray = [];
      var nswCountArray = [];
      var qldCountArray = [];
      var saCountArray = [];
      var tasCountArray = [];
      var vicCountArray = [];
      var waCountArray = [];

      for (var i = 0; i < data.length; i++) {
        week.push(data[i][1]);
        leadCount[data[i][1]] = data[i][5];
        investorCountArray[data[i][1]] = data[i][2];
        ownerCountArray[data[i][1]] = data[i][3];
        employmentCountArray[data[i][1]] = data[i][4];
      }

      /*
      {
        title: 'ACT'
      }, {
        title: 'NSW'
      }, {
        title: 'SA'
      }, {
        title: 'QLD'
      }, {
        title: 'VIC'
      }, {
        title: 'WA'
      }, {
        title: 'TAS'
      }
       */

      for (var i = 0; i < data2.length; i++) {
        week2.push(data2[i][1]);
        leadCount2[data2[i][1]] = data2[i][9];
        actCountArray[data2[i][1]] = data2[i][2];
        nswCountArray[data2[i][1]] = data2[i][3];
        saCountArray[data2[i][1]] = data2[i][4];
        qldCountArray[data2[i][1]] = data2[i][5];
        vicCountArray[data2[i][1]] = data2[i][6];
        waCountArray[data2[i][1]] = data2[i][7];
        tasCountArray[data2[i][1]] = data2[i][8];
      }

      var series_data = []; //creating empty array for highcharts series data
      var series_data2 = []; //creating empty array for highcharts series data
      var series_data3 = []; //creating empty array for highcharts series data
      var series_data4 = []; //creating empty array for highcharts series data
      var categores = []; //creating empty array for highcharts categories
      Object.keys(leadCount).map(function(item, key) {
        series_data.push(parseInt(leadCount[item]));
        series_data2.push(parseInt(investorCountArray[item]));
        series_data3.push(parseInt(ownerCountArray[item]));
        series_data4.push(parseInt(employmentCountArray[item]));
        categores.push(item)
      });


      var series_data_act = []; //creating empty array for highcharts series data
      var series_data_nsw = []; //creating empty array for highcharts series data
      var series_data_sa = []; //creating empty array for highcharts series data
      var series_data_qld = []; //creating empty array for highcharts series data
      var series_data_vic = []; //creating empty array for highcharts series data
      var series_data_wa = []; //creating empty array for highcharts series data
      var series_data_tas = []; //creating empty array for highcharts series data
      var categores2 = []; //creating empty array for highcharts categories
      Object.keys(leadCount2).map(function(item, key) {
        series_data_act.push(parseInt(actCountArray[item]));
        series_data_nsw.push(parseInt(nswCountArray[item]));
        series_data_sa.push(parseInt(saCountArray[item]));
        series_data_qld.push(parseInt(qldCountArray[item]));
        series_data_vic.push(parseInt(vicCountArray[item]));
        series_data_wa.push(parseInt(waCountArray[item]));
        series_data_tas.push(parseInt(tasCountArray[item]));

        categores2.push(item)
      });

      plotChart(series_data, categores, series_data2, series_data3, series_data4)
      plotChart2(series_data_act, series_data_nsw, series_data_sa, series_data_qld, series_data_vic, series_data_wa, series_data_tas, categores2)

      return true;
    }

    function plotChart(series_data, categores, series_data2, series_data3, series_data4) {
      // console.log(series_data)
      Highcharts.chart('container', {
						chart: {
              backgroundColor: '#CFE0CE',
							type: 'column'
						},
						xAxis: {
							categories: categores,
							crosshair: true,
							style: {
								fontWeight: 'bold',
							}
						},
						yAxis: {
							min: 0,
							title: {
								text: 'Total Lead Count'
							},
							stackLabels: {
								enabled: true,
								style: {
									fontWeight: 'bold'
								}
							}
						},
						tooltip: {
							headerFormat: '<b>{point.x}</b><br/>',
							pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
						},
						plotOptions: {
							column: {
								stacking: 'normal',
								dataLabels: {
									enabled: true
								}
							}
						},
        series: [{
							name: 'Investor/Manager',
							data: series_data2,
							style: {
								fontWeight: 'bold',
							}
						}, {
							name: 'Owner/Operator',
							data: series_data3,
							style: {
								fontWeight: 'bold',
							}
						}, {
							name: 'Seeking Employment',
							data: series_data4,
							style: {
								fontWeight: 'bold',
							}
						}]
      });
    }

    function plotChart2(series_data_act, series_data_nsw, series_data_sa, series_data_qld, series_data_vic, series_data_wa, series_data_tas, categores2) {
      // console.log(series_data)
      Highcharts.chart('container5', {
						chart: {
              backgroundColor: '#CFE0CE',
							type: 'column'
						},
						xAxis: {
							categories: categores2,
							crosshair: true,
							style: {
								fontWeight: 'bold',
							}
						},
						yAxis: {
							min: 0,
							title: {
								text: 'Total Lead Count'
							},
							stackLabels: {
								enabled: true,
								style: {
									fontWeight: 'bold'
								}
							}
						},
						tooltip: {
							headerFormat: '<b>{point.x}</b><br/>',
							pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
						},
						plotOptions: {
							column: {
								stacking: 'normal',
								dataLabels: {
									enabled: true
								}
							}
						},
        series: [{
							name: 'ACT',
							data: series_data_act,
							style: {
								fontWeight: 'bold',
							}
						}, {
							name: 'NSW',
							data: series_data_nsw,
							style: {
								fontWeight: 'bold',
							}
						}, {
							name: 'QLD',
							data: series_data_qld,
							style: {
								fontWeight: 'bold',
							}
						}, {
							name: 'SA',
							data: series_data_sa,
							style: {
								fontWeight: 'bold',
							}
						}, {
							name: 'TAS',
							data: series_data_tas,
							style: {
								fontWeight: 'bold',
							}
						}, {
							name: 'VIC',
							data: series_data_vic,
							style: {
								fontWeight: 'bold',
							}
						}, {
							name: 'WA',
							data: series_data_wa,
							style: {
								fontWeight: 'bold',
							}
						}]
      });
    }

    function saveRecord() {}

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



    function isNullorEmpty(val) {
      if (val == '' || val == null) {
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
