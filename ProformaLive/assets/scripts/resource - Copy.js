﻿var app = angular.module('MECC', []);

app.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }
])
app.controller('MECCController', function ($scope, $sce, FileUploadService, $http, $window) {

    var capital_mainwidth = document.getElementById("mainbody").offsetWidth;
    capital_mainwidth = (capital_mainwidth - 803) / 5;

    var resource_mainwidth = document.getElementById("mainbody").offsetWidth;
    resource_mainwidth = (resource_mainwidth - 922) / 4;

    var capitallabor_mainwidth = document.getElementById("mainbody").offsetWidth;
    capitallabor_mainwidth = (capitallabor_mainwidth - 954) / 6;

    var de_mainwidth = document.getElementById("mainbody").offsetWidth;
    de_mainwidth = (de_mainwidth - 1087) / 2;
    
    var sm = this;
    var formSubmitting = true;
    var capitalSubmitting = true;
    var capitallaborSubmitting = true;
    var deSubmitting = true;
    var rowbusiness = [];
    var rowbu = [];
    var rowOperatingExpenseWBS = [];
    var datasourceCapitalExpenditureWBS = [];
    var datasourceCapitalExpenditureWBSCapital = [];
    var rowhighorg = [];
    var rowMidOrg = [];
    var rowTeam = [];
    var dsResource = [];
    var dsCapital = [];
    var jSuite_dropSummaryFisYear = [];
    var jSuite_drop_Summary_Months = [];
    var jSuite_drop_Summary_Quarter = [];
    var dsCapitalLabour = [];
    var dsDirectExpense = [];
    var dsProjectList = [];
    var obj = [];
    var objdirectexpenses = [];
    var projectname = [];
    var rowRequiredSkills = [];
    var updatedInfo = [];
    var deleteInfo = [];
    var duplicateInfo = [];
    var capital_duplicateInfo = [];
    var returndata = [];
    var skillmaster = [];
    var datasourcePriority = [];
    var dataexpenseCategory = [];
    var datasourceCapitalCategory = [];
    var datasourceCapitalType = [];
    var capital_updatedInfo = [];
    var capital_deleteInfo = [];
    var capitallabor_updatedInfo = [];
    var capitallabor_deleteInfo = [];
    var capitallabor_duplicateInfo = [];
    var directexpenses_updatedInfo = [];
    var directexpenses_deleteInfo = [];
    var directexpenses_duplicateInfo = [];
    var jSuite_dropOperatingExpenseWBSDE = [];
    var jSuite_dropProjects = [];
    var jSuite_drop_Capital_AOPProject_CapitalLabor = [];
    var s_startvalue = 0;
    var s_endvalue = 0;
    var c_startvalue = 0;
    var c_endvalue = 0;
    var resource_hidecolumns = [];
    $scope.IsFormSubmitted = false;
    $scope.SelectedFileForUpload = null;
    $scope.clonealert = false;
    default_tabsetting("summary")
    var jSuite_dropOperatingExpenseWBS = [];
    var jSuite_dropCapitalExpenditureWBS = [];
    var jSuite_dropBU = [];
    var jSuite_dropHighOrg = [];
    var jSuite_dropMidOrg = [];
    var jSuite_dropTeam = [];
    var jSuite_dropRequiredSkills = [];

    document.getElementById('resourcetotal').innerHTML = "0";
    document.getElementById('capitaltotal').innerHTML = "0";
    document.getElementById('capitallabortotal').innerHTML = "0";
    document.getElementById('detotal').innerHTML = "0";

    jSuite_dropProjects = jSuites.dropdown(document.getElementById('dropProjects'), {
        url: '../Resource/getprojectlist',
        autocomplete: true,
        placeholder: "Select Project",
        lazyLoading: true,
        multiple: false,
        width: '100%',
        value: projectname,
        onchange: loadresorucetabs,
    });

    document.getElementById('activetabid').innerHTML = "summary";
    document.getElementsByClassName("jexcel_search").placeholder = "Search..";
    var mainwidth = document.getElementById("mainbody").offsetWidth
    mainwidth = (mainwidth - 115) + "px";

    getprojectname();
    //updateskillfilter();

    function loaddefaultsummary() {
        default_tabsetting("summary");
        document.getElementById('drop_Summary_Months').setAttribute('disabled', 'disabled');
        document.getElementById('drop_Summary_Quarter').setAttribute('disabled', 'disabled');
    }

    //setTimeout(function () {
    //    $scope.$apply(function () {
    //        HideBlackRowsInSummaryTable();
    //    });
    //}, 4000);

    //function HideBlackRowsInSummaryTable() {
    //    var table = document.getElementById('ST');      
    //    for (var r = 0, n = table.rows.length; r < n; r++) {
    //        for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
    //            console.log(table.rows[r].cells[c].innerHTML);
    //        }
    //    }
    //}


    $scope.selectFileforUpload = function (file) {
        $scope.SelectedFileForUpload = file[0];
        $scope.$apply(function ($scope) {
            $scope.theFile = file[0];
        });
    }


    $scope.getsummary = function () {
        getsummaryinfo();
    }


    function getsummaryinfo() {

        var summaryheight = parseInt(window.innerHeight);
        summaryheight = summaryheight - 300;
        document.getElementById('summarycontainer').setAttribute('style', 'height: ' + summaryheight + 'px;');

        var fisyear = jSuite_dropSummaryFisYear.getText();
        var fismonth = jSuite_drop_Summary_Months.getText();
        var fisqtr = jSuite_drop_Summary_Quarter.getText();

        //creating summary PIVOTE Table.    
        $scope.YMNames = [];
        $scope.itemName = [];

        $http({
            method: 'GET',
            url: '../Resource/getsummarydata',
            params: {
                "strFisyear": fisyear,
                "strMonth": fismonth,
                "strQtr": fisqtr
            }
        }).then(function (response) {

            $scope.SummaryDetails = response.data;

            if ($scope.SummaryDetails.length > 0) {

                var uniqueYMName = {},
                    i;

                for (i = 0; i < $scope.SummaryDetails.length; i += 1) {
                    //For column wise YM add    
                    uniqueYMName[$scope.SummaryDetails[i].FinYear_Month] = $scope.SummaryDetails[i];
                }

                // For Column wise YM add    
                for (i in uniqueYMName) {
                    $scope.YMNames.push(uniqueYMName[i]);
                }

                $scope.getYMDetails();

                document.getElementById('mainbody').setAttribute("style", "opacity:1")
                updateprogressbar(100, "Completed...");
                document.getElementById('progressbar').style.display = 'none';
                document.getElementById('maincard').style.display = 'block';
                document.getElementById('Summary').setAttribute("style", "padding-left:20px; padding-right:20px; opacity:1;")
            }

        }, function (error) {
            console.log(error);
        });

    }

    $scope.getYMDetails = function () {

        var UniqueItemName = {}, i

        for (i = 0; i < $scope.SummaryDetails.length; i += 1) {

            UniqueItemName[$scope.SummaryDetails[i].Name] = $scope.SummaryDetails[i];
        }
        for (i in UniqueItemName) {

            var ItmDetails = {
                Name: UniqueItemName[i].Name
            };
            $scope.itemName.push(ItmDetails);
        }

    }

    $scope.updateitemname = function (colName) {

        var colorname = "";
        if (colName == "Summary Totals") {
            colorname = "red";
        }
        else {
            colorname = "#007bff";
        }
        return $sce.trustAsHtml("<font style='" + colorname + "; font-weight:500;'>" + colName.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</font>");
    }

    // To Display Toy Details as Toy Name wise Pivot Price Sum calculate 
    $scope.showYMItemDetails = function (colName, colYM) {

        $scope.getvalues = 0;

        for (i = 0; i < $scope.SummaryDetails.length; i++) {
            if (colName == $scope.SummaryDetails[i].Name) {
                if (colYM == $scope.SummaryDetails[i].FinYear_Month) {

                    $scope.getvalues = parseFloat($scope.getvalues) + parseFloat($scope.SummaryDetails[i].value);

                }
            }
        }
        if (parseFloat($scope.getvalues) > 0) {

            if (colName === "Total Project FTEs (Operating & Capital)" || colName === "Total Site Operating FTEs" || colName === "Total Non Site Operating FTEs" || colName === "Total Site Capital FTEs" || colName === "Total Non Site Capital FTEs") {
                return $sce.trustAsHtml("<font style='color:#007bff; font-weight:500;'><b>" + $scope.getvalues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b></font>");
            }
            else {
                return $sce.trustAsHtml("<font style='color:#007bff; font-weight:500;'><b>$" + $scope.getvalues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b></font>");
            }
        }
        else {
            return $sce.trustAsHtml("<b>" + $scope.getvalues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b>");
        }
    }

    //$scope.savefilters = function () {
    //    var filters = obj.filters.map(function (arr) { if (arr == null) { return null; } else { Flagfiltered = true; return arr.slice(); } });
    //    var search = obj.searchInput.value;
    //    console.log(filters);
    //}

    // To Display Toy Details as Toy Name wise Pivot Column wise Total
    $scope.showYMColumnGrandTotal = function (colName, colToyName) {

        $scope.getColumTots = 0;

        for (i = 0; i < $scope.SummaryDetails.length; i++) {
            if (colName == $scope.SummaryDetails[i].Name) {
                $scope.getColumTots = parseFloat(parseFloat($scope.getColumTots) + parseFloat($scope.SummaryDetails[i].value)).toFixed(2);
            }
        }

        if (colName === "Total Project FTEs (Operating & Capital)" || colName === "Total Site Operating FTEs" || colName === "Total Non Site Operating FTEs" || colName === "Total Site Capital FTEs" || colName === "Total Non Site Capital FTEs") {
            return $sce.trustAsHtml("<b>" + $scope.getColumTots.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b>");
        }
        else {
            return $sce.trustAsHtml("<b>$" + $scope.getColumTots.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b>");
        }

    }

    function getlastmodifieddata() {

        $http({
            method: 'GET',
            url: '../Resource/getlastmodifiedinfo'
        }).then(function (response) {
            $scope.LMdata = response.data;
            var LMInfo = response.data;

            if (LMInfo.length > 0) {
                for (var i = 0; i < LMInfo.length; i++) {
                    if (LMInfo[i].source === "Resource") {

                        if (LMInfo[i].name === null || LMInfo[i].name === "") {
                            document.getElementById('resource_Lastmodifiedby').style.display = 'none';
                        }
                        else {
                            $scope.resource_lastmodifiedby = "Last Modified By: " + LMInfo[i].name;
                            document.getElementById('resource_Lastmodifiedby').style.display = 'block';
                        }

                        if (LMInfo[i].date === null || LMInfo[i].date === "") {
                            document.getElementById('resource_Lastmodifieddate').style.display = 'none';
                        }
                        else {
                            $scope.resource_lastmodifieddate = "Last Modified Date: " + LMInfo[i].date;
                            document.getElementById('resource_Lastmodifieddate').style.display = 'block';
                        }

                    } else if (LMInfo[i].source === "Capital") {

                        if (LMInfo[i].name === null || LMInfo[i].name === "") {
                            document.getElementById('capital_Lastmodifiedby').style.display = 'none';
                        }
                        else {
                            $scope.capital_lastmodifiedby = "Last Modified By: " + LMInfo[i].name;
                            document.getElementById('capital_Lastmodifiedby').style.display = 'block';
                        }

                        if (LMInfo[i].date === null || LMInfo[i].date === "") {
                            document.getElementById('capital_Lastmodifieddate').style.display = 'none';
                        }
                        else {
                            $scope.capital_lastmodifieddate = "Last Modified Date: " + LMInfo[i].date;
                            document.getElementById('capital_Lastmodifieddate').style.display = 'block';
                        }

                    } else if (LMInfo[i].source === "CapitalLabor") {

                        if (LMInfo[i].name === null || LMInfo[i].name === "") {
                            document.getElementById('capitallabor_Lastmodifiedby').style.display = 'none';
                        }
                        else {
                            $scope.capitallabor_lastmodifiedby = "Last Modified By: " + LMInfo[i].name;
                            document.getElementById('capitallabor_Lastmodifiedby').style.display = 'block';
                        }

                        if (LMInfo[i].date === null || LMInfo[i].date === "") {
                            document.getElementById('capitallabor_Lastmodifieddate').style.display = 'none';
                        }
                        else {
                            $scope.capitallabor_lastmodifieddate = "Last Modified Date: " + LMInfo[i].date;
                            document.getElementById('capitallabor_Lastmodifieddate').style.display = 'block';
                        }

                    } else if (LMInfo[i].source === "DirectExpenses") {

                        if (LMInfo[i].name === null || LMInfo[i].name === "") {
                            document.getElementById('de_Lastmodifiedby').style.display = 'none';
                        }
                        else {
                            $scope.de_lastmodifiedby = "Last Modified By: " + LMInfo[i].name;
                            document.getElementById('de_Lastmodifiedby').style.display = 'block';
                        }

                        if (LMInfo[i].date === null || LMInfo[i].date === "") {
                            document.getElementById('de_Lastmodifieddate').style.display = 'none';
                        }
                        else {
                            $scope.de_lastmodifieddate = "Last Modified Date: " + LMInfo[i].date;
                            document.getElementById('de_Lastmodifieddate').style.display = 'block';
                        }

                    }
                }
            }
            else {
                document.getElementById('resource_Lastmodifiedby').style.display = 'none';
                document.getElementById('resource_Lastmodifieddate').style.display = 'none';

                document.getElementById('capital_Lastmodifiedby').style.display = 'none';
                document.getElementById('capital_Lastmodifieddate').style.display = 'none';

                document.getElementById('capitallabor_Lastmodifiedby').style.display = 'none';
                document.getElementById('capitallabor_Lastmodifieddate').style.display = 'none';

                document.getElementById('de_Lastmodifiedby').style.display = 'none';
                document.getElementById('de_Lastmodifieddate').style.display = 'none';
            }
        }, function (error) {
            console.log(error);
        });

    }

    var setFormSubmitting = function () { formSubmitting = false; };
    var setcapitalSubmitting = function () { capitalSubmitting = false; };
    var setcapitallaborSubmitting = function () { capitallaborSubmitting = false; };
    var setdeSubmitting = function () { deSubmitting = false; };

    window.onload = function () {
        window.addEventListener("beforeunload", function (e) {
            if (formSubmitting == false || capitalSubmitting == false || capitallaborSubmitting == false || deSubmitting == false) {
                var confirmationMessage = 'It looks like you have been editing something. '
                    + 'If you leave before saving, your changes will be lost.';

                (e || window.event).returnValue = confirmationMessage; //Gecko + IE
                return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.                
            }
            else {
                return undefined;
            }

        });
    };

    //window.onresize = function () {
    //    var mainwidth = window.innerWidth;
    //    alert(mainwidth);
    //    document.getElementsByClassName("jexcel_content").style.width = "500px !important";
    //};    

    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    }

    $scope.startcloning = function () {

        $http({
            method: 'GET',
            url: '../Resource/getprojectname'
        }).then(function (response) {

            $scope.temp_cloneprojectNumber = response.data[0].ProjectNumber;
            $scope.temp_cloneprojectname = response.data[0].ProjectName;
            $scope.temp_cloneversion = response.data[0].VersionNumber;

            document.getElementById('cloneproject').style.display = 'block';
            $scope.clonealert = false;
            $scope.model_newProjectID = $scope.temp_cloneprojectNumber + '_V' + $scope.temp_cloneversion;
            $scope.model_newProjectName = $scope.temp_cloneprojectname + '_V' + $scope.temp_cloneversion;

        }, function (error) {
            console.log(error);
        });
    }

    $scope.startsubmitthecloning = function () {

        if ($scope.model_newProjectID == "" || $scope.model_newProjectID == undefined) {
            $scope.clonealert = true;
            $scope.clonemessage = "Please enter new project id";
        }
        else if ($scope.model_newProjectName == "" || $scope.model_newProjectName == undefined) {
            $scope.clonealert = true;
            $scope.clonemessage = "Please enter new project name";
        }
        else {

            updateprogressbar(50, "Cloning started...");
            $http({
                method: 'POST',
                url: '../Projects/cloneproformaproject_fromproforma',
                params: { "strNewProjectName": $scope.model_newProjectName, "strNewProjectID": $scope.model_newProjectID }
            }).then(function (response) {
                document.getElementById('cloneproject').style.display = 'none';
                updateprogressbar(100, "Completed...");
                document.getElementById('progressbar').style.display = 'none';

                var element = document.getElementById('dropProjects');
                element.innerHTML = "";

                jSuite_dropProjects = jSuites.dropdown(document.getElementById('dropProjects'), {
                    url: '../Resource/getprojectlist',
                    autocomplete: true,
                    placeholder: "Select Project",
                    lazyLoading: true,
                    multiple: false,
                    width: '100%',
                    value: projectname,
                    onchange: loadresorucetabs,
                });

            }, function (error) {
                console.log(error);
            });
        }
    }

    $scope.closecloning = function () {
        document.getElementById('cloneproject').style.display = 'none';
    }

    $scope.exporttoexcel = function () {

        var activetabname = document.getElementById('activetabid').innerHTML;
        if (activetabname == "resource") {
            updateprogressbar(50, "Exporting resource data into excel format, please wait...");
            $http({
                method: 'GET',
                url: '../Resource/export_resourcedata'
            }).then(function (response) {
                downloadURI("../upload/" + response.data, response.data);
                updateprogressbar(100, "Completed...");
                document.getElementById('progressbar').style.display = 'none';
            }, function (error) {
                console.log(error);
            });

        } else if (activetabname == "capital") {
            updateprogressbar(50, "Exporting capital data into excel format, please wait...");
            $http({
                method: 'GET',
                url: '../Resource/export_capitaldata'
            }).then(function (response) {
                downloadURI("../upload/" + response.data, response.data);
                updateprogressbar(100, "Completed...");
                document.getElementById('progressbar').style.display = 'none';
            }, function (error) {
                console.log(error);
            });
        } else if (activetabname == "capitallabor") {
            updateprogressbar(50, "Exporting capitallabor data into excel format, please wait...");
            $http({
                method: 'GET',
                url: '../Resource/export_capitallabordata'
            }).then(function (response) {
                downloadURI("../upload/" + response.data, response.data);
                updateprogressbar(100, "Completed...");
                document.getElementById('progressbar').style.display = 'none';
            }, function (error) {
                console.log(error);
            });
        } else if (activetabname == "directexpenses") {
            updateprogressbar(50, "Exporting DE data into excel format, please wait...");
            $http({
                method: 'GET',
                url: '../Resource/export_dedata'
            }).then(function (response) {
                downloadURI("../upload/" + response.data, response.data);
                updateprogressbar(100, "Completed...");
                document.getElementById('progressbar').style.display = 'none';
            }, function (error) {
                console.log(error);
            });
        } else if (activetabname == "summary") {
            updateprogressbar(50, "Exporting summary data into excel format, please wait...");
            $http({
                method: 'GET',
                url: '../Resource/export_summarydata'
            }).then(function (response) {
                downloadURI("../upload/" + response.data, response.data);
                updateprogressbar(100, "Completed...");
                document.getElementById('progressbar').style.display = 'none';
            }, function (error) {
                console.log(error);
            });
        }
    }

    $scope.SaveFile = function () {
        FileUploadService.UploadFile($scope.SelectedFileForUpload).then(function (d) {
            setTimeout(function () {

                var activetabname = document.getElementById('activetabid').innerHTML;
                if (activetabname == "resource") {
                    refreshresourcedata();
                } else if (activetabname == "capital") {
                    refreshcapitaldata();
                } else if (activetabname == "capitallabor") {
                    refreshcapitallabordata();
                } else if (activetabname == "directexpenses") {
                    refreshdedata();
                }

            }, 2000)
        }, function (e) {
            alert(e);
        });
    };

    //loadsummarydata();

    //function loadsummarydata() {
    //    $http({
    //        method: 'GET',
    //        url: '../Resource/getsummarydata'
    //    }).then(function (response) {
    //        dssummary = response.data;
    //    }, function (error) {
    //        console.log(error);
    //    });
    //}

    function updateskillfilter() {
        $http({
            method: 'GET',
            url: '../Resource/getskillmaster'
        }).then(function (response) {
            skillmaster = response.data;
        }, function (error) {
            console.log(error);
        });
    }
    function getskillsdata() {
        $http({
            method: 'GET',
            url: '../Resource/SkillData'
        }).then(function (response) {
            rowRequiredSkills = response.data;
            update_resourcedata();
        }, function (error) {
            console.log(error);
        });
    }
    function dropdown_update_Business() {
        $http({
            method: 'GET',
            url: '../Resource/getBusiness'
        }).then(function (response) {
            rowbusiness = response.data;
            dropdown_update_HighOrg();
        }, function (error) {
            console.log(error);
        });
    }

    function update_resourcedata() {
        formSubmitting = true;
        $http({
            method: 'GET',
            url: '../Resource/getresourcedata'
        }).then(function (response) {
            dsResource = response.data;
            bindresourcedropdowns();
        }, function (error) {
            console.log(error);
        });
    }

    function dropdown_update_BU() {
        $http({
            method: 'POST',
            url: '../Resource/getBU'
        }).then(function (response) {
            rowbu = response.data;
            dropdown_update_OperatingExpenseWBS();
        }, function (error) {
            console.log(error);
        });
    }

    

    function dropdown_update_OperatingExpenseWBS() {
        $http({
            method: 'GET',
            url: '../Resource/getOperatingExpenseWBS'
        }).then(function (response) {
            rowOperatingExpenseWBS = response.data;
            dropdown_update_Business();
        }, function (error) {
            console.log(error);
        });
    }

    function refresh_OperatingExpenseWBS() {
        $http({
            method: 'GET',
            url: '../Resource/getOperatingExpenseWBS'
        }).then(function (response) {
            rowOperatingExpenseWBS = response.data;

            //refreshing resource operating expense WBS number
            document.getElementById('dropOperatingExpenseWBS').innerHTML = '';

            jSuite_dropOperatingExpenseWBS = jSuites.dropdown(document.getElementById('dropOperatingExpenseWBS'), {
                data: rowOperatingExpenseWBS,
                autocomplete: true,
                placeholder: "Select Operating Expense WBS",
                lazyLoading: false,
                multiple: false,
                width: '100%'
            });
            refreshresourcedata();
            //refreshing resource table operating expense WBS number column
            obj.options.columns[2].source = rowOperatingExpenseWBS;

        }, function (error) {
            console.log(error);
        });
    }

    function refresh_OperatingExpenseWBSDE() {
        $http({
            method: 'GET',
            url: '../Resource/getOperatingExpenseWBS'
        }).then(function (response) {
            rowOperatingExpenseWBS = response.data;

            //refreshing resource operating expense WBS number
            document.getElementById('dropOperatingExpenseWBSDE').innerHTML = '';
            jSuite_dropOperatingExpenseWBSDE = jSuites.dropdown(document.getElementById('dropOperatingExpenseWBSDE'), {
                data: rowOperatingExpenseWBS,
                autocomplete: true,
                placeholder: "Select Operating Expense WBS",
                lazyLoading: false,
                multiple: false,
                width: '100%'
            });
            refreshdedata();
            //refreshing resource table operating expense WBS number column
            objdirectexpenses.options.columns[2].source = rowOperatingExpenseWBS;

        }, function (error) {
            console.log(error);
        });
    }

    function refresh_CapitalLaborExpenditureWBS() {

        $http({
            method: 'GET',
            url: '../Resource/getCapitalExpenditureWBS'
        }).then(function (response) {
            datasourceCapitalExpenditureWBS = response.data;
            document.getElementById('dropCapitalExpenditureWBS').innerHTML = '';
            jSuite_dropCapitalExpenditureWBS = jSuites.dropdown(document.getElementById('dropCapitalExpenditureWBS'), {
                data: datasourceCapitalExpenditureWBS,
                autocomplete: true,
                placeholder: "Select Capital Expenditure WBS",
                lazyLoading: false,
                multiple: false,
                width: '100%'
            });
            refreshcapitallabordata();
            objcapitallabour.options.columns[2].source = datasourceCapitalExpenditureWBS;
        }, function (error) {
            console.log(error);
        });
    }


    function refresh_CapitalExpenditureWBS() {

        $http({
            method: 'GET',
            url: '../Resource/getCapitalExpenditureWBS'
        }).then(function (response) {
            datasourceCapitalExpenditureWBS = response.data;
            document.getElementById('dropCapitalExpenditureWBSCapital').innerHTML = '';
            jSuite_dropCapitalExpenditureWBS = jSuites.dropdown(document.getElementById('dropCapitalExpenditureWBSCapital'), {
                data: datasourceCapitalExpenditureWBS,
                autocomplete: true,
                placeholder: "Select Capital Expenditure WBS",
                lazyLoading: false,
                multiple: false,
                width: '100%'
            });
            refreshcapitaldata();
            objcapital.options.columns[2].source = datasourceCapitalExpenditureWBS;
        }, function (error) {
            console.log(error);
        });
    }

    function dropdown_update_HighOrg() {
        $http({
            method: 'POST',
            url: '../Resource/getHighOrg'
        }).then(function (response) {
            rowhighorg = response.data;
            dropdown_update_MidOrgData();
        }, function (error) {
            console.log(error);
        });
    }
    function dropdown_update_MidOrgData() {
        $http({
            method: 'POST',
            url: '../Resource/getMidOrgData'
        }).then(function (response) {
            rowMidOrg = response.data;
            dropdown_update_TeamData();
        }, function (error) {
            console.log(error);
        });
    }
    function dropdown_update_TeamData() {
        $http({
            method: 'POST',
            url: '../Resource/getTeamData'
        }).then(function (response) {
            rowTeam = response.data;
            getskillsdata();
        }, function (error) {
            console.log(error);
        });
    }

    function default_tabsetting(value) {

        //nav-link active
        $scope.tabsummaryclass = "nav-link";
        $scope.tabresourceclass = "nav-link";
        $scope.tabcapitallaborclass = "nav-link";
        $scope.tabdirectexpensesclass = "nav-link";
        $scope.tabcheckbookclass = "nav-link";
        $scope.tabcapitalclass = "nav-link";

        //tab-pane active
        document.getElementById('Summary').className = "tab-pane fade";
        document.getElementById('resource').className = "tab-pane fade";
        document.getElementById('capital').className = "tab-pane fade";
        document.getElementById('capitallabour').className = "tab-pane fade";
        document.getElementById('directexpenses').className = "tab-pane fade";
        document.getElementById('checkbook').className = "tab-pane fade";

        if (value === "summary") {
            $scope.tabsummaryclass = "nav-link active";
            document.getElementById('Summary').className = "tab-pane active";
        }
        else if (value === "resource") {
            $scope.tabresourceclass = "nav-link active";
            document.getElementById('resource').className = "tab-pane active";

        }
        else if (value === "capital") {
            $scope.tabcapitalclass = "nav-link active";
            document.getElementById('capital').className = "tab-pane active";
        }
        else if (value === "capitallabor") {

            $scope.tabcapitallaborclass = "nav-link active";
            document.getElementById('capitallabour').className = "tab-pane active";

        }
        else if (value === "directexpenses") {

            $scope.tabdirectexpensesclass = "nav-link active";
            document.getElementById('directexpenses').className = "tab-pane active";

        }
        else if (value === "checkbook") {

            $scope.tabcheckbookclass = "nav-link active";
            document.getElementById('checkbook').className = "tab-pane active";

        }      

        document.getElementById("exporttoexcel").focus();
    }
    $scope.updatetabeinfo = function (value) {

        document.getElementById('activetabid').innerHTML = value;
        if (value === "summary") {
            if (capitalSubmitting == false || formSubmitting == false || capitallaborSubmitting == false || deSubmitting == false) {
                showalertsavechangesalert('It looks like you have been editing something, so please savechanges!');
            }
            else {
                bindsummaryfisyeardropdown();
                default_tabsetting("summary");
                document.getElementById('drop_Summary_Months').setAttribute('disabled', 'disabled');
                document.getElementById('drop_Summary_Quarter').setAttribute('disabled', 'disabled');
            }
        }
        else if (value === "resource") {
            if (capitalSubmitting === false || capitallaborSubmitting === false || deSubmitting === false) {
                showalertsavechangesalert('It looks like you have been editing something, so please savechanges!');
            }
            else {
                updateprogressbar(20, "Resource is loading...");
                updateskillfilter();
                //refreshresourcedata();
                dropdown_update_BU();
                default_tabsetting("resource");
            }
        }
        else if (value === "capital") {
            if (formSubmitting === false || capitallaborSubmitting === false || deSubmitting === false) {
                showalertsavechangesalert('It looks like you have been editing something, so please savechanges!');
            }
            else {
                updateprogressbar(20, "Capital is loading...");
                getcapital();
                default_tabsetting("capital");
            }
        }
        else if (value === "capitallabor") {

            if (capitalSubmitting === false || formSubmitting === false || deSubmitting === false) {
                showalertsavechangesalert('It looks like you have been editing something, so please savechanges!');
            }
            else {
                updateprogressbar(20, "CapitalLabor is loading...");
                document.getElementById('dropBU_CL').setAttribute('disabled', 'disabled');
                document.getElementById('dropHighOrg_CL').setAttribute('disabled', 'disabled');
                document.getElementById('dropMidOrg_CL').setAttribute('disabled', 'disabled');
                document.getElementById('dropTeam_CL').setAttribute('disabled', 'disabled');
                document.getElementById('dropRequiredSkills_CL').setAttribute('disabled', 'disabled');
                getcapitallabour();
                default_tabsetting("capitallabor");
            }
        }
        else if (value === "directexpenses") {

            if (capitalSubmitting === false || formSubmitting === false || capitallaborSubmitting === false) {
                showalertsavechangesalert('It looks like you have been editing something, so please savechanges!');
            }
            else {

                updateprogressbar(20, "Direct Expenses is loading...");
                getDirectExpenses();
                default_tabsetting("directexpenses");
            }
        }
        else if (value === "checkbook") {
            default_tabsetting("checkbook");
        }
        

        getlastmodifieddata();
    }

    function getcapital() {
        capitalSubmitting = true;
        $http({
            method: 'GET',
            url: '../Resource/getcapitaldata'
        }).then(function (response) {
            dsCapital = response.data;
            if (response.data.length === 0)
                showalert('No records found!');
            loadcapitaldata();
        }, function (error) {
            console.log(error);
        });
    }
    function getDirectExpenses() {
        deSubmitting = true;
        $http({
            method: 'GET',
            url: '../Resource/getDirectExpensedata'
        }).then(function (response) {
            dsDirectExpense = response.data;
            if (dsDirectExpense.length === 0) {
                showalert('No records found!');
            }
            loaddirectexpenses();
        }, function (error) {
            console.log(error);
        });
    }

    function loadcapitallabordrops() {

        dropdown_update_BU_CL();
        function dropdown_update_BU_CL() {
            $http({
                method: 'POST',
                url: '../Resource/getBU'
            }).then(function (response) {
                rowbu = response.data;
                dropdown_update_Business_CL();
            }, function (error) {
                console.log(error);
            });
        }

        function dropdown_update_Business_CL() {
            $http({
                method: 'GET',
                url: '../Resource/getBusiness'
            }).then(function (response) {
                rowbusiness = response.data;
                dropdown_update_HighOrg_CL();
            }, function (error) {
                console.log(error);
            });
        }

        function dropdown_update_HighOrg_CL() {
            $http({
                method: 'POST',
                url: '../Resource/getHighOrg'
            }).then(function (response) {
                rowhighorg = response.data;
                dropdown_update_MidOrgData_CL();
            }, function (error) {
                console.log(error);
            });
        }


        function dropdown_update_MidOrgData_CL() {
            $http({
                method: 'POST',
                url: '../Resource/getMidOrgData'
            }).then(function (response) {
                rowMidOrg = response.data;
                dropdown_update_TeamData_CL();
            }, function (error) {
                console.log(error);
            });
        }

        function dropdown_update_TeamData_CL() {
            $http({
                method: 'POST',
                url: '../Resource/getTeamData'
            }).then(function (response) {
                rowTeam = response.data;
                getskillsdata_CL();
            }, function (error) {
                console.log(error);
            });
        }

        function getskillsdata_CL() {
            $http({
                method: 'GET',
                url: '../Resource/SkillData'
            }).then(function (response) {
                rowRequiredSkills = response.data;
                bindcapitallabourdata();
            }, function (error) {
                console.log(error);
            });
        }
    }

    function getcapitallabour() {
        capitallaborSubmitting = true;
        $http({
            method: 'GET',
            url: '../Resource/getcapitallabourdata'
        }).then(function (response) {
            dsCapitalLabour = response.data;

            $http({
                method: 'GET',
                url: '../Resource/getpriority'
            }).then(function (response) {
                datasourcePriority = response.data;

                $http({
                    method: 'GET',
                    url: '../Resource/getCapitalCategory'
                }).then(function (response) {
                    datasourceCapitalCategory = response.data;

                    $http({
                        method: 'GET',
                        url: '../Resource/getCapitalType'
                    }).then(function (response) {
                        datasourceCapitalType = response.data;

                        $http({
                            method: 'GET',
                            url: '../Resource/getCapitalExpenditureWBS'
                        }).then(function (response) {
                            datasourceCapitalExpenditureWBS = response.data;

                            $http({
                                method: 'GET',
                                url: '../Resource/getAOPProject'
                            }).then(function (response) {
                                datasourceAOPProject = response.data;
                                loadcapitallabordrops();                                
                                if (dsCapitalLabour.length === 0) {
                                    showalert('No records found!');
                                }
                            }, function (error) {
                                console.log(error);
                            });

                        }, function (error) {
                            console.log(error);
                        });

                    }, function (error) {
                        console.log(error);
                    });

                }, function (error) {
                    console.log(error);
                });

            }, function (error) {
                console.log(error);
            });

        }, function (error) {
            console.log(error);
        });
    }
    function getprojectname() {

        updateprogressbar(20, "Validating selected project...");

        $http({
            method: 'GET',
            url: '../Resource/getprojectname'
        }).then(function (response) {
            if (response.data.length == 0) {
                document.getElementById('progressbar').style.display = 'none';
                showalert('Please select project!');
                setTimeout(function () {
                    $scope.$apply(function () {
                        window.location.href = '../index/Index';
                    });
                }, 2000);
            } else {
                projectname = response.data[0].ProjectName;
                jSuite_dropProjects.setValue(projectname);

                //dropdown_update_BU();
                loaddefaultsummary();
                getusername();
                //getlastmodifieddata();

            }
        }, function (error) {
            console.log(error);
        });
    }

    function showalert(value) {
        document.getElementById('alertbox').style.display = 'block';
        document.getElementById('alerttext').innerHTML = value;
        setTimeout(function () {
            $scope.$apply(function () {
                document.getElementById('alertbox').style.display = 'none';
            });
        }, 1000);
    }

    function showalertsavechangesalert(value) {
        document.getElementById('alertbox').style.display = 'block';
        document.getElementById('alerttext').innerHTML = value;
        setTimeout(function () {
            $scope.$apply(function () {
                document.getElementById('alertbox').style.display = 'none';
            });
        }, 2000);
    }
    function loadresorucetabs() {

        var newprojectname = jSuite_dropProjects.getText();
        document.getElementById('resourcetotal').innerHTML = "0";
        document.getElementById('capitaltotal').innerHTML = "0";
        document.getElementById('capitallabortotal').innerHTML = "0";
        document.getElementById('detotal').innerHTML = "0";

        if (newprojectname === "") {

            showalert('please select a project!');

        }
        else {

            $http({
                method: 'POST',
                url: '../index/updateprojectname',
                params: { "strProjectName": newprojectname }
            }).then(function (response) {

                var activetab = document.getElementById('activetabid').innerHTML;

                if (activetab === "summary")
                    bindsummaryfisyeardropdown();
                else if (activetab === "resource") {
                    refresh_OperatingExpenseWBS();
                }
                else if (activetab === "capital")
                    refresh_CapitalExpenditureWBS();
                else if (activetab === "capitallabor")
                    refresh_CapitalLaborExpenditureWBS();
                else if (activetab === "directexpenses")
                    refresh_OperatingExpenseWBSDE();

            }, function (error) {
                console.log(error);
            });

        }

    }

    function loaddirectexpenses() {

        document.getElementById('drop_DE_ExpenseCategory').innerHTML = "";
        document.getElementById('dropOperatingExpenseWBSDE').innerHTML = "";
        document.getElementById('tbl_directexpenses').innerHTML = "";
        var jSuite_drop_drop_DE_ExpenseCategory = [];

        $http({
            method: 'GET',
            url: '../Resource/getOperatingExpenseWBS'
        }).then(function (response) {
            rowOperatingExpenseWBS = response.data;
            //refreshing resource operating expense WBS number
            document.getElementById('dropOperatingExpenseWBS').innerHTML = '';
            jSuite_dropOperatingExpenseWBSDE = jSuites.dropdown(document.getElementById('dropOperatingExpenseWBSDE'), {
                data: rowOperatingExpenseWBS,
                autocomplete: true,
                placeholder: "Select Operating Expense WBS",
                lazyLoading: false,
                multiple: false,
                width: '100%'
            });

            $http({
                method: 'GET',
                url: '../Resource/getexpensecategory'
            }).then(function (response) {
                rowDirectExpense = response.data;

                jSuite_drop_drop_DE_ExpenseCategory = jSuites.dropdown(document.getElementById('drop_DE_ExpenseCategory'), {
                    data: rowDirectExpense,
                    autocomplete: true,
                    placeholder: "Select Direct Expense",
                    lazyLoading: false,
                    multiple: false,
                    width: '100%',
                });

                load_directexpensedatatable();

            }, function (error) {
                console.log(error);
            });

            //refreshing resource table operating expense WBS number column
            objdirectexpenses.options.columns[2].source = rowOperatingExpenseWBS;
        }, function (error) {
            console.log(error);
        });

        
        $scope.cleardirectexpenseinfo = function () {
            clear_de();
        }

        function clear_de() {
            jSuite_dropOperatingExpenseWBSDE.reset();
            jSuite_drop_drop_DE_ExpenseCategory.reset();
            document.getElementById('de_description').value = "";
        }

        $scope.adddirectexpenseinfo = function () {

            if (deSubmitting == false) {
                showalertsavechangesalert('It looks like you have been editing something in direct expense, so please savechanges!');
            }
            else {

                //var strWBSnumber = document.getElementById('de_WBSNumber').value;
                var de_WBSnumber = jSuite_dropOperatingExpenseWBSDE.getText();
                var de_description = document.getElementById('de_description').value;
                var de_ExpenseCategory = jSuite_drop_drop_DE_ExpenseCategory.getText();
                var de_projects = jSuite_dropProjects.getText();

                if (de_WBSnumber === "") {
                    showalert('Please select Operating Expense WBS!');
                } else if (de_ExpenseCategory === "") {
                    showalert('Please select expense category!');
                } else {

                    updateprogressbar(20, "Data is inserting...");

                    $http({
                        method: 'POST',
                        url: '../Resource/adddirectexpenseInfo',
                        params: {
                            "strWBSNumber": de_WBSnumber,
                            "strProjectName": de_projects,
                            "strExpensecategory": de_ExpenseCategory,
                            "strdescription": de_description
                        }
                    }).then(function (response) {

                        updateprogressbar(80, "Data is loading...");

                        $http({
                            method: 'GET',
                            url: '../Resource/getDirectExpensedata'
                        }).then(function (response) {
                            if (response.data.length > 0) {

                                var twidth = document.getElementById("mainbody").offsetWidth
                                var mywidth = (twidth - 108) + "px";
                                var elms = document.getElementById("tbl_directexpenses").getElementsByTagName("*");
                                elms[5].setAttribute("style", "width:" + mywidth);

                                if (response.data.length === 1) {
                                    document.getElementById('tbl_directexpenses').innerHTML = "";
                                    dsDirectExpense = response.data;
                                    load_directexpensedatatable();
                                }
                                else {
                                    objdirectexpenses.setData(response.data);
                                }

                                updateprogressbar(100, "Data is loading...");
                                document.getElementById('progressbar').style.display = 'none';
                                //clear_de();
                            }

                        }, function (error) {
                            console.log(error);
                        });

                    }, function (error) {
                        console.log(error);
                    });
                }
            }

        }

        updateprogressbar(100, "Data is loading...");
        document.getElementById('progressbar').style.display = 'none';
    }

    function load_directexpensedatatable() {

        var de_selectionActive = function (instance, x1, y1, x2, y2, origin) {

            document.getElementById('detotal').innerHTML = "0";
            if ((x1 >= 6 && x1 <= 17) && (x2 >= 6 && x2 <= 17)) {
                var value = 0;
                for (var i = y1; i <= y2; i++) {
                    for (var j = x1; j <= x2; j++) {
                        var objvalue = objdirectexpenses.getValueFromCoords(j, i);
                        value = parseFloat(value) + parseFloat(objvalue);
                    }
                }
                document.getElementById('detotal').innerHTML = value.toFixed(2);
            }

            s_startvalue = y1;
            s_endvalue = y2;
        }

        var load_de = function (instance) {

            var datavalues = document.getElementById("tbl_directexpenses").getElementsByTagName("thead");
            var subchilditem = datavalues[0].lastChild.getElementsByTagName("td");
            subchilditem[1].style = "display:none";
            subchilditem[2].style = "display:none";

            var height = parseInt(window.innerHeight) - 210;
            var subelms = document.getElementById("tbl_directexpenses").getElementsByTagName("*");
            var vartable = subelms[5].getAttribute("style");
            var newstyle = vartable + "; max-height: " + height + "px;"
            subelms[5].setAttribute("style", newstyle);

            updateprogressbar(100, "Completed....");
            document.getElementById('progressbar').style.display = 'none';
            document.getElementById('directexpenses').setAttribute("style", "padding-left:20px; padding-right:20px; padding-bottom:10px; opacity:1;")
        }
        var de_deleted = function (instance) {

            for (i = s_startvalue; i <= s_endvalue; i++) {

                //creates json object of jexcel
                var jsonobj = objdirectexpenses.getJson(false);

                //getting particular row from json object       
                var rowobj = jsonobj[i]; //row id getting from event

                directexpenses_deleteInfo.push(rowobj);
                if (directexpenses_updatedInfo.find(x => x.MasterID === rowobj.MasterID)) {
                    index = directexpenses_updatedInfo.indexOf(directexpenses_updatedInfo.find(x => x.ProjectNumber === rowobj.ProjectNumber)); //getting index of that rec
                    directexpenses_updatedInfo.splice(index, 1); //remove the existing rec from object 
                }

                document.getElementById('de_update_notificationnumber1').innerHTML = directexpenses_updatedInfo.length;
                document.getElementById('de_delete_notificationnumber1').innerHTML = directexpenses_deleteInfo.length;

                if (parseInt(directexpenses_updatedInfo.length) > 0) {
                    document.getElementById('de_update_notificationnumber1').style.display = 'initial';
                    document.getElementById('de_update_notificationnumber2').style.display = 'initial';
                }
                else {
                    document.getElementById('de_update_notificationnumber1').style.display = 'none';
                    document.getElementById('de_update_notificationnumber2').style.display = 'none';
                }

                if (parseInt(directexpenses_deleteInfo.length) > 0) {
                    document.getElementById('de_delete_notificationnumber1').style.display = 'initial';
                    document.getElementById('de_delete_notificationnumber2').style.display = 'initial';
                }
                else {
                    document.getElementById('de_delete_notificationnumber1').style.display = 'none';
                    document.getElementById('de_delete_notificationnumber2').style.display = 'none';
                }
                setdeSubmitting();
                var screenst = $scope.ProjectsTable_fullscreen;
                loadfullscreencss(screenst);
            }

        }
        var de_update = function (instance, cell, col, row, value) {

            //creates json object of jexcel
            var jsonobj = objdirectexpenses.getJson(false);

            //getting particular row from json object       
            var rowobj = jsonobj[row]; //row id getting from event

            //check for existance of respective rec in global object
            if (directexpenses_updatedInfo.find(x => x.MasterID === rowobj.MasterID)) {
                index = directexpenses_updatedInfo.indexOf(directexpenses_updatedInfo.find(x => x.MasterID === rowobj.MasterID)); //getting index of that rec
                directexpenses_updatedInfo.splice(index, 1); //remove the existing rec from object 
                directexpenses_updatedInfo.push(rowobj); //pushing newly updated rec
            }
            else
                directexpenses_updatedInfo.push(rowobj); //pushing updated rec for the first time

            document.getElementById('de_update_notificationnumber1').innerHTML = directexpenses_updatedInfo.length;

            if (parseInt(directexpenses_updatedInfo.length) > 0) {
                document.getElementById('de_update_notificationnumber1').style.display = 'initial';
                document.getElementById('de_update_notificationnumber2').style.display = 'initial';
            }
            else {
                document.getElementById('de_update_notificationnumber1').style.display = 'none';
                document.getElementById('de_update_notificationnumber2').style.display = 'none';
            }
            setdeSubmitting();
            var screenst = $scope.ProjectsTable_fullscreen;
            loadfullscreencss(screenst);
        }

        objdirectexpenses = jexcel(document.getElementById('tbl_directexpenses'), {

            data: dsDirectExpense,
            onbeforepaste: function (instance, data, x, y) {
                return false;
            },
            search: true,
            onselection: de_selectionActive,
            onload: load_de,
            onchange: de_update,
            onbeforedeleterow: de_deleted,
            allowManualInsertRow: false,
            tableOverflow: true,
            filters: true,
            footers: [['', '', '', 'Total', '=ROUND(SUM(G1:G300),2)', '=ROUND(SUM(H1:H300),2)', '=ROUND(SUM(I1:I300),2)', '=ROUND(SUM(J1:J300),2)', '=ROUND(SUM(K1:K300),2)', '=ROUND(SUM(L1:L300),2)', '=ROUND(SUM(M1:M300),2)', '=ROUND(SUM(N1:N300),2)', '=ROUND(SUM(O1:O300),2)', '=ROUND(SUM(P1:P300),2)', '=ROUND(SUM(Q1:Q300),2)', '=ROUND(SUM(R1:R300),2)', '']],
            tableWidth: mainwidth,
            columns: [
                { type: 'hidden', title: 'ID', width: 30 },
                { type: 'hidden', title: 'Type', width: 100 },
                { type: 'dropdown', title: 'WBSNumber', width: 150, source: rowOperatingExpenseWBS, autocomplete: true },
                { type: 'dropdown', title: 'Expense Category', width: de_mainwidth, source: rowDirectExpense, autocomplete: true },
                { type: 'text', title: 'Description', width: de_mainwidth },
                { type: 'text', title: 'FYear', width: 60, maxlength: 4 },
                { type: 'number', title: 'MAY', width: 60 },
                { type: 'number', title: 'JUN', width: 60 },
                { type: 'number', title: 'JULY', width: 60 },
                { type: 'number', title: 'AUG', width: 60 },
                { type: 'number', title: 'SEP', width: 60 },
                { type: 'number', title: 'OCT', width: 60 },
                { type: 'number', title: 'NOV', width: 60 },
                { type: 'number', title: 'DEC', width: 60 },
                { type: 'number', title: 'JAN', width: 60 },
                { type: 'number', title: 'FEB', width: 60 },
                { type: 'number', title: 'MAR', width: 60 },
                { type: 'number', title: 'APR', width: 60 },
                { type: 'text', readOnly: true, title: 'CreatedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'CreatedOn', width: 80 },
                { type: 'text', readOnly: true, title: 'ModifiedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'ModifiedOn', width: 80 }
            ],
            contextMenu: function (obj) {
                var items = [];

                if (obj.options.allowDeleteRow == true) {
                    items.push({
                        title: obj.options.text.deleteSelectedRows,
                        onclick: function () {
                            if (confirm('Are you sure do you want to delete?'))
                                obj.deleteRow(obj.getSelectedRows().length ? undefined : parseInt(y));
                        }
                    });
                }
                items.push({ type: 'line' });
                items.push({
                    title: "Duplicate",
                    onclick: function () {
                        for (i = s_startvalue; i <= s_endvalue; i++) {
                            var jsonobj = objdirectexpenses.getJson(false);
                            var rowobj = jsonobj[i];
                            directexpenses_duplicateInfo.push(rowobj);
                        }
                        savedechanges(true);
                    }
                });

                return items;
            },
            updateTable: function (instance, cell, col, row, val, label, cellName) {

                cell.setAttribute('title', cell.innerHTML);
                // Number formating
                if (col == 5 || col == 6 || col == 7 || col == 8 || col == 9 || col == 10 || col == 11 || col == 12 || col == 13 || col == 14 || col == 15 || col == 16 || col == 17) {
                    cell.onkeypress = function isNumberKey(evt) {
                        var charCode = (evt.which) ? evt.which : evt.keyCode;
                        if (charCode != 46 && charCode != 45 && charCode > 31
                            && (charCode < 48 || charCode > 57))
                            return false;
                        return true;
                    };

                    if (col != 5) {
                        cell.innerHTML = Number.parseFloat(val).toFixed(2);
                    }

                    if (val === "") {
                        cell.innerHTML = '0.00';
                    }

                    if (val < 0) {
                        cell.style.color = 'red';
                    }
                    else {
                        cell.style.color = 'black';
                    }
                }
            },
            oncreateeditor: function (el, cell, x, y) {
                if (x == 5) {
                    var config = el.jexcel.options.columns[x].maxlength;
                    cell.children[0].setAttribute('maxlength', config);
                }
            }
        });

    }

    $scope.save_de_changes = function () {
        savedechanges(false);
    }

    $scope.discard_de_changes = function () {

        deSubmitting = true;
        document.getElementById('de_notification').style.display = 'none';
        document.getElementById('de_update_notificationnumber1').innerHTML = 0;
        document.getElementById('de_delete_notificationnumber1').innerHTML = 0;
        directexpenses_updatedInfo = [];
        directexpenses_deleteInfo = [];
        directexpenses_duplicateInfo = [];
        refreshdedata();
    }

    function savedechanges(status) {

        updateprogressbar(45, "Saving changes....");

        var data = {
            update: directexpenses_updatedInfo,
            delete: directexpenses_deleteInfo,
            duplicate: directexpenses_duplicateInfo
        };

        $http({
            method: 'POST',
            url: '../Resource/submitdechanges',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {

            getlastmodifieddata();
            deSubmitting = true;
            if (status === true) {
                $http({
                    method: 'GET',
                    url: '../Resource/getDirectExpensedata'
                }).then(function (response) {
                    dsDirectExpense = response.data;
                    objdirectexpenses.setData(response.data);
                    updateprogressbar(100, "Data is loading...");
                    document.getElementById('progressbar').style.display = 'none';
                    directexpenses_duplicateInfo = [];
                    savechangesinfullscreenmode();
                }, function (error) {
                    console.log(error);
                });
            }
            else {
                updateprogressbar(100, "Saving changes....");
                document.getElementById('progressbar').style.display = 'none';
                document.getElementById('de_notification').style.display = 'none';
                document.getElementById('de_update_notificationnumber1').innerHTML = 0;
                document.getElementById('de_delete_notificationnumber1').innerHTML = 0;
                directexpenses_updatedInfo = [];
                directexpenses_deleteInfo = [];
                directexpenses_duplicateInfo = [];
                savechangesinfullscreenmode();
            }

        }, function (error) {
            console.log(error);
        });

    }

    function loadcapitaldata() {

        $http({
            method: 'GET',
            url: '../Resource/getpriority'
        }).then(function (response) {
            datasourcePriority = response.data;

            $http({
                method: 'GET',
                url: '../Resource/getCapitalCategory'
            }).then(function (response) {
                datasourceCapitalCategory = response.data;

                $http({
                    method: 'GET',
                    url: '../Resource/getCapitalType'
                }).then(function (response) {
                    datasourceCapitalType = response.data;

                    //---------------------------

                    $http({
                        method: 'GET',
                        url: '../Resource/getCapitalExpenditureWBS'
                    }).then(function (response) {
                        datasourceCapitalExpenditureWBSCapital = response.data;

                        $http({
                            method: 'GET',
                            url: '../Resource/getAOPProject'
                        }).then(function (response) {
                            datasourceAOPProject = response.data;
                            bindcapitaltabledata();
                        }, function (error) {
                            console.log(error);
                        });

                    }, function (error) {
                        console.log(error);
                    });

                    //---------------------------


                }, function (error) {
                    console.log(error);
                });

            }, function (error) {
                console.log(error);
            });

        }, function (error) {
            console.log(error);
        });
    }

    function bindcapitallabourdata() {

        document.getElementById('tbl_capitallabour').innerHTML = "";
        document.getElementById('drop_capital_labour_Priority').innerHTML = "";
        document.getElementById('drop_Capital_Labor_Category').innerHTML = "";
        document.getElementById('dropBusiness_CL').innerHTML = "";
        document.getElementById('dropBU_CL').innerHTML = "";
        document.getElementById('dropHighOrg_CL').innerHTML = "";
        document.getElementById('dropMidOrg_CL').innerHTML = "";
        document.getElementById('dropTeam_CL').innerHTML = "";
        document.getElementById('dropRequiredSkills_CL').innerHTML = "";
        document.getElementById('dropCapitalExpenditureWBS').innerHTML = "";
        document.getElementById('drop_Capital_AOPProject_CapitalLabor').innerHTML = "";

        jSuite_dropCapitalExpenditureWBS = jSuites.dropdown(document.getElementById('dropCapitalExpenditureWBS'), {
            data: datasourceCapitalExpenditureWBS,
            autocomplete: true,
            placeholder: "Select Capital Expenditure WBS",
            lazyLoading: false,
            multiple: false,
            width: '100%'
        });

        var jSuite_drop_Capitallabour_Priority = jSuites.dropdown(document.getElementById('drop_capital_labour_Priority'), {
            url: '../Resource/getpriority',
            autocomplete: true,
            placeholder: "Select Priority",
            lazyLoading: false,
            multiple: false,
            width: '100%',
        });

        var jSuite_drop_Capital_Labor_Category = jSuites.dropdown(document.getElementById('drop_Capital_Labor_Category'), {
            url: '../Resource/getCapitalCategory',
            autocomplete: true,
            placeholder: "Select Capital Category",
            lazyLoading: false,
            multiple: false,
            width: '100%',
        });

        var jSuite_dropBusiness_CL = jSuites.dropdown(document.getElementById('dropBusiness_CL'), {
            url: '../Resource/getBusiness',
            autocomplete: true,
            placeholder: "Select Business",
            lazyLoading: false,
            multiple: false,
            width: '100%',
            onchange: function () {

                var str_business = jSuite_dropBusiness_CL.getText();
                document.getElementById("dropBU_CL").removeAttribute('disabled');

                $http({
                    method: 'POST',
                    url: '../Resource/getBU',
                    params: { "strBusiness": str_business }
                }).then(function (response) {
                    var dsBU = response.data;
                    jSuite_dropBU_CL.setData(dsBU);
                    jSuite_dropBU_CL.reset();
                }, function (error) {
                    console.log(error);
                });

            },
        });

        jSuite_drop_Capital_AOPProject_CapitalLabor = jSuites.dropdown(document.getElementById('drop_Capital_AOPProject_CapitalLabor'), {
            url: '../Resource/getAOPProject',
            autocomplete: true,
            placeholder: "Select 5Yr Capital Item",
            lazyLoading: false,
            multiple: false,
            width: '100%',
        });

        var jSuite_dropBU_CL = jSuites.dropdown(document.getElementById('dropBU_CL'), {
            data: [],
            autocomplete: true,
            placeholder: "Select Business Unit",
            lazyLoading: false,
            multiple: false,
            width: '100%',
            onchange: function () {

                var str_business = jSuite_dropBusiness_CL.getText();
                var str_BU = jSuite_dropBU_CL.getText();

                document.getElementById("dropHighOrg_CL").removeAttribute('disabled');

                $http({
                    method: 'POST',
                    url: '../Resource/getHighOrg',
                    params: { "strBusiness": str_business, "strBU": str_BU }
                }).then(function (response) {
                    var dsHighOrg = response.data;
                    jSuite_dropHighOrg_CL.setData(dsHighOrg);
                    jSuite_dropHighOrg_CL.reset();
                }, function (error) {
                    console.log(error);
                });

            },
        });

        var jSuite_dropHighOrg_CL = jSuites.dropdown(document.getElementById('dropHighOrg_CL'), {
            data: [],
            autocomplete: true,
            placeholder: "Select High Org",
            lazyLoading: false,
            multiple: false,
            width: '100%',
            onchange: function () {

                var str_business = jSuite_dropBusiness_CL.getText();
                var str_BU = jSuite_dropBU_CL.getText();
                var str_HightOrg = jSuite_dropHighOrg_CL.getText();

                document.getElementById("dropMidOrg_CL").removeAttribute('disabled');

                $http({
                    method: 'POST',
                    url: '../Resource/getMidOrgData',
                    params: { "strBusiness": str_business, "strBU": str_BU, "strHighOrg": str_HightOrg }
                }).then(function (response) {
                    var dsMidOrg = response.data;
                    jSuite_dropMidOrg_CL.setData(dsMidOrg);
                    jSuite_dropMidOrg_CL.reset();
                }, function (error) {
                    console.log(error);
                });

            },
        });

        var jSuite_dropMidOrg_CL = jSuites.dropdown(document.getElementById('dropMidOrg_CL'), {
            data: [],
            autocomplete: true,
            placeholder: "Select Mid Org",
            lazyLoading: false,
            multiple: false,
            width: '100%',
            onchange: function () {

                var str_business = jSuite_dropBusiness_CL.getText();
                var str_BU = jSuite_dropBU_CL.getText();
                var str_HightOrg = jSuite_dropHighOrg_CL.getText();
                var str_MidOrg = jSuite_dropMidOrg_CL.getText();

                document.getElementById("dropTeam_CL").removeAttribute('disabled');

                $http({
                    method: 'POST',
                    url: '../Resource/getTeamData',
                    params: { "strBusiness": str_business, "strBU": str_BU, "strHighOrg": str_HightOrg, "strMidOrg": str_MidOrg }
                }).then(function (response) {
                    var dsTeam = response.data;
                    jSuite_dropTeam_CL.setData(dsTeam);
                    jSuite_dropTeam_CL.reset();
                }, function (error) {
                    console.log(error);
                });

            },
        });

        var jSuite_dropTeam_CL = jSuites.dropdown(document.getElementById('dropTeam_CL'), {
            data: [],
            autocomplete: true,
            placeholder: "Select Team",
            lazyLoading: false,
            multiple: false,
            width: '100%',
            onchange: function () {

                var str_business = jSuite_dropBusiness_CL.getText();
                var str_BU = jSuite_dropBU_CL.getText();
                var str_HightOrg = jSuite_dropHighOrg_CL.getText();
                var str_MidOrg = jSuite_dropMidOrg_CL.getText();
                var str_Team = jSuite_dropTeam_CL.getText();

                document.getElementById("dropRequiredSkills_CL").removeAttribute('disabled');

                $http({
                    method: 'POST',
                    url: '../Resource/getRequiredSkillData',
                    params: { "strBusiness": str_business, "strBU": str_BU, "strHighOrg": str_HightOrg, "strMidOrg": str_MidOrg, "strTeam": str_Team }
                }).then(function (response) {
                    var dsrequiredskills = response.data;
                    jSuite_dropRequiredSkills_CL.setData(dsrequiredskills);
                    jSuite_dropRequiredSkills_CL.reset();
                }, function (error) {
                    console.log(error);
                });

            },
        });

        var jSuite_dropRequiredSkills_CL = jSuites.dropdown(document.getElementById('dropRequiredSkills_CL'), {
            data: [],
            autocomplete: true,
            placeholder: "Select Required Skills",
            lazyLoading: false,
            multiple: false,
            width: '100%',
        });

        load_capitallabourtabledata();

        $scope.addcapitallaborinfo = function () {

            if (capitallaborSubmitting == false) {
                showalertsavechangesalert('It looks like you have been editing something in capital labor, so please savechanges!');
            }
            else {

                //var capital_labor_wbsnumber = document.getElementById('capitallabour_WBSnumber').value;
                var capital_labor_priority = jSuite_drop_Capitallabour_Priority.getText();
                var capital_labor_capitalcategory = jSuite_drop_Capital_Labor_Category.getText();
                var capital_labor_projects = jSuite_dropProjects.getText();

                var capital_labor_CapitalExpenditureWBS = jSuite_dropCapitalExpenditureWBS.getText();
                var capital_labor_business = jSuite_dropBusiness_CL.getText();
                var capital_labor_bu = jSuite_dropBU_CL.getText();
                var capital_labor_highorg = jSuite_dropHighOrg_CL.getText();
                var capital_labor_midorg = jSuite_dropMidOrg_CL.getText();
                var capital_labor_team = jSuite_dropTeam_CL.getText();
                var capital_labor_requiredskills = jSuite_dropRequiredSkills_CL.getText();
                var capital_labor_AOPProject = jSuite_drop_Capital_AOPProject_CapitalLabor.getText();

                if (capital_labor_projects === "") {
                    showalert('Please select project!');
                } else if (capital_labor_CapitalExpenditureWBS === "") {
                    showalert('Please select Capital Expenditure WBS!');
                } else if (capital_labor_priority === "") {
                    showalert('Please select priority!');
                } else if (capital_labor_capitalcategory === "") {
                    showalert('Please select capital category!');
                } else if (capital_labor_business === "") {
                    showalert('Please select business!');
                } else if (capital_labor_bu === "") {
                    showalert('Please select business unit!');
                } else if (capital_labor_highorg === "") {
                    showalert('Please select high org!');
                } else if (capital_labor_midorg === "") {
                    showalert('Please select mid org!');
                } else if (capital_labor_team === "") {
                    showalert('Please select team!');
                } else if (capital_labor_AOPProject === "") {
                    showalert('Please Select 5Yr Capital Item!');
                } else {

                    updateprogressbar(20, "Data is inserting...");

                    $http({
                        method: 'POST',
                        url: '../Resource/addCapitalLaborInfo',
                        params: {
                            "strProjectName": capital_labor_projects,
                            "strWBSNumber": capital_labor_CapitalExpenditureWBS,
                            "strPriority": capital_labor_priority,
                            "strCapitalCategory": capital_labor_capitalcategory,
                            "strbusiness": capital_labor_business,
                            "strbu": capital_labor_bu,
                            "strhighorg": capital_labor_highorg,
                            "strmidorg": capital_labor_midorg,
                            "strteam": capital_labor_team,
                            "strrequiredskills": capital_labor_requiredskills,
                            "strAOPProject": capital_labor_AOPProject,
                        }
                    }).then(function (response) {

                        updateprogressbar(80, "Data is loading...");

                        $http({
                            method: 'GET',
                            url: '../Resource/getcapitallabourdata'
                        }).then(function (response) {
                            if (response.data.length > 0) {

                                var twidth = document.getElementById("mainbody").offsetWidth
                                var mywidth = (twidth - 108) + "px";
                                var elms = document.getElementById("tbl_capitallabour").getElementsByTagName("*");
                                elms[5].setAttribute("style", "width:" + mywidth);

                                if (response.data.length === 1) {
                                    document.getElementById('tbl_capitallabour').innerHTML = "";
                                    dsCapitalLabour = response.data;
                                    load_capitallabourtabledata();
                                }
                                else {
                                    objcapitallabour.setData(response.data);
                                }


                                updateprogressbar(100, "Data is loading...");
                                document.getElementById('progressbar').style.display = 'none';
                                //clearcapitallaborform();
                            }

                        }, function (error) {
                            console.log(error);
                        });

                    }, function (error) {
                        console.log(error);
                    });

                }
            }

        }

        $scope.clearcapitallabor = function () {
            clearcapitallaborform();
        }

        function clearcapitallaborform() {

            jSuite_drop_Capitallabour_Priority.reset();
            jSuite_drop_Capital_Labor_Category.reset();
            jSuite_dropBusiness_CL.reset();
            jSuite_dropBU_CL.reset();
            jSuite_dropHighOrg_CL.reset();
            jSuite_dropMidOrg_CL.reset();
            jSuite_dropTeam_CL.reset();
            jSuite_dropCapitalExpenditureWBS.reset();
            jSuite_dropRequiredSkills_CL.reset();
            //document.getElementById('capitallabour_WBSnumber').value = "";
            jSuite_drop_Capital_AOPProject_CapitalLabor.reset();

            document.getElementById('dropBU_CL').setAttribute('disabled', 'disabled');
            document.getElementById('dropHighOrg_CL').setAttribute('disabled', 'disabled');
            document.getElementById('dropMidOrg_CL').setAttribute('disabled', 'disabled');
            document.getElementById('dropTeam_CL').setAttribute('disabled', 'disabled');
            document.getElementById('dropRequiredSkills_CL').setAttribute('disabled', 'disabled');
        }

    }

    $scope.clearsummary = function () {
        document.getElementById('drop_Summary_Months').setAttribute('disabled', 'disabled');
        document.getElementById('drop_Summary_Quarter').setAttribute('disabled', 'disabled');
        jSuite_dropSummaryFisYear.reset();
        jSuite_drop_Summary_Months.reset();
        jSuite_drop_Summary_Quarter.reset();
        getsummaryinfo();
    }

    $scope.save_capitallabor_changes = function () {
        savecapitallabor(false);
    }

    $scope.discard_capitallabor_changes = function () {

        capitallaborSubmitting = true;
        document.getElementById('capitallabor_notification').style.display = 'none';
        document.getElementById('capitallabor_update_notificationnumber1').innerHTML = 0;
        document.getElementById('capitallabor_delete_notificationnumber1').innerHTML = 0;
        capitallabor_updatedInfo = [];
        capitallabor_deleteInfo = [];
        capitallabor_duplicateInfo = [];
        refreshcapitallabordata();
    }

    function savecapitallabor(status) {

        updateprogressbar(45, "Saving changes....");

        var data = {
            update: capitallabor_updatedInfo,
            delete: capitallabor_deleteInfo,
            duplicate: capitallabor_duplicateInfo
        };

        $http({
            method: 'POST',
            url: '../Resource/submitcapitallaborchanges',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {

            getlastmodifieddata();
            capitallaborSubmitting = true;

            $http({
                method: 'GET',
                url: '../Resource/getcapitallabourdata'
            }).then(function (response) {
                dsCapitalLabour = response.data;
                objcapitallabour.setData(response.data);

                if (status === true) {
                    updateprogressbar(100, "Data is loading...");
                    document.getElementById('progressbar').style.display = 'none';
                    capitallabor_duplicateInfo = [];
                    savechangesinfullscreenmode();
                }
                else {
                    updateprogressbar(100, "Saving changes....");
                    document.getElementById('progressbar').style.display = 'none';
                    document.getElementById('capitallabor_notification').style.display = 'none';
                    document.getElementById('capitallabor_update_notificationnumber1').innerHTML = 0;
                    document.getElementById('capitallabor_delete_notificationnumber1').innerHTML = 0;
                    capitallabor_updatedInfo = [];
                    capitallabor_deleteInfo = [];
                    capitallabor_duplicateInfo = [];
                    savechangesinfullscreenmode();
                }

            }, function (error) {
                console.log(error);
            });

        }, function (error) {
            console.log(error);
        });

    }

    function load_capitallabourtabledata() {

        var capitallabour_selectionActive = function (instance, x1, y1, x2, y2, origin) {

            document.getElementById('capitallabortotal').innerHTML = "0";
            if ((x1 >= 13 && x1 <= 24) && (x2 >= 13 && x2 <= 24)) {
                var value = 0;
                for (var i = y1; i <= y2; i++) {
                    for (var j = x1; j <= x2; j++) {
                        var objvalue = objcapitallabour.getValueFromCoords(j, i);
                        value = parseFloat(value) + parseFloat(objvalue);
                    }
                }
                document.getElementById('capitallabortotal').innerHTML = value.toFixed(2);
            }

            s_startvalue = y1;
            s_endvalue = y2;
        }

        var load_capitallabor = function (instance) {
            var datavalues = document.getElementById("tbl_capitallabour").getElementsByTagName("thead");
            var subchilditem = datavalues[0].lastChild.getElementsByTagName("td");
            subchilditem[1].style = "display:none";
            subchilditem[2].style = "display:none";

            var height = parseInt(window.innerHeight) - 210;
            var subelms = document.getElementById("tbl_capitallabour").getElementsByTagName("*");
            var vartable = subelms[5].getAttribute("style");
            var newstyle = vartable + "; max-height: " + height + "px;"
            subelms[5].setAttribute("style", newstyle);

            updateprogressbar(100, "Completed....");
            document.getElementById('progressbar').style.display = 'none';
            document.getElementById('capitallabour').setAttribute("style", "padding-left:20px; padding-right:20px; padding-bottom:10px; opacity:1;")
        }
        var capitallabor_deleted = function (instance) {

            for (i = s_startvalue; i <= s_endvalue; i++) {

                //creates json object of jexcel
                var jsonobj = objcapitallabour.getJson(false);

                //getting particular row from json object       
                var rowobj = jsonobj[i]; //row id getting from event

                capitallabor_deleteInfo.push(rowobj);
                if (capitallabor_updatedInfo.find(x => x.MasterID === rowobj.MasterID)) {
                    index = capitallabor_updatedInfo.indexOf(capitallabor_updatedInfo.find(x => x.ProjectNumber === rowobj.ProjectNumber)); //getting index of that rec
                    capitallabor_updatedInfo.splice(index, 1); //remove the existing rec from object 
                }

                document.getElementById('capitallabor_update_notificationnumber1').innerHTML = capitallabor_updatedInfo.length;
                document.getElementById('capitallabor_delete_notificationnumber1').innerHTML = capitallabor_deleteInfo.length;

                if (parseInt(capitallabor_updatedInfo.length) > 0) {
                    document.getElementById('capitallabor_update_notificationnumber1').style.display = 'initial';
                    document.getElementById('capitallabor_update_notificationnumber2').style.display = 'initial';
                }
                else {
                    document.getElementById('capitallabor_update_notificationnumber1').style.display = 'none';
                    document.getElementById('capitallabor_update_notificationnumber2').style.display = 'none';
                }

                if (parseInt(capitallabor_deleteInfo.length) > 0) {
                    document.getElementById('capitallabor_delete_notificationnumber1').style.display = 'initial';
                    document.getElementById('capitallabor_delete_notificationnumber2').style.display = 'initial';
                }
                else {
                    document.getElementById('capitallabor_delete_notificationnumber1').style.display = 'none';
                    document.getElementById('capitallabor_delete_notificationnumber2').style.display = 'none';
                }
                setcapitallaborSubmitting();
                var screenst = $scope.ProjectsTable_fullscreen;
                loadfullscreencss(screenst);
            }

        }
        var capitallabor_update = function (instance, cell, col, row, value) {

            if (col == 5) {
                var columnName = jexcel.getColumnNameFromId([6, row]);
                instance.jexcel.setValue(columnName, '');
            }

            if (col == 6) {
                var columnName = jexcel.getColumnNameFromId([7, row]);
                instance.jexcel.setValue(columnName, '');
            }

            if (col == 7) {
                var columnName = jexcel.getColumnNameFromId([8, row]);
                instance.jexcel.setValue(columnName, '');
            }

            if (col == 8) {
                var columnName = jexcel.getColumnNameFromId([9, row]);
                instance.jexcel.setValue(columnName, '');
            }

            if (col == 9) {
                var columnName = jexcel.getColumnNameFromId([10, row]);
                instance.jexcel.setValue(columnName, '');
            }

            //creates json object of jexcel
            var jsonobj = objcapitallabour.getJson(false);

            //getting particular row from json object       
            var rowobj = jsonobj[row]; //row id getting from event

            //check for existance of respective rec in global object
            if (capitallabor_updatedInfo.find(x => x.MasterID === rowobj.MasterID)) {
                index = capitallabor_updatedInfo.indexOf(capitallabor_updatedInfo.find(x => x.MasterID === rowobj.MasterID)); //getting index of that rec
                capitallabor_updatedInfo.splice(index, 1); //remove the existing rec from object 
                capitallabor_updatedInfo.push(rowobj); //pushing newly updated rec
            }
            else
                capitallabor_updatedInfo.push(rowobj); //pushing updated rec for the first time

            document.getElementById('capitallabor_update_notificationnumber1').innerHTML = capitallabor_updatedInfo.length;

            if (parseInt(capitallabor_updatedInfo.length) > 0) {
                document.getElementById('capitallabor_update_notificationnumber1').style.display = 'initial';
                document.getElementById('capitallabor_update_notificationnumber2').style.display = 'initial';
            }
            else {
                document.getElementById('capitallabor_update_notificationnumber1').style.display = 'none';
                document.getElementById('capitallabor_update_notificationnumber2').style.display = 'none';
            }
            setcapitallaborSubmitting();
            var screenst = $scope.ProjectsTable_fullscreen;
            loadfullscreencss(screenst);
        }

        ddbusinessunitFilter = function (instance, cell, c, r, source) {

            var business = instance.jexcel.getValueFromCoords(c - 1, r);
            var filtereddata = skillmaster.filter(obj => obj.Business == business);

            var lookup = {};
            var items = filtereddata;
            var result = [];

            for (var item, i = 0; item = items[i++];) {
                var BusinessUnit = item.BusinessUnit;

                if (!(BusinessUnit in lookup)) {
                    lookup[BusinessUnit] = 1;
                    result.push(BusinessUnit);
                }
            }
            return result;
        }
        ddHighOrgFilter = function (instance, cell, c, r, source) {

            var business = instance.jexcel.getValueFromCoords(c - 2, r);
            var bu = instance.jexcel.getValueFromCoords(c - 1, r);

            var filtereddata = skillmaster.filter(obj => obj.Business == business && obj.BusinessUnit == bu);

            var lookup = {};
            var items = filtereddata;
            var result = [];

            for (var item, i = 0; item = items[i++];) {
                var HighOrg = item.HighOrg;

                if (!(HighOrg in lookup)) {
                    lookup[HighOrg] = 1;
                    result.push(HighOrg);
                }
            }
            return result;
        }
        ddMidOrgFilter = function (instance, cell, c, r, source) {

            var business = instance.jexcel.getValueFromCoords(c - 3, r);
            var bu = instance.jexcel.getValueFromCoords(c - 2, r);
            var HighOrg = instance.jexcel.getValueFromCoords(c - 1, r);

            var filtereddata = skillmaster.filter(obj => obj.Business == business && obj.BusinessUnit == bu && obj.HighOrg == HighOrg);

            var lookup = {};
            var items = filtereddata;
            var result = [];

            for (var item, i = 0; item = items[i++];) {
                var Midorg = item.MidOrg;

                if (!(Midorg in lookup)) {
                    lookup[Midorg] = 1;
                    result.push(Midorg);
                }
            }

            return result;
        }
        ddTeamFilter = function (instance, cell, c, r, source) {

            var business = instance.jexcel.getValueFromCoords(c - 4, r);
            var bu = instance.jexcel.getValueFromCoords(c - 3, r);
            var HighOrg = instance.jexcel.getValueFromCoords(c - 2, r);
            var Midorg = instance.jexcel.getValueFromCoords(c - 1, r);

            var filtereddata = skillmaster.filter(obj => obj.Business == business && obj.BusinessUnit == bu && obj.HighOrg == HighOrg && obj.MidOrg == Midorg);

            var lookup = {};
            var items = filtereddata;
            var result = [];

            for (var item, i = 0; item = items[i++];) {
                var Team = item.Team;

                if (!(Team in lookup)) {
                    lookup[Team] = 1;
                    result.push(Team);
                }
            }

            return result;
        }
        ddRequiredSkillsFilter = function (instance, cell, c, r, source) {

            var business = instance.jexcel.getValueFromCoords(c - 5, r);
            var bu = instance.jexcel.getValueFromCoords(c - 4, r);
            var HighOrg = instance.jexcel.getValueFromCoords(c - 3, r);
            var Midorg = instance.jexcel.getValueFromCoords(c - 2, r);
            var Teams = instance.jexcel.getValueFromCoords(c - 1, r);

            var filtereddata = skillmaster.filter(obj => obj.Business == business && obj.BusinessUnit == bu && obj.HighOrg == HighOrg && obj.MidOrg == Midorg && obj.Team == Teams);

            var lookup = {};
            var items = filtereddata;
            var result = [];

            for (var item, i = 0; item = items[i++];) {
                var RequiredSkills = item.RequiredSkills;

                if (!(RequiredSkills in lookup)) {
                    lookup[RequiredSkills] = 1;
                    result.push(RequiredSkills);
                }
            }

            return result;

        }

        objcapitallabour = jexcel(document.getElementById('tbl_capitallabour'), {

            data: dsCapitalLabour,
            onbeforepaste: function (instance, data, x, y) {
                return false;
            },
            search: true,
            onselection: capitallabour_selectionActive,
            onload: load_capitallabor,
            onchange: capitallabor_update,
            onbeforedeleterow: capitallabor_deleted,
            allowManualInsertRow: false,
            footers: [['', '', '', '', '', '', '', '', '', '', 'Total', '=ROUND(SUM(N1:N300),2)', '=ROUND(SUM(O1:O300),2)', '=ROUND(SUM(P1:P300),2)', '=ROUND(SUM(Q1:Q300),2)', '=ROUND(SUM(R1:R300),2)', '=ROUND(SUM(S1:S300),2)', '=ROUND(SUM(T1:T300),2)', '=ROUND(SUM(U1:U300),2)', '=ROUND(SUM(V1:V300),2)', '=ROUND(SUM(W1:W300),2)', '=ROUND(SUM(X1:X300),2)', '=ROUND(SUM(Y1:Y300),2)', '']],
            tableOverflow: true,
            filters: true,
            tableWidth: mainwidth,
            columns: [
                { type: 'hidden', title: 'ID', width: 30 },
                { type: 'hidden', title: 'Type', width: 100 },
                { type: 'dropdown', title: 'WBS Number', width: 80, source: datasourceCapitalExpenditureWBS, autocomplete: true },
                { type: 'dropdown', title: 'Priority', width: 60, source: datasourcePriority, autocomplete: true },
                { type: 'dropdown', title: 'Capital Category', width: capitallabor_mainwidth, source: datasourceCapitalCategory, autocomplete: true },
                { type: 'dropdown', title: 'Business', width: 60, source: rowbusiness, autocomplete: true },
                { type: 'dropdown', title: 'BU', width: 60, source: rowbu, autocomplete: true, filter: ddbusinessunitFilter },
                { type: 'dropdown', title: 'High Org', width: capitallabor_mainwidth, source: rowhighorg, autocomplete: true, filter: ddHighOrgFilter },
                { type: 'dropdown', title: 'Mid Org', width: capitallabor_mainwidth, source: rowMidOrg, autocomplete: true, filter: ddMidOrgFilter },
                { type: 'dropdown', title: 'Team', width: capitallabor_mainwidth, source: rowTeam, autocomplete: true, filter: ddTeamFilter },
                { type: 'dropdown', title: 'Required Skill', width: capitallabor_mainwidth, source: rowRequiredSkills, autocomplete: true, filter: ddRequiredSkillsFilter },
                { type: 'dropdown', title: 'AOP Project', width: capitallabor_mainwidth, source: datasourceAOPProject, autocomplete: true },
                { type: 'number', title: 'FYear', width: 60, maxlength: 4 },
                { type: 'number', title: 'MAY', width: 40 },
                { type: 'number', title: 'JUN', width: 40 },
                { type: 'number', title: 'JULY', width: 40 },
                { type: 'number', title: 'AUG', width: 40 },
                { type: 'number', title: 'SEP', width: 40 },
                { type: 'number', title: 'OCT', width: 40 },
                { type: 'number', title: 'NOV', width: 40 },
                { type: 'number', title: 'DEC', width: 40 },
                { type: 'number', title: 'JAN', width: 40 },
                { type: 'number', title: 'FEB', width: 40 },
                { type: 'number', title: 'MAR', width: 40 },
                { type: 'number', title: 'APR', width: 40 },
                { type: 'text', readOnly: true, title: 'CreatedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'CreatedOn', width: 80 },
                { type: 'text', readOnly: true, title: 'ModifiedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'ModifiedOn', width: 80 }
            ],
            contextMenu: function (obj) {
                var items = [];

                if (obj.options.allowDeleteRow == true) {
                    items.push({
                        title: obj.options.text.deleteSelectedRows,
                        onclick: function () {
                            if (confirm('Are you sure do you want to delete?'))
                                obj.deleteRow(obj.getSelectedRows().length ? undefined : parseInt(y));
                        }
                    });
                }
                items.push({ type: 'line' });
                items.push({
                    title: "Duplicate",
                    onclick: function () {
                        for (i = s_startvalue; i <= s_endvalue; i++) {
                            var jsonobj = objcapitallabour.getJson(false);
                            var rowobj = jsonobj[i];
                            capitallabor_duplicateInfo.push(rowobj);
                        }
                        savecapitallabor(true);
                    }
                });

                return items;
            },
            updateTable: function (instance, cell, col, row, val, label, cellName) {

                cell.setAttribute('title', cell.innerHTML);
                // Number formating
                if (col == 12 || col == 13 || col == 14 || col == 15 || col == 16 || col == 17 || col == 18 || col == 19 || col == 20 || col == 21 || col == 22 || col == 23 || col == 24) {
                    cell.onkeypress = function isNumberKey(evt) {
                        var charCode = (evt.which) ? evt.which : evt.keyCode;
                        if (charCode != 46 && charCode != 45 && charCode > 31
                            && (charCode < 48 || charCode > 57))
                            return false;
                        return true;
                    };

                    if (col != 12) {
                        cell.innerHTML = Number.parseFloat(val).toFixed(2);
                    }

                    if (val === "") {
                        cell.innerHTML = '0.00';
                    }

                    if (val < 0) {
                        cell.style.color = 'red';
                    }
                    else {
                        cell.style.color = 'black';
                    }
                }
            },
            oncreateeditor: function (el, cell, x, y) {
                if (x == 12) {
                    var config = el.jexcel.options.columns[x].maxlength;
                    cell.children[0].setAttribute('maxlength', config);
                }
            }
        });
    }

    function loadsummaryqtr() {

        var months = jSuite_drop_Summary_Months.getText();

        $http({
            method: 'GET',
            url: '../Resource/getsummary_getqtr',
            params: {
                "strmonths": months
            }
        }).then(function (response) {

            var element3 = document.getElementById('drop_Summary_Quarter');
            element3.innerHTML = "";

            var summayqtr = response.data;
            jSuite_drop_Summary_Quarter = jSuites.dropdown(document.getElementById('drop_Summary_Quarter'), {
                data: summayqtr,
                autocomplete: true,
                placeholder: "Select Quarter",
                lazyLoading: true,
                multiple: true,
                width: '100%'
            });

        }, function (error) {
            console.log(error);
        });

    }

    function loadsummarymonths() {

        var fisyear = jSuite_dropSummaryFisYear.getText();

        $http({
            method: 'GET',
            url: '../Resource/getsummary_getmonths',
            params: {
                "strFinYear": fisyear
            }
        }).then(function (response) {

            var element2 = document.getElementById('drop_Summary_Months');
            element2.innerHTML = "";

            var summarymonths = response.data;
            jSuite_drop_Summary_Months = jSuites.dropdown(document.getElementById('drop_Summary_Months'), {
                data: summarymonths,
                autocomplete: true,
                placeholder: "Select Months",
                lazyLoading: true,
                multiple: true,
                width: '100%',
                onchange: loadsummaryqtr,
            });

            if (fisyear != "") {
                document.getElementById("drop_Summary_Months").removeAttribute('disabled');
                document.getElementById("drop_Summary_Quarter").removeAttribute('disabled');
            }
            else {
                document.getElementById("drop_Summary_Months").setAttribute('disabled', 'disabled');
                document.getElementById("drop_Summary_Quarter").setAttribute('disabled', 'disabled');
            }

        }, function (error) {
            console.log(error);
        });

    }

    function bindsummaryfisyeardropdown() {

        $http({
            method: 'GET',
            url: '../Resource/getsummary_getfisyear'
        }).then(function (response) {

            var element1 = document.getElementById('drop_Summary_Finyear');
            var element2 = document.getElementById('drop_Summary_Months');
            var element3 = document.getElementById('drop_Summary_Quarter');
            element1.innerHTML = "";
            element2.innerHTML = "";
            element3.innerHTML = "";

            var fisyeardata = response.data;

            jSuite_dropSummaryFisYear = jSuites.dropdown(document.getElementById('drop_Summary_Finyear'), {
                data: fisyeardata,
                autocomplete: true,
                placeholder: "Select FisYear",
                lazyLoading: true,
                multiple: true,
                width: '100%',
                onchange: loadsummarymonths,
            });

            jSuite_drop_Summary_Months = jSuites.dropdown(document.getElementById('drop_Summary_Months'), {
                data: [],
                autocomplete: true,
                placeholder: "Select Months",
                lazyLoading: true,
                multiple: true,
                width: '100%',
            });

            jSuite_drop_Summary_Quarter = jSuites.dropdown(document.getElementById('drop_Summary_Quarter'), {
                data: ['Q1', 'Q2', 'Q3', 'Q4'],
                autocomplete: true,
                placeholder: "Select Quarter",
                lazyLoading: true,
                multiple: true,
                width: '100%',
            });

            getsummaryinfo();

        }, function (error) {
            console.log(error);
        });

    }

    function bindcapitaltabledata() {        

        document.getElementById('tbl_capital').innerHTML = "";
        document.getElementById('drop_Capital_Priority').innerHTML = "";
        document.getElementById('drop_Capital_AOPProject').innerHTML = "";
        document.getElementById('drop_Capital_Category').innerHTML = "";
        document.getElementById('drop_Capital_Type_2').innerHTML = "";
        document.getElementById('dropCapitalExpenditureWBSCapital').innerHTML = "";

        var jSuite_dropCapitalExpenditureWBSCapital = jSuites.dropdown(document.getElementById('dropCapitalExpenditureWBSCapital'), {
            url: '../Resource/getCapitalExpenditureWBS',
            autocomplete: true,
            placeholder: "Select Capital Expenditure WBS",
            lazyLoading: false,
            multiple: false,
            width: '100%'
        });

        var jSuite_drop_Capital_Priority = jSuites.dropdown(document.getElementById('drop_Capital_Priority'), {
            url: '../Resource/getpriority',
            autocomplete: true,
            placeholder: "Select Priority",
            lazyLoading: false,
            multiple: false,
            width: '100%',
        });

        var jSuite_drop_Capital_AOPProject = jSuites.dropdown(document.getElementById('drop_Capital_AOPProject'), {
            url: '../Resource/getAOPProject',
            autocomplete: true,
            placeholder: "Select 5Yr Capital Item",
            lazyLoading: false,
            multiple: false,
            width: '100%',
        });

        var jSuite_drop_Capital_Category = jSuites.dropdown(document.getElementById('drop_Capital_Category'), {
            url: '../Resource/getCapitalCategory',
            autocomplete: true,
            placeholder: "Select Capital Category",
            lazyLoading: false,
            multiple: false,
            width: '100%',
        });
        var jSuite_drop_Capital_Type_2 = jSuites.dropdown(document.getElementById('drop_Capital_Type_2'), {
            url: '../Resource/getCapitalType',
            autocomplete: true,
            placeholder: "Select Capital Type",
            lazyLoading: false,
            multiple: false,
            width: '100%',
        });

        $scope.addcapitalinfo = function () {


            if (capitalSubmitting == false) {
                showalertsavechangesalert('It looks like you have been editing something in capital, so please savechanges!');
            }
            else {

                //var capital_wbsnumber = document.getElementById('capital_WBSnumber').value;
                var capital_wbsnumber = jSuite_dropCapitalExpenditureWBSCapital.getText();
                var capital_priority = jSuite_drop_Capital_Priority.getText();
                var capital_impaceofnotinvesting = document.getElementById('capital_impactofnotinvesting').value;
                var capital_capitalcategory = jSuite_drop_Capital_Category.getText();
                var capital_capitaltype = jSuite_drop_Capital_Type_2.getText();
                var capital_description = document.getElementById('capital_description').value;
                var capital_AOPProject = jSuite_drop_Capital_AOPProject.getText();
                var capital_projects = jSuite_dropProjects.getText();

                if (capital_projects === "") {
                    showalert('Please select project!');
                } else if (capital_wbsnumber === "") {
                    showalert('Please select Capital Expenditure WBS number!');
                } else if (capital_priority === "") {
                    showalert('Please select priority!');
                } else if (capital_impaceofnotinvesting === "") {
                    showalert('Please enter impact of not investing!');
                } else if (capital_capitalcategory === "") {
                    showalert('Please select capital category!');
                } else if (capital_capitaltype === "") {
                    showalert('Please select capital type!');
                } else if (capital_AOPProject === "") {
                    showalert('Please Select 5Yr Capital Item!');
                } else {

                    updateprogressbar(20, "Data is inserting...");

                    $http({
                        method: 'POST',
                        url: '../Resource/addCapitalInfo',
                        params: {
                            "strProjectName": capital_projects,
                            "strWBSNumber": capital_wbsnumber,
                            "strPriority": capital_priority,
                            "strImpactofnotinvesting": capital_impaceofnotinvesting,
                            "strCapitalCategory": capital_capitalcategory,
                            "strCapitalType": capital_capitaltype,
                            "strDescription": capital_description,
                            "strAOPProject": capital_AOPProject,
                        }
                    }).then(function (response) {

                        updateprogressbar(80, "Data is loading...");

                        $http({
                            method: 'GET',
                            url: '../Resource/getcapitaldata'
                        }).then(function (response) {
                            if (response.data.length > 0) {

                                var twidth = document.getElementById("mainbody").offsetWidth
                                var mywidth = (twidth - 108) + "px";
                                var elms = document.getElementById("tbl_capital").getElementsByTagName("*");
                                elms[5].setAttribute("style", "width:" + mywidth);

                                if (response.data.length === 1) {
                                    document.getElementById('tbl_capital').innerHTML = "";
                                    dsCapital = response.data;
                                    load_capitaltabledata();
                                }
                                else {
                                    objcapital.setData(response.data);
                                }

                                updateprogressbar(100, "Data is loading...");
                                document.getElementById('progressbar').style.display = 'none';
                                //clearcapitalform();

                            }

                        }, function (error) {
                            console.log(error);
                        });

                    }, function (error) {
                        console.log(error);
                    });

                }
            }

        }
        $scope.capitalclear = function () {
            clearcapitalform();
        }
        function clearcapitalform() {

            jSuite_drop_Capital_Priority.reset();
            jSuite_drop_Capital_Category.reset();
            jSuite_drop_Capital_Type_2.reset();
            jSuite_drop_Capital_AOPProject.reset();

            document.getElementById("capital_WBSnumber").value = "";
            document.getElementById("capital_impactofnotinvesting").value = "";
            document.getElementById("capital_description").value = "";
        }

        load_capitaltabledata();
    }

    function load_capitaltabledata() {
        var capital_selectionActive = function (instance, x1, y1, x2, y2, origin) {

            document.getElementById('capitaltotal').innerHTML = "0";
            if ((x1 >= 10 && x1 <= 21) && (x2 >= 10 && x2 <= 21)) {
                var value = 0;
                for (var i = y1; i <= y2; i++) {
                    for (var j = x1; j <= x2; j++) {
                        var objvalue = objcapital.getValueFromCoords(j, i);
                        value = parseFloat(value) + parseFloat(objvalue);
                    }
                }
                document.getElementById('capitaltotal').innerHTML = value.toFixed(2);
            }

            s_startvalue = y1;
            s_endvalue = y2;
        }
        var load_capital = function (instance) {

            var datavalues = document.getElementById("tbl_capital").getElementsByTagName("thead");
            var subchilditem = datavalues[0].lastChild.getElementsByTagName("td");
            subchilditem[1].style = "display:none";
            subchilditem[2].style = "display:none";

            var height = parseInt(window.innerHeight) - 210;
            var subelms = document.getElementById("tbl_capital").getElementsByTagName("*");
            var vartable = subelms[5].getAttribute("style");
            var newstyle = vartable + "; max-height: " + height + "px;"
            subelms[5].setAttribute("style", newstyle);

            updateprogressbar(100, "Completed....");
            document.getElementById('progressbar').style.display = 'none';
            document.getElementById('capital').setAttribute("style", "padding-left:20px; padding-bottom:10px; padding-right:20px; opacity:1;")

        }
        var capital_deletedRow = function (instance) {

            for (i = s_startvalue; i <= s_endvalue; i++) {

                //creates json object of jexcel
                var jsonobj = objcapital.getJson(false);

                //getting particular row from json object       
                var rowobj = jsonobj[i]; //row id getting from event

                capital_deleteInfo.push(rowobj);
                if (capital_updatedInfo.find(x => x.MasterID === rowobj.MasterID)) {
                    index = capital_updatedInfo.indexOf(capital_updatedInfo.find(x => x.ProjectNumber === rowobj.ProjectNumber)); //getting index of that rec
                    capital_updatedInfo.splice(index, 1); //remove the existing rec from object 
                }

                document.getElementById('capital_update_notificationnumber1').innerHTML = capital_updatedInfo.length;
                document.getElementById('capital_delete_notificationnumber1').innerHTML = capital_deleteInfo.length;

                if (parseInt(capital_updatedInfo.length) > 0) {
                    document.getElementById('capital_update_notificationnumber1').style.display = 'initial';
                    document.getElementById('capital_update_notificationnumber2').style.display = 'initial';
                }
                else {
                    document.getElementById('capital_update_notificationnumber1').style.display = 'none';
                    document.getElementById('capital_update_notificationnumber2').style.display = 'none';
                }

                if (parseInt(capital_deleteInfo.length) > 0) {
                    document.getElementById('capital_delete_notificationnumber1').style.display = 'initial';
                    document.getElementById('capital_delete_notificationnumber2').style.display = 'initial';
                }
                else {
                    document.getElementById('capital_delete_notificationnumber1').style.display = 'none';
                    document.getElementById('capital_delete_notificationnumber2').style.display = 'none';
                }
                setcapitalSubmitting();
                var screenst = $scope.ProjectsTable_fullscreen;
                loadfullscreencss(screenst);
            }

        }
        var capital_update = function (instance, cell, col, row, value) {

            //creates json object of jexcel
            var jsonobj = objcapital.getJson(false);

            //getting particular row from json object       
            var rowobj = jsonobj[row]; //row id getting from event

            //check for existance of respective rec in global object
            if (capital_updatedInfo.find(x => x.MasterID === rowobj.MasterID)) {
                index = capital_updatedInfo.indexOf(capital_updatedInfo.find(x => x.MasterID === rowobj.MasterID)); //getting index of that rec
                capital_updatedInfo.splice(index, 1); //remove the existing rec from object 
                capital_updatedInfo.push(rowobj); //pushing newly updated rec
            }
            else
                capital_updatedInfo.push(rowobj); //pushing updated rec for the first time

            document.getElementById('capital_update_notificationnumber1').innerHTML = capital_updatedInfo.length;

            if (parseInt(capital_updatedInfo.length) > 0) {
                document.getElementById('capital_update_notificationnumber1').style.display = 'initial';
                document.getElementById('capital_update_notificationnumber2').style.display = 'initial';
            }
            else {
                document.getElementById('capital_update_notificationnumber1').style.display = 'none';
                document.getElementById('capital_update_notificationnumber2').style.display = 'none';
            }
            setcapitalSubmitting();
            var screenst = $scope.ProjectsTable_fullscreen;
            loadfullscreencss(screenst);
        }

        objcapital = jexcel(document.getElementById('tbl_capital'), {

            data: dsCapital,
            onbeforepaste: function (instance, data, x, y) {
                return false;
            },
            search: true,
            onselection: capital_selectionActive,
            onload: load_capital,
            onchange: capital_update,
            allowManualInsertRow: false,
            footers: [['', '', '', '', '', '', '', 'Total', '=ROUND(SUM(K1:K300),2)', '=ROUND(SUM(L1:L300),2)', '=ROUND(SUM(M1:M300),2)', '=ROUND(SUM(N1:N300),2)', '=ROUND(SUM(O1:O300),2)', '=ROUND(SUM(P1:P300),2)', '=ROUND(SUM(Q1:Q300),2)', '=ROUND(SUM(R1:R300),2)', '=ROUND(SUM(S1:S300),2)', '=ROUND(SUM(T1:T300),2)', '=ROUND(SUM(U1:U300),2)', '=ROUND(SUM(V1:V300),2)']],
            onbeforedeleterow: capital_deletedRow,
            tableOverflow: true,
            filters: true,
            tableWidth: mainwidth,
            columns: [
                { type: 'hidden', title: 'ID', width: 30 },
                { type: 'hidden', title: 'Type', width: 100, source: datasourceCapitalType, autocomplete: true },
                { type: 'dropdown', title: 'WBS Number', width: 80, source: datasourceCapitalExpenditureWBSCapital, autocomplete: true },
                { type: 'dropdown', title: 'Priority', width: 40, source: datasourcePriority, autocomplete: true },
                { type: 'text', title: 'Impact Of Not Investing', width: capital_mainwidth },
                { type: 'dropdown', title: 'Capital Category', width: capital_mainwidth, source: datasourceCapitalCategory, autocomplete: true },
                { type: 'dropdown', title: 'Capital Type', width: capital_mainwidth, source: datasourceCapitalType, autocomplete: true },
                { type: 'dropdown', title: 'AOP Project', width: capital_mainwidth, source: datasourceAOPProject, autocomplete: true },
                { type: 'text', title: 'Description', width: capital_mainwidth },
                { type: 'number', title: 'FYear', width: 50, maxlength: 4 },
                { type: 'number', title: 'MAY', width: 40 },
                { type: 'number', title: 'JUN', width: 40 },
                { type: 'number', title: 'JULY', width: 40 },
                { type: 'number', title: 'AUG', width: 40 },
                { type: 'number', title: 'SEP', width: 40 },
                { type: 'number', title: 'OCT', width: 40 },
                { type: 'number', title: 'NOV', width: 40 },
                { type: 'number', title: 'DEC', width: 40 },
                { type: 'number', title: 'JAN', width: 40 },
                { type: 'number', title: 'FEB', width: 40 },
                { type: 'number', title: 'MAR', width: 40 },
                { type: 'number', title: 'APR', width: 40 },
                { type: 'text', readOnly: true, title: 'CreatedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'CreatedOn', width: 80 },
                { type: 'text', readOnly: true, title: 'ModifiedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'ModifiedOn', width: 80 }
            ],
            contextMenu: function (obj) {
                var items = [];

                if (obj.options.allowDeleteRow == true) {
                    items.push({
                        title: obj.options.text.deleteSelectedRows,
                        onclick: function () {
                            if (confirm('Are you sure do you want to delete?'))
                                obj.deleteRow(obj.getSelectedRows().length ? undefined : parseInt(y));
                        }
                    });
                }
                items.push({ type: 'line' });
                items.push({
                    title: "Duplicate",
                    onclick: function () {
                        for (i = s_startvalue; i <= s_endvalue; i++) {
                            var jsonobj = objcapital.getJson(false);
                            var rowobj = jsonobj[i];
                            capital_duplicateInfo.push(rowobj);
                        }
                        savecapital(true);
                    }
                });

                return items;
            },
            updateTable: function (instance, cell, col, row, val, label, cellName) {     

                cell.setAttribute('title', cell.innerHTML);
                // Number formating               
                if (col == 9 || col == 10 || col == 11 || col == 12 || col == 13 || col == 14 || col == 15 || col == 16 || col == 17 || col == 18 || col == 19 || col == 20 || col == 21) {
                    cell.onkeypress = function isNumberKey(evt) {
                        var charCode = (evt.which) ? evt.which : evt.keyCode;
                        if (charCode != 46 && charCode != 45 && charCode > 31
                            && (charCode < 48 || charCode > 57))
                            return false;
                        return true;
                    };

                    if (col != 9) {
                        cell.innerHTML = Number.parseFloat(val).toFixed(2);
                    }

                    if (val === "") {
                        cell.innerHTML = '0.00';
                    }

                    if (val < 0) {
                        cell.style.color = 'red';                        
                    }
                    else {
                        cell.style.color = 'black';
                    }
                }
            },
            oncreateeditor: function (el, cell, x, y) {
                if (x == 9) {
                    var config = el.jexcel.options.columns[x].maxlength;
                    cell.children[0].setAttribute('maxlength', config);
                }
            }
        });
    }



    function getresourcedata() {
        //$http({
        //    method: 'GET',
        //    url: '../Resource/getresourcedata'
        //}).then(function (response) {
        //    dsResource = response.data;
        //    $http({
        //        method: 'GET',
        //        url: '../Resource/getBusiness'
        //    }).then(function (response) {
        //        rowbusiness = response.data;

        //        $http({
        //            method: 'POST',
        //            url: '../Resource/getBU'
        //        }).then(function (response) {
        //            rowbu = response.data;

        //            $http({
        //                method: 'POST',
        //                url: '../Resource/getHighOrg'
        //            }).then(function (response) {
        //                rowhighorg = response.data;

        //                $http({
        //                    method: 'POST',
        //                    url: '../Resource/getMidOrgData'
        //                }).then(function (response) {
        //                    rowMidOrg = response.data;

        //                    $http({
        //                        method: 'POST',
        //                        url: '../Resource/getTeamData'
        //                    }).then(function (response) {
        //                        rowTeam = response.data;

        //                        $http({
        //                            method: 'GET',
        //                            url: '../Resource/SkillData'
        //                        }).then(function (response) {
        //                            rowRequiredSkills = response.data;
        //                            loadresourcetable();
        //                        }, function (error) {
        //                            console.log(error);
        //                        });

        //                    }, function (error) {
        //                        console.log(error);
        //                    });

        //                }, function (error) {
        //                    console.log(error);
        //                });

        //            }, function (error) {
        //                console.log(error);
        //            });

        //        }, function (error) {
        //            console.log(error);
        //        });

        //    }, function (error) {
        //        console.log(error);
        //    });

        //}, function (error) {
        //    console.log(error);
        //});
    }

    function getusername() {
        $http({
            method: 'GET',
            url: '../Projects/validateLogin'
        }).then(function (response) {
            var username = response.data;
            document.getElementById('loginusername').innerHTML = "Welcome, " + username;
            document.getElementById('userprofilepanel1').style.display = 'block';
            document.getElementById('userprofilepanel2').style.display = 'block';
        }, function (error) {
            console.log(error);
        });
    }

    function updateprogressbar(value, item) {
        document.getElementById('progressBarText').innerHTML = item;
        document.getElementById('progressbar').style.display = 'block'
        progressbarstyle = document.getElementsByClassName('progress-bar progress-bar-striped progress-bar-animated');
        pstyle = "width: " + value + "%";
        progressbarstyle[0].setAttribute("style", pstyle)
    }

    function isNumberKey(evt, obj) {

        var charCode = (evt.which) ? evt.which : event.keyCode
        var value = obj.value;
        var dotcontains = value.indexOf(".") != -1;
        if (dotcontains)
            if (charCode == 46) return false;
        if (charCode == 46) return true;
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }


    function loadresourcetable() {

        document.getElementById('tbl_resource').innerHTML = "";

        var load_resource = function (instance) {
            var datavalues = document.getElementById("tbl_resource").getElementsByTagName("thead");
            var subchilditem = datavalues[0].lastChild.getElementsByTagName("td");
            subchilditem[1].style = "display:none";
            subchilditem[2].style = "display:none";

            var height = parseInt(window.innerHeight) - 210;
            var subelms = document.getElementById("tbl_resource").getElementsByTagName("*");
            var vartable = subelms[5].getAttribute("style");
            var newstyle = vartable + "; max-height: " + height + "px;"
            subelms[5].setAttribute("style", newstyle);

            document.getElementById('resource').setAttribute("style", "padding-left:20px; padding-right:20px; padding-bottom:10px; opacity:1;")
            updateprogressbar(100, "Completed....");
            document.getElementById('progressbar').style.display = 'none';
        }

        //start delete & update even code
        var selectionActive = function (instance, x1, y1, x2, y2, origin) {

            document.getElementById('resourcetotal').innerHTML = "0";
            if ((x1 >= 10 && x1 <= 21) && (x2 >= 10 && x2 <= 21)) {
                var value = 0;
                for (var i = y1; i <= y2; i++) {
                    for (var j = x1; j <= x2; j++) {
                        var objvalue = obj.getValueFromCoords(j, i);
                        value = parseFloat(value) + parseFloat(objvalue);
                    }
                }
                document.getElementById('resourcetotal').innerHTML = value.toFixed(2);
            }

            s_startvalue = y1;
            s_endvalue = y2;

            c_startvalue = x1;
            c_endvalue = x2;
        }

        var deletedRow = function (instance) {

            for (i = s_startvalue; i <= s_endvalue; i++) {

                //creates json object of jexcel
                var jsonobj = obj.getJson(false);

                //getting particular row from json object       
                var rowobj = jsonobj[i]; //row id getting from event

                deleteInfo.push(rowobj);
                if (updatedInfo.find(x => x.MasterID === rowobj.MasterID)) {
                    index = updatedInfo.indexOf(updatedInfo.find(x => x.ProjectNumber === rowobj.ProjectNumber)); //getting index of that rec
                    updatedInfo.splice(index, 1); //remove the existing rec from object 
                }

                document.getElementById('update_notificationnumber1').innerHTML = updatedInfo.length;
                document.getElementById('delete_notificationnumber1').innerHTML = deleteInfo.length;

                if (parseInt(updatedInfo.length) > 0) {
                    document.getElementById('update_notificationnumber1').style.display = 'initial';
                    document.getElementById('update_notificationnumber2').style.display = 'initial';
                }
                else {
                    document.getElementById('update_notificationnumber1').style.display = 'none';
                    document.getElementById('update_notificationnumber2').style.display = 'none';
                }

                if (parseInt(deleteInfo.length) > 0) {
                    document.getElementById('delete_notificationnumber1').style.display = 'initial';
                    document.getElementById('delete_notificationnumber2').style.display = 'initial';
                }
                else {
                    document.getElementById('delete_notificationnumber1').style.display = 'none';
                    document.getElementById('delete_notificationnumber2').style.display = 'none';
                }

                setFormSubmitting();
                var screenst = $scope.ProjectsTable_fullscreen;
                loadfullscreencss(screenst);

            }

        }
        var update = function (instance, cell, col, row, value) {

            if (col == 3) {
                var columnName = jexcel.getColumnNameFromId([4, row]);
                instance.jexcel.setValue(columnName, '');
            }

            if (col == 4) {
                var columnName = jexcel.getColumnNameFromId([5, row]);
                instance.jexcel.setValue(columnName, '');
            }

            if (col == 5) {
                var columnName = jexcel.getColumnNameFromId([6, row]);
                instance.jexcel.setValue(columnName, '');
            }

            if (col == 6) {
                var columnName = jexcel.getColumnNameFromId([7, row]);
                instance.jexcel.setValue(columnName, '');
            }

            if (col == 7) {
                var columnName = jexcel.getColumnNameFromId([8, row]);
                instance.jexcel.setValue(columnName, '');
            }


            //creates json object of jexcel
            var jsonobj = obj.getJson(false);

            //getting particular row from json object       
            var rowobj = jsonobj[row]; //row id getting from event

            //check for existance of respective rec in global object
            if (updatedInfo.find(x => x.MasterID === rowobj.MasterID)) {
                index = updatedInfo.indexOf(updatedInfo.find(x => x.MasterID === rowobj.MasterID)); //getting index of that rec
                updatedInfo.splice(index, 1); //remove the existing rec from object 
                updatedInfo.push(rowobj); //pushing newly updated rec
            }
            else
                updatedInfo.push(rowobj); //pushing updated rec for the first time

            document.getElementById('update_notificationnumber1').innerHTML = updatedInfo.length;

            if (parseInt(updatedInfo.length) > 0) {
                setFormSubmitting();
                document.getElementById('update_notificationnumber1').style.display = 'initial';
                document.getElementById('update_notificationnumber2').style.display = 'initial';
            }
            else {
                document.getElementById('update_notificationnumber1').style.display = 'none';
                document.getElementById('update_notificationnumber2').style.display = 'none';
            }

            var screenst = $scope.ProjectsTable_fullscreen;
            loadfullscreencss(screenst);
        }

        ddbusinessunitFilter = function (instance, cell, c, r, source) {

            var business = instance.jexcel.getValueFromCoords(c - 1, r);
            var filtereddata = skillmaster.filter(obj => obj.Business == business);

            var lookup = {};
            var items = filtereddata;
            var result = [];

            for (var item, i = 0; item = items[i++];) {
                var BusinessUnit = item.BusinessUnit;

                if (!(BusinessUnit in lookup)) {
                    lookup[BusinessUnit] = 1;
                    result.push(BusinessUnit);
                }
            }
            return result;
        }
        ddHighOrgFilter = function (instance, cell, c, r, source) {

            var business = instance.jexcel.getValueFromCoords(c - 2, r);
            var bu = instance.jexcel.getValueFromCoords(c - 1, r);

            var filtereddata = skillmaster.filter(obj => obj.Business == business && obj.BusinessUnit == bu);

            var lookup = {};
            var items = filtereddata;
            var result = [];

            for (var item, i = 0; item = items[i++];) {
                var HighOrg = item.HighOrg;

                if (!(HighOrg in lookup)) {
                    lookup[HighOrg] = 1;
                    result.push(HighOrg);
                }
            }
            return result;
        }
        ddMidOrgFilter = function (instance, cell, c, r, source) {

            var business = instance.jexcel.getValueFromCoords(c - 3, r);
            var bu = instance.jexcel.getValueFromCoords(c - 2, r);
            var HighOrg = instance.jexcel.getValueFromCoords(c - 1, r);

            var filtereddata = skillmaster.filter(obj => obj.Business == business && obj.BusinessUnit == bu && obj.HighOrg == HighOrg);

            var lookup = {};
            var items = filtereddata;
            var result = [];

            for (var item, i = 0; item = items[i++];) {
                var Midorg = item.MidOrg;

                if (!(Midorg in lookup)) {
                    lookup[Midorg] = 1;
                    result.push(Midorg);
                }
            }

            return result;
        }
        ddTeamFilter = function (instance, cell, c, r, source) {

            var business = instance.jexcel.getValueFromCoords(c - 4, r);
            var bu = instance.jexcel.getValueFromCoords(c - 3, r);
            var HighOrg = instance.jexcel.getValueFromCoords(c - 2, r);
            var Midorg = instance.jexcel.getValueFromCoords(c - 1, r);

            var filtereddata = skillmaster.filter(obj => obj.Business == business && obj.BusinessUnit == bu && obj.HighOrg == HighOrg && obj.MidOrg == Midorg);

            var lookup = {};
            var items = filtereddata;
            var result = [];

            for (var item, i = 0; item = items[i++];) {
                var Team = item.Team;

                if (!(Team in lookup)) {
                    lookup[Team] = 1;
                    result.push(Team);
                }
            }

            return result;
        }
        ddRequiredSkillsFilter = function (instance, cell, c, r, source) {

            var business = instance.jexcel.getValueFromCoords(c - 5, r);
            var bu = instance.jexcel.getValueFromCoords(c - 4, r);
            var HighOrg = instance.jexcel.getValueFromCoords(c - 3, r);
            var Midorg = instance.jexcel.getValueFromCoords(c - 2, r);
            var Teams = instance.jexcel.getValueFromCoords(c - 1, r);

            var filtereddata = skillmaster.filter(obj => obj.Business == business && obj.BusinessUnit == bu && obj.HighOrg == HighOrg && obj.MidOrg == Midorg && obj.Team == Teams);

            var lookup = {};
            var items = filtereddata;
            var result = [];

            for (var item, i = 0; item = items[i++];) {
                var RequiredSkills = item.RequiredSkills;

                if (!(RequiredSkills in lookup)) {
                    lookup[RequiredSkills] = 1;
                    result.push(RequiredSkills);
                }
            }

            return result;

        }

        //editor: new InputMaxLenght(4)
        obj = jexcel(document.getElementById('tbl_resource'), {
            data: dsResource,
            search: true,
            tableOverflow: true,
            filters: true,
            tableWidth: mainwidth,
            allowManualInsertRow: false,
            onbeforedeleterow: deletedRow,
            onselection: selectionActive,
            onchange: update,
            onload: load_resource,
            allowComments: true,
            footers: [['', '', '', '', '', '', '', 'Total', '=ROUND(SUM(K1:K300),2)', '=ROUND(SUM(L1:L300),2)', '=ROUND(SUM(M1:M300),2)', '=ROUND(SUM(N1:N300),2)', '=ROUND(SUM(O1:O300),2)', '=ROUND(SUM(P1:P300),2)', '=ROUND(SUM(Q1:Q300),2)', '=ROUND(SUM(R1:R300),2)', '=ROUND(SUM(S1:S300),2)', '=ROUND(SUM(T1:T300),2)', '=ROUND(SUM(U1:U300),2)', '=ROUND(SUM(V1:V300),2)', '']],
            columns: [
                { type: 'hidden', title: 'ID', width: 30 },
                { type: 'hidden', title: 'Type', width: 100 },
                { type: 'dropdown', title: 'WBSNumber', width: 120, source: rowOperatingExpenseWBS, autocomplete: true },
                { type: 'dropdown', title: 'Business', width: 60, source: rowbusiness, autocomplete: true },
                { type: 'dropdown', title: 'BU', width: 60, source: rowbu, autocomplete: true, filter: ddbusinessunitFilter },
                { type: 'dropdown', title: 'High Org', width: resource_mainwidth, source: rowhighorg, autocomplete: true, filter: ddHighOrgFilter },
                { type: 'dropdown', title: 'Mid Org', width: resource_mainwidth, source: rowMidOrg, autocomplete: true, filter: ddMidOrgFilter },
                { type: 'dropdown', title: 'Team', width: resource_mainwidth, source: rowTeam, autocomplete: true, filter: ddTeamFilter },
                { type: 'dropdown', title: 'Required Skill', width: resource_mainwidth, source: rowRequiredSkills, autocomplete: true, filter: ddRequiredSkillsFilter },
                { type: 'number', title: 'FYear', width: 50, maxlength: 4 },
                { type: 'number', title: 'MAY', width: 40 },
                { type: 'number', title: 'JUN', width: 40 },
                { type: 'number', title: 'JULY', width: 40 },
                { type: 'number', title: 'AUG', width: 40 },
                { type: 'number', title: 'SEP', width: 40 },
                { type: 'number', title: 'OCT', width: 40 },
                { type: 'number', title: 'NOV', width: 40 },
                { type: 'number', title: 'DEC', width: 40 },
                { type: 'number', title: 'JAN', width: 40 },
                { type: 'number', title: 'FEB', width: 40 },
                { type: 'number', title: 'MAR', width: 40 },
                { type: 'number', title: 'APR', width: 40 },
                { type: 'text', title: 'Comments', width: 150 },
                { type: 'text', readOnly: true, title: 'CreatedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'CreatedOn', width: 80 },
                { type: 'text', readOnly: true, title: 'ModifiedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'ModifiedOn', width: 80 }
            ],
            contextMenu: function (obj, x, y, e) {
                var items = [];
                if (y == null) {
                    //items.push({
                    //    title: "Hide Column",
                    //    onclick: function () {
                    //        for (i = c_startvalue; i <= c_endvalue; i++) {
                    //            resource_hidecolumns.push(i);
                    //            obj.hideColumn(i);
                    //            obj.filter.children[i + 1].style.display = "none";
                    //        }
                    //    }
                    //});
                    //items.push({
                    //    title: "Unhide Column",
                    //    onclick: function () {
                    //        for (i = c_startvalue + 1; i < c_endvalue; i++) {
                    //            var unhide = resource_hidecolumns.indexOf(i);
                    //            resource_hidecolumns.splice(unhide, 1);
                    //            obj.filter.children[i + 1].style.display = "block";
                    //            obj.showColumn(i);

                    //        }
                    //    }
                    //});
                }
                else {

                    if (obj.options.allowDeleteRow == true) {
                        items.push({
                            title: obj.options.text.deleteSelectedRows,
                            onclick: function () {
                                if (confirm('Are you sure do you want to delete?'))
                                    obj.deleteRow(obj.getSelectedRows().length ? undefined : parseInt(y));
                            }
                        });
                    }
                    items.push({ type: 'line' });
                    items.push({
                        title: "Duplicate",
                        onclick: function () {
                            for (i = s_startvalue; i <= s_endvalue; i++) {
                                var jsonobj = obj.getJson(false);
                                var rowobj = jsonobj[i];
                                duplicateInfo.push(rowobj);
                            }
                            save(true);
                        }
                    });
                    //, editor: new InputMaxLenght(4)
                    //if (x) {
                    //    if (obj.options.allowComments == true) {
                    //        items.push({ type: 'line' });

                    //        var title = obj.records[y][x].getAttribute('title') || '';

                    //        items.push({
                    //            title: title ? obj.options.text.editComments : obj.options.text.addComments,
                    //            onclick: function () {
                    //                obj.setComments([x, y], prompt(obj.options.text.comments, title));
                    //            }
                    //        });

                    //        if (title) {
                    //            items.push({
                    //                title: obj.options.text.clearComments,
                    //                onclick: function () {
                    //                    obj.setComments([x, y], '');
                    //                }
                    //            });
                    //        }
                    //    }
                    //}

                }

                return items;
            },
            updateTable: function (instance, cell, col, row, val, label, cellName) { 
                cell.setAttribute('title', cell.innerHTML);
                // Number formating                
                if (col == 9 || col == 10 || col == 11 || col == 12 || col == 13 || col == 14 || col == 15 || col == 16 || col == 17 || col == 18 || col == 19 || col == 20 || col == 21) {
                    cell.onkeypress = function isNumberKey(evt) {
                        var charCode = (evt.which) ? evt.which : evt.keyCode;
                        if (charCode != 46 && charCode != 45 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    };

                    if (col != 9) {
                        cell.innerHTML = Number.parseFloat(val).toFixed(2);                        
                    }

                    if (val === "") {
                        cell.innerHTML = '0.00';
                    }

                    if (val < 0) {
                        cell.style.color = 'red';
                    }
                    else {
                        cell.style.color = 'black';
                    }

                }
            },
            oncreateeditor: function (el, cell, x, y) {
                if (x == 9) {
                    var config = el.jexcel.options.columns[x].maxlength;
                    cell.children[0].setAttribute('maxlength', config);                   
                }
            }
        });

        validaterecords();

        //method to load captial data table
        //loadDE = jexcel(document.getElementById('spreadsheetDE'), {
        //    csv: '/assets/Jexcel/DE.csv',
        //    csvHeaders: true,
        //    tableOverflow: true,
        //    tableWidth: mainwidth,
        //    search: true,
        //    filters: true,
        //    columns: [
        //        { type: 'text', width: 40 },
        //        { type: 'text', width: 280 },
        //        { type: 'text', width: 180 },
        //        { type: 'text', width: 80 },
        //        { type: 'number', width: 80 },
        //        { type: 'number', width: 80 },
        //        { type: 'number', width: 80 },
        //        { type: 'number', width: 80 },
        //        { type: 'number', width: 80 },
        //        { type: 'number', width: 80 },
        //        { type: 'number', width: 80 },
        //        { type: 'number', width: 80 },
        //        { type: 'number', width: 80 },
        //        { type: 'number', width: 80 },
        //        { type: 'number', width: 80 },
        //        { type: 'number', width: 80 },
        //        { type: 'number', width: 80 }
        //    ],
        //    contextMenu: function () {
        //        return false;
        //    }
        //});

        //method to load captial data table
        checkbook = jexcel(document.getElementById('spreadsheetCheckbook'), {
            csv: '/assets/Jexcel/Checkbook.csv',
            csvHeaders: true,
            tableOverflow: true,
            tableWidth: mainwidth,
            search: true,
            filters: true,
            pagination: 10,
            columns: [
                { type: 'text', width: 155 },
                { type: 'text', width: 155 },
                { type: 'text', width: 155 },
                { type: 'text', width: 155 },
                { type: 'text', width: 155 },
                { type: 'text', width: 155 },
                { type: 'text', width: 155 },
                { type: 'text', width: 160 },
                { type: 'text', width: 160 },
                { type: 'number', width: 70, readOnly: true, mask: '$ #,##,00', decimal: ',' },
                { type: 'number', width: 70, readOnly: true, mask: '$ #,##,00', decimal: ',' },
                { type: 'number', width: 70, mask: '$ #,##,00', decimal: ',' },
                { type: 'number', width: 70, mask: '$ #,##,00', decimal: ',' },
                { type: 'number', width: 70, mask: '$ #,##,00', decimal: ',' },
                { type: 'number', width: 70, mask: '$ #,##,00', decimal: ',' },
                { type: 'number', width: 70, mask: '$ #,##,00', decimal: ',' },
                { type: 'number', width: 70, mask: '$ #,##,00', decimal: ',' },
                { type: 'number', width: 70, mask: '$ #,##,00', decimal: ',' },
                { type: 'number', width: 70, mask: '$ #,##,00', decimal: ',' },
                { type: 'number', width: 70, mask: '$ #,##,00', decimal: ',' },
                { type: 'number', width: 70, mask: '$ #,##,00', decimal: ',' },
            ],
            contextMenu: function () {
                return false;
            },
            style: {
                J1: 'background-color: gray; color: white;',
                J2: 'background-color: gray; color: white;',
                J3: 'background-color: gray; color: white;',
                J4: 'background-color: gray; color: white;',
                J5: 'background-color: gray; color: white;',
                J6: 'background-color: gray; color: white;',
                J7: 'background-color: gray; color: white;',
                J8: 'background-color: gray; color: white;',
                J9: 'background-color: gray; color: white;',
                K1: 'background-color: gray; color: white;',
                K2: 'background-color: gray; color: white;',
                K3: 'background-color: gray; color: white;',
                K4: 'background-color: gray; color: white;',
                K5: 'background-color: gray; color: white;',
                K6: 'background-color: gray; color: white;',
                K7: 'background-color: gray; color: white;',
                K8: 'background-color: gray; color: white;',
                K9: 'background-color: gray; color: white;',
            },
        });

        checkbook.setStyle('C3', 'background-color', 'yellow');

        //method to load captial data table
        //summary = jexcel(document.getElementById('excelsummary'), {
        //    csv: '/assets/Jexcel/summary.csv',
        //    csvHeaders: true,
        //    tableOverflow: true,
        //    tableWidth: mainwidth,
        //    search: true,
        //    freezeColumns: 1,
        //    columns: [
        //        { type: 'text', width: 400, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //    ],
        //    contextMenu: function () {
        //        return false;
        //    }
        //});

        //method to load captial data table
        //FTEsummary = jexcel(document.getElementById('excelFTEsummary'), {
        //    csv: '/assets/Jexcel/FETsummary.csv',
        //    csvHeaders: true,
        //    tableOverflow: true,
        //    tableWidth: mainwidth,
        //    search: true,
        //    freezeColumns: 1,
        //    columns: [
        //        { type: 'text', width: 250, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //        { type: 'text', width: 100, readOnly: true },
        //    ],
        //    contextMenu: function () {
        //        return false;
        //    }
        //});

        //}

        //window.onkeyup = function (event) {

        //    if (event.keyCode == 27) {

        //        var width = window.innerWidth
        //        var height = parseInt(window.innerHeight) - 37;

        //        // search box css
        //        var elm = {};
        //        var elms = document.getElementById("tbl_resource").getElementsByTagName("*");

        //        var varsearch = elms[3].getAttribute("style");
        //        var searchstyle = "width: 100%; background-color: rgb(6, 114, 236); color: black; font-size: 12px; padding-left: 15px; padding-top: 7px; padding-bottom: 7px; border: 1px solid rgb(6, 114, 236);";

        //        if (varsearch === searchstyle) {
        //            varsearch = "position: fixed; " + varsearch;
        //        }
        //        else if (varsearch === "position: fixed; " + searchstyle) {
        //            varsearch = searchstyle;
        //        }
        //        elms[3].setAttribute("style", varsearch)

        //        //table css
        //        var vartable = elms[5].getAttribute("style");
        //        var searchtablestyle = "overflow: auto; width: " + mainwidth + ";";

        //        if (vartable === searchtablestyle) {
        //            vartable = "overflow: auto; top: 33px; height:" + height + "px; width: " + width + "px;";
        //        }
        //        else {
        //            vartable = searchtablestyle;
        //        }
        //        elms[5].setAttribute("style", vartable)

        //        //table position
        //        var fullscreen = document.getElementById("tbl_resource");
        //        var css = fullscreen.getAttribute("style");
        //        var style = "position: fixed; top: 0px; left: 0px; width:100%; height:100%; background-color: white;";
        //        if (css === null || css === "position: inherit;") {
        //            css = style;
        //        }
        //        else if (css === "position: fixed; top: 0px; left: 0px; width:100%; height:100%; background-color: white;") {
        //            css = "position: inherit;";
        //        }
        //        fullscreen.setAttribute("style", css);

        //    }

        //alert(dsResource.length);
        //if (dsResource.length === 0) {
        //    alert('hi');
        //    var norecordsfound = document.createElement("div");
        //    norecordsfound.id = "tbl_resource_norecordfound";
        //    var textnorecordfound = document.createElement("span");
        //    textnorecordfound.className = "badge badge-danger";
        //    textnorecordfound.innerHTML = "No Records Found!";
        //    norecordsfound.appendChild(textnorecordfound);
        //    var maindivresource = document.getElementById("resource");
        //    maindivresource.appendChild(norecordsfound);
        //    document.getElementById("tbl_resource").setAttribute("style", "display:none;");
        //}

    }

    function bindresourcedropdowns() {

        //var jSuite_drop_Capital_Priority = jSuites.dropdown(document.getElementById('drop_Capital_Priority'), {
        //    data: [],
        //    autocomplete: true,
        //    placeholder: "Select Priority",
        //    lazyLoading: false,
        //    multiple: false,
        //    width: '100%',
        //});

        //var jSuite_drop_Capital_Category = jSuites.dropdown(document.getElementById('drop_Capital_Category'), {
        //    data: [],
        //    autocomplete: true,
        //    placeholder: "Select Capital Category",
        //    lazyLoading: false,
        //    multiple: false,
        //    width: '100%',
        //});

        //var jSuite_drop_Capital_Type_2 = jSuites.dropdown(document.getElementById('drop_Capital_Type_2'), {
        //    data: [],
        //    autocomplete: true,
        //    placeholder: "Select Capital Type",
        //    lazyLoading: false,
        //    multiple: false,
        //    width: '100%',
        //});

        //var jSuite_drop_Capitallabour_Priority = jSuites.dropdown(document.getElementById('drop_capital_labour_Priority'), {
        //    data: [],
        //    autocomplete: true,
        //    placeholder: "Select Priority",
        //    lazyLoading: false,
        //    multiple: false,
        //    width: '100%',
        //});

        //var jSuite_drop_drop_DE_ExpenseCategory = jSuites.dropdown(document.getElementById('drop_DE_ExpenseCategory'), {
        //    data: [],
        //    autocomplete: true,
        //    placeholder: "Select Direct Expense",
        //    lazyLoading: false,
        //    multiple: false,
        //    width: '100%',
        //});

        //var jSuite_drop_Capital_Labor_Category = jSuites.dropdown(document.getElementById('drop_Capital_Labor_Category'), {
        //    data: [],
        //    autocomplete: true,
        //    placeholder: "Select Capital Category",
        //    lazyLoading: false,
        //    multiple: false,
        //    width: '100%',
        //});


        //var jSuite_dropBusiness_CL = jSuites.dropdown(document.getElementById('dropBusiness_CL'), {
        //    data: [],
        //    autocomplete: true,
        //    placeholder: "Select Business",
        //    lazyLoading: false,
        //    multiple: false,
        //    width: '100%',
        //});

        //var jSuite_dropBU_CL = jSuites.dropdown(document.getElementById('dropBU_CL'), {
        //    data: [],
        //    autocomplete: true,
        //    placeholder: "Select Business Unit",
        //    lazyLoading: false,
        //    multiple: false,
        //    width: '100%',
        //});

        //var jSuite_dropHighOrg_CL = jSuites.dropdown(document.getElementById('dropHighOrg_CL'), {
        //    data: [],
        //    autocomplete: true,
        //    placeholder: "Select HighOrg",
        //    lazyLoading: false,
        //    multiple: false,
        //    width: '100%',
        //});

        //var jSuite_dropMidOrg_CL = jSuites.dropdown(document.getElementById('dropMidOrg_CL'), {
        //    data: [],
        //    autocomplete: true,
        //    placeholder: "Select MidOrg",
        //    lazyLoading: false,
        //    multiple: false,
        //    width: '100%',
        //});

        //var jSuite_dropTeam_CL = jSuites.dropdown(document.getElementById('dropTeam_CL'), {
        //    data: [],
        //    autocomplete: true,
        //    placeholder: "Select Team",
        //    lazyLoading: false,
        //    multiple: false,
        //    width: '100%'
        //});

        //var jSuite_dropRequiredSkills_CL = jSuites.dropdown(document.getElementById('dropRequiredSkills_CL'), {
        //    data: [],
        //    autocomplete: true,
        //    placeholder: "Select Required Skills",
        //    lazyLoading: false,
        //    multiple: false,
        //    width: '100%',
        //});

        document.getElementById('dropOperatingExpenseWBS').innerHTML = '';
        document.getElementById('dropBusiness').innerHTML = '';
        document.getElementById('dropBU').innerHTML = '';
        document.getElementById('dropHighOrg').innerHTML = '';
        document.getElementById('dropMidOrg').innerHTML = '';
        document.getElementById('dropTeam').innerHTML = '';
        document.getElementById('dropRequiredSkills').innerHTML = '';

        jSuite_dropOperatingExpenseWBS = jSuites.dropdown(document.getElementById('dropOperatingExpenseWBS'), {
            data: rowOperatingExpenseWBS,
            autocomplete: true,
            placeholder: "Select Operating Expense WBS",
            lazyLoading: false,
            multiple: false,
            width: '100%'
        });

        jSuite_dropBusiness = jSuites.dropdown(document.getElementById('dropBusiness'), {
            url: '../Resource/getBusiness',
            autocomplete: true,
            placeholder: "Select Business",
            lazyLoading: false,
            multiple: false,
            width: '100%',
            onchange: function () {

                var str_business = jSuite_dropBusiness.getText();
                document.getElementById("dropBU").removeAttribute('disabled');

                $http({
                    method: 'POST',
                    url: '../Resource/getBU',
                    params: { "strBusiness": str_business }
                }).then(function (response) {
                    var dsBU = response.data;
                    jSuite_dropBU.setData(dsBU);
                    jSuite_dropBU.reset();
                }, function (error) {
                    console.log(error);
                });

            },
        });

        jSuite_dropBU = jSuites.dropdown(document.getElementById('dropBU'), {
            data: [],
            autocomplete: true,
            placeholder: "Select Business Unit",
            lazyLoading: false,
            multiple: false,
            width: '100%',
            onchange: function () {

                var str_business = jSuite_dropBusiness.getText();
                var str_BU = jSuite_dropBU.getText();

                document.getElementById("dropHighOrg").removeAttribute('disabled');

                $http({
                    method: 'POST',
                    url: '../Resource/getHighOrg',
                    params: { "strBusiness": str_business, "strBU": str_BU }
                }).then(function (response) {
                    var dsHighOrg = response.data;
                    jSuite_dropHighOrg.setData(dsHighOrg);
                    jSuite_dropHighOrg.reset();
                }, function (error) {
                    console.log(error);
                });

            },
        });

        jSuite_dropHighOrg = jSuites.dropdown(document.getElementById('dropHighOrg'), {
            data: [],
            autocomplete: true,
            placeholder: "Select High Org",
            lazyLoading: false,
            multiple: false,
            width: '100%',
            onchange: function () {

                var str_business = jSuite_dropBusiness.getText();
                var str_BU = jSuite_dropBU.getText();
                var str_HightOrg = jSuite_dropHighOrg.getText();

                document.getElementById("dropMidOrg").removeAttribute('disabled');

                $http({
                    method: 'POST',
                    url: '../Resource/getMidOrgData',
                    params: { "strBusiness": str_business, "strBU": str_BU, "strHighOrg": str_HightOrg }
                }).then(function (response) {
                    var dsMidOrg = response.data;
                    jSuite_dropMidOrg.setData(dsMidOrg);
                    jSuite_dropMidOrg.reset();
                }, function (error) {
                    console.log(error);
                });

            },
        });
        jSuite_dropMidOrg = jSuites.dropdown(document.getElementById('dropMidOrg'), {
            data: [],
            autocomplete: true,
            placeholder: "Select Mid Org",
            lazyLoading: false,
            multiple: false,
            width: '100%',
            onchange: function () {

                var str_business = jSuite_dropBusiness.getText();
                var str_BU = jSuite_dropBU.getText();
                var str_HightOrg = jSuite_dropHighOrg.getText();
                var str_MidOrg = jSuite_dropMidOrg.getText();

                document.getElementById("dropTeam").removeAttribute('disabled');

                $http({
                    method: 'POST',
                    url: '../Resource/getTeamData',
                    params: { "strBusiness": str_business, "strBU": str_BU, "strHighOrg": str_HightOrg, "strMidOrg": str_MidOrg }
                }).then(function (response) {
                    var dsTeam = response.data;
                    jSuite_dropTeam.setData(dsTeam);
                    jSuite_dropTeam.reset();
                }, function (error) {
                    console.log(error);
                });

            },
        });
        jSuite_dropTeam = jSuites.dropdown(document.getElementById('dropTeam'), {
            data: [],
            autocomplete: true,
            placeholder: "Select Team",
            lazyLoading: false,
            multiple: false,
            width: '100%',
            onchange: function () {

                var str_business = jSuite_dropBusiness.getText();
                var str_BU = jSuite_dropBU.getText();
                var str_HightOrg = jSuite_dropHighOrg.getText();
                var str_MidOrg = jSuite_dropMidOrg.getText();
                var str_Team = jSuite_dropTeam.getText();

                document.getElementById("dropRequiredSkills").removeAttribute('disabled');

                $http({
                    method: 'POST',
                    url: '../Resource/getRequiredSkillData',
                    params: { "strBusiness": str_business, "strBU": str_BU, "strHighOrg": str_HightOrg, "strMidOrg": str_MidOrg, "strTeam": str_Team }
                }).then(function (response) {
                    var dsRequiredSkills = response.data;
                    jSuite_dropRequiredSkills.setData(dsRequiredSkills);
                    jSuite_dropRequiredSkills.reset();
                }, function (error) {
                    console.log(error);
                });

            },
        });
        jSuite_dropRequiredSkills = jSuites.dropdown(document.getElementById('dropRequiredSkills'), {
            data: [],
            autocomplete: true,
            placeholder: "Select Required Skills",
            lazyLoading: false,
            multiple: false,
            width: '100%',
        });

        loadresourcetable();
    }

    $scope.Resourceclear = function () {
        resource_clear();
    }

    function resource_clear() {


        jSuite_dropBU.reset();
        jSuite_dropBusiness.reset();
        jSuite_dropHighOrg.reset();
        jSuite_dropMidOrg.reset();
        jSuite_dropTeam.reset();
        jSuite_dropRequiredSkills.reset();
        jSuite_dropOperatingExpenseWBS.reset();

        //document.getElementById("resourceWBSNumber").value = "";
        document.getElementById("resourcecomments").value = "";
        document.getElementById("dropBU").setAttribute('disabled', 'disabled');
        document.getElementById("dropHighOrg").setAttribute('disabled', 'disabled');
        document.getElementById("dropMidOrg").setAttribute('disabled', 'disabled');
        document.getElementById("dropTeam").setAttribute('disabled', 'disabled');
        document.getElementById("dropRequiredSkills").setAttribute('disabled', 'disabled');
    }

    $scope.addresourceinfo = function () {

        if (formSubmitting == false) {
            showalertsavechangesalert('It looks like you have been editing something in resource, so please savechanges!');
        }
        else {

            var projectname = jSuite_dropProjects.getText();
            var business = jSuite_dropBusiness.getText();
            var bu = jSuite_dropBU.getText();
            var highorg = jSuite_dropHighOrg.getText();
            var midorg = jSuite_dropMidOrg.getText();
            var team = jSuite_dropTeam.getText();
            var requiredskills = jSuite_dropRequiredSkills.getText();
            var comments = document.getElementById('resourcecomments').value;
            //var resource_wbsnumber = document.getElementById('resourceWBSNumber').value;
            var OperatingExpenseWBS = jSuite_dropOperatingExpenseWBS.getText();

            if (OperatingExpenseWBS === "") {
                showalert('Please select Operating Expense WBS!');
            } else if (projectname === "") {
                showalert('Please select project name!');
            } else if (business === "") {
                showalert('Please select business!');
            } else if (bu === "") {
                showalert('Please select business unit!');
            } else if (highorg === "") {
                showalert('Please select high org!');
            } else if (midorg === "") {
                showalert('Please select mid org!');
            } else if (team === "") {
                showalert('Please select team!');
            } else {

                updateprogressbar(20, "Data is inserting...");

                $http({
                    method: 'POST',
                    url: '../Resource/addResourceInfo',
                    params: {
                        "strWBSNumber": OperatingExpenseWBS,
                        "strProjectName": projectname,
                        "strbusiness": business,
                        "strbu": bu,
                        "strhighorg": highorg,
                        "strmidorg": midorg,
                        "strteam": team,
                        "strrequiredskills": requiredskills,
                        "strcomments": comments,
                    }
                }).then(function (response) {

                    updateprogressbar(80, "Data is loading...");

                    $http({
                        method: 'GET',
                        url: '../Resource/getresourcedata'
                    }).then(function (response) {
                        if (response.data.length > 0) {
                            var twidth = document.getElementById("mainbody").offsetWidth
                            var mywidth = (twidth - 108) + "px";
                            var elms = document.getElementById("tbl_resource").getElementsByTagName("*");
                            elms[5].setAttribute("style", "width:" + mywidth);

                            if (response.data.length === 1) {
                                dsResource = response.data;
                                loadresourcetable();
                            }
                            else {

                                //for (var i = 0; i < resource_hidecolumns.length; i++) {
                                //    //console.log(resource_hidecolumns[i])
                                //    var index = resource_hidecolumns[i];
                                //    obj.filter.children[index + 1].style.display = "block";
                                //    obj.showColumn(index);
                                //}
                                obj.setData(response.data);
                                //for (var i = 0; i < resource_hidecolumns.length; i++) {
                                //    //console.log(resource_hidecolumns[i])
                                //    var index = resource_hidecolumns[i];
                                //    obj.filter.children[index + 1].style.display = "none";
                                //    obj.hideColumn(index);
                                //}
                            }

                            updateprogressbar(100, "Data is loading...");
                            document.getElementById('progressbar').style.display = 'none';
                            //resource_clear();
                        }

                    }, function (error) {
                        console.log(error);
                    });

                }, function (error) {
                    console.log(error);
                });

            }

        }

    }

    $scope.save_resource_changes = function () {
        save(false);
    }

    $scope.discard_resource_changes = function () {
        formSubmitting = true
        refreshresourcedata();
        updatedInfo = [];
        deleteInfo = [];
        duplicateInfo = [];
        document.getElementById('notification').style.display = 'none';
        document.getElementById('update_notificationnumber1').innerHTML = 0;
        document.getElementById('delete_notificationnumber1').innerHTML = 0;
        savechangesinfullscreenmode();
    }

    function save(status) {

        updateprogressbar(45, "Saving changes....");

        var data = {
            update: updatedInfo,
            delete: deleteInfo,
            duplicate: duplicateInfo
        };

        $http({
            method: 'POST',
            url: '../Resource/submitchanges',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {

            formSubmitting = true;

            $http({
                method: 'GET',
                url: '../Resource/getresourcedata'
            }).then(function (response) {
                dsResource = response.data;
                obj.setData(response.data);

                getlastmodifieddata();
                if (status === true) {
                    duplicateInfo = [];
                }
                else {

                    duplicateInfo = [];
                    updatedInfo = [];
                    deleteInfo = [];
                    updateprogressbar(100, "Saving changes....");
                    document.getElementById('progressbar').style.display = 'none';
                    document.getElementById('notification').style.display = 'none';
                    document.getElementById('update_notificationnumber1').innerHTML = 0;
                    document.getElementById('delete_notificationnumber1').innerHTML = 0;
                    //validaterecords();
                }

                updateprogressbar(100, "Data is loading...");
                document.getElementById('progressbar').style.display = 'none';
                savechangesinfullscreenmode();

            }, function (error) {
                console.log(error);
            });

        }, function (error) {
            console.log(error);
        });
    }

    $scope.save_capital_changes = function () {
        savecapital(false);
    }

    $scope.discard_capital_changes = function () {

        capitalSubmitting = true
        document.getElementById('capital_notification').style.display = 'none';
        document.getElementById('capital_update_notificationnumber1').innerHTML = 0;
        document.getElementById('capital_delete_notificationnumber1').innerHTML = 0;
        capital_updatedInfo = [];
        capital_deleteInfo = [];
        capital_duplicateInfo = [];
        refreshcapitaldata();
    }

    function savecapital(status) {

        updateprogressbar(45, "Saving changes....");

        var data = {
            update: capital_updatedInfo,
            delete: capital_deleteInfo,
            duplicate: capital_duplicateInfo
        };

        $http({
            method: 'POST',
            url: '../Resource/submitcapitalchanges',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {

            getlastmodifieddata();
            capitalSubmitting = true;

            $http({
                method: 'GET',
                url: '../Resource/getcapitaldata'
            }).then(function (response) {
                dsCapital = response.data;
                objcapital.setData(response.data);

                if (status === true) {

                    updateprogressbar(100, "Data is loading...");
                    document.getElementById('progressbar').style.display = 'none';
                    capital_duplicateInfo = [];
                    savechangesinfullscreenmode();
                }
                else {
                    updateprogressbar(100, "Saving changes....");
                    document.getElementById('progressbar').style.display = 'none';
                    document.getElementById('capital_notification').style.display = 'none';
                    document.getElementById('capital_update_notificationnumber1').innerHTML = 0;
                    document.getElementById('capital_delete_notificationnumber1').innerHTML = 0;
                    capital_updatedInfo = [];
                    capital_deleteInfo = [];
                    capital_duplicateInfo = [];
                    savechangesinfullscreenmode();
                }

            }, function (error) {
                console.log(error);
            });

        }, function (error) {
            console.log(error);
        });

    }

    function validaterecords() {
        //var jsonobj = obj.getJson(false);
        //if (jsonobj.length === 0) {            
        //    var norecordsfound = document.createElement("div");
        //    norecordsfound.id = "tbl_resource_norecordfound";
        //    var textnorecordfound = document.createElement("span");
        //    textnorecordfound.className = "badge badge-dangerno";
        //    textnorecordfound.innerHTML = "No Records Found!";
        //    norecordsfound.appendChild(textnorecordfound);
        //    var maindivresource = document.getElementById("resource");
        //    maindivresource.appendChild(norecordsfound);
        //    document.getElementById("tbl_resource").setAttribute("style", "display:none;");
        //}
        //else {
        //    document.getElementById("tbl_resource_norecordfound").setAttribute("style", "display:none;");
        //    document.getElementById("tbl_resource").setAttribute("style", "display:block;");
        //}
    }

    function refreshresourcedata() {

        getlastmodifieddata();
        var getresourcepreviousdatacount = [];
        updateprogressbar(50, "Data is loading...");
        $http({
            method: 'GET',
            url: '../Resource/getresourcedata'
        }).then(function (response) {

            getresourcepreviousdatacount = obj.getJson(false);

            if (getresourcepreviousdatacount.length == 0) {
                var element = document.getElementById('tbl_resource');
                element.innerHTML = "";

                dsResource = response.data;
                updateprogressbar(100, "Data is loading...");
                document.getElementById('progressbar').style.display = 'none';
                duplicateInfo = [];
                if (dsResource.length === 0) {
                    showalert('No records found!');
                }
                loadresourcetable();
            }
            else {
                dsResource = response.data;
                obj.setData(response.data);
                updateprogressbar(100, "Data is loading...");
                document.getElementById('progressbar').style.display = 'none';
                duplicateInfo = [];
                if (dsResource.length === 0) {
                    showalert('No records found!');
                }
            }


        }, function (error) {
            console.log(error);
        });
    };

    function refreshcapitaldata() {

        getlastmodifieddata();
        var getcapital_previousdatacount = [];
        getcapital_previousdatacount = objcapital.getJson(false);

        updateprogressbar(50, "Data is loading...");
        $http({
            method: 'GET',
            url: '../Resource/getcapitaldata'
        }).then(function (response) {

            if (getcapital_previousdatacount.length == 0) {

                var element = document.getElementById('tbl_capital');
                element.innerHTML = "";

                dsCapital = response.data;
                updateprogressbar(100, "Data is loading...");
                document.getElementById('progressbar').style.display = 'none';
                capital_duplicateInfo = [];
                if (dsCapital.length === 0) {
                    showalert('No records found!');
                }
                loadcapitaldata();
            }
            else {
                objcapital.setData(response.data);
                updateprogressbar(100, "Data is loading...");
                document.getElementById('progressbar').style.display = 'none';
                if (response.data.length === 0) {
                    showalert('No records found!');
                }
            }

        }, function (error) {
            console.log(error);
        });
    };

    function refreshcapitallabordata() {

        getlastmodifieddata();
        var getcapitallabor_previousdatacount = [];
        getcapitallabor_previousdatacount = objcapitallabour.getJson(false);

        updateprogressbar(50, "Data is loading...");
        $http({
            method: 'GET',
            url: '../Resource/getcapitallabourdata'
        }).then(function (response) {

            if (getcapitallabor_previousdatacount.length == 0) {

                var element = document.getElementById('tbl_capitallabour');
                element.innerHTML = "";

                dsCapitalLabour = response.data;
                updateprogressbar(100, "Data is loading...");
                document.getElementById('progressbar').style.display = 'none';
                capitallabor_duplicateInfo = [];
                if (dsCapitalLabour.length === 0) {
                    showalert('No records found!');
                }
                load_capitallabourtabledata();
            }
            else {

                dsCapitalLabour = response.data;
                objcapitallabour.setData(response.data);
                updateprogressbar(100, "Data is loading...");
                document.getElementById('progressbar').style.display = 'none';
                capitallabor_duplicateInfo = [];
                if (dsCapitalLabour.length === 0) {
                    showalert('No records found!');
                }
            }

        }, function (error) {
            console.log(error);
        });
    }

    function refreshdedata() {

        getlastmodifieddata();
        var getde_previousdatacount = [];
        getde_previousdatacount = objdirectexpenses.getJson(false);

        updateprogressbar(50, "Data is loading...");
        $http({
            method: 'GET',
            url: '../Resource/getDirectExpensedata'
        }).then(function (response) {

            if (getde_previousdatacount.length == 0) {

                var element = document.getElementById('tbl_directexpenses');
                element.innerHTML = "";

                dsDirectExpense = response.data;
                updateprogressbar(100, "Data is loading...");
                document.getElementById('progressbar').style.display = 'none';
                directexpenses_duplicateInfo = [];
                if (dsDirectExpense.length === 0) {
                    showalert('No records found!');
                }
                load_directexpensedatatable();
            }
            else {

                dsDirectExpense = response.data;
                objdirectexpenses.setData(response.data);
                updateprogressbar(100, "Data is loading...");
                document.getElementById('progressbar').style.display = 'none';
                directexpenses_duplicateInfo = [];
                if (dsDirectExpense.length === 0) {
                    showalert('No records found!');
                }
            }

        }, function (error) {
            console.log(error);
        });
    }


    function savechangesinfullscreenmode() {

        var screenst = $scope.ProjectsTable_fullscreen;
        var width = parseInt(window.innerWidth);
        var height = parseInt(window.innerHeight);

        var activetablevalue = document.getElementById('activetabid').innerHTML;
        if (activetablevalue === "resource") {
            maintableid = 'tbl_resource';
        }
        else if (activetablevalue === "capital") {
            maintableid = 'tbl_capital';
        }
        else if (activetablevalue === "capitallabor") {
            maintableid = 'tbl_capitallabour';
        }
        else if (activetablevalue === "directexpenses") {
            maintableid = 'tbl_directexpenses';
        }

        if (screenst) {
            document.getElementById(maintableid).setAttribute('style', 'position: fixed; top: 0px; left: 0px; width:100%; height:100%; background-color: white;');
            var elms = document.getElementById(maintableid).getElementsByTagName("*");
            height = height - 40;
            elms[5].setAttribute('style', 'overflow: auto; top: 33px; transition: all 1s ease; height:' + height + 'px; width: ' + width + 'px;')
        }

    }


    function loadfullscreencss(fullscreenstatus) {

        var width = parseInt(window.innerWidth);
        var height = parseInt(window.innerHeight);
        var searchtablestyle = "";
        var insertcount = "";
        var deletecount = "";
        var notificationid = "";
        var maintableid = "";

        var activetablevalue = document.getElementById('activetabid').innerHTML;

        if (activetablevalue === "resource") {
            insertcount = document.getElementById('update_notificationnumber1').innerHTML;
            deletecount = document.getElementById('delete_notificationnumber1').innerHTML;
            document.getElementById('notification').style.display = 'none';
            notificationid = 'notification';
            maintableid = 'tbl_resource';
        }
        else if (activetablevalue === "capital") {
            insertcount = document.getElementById('capital_update_notificationnumber1').innerHTML;
            deletecount = document.getElementById('capital_delete_notificationnumber1').innerHTML;
            document.getElementById('capital_notification').style.display = 'none';
            notificationid = 'capital_notification';
            maintableid = 'tbl_capital';
        }
        else if (activetablevalue === "capitallabor") {
            insertcount = document.getElementById('capitallabor_update_notificationnumber1').innerHTML;
            deletecount = document.getElementById('capitallabor_delete_notificationnumber1').innerHTML;
            document.getElementById('capitallabor_notification').style.display = 'none';
            notificationid = 'capitallabor_notification';
            maintableid = 'tbl_capitallabour';
        }
        else if (activetablevalue === "directexpenses") {
            insertcount = document.getElementById('de_update_notificationnumber1').innerHTML;
            deletecount = document.getElementById('de_delete_notificationnumber1').innerHTML;
            document.getElementById('de_notification').style.display = 'none';
            notificationid = 'de_notification';
            maintableid = 'tbl_directexpenses';
        }

        if (parseInt(insertcount) > 0 || parseInt(deletecount) > 0) {
            document.getElementById(notificationid).style.display = 'block';
            if (fullscreenstatus) {
                document.getElementById(notificationid).setAttribute('style', 'position: fixed; top: 0px; left: 0px; width: 100%; display: block;');
                document.getElementById(maintableid).setAttribute('style', 'position: fixed; top: 30px; left: 0px; width:100%; height:100%; background-color: white;');

                var elms = document.getElementById(maintableid).getElementsByTagName("*");
                var varsearch = elms[5].getAttribute("style");
                height = height - 70;
                elms[5].setAttribute('style', 'overflow: auto; top: 33px; transition: all 1s ease; height:' + height + 'px; width: ' + width + 'px;')
            }
        }
    }


    //projectmaster.fullscreen(true);
    var searchstyle = "";
    $scope.ProjectsTable_fullscreen = false;

    window.onkeyup = function (event) {
        if (event.keyCode == 27) {

            var width = window.innerWidth
            var height = parseInt(window.innerHeight) - 40;
            var searchtablestyle = "";
            var insertcount = "";
            var deletecount = "";
            var notificationid = "";
            var maintableid = "";

            var activetablevalue = document.getElementById('activetabid').innerHTML;

            if (activetablevalue === "resource") {
                insertcount = document.getElementById('update_notificationnumber1').innerHTML;
                deletecount = document.getElementById('delete_notificationnumber1').innerHTML;
                document.getElementById('notification').style.display = 'none';
                notificationid = 'notification';
                maintableid = 'tbl_resource';
            }
            else if (activetablevalue === "capital") {
                insertcount = document.getElementById('capital_update_notificationnumber1').innerHTML;
                deletecount = document.getElementById('capital_delete_notificationnumber1').innerHTML;
                document.getElementById('capital_notification').style.display = 'none';
                notificationid = 'capital_notification';
                maintableid = 'tbl_capital';
            }
            else if (activetablevalue === "capitallabor") {
                insertcount = document.getElementById('capitallabor_update_notificationnumber1').innerHTML;
                deletecount = document.getElementById('capitallabor_delete_notificationnumber1').innerHTML;
                document.getElementById('capitallabor_notification').style.display = 'none';
                notificationid = 'capitallabor_notification';
                maintableid = 'tbl_capitallabour';
            }
            else if (activetablevalue === "directexpenses") {
                insertcount = document.getElementById('de_update_notificationnumber1').innerHTML;
                deletecount = document.getElementById('de_delete_notificationnumber1').innerHTML;
                document.getElementById('de_notification').style.display = 'none';
                notificationid = 'de_notification';
                maintableid = 'tbl_directexpenses';
            }

            var topvalue = 0;
            if (parseInt(insertcount) > 0 || parseInt(deletecount) > 0) {
                topvalue = 30;
                height = height - 30;
                document.getElementById(notificationid).style.display = 'block';
                var _height = height - 140;
                searchtablestyle = "overflow: auto; width: " + (width - 115).toString() + "px; height: " + _height + "px;"
            }
            else {
                var _height = height - 140;
                searchtablestyle = "overflow: auto; width: " + mainwidth + "; max-height: " + _height + "px;"
            }

            var screenstatus = $scope.ProjectsTable_fullscreen;

            if (screenstatus === true) {
                $scope.ProjectsTable_fullscreen = false;
                screenstatus = false;
            }
            else {
                $scope.ProjectsTable_fullscreen = true;
                screenstatus = true;
            }

            // search box css
            var elm = {};
            var elms = document.getElementById(maintableid).getElementsByTagName("*");
            var varsearch = elms[3].getAttribute("style");


            if (screenstatus) {
                searchstyle = varsearch;
                varsearch = "position: fixed; " + varsearch;
            }
            else {
                varsearch = searchstyle;
            }

            elms[3].setAttribute("style", varsearch)

            //table css
            var vartable = elms[5].getAttribute("style");


            if (screenstatus) {
                vartable = "overflow: auto; top: 33px; transition: all 1s ease; height:" + height + "px; width: " + width + "px;";
            }
            else {
                vartable = searchtablestyle + "transition: all 1s ease;";
            }
            elms[5].setAttribute("style", vartable)

            //table position
            var ProjectMasterFullScreen = document.getElementById(maintableid);
            var projectnotification = document.getElementById(notificationid);

            var css = ProjectMasterFullScreen.getAttribute("style");
            var noticss = projectnotification.getAttribute("style");

            var style = "position: fixed; top: " + topvalue + "px; left: 0px; width:100%; height:100%; background-color: white;";
            var nstyle = "position: fixed; top: 0px; left: 0px; width:100%;";

            if (css === null || css === "position: inherit;") {
                css = style;
                noticss = nstyle;
                if (parseInt(insertcount) > 0 || parseInt(deletecount) > 0) {
                    noticss = nstyle
                }
                else {
                    noticss = nstyle + "display:none;";
                }
            }
            else if (css === "position: fixed; top: " + topvalue + "px; left: 0px; width:100%; height:100%; background-color: white;") {
                css = "position: inherit;";

                if (parseInt(insertcount) > 0 || parseInt(deletecount) > 0) {
                    noticss = "position: inherit;";
                }
                else {
                    noticss = "position: inherit;" + "display: none;";
                }
            }

            ProjectMasterFullScreen.setAttribute("style", css);
            projectnotification.setAttribute("style", noticss)
        }
    }

    //function InputMaxLenght(maxLength) {

    //    // Methods
    //    this.closeEditor = function (cell, save) {
    //        var value = cell.children[0].value;
    //        cell.innerHTML = value;
    //        return value;
    //    };
    //    this.openEditor = function (cell) {
    //        var previousvalue = cell.innerHTML;
    //        // Create input
    //        var element = document.createElement('input');
    //        element.maxLength = maxLength;
    //        element.value = previousvalue;
    //        // // Update cell
    //        cell.classList.add('editor');
    //        cell.innerHTML = "";
    //        cell.appendChild(element);
    //        // // Focus on the element
    //        element.focus();
    //    };
    //    this.getValue = function (cell) {
    //        return cell.innerHTML;
    //    };
    //    this.setValue = function (cell, value) {
    //        cell.innerHTML = value;
    //    };
    //    this.updateCell = function (cell, value) {
    //        let instance = cell.parentNode.parentNode.parentNode.parentNode.parentNode.jexcel;
    //        let y = cell.dataset.y;
    //        let x = cell.dataset.x
    //        cell.innerHTML = value;
    //        instance.options.data[y][x] = value;
    //        return value;
    //    };
    //}

});

app.factory('FileUploadService', function ($http, $q) {

    var fac = {};
    fac.UploadFile = function (file) {
        var formData = new FormData();
        formData.append("file", file);
        var defer = $q.defer();

        $http({
            method: 'POST',
            url: '../Resource/SaveFiles',
            data: formData,
            withCredentials: true,
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (d) {
            defer.resolve(d);
        }, function (error) {
            defer.reject("File Upload Failed!");
        });

        return defer.promise;
    }
    return fac;

});



