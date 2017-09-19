queue()
  .defer(d3.json, "/api/data")
  .await(makeGraphs);

function makeGraphs(error, apiData) {

  //Start Transformations
  var dataSet = apiData;
  var dateFormat = d3.time.format("%m/%d/%Y");

  // fix business unit, and position
  dataSet.forEach(function (d) {
    d.Name = zeroPad(d.Name, 8)
    d.BUSINESS_UNIT = zeroPad(d.BUSINESS_UNIT, 3)
    d["Reports-To"] = zeroPad(d["Reports-To"], 8)
    d["ID"] = zeroPad(d["ID"], 5)
    //d["Subordinate POS Business Unit"] = zeroPad(d["Subordinate POS Business Unit"], 3)
    //d["Subordinate POS Num"] = zeroPad(d["Subordinate POS Num"], 8)
    //d["Subordinate Reports-To"] = zeroPad(d["Subordinate Reports-To"], 8)
  });

  //Create a Crossfilter instance
  var ndx = crossfilter(dataSet);

  //Define Dimensions
  // my dimensions
  var dimensionSupervisorPosition = ndx.dimension(function (d) {
    return d.Name;
  });
  var dimensionSupervisorReportsTo = ndx.dimension(function (d) {
    return d['Reports-To'];
  });
  var dimensionSupervisorBusinessUnit = ndx.dimension(function (d) {
    return d.BUSINESS_UNIT;
  });

  //Calculate metrics
  // my metrics

  var all = ndx.groupAll();

  var metricProjectsBySupervisor = dimensionSupervisorPosition.group()
  var metricProjectsBySupervisorBusinessUnit = dimensionSupervisorBusinessUnit.group()
  var metricProjectsReportsToGroup = dimensionSupervisorReportsTo.group()

  //Calculate Groups
  // my calculated Groups
  var groupSupervisoryOrganizationsTitles = dimensionSupervisorPosition.group().reduceSum(function (d) {
    return d["Subordinate POS Job Title"]
  })

  var groupSupervisoryOrganizationsBusinessUnit = dimensionSupervisorBusinessUnit.group().reduceSum(function (d) {
    return d["BUSINESS_UNIT"]
  })

  var groupTotalEmployees = ndx.groupAll().reduceSum(function (d) {
    return d.total_donations;
  });

  // review
  //Define threshold values for data
  // var minDate = datePosted.bottom(1)[0].date_posted;
  // var maxDate = datePosted.top(1)[0].date_posted;

  // console.log(minDate);
  // console.log(maxDate);

  // review
  //Charts
  // var dateChart = dc.lineChart("#date-chart");
  // var gradeLevelChart = dc.rowChart("#grade-chart");
  // var resourceTypeChart = dc.rowChart("#resource-chart");
  // var fundingStatusChart = dc.pieChart("#funding-chart");
  // var povertyLevelChart = dc.rowChart("#poverty-chart");
  var totalSupervisorOrgs = dc.numberDisplay("#total-supervisor-orgs");
  var totalEmployees = dc.numberDisplay("#total-employees");
  // var stateDonations = dc.barChart("#state-donations");

  // my charts
  // var dimensionSupervisorPositionChart = dc.

  // selectField = dc.selectMenu('#menuselect')
  //   .dimension(state)
  //   .group(stateGroup);

  selectField = dc.selectMenu('#menuselect')
    .dimension(metricProjectsBySupervisorBusinessUnit)
    .group(metricProjectsBySupervisorBusinessUnit);

  dc.dataCount("#row-selection")
    .dimension(ndx)
    .group(all);


  totalSupervisorOrgs
    .formatNumber(d3.format("d"))
    .valueAccessor(function (d) {
      return d;
    })
    .group(all);

  // review
  totalEmployees
    .formatNumber(d3.format("d"))
    .valueAccessor(function (d) {
      return d;
    })
    .group(groupTotalEmployees)
    .formatNumber(d3.format(".3s"));

  // dateChart
  //   //.width(600)
  //   .height(220)
  //   .margins({
  //     top: 10,
  //     right: 50,
  //     bottom: 30,
  //     left: 50
  //   })
  //   .dimension(datePosted)
  //   .group(projectsByDate)
  //   .renderArea(true)
  //   .transitionDuration(500)
  //   .x(d3.time.scale().domain([minDate, maxDate]))
  //   .elasticY(true)
  //   .renderHorizontalGridLines(true)
  //   .renderVerticalGridLines(true)
  //   .xAxisLabel("Year")
  //   .yAxis().ticks(6);

  // resourceTypeChart
  //   //.width(300)
  //   .height(220)
  //   .dimension(resourceType)
  //   .group(projectsByResourceType)
  //   .elasticX(true)
  //   .xAxis().ticks(5);

  // povertyLevelChart
  //   //.width(300)
  //   .height(220)
  //   .dimension(povertyLevel)
  //   .ordering(function (d) {
  //     var order;
  //     if (d.key == 'highest poverty') {
  //       order = 4
  //     } else if (d.key == 'high poverty') {
  //       order = 3
  //     } else if (d.key == 'moderate poverty') {
  //       order = 2
  //     } else if (d.key == 'low poverty') {
  //       order = 1
  //     } else {
  //       order = 0
  //     };
  //     return -order;
  //   })
  //   .group(projectsByPovertyLevel)
  //   .xAxis().ticks(4);

  // gradeLevelChart
  //   //.width(300)
  //   .height(220)
  //   .dimension(gradeLevel)
  //   .ordering(function (d) {
  //     var order;
  //     if (d.key == 'Grades 9-12') {
  //       order = 4
  //     } else if (d.key == 'Grades 6-8') {
  //       order = 3
  //     } else if (d.key == 'Grades 3-5') {
  //       order = 2
  //     } else if (d.key == 'Grades PreK-2') {
  //       order = 1
  //     } else {
  //       order = 0
  //     };
  //     return -order;
  //   })
  //   .group(projectsByGrade)
  //   .xAxis().ticks(4);


  // fundingStatusChart
  //   .height(220)
  //   //.width(350)
  //   .radius(90)
  //   .innerRadius(40)
  //   .transitionDuration(1000)
  //   .dimension(fundingStatus)
  //   .group(projectsByFundingStatus);


  // stateDonations
  //   //.width(800)
  //   .height(220)
  //   .transitionDuration(1000)
  //   .dimension(state)
  //   .group(totalDonationsState)
  //   .margins({
  //     top: 10,
  //     right: 50,
  //     bottom: 30,
  //     left: 50
  //   })
  //   .centerBar(false)
  //   .gap(5)
  //   .elasticY(true)
  //   .x(d3.scale.ordinal().domain(state))
  //   .xUnits(dc.units.ordinal)
  //   .renderHorizontalGridLines(true)
  //   .renderVerticalGridLines(true)
  //   .ordering(function (d) {
  //     return d.value;
  //   })
  //   .yAxis().tickFormat(d3.format("s"));

  dc.renderAll();

};

// https://stackoverflow.com/questions/30926539/organization-chart-tree-online-dynamic-collapsible-pictures-in-d3
function flatToHierarchy(flat) {

  var roots = [] // things without ["Reports-To"]

  // make them accessible by Name on this map
  var all = {}

  flat.forEach(function (item) {
    all[item.Name] = item
  })

  // connect childrens to its ["Reports-To"], and split roots apart
  Object.keys(all).forEach(function (Name) {
    var item = all[Name]
    if (item["Reports-To"] === null || item["Reports-To"] === '') {
      roots.push(item)
    } else if (item["Reports-To"] in all) {
      var p = all[item["Reports-To"]]
      if (!('children' in p)) {
        p.children = []
      }
      p.children.push(item)
    }
  })

  // done!
  return roots['0']
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}