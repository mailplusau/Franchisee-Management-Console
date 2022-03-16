/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-12-24T09:19:53+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-03-16T16:43:11+11:00
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
      zeeSalesLeadDataSetBySource = [];
      zeeSalesLeadDataSetByStatus = [];
      zeeSalesLeadSet = [];
      zeeSalesLeadSetByState = [];
      zeeSalesLeadSetBySource = [];
      zeeSalesLeadSetByStatus = [];

      // pageLoad();
      submitSearch();

      $(".viewZeeLead").click(function() {
        var dateFrom = $(this).attr("data-id");
        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1409&deploy=1&date_from=' +
          dateFrom
        window.location.href = url;

      })

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

      dataTable = $('#source_table').DataTable({
        destroy: true,
        data: zeeSalesLeadDataSetBySource,
        pageLength: 1000,
        order: [],
        columns: [{
          title: 'LINK'
        }, {
          title: 'Date Lead Entered - Week'
        }, {
          title: 'MANUAL'
        }, {
          title: 'Become a Franchisee Web Page'
        }, {
          title: 'Brisbane - Become a Franchisee Web Page'
        }, {
          title: 'Canberra - Become a Franchisee Web Page'
        }, {
          title: 'Northern Beaches - Become a Franchisee Web Page'
        }, {
          title: 'Perth - Become a Franchisee Web Page'
        }, {
          title: 'Sydney - Become a Franchisee Web Page'
        }, {
          title: 'Total Lead Count'
        }],
        columnDefs: [{
          targets: [1, 9],
          className: 'bolded'
        }],
        rowCallback: function(row, data, index) {}
      });

      dataTable = $('#status_table').DataTable({
        destroy: true,
        data: zeeSalesLeadDataSetByStatus,
        pageLength: 1000,
        order: [],
        columns: [{
          title: 'LINK'
        }, {
          title: 'Date Lead Entered - Week'
        }, {
          title: 'New Lead'
        }, {
          title: 'Qualified'
        }, {
          title: 'Opportunity'
        }, {
          title: 'IM Sent'
        }, {
          title: 'NDA Sent'
        }, {
          title: 'OPERATIONS MEETING'
        }, {
          title: 'SALES MEETING'
        }, {
          title: 'FINANCE MEETING'
        }, {
          title: 'EOI SENT'
        }, {
          title: 'INTERVIEW'
        }, {
          title: 'LEAD LOST'
        }, {
          title: 'OPPORTUNITY DENIED'
        }, {
          title: 'QUALIFIED LEAD - NO TERRITORY'
        }, {
          title: 'Total Lead Count'
        }],
        columnDefs: [{
          targets: [1, 2, 15],
          className: 'bolded'
        }],
        rowCallback: function(row, data, index) {

        }
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

        if (old_date != null && old_date != date) {
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

          if (typeId == 2) { // Investor/Manager
            investorCount = investorCount + leadCount
            total_count = total_count + parseInt(leadCount);
          } else if (typeId == 3) { // Owner/Operator
            ownerCount = ownerCount + leadCount
            total_count = total_count + parseInt(leadCount);
          } else if (typeId == 4) { // Seeking Employment
            employmentCount = employmentCount + leadCount
            total_count = total_count + parseInt(leadCount);
          }
        } else {

          if (typeId == 2) { // Investor/Manager
            investorCount = investorCount + leadCount
            total_count = total_count + parseInt(leadCount);
          } else if (typeId == 3) { // Owner/Operator
            ownerCount = ownerCount + leadCount
            total_count = total_count + parseInt(leadCount);
          } else if (typeId == 4) { // Seeking Employment
            employmentCount = employmentCount + leadCount
            total_count = total_count + parseInt(leadCount);
          }

        }

        old_date = date;
        count++;
        return true;
      });

      if (count > 0) {
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


        if (old_date2 != null && old_date2 != date) {
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

          if (state == 'ACT') {
            actCount = actCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if (state == 'NSW') {
            nswCount = nswCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if (state == 'SA') {
            saCount = saCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if (state == 'WA') {
            waCount = waCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if (state == 'TAS') {
            tasCount = tasCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if (state == 'QLD') {
            qldCount = qldCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if (state == 'VIC') {
            vicCount = vicCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          }

        } else {

          if (state == 'ACT') {
            actCount = actCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if (state == 'NSW') {
            nswCount = nswCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if (state == 'SA') {
            saCount = saCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if (state == 'WA') {
            waCount = waCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if (state == 'TAS') {
            tasCount = tasCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if (state == 'QLD') {
            qldCount = qldCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          } else if (state == 'VIC') {
            vicCount = vicCount + leadCount
            total_count2 = total_count2 + parseInt(leadCount);
          }

        }

        old_date2 = date;
        count2++;
        return true;
      });

      if (count2 > 0) {
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

      var old_date3 = null;
      var total_count3 = 0;
      var count3 = 0;

      var manualCount = 0;
      var becomeFranchiseeCount = 0;
      var brisbaneCount = 0;
      var canberraCount = 0;
      var perthCount = 0;
      var northernBeachesCount = 0;
      var sydneyCount = 0;

      //NetSuite Search: Franchisee Weekly Leads - By Website Page
      var searchZeeLeadsList3 = search.load({
        id: 'customsearch_zee_sales_lead_list_2_4',
        type: 'customrecord_zee_sales_leads'
      });

      searchZeeLeadsList3.run().each(function(
        zeeLeadsListResultSet3) {

        var leadCount = parseInt(zeeLeadsListResultSet3.getValue({
          name: 'internalid',
          summary: "COUNT"
        }));
        var date = zeeLeadsListResultSet3.getValue({
          name: "custrecord_zee_lead_date_entered",
          summary: "GROUP"
        });

        var websitePage = zeeLeadsListResultSet3.getValue({
          name: "custrecord_website_page",
          summary: "GROUP",
        });


        if (old_date3 != null && old_date3 != date) {
          zeeSalesLeadSetBySource.push({
            date: old_date3,
            leadCount: total_count3,
            manualCount: manualCount,
            becomeFranchiseeCount: becomeFranchiseeCount,
            brisbaneCount: brisbaneCount,
            canberraCount: canberraCount,
            perthCount: perthCount,
            northernBeachesCount: northernBeachesCount,
            sydneyCount: sydneyCount
          });

          total_count3 = 0;
          manualCount = 0;
          becomeFranchiseeCount = 0;
          brisbaneCount = 0;
          canberraCount = 0;
          perthCount = 0;
          northernBeachesCount = 0;
          sydneyCount = 0;

          if (websitePage == '/perth-franchise-for-sale/') {
            perthCount = perthCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          } else if (websitePage == '/brisbane-franchise-for-sale/') {
            brisbaneCount = brisbaneCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          } else if (websitePage == '/become-a-franchisee/') {
            becomeFranchiseeCount = becomeFranchiseeCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          } else if (websitePage == '/canberra-franchise-for-sale/') {
            canberraCount = canberraCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          } else if (websitePage ==
            '/northern-beaches-franchise-for-sale/') {
            northernBeachesCount = northernBeachesCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          } else if (websitePage == '/sydney-franchise-for-sale/') {
            sydneyCount = sydneyCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          } else if (isNullorEmpty(websitePage)) {
            manualCount = manualCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          }

        } else {

          if (websitePage == '/perth-franchise-for-sale/') {
            perthCount = perthCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          } else if (websitePage == '/brisbane-franchise-for-sale/') {
            brisbaneCount = brisbaneCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          } else if (websitePage == '/become-a-franchisee/') {
            becomeFranchiseeCount = becomeFranchiseeCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          } else if (websitePage == '/canberra-franchise-for-sale/') {
            canberraCount = canberraCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          } else if (websitePage ==
            '/northern-beaches-franchise-for-sale/') {
            northernBeachesCount = northernBeachesCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          } else if (websitePage == '/sydney-franchise-for-sale/') {
            sydneyCount = sydneyCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          } else if (isNullorEmpty(websitePage)) {
            manualCount = manualCount + leadCount
            total_count3 = total_count3 + parseInt(leadCount);
          }

        }

        old_date3 = date;
        count3++;
        return true;
      });

      if (count3 > 0) {
        zeeSalesLeadSetBySource.push({
          date: old_date3,
          leadCount: total_count3,
          manualCount: manualCount,
          becomeFranchiseeCount: becomeFranchiseeCount,
          brisbaneCount: brisbaneCount,
          canberraCount: canberraCount,
          perthCount: perthCount,
          northernBeachesCount: northernBeachesCount,
          sydneyCount: sydneyCount
        });
      }


      var old_date4 = null;
      var total_count4 = 0;
      var count4 = 0;

      var newLeadCount = 0;
      var qualifiedLeadCount = 0;
      var opportunitycount = 0;
      var imSentCount = 0;
      var ndaSentCount = 0;
      var operationsCount = 0;
      var salesCount = 0;
      var financeCount = 0;
      var eoiSentCount = 0;
      var interviewCount = 0;
      var leadLostCount = 0;
      var opportunityDeniedCount = 0;
      var qualifiedNoterritoryCount = 0;

      /*
        New Lead	1
        Qualified Lead	2
        Lead Lost	3
        Qualified Lead - No Territory	4
        Opportunity	5
        IM Sent	13
        Opportunity Denied	6
        NDA Sent	7
        Operations	8
        EOI Uploaded	9
        Finance	10
        Presentation	11
        Interview	12
       */

      //NetSuite Search: Franchisee Weekly Leads - By Status
      var searchZeeLeadsList4 = search.load({
        id: 'customsearch_zee_sales_lead_list_2_4_2',
        type: 'customrecord_zee_sales_leads'
      });

      searchZeeLeadsList4.run().each(function(
        zeeLeadsListResultSet4) {

        var leadCount = parseInt(zeeLeadsListResultSet4.getValue({
          name: 'internalid',
          summary: "COUNT"
        }));
        var date = zeeLeadsListResultSet4.getValue({
          name: "custrecord_zee_lead_date_entered",
          summary: "GROUP"
        });

        var leadStage = zeeLeadsListResultSet4.getValue({
          name: "custrecord_zee_lead_stage",
          summary: "GROUP",
        });


        if (old_date4 != null && old_date4 != date) {
          zeeSalesLeadSetByStatus.push({
            date: old_date4,
            leadCount: total_count4,
            newLeadCount: newLeadCount,
            qualifiedLeadCount: qualifiedLeadCount,
            opportunitycount: opportunitycount,
            imSentCount: imSentCount,
            ndaSentCount: ndaSentCount,
            operationsCount: operationsCount,
            salesCount: salesCount,
            financeCount: financeCount,
            eoiSentCount: eoiSentCount,
            interviewCount: interviewCount,
            leadLostCount: leadLostCount,
            opportunityDeniedCount: opportunityDeniedCount,
            qualifiedNoterritoryCount: qualifiedNoterritoryCount,
          });

          total_count4 = 0;
          newLeadCount = 0;
          qualifiedLeadCount = 0;
          opportunitycount = 0;
          imSentCount = 0;
          ndaSentCount = 0;
          operationsCount = 0;
          salesCount = 0;
          financeCount = 0;
          eoiSentCount = 0;
          interviewCount = 0;
          leadLostCount = 0;
          opportunityDeniedCount = 0;
          qualifiedNoterritoryCount = 0;

          /*
            New Lead	1
            Qualified Lead	2
            Lead Lost	3
            Qualified Lead - No Territory	4
            Opportunity	5
            IM Sent	13
            Opportunity Denied	6
            NDA Sent	7
            Operations	8
            EOI Uploaded	9
            Finance	10
            Presentation	11
            Interview	12
           */

          if (leadStage == '1') {
            newLeadCount = newLeadCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '2') {
            qualifiedLeadCount = qualifiedLeadCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '3') {
            leadLostCount = leadLostCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '4') {
            qualifiedNoterritoryCount = qualifiedNoterritoryCount +
              leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '5') {
            opportunitycount = opportunitycount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '6') {
            opportunityDeniedCount = opportunityDeniedCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '7') {
            ndaSentCount = ndaSentCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '8') {
            operationsCount = operationsCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '9') {
            eoiSentCount = eoiSentCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '10') {
            financeCount = financeCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '11') {
            salesCount = salesCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '12') {
            interviewCount = interviewCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '13') {
            imSentCount = imSentCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          }

        } else {

          if (leadStage == '1') {
            newLeadCount = newLeadCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '2') {
            qualifiedLeadCount = qualifiedLeadCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '3') {
            leadLostCount = leadLostCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '4') {
            qualifiedNoterritoryCount = qualifiedNoterritoryCount +
              leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '5') {
            opportunitycount = opportunitycount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '6') {
            opportunityDeniedCount = opportunityDeniedCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '7') {
            ndaSentCount = ndaSentCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '8') {
            operationsCount = operationsCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '9') {
            eoiSentCount = eoiSentCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '10') {
            financeCount = financeCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '11') {
            salesCount = salesCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '12') {
            interviewCount = interviewCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          } else if (leadStage == '13') {
            imSentCount = imSentCount + leadCount
            total_count4 = total_count4 + parseInt(leadCount);
          }

        }

        old_date4 = date;
        count4++;
        return true;
      });

      if (count3 > 0) {
        zeeSalesLeadSetByStatus.push({
          date: old_date4,
          leadCount: total_count4,
          newLeadCount: newLeadCount,
          qualifiedLeadCount: qualifiedLeadCount,
          opportunitycount: opportunitycount,
          imSentCount: imSentCount,
          ndaSentCount: ndaSentCount,
          operationsCount: operationsCount,
          salesCount: salesCount,
          financeCount: financeCount,
          eoiSentCount: eoiSentCount,
          interviewCount: interviewCount,
          leadLostCount: leadLostCount,
          opportunityDeniedCount: opportunityDeniedCount,
          qualifiedNoterritoryCount: qualifiedNoterritoryCount,
        });
      }



      console.log(zeeSalesLeadSetByState)

      loadDatatable(zeeSalesLeadSet, zeeSalesLeadSetByState,
        zeeSalesLeadSetBySource, zeeSalesLeadSetByStatus);
      zeeSalesLeadSet = [];

    }

    function loadDatatable(zeeSalesLeads_rows, zeeSalesLeadSetByState_rows,
      zeeSalesLeadSetBySource_rows, zeeSalesLeadSetByStatus_rows) {

      zeeSalesLeadDataSet = [];
      zeeSalesLeadDataSetByState = [];
      zeeSalesLeadDataSetBySource = [];
      zeeSalesLeadDataSetByStatus = [];
      csvSet = [];

      var chartDataSet = [];

      if (!isNullorEmpty(zeeSalesLeads_rows)) {
        zeeSalesLeads_rows.forEach(function(zeeSalesLeads_row, index) {

          var linkURL =
            '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            zeeSalesLeads_row.date +
            '" class="viewZeeLead" style="cursor: pointer !important;color: white;">LIST VIEW</a></button>';

          zeeSalesLeadDataSet.push([linkURL, zeeSalesLeads_row.date,
            parseInt(zeeSalesLeads_row.investorCount), parseInt(
              zeeSalesLeads_row.ownerCount), parseInt(
              zeeSalesLeads_row.employmentCount),
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
        zeeSalesLeadSetByState_rows.forEach(function(
          zeeSalesLeadSetByState_row, index) {

          var linkURL =
            '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            zeeSalesLeadSetByState_row.date +
            '" class="viewZeeLead" style="cursor: pointer !important;color: white;">LIST VIEW</a></button>';

          zeeSalesLeadDataSetByState.push([linkURL,
            zeeSalesLeadSetByState_row.date, parseInt(
              zeeSalesLeadSetByState_row.actCount), parseInt(
              zeeSalesLeadSetByState_row.nswCount), parseInt(
              zeeSalesLeadSetByState_row.saCount), parseInt(
              zeeSalesLeadSetByState_row.qldCount), parseInt(
              zeeSalesLeadSetByState_row.vicCount), parseInt(
              zeeSalesLeadSetByState_row.waCount), parseInt(
              zeeSalesLeadSetByState_row.tasCount),
            zeeSalesLeadSetByState_row.leadCount
          ]);
        });
      }

      /*{
        title: 'MANUAL'
      }, {
        title: 'Become a Franchisee Web Page'
      }, {
        title: 'Brisbane - Become a Franchisee Web Page'
      }, {
        title: 'Canberra - Become a Franchisee Web Page'
      }, {
        title: 'Northern Beaches - Become a Franchisee Web Page'
      }, {
        title: 'Perth - Become a Franchisee Web Page'
      }, {
        title: 'Sydney - Become a Franchisee Web Page'
      }, {
        title: 'Total Lead Count'
      }*/



      if (!isNullorEmpty(zeeSalesLeadSetBySource_rows)) {
        zeeSalesLeadSetBySource_rows.forEach(function(
          zeeSalesLeadSetBySource_row, index) {

          var linkURL =
            '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            zeeSalesLeadSetBySource_row.date +
            '" class="viewZeeLead" style="cursor: pointer !important;color: white;">LIST VIEW</a></button>';

          zeeSalesLeadDataSetBySource.push([linkURL,
            zeeSalesLeadSetBySource_row.date, parseInt(
              zeeSalesLeadSetBySource_row.manualCount), parseInt(
              zeeSalesLeadSetBySource_row.becomeFranchiseeCount),
            parseInt(
              zeeSalesLeadSetBySource_row.brisbaneCount), parseInt(
              zeeSalesLeadSetBySource_row.canberraCount), parseInt(
              zeeSalesLeadSetBySource_row.northernBeachesCount),
            parseInt(
              zeeSalesLeadSetBySource_row.perthCount), parseInt(
              zeeSalesLeadSetBySource_row.sydneyCount),
            zeeSalesLeadSetBySource_row.leadCount
          ]);
        });
      }

      if (!isNullorEmpty(zeeSalesLeadSetByStatus_rows)) {
        zeeSalesLeadSetByStatus_rows.forEach(function(
          zeeSalesLeadSetByStatus_row, index) {

          var linkURL =
            '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            zeeSalesLeadSetByStatus_row.date +
            '" class="viewZeeLead" style="cursor: pointer !important;color: white;">LIST VIEW</a></button>';

          zeeSalesLeadDataSetByStatus.push([linkURL,
            zeeSalesLeadSetByStatus_row.date, parseInt(
              zeeSalesLeadSetByStatus_row.newLeadCount), parseInt(
              zeeSalesLeadSetByStatus_row.qualifiedLeadCount),
            parseInt(
              zeeSalesLeadSetByStatus_row.opportunitycount), parseInt(
              zeeSalesLeadSetByStatus_row.imSentCount), parseInt(
              zeeSalesLeadSetByStatus_row.ndaSentCount),
            parseInt(
              zeeSalesLeadSetByStatus_row.operationsCount), parseInt(
              zeeSalesLeadSetByStatus_row.salesCount), parseInt(
              zeeSalesLeadSetByStatus_row.financeCount), parseInt(
              zeeSalesLeadSetByStatus_row.eoiSentCount), parseInt(
              zeeSalesLeadSetByStatus_row.interviewCount), parseInt(
              zeeSalesLeadSetByStatus_row.leadLostCount), parseInt(
              zeeSalesLeadSetByStatus_row.opportunityDeniedCount),
            parseInt(
              zeeSalesLeadSetByStatus_row.qualifiedNoterritoryCount),
            zeeSalesLeadSetByStatus_row.leadCount
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

      var datatable3 = $('#source_table').DataTable();
      datatable3.clear();
      datatable3.rows.add(zeeSalesLeadDataSetBySource);
      datatable3.draw();

      var datatable4 = $('#status_table').DataTable();
      datatable4.clear();
      datatable4.rows.add(zeeSalesLeadDataSetByStatus);
      datatable4.draw();

      var data = datatable.rows().data();
      var data2 = datatable2.rows().data();
      var data3 = datatable3.rows().data();
      var data4 = datatable4.rows().data();

      var week = [];
      var week2 = [];
      var week3 = [];
      var week4 = [];
      var leadCount = [];
      var leadCount2 = [];
      var leadCount3 = [];
      var leadCount4 = [];


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

      var manualCountArray = [];
      var becomeFranchiseeCountArray = [];
      var brisbaneCountArray = [];
      var canberraCountArray = [];
      var northernBeachesCountArray = [];
      var perthCountArray = [];
      var sydneyCountArray = [];

      var newLeadCountArray = [];
      var qualifiedLeadCountArray = [];
      var opportunitycountArray = [];
      var imSentCountArray = [];
      var ndaSentCountArray = [];
      var operationsCountArray = [];
      var salesCountArray = [];
      var financeCountArray = [];
      var eoiSentCountArray = [];
      var interviewCountArray = [];
      var leadLostCountArray = [];
      var opportunityDeniedCountArray = [];
      var qualifiedNoterritoryCountArray = [];

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

      /*
      {
        title: 'LINK'
      }, {
        title: 'Date Lead Entered - Week'
      }, {
        title: 'MANUAL'
      }, {
        title: 'Become a Franchisee Web Page'
      }, {
        title: 'Brisbane - Become a Franchisee Web Page'
      }, {
        title: 'Canberra - Become a Franchisee Web Page'
      }, {
        title: 'Northern Beaches - Become a Franchisee Web Page'
      }, {
        title: 'Perth - Become a Franchisee Web Page'
      }, {
        title: 'Sydney - Become a Franchisee Web Page'
      }, {
        title: 'Total Lead Count'
      }
       */

      for (var i = 0; i < data3.length; i++) {
        week3.push(data3[i][1]);
        leadCount3[data3[i][1]] = data3[i][9];
        manualCountArray[data3[i][1]] = data3[i][2];
        becomeFranchiseeCountArray[data3[i][1]] = data3[i][3];
        brisbaneCountArray[data3[i][1]] = data3[i][4];
        canberraCountArray[data3[i][1]] = data3[i][5];
        northernBeachesCountArray[data3[i][1]] = data3[i][6];
        perthCountArray[data3[i][1]] = data3[i][7];
        sydneyCountArray[data3[i][1]] = data3[i][8];
      }


      /*
      {
        title: 'New Lead'
      }, {
        title: 'Qualified'
      }, {
        title: 'Opportunity'
      }, {
        title: 'IM Sent'
      }, {
        title: 'NDA Sent'
      }, {
        title: 'OPERATIONS MEETING'
      }, {
        title: 'SALES MEETING'
      }, {
        title: 'FINANCE MEETING'
      }, {
        title: 'EOI SENT'
      }, {
        title: 'INTERVIEW'
      }, {
        title: 'LEAD LOST'
      }, {
        title: 'OPPORTUNITY DENIED'
      }, {
        title: 'QUALIFIED LEAD - NO TERRITORY'
      }
       */


      for (var i = 0; i < data4.length; i++) {
        week4.push(data4[i][1]);
        leadCount4[data4[i][1]] = data4[i][15];
        newLeadCountArray[data4[i][1]] = data4[i][2];
        qualifiedLeadCountArray[data4[i][1]] = data4[i][3];
        opportunitycountArray[data4[i][1]] = data4[i][4];
        imSentCountArray[data4[i][1]] = data4[i][5];
        ndaSentCountArray[data4[i][1]] = data4[i][6];
        operationsCountArray[data4[i][1]] = data4[i][7];
        salesCountArray[data4[i][1]] = data4[i][8];
        financeCountArray[data4[i][1]] = data4[i][9];
        eoiSentCountArray[data4[i][1]] = data4[i][10];
        interviewCountArray[data4[i][1]] = data4[i][11];
        leadLostCountArray[data4[i][1]] = data4[i][12];
        opportunityDeniedCountArray[data4[i][1]] = data4[i][13];
        qualifiedNoterritoryCountArray[data4[i][1]] = data4[i][14];
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

      var series_data_manual = []; //creating empty array for highcharts series data
      var series_data_main = []; //creating empty array for highcharts series data
      var series_data_brisbane = []; //creating empty array for highcharts series data
      var series_data_canberra = []; //creating empty array for highcharts series data
      var series_data_northern_beaches = []; //creating empty array for highcharts series data
      var series_data_perth = []; //creating empty array for highcharts series data
      var series_data_sydney = []; //creating empty array for highcharts series data
      var categores3 = []; //creating empty array for highcharts categories
      Object.keys(leadCount3).map(function(item, key) {
        series_data_manual.push(parseInt(manualCountArray[item]));
        series_data_main.push(parseInt(becomeFranchiseeCountArray[item]));
        series_data_brisbane.push(parseInt(brisbaneCountArray[item]));
        series_data_canberra.push(parseInt(canberraCountArray[item]));
        series_data_northern_beaches.push(parseInt(
          northernBeachesCountArray[item]));
        series_data_perth.push(parseInt(perthCountArray[item]));
        series_data_sydney.push(parseInt(sydneyCountArray[item]));

        categores3.push(item)
      });

      var series_data_newLead = []; //creating empty array for highcharts series data
      var series_data_qualifiedLead = []; //creating empty array for highcharts series data
      var series_data_opportunity = []; //creating empty array for highcharts series data
      var series_data_imSent = []; //creating empty array for highcharts series data
      var series_data_ndaSent = []; //creating empty array for highcharts series data
      var series_data_operations = []; //creating empty array for highcharts series data
      var series_data_sales = []; //creating empty array for highcharts series data
      var series_data_finance = []; //creating empty array for highcharts series data
      var series_data_eoiSent = []; //creating empty array for highcharts series data
      var series_data_interview = []; //creating empty array for highcharts series data
      var series_data_leadLost = []; //creating empty array for highcharts series data
      var series_data_opportunityDenied = []; //creating empty array for highcharts series data
      var series_data_qualifiedNoterritory = []; //creating empty array for highcharts series data
      var categores4 = []; //creating empty array for highcharts categories
      Object.keys(leadCount4).map(function(item, key) {
        series_data_newLead.push(parseInt(newLeadCountArray[item]));
        series_data_qualifiedLead.push(parseInt(qualifiedLeadCountArray[
          item]));
        series_data_opportunity.push(parseInt(opportunitycountArray[item]));
        series_data_imSent.push(parseInt(imSentCountArray[item]));
        series_data_ndaSent.push(parseInt(
          ndaSentCountArray[item]));
        series_data_operations.push(parseInt(operationsCountArray[item]));
        series_data_sales.push(parseInt(salesCountArray[item]));
        series_data_finance.push(parseInt(financeCountArray[item]));
        series_data_eoiSent.push(parseInt(eoiSentCountArray[item]));
        series_data_interview.push(parseInt(interviewCountArray[item]));
        series_data_leadLost.push(parseInt(leadLostCountArray[item]));
        series_data_opportunityDenied.push(parseInt(
          opportunityDeniedCountArray[item]));
        series_data_qualifiedNoterritory.push(parseInt(
          qualifiedNoterritoryCountArray[item]));

        categores4.push(item)
      });

      plotChart(series_data, categores, series_data2, series_data3,
        series_data4);
      plotChart2(series_data_act, series_data_nsw, series_data_sa,
        series_data_qld, series_data_vic, series_data_wa, series_data_tas,
        categores2);
      plotChart3(series_data_manual, series_data_main, series_data_brisbane,
        series_data_canberra, series_data_northern_beaches,
        series_data_perth, series_data_sydney,
        categores3);
      plotChart4(series_data_newLead, series_data_qualifiedLead,
        series_data_opportunity,
        series_data_imSent, series_data_ndaSent,
        series_data_operations, series_data_sales, series_data_finance,
        series_data_eoiSent, series_data_interview, series_data_leadLost,
        series_data_opportunityDenied, series_data_qualifiedNoterritory,
        categores4);

      return true;
    }

    function plotChart(series_data, categores, series_data2, series_data3,
      series_data4) {
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

    function plotChart2(series_data_act, series_data_nsw, series_data_sa,
      series_data_qld, series_data_vic, series_data_wa, series_data_tas,
      categores2) {
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

    function plotChart3(series_data_manual, series_data_main,
      series_data_brisbane,
      series_data_canberra, series_data_northern_beaches,
      series_data_perth, series_data_sydney,
      categores3) {
      // console.log(series_data)
      Highcharts.chart('container6', {
        chart: {
          backgroundColor: '#CFE0CE',
          type: 'column'
        },
        xAxis: {
          categories: categores3,
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
          name: 'MANUAL',
          data: series_data_manual,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'WEB PAGE - BECOME A FRANCHISEE',
          data: series_data_main,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'WEB PAGE - BRISBANE',
          data: series_data_brisbane,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'WEB PAGE - CANBERRA',
          data: series_data_canberra,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'WEB PAGE - NORTHERN BEACHES',
          data: series_data_northern_beaches,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'WEB PAGE - PERTH',
          data: series_data_perth,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'WEB PAGE - SYDNEY',
          data: series_data_sydney,
          style: {
            fontWeight: 'bold',
          }
        }]
      });
    }

    function plotChart4(series_data_newLead, series_data_qualifiedLead,
      series_data_opportunity,
      series_data_imSent, series_data_ndaSent,
      series_data_operations, series_data_sales, series_data_finance,
      series_data_eoiSent, series_data_interview, series_data_leadLost,
      series_data_opportunityDenied, series_data_qualifiedNoterritory,
      categores4) {
      // console.log(series_data)
      Highcharts.chart('container7', {
        chart: {
          backgroundColor: '#CFE0CE',
          type: 'column'
        },
        xAxis: {
          categories: categores4,
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
          name: 'NEW LEAD',
          data: series_data_newLead,
          color: '#084594',
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'QUALIFIED LEAD',
          data: series_data_qualifiedLead,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'OPPORTUNITY',
          data: series_data_opportunity,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'IM SENT',
          data: series_data_imSent,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'NDA SENT',
          data: series_data_ndaSent,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'OPERATIONS MEETING',
          data: series_data_operations,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'SALES MEETING',
          data: series_data_sales,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'FINANCE MEETING',
          data: series_data_finance,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'EOI SENT & UPLOADED',
          data: series_data_eoiSent,
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'INTERVIEW',
          data: series_data_interview,
          color: '#008E89',
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'LEAD LOST',
          data: series_data_leadLost,
          color: '#E83A14',
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'OPPORTUNITY DENIED',
          data: series_data_opportunityDenied,
          color: '#e9d30a',
          style: {
            fontWeight: 'bold',
          }
        }, {
          name: 'QUALIFIED LEAD - NO TERRITORY',
          data: series_data_qualifiedNoterritory,
          color: '#E45826',
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
      if (val == '' || val == null || val == '- None -') {
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
