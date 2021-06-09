var app = angular.module('MECC', []);
app.controller('MECCController', function ($scope, $sce, FileUploadService, $http) {
      
    //Dynamic table width: based on screen size system will configure the table cells width. (Start)
    var proforma_mainwidth = document.getElementById("mainbody").offsetWidth;
    var capital_mainwidth = (proforma_mainwidth - 1098) / 5;
    var resource_mainwidth = (proforma_mainwidth - 1096) / 4;
    var capitallabor_mainwidth = (proforma_mainwidth - 938) / 6;
    var de_mainwidth = (proforma_mainwidth - 1230) / 2;

    //End Dynamic width code.
    loadmastersettings();
    //Default config items.
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
    var dsResource_PC = [];
    var dsde_checkbook = [];
    var jSuite_dropSummaryFisYear = [];
    var jSuite_drop_Summary_Months = [];
    var jSuite_drop_Summary_Quarter = [];
    var dsCapitalLabour = [];
    var dsDirectExpense = [];
    var obj = [];
    var obj_PC = [];
    var objdirectexpenses = [];
    var objdirectexpenses_checkbook = [];
    var projectname = [];
    var rowRequiredSkills = [];
    var updatedInfo = [];
    var updatedInfo_resource_checkbook = [];
    var deleteInfo = [];
    var duplicateInfo = [];
    var capital_duplicateInfo = [];
    var skillmaster = [];
    var datasourcePriority = [];
    var datasourceCapitalCategory = [];
    var datasourceCapitalType = [];
    var capital_updatedInfo = [];
    var capital_deleteInfo = [];
    var capitallabor_updatedInfo = [];
    var capitallabor_deleteInfo = [];
    var capitallabor_duplicateInfo = [];
    var directexpenses_updatedInfo = [];
    var directexpenses_cb_updatedInfo = [];
    var directexpenses_deleteInfo = [];
    var directexpenses_duplicateInfo = [];
    var jSuite_dropOperatingExpenseWBSDE = [];
    var jSuite_dropResourceCheckboo_FisYear = [];
    var jSuite_dropProjects = [];
    var jSuite_drop_Capital_AOPProject_CapitalLabor = [];
    //var s_startvalue = 0;
    //var s_endvalue = 0;
    //var c_startvalue = 0;
    //var c_endvalue = 0;
    //var resource_hidecolumns = [];
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
    localStorage.setItem("CurrentPage", 2);
    var resource_comments = [];
    var capital_comments = [];
    var capitallabor_comments = [];
    var directexpenses_comments = [];
    var decbsource = { deitems: [] };
    var de_cb_readonly_status = false;
    $scope.showExporttoexcel = true;
    localStorage.setItem("decellID", null);
    var defaultFisYear = '';
    document.getElementById('resourcetotal').innerHTML = "0";
    document.getElementById('capitaltotal').innerHTML = "0";
    document.getElementById('capitallabortotal').innerHTML = "0";
    document.getElementById('detotal').innerHTML = "0";

    document.getElementById('activetabid').innerHTML = "summary";
    document.getElementsByClassName("jexcel_search").placeholder = "Search..";
    var mainwidth = document.getElementById("mainbody").offsetWidth
    var mainwidth_PC = (mainwidth - 110) + "px";
    mainwidth = (mainwidth - 76) + "px";
    document.getElementById("masterHelpCenter").addEventListener("click", loadhelpdesk);

    //1)Method will load project master dropdown.
    //2)It will configure default tab settings and default project.
    //3)If project name is not selected, it will move to landing page.
    loadProjectMaster();
    loaddefaultfisyear();
    function loadhelpdesk() {
        document.getElementById('helpcenter').style.display = 'block';
        dragElement(document.getElementById("helpcenter"));
        $scope.getcompletelist();
    }

    function loaddefaultfisyear() {
        $http({
            method: 'GET',
            url: '../resource/get_defaultfisyear'
        }).then(function (response) {
            defaultFisYear = response.data;
        }, function (error) {
            console.log(error);
        });
    }

    $scope.getcompletelist = function() {         
        $http({
            method: 'GET',
            url: '../resource/get_completehelp'
        }).then(function (response) { 

            var helplistdata = response.data;            
            for (var i = 0; i < helplistdata.length; i++) {
                var encodenotification = atob(helplistdata[i].Data);
                helplistdata[i].Data = encodenotification.replace(/<[^>]+>/g, '');
                console.log(helplistdata[i].Data);                
            }            
            $scope.helplist = helplistdata;

        }, function (error) {
            console.log(error);
        });
    }

    function setUsername(id, newUsername) {
        for (var i = 0; i < jsonObj.length; i++) {
            if (jsonObj[i].Id === id) {
                jsonObj[i].Username = newUsername;
                return;
            }
        }
    }

    $scope.htmlconverter = function (value) {
        var encodenotification = atob(value);
        return $sce.trustAsHtml(encodenotification.replace(/<[^>]+>/g, ''));
    }

    $scope.edittooltip = function (value) {
        if (value != null) {
            var item = value.split(","); 
            var text = '';
            for (i = 0; i < item.length; i++) {
                text += item[i] + "<br>";
            }            
            return $sce.trustAsHtml(text);
        }
        else {
            return $sce.trustAsHtml("");
        }        
    }

    $scope.viewresourceinfo = function (PID, WBSNumber, BU, HighOrg, MidOrg, Teams, FisYear) {
        updateprogressbar(20, "Resource is loading...");
        $http({
            method: 'GET',
            url: '../Resource/getresourcedata_forCheckBook',
            params: {
                "intProjectID": PID,
                "strWBSNumber": WBSNumber,
                "strBU": BU,
                "strHighOrg": HighOrg,
                "strMidOrg": MidOrg,
                "strTeams": Teams,                
                "intFisYear": FisYear
            }
        }).then(function (response) {
            dsResource_PC = response.data;
            dropdown_update_BU_PC();
            document.getElementById('notification_resource_checkbook').style.display = 'none';
            document.getElementById('update_resource_checkbook1').innerHTML = 0;
            dragElement(document.getElementById("resourcecheckbookpanel"));
        }, function (error) {
            console.log(error);
        });
    }

    $scope.viewdeinfo = function (wbsnumber, fisyear, expensecategory, description, rowinfo) {

        var sum = 0.00
        if (rowinfo != null && rowinfo.ID == 'A') {
            sum = rowinfo.MAY + rowinfo.JUN + rowinfo.JUL + rowinfo.AUG + rowinfo.SEP + rowinfo.OCT + rowinfo.NOV + rowinfo.DEC + rowinfo.JAN + rowinfo.FEB + rowinfo.MAR + rowinfo.APR;
        }
        de_cb_readonly_status = sum > 0 ? true : false;

        updateprogressbar(20, "DE is loading...");
        $http({
            method: 'POST',
            url: '../Resource/get_directExpensesdata_forcheckbookedit',
            params: {
                "intProjectID": localStorage.getItem("projectid"),
                "strWBSnumber": wbsnumber,
                "intFisYear": fisyear,
                "strExpensecategory": expensecategory,
                "strDescription": description
            }
        }).then(function (response) {
            dsde_checkbook = response.data;
            load_de_checkbookdata();
            document.getElementById('notification_de_checkbook').style.display = 'none';
            document.getElementById('update_de_checkbook1').innerHTML = 0;
            dragElement(document.getElementById("decheckbookpanel"));
        }, function (error) {
            console.log(error);
        });

    }

    function load_de_checkbookdata() {

        update_directexpenses_comments();
        $http({
            method: 'GET',
            url: '../Resource/getOperatingExpenseWBS',
            params: { "ProjectID": localStorage.getItem("projectid") }
        }).then(function (response) {
            rowOperatingExpenseWBS = response.data;

            $http({
                method: 'GET',
                url: '../Resource/getexpensecategory'
            }).then(function (response) {
                rowDirectExpense = response.data;
                loaddecheckbook();
            }, function (error) {
                console.log(error);
            });

        }, function (error) {
            console.log(error);
        });
    }

    $scope.closepopup = function (value) {

        document.getElementById(value).style.display = 'none';
        if (value == "decheckbookcji3panel" || value == "decheckbookpanel") {

            updateprogressbar(25, "DE checkbook is loading....");
            var Fisyear = jSuite_dropResourceCheckboo_FisYear.getValue();

            $http({
                method: 'POST',
                url: '../Resource/get_decheckbook',
                params: { "intProjectID": localStorage.getItem("projectid"), "intFisYear": Fisyear }
            }).then(function (response) {
                $scope.modelDECheckBook = response.data;
                if (response.data.length === 0)
                    showalert('No records found!');

                if (response.data.length > 0) {
                    updateprogressbar(75, "DE checkbook is loading....");
                    setTimeout(function () {
                        $scope.$apply(function () {
                            if (decbsource != null) {
                                for (var i = 0; i < decbsource.deitems.length; i++) {
                                    document.getElementById("decb-" + decbsource.deitems[0].fid).click();
                                }
                                updateprogressbar(100, "Completed...");
                            }
                        });
                    }, 1000);
                }
                else {
                    directexpenses_cb_updatedInfo = [];
                    updateprogressbar(100, "Completed...");
                }
            }, function (error) {
                console.log(error);
            });
        }

    }



    $scope.showResourceCheckbookSummaryChart = function () {

        var summarydata = $scope.modelsummaryChart;
        var options = {
            series: summarydata,
            chart: {
                height: 500,
                type: 'line',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: false
                }
            },
            colors: ['#002d5d', '#FF5133', '#0FC14D'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                lineCap: 'butt',
                colors: undefined,
                width: 2,
                dashArray: 0,
            },
            title: {
                text: 'AOP vs Current FY Spend (FTE)',
                align: 'left'
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
            },
            annotations: {
                yaxis: [
                    {
                        y: 0,
                        borderColor: '#051801'
                    }
                ]
            },
            markers: {
                size: 1
            },
            xaxis: {
                categories: ['MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR'],
                title: {
                    text: 'Month'
                }
            },
            yaxis: {
                title: {
                    text: 'FTE'
                },
                min: -42,
                max: 8,
                tickAmount: 15
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: 1
            }
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();

        document.getElementById('resourcecheckbooksummarypanel').style.display = 'block';
        dragElement(document.getElementById("resourcecheckbooksummarypanel"));
    }

    //Method will add drag option to popup panels.
    //Parameter: pass control ID as a parameter (Example: dragElement(document.getElementById("ID")))
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    getcompletelist();
    function getcompletelist() {
        $http({
            method: 'GET',
            url: '../notification/get_completenotification'
        }).then(function (response) {
            document.getElementById('notificationtotal').innerHTML = "Notification (" + response.data.length + ")";
            var notificationlist = "";
            for (var i = 0; i < response.data.length; i++) {
                notificationlist = notificationlist + " <a class='dropdown-item' onclick='shownotification(" + response.data[i].Sysid + ")'><i class='fa fa-dot-circle-o' aria-hidden='true'></i>&nbsp;&nbsp;" + response.data[i].Title + "</a>";
            }
            document.getElementById('notificationlistbody').innerHTML = notificationlist;
        }, function (error) {
            console.log(error);
        });
    }

    $scope.shownotification = function (item) {
        $http({
            method: 'POST',
            url: '../notification/get_notificationdata',
            params: {
                "intID": item
            }
        }).then(function (response) {
            var encodenotification = atob(response.data[0].Data);
            dragElement(document.getElementById("notificationpanel"));
            document.getElementById("notificationID").innerHTML = response.data[0].Sysid;
            document.getElementById("notificationBody").innerHTML = encodenotification;
            document.getElementById('notificationpanel').style.display = 'block';
            document.getElementById("closeNotification").style.display = 'block';
            document.getElementById("clearNotification").style.display = 'none';
        }, function (error) {
            console.log(error);
        });
    }

    $scope.closenotification = function () {
        document.getElementById('notificationpanel').style.display = 'none';
    }

    $scope.clearnotificaiton = function () {

        $http({
            method: 'POST',
            url: '../notification/clear_notification',
            params: {
                "intID": document.getElementById("notificationID").innerHTML,
                "strUserID": localStorage.getItem("userID"),
                "strUserName": localStorage.getItem("userName")
            }
        }).then(function (response) {
            document.getElementById('notificationpanel').style.display = 'none';
        }, function (error) {
            console.log(error);
        });
    }

    validatenotification();
    function validatenotification() {

        $http({
            method: 'POST',
            url: '../notification/validate_notification',
            params: {
                "strUserID": localStorage.getItem("userID")
            }
        }).then(function (response) {
            if (response.data == "False") {
                $http({
                    method: 'GET',
                    url: '../notification/get_notification'
                }).then(function (response) {
                    if (response.data != null) {
                        var encodenotification = atob(response.data[0].Data);
                        document.getElementById("notificationBody").innerHTML = encodenotification;
                        document.getElementById('notificationpanel').style.display = 'block';
                        document.getElementById("closeNotification").style.display = 'none';
                        document.getElementById("clearNotification").style.display = 'block';
                        document.getElementById("notificationID").innerHTML = response.data[0].Sysid;
                    }
                }, function (error) {
                    console.log(error);
                });
            }
            else {
                document.getElementById('notificationpanel').style.display = 'none';
            }
        }, function (error) {
            console.log(error);
        });
    }

    function load_defalutformsettings() {

        var d_resource = localStorage.getItem('displaycheckbox_resource') == null ? true : JSON.parse(localStorage.getItem('displaycheckbox_resource'));
        var d_capital = localStorage.getItem('displaycheckbox_capital') == null ? true : JSON.parse(localStorage.getItem('displaycheckbox_capital'));
        var d_capitallabor = localStorage.getItem('displaycheckbox_capitallabor') == null ? true : JSON.parse(localStorage.getItem('displaycheckbox_capitallabor'));
        var d_de = localStorage.getItem('displaycheckbox_de') == null ? true : JSON.parse(localStorage.getItem('displaycheckbox_de'));

        $scope.displaycheckbox_resource = d_resource;
        $scope.display_resourceform = d_resource;

        $scope.displaycheckbox_capital = d_capital;
        $scope.display_capitalform = d_capital;

        $scope.displaycheckbox_capitallabor = d_capitallabor;
        $scope.display_capitallaborform = d_capitallabor;

        $scope.displaycheckbox_de = d_de;
        $scope.display_deform = d_de;
    }

    $scope.validatecheckbox = function () {

        var activeTabName = document.getElementById('activetabid').innerHTML;
        if (activeTabName === "resource") {
            var value = $scope.displaycheckbox_resource;
            localStorage.setItem("displaycheckbox_resource", value)
            if (value == true) {
                $scope.display_resourceform = true;
            }
            else {
                $scope.display_resourceform = false;
            }
        }
        else if (activeTabName === "capital") {
            var value = $scope.displaycheckbox_capital;
            localStorage.setItem("displaycheckbox_capital", value)
            if (value == true) {
                $scope.display_capitalform = true;
            }
            else {
                $scope.display_capitalform = false;
            }
        }
        else if (activeTabName === "capitallabor") {
            var value = $scope.displaycheckbox_capitallabor;
            localStorage.setItem("displaycheckbox_capitallabor", value)
            if (value == true) {
                $scope.display_capitallaborform = true;
            }
            else {
                $scope.display_capitallaborform = false;
            }
        }
        else if (activeTabName === "directexpenses") {
            var value = $scope.displaycheckbox_de;
            localStorage.setItem("displaycheckbox_de", value)
            if (value == true) {
                $scope.display_deform = true;
            }
            else {
                $scope.display_deform = false;
            }
        };
    }

    function loaddefaultsummary() {
        $scope.Drop_ProjectClass = "col-md-6";
        document.getElementById('Display_FisYearFilter').style.display = "none";
        default_tabsetting("summary");
        document.getElementById('drop_Summary_Months').setAttribute('disabled', 'disabled');
        document.getElementById('drop_Summary_Quarter').setAttribute('disabled', 'disabled');
    }

    $scope.updatetotalsum = function () {
        setTimeout(function () {
            $scope.$apply(function () {
                refreshtablesum();
            });
        }, 1000);
    }

    function update_resource_comments() {
        $http({
            method: 'GET',
            url: '../Resource/getResourceComments',
            params: { "intProjectID": localStorage.getItem("projectid") }
        }).then(function (response) {
            resource_comments = response.data;
        }, function (error) {
            console.log(error);
        });
    }

    function update_capital_comments() {
        $http({
            method: 'GET',
            url: '../Resource/getCapitalComments',
            params: { "intProjectID": localStorage.getItem("projectid") }
        }).then(function (response) {
            capital_comments = response.data;
        }, function (error) {
            console.log(error);
        });
    }

    function update_capitallabor_comments() {
        $http({
            method: 'GET',
            url: '../Resource/getCapitalLaborComments',
            params: { "intProjectID": localStorage.getItem("projectid") }
        }).then(function (response) {
            capitallabor_comments = response.data;
        }, function (error) {
            console.log(error);
        });
    }

    function update_directexpenses_comments() {
        $http({
            method: 'GET',
            url: '../Resource/getDirectExpensesComments',
            params: { "intProjectID": localStorage.getItem("projectid") }
        }).then(function (response) {
            directexpenses_comments = response.data;
        }, function (error) {
            console.log(error);
        });
    }

    function refreshtablesum() {

        var activetab = document.getElementById('activetabid').innerHTML;
        var in_number = 0;
        var tablobj = [];
        var filterid = "";
        if (activetab === "resource") {
            in_number = 11;
            tablobj = obj;
            filterid = "resource_clearfilters";
        }
        else if (activetab === "capital") {
            in_number = 11;
            tablobj = objcapital;
            filterid = "capital_clearfilters";
        }
        else if (activetab === "capitallabor") {
            in_number = 14;
            tablobj = objcapitallabour;
            filterid = "capitallabor_clearfilters";
        }
        else if (activetab === "directexpenses") {
            in_number = 8
            tablobj = objdirectexpenses;
            filterid = "de_clearfilters";
        }

        if (activetab === "resource" || activetab === "capital" || activetab === "capitallabor" || activetab === "directexpenses") {


            if (tablobj.rows.length > 0) {
                var firstrowstatus = tablobj.rows[0].getAttribute("class");

                if (firstrowstatus == "selected")
                    tablobj.rows[0].removeAttribute("class");

                var MAY = 0.00; JUN = 0.00; JUL = 0.00; AUG = 0.00; SEP = 0.00; OCT = 0.00; NOV = 0.00; DEC = 0.00; JAN = 0.00; FEB = 0.00; MAR = 0.00; APR = 0.00;

                for (var k = 0; k < tablobj.rows.length; k++) {
                    var displaystatus = tablobj.rows[k].style.display;
                    if (displaystatus != 'none') {
                        MAY = MAY + parseFloat(tablobj.rows[k].children[in_number].innerHTML); JUL = JUL + parseFloat(tablobj.rows[k].children[in_number + 2].innerHTML);
                        JUN = JUN + parseFloat(tablobj.rows[k].children[in_number + 1].innerHTML); SEP = SEP + parseFloat(tablobj.rows[k].children[in_number + 4].innerHTML);
                        AUG = AUG + parseFloat(tablobj.rows[k].children[in_number + 3].innerHTML); NOV = NOV + parseFloat(tablobj.rows[k].children[in_number + 6].innerHTML);
                        OCT = OCT + parseFloat(tablobj.rows[k].children[in_number + 5].innerHTML); JAN = JAN + parseFloat(tablobj.rows[k].children[in_number + 8].innerHTML);
                        DEC = DEC + parseFloat(tablobj.rows[k].children[in_number + 7].innerHTML); MAR = MAR + parseFloat(tablobj.rows[k].children[in_number + 10].innerHTML);
                        FEB = FEB + parseFloat(tablobj.rows[k].children[in_number + 9].innerHTML); APR = APR + parseFloat(tablobj.rows[k].children[in_number + 11].innerHTML);
                    }
                }

                tablobj.tfoot.children[0].children[in_number - 2].innerHTML = MAY.toFixed(2); tablobj.tfoot.children[0].children[in_number - 1].innerHTML = JUN.toFixed(2);
                tablobj.tfoot.children[0].children[in_number].innerHTML = JUL.toFixed(2); tablobj.tfoot.children[0].children[in_number + 1].innerHTML = AUG.toFixed(2);
                tablobj.tfoot.children[0].children[in_number + 2].innerHTML = SEP.toFixed(2); tablobj.tfoot.children[0].children[in_number + 3].innerHTML = OCT.toFixed(2);
                tablobj.tfoot.children[0].children[in_number + 4].innerHTML = NOV.toFixed(2); tablobj.tfoot.children[0].children[in_number + 5].innerHTML = DEC.toFixed(2);
                tablobj.tfoot.children[0].children[in_number + 6].innerHTML = JAN.toFixed(2); tablobj.tfoot.children[0].children[in_number + 7].innerHTML = FEB.toFixed(2);
                tablobj.tfoot.children[0].children[in_number + 8].innerHTML = MAR.toFixed(2); tablobj.tfoot.children[0].children[in_number + 9].innerHTML = APR.toFixed(2);


                var filtersource = {
                    fitems: []
                };

                var filters = tablobj.filters.map(function (arr) { if (arr == null || arr == "") { return null; } else { return arr.slice(); } });
                document.getElementById(filterid).setAttribute("style", "display:none;");
                var filtercheck = 0;
                for (var i = 0; i < filters.length; i++) {
                    if (filters[i] != null) {
                        filtercheck = filtercheck + 1;
                        var filtersinfo = tablobj.filter.children[i + 1].innerHTML;
                        filtersource.fitems.push({
                            "fid": i,
                            "fname": filtersinfo
                        });
                        document.getElementById(filterid).setAttribute("style", "display:block;");
                    }
                }

                localStorage.setItem(activetab + "_filtersource", JSON.stringify(filtersource));
                if (filtercheck === 0) {
                    localStorage.removeItem(activetab + "filtersource");
                }
            }
        }
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
        summaryheight = summaryheight - 270;
        document.getElementById('summarycontainer').setAttribute('style', 'height: ' + summaryheight + 'px;');
        document.getElementById('notificationBody').setAttribute('style', 'height: ' + (parseInt(window.innerHeight) - parseInt(210)) + 'px;');

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
                "strQtr": fisqtr,
                "ProjectID": localStorage.getItem("projectid")
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

                document.getElementById('maincard').style.display = 'block';
                document.getElementById('summary').setAttribute("style", "padding-left:20px; padding-right:20px; opacity:1;")
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
        //return $sce.trustAsHtml(colName.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
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

            if (colName === "Total Project FTEs (Operating & Capital)" || colName === "Total Site Operating FTEs" || colName === "Site Operating FTEs" || colName === "Site Non Project Charging FTEs" || colName === "Total Non Site Operating FTEs" || colName === "Non Site Operating FTEs" || colName === "Non Site Non Project Charging FTEs" || colName === "Total Site and Non Site Capital FTEs" || colName === "Site Capital FTEs" || colName === "Site Non Project Charge Capital FTEs" || colName === "Non Site Capital FTEs" || colName === "Non Site Non Project Charge Capital FTEs") {
                return $sce.trustAsHtml("<font style='color:#007bff; font-weight:500;'><b>" + $scope.getvalues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b></font>");
                //return $sce.trustAsHtml($scope.getvalues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
            else {
                return $sce.trustAsHtml("<font style='color:#007bff; font-weight:500;'><b>$" + $scope.getvalues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b></font>");
                //return $sce.trustAsHtml($scope.getvalues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
        }
        else {
            return $sce.trustAsHtml("<b>" + $scope.getvalues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b>");
            //return $sce.trustAsHtml($scope.getvalues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
    }

    // To Display Toy Details as Toy Name wise Pivot Column wise Total
    $scope.showYMColumnGrandTotal = function (colName, colToyName) {

        $scope.getColumTots = 0;

        for (i = 0; i < $scope.SummaryDetails.length; i++) {
            if (colName == $scope.SummaryDetails[i].Name) {
                $scope.getColumTots = parseFloat(parseFloat($scope.getColumTots) + parseFloat($scope.SummaryDetails[i].value)).toFixed(2);
            }
        }

        if (colName === "Total Project FTEs (Operating & Capital)" || colName === "Total Site Operating FTEs" || colName === "Site Operating FTEs" || colName === "Site Non Project Charging FTEs" || colName === "Total Non Site Operating FTEs" || colName === "Non Site Operating FTEs" || colName === "Non Site Non Project Charging FTEs" || colName === "Total Site and Non Site Capital FTEs" || colName === "Site Capital FTEs" || colName === "Site Non Project Charge Capital FTEs" || colName === "Non Site Capital FTEs" || colName === "Non Site Non Project Charge Capital FTEs") {
            return $sce.trustAsHtml("<b>" + $scope.getColumTots.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b>");
        }
        else {
            return $sce.trustAsHtml("<b>$" + $scope.getColumTots.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b>");
        }

    }

    function getlastmodifieddata() {

        $http({
            method: 'GET',
            url: '../Resource/getlastmodifiedinfo',
            params: { "ProjectID": localStorage.getItem("projectid") }
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
            url: '../Resource/getprojectname',
            params: { "ProjectID": localStorage.getItem("projectid") }
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

            $http({
                method: 'GET',
                url: '../Resource/validateDuplicateProjectnumber',
                params: { "strProjectNumber": $scope.model_newProjectID }
            }).then(function (response) {
                var result = response.data;
                if (result == "False") {

                    updateprogressbar(50, "Cloning started...");
                    $http({
                        method: 'POST',
                        url: '../Projects/cloneproformaproject_fromproforma',
                        params: { "strNewProjectName": $scope.model_newProjectName, "strNewProjectID": $scope.model_newProjectID }
                    }).then(function (response) {
                        document.getElementById('cloneproject').style.display = 'none';
                        updateprogressbar(100, "Completed...");


                        var element = document.getElementById('dropProjects');
                        element.innerHTML = "";

                        jSuite_dropProjects = jSuites.dropdown(document.getElementById('dropProjects'), {
                            url: '../Resource/getprojectlist',
                            autocomplete: true,
                            placeholder: "Select Project",
                            lazyLoading: true,
                            multiple: false,
                            width: '100%',
                            value: localStorage.getItem("projectid"),
                            onchange: changeProjectData,
                        });

                    }, function (error) {
                        console.log(error);
                    });

                }
                else {
                    $scope.clonealert = true;
                    $scope.clonemessage = "Project number already used!";
                }
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
                method: 'POST',
                url: '../Resource/export_resourcedata',
                params: { "strProjectID": localStorage.getItem("projectid"), "strProjectNumber": localStorage.getItem("projectnumber"), "strProjectName": localStorage.getItem("projectname") }
            }).then(function (response) {
                downloadURI("../upload/" + response.data, response.data);
                updateprogressbar(100, "Completed...");

            }, function (error) {
                console.log(error);
            });

        } else if (activetabname == "capital") {
            updateprogressbar(50, "Exporting capital data into excel format, please wait...");
            $http({
                method: 'GET',
                url: '../Resource/export_capitaldata',
                params: { "ProjectID": localStorage.getItem("projectid"), "ProjectNumber": localStorage.getItem("projectnumber"), "strProjectName": localStorage.getItem("projectname") }
            }).then(function (response) {
                downloadURI("../upload/" + response.data, response.data);
                updateprogressbar(100, "Completed...");

            }, function (error) {
                console.log(error);
            });
        } else if (activetabname == "capitallabor") {
            updateprogressbar(50, "Exporting capitallabor data into excel format, please wait...");
            $http({
                method: 'GET',
                url: '../Resource/export_capitallabordata',
                params: { "ProjectID": localStorage.getItem("projectid"), "ProjectNumber": localStorage.getItem("projectnumber"), "strProjectName": localStorage.getItem("projectname") }
            }).then(function (response) {
                downloadURI("../upload/" + response.data, response.data);
                updateprogressbar(100, "Completed...");

            }, function (error) {
                console.log(error);
            });
        } else if (activetabname == "directexpenses") {
            updateprogressbar(50, "Exporting DE data into excel format, please wait...");
            $http({
                method: 'GET',
                url: '../Resource/export_dedata',
                params: { "ProjectID": localStorage.getItem("projectid"), "ProjectNumber": localStorage.getItem("projectnumber"), "strProjectName": localStorage.getItem("projectname") }
            }).then(function (response) {
                downloadURI("../upload/" + response.data, response.data);
                updateprogressbar(100, "Completed...");

            }, function (error) {
                console.log(error);
            });
        } else if (activetabname == "summary") {
            updateprogressbar(50, "Exporting summary data into excel format, please wait...");
            $http({
                method: 'GET',
                url: '../Resource/export_summarydata',
                params: { "ProjectID": localStorage.getItem("projectid"), "ProjectNumber": localStorage.getItem("projectnumber"), "strProjectName": localStorage.getItem("projectname") }
            }).then(function (response) {
                downloadURI("../upload/" + response.data, response.data);
                updateprogressbar(100, "Completed...");

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
            url: '../Resource/getresourcedata',
            params: { "ProjectID": localStorage.getItem("projectid") }
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
            url: '../Resource/getOperatingExpenseWBS',
            params: { "ProjectID": localStorage.getItem("projectid") }
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
            url: '../Resource/getOperatingExpenseWBS',
            params: { "ProjectID": localStorage.getItem("projectid") }
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
            url: '../Resource/getOperatingExpenseWBS',
            params: { "ProjectID": localStorage.getItem("projectid") }
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
            url: '../Resource/getCapitalExpenditureWBS',
            params: { "ProjectID": localStorage.getItem("projectid") }
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
            url: '../Resource/getCapitalExpenditureWBS',
            params: { "ProjectID": localStorage.getItem("projectid") }
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
        $scope.tabresourcecheckbookclass = "nav-link";
        $scope.tabcapitalclass = "nav-link";
        $scope.tabdecheckbookclass = "nav-link";

        //tab-pane active
        document.getElementById('summary').className = "tab-pane fade";
        document.getElementById('resource').className = "tab-pane fade";
        document.getElementById('capital').className = "tab-pane fade";
        document.getElementById('capitallabor').className = "tab-pane fade";
        document.getElementById('directexpenses').className = "tab-pane fade";
        document.getElementById('resourcecheckbook').className = "tab-pane fade";
        document.getElementById('decheckbook').className = "tab-pane fade";

        var tabclass = "nav-link active";

        if (value === "summary") {
            $scope.tabsummaryclass = tabclass;
        }
        else if (value === "resource") {
            $scope.tabresourceclass = tabclass;
        }
        else if (value === "capital") {
            $scope.tabcapitalclass = tabclass;
        }
        else if (value === "capitallabor") {
            $scope.tabcapitallaborclass = tabclass;
        }
        else if (value === "directexpenses") {
            $scope.tabdirectexpensesclass = tabclass;
        }
        else if (value === "resourcecheckbook") {
            $scope.tabresourcecheckbookclass = tabclass;
        }
        else if (value === "decheckbook") {
            $scope.tabdecheckbookclass = tabclass;
        }

        document.getElementById(value).className = "tab-pane active";
    }

    $scope.removedecheckbookcji3 = function (row) {

        var data = {
            item: row,
            ProjectID: localStorage.getItem("projectid")
        };

        $http({
            method: 'POST',
            url: '../Resource/remove_decheckbook_cji3',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            $scope.modelDECJI3 = response.data;
            if (response.data.length === 0) {
                document.getElementById('decheckbookcji3panel').style.display = 'none';
                showalert('No records found!');

                var Fisyear = jSuite_dropResourceCheckboo_FisYear.getValue();
                $http({
                    method: 'POST',
                    url: '../Resource/get_decheckbook',
                    params: { "intProjectID": localStorage.getItem("projectid"), "intFisYear": Fisyear }
                }).then(function (response) {
                    $scope.modelDECheckBook = response.data;
                }, function (error) {
                    console.log(error);
                });
            }

            calculatetotal_de_checkbook();
            calculatevalue_de_checkbook();
            calculatetotal_de_openpo();

        }, function (error) {
            console.log(error);
        });
    }

    $scope.expandde = function (status, id) {

        decbsource = JSON.parse(localStorage.getItem("decb_expandid"));
        if (status == false) {
            if (decbsource != null) {
                if (decbsource.deitems.find(x => x.fid === id)) {
                    const index = decbsource.deitems.findIndex(c => c.fid === id);
                    decbsource.deitems.splice(index, 1)
                    localStorage.setItem("decb_expandid", JSON.stringify(decbsource));
                }
            }
        }
        else {
            if (decbsource == null) {
                decbsource = { deitems: [] };
            }
            else {
                if (decbsource.deitems.find(x => x.fid === id)) {
                    const index = decbsource.deitems.findIndex(c => c.fid === id);
                    decbsource.deitems.splice(index, 1)
                    localStorage.setItem("decb_expandid", JSON.stringify(decbsource));
                }
            }
            decbsource.deitems.push({ "fid": id });
            localStorage.setItem("decb_expandid", JSON.stringify(decbsource));
        }
    }

    $scope.show_de_cji3data = function (PONumber, wbsnumber, fisyear, month, expensecategory, description, status, show, rowstr, rowid) {
        
        updateprogressbar(20, "loading...");
        $http({
            method: 'POST',
            url: '../Resource/get_de_cji3_data',
            params: { "intProjectID": localStorage.getItem("projectid"), "strWBSNumber": wbsnumber, "strFisYear": fisyear, "strMonth": month, "strExpensecategory": expensecategory, "strDescription": description, "boolstatus": status, "strPONumber": PONumber }
        }).then(function (response) {
            $scope.modelDECJI3 = response.data;

            if (response.data.length === 0) {
                showalert('No records found!');
                document.getElementById('decheckbookcji3panel').style.display = 'none';
                remove_decheckbook_cell_highlight();

            }
            else {

                if (show == "save") {
                    remove_decheckbook_cell_highlight();
                    localStorage.setItem("decellID", rowstr + '-' + rowid)
                    document.getElementById(rowstr + '-' + rowid).setAttribute("style", "background-color: #0853c3; color: white;");
                    $scope.show_decji3save = true;
                    $scope.hidcheckboxde = true;
                }
                else {
                    $scope.show_decji3save = false;
                    $scope.hidcheckboxde = false;
                }
                $scope.IsAllChecked = false;
                $scope.selected_de_cb_Total = 0;
                $scope.selected_de_cb_value = 0;

                calculatetotal_de_checkbook();
                calculatevalue_de_checkbook();
                calculatetotal_de_openpo();

                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.CheckUncheckHeader(response.data);
                    });
                }, 500);

                dragElement(document.getElementById("decheckbookcji3panel"));
                document.getElementById('decheckbookcji3panel').style.display = 'block';
            }

            updateprogressbar(100, "Completed...");

        }, function (error) {
            console.log(error);
        });


    }

    //The medthod will remove the DE Checkbook cell highlight color    
    function remove_decheckbook_cell_highlight() {        
        /* once user click on cell, it store the cell ID, next time if user click different cell system will 
         * replace the cell ID which is stored and stored cell style will be removed. */
        var decellid = localStorage.getItem("decellID") 
        console.log(decellid);
        if (decellid != 'null') {
            document.getElementById(decellid).removeAttribute("style");
        }
    }

    $scope.insert_de_cji3data = function () {

        updateprogressbar(20, "Saving Changes...");

        var directexpenses_cji3data = [];
        for (var i = 0; i < $scope.modelDECJI3.length; i++) {
            if ($scope.modelDECJI3[i].Selected == true) {
                var rowcji3 = $scope.modelDECJI3[i];
                directexpenses_cji3data.push(rowcji3);
            }
        };

        var data = {
            insert: directexpenses_cji3data,
            ProjectID: localStorage.getItem("projectid")
        };

        $http({
            method: 'POST',
            url: '../Resource/insert_de_cji3_selection',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            $scope.modelDECJI3 = response.data;
            updateprogressbar(100, "Completed...");

            calculatetotal_de_checkbook();
            calculatevalue_de_checkbook();
            calculatetotal_de_openpo();

            $scope.selected_de_cb_Total = 0;
            $scope.selected_de_cb_value = 0;
        }, function (error) {
            console.log(error);
        });
    }

    $scope.updatetabeinfo = function (value) {

        $scope.showExporttoexcel = true;
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
                $scope.Drop_ProjectClass = "col-md-6";
                document.getElementById('Display_FisYearFilter').style.display = "none";
            }
        }
        else if (value === "resource") {
            if (capitalSubmitting === false || capitallaborSubmitting === false || deSubmitting === false) {
                showalertsavechangesalert('It looks like you have been editing something, so please savechanges!');
            }
            else {
                update_resource_comments();
                updateprogressbar(20, "Resource is loading...");
                updateskillfilter();
                dropdown_update_BU();
                default_tabsetting("resource");
                $scope.Drop_ProjectClass = "col-md-6";
                load_defalutformsettings();
                getlastmodifieddata();
                document.getElementById('Display_FisYearFilter').style.display = "none";
            }
        }
        else if (value === "capital") {
            if (formSubmitting === false || capitallaborSubmitting === false || deSubmitting === false) {
                showalertsavechangesalert('It looks like you have been editing something, so please savechanges!');
            }
            else {
                update_capital_comments();
                updateprogressbar(20, "Capital is loading...");
                getcapital();
                default_tabsetting("capital");
                $scope.Drop_ProjectClass = "col-md-6";
                load_defalutformsettings();
                getlastmodifieddata();
                document.getElementById('Display_FisYearFilter').style.display = "none";
            }
        }
        else if (value === "capitallabor") {

            if (capitalSubmitting === false || formSubmitting === false || deSubmitting === false) {
                showalertsavechangesalert('It looks like you have been editing something, so please savechanges!');
            }
            else {
                update_capitallabor_comments();
                updateprogressbar(20, "CapitalLabor is loading...");
                document.getElementById('dropBU_CL').setAttribute('disabled', 'disabled');
                document.getElementById('dropHighOrg_CL').setAttribute('disabled', 'disabled');
                document.getElementById('dropMidOrg_CL').setAttribute('disabled', 'disabled');
                document.getElementById('dropTeam_CL').setAttribute('disabled', 'disabled');
                document.getElementById('dropRequiredSkills_CL').setAttribute('disabled', 'disabled');
                getcapitallabour();
                default_tabsetting("capitallabor");
                $scope.Drop_ProjectClass = "col-md-6";
                load_defalutformsettings();
                getlastmodifieddata();
                document.getElementById('Display_FisYearFilter').style.display = "none";
            }
        }
        else if (value === "directexpenses") {

            if (capitalSubmitting === false || formSubmitting === false || capitallaborSubmitting === false) {
                showalertsavechangesalert('It looks like you have been editing something, so please savechanges!');
            }
            else {
                update_directexpenses_comments();
                updateprogressbar(20, "Direct Expenses is loading...");
                getDirectExpenses();
                default_tabsetting("directexpenses");
                $scope.Drop_ProjectClass = "col-md-6";
                load_defalutformsettings();
                getlastmodifieddata();
                document.getElementById('Display_FisYearFilter').style.display = "none";
            }
        }
        else if (value === "resourcecheckbook") {
            updateprogressbar(25, "Resource checkbook is loading....");
            $scope.showExporttoexcel = false;
            default_tabsetting("resourcecheckbook");
            refresh_resourcecheckbook();
        }
        else if (value === "decheckbook") {
            updateprogressbar(25, "DE checkbook is loading....");
            $scope.showExporttoexcel = false;
            default_tabsetting("decheckbook");
            refresh_decheckbook();
        }
    }

    //it will load DE checkbook data
    function refresh_decheckbook() {
        updateprogressbar(20, "Loading DE CheckBook...");
        var summaryheight = parseInt(window.innerHeight);
        summaryheight = summaryheight - 220;
        document.getElementById('decheckbookcontainer').setAttribute('style', 'height: ' + summaryheight + 'px; overflow: scroll;');
        $scope.Drop_ProjectClass = "col-md-5";
        document.getElementById('Display_FisYearFilter').style.display = "block";

        $http({
            method: 'POST',
            url: '../Resource/get_dececheckbook_fisyear',
            params: { "intProjectID": localStorage.getItem("projectid") }
        }).then(function (response) {
            var resourcecheckbookyear = response.data;
                       
            document.getElementById('dropResourceCheckboo_FisYear').innerHTML = "";
            jSuite_dropResourceCheckboo_FisYear = jSuites.dropdown(document.getElementById('dropResourceCheckboo_FisYear'), {
                data: resourcecheckbookyear,
                autocomplete: true,
                lazyLoading: false,
                multiple: false,
                value: defaultFisYear,
                width: '100%',
                onchange: changeCheckBookFisYear
            });

            if (resourcecheckbookyear.length > 0) {
                var Fisyear = jSuite_dropResourceCheckboo_FisYear.getValue();
                load_de_checkbook(Fisyear);
            }
            else {
                showalert('No records found!');
                updateprogressbar(100, "Completed...");
                $scope.modelDECheckBook = null;
                $scope.modelDECJI3reconciliation = null;
            }

        }, function (error) {
            console.log(error);
        });

    }

    function load_de_checkbook(Fisyear) {

        $http({
            method: 'POST',
            url: '../Resource/get_decheckbook',
            params: { "intProjectID": localStorage.getItem("projectid"), "intFisYear": Fisyear }
        }).then(function (response) {

            $scope.modelDECheckBook = response.data;

            if (response.data.length === 0)
                showalert('No records found!');
            updateprogressbar(100, "Completed...");

            var tablewidth = document.getElementById('decheckbook').offsetWidth;
            tablewidth = tablewidth - 52;
            var tablezoom = '100%';
            if (tablewidth < 1512) {
                tablewidth = 1512;
                tablezoom = '80%';
            }
            $scope.decheckbookzoom = tablezoom;
            $scope.decheckbookwidth = tablewidth + "px";
            $scope.de_dynamic_checkbook_width = parseInt((tablewidth - 1046) / 3) + "px";
            $scope.defiltercount = Math.round(parseInt((tablewidth - 1000) / 3) / 8);

            $http({
                method: 'POST',
                url: '../Resource/getde_cji3_total_reconciliation_remaining',
                params: { "intProjectID": localStorage.getItem("projectid"), "intFisYear": Fisyear }
            }).then(function (response) {
                $scope.modelDECJI3reconciliation = response.data;
            }, function (error) {
                console.log(error);
            });

        }, function (error) {
            console.log(error);
        });
    }

    $scope.setDeSubmenuColor = function (id, alignment, number) {

        var numbercolor = "#212529";
        if (number < 0) {
            numbercolor = "#c11727";
        }

        if (id == 'A') {
            return {
                "background-color": "rgb(224 239 143)",
                "font-weight": "500",
                "text-align": alignment,
                "color": numbercolor,
                "cursor": "pointer"
            }
        }
        else {
            return {
                "background-color": "rgb(232, 255, 220)",
                "font-weight": "500",
                "text-align": alignment,
                "color": numbercolor,
                "cursor": "context-menu"
            }
        }
    }

    $scope.CheckUncheckHeader = function (masterDECJI3) {
        
        $scope.modelDECJI3 = masterDECJI3;
        var count = 0;
        var select_de_cb_total = 0;
        var select_de_cb_value = 0;
        var select_de_openpo = 0;
        for (var i = 0; i < $scope.modelDECJI3.length; i++) {

            if (!$scope.modelDECJI3[i].Selected) {
                $scope.IsAllChecked = false;
            }
            if ($scope.modelDECJI3[i].Selected == true) {
                count++;
                select_de_cb_total = select_de_cb_total + $scope.modelDECJI3[i].TotalQuantity;
                select_de_cb_value = select_de_cb_value + $scope.modelDECJI3[i].Val_COAreaCrcy;
                select_de_openpo = select_de_openpo + $scope.modelDECJI3[i].PO_Amount;
                document.getElementById("decbcji3-" + i).setAttribute("style", "background: #cce9ff8c;");
            }
            else {
                document.getElementById("decbcji3-" + i).removeAttribute("style");
            }

        };
        if ($scope.modelDECJI3.length == count) {
            $scope.IsAllChecked = true;
        }
        $scope.selected_de_cb_Total = select_de_cb_total;
        $scope.selected_de_cb_value = select_de_cb_value;
        $scope.select_de_openpo = select_de_openpo;
    };

    function calculatetotal_de_checkbook() {
        var total = 0.00;
        for (var i = 0; i < $scope.modelDECJI3.length; i++) {
            total = total + $scope.modelDECJI3[i].TotalQuantity;
        }
        $scope.de_cb_total = total;
    }

    function calculatetotal_de_openpo() {
        var total = 0.00;
        for (var i = 0; i < $scope.modelDECJI3.length; i++) {
            total = total + $scope.modelDECJI3[i].PO_Amount;
        }
        $scope.select_de_openpo = total;
    }

    function calculatevalue_de_checkbook() {
        var total = 0.00;
        for (var i = 0; i < $scope.modelDECJI3.length; i++) {
            total = total + $scope.modelDECJI3[i].Val_COAreaCrcy;
        }
        $scope.de_cb_value = total;
    }

    $scope.CheckUncheckAll = function () {
        var select_de_cb_total = 0;
        var select_de_cb_value = 0;
        for (var i = 0; i < $scope.modelDECJI3.length; i++) {
            $scope.modelDECJI3[i].Selected = $scope.IsAllChecked;
            if ($scope.IsAllChecked == true) {
                select_de_cb_total = select_de_cb_total + $scope.modelDECJI3[i].TotalQuantity;
                select_de_cb_value = select_de_cb_value + $scope.modelDECJI3[i].Val_COAreaCrcy;
            }
        }
        $scope.selected_de_cb_Total = select_de_cb_total;
        $scope.selected_de_cb_value = select_de_cb_value;
    };

    function refresh_resourcecheckbook() {

        updateprogressbar(20, "Loading Resource CheckBook...");
        var summaryheight = parseInt(window.innerHeight);
        summaryheight = summaryheight - 220;
        document.getElementById('resourcecheckbookcontainer').setAttribute('style', 'height: ' + summaryheight + 'px; overflow: scroll;');
        $scope.Drop_ProjectClass = "col-md-5";
        document.getElementById('Display_FisYearFilter').style.display = "block";
        updateskillfilter();

        $http({
            method: 'POST',
            url: '../Resource/get_resourcecheckbook_fisyear',
            params: { "intProjectID": localStorage.getItem("projectid") }
        }).then(function (response) {
            var resourcecheckbookyear = response.data;
            
            document.getElementById('dropResourceCheckboo_FisYear').innerHTML = "";
            jSuite_dropResourceCheckboo_FisYear = jSuites.dropdown(document.getElementById('dropResourceCheckboo_FisYear'), {
                data: resourcecheckbookyear,
                autocomplete: true,
                lazyLoading: false,
                multiple: false,
                value: defaultFisYear,
                width: '100%',
                onchange: changeCheckBookFisYear
            });

            update_resource_comments();
            loadresourcecheckbooksummary(defaultFisYear);
            loadresourcecheckbook(defaultFisYear);

        }, function (error) {
            console.log(error);
        });
    }

    function changeCheckBookFisYear() {
        updateprogressbar(20, "Loading Resource Checkbook...");
        var Fisyear = jSuite_dropResourceCheckboo_FisYear.getValue();
        var activeTabName = document.getElementById('activetabid').innerHTML;
        if (activeTabName === "resourcecheckbook") {
            loadresourcecheckbooksummary(Fisyear);
            loadresourcecheckbook(Fisyear);
        }
        else if (activeTabName === "decheckbook") {
            load_de_checkbook(Fisyear);
        }
    }

    function loadresourcecheckbook(Fisyear) {
        $http({
            method: 'POST',
            url: '../Resource/getResourceCheckBookData',
            params: { "intProjectID": localStorage.getItem("projectid"), "intFisYear": Fisyear }
        }).then(function (response) {
            $scope.modelRresourceCheckBook = response.data;
            if (response.data.length === 0)
                showalert('No records found!');
            
            var tablewidth = document.getElementById('resourcecheckbook').offsetWidth;
            tablewidth = tablewidth - 52;
            var tablezoom = '100%';
            if (tablewidth < 1512) {
                tablewidth = 1512;
                tablezoom = '80%';
            }
            $scope.subResourcetablewidth = tablewidth + 'px';
            document.getElementById("tblresourcecheckbook").setAttribute("style", "zoom:" + tablezoom + "");

            console.log(parseInt(tablewidth));
            tablewidth = parseInt(tablewidth) - 1208;
            console.log(tablewidth);

            document.getElementById("checkbook_MidOrg").setAttribute("style", "width:" + tablewidth + "px;");
            $scope.subresourcewidth = tablewidth + 'px';
            updateprogressbar(100, "Completed...");

        }, function (error) {
            console.log(error);
        });
    }

    function loadresourcecheckbooksummary(FisYear) {
        $http({
            method: 'POST',
            url: '../Resource/getResourceCheckBook_Summary',
            params: { "intProjectID": localStorage.getItem("projectid"), "intFisYear": FisYear }
        }).then(function (response) {
            $scope.modelRresourceCheckBookSummary = response.data.summarydata;
            $scope.modelsummaryChart = response.data.summaryChart;
        }, function (error) {
            console.log(error);
        });
    }

    $scope.clickexpandedsummary = function (es) {
        $scope.expandedsummary = !es;

        if (es == undefined || es == false) {
            document.getElementById("blankrow").rowSpan = "9";
            document.getElementById('chart').style.display = "block";
        }
        else {
            document.getElementById("blankrow").removeAttribute("rowSpan");
            document.getElementById('chart').style.display = "none";
        }

    }

    $scope.set_width = function () {
        var proforma_mainwidth = document.getElementById("mainbody").offsetWidth;
        return { "width": ((parseInt(proforma_mainwidth) - 787.5) / 4) + "px" }
    }

    $scope.set_width_child = function () {
        var proforma_mainwidth = document.getElementById("mainbody").offsetWidth;
        return { "width": ((parseInt(proforma_mainwidth) - 796.002) / 4) + "px" }
    }

    $scope.setAFColor = function (value) {
        if (value == "A") {
            return {
                "background-color": "#e5f6ff"
            }
        }
        else if (value == "F") {
            return {
                "background-color": "#e8ffdc"
            }
        }
    }

    $scope.setsummarycolor = function (value) {

        if (Math.sign(value) == -1) {
            return {
                "background-color": "rgb(255 242 178)",
                "text-align": "right",
                "width": "53px"
            }
        }
        else if (Math.sign(value) == 1) {
            return {
                "background-color": "rgb(251 203 208)",
                "text-align": "right",
                "width": "53px"
            }
        }
        else if (Math.sign(value) == 0) {
            return {
                "background-color": "rgb(195 255 208)",
                "text-align": "right",
                "width": "53px"
            }
        }
    }

    $scope.expandAll = function (expanded) {
        $scope.$broadcast('onExpandAll', { expanded: expanded });
    };

    $scope.celldefalutstyle = function () {
        return {
            "font-weight": "500",
            "text-align": "right",
            "width": "53px"
        }
    }

    $scope.setDECheckbookcolor = function (forecast, Actuals, status) {

        if (status == "B") {
            Actuals = 0
        }

        if (Actuals == 0) {
            return {
            }
        }
        else if (forecast == Actuals) {
            return {
                "background-color": "#ddffd6"
            }
        }
        else if (forecast > Actuals && Actuals > 0) {
            return {
                "background-color": "rgb(255 249 201)"
            }
        }
        else if (forecast < Actuals && Actuals > 0) {
            return {
                "background-color": "rgb(255 214 214)"
            }
        }
    }

    $scope.setcolor = function (value) {

        if (Math.sign(value) == -1) {
            return {
                "background-color": "rgb(255 242 178)",
                "font-weight": "bold",
                "text-align": "center",
                "text-align": "right"
            }
        }
        else if (Math.sign(value) == 1) {
            return {
                "background-color": "rgb(251 203 208)",
                "font-weight": "bold",
                "text-align": "right"
            }
        }
        else if (Math.sign(value) == 0) {
            return {
                "font-weight": "500",
                "text-align": "right"
            }
        }
    }

    function getcapital() {
        capitalSubmitting = true;
        $http({
            method: 'GET',
            url: '../Resource/getcapitaldata',
            params: { "ProjectID": localStorage.getItem("projectid") }
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
            url: '../Resource/getDirectExpensedata',
            params: { "ProjectID": localStorage.getItem("projectid") }
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
            url: '../Resource/getcapitallabourdata',
            params: { "ProjectID": localStorage.getItem("projectid") }
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
                            url: '../Resource/getCapitalExpenditureWBS',
                            params: { "ProjectID": localStorage.getItem("projectid") }
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

    function loadProjectMaster() {

        updateprogressbar(20, "Loading project master...");
        $http({
            method: 'GET',
            url: '../index/getprojectlist'
        }).then(function (response) {

            var completeProjectList = response.data;

            jSuite_dropProjects = jSuites.dropdown(document.getElementById('dropProjects'), {
                data: completeProjectList,
                autocomplete: true,
                placeholder: "Select Project",
                lazyLoading: true,
                multiple: false,
                width: '100%',
                value: localStorage.getItem("localProjectID"),
                onchange: changeProjectData,
            });

            if (localStorage.getItem("projectname") === null || localStorage.getItem("projectname") === undefined) {
                updateprogressbar(100, "Completed...");
                showalert('Please select project!');
                //if project name is not selected, it will navigate to landing page, 
                //I am using 1 sec delay before navigating, as user has to see the alert message.
                setTimeout(function () {
                    $scope.$apply(function () {
                        window.location.href = '../index/Index';
                    });
                }, 1000);
            }
            else {

                updateprogressbar(50, "Validating selected project...");
                var localProjectID = localStorage.getItem("projectid");
                var localUserName = localStorage.getItem("userName");
                jSuite_dropProjects.setValue(localProjectID);
                //update username in top menu
                document.getElementById('loginusername').innerHTML = "Welcome, " + localUserName;
                document.getElementById('userprofilepanel1').style.display = 'block';
                document.getElementById('userprofilepanel2').style.display = 'block';
                loaddefaultsummary();
            }

        }, function (error) {
            console.log(error);
        });

    }

    function changeProjectData() {

        var PID = jSuite_dropProjects.getValue();
        document.getElementById('resourcetotal').innerHTML = "0";
        document.getElementById('capitaltotal').innerHTML = "0";
        document.getElementById('capitallabortotal').innerHTML = "0";
        document.getElementById('detotal').innerHTML = "0";

        if (PID === "") {
            showalert('Please select a project!');
        }
        else {

            //ashok (change below code).
            $http({
                method: 'POST',
                url: '../index/updateprojectname',
                params: { "strProjectID": PID }
            }).then(function (response) {
                var projectdata = response.data;
                localStorage.setItem("projectid", projectdata[0].ProjectID);
                localStorage.setItem("projectnumber", projectdata[0].ProjectNumber);
                localStorage.setItem("projectname", projectdata[0].ProjectName);
                localStorage.setItem("projectselectedvalue", jSuite_dropProjects.getText());

                var activeTabName = document.getElementById('activetabid').innerHTML;
                if (activeTabName === "summary") bindsummaryfisyeardropdown();
                else if (activeTabName === "resource") { update_resource_comments(); refresh_OperatingExpenseWBS(); }
                else if (activeTabName === "capital") { update_capital_comments(); refresh_CapitalExpenditureWBS(); }
                else if (activeTabName === "capitallabor") { update_capitallabor_comments(); refresh_CapitalLaborExpenditureWBS(); }
                else if (activeTabName === "directexpenses") { update_directexpenses_comments(); refresh_OperatingExpenseWBSDE(); }
                else if (activeTabName === "resourcecheckbook") { update_resource_comments(); refresh_resourcecheckbook(); }
                else if (activeTabName === "decheckbook") { refresh_decheckbook(); }

            }, function (error) {
                console.log(error);
            });

        }

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



    function loaddirectexpenses() {

        document.getElementById('drop_DE_ExpenseCategory').innerHTML = "";
        document.getElementById('dropOperatingExpenseWBSDE').innerHTML = "";
        document.getElementById('tbl_directexpenses').innerHTML = "";
        var jSuite_drop_drop_DE_ExpenseCategory = [];

        $http({
            method: 'GET',
            url: '../Resource/getOperatingExpenseWBS',
            params: { "ProjectID": localStorage.getItem("projectid") }
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
                            "strdescription": de_description,
                            "userid": localStorage.getItem("userID"),
                            "ProjectID": localStorage.getItem("projectid")
                        }
                    }).then(function (response) {

                        updateprogressbar(80, "Data is loading...");

                        $http({
                            method: 'GET',
                            url: '../Resource/getDirectExpensedata',
                            params: { "ProjectID": localStorage.getItem("projectid") }
                        }).then(function (response) {
                            if (response.data.length > 0) {

                                if (response.data.length === 1) {
                                    document.getElementById('tbl_directexpenses').innerHTML = "";
                                    dsDirectExpense = response.data;
                                    load_directexpensedatatable();
                                }
                                else {
                                    objdirectexpenses.setData(response.data);
                                }

                                updateprogressbar(100, "Completed...");
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

        updateprogressbar(100, "Completed...");

    }

    function insert_directexpenses_comments(MasterID, ColumnID, Comments) {
        updateprogressbar(50, "Updating comments...");
        $http({
            method: 'POST',
            url: '../Resource/insert_directexpensescomments',
            params: { "intProjectID": localStorage.getItem("projectid"), "intMasterID": MasterID, "intColumnID": ColumnID, "strComments": Comments, "userid": localStorage.getItem("userID") }
        }).then(function (response) {
            update_directexpenses_comments();
            updateprogressbar(100, "Completed...");

        }, function (error) {
            console.log(error);
        });
    }

    function delete_directexpenses_comments(MasterID, ColumnID) {
        updateprogressbar(50, "Updating comments...");
        $http({
            method: 'POST',
            url: '../Resource/delete_directexpensescomments',
            params: { "intMasterID": MasterID, "intColumnID": ColumnID, "intColumnID": ColumnID }
        }).then(function (response) {
            update_directexpenses_comments();
            updateprogressbar(100, "Completed...");

        }, function (error) {
            console.log(error);
        });
    }

    function load_directexpensedatatable() {

        var de_selectionActive = function (instance, x1, y1, x2, y2, origin) {

            document.getElementById('detotal').innerHTML = "0";
            if ((x1 >= 7 && x1 <= 18) && (x2 >= 7 && x2 <= 18)) {
                var value = 0;
                for (var i = y1; i <= y2; i++) {
                    for (var j = x1; j <= x2; j++) {
                        var objvalue = objdirectexpenses.getValueFromCoords(j, i);
                        var displaystatus = objdirectexpenses.rows[i].style.display;
                        if (displaystatus != 'none') {
                            if (objvalue != '') {
                                value = parseFloat(value) + parseFloat(objvalue);
                            }
                        }
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

            var height = parseInt(window.innerHeight) - 280;
            var subelms = document.getElementById("tbl_directexpenses").getElementsByTagName("*");
            var vartable = subelms[5].getAttribute("style");
            var newstyle = vartable + "; max-height: " + height + "px;"
            subelms[5].setAttribute("style", newstyle);

            updateprogressbar(100, "Completed...");

            document.getElementById('directexpenses').setAttribute("style", "padding-left:20px; padding-right:20px; padding-bottom:10px; opacity:1;")
        }

        var updateaftertable = function () {
            refreshtablesum();
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

        var moveDERow = function (instance, from, to) {

            var vfrom = [];
            var vto = [];

            if (from > to) {
                vfrom = instance.jexcel.getRowData(to);
                vto = instance.jexcel.getRowData(parseInt(to + 1));
            }
            else {
                vfrom = instance.jexcel.getRowData(to);
                vto = instance.jexcel.getRowData(parseInt(to - 1));
            }

            updateprogressbar(100, "Completed...");
            $http({
                method: 'POST',
                url: '../Resource/moverows',
                params: { "intFrom": vfrom[22], "intTo": vto[22], "intMasterID": vfrom[0], "strTabname": "directexpenses" }
            }).then(function (response) {

                $http({
                    method: 'GET',
                    url: '../Resource/getDirectExpensedata',
                    params: { "ProjectID": localStorage.getItem("projectid") }
                }).then(function (response) {
                    dsDirectExpense = response.data;
                    objdirectexpenses.setData(response.data);
                    validatefilters("directexpenses", objdirectexpenses);
                    updateprogressbar(100, "Completed...");

                }, function (error) {
                    console.log(error);
                });

            }, function (error) {
                console.log(error);
            });
        }

        function deleteupdateinfo_de(masterid) {
            if (directexpenses_updatedInfo.find(x => x.MasterID === masterid)) {
                index = directexpenses_updatedInfo.indexOf(directexpenses_updatedInfo.find(x => x.ProjectNumber === rowobj.ProjectNumber)); //getting index of that rec
                directexpenses_updatedInfo.splice(index, 1); //remove the existing rec from object 
            }
        }

        function updatedeletenotificationbar_de() {

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

        objdirectexpenses = jexcel(document.getElementById('tbl_directexpenses'), {

            data: dsDirectExpense,
            search: true,
            onselection: de_selectionActive,
            onafterchanges: updateaftertable,
            onload: load_de,
            onchange: de_update,
            allowManualInsertRow: false,
            tableOverflow: true,
            onmoverow: moveDERow,
            filters: true,
            footers: [['', '', '', '', 'Total', '=ROUND(SUM(G1:G300),2)', '=ROUND(SUM(H1:H300),2)', '=ROUND(SUM(I1:I300),2)', '=ROUND(SUM(J1:J300),2)', '=ROUND(SUM(K1:K300),2)', '=ROUND(SUM(L1:L300),2)', '=ROUND(SUM(M1:M300),2)', '=ROUND(SUM(N1:N300),2)', '=ROUND(SUM(O1:O300),2)', '=ROUND(SUM(P1:P300),2)', '=ROUND(SUM(Q1:Q300),2)', '=ROUND(SUM(R1:R300),2)', '']],
            tableWidth: mainwidth,
            columns: [
                { type: 'hidden', title: 'ID', width: 30 },
                { type: 'hidden', title: 'Type', width: 100 },
                { type: 'dropdown', title: 'WBSNumber', width: 150, source: rowOperatingExpenseWBS, autocomplete: true },
                { type: 'dropdown', title: 'Expense Category', width: de_mainwidth, source: rowDirectExpense, autocomplete: true },
                { type: 'text', title: 'Description', width: de_mainwidth },
                { type: 'customtextbox', title: 'PONumber', width: de_mainwidth },
                { type: 'text', title: 'FYear', width: 70, maxlength: 4 },
                { type: 'number', title: 'MAY', width: 70 },
                { type: 'number', title: 'JUN', width: 70 },
                { type: 'number', title: 'JULY', width: 70 },
                { type: 'number', title: 'AUG', width: 70 },
                { type: 'number', title: 'SEP', width: 70 },
                { type: 'number', title: 'OCT', width: 70 },
                { type: 'number', title: 'NOV', width: 70 },
                { type: 'number', title: 'DEC', width: 70 },
                { type: 'number', title: 'JAN', width: 70 },
                { type: 'number', title: 'FEB', width: 70 },
                { type: 'number', title: 'MAR', width: 70 },
                { type: 'number', title: 'APR', width: 70 },
                { type: 'text', readOnly: true, title: 'CreatedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'CreatedOn', width: 80 },
                { type: 'text', readOnly: true, title: 'ModifiedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'ModifiedOn', width: 80 },
                { type: 'hidden', readOnly: true, title: 'RowID', width: 80 },
                { type: 'hidden', title: 'SelectListStatus', width: 80 }
            ],
            contextMenu: function (obj, x, y, e) {
                var items = [];

                items.push({
                    title: "Duplicate",
                    onclick: function () {

                        var rowsElement = objdirectexpenses.getSelectedRows();
                        for (var indexRow = 0; indexRow < rowsElement.length; indexRow++) {
                            var displaystatus = rowsElement[indexRow].style.display;
                            if (displaystatus == "") {
                                var y = parseInt(rowsElement[indexRow].getAttribute("data-y"));
                                var jsonobj = objdirectexpenses.getJson(false);
                                var rowobj = jsonobj[y];
                                directexpenses_duplicateInfo.push(rowobj);
                            }
                        }
                        savedechanges(true);
                    }
                });
                items.push({ type: 'line' });
                if (obj.options.allowDeleteRow == true) {
                    items.push({
                        title: obj.options.text.deleteSelectedRows,
                        onclick: function () {

                            if (confirm('Are you sure do you want to delete?')) {

                                var rowsElement = obj.getSelectedRows();

                                for (var indexRow = 0; indexRow < rowsElement.length; indexRow++) {

                                    var displaystatus = rowsElement[indexRow].style.display;
                                    if (displaystatus == "") {

                                        var y = parseInt(rowsElement[indexRow].getAttribute("data-y"));
                                        var jsonobj = obj.getJson(false);
                                        var rowobj = jsonobj[y];
                                        directexpenses_deleteInfo.push(rowobj);
                                        updatedeletenotificationbar_de();
                                        deleteupdateinfo_de(rowobj.MasterID);
                                        obj.deleteRow(y);

                                    }

                                }
                            }
                            validatefilters("directexpenses", objdirectexpenses);
                        }
                    });
                }

                if (x) {
                    if (obj.options.allowComments == true) {
                        items.push({ type: 'line' });

                        var title = obj.records[y][x].getAttribute('title') || '';
                        var innervalue = obj.records[y][x].innerHTML;

                        items.push({
                            title: (obj.records[y][x].innerHTML != title && title != "") ? obj.options.text.editComments : obj.options.text.addComments,
                            onclick: function () {
                                if (title == innervalue) {
                                    title = "";
                                }
                                var comment = prompt(obj.options.text.comments, title);
                                if (comment) {
                                    insert_directexpenses_comments(obj.records[y][0].innerHTML, x, comment)
                                    obj.setComments([x, y], comment);
                                }
                            }
                        });

                        if (title != obj.records[y][x].innerHTML && title != "") {
                            items.push({
                                title: obj.options.text.clearComments,
                                onclick: function () {
                                    delete_directexpenses_comments(obj.records[y][0].innerHTML, x);
                                    obj.setComments([x, y], '');
                                    obj.records[y][x].title = obj.records[y][x].innerHTML;
                                }
                            });
                        }
                    }
                }

                return items;
            },
            updateTable: function (instance, cell, col, row, val, label, cellName) {

                if (col == 0) {
                    var filtered = directexpenses_comments.filter(a => a.MasterID == val);
                    if (filtered.length > 0) {
                        for (var k = 0; k < filtered.length; k++) {
                            instance.jexcel.setComments([parseInt(filtered[k].ColumnID), row], filtered[k].Comments);
                        }
                    }
                    else {
                        cell.setAttribute('title', cell.innerHTML);
                    }
                }
                else {
                    if (cell.getAttribute('title') == null) {
                        cell.setAttribute('title', cell.innerHTML);
                    }
                }

                if (col == 2 || col == 3 || col == 4 || col == 5) {
                    var row = instance.jexcel.getRowData(row);
                    if (row[23] == true) {
                        cell.setAttribute("class", "readonly");
                    }
                }

                // Number formating
                if (col == 6 || col == 7 || col == 8 || col == 9 || col == 10 || col == 11 || col == 12 || col == 13 || col == 14 || col == 15 || col == 16 || col == 17 || col == 18) {
                    cell.onkeypress = function isNumberKey(evt) {
                        var charCode = (evt.which) ? evt.which : evt.keyCode;
                        if (charCode != 46 && charCode != 45 && charCode > 31
                            && (charCode < 48 || charCode > 57))
                            return false;
                        return true;
                    };

                    //if (col != 5) {
                    //    cell.innerHTML = Number.parseFloat(val).toFixed(2);
                    //}

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

        var filtersourcecopy = JSON.parse(localStorage.getItem("directexpenses_filtersource"));
        if (filtersourcecopy != null) {

            document.getElementById("de_clearfilters").setAttribute("style", "display:block;");
            for (var i = 0; i < filtersourcecopy.fitems.length; i++) {
                var fild = filtersourcecopy.fitems[i].fid;
                var fname = filtersourcecopy.fitems[i].fname;
                var res = fname.split(";");
                res = res.map(s => s.trim());
                objdirectexpenses.filter.children[parseInt(fild) + 1].innerHTML = fname;
                objdirectexpenses.filters[fild] = res;
                objdirectexpenses.closeFilter();
            }
        }
        else {
            document.getElementById("de_clearfilters").setAttribute("style", "display:none;");
        }

        refreshtablesum();

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

    $scope.save_de_checkbookchanges = function () {

        updateprogressbar(45, "Saving changes....");
        var data = {
            update: directexpenses_cb_updatedInfo,
            delete: null,
            duplicate: null,
            userid: localStorage.getItem("userID")
        };

        $http({
            method: 'POST',
            url: '../Resource/submitdechanges',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            updateprogressbar(100, "Completed...");

            document.getElementById('notification_de_checkbook').style.display = 'none';
            document.getElementById('update_de_checkbook1').innerHTML = 0;
            directexpenses_cb_updatedInfo = [];
        }, function (error) {
            console.log(error);
        });
    }

    function savedechanges(status) {

        updateprogressbar(45, "Saving changes....");

        var data = {
            update: directexpenses_updatedInfo,
            delete: directexpenses_deleteInfo,
            duplicate: directexpenses_duplicateInfo,
            userid: localStorage.getItem("userID")
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
                    url: '../Resource/getDirectExpensedata',
                    params: { "ProjectID": localStorage.getItem("projectid") }
                }).then(function (response) {
                    dsDirectExpense = response.data;
                    objdirectexpenses.setData(response.data);
                    updateprogressbar(100, "Completed...");

                    directexpenses_duplicateInfo = [];
                    savechangesinfullscreenmode();
                }, function (error) {
                    console.log(error);
                });
            }
            else {
                updateprogressbar(100, "Completed...");

                document.getElementById('de_notification').style.display = 'none';
                document.getElementById('de_update_notificationnumber1').innerHTML = 0;
                document.getElementById('de_delete_notificationnumber1').innerHTML = 0;
                directexpenses_updatedInfo = [];
                directexpenses_deleteInfo = [];
                directexpenses_duplicateInfo = [];
                savechangesinfullscreenmode();
            }

            validatefilters("directexpenses", objdirectexpenses);

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
                        url: '../Resource/getCapitalExpenditureWBS',
                        params: { "ProjectID": localStorage.getItem("projectid") }
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
                var capital_labor_comments = document.getElementById('capitallabor_comments').value;

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
                            "userid": localStorage.getItem("userID"),
                            "ProjectID": localStorage.getItem("projectid"),
                            "strComments": capital_labor_comments
                        }
                    }).then(function (response) {

                        updateprogressbar(80, "Data is loading...");

                        $http({
                            method: 'GET',
                            url: '../Resource/getcapitallabourdata',
                            params: { "ProjectID": localStorage.getItem("projectid") }
                        }).then(function (response) {
                            if (response.data.length > 0) {

                                if (response.data.length === 1) {
                                    document.getElementById('tbl_capitallabour').innerHTML = "";
                                    dsCapitalLabour = response.data;
                                    load_capitallabourtabledata();
                                }
                                else {
                                    objcapitallabour.setData(response.data);
                                }


                                updateprogressbar(100, "Completed...");

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
            document.getElementById('capitallabor_comments').value = "";

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
            duplicate: capitallabor_duplicateInfo,
            userid: localStorage.getItem("userID")
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
                url: '../Resource/getcapitallabourdata',
                params: { "ProjectID": localStorage.getItem("projectid") }
            }).then(function (response) {
                dsCapitalLabour = response.data;
                objcapitallabour.setData(response.data);

                if (status === true) {
                    updateprogressbar(100, "Completed...");

                    capitallabor_duplicateInfo = [];
                    savechangesinfullscreenmode();
                }
                else {
                    updateprogressbar(100, "Completed...");

                    document.getElementById('capitallabor_notification').style.display = 'none';
                    document.getElementById('capitallabor_update_notificationnumber1').innerHTML = 0;
                    document.getElementById('capitallabor_delete_notificationnumber1').innerHTML = 0;
                    capitallabor_updatedInfo = [];
                    capitallabor_deleteInfo = [];
                    capitallabor_duplicateInfo = [];
                    savechangesinfullscreenmode();
                }

                validatefilters("capitallabor", objcapitallabour);

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
                        var displaystatus = objcapitallabour.rows[i].style.display;
                        if (displaystatus != 'none') {
                            if (objvalue != '') {
                                value = parseFloat(value) + parseFloat(objvalue);
                            }
                        }

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

            var height = parseInt(window.innerHeight) - 280;
            var subelms = document.getElementById("tbl_capitallabour").getElementsByTagName("*");
            var vartable = subelms[5].getAttribute("style");
            var newstyle = vartable + "; max-height: " + height + "px;"
            subelms[5].setAttribute("style", newstyle);

            updateprogressbar(100, "Completed....");

            document.getElementById('capitallabor').setAttribute("style", "padding-left:20px; padding-right:20px; padding-bottom:10px; opacity:1;")
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

        var updateaftertable = function () {
            refreshtablesum();
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

        var moveCapitallaborRow = function (instance, from, to) {

            var vfrom = [];
            var vto = [];

            if (from > to) {
                vfrom = instance.jexcel.getRowData(to);
                vto = instance.jexcel.getRowData(parseInt(to + 1));
            }
            else {
                vfrom = instance.jexcel.getRowData(to);
                vto = instance.jexcel.getRowData(parseInt(to - 1));
            }


            $http({
                method: 'POST',
                url: '../Resource/moverows',
                params: { "intFrom": vfrom[29], "intTo": vto[29], "intMasterID": vfrom[0], "strTabname": "capitallabor" }
            }).then(function (response) {
                refreshcapitallabordata();
            }, function (error) {
                console.log(error);
            });
        }

        function deleteupdateinfo_capitallabour(masterid) {
            if (capitallabor_updatedInfo.find(x => x.MasterID === masterid)) {
                index = capitallabor_updatedInfo.indexOf(capitallabor_updatedInfo.find(x => x.ProjectNumber === rowobj.ProjectNumber)); //getting index of that rec
                capitallabor_updatedInfo.splice(index, 1); //remove the existing rec from object 
            }
        }

        function updatedeletenotificationbar_capitallabour() {

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

        function insert_capitallabour_comments(MasterID, ColumnID, Comments) {
            updateprogressbar(50, "Updating comments...");
            $http({
                method: 'POST',
                url: '../Resource/insert_capitallaborcomments',
                params: { "intProjectID": localStorage.getItem("projectid"), "intMasterID": MasterID, "intColumnID": ColumnID, "strComments": Comments, "userid": localStorage.getItem("userID") }
            }).then(function (response) {
                update_capitallabor_comments();
                updateprogressbar(100, "Completed...");

            }, function (error) {
                console.log(error);
            });
        }

        function delete_capitallabour_comments(MasterID, ColumnID) {
            updateprogressbar(50, "Updating comments...");
            $http({
                method: 'POST',
                url: '../Resource/delete_capitallaborcomments',
                params: { "intMasterID": MasterID, "intColumnID": ColumnID, "intColumnID": ColumnID }
            }).then(function (response) {
                update_capitallabor_comments();
                updateprogressbar(100, "Completed...");

            }, function (error) {
                console.log(error);
            });
        }

        objcapitallabour = jexcel(document.getElementById('tbl_capitallabour'), {

            data: dsCapitalLabour,
            search: true,
            onselection: capitallabour_selectionActive,
            onafterchanges: updateaftertable,
            onload: load_capitallabor,
            onchange: capitallabor_update,
            onmoverow: moveCapitallaborRow,
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
                { type: 'text', title: 'Comments', width: 200 },
                { type: 'text', readOnly: true, title: 'CreatedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'CreatedOn', width: 80 },
                { type: 'text', readOnly: true, title: 'ModifiedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'ModifiedOn', width: 80 },
                { type: 'hidden', readOnly: true, title: 'RowID', width: 80 }
            ],
            contextMenu: function (obj, x, y, e) {
                var items = [];

                items.push({
                    title: "Duplicate",
                    onclick: function () {
                        var rowsElement = objcapitallabour.getSelectedRows(false);
                        for (var indexRow = 0; indexRow < rowsElement.length; indexRow++) {
                            var displaystatus = rowsElement[indexRow].style.display;
                            if (displaystatus == "") {
                                var y = parseInt(rowsElement[indexRow].getAttribute("data-y"));
                                var jsonobj = objcapitallabour.getJson(false);
                                var rowobj = jsonobj[y];
                                capitallabor_duplicateInfo.push(rowobj);
                            }
                        }
                        savecapitallabor(true);
                    }
                });
                items.push({ type: 'line' });
                if (obj.options.allowDeleteRow == true) {
                    items.push({
                        title: obj.options.text.deleteSelectedRows,
                        onclick: function () {

                            if (confirm('Are you sure do you want to delete?')) {

                                var rowsElement = obj.getSelectedRows();
                                //console.log(rowsElement);

                                for (var indexRow = 0; indexRow < rowsElement.length; indexRow++) {

                                    var displaystatus = rowsElement[indexRow].style.display;
                                    if (displaystatus == "") {

                                        var y = parseInt(rowsElement[indexRow].getAttribute("data-y"));
                                        var jsonobj = obj.getJson(false);
                                        var rowobj = jsonobj[y];
                                        capitallabor_deleteInfo.push(rowobj);
                                        updatedeletenotificationbar_capitallabour();
                                        deleteupdateinfo_capitallabour(rowobj.MasterID);
                                        obj.deleteRow(y);

                                    }

                                }
                            }
                            validatefilters("capitallabor", objcapitallabour);
                        }
                    });
                }

                if (x) {
                    if (obj.options.allowComments == true) {
                        items.push({ type: 'line' });

                        var title = obj.records[y][x].getAttribute('title') || '';
                        var innervalue = obj.records[y][x].innerHTML;

                        items.push({
                            title: (obj.records[y][x].innerHTML != title && title != "") ? obj.options.text.editComments : obj.options.text.addComments,
                            onclick: function () {
                                if (title == innervalue) {
                                    title = "";
                                }
                                var comment = prompt(obj.options.text.comments, title);
                                if (comment) {
                                    insert_capitallabour_comments(obj.records[y][0].innerHTML, x, comment)
                                    obj.setComments([x, y], comment);
                                }
                            }
                        });

                        if (title != obj.records[y][x].innerHTML && title != "") {
                            items.push({
                                title: obj.options.text.clearComments,
                                onclick: function () {
                                    delete_capitallabour_comments(obj.records[y][0].innerHTML, x);
                                    obj.setComments([x, y], '');
                                    obj.records[y][x].title = obj.records[y][x].innerHTML;
                                }
                            });
                        }
                    }
                }

                return items;
            },
            updateTable: function (instance, cell, col, row, val, label, cellName) {

                if (col == 0) {
                    var filtered = capitallabor_comments.filter(a => a.MasterID == val);
                    if (filtered.length > 0) {
                        for (var k = 0; k < filtered.length; k++) {
                            instance.jexcel.setComments([parseInt(filtered[k].ColumnID), row], filtered[k].Comments);
                        }
                    }
                    else {
                        cell.setAttribute('title', cell.innerHTML);
                    }
                }
                else {
                    if (cell.getAttribute('title') == null) {
                        cell.setAttribute('title', cell.innerHTML);
                    }
                }

                // Number formating
                if (col == 12 || col == 13 || col == 14 || col == 15 || col == 16 || col == 17 || col == 18 || col == 19 || col == 20 || col == 21 || col == 22 || col == 23 || col == 24) {
                    cell.onkeypress = function isNumberKey(evt) {
                        var charCode = (evt.which) ? evt.which : evt.keyCode;
                        if (charCode != 46 && charCode != 45 && charCode > 31
                            && (charCode < 48 || charCode > 57))
                            return false;
                        return true;
                    };

                    //if (col != 12) {
                    //    cell.innerHTML = Number.parseFloat(val).toFixed(2);
                    //}

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

        var filtersourcecopy = JSON.parse(localStorage.getItem("capitallabor_filtersource"));
        if (filtersourcecopy != null) {

            document.getElementById("capitallabor_clearfilters").setAttribute("style", "display:block;");
            for (var i = 0; i < filtersourcecopy.fitems.length; i++) {
                var fild = filtersourcecopy.fitems[i].fid;
                var fname = filtersourcecopy.fitems[i].fname;
                var res = fname.split(";");
                res = res.map(s => s.trim());
                objcapitallabour.filter.children[parseInt(fild) + 1].innerHTML = fname;
                objcapitallabour.filters[fild] = res;
                objcapitallabour.closeFilter();
            }
        }
        else {
            document.getElementById("capitallabor_clearfilters").setAttribute("style", "display:none;");
        }

        refreshtablesum();
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
                "strFinYear": fisyear, "ProjectID": localStorage.getItem("projectid")
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
            url: '../Resource/getsummary_getfisyear',
            params: { "ProjectID": localStorage.getItem("projectid") }
        }).then(function (response) {

            document.getElementById('drop_Summary_Finyear').innerHTML = "";
            document.getElementById('drop_Summary_Months').innerHTML = "";
            document.getElementById('drop_Summary_Quarter').innerHTML = "";

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
            url: '../Resource/getCapitalExpenditureWBS?ProjectID=' + localStorage.getItem("projectid"),
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
                            "userid": localStorage.getItem("userID"),
                            "ProjectID": localStorage.getItem("projectid")
                        }
                    }).then(function (response) {

                        updateprogressbar(80, "Data is loading...");

                        $http({
                            method: 'GET',
                            url: '../Resource/getcapitaldata',
                            params: { "ProjectID": localStorage.getItem("projectid") }
                        }).then(function (response) {
                            if (response.data.length > 0) {

                                if (response.data.length === 1) {
                                    document.getElementById('tbl_capital').innerHTML = "";
                                    dsCapital = response.data;
                                    load_capitaltabledata();
                                }
                                else {
                                    objcapital.setData(response.data);
                                }

                                updateprogressbar(100, "Completed...");
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

                        var displaystatus = objcapital.rows[i].style.display;
                        if (displaystatus != 'none') {
                            if (objvalue != '') {
                                value = parseFloat(value) + parseFloat(objvalue);
                            }
                        }
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

            var height = parseInt(window.innerHeight) - 280;
            var subelms = document.getElementById("tbl_capital").getElementsByTagName("*");
            var vartable = subelms[5].getAttribute("style");
            var newstyle = vartable + "; max-height: " + height + "px;"
            subelms[5].setAttribute("style", newstyle);

            updateprogressbar(100, "Completed....");

            document.getElementById('capital').setAttribute("style", "padding-left:20px; padding-bottom:10px; padding-right:20px; opacity:1;")

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

        var updateaftertable = function () {
            refreshtablesum();
        }

        var moveCapitalRow = function (instance, from, to) {

            var vfrom = [];
            var vto = [];

            if (from > to) {
                vfrom = instance.jexcel.getRowData(to);
                vto = instance.jexcel.getRowData(parseInt(to + 1));
            }
            else {
                vfrom = instance.jexcel.getRowData(to);
                vto = instance.jexcel.getRowData(parseInt(to - 1));
            }

            updateprogressbar(100, "Completed...");
            $http({
                method: 'POST',
                url: '../Resource/moverows',
                params: { "intFrom": vfrom[26], "intTo": vto[26], "intMasterID": vfrom[0], "strTabname": "capital" }
            }).then(function (response) {

                $http({
                    method: 'GET',
                    url: '../Resource/getcapitaldata',
                    params: { "ProjectID": localStorage.getItem("projectid") }
                }).then(function (response) {
                    dsCapital = response.data;
                    objcapital.setData(response.data);
                    validatefilters("capital", objcapital);
                    updateprogressbar(100, "Completed...");

                }, function (error) {
                    console.log(error);
                });

            }, function (error) {
                console.log(error);
            });
        }

        function updatedeletenotificationbar_capital() {

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

        function deleteupdateinfo_capital(masterid) {
            if (capital_updatedInfo.find(x => x.MasterID === masterid)) {
                index = capital_updatedInfo.indexOf(capital_updatedInfo.find(x => x.ProjectNumber === rowobj.ProjectNumber)); //getting index of that rec
                capital_updatedInfo.splice(index, 1); //remove the existing rec from object 
            }
        }

        function insert_capital_comments(MasterID, ColumnID, Comments) {
            updateprogressbar(50, "Updating comments...");
            $http({
                method: 'POST',
                url: '../Resource/insert_capitalcomments',
                params: { "intProjectID": localStorage.getItem("projectid"), "intMasterID": MasterID, "intColumnID": ColumnID, "strComments": Comments, "userid": localStorage.getItem("userID") }
            }).then(function (response) {
                update_capital_comments();
                updateprogressbar(100, "Completed...");

            }, function (error) {
                console.log(error);
            });
        }

        function delete_capital_comments(MasterID, ColumnID) {
            updateprogressbar(50, "Updating comments...");
            $http({
                method: 'POST',
                url: '../Resource/delete_capitalcomments',
                params: { "intMasterID": MasterID, "intColumnID": ColumnID, "intColumnID": ColumnID }
            }).then(function (response) {
                update_capital_comments();
                updateprogressbar(100, "Completed...");

            }, function (error) {
                console.log(error);
            });
        }

        objcapital = jexcel(document.getElementById('tbl_capital'), {

            data: dsCapital,
            search: true,
            onselection: capital_selectionActive,
            onafterchanges: updateaftertable,
            onload: load_capital,
            onchange: capital_update,
            allowManualInsertRow: false,
            footers: [['', '', '', '', '', '', '', 'Total', '=ROUND(SUM(K1:K300),2)', '=ROUND(SUM(L1:L300),2)', '=ROUND(SUM(M1:M300),2)', '=ROUND(SUM(N1:N300),2)', '=ROUND(SUM(O1:O300),2)', '=ROUND(SUM(P1:P300),2)', '=ROUND(SUM(Q1:Q300),2)', '=ROUND(SUM(R1:R300),2)', '=ROUND(SUM(S1:S300),2)', '=ROUND(SUM(T1:T300),2)', '=ROUND(SUM(U1:U300),2)', '=ROUND(SUM(V1:V300),2)']],
            tableOverflow: true,
            filters: true,
            onmoverow: moveCapitalRow,
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
                { type: 'number', title: 'MAY', width: 65 },
                { type: 'number', title: 'JUN', width: 65 },
                { type: 'number', title: 'JULY', width: 65 },
                { type: 'number', title: 'AUG', width: 65 },
                { type: 'number', title: 'SEP', width: 65 },
                { type: 'number', title: 'OCT', width: 65 },
                { type: 'number', title: 'NOV', width: 65 },
                { type: 'number', title: 'DEC', width: 65 },
                { type: 'number', title: 'JAN', width: 65 },
                { type: 'number', title: 'FEB', width: 65 },
                { type: 'number', title: 'MAR', width: 65 },
                { type: 'number', title: 'APR', width: 65 },
                { type: 'text', readOnly: true, title: 'CreatedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'CreatedOn', width: 80 },
                { type: 'text', readOnly: true, title: 'ModifiedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'ModifiedOn', width: 80 },
                { type: 'hidden', readOnly: true, title: 'RowID', width: 80 }
            ],
            contextMenu: function (obj, x, y, e) {
                var items = [];

                items.push({
                    title: "Duplicate",
                    onclick: function () {

                        var rowsElement = objcapital.getSelectedRows();
                        for (var indexRow = 0; indexRow < rowsElement.length; indexRow++) {
                            var displaystatus = rowsElement[indexRow].style.display;
                            if (displaystatus == "") {
                                var y = parseInt(rowsElement[indexRow].getAttribute("data-y"));
                                var jsonobj = objcapital.getJson(false);
                                var rowobj = jsonobj[y];
                                capital_duplicateInfo.push(rowobj);
                            }
                        }
                        savecapital(true);
                    }
                });

                items.push({ type: 'line' });
                if (obj.options.allowDeleteRow == true) {
                    items.push({
                        title: obj.options.text.deleteSelectedRows,
                        onclick: function () {


                            if (confirm('Are you sure do you want to delete?')) {

                                var rowsElement = obj.getSelectedRows();
                                //console.log(rowsElement);

                                for (var indexRow = 0; indexRow < rowsElement.length; indexRow++) {

                                    var displaystatus = rowsElement[indexRow].style.display;
                                    if (displaystatus == "") {

                                        var y = parseInt(rowsElement[indexRow].getAttribute("data-y"));
                                        var jsonobj = obj.getJson(false);
                                        var rowobj = jsonobj[y];
                                        capital_deleteInfo.push(rowobj);
                                        updatedeletenotificationbar_capital();
                                        deleteupdateinfo_capital(rowobj.MasterID);
                                        obj.deleteRow(y);

                                    }

                                }
                            }
                            validatefilters("capital", objcapital);

                        }
                    });
                }

                if (x) {
                    if (obj.options.allowComments == true) {
                        items.push({ type: 'line' });

                        var title = obj.records[y][x].getAttribute('title') || '';
                        var innervalue = obj.records[y][x].innerHTML;

                        items.push({
                            title: (obj.records[y][x].innerHTML != title && title != "") ? obj.options.text.editComments : obj.options.text.addComments,
                            onclick: function () {
                                if (title == innervalue) {
                                    title = "";
                                }
                                var comment = prompt(obj.options.text.comments, title);
                                if (comment) {
                                    insert_capital_comments(obj.records[y][0].innerHTML, x, comment)
                                    obj.setComments([x, y], comment);
                                }
                            }
                        });

                        if (title != obj.records[y][x].innerHTML && title != "") {
                            items.push({
                                title: obj.options.text.clearComments,
                                onclick: function () {
                                    delete_capital_comments(obj.records[y][0].innerHTML, x);
                                    obj.setComments([x, y], '');
                                    obj.records[y][x].title = obj.records[y][x].innerHTML;
                                }
                            });
                        }
                    }
                }

                return items;
            },
            updateTable: function (instance, cell, col, row, val, label, cellName) {

                if (col == 0) {
                    var filtered = capital_comments.filter(a => a.MasterID == val);
                    if (filtered.length > 0) {
                        for (var k = 0; k < filtered.length; k++) {
                            instance.jexcel.setComments([parseInt(filtered[k].ColumnID), row], filtered[k].Comments);
                        }
                    }
                    else {
                        cell.setAttribute('title', cell.innerHTML);
                    }
                }
                else {
                    if (cell.getAttribute('title') == null) {
                        cell.setAttribute('title', cell.innerHTML);
                    }
                }

                // Number formating               
                if (col == 9 || col == 10 || col == 11 || col == 12 || col == 13 || col == 14 || col == 15 || col == 16 || col == 17 || col == 18 || col == 19 || col == 20 || col == 21) {
                    cell.onkeypress = function isNumberKey(evt) {
                        var charCode = (evt.which) ? evt.which : evt.keyCode;
                        if (charCode != 46 && charCode != 45 && charCode > 31
                            && (charCode < 48 || charCode > 57))
                            return false;
                        return true;
                    };

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

        var filtersourcecopy = JSON.parse(localStorage.getItem("capital_filtersource"));
        if (filtersourcecopy != null) {

            document.getElementById("capital_clearfilters").setAttribute("style", "display:block;");
            for (var i = 0; i < filtersourcecopy.fitems.length; i++) {
                var fild = filtersourcecopy.fitems[i].fid;
                var fname = filtersourcecopy.fitems[i].fname;
                var res = fname.split(";");
                res = res.map(s => s.trim());
                objcapital.filter.children[parseInt(fild) + 1].innerHTML = fname;
                objcapital.filters[fild] = res;
                objcapital.closeFilter();
            }
        }
        else {
            document.getElementById("capital_clearfilters").setAttribute("style", "display:none;");
        }

        refreshtablesum();
    }

    function updateprogressbar(value, item) {
        document.getElementById('progressBarText').innerHTML = item;
        document.getElementById('progressbar').style.display = 'block'
        progressbarstyle = document.getElementsByClassName('progress-bar progress-bar-striped progress-bar-animated');
        pstyle = "width: " + value + "%";
        progressbarstyle[0].setAttribute("style", pstyle)
        if (value == 100) {
            document.getElementById('progressbar').style.display = 'none'
        }
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

    function insert_resource_comments(MasterID, ColumnID, Comments) {
        updateprogressbar(50, "Updating comments...");
        $http({
            method: 'POST',
            url: '../Resource/insert_resourcecomments',
            params: { "intProjectID": localStorage.getItem("projectid"), "intMasterID": MasterID, "intColumnID": ColumnID, "strComments": Comments, "userid": localStorage.getItem("userID") }
        }).then(function (response) {
            update_resource_comments();
            updateprogressbar(100, "Completed...");
        }, function (error) {
            console.log(error);
        });
    }

    function delete_resource_comments(MasterID, ColumnID) {
        updateprogressbar(50, "Updating comments...");
        $http({
            method: 'POST',
            url: '../Resource/delete_resourcecomments',
            params: { "intMasterID": MasterID, "intColumnID": ColumnID, "intColumnID": ColumnID }
        }).then(function (response) {
            update_resource_comments();
            updateprogressbar(100, "Completed...");
        }, function (error) {
            console.log(error);
        });
    }

    function loadresourcetable() {

        document.getElementById('tbl_resource').innerHTML = "";

        var load_resource = function (instance) {

            var datavalues = document.getElementById("tbl_resource").getElementsByTagName("thead");
            var subchilditem = datavalues[0].lastChild.getElementsByTagName("td");
            subchilditem[1].style = "display:none";
            subchilditem[2].style = "display:none";

            var height = parseInt(window.innerHeight) - 280;
            var subelms = document.getElementById("tbl_resource").getElementsByTagName("*");
            var vartable = subelms[5].getAttribute("style");
            var newstyle = vartable + "; max-height: " + height + "px;"
            subelms[5].setAttribute("style", newstyle);

            document.getElementById('resource').setAttribute("style", "padding-left:20px; padding-right:20px; padding-bottom:10px; opacity:1;")
            updateprogressbar(100, "Completed....");
        }

        //start delete & update even code
        var selectionActive = function (instance, x1, y1, x2, y2, origin) {

            document.getElementById('resourcetotal').innerHTML = "0";
            if ((x1 >= 10 && x1 <= 21) && (x2 >= 10 && x2 <= 21)) {
                var value = 0;
                for (var i = y1; i <= y2; i++) {
                    for (var j = x1; j <= x2; j++) {
                        var objvalue = obj.getValueFromCoords(j, i);
                        var displaystatus = obj.rows[i].style.display;
                        if (displaystatus != 'none') {
                            if (objvalue != '') {
                                value = parseFloat(value) + parseFloat(objvalue);
                            }
                        }
                    }
                }
                document.getElementById('resourcetotal').innerHTML = value.toFixed(2);
            }

            s_startvalue = y1;
            s_endvalue = y2;

            c_startvalue = x1;
            c_endvalue = x2;
        }

        var updateaftertable = function () {
            refreshtablesum();
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
            updatedeletenotificationbar();
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

        var moveResourceRow = function (instance, from, to) {

            var vfrom = [];
            var vto = [];

            if (from > to) {
                vfrom = instance.jexcel.getRowData(to);
                vto = instance.jexcel.getRowData(parseInt(to + 1));
            }
            else {
                vfrom = instance.jexcel.getRowData(to);
                vto = instance.jexcel.getRowData(parseInt(to - 1));
            }

            updateprogressbar(100, "Completed...");
            $http({
                method: 'POST',
                url: '../Resource/moverows',
                params: { "intFrom": vfrom[27], "intTo": vto[27], "intMasterID": vfrom[0], "strTabname": "resource" }
            }).then(function (response) {

                $http({
                    method: 'GET',
                    url: '../Resource/getresourcedata',
                    params: { "ProjectID": localStorage.getItem("projectid") }
                }).then(function (response) {
                    dsResource = response.data;
                    obj.setData(response.data);
                    validatefilters("resource", obj);
                    updateprogressbar(100, "Completed...");
                }, function (error) {
                    console.log(error);
                });

            }, function (error) {
                console.log(error);
            });
        }

        function deleteupdateinfo(masterid) {
            if (updatedInfo.find(x => x.MasterID === masterid)) {
                index = updatedInfo.indexOf(updatedInfo.find(x => x.ProjectNumber === rowobj.ProjectNumber)); //getting index of that rec
                updatedInfo.splice(index, 1); //remove the existing rec from object 
            }
        }

        function updatedeletenotificationbar() {

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

        //editor: new InputMaxLenght(4)
        obj = jexcel(document.getElementById('tbl_resource'), {
            data: dsResource,
            search: true,
            tableOverflow: true,
            filters: true,
            tableWidth: mainwidth,
            allowManualInsertRow: false,
            onselection: selectionActive,
            onmoverow: moveResourceRow,
            onchange: update,
            onload: load_resource,
            onafterchanges: updateaftertable,
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
                { type: 'number', title: 'MAY', width: 45 },
                { type: 'number', title: 'JUN', width: 45 },
                { type: 'number', title: 'JULY', width: 45 },
                { type: 'number', title: 'AUG', width: 45 },
                { type: 'number', title: 'SEP', width: 45 },
                { type: 'number', title: 'OCT', width: 45 },
                { type: 'number', title: 'NOV', width: 45 },
                { type: 'number', title: 'DEC', width: 45 },
                { type: 'number', title: 'JAN', width: 45 },
                { type: 'number', title: 'FEB', width: 45 },
                { type: 'number', title: 'MAR', width: 45 },
                { type: 'number', title: 'APR', width: 45 },
                { type: 'text', title: 'Comments', width: 150 },
                { type: 'text', readOnly: true, title: 'CreatedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'CreatedOn', width: 80 },
                { type: 'text', readOnly: true, title: 'ModifiedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'ModifiedOn', width: 80 },
                { type: 'hidden', readOnly: true, title: 'RowID', width: 80 }
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
                    items.push({
                        title: "Duplicate",
                        onclick: function () {

                            //for (i = s_startvalue; i <= s_endvalue; i++) {
                            //    var jsonobj = obj.getJson(false);
                            //    var rowobj = jsonobj[i];
                            //    duplicateInfo.push(rowobj);
                            //}

                            var rowsElement = obj.getSelectedRows();
                            for (var indexRow = 0; indexRow < rowsElement.length; indexRow++) {
                                var displaystatus = rowsElement[indexRow].style.display;
                                if (displaystatus == "") {
                                    var y = parseInt(rowsElement[indexRow].getAttribute("data-y"));
                                    var jsonobj = obj.getJson(false);
                                    var rowobj = jsonobj[y];
                                    duplicateInfo.push(rowobj);
                                }
                            }
                            save(true);
                        }
                    });
                    items.push({ type: 'line' });
                    if (obj.options.allowDeleteRow == true) {
                        items.push({
                            title: obj.options.text.deleteSelectedRows,
                            onclick: function () {
                                if (confirm('Are you sure do you want to delete?')) {

                                    var rowsElement = obj.getSelectedRows();
                                    for (var indexRow = 0; indexRow < rowsElement.length; indexRow++) {
                                        var displaystatus = rowsElement[indexRow].style.display;
                                        if (displaystatus == "") {
                                            var y = parseInt(rowsElement[indexRow].getAttribute("data-y"));
                                            var jsonobj = obj.getJson(false);
                                            var rowobj = jsonobj[y];
                                            deleteInfo.push(rowobj);
                                            updatedeletenotificationbar();
                                            deleteupdateinfo(rowobj.MasterID);
                                            obj.deleteRow(y);
                                        }
                                    }
                                }
                                validatefilters("resource", obj);
                            }
                        });
                    }

                    if (x) {
                        if (obj.options.allowComments == true) {
                            items.push({ type: 'line' });

                            var title = obj.records[y][x].getAttribute('title') || '';
                            var innervalue = obj.records[y][x].innerHTML;

                            items.push({
                                title: (obj.records[y][x].innerHTML != title && title != "") ? obj.options.text.editComments : obj.options.text.addComments,
                                onclick: function () {
                                    if (title == innervalue) {
                                        title = "";
                                    }
                                    var comment = prompt(obj.options.text.comments, title);
                                    if (comment) {
                                        insert_resource_comments(obj.records[y][0].innerHTML, x, comment)
                                        obj.setComments([x, y], comment);
                                    }
                                }
                            });

                            if (title != obj.records[y][x].innerHTML && title != "") {
                                items.push({
                                    title: obj.options.text.clearComments,
                                    onclick: function () {
                                        delete_resource_comments(obj.records[y][0].innerHTML, x);
                                        obj.setComments([x, y], '');
                                        obj.records[y][x].title = obj.records[y][x].innerHTML;
                                    }
                                });
                            }
                        }
                    }
                }
                return items;
            },
            updateTable: function (instance, cell, col, row, val, label, cellName) {

                if (col == 0) {
                    var filtered = resource_comments.filter(a => a.MasterID == val);
                    if (filtered.length > 0) {
                        for (var k = 0; k < filtered.length; k++) {
                            instance.jexcel.setComments([parseInt(filtered[k].ColumnID), row], filtered[k].Comments);
                        }
                    }
                    else {
                        cell.setAttribute('title', cell.innerHTML);
                    }
                }
                else {
                    if (cell.getAttribute('title') == null) {
                        cell.setAttribute('title', cell.innerHTML);
                    }
                }

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


        var filtersourcecopy = JSON.parse(localStorage.getItem("resource_filtersource"));
        if (filtersourcecopy != null) {

            document.getElementById("resource_clearfilters").setAttribute("style", "display:block;");
            for (var i = 0; i < filtersourcecopy.fitems.length; i++) {
                var fild = filtersourcecopy.fitems[i].fid;
                var fname = filtersourcecopy.fitems[i].fname;
                var res = fname.split(";");
                res = res.map(s => s.trim());
                obj.filter.children[parseInt(fild) + 1].innerHTML = fname;
                obj.filters[fild] = res;
                obj.closeFilter();
            }
        }
        else {
            document.getElementById("resource_clearfilters").setAttribute("style", "display:none;");
        }

        refreshtablesum();
    }

    function bindresourcedropdowns() {

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
        //console.log(obj.getConfig().comments);
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
                        "strbusiness": business,
                        "strbu": bu,
                        "strhighorg": highorg,
                        "strmidorg": midorg,
                        "strteam": team,
                        "strrequiredskills": requiredskills,
                        "strcomments": comments,
                        "userid": localStorage.getItem("userID"),
                        "ProjectID": localStorage.getItem("projectid")
                    }
                }).then(function (response) {

                    updateprogressbar(80, "Data is loading...");

                    $http({
                        method: 'GET',
                        url: '../Resource/getresourcedata',
                        params: { "ProjectID": localStorage.getItem("projectid") }
                    }).then(function (response) {
                        if (response.data.length > 0) {

                            if (response.data.length === 1) {
                                dsResource = response.data;
                                loadresourcetable();
                            }
                            else {
                                obj.setData(response.data);
                            }

                            updateprogressbar(100, "Completed...");

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

    $scope.save_resource_checkbookchanges = function () {
        save_resourcecheckbook();
    }

    function save_resourcecheckbook() {

        updateprogressbar(45, "Saving changes....");
        
        var data = {
            update: updatedInfo_resource_checkbook,
            delete: null,
            duplicate: null,
            userid: localStorage.getItem("userID")
        };

        $http({
            method: 'POST',
            url: '../Resource/submitchanges',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {

            var Fisyear = jSuite_dropResourceCheckboo_FisYear.getValue();
            
            update_resource_comments();
            loadresourcecheckbooksummary(Fisyear);
            loadresourcecheckbook(Fisyear);

            updatedInfo_resource_checkbook = [];            
            document.getElementById('notification_resource_checkbook').style.display = 'none';
            document.getElementById('update_resource_checkbook1').innerHTML = 0;

        }, function (error) {
            console.log(error);
        });

    }

    function save(status) {

        updateprogressbar(45, "Saving changes....");

        var data = {
            update: updatedInfo,
            delete: deleteInfo,
            duplicate: duplicateInfo,
            userid: localStorage.getItem("userID")
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
                url: '../Resource/getresourcedata',
                params: { "ProjectID": localStorage.getItem("projectid") }
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
                    updateprogressbar(100, "Completed...");
                    document.getElementById('notification').style.display = 'none';
                    document.getElementById('update_notificationnumber1').innerHTML = 0;
                    document.getElementById('delete_notificationnumber1').innerHTML = 0;
                }

                updateprogressbar(100, "Completed...");
                savechangesinfullscreenmode();

                validatefilters("resource", obj);

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
            duplicate: capital_duplicateInfo,
            userid: localStorage.getItem("userID")
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
                url: '../Resource/getcapitaldata',
                params: { "ProjectID": localStorage.getItem("projectid") }
            }).then(function (response) {
                dsCapital = response.data;
                objcapital.setData(response.data);

                if (status === true) {
                    updateprogressbar(100, "Completed...");
                    capital_duplicateInfo = [];
                    savechangesinfullscreenmode();
                }
                else {
                    updateprogressbar(100, "Completed...");
                    document.getElementById('capital_notification').style.display = 'none';
                    document.getElementById('capital_update_notificationnumber1').innerHTML = 0;
                    document.getElementById('capital_delete_notificationnumber1').innerHTML = 0;
                    capital_updatedInfo = [];
                    capital_deleteInfo = [];
                    capital_duplicateInfo = [];
                    savechangesinfullscreenmode();
                }

                validatefilters("capital", objcapital);

            }, function (error) {
                console.log(error);
            });

        }, function (error) {
            console.log(error);
        });

    }

    function validatefilters(key, object) {

        var filtersourcecopy = JSON.parse(localStorage.getItem(key + "_filtersource"));
        for (var i = 0; i < filtersourcecopy.fitems.length; i++) {
            var fild = filtersourcecopy.fitems[i].fid;
            var fname = filtersourcecopy.fitems[i].fname;
            var res = fname.split(";");
            res = res.map(s => s.trim());
            object.filter.children[parseInt(fild) + 1].innerHTML = fname;
            object.filters[fild] = res;
            object.closeFilter();
        }
    }

    function checkfilters(key) {
        var reloadfilterkey = localStorage.getItem(key + "_filterkey");
        if (reloadfilterkey == null) {
            return false;
        }
        else {
            return true;
        }
    }

    $scope.resetfilter = function () {

        var tablobj = [];
        var activetablevalue = document.getElementById('activetabid').innerHTML;
        if (activetablevalue === "resource") {
            tablobj = obj;
            document.getElementById("resource_clearfilters").setAttribute("style", "display:none;");
        }
        else if (activetablevalue === "capital") {
            tablobj = objcapital;
            document.getElementById("capital_clearfilters").setAttribute("style", "display:none;");
        }
        else if (activetablevalue === "capitallabor") {
            tablobj = objcapitallabour;
            document.getElementById("capitallabor_clearfilters").setAttribute("style", "display:none;");
        }
        else if (activetablevalue === "directexpenses") {
            tablobj = objdirectexpenses;
            document.getElementById("de_clearfilters").setAttribute("style", "display:none;");
        }

        tablobj.resetFilters();
        tablobj.resetSearch();

        var filters = tablobj.filters.map(function (arr) { if (arr == null || arr == "") { return null; } else { return arr.slice(); } });
        for (var i = 0; i < filters.length; i++) {
            if (filters[i] != null) {
                tablobj.filter.children[i + 1].innerHTML = "";
            }
        }

        localStorage.removeItem(activetablevalue + "_filtersource");
    }

    function refreshresourcedata() {

        getlastmodifieddata();
        var getresourcepreviousdatacount = [];
        updateprogressbar(50, "Data is loading...");
        $http({
            method: 'GET',
            url: '../Resource/getresourcedata',
            params: { "ProjectID": localStorage.getItem("projectid") }
        }).then(function (response) {

            getresourcepreviousdatacount = obj.getJson(false);

            if (getresourcepreviousdatacount.length == 0) {
                var element = document.getElementById('tbl_resource');
                element.innerHTML = "";

                dsResource = response.data;
                updateprogressbar(100, "Completed...");
                duplicateInfo = [];
                if (dsResource.length === 0) {
                    showalert('No records found!');
                }
                loadresourcetable();
            }
            else {
                dsResource = response.data;
                obj.setData(response.data);
                updateprogressbar(100, "Completed...");
                duplicateInfo = [];
                if (dsResource.length === 0) {
                    showalert('No records found!');
                }
                validatefilters("resource", obj);
                refreshtablesum();
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
            url: '../Resource/getcapitaldata',
            params: { "ProjectID": localStorage.getItem("projectid") }
        }).then(function (response) {

            if (getcapital_previousdatacount.length == 0) {

                var element = document.getElementById('tbl_capital');
                element.innerHTML = "";

                dsCapital = response.data;
                updateprogressbar(100, "Completed...");
                capital_duplicateInfo = [];
                if (dsCapital.length === 0) {
                    showalert('No records found!');
                }
                loadcapitaldata();
            }
            else {
                objcapital.setData(response.data);
                updateprogressbar(100, "Completed...");
                if (response.data.length === 0) {
                    showalert('No records found!');
                }
                validatefilters("capital", objcapital);
                refreshtablesum();
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
            url: '../Resource/getcapitallabourdata',
            params: { "ProjectID": localStorage.getItem("projectid") }
        }).then(function (response) {

            if (getcapitallabor_previousdatacount.length == 0) {

                var element = document.getElementById('tbl_capitallabour');
                element.innerHTML = "";

                dsCapitalLabour = response.data;
                updateprogressbar(100, "Completed...");
                capitallabor_duplicateInfo = [];
                if (dsCapitalLabour.length === 0) {
                    showalert('No records found!');
                }
                load_capitallabourtabledata();
            }
            else {

                dsCapitalLabour = response.data;
                objcapitallabour.setData(response.data);
                updateprogressbar(100, "Completed...");
                capitallabor_duplicateInfo = [];
                if (dsCapitalLabour.length === 0) {
                    showalert('No records found!');
                }
                validatefilters("capitallabor", objcapitallabour);
                refreshtablesum();
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
            url: '../Resource/getDirectExpensedata',
            params: { "ProjectID": localStorage.getItem("projectid") }
        }).then(function (response) {

            if (getde_previousdatacount.length == 0) {

                var element = document.getElementById('tbl_directexpenses');
                element.innerHTML = "";

                dsDirectExpense = response.data;
                updateprogressbar(100, "Completed...");
                directexpenses_duplicateInfo = [];
                if (dsDirectExpense.length === 0) {
                    showalert('No records found!');
                }
                load_directexpensedatatable();
            }
            else {

                dsDirectExpense = response.data;
                objdirectexpenses.setData(response.data);
                updateprogressbar(100, "Completed...");

                directexpenses_duplicateInfo = [];
                if (dsDirectExpense.length === 0) {
                    showalert('No records found!');
                }
                validatefilters("directexpenses", objdirectexpenses);
                refreshtablesum();
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

    function loadmastersettings() {

        var usertype = localStorage.getItem("isAdmin");
        document.getElementById("menudashboard").setAttribute("class", "nav-item");
        document.getElementById("menuresource").setAttribute("class", "nav-item");
        document.getElementById("menuassignments").setAttribute("class", "nav-item");
        document.getElementById("mastermenu").setAttribute("class", "nav-item dropdown");
        document.getElementById("menuresource").setAttribute("class", "nav-item active");

        if (usertype === "true") {
            document.getElementById("roles").innerHTML = "Admin";
            document.getElementById("mastermenu").setAttribute("style", "display:block;");
        }
        else {
            document.getElementById("roles").innerHTML = "User";
            document.getElementById("mastermenu").setAttribute("style", "display:none;");
        }

    }

    function dropdown_update_BU_PC() {
        $http({
            method: 'POST',
            url: '../Resource/getBU'
        }).then(function (response) {
            rowbu = response.data;
            dropdown_update_OperatingExpenseWBS_PC();
        }, function (error) {
            console.log(error);
        });
    }


    function dropdown_update_OperatingExpenseWBS_PC() {
        $http({
            method: 'GET',
            url: '../Resource/getOperatingExpenseWBS',
            params: { "ProjectID": localStorage.getItem("projectid") }
        }).then(function (response) {
            rowOperatingExpenseWBS = response.data;
            dropdown_update_Business_PC();
        }, function (error) {
            console.log(error);
        });
    }

    function dropdown_update_Business_PC() {
        $http({
            method: 'GET',
            url: '../Resource/getBusiness'
        }).then(function (response) {
            rowbusiness = response.data;
            dropdown_update_HighOrg_PC();
        }, function (error) {
            console.log(error);
        });
    }

    function dropdown_update_HighOrg_PC() {
        $http({
            method: 'POST',
            url: '../Resource/getHighOrg'
        }).then(function (response) {
            rowhighorg = response.data;
            dropdown_update_MidOrgData_PC();
        }, function (error) {
            console.log(error);
        });
    }

    function dropdown_update_MidOrgData_PC() {
        $http({
            method: 'POST',
            url: '../Resource/getMidOrgData'
        }).then(function (response) {
            rowMidOrg = response.data;
            dropdown_update_TeamData_PC();
        }, function (error) {
            console.log(error);
        });
    }
    function dropdown_update_TeamData_PC() {
        $http({
            method: 'POST',
            url: '../Resource/getTeamData'
        }).then(function (response) {
            rowTeam = response.data;
            getskillsdata_PC();
        }, function (error) {
            console.log(error);
        });
    }

    function getskillsdata_PC() {
        $http({
            method: 'GET',
            url: '../Resource/SkillData'
        }).then(function (response) {
            rowRequiredSkills = response.data;
            loadresourcetable_PC();
        }, function (error) {
            console.log(error);
        });
    }

    function loaddecheckbook() {

        document.getElementById('tbl_de_checkbook').innerHTML = "";

        var load_de = function (instance) {

            var datavalues = document.getElementById("tbl_de_checkbook").getElementsByTagName("thead");
            var subchilditem = datavalues[0].lastChild.getElementsByTagName("td");
            subchilditem[1].style = "display:none";
            subchilditem[2].style = "display:none";

            var height = parseInt(window.innerHeight) - 280;
            var subelms = document.getElementById("tbl_de_checkbook").getElementsByTagName("*");
            var vartable = subelms[5].getAttribute("style");
            var newstyle = vartable + "; max-height: " + height + "px;"
            subelms[5].setAttribute("style", newstyle);

            updateprogressbar(100, "Completed....");

            document.getElementById('decheckbookpanel').style.display = 'block';
        }
        var de_update = function (instance, cell, col, row, value) {

            //creates json object of jexcel
            var jsonobj = objdirectexpenses_checkbook.getJson(false);
            //getting particular row from json object       
            var rowobj = jsonobj[row]; //row id getting from event

            //check for existance of respective rec in global object
            if (directexpenses_cb_updatedInfo.find(x => x.MasterID === rowobj.MasterID)) {
                index = directexpenses_cb_updatedInfo.indexOf(directexpenses_cb_updatedInfo.find(x => x.MasterID === rowobj.MasterID)); //getting index of that rec
                directexpenses_cb_updatedInfo.splice(index, 1); //remove the existing rec from object 
                directexpenses_cb_updatedInfo.push(rowobj); //pushing newly updated rec
            }
            else
                directexpenses_cb_updatedInfo.push(rowobj); //pushing updated rec for the first time

            document.getElementById('update_de_checkbook1').innerHTML = directexpenses_cb_updatedInfo.length;
            if (parseInt(directexpenses_cb_updatedInfo.length) > 0) {
                document.getElementById('notification_de_checkbook').style.display = 'block';
                document.getElementById('update_de_checkbook1').style.display = 'initial';
                document.getElementById('update_de_checkbook2').style.display = 'initial';
            }
            else {
                document.getElementById('notification_de_checkbook').style.display = 'none';
                document.getElementById('update_de_checkbook1').style.display = 'none';
                document.getElementById('update_de_checkbook2').style.display = 'none';
            }
        }

        objdirectexpenses_checkbook = jexcel(document.getElementById('tbl_de_checkbook'), {
            data: dsde_checkbook,
            search: false,
            tableOverflow: true,
            filters: false,
            tableWidth: mainwidth_PC,
            allowManualInsertRow: false,
            onchange: de_update,
            contextMenu: false,
            onload: load_de,
            columns: [
                { type: 'hidden', title: 'ID', width: 30 },
                { type: 'hidden', title: 'Type', width: 100 },
                { type: 'dropdown', readOnly: de_cb_readonly_status, title: 'WBSNumber', width: 150, source: rowOperatingExpenseWBS, autocomplete: true },
                { type: 'dropdown', readOnly: de_cb_readonly_status, title: 'Expense Category', width: de_mainwidth, source: rowDirectExpense, autocomplete: true },
                { type: 'text', readOnly: de_cb_readonly_status, title: 'Description', width: de_mainwidth },
                { type: 'text', title: 'FYear', width: 70, maxlength: 4 },
                { type: 'number', title: 'MAY', width: 70 },
                { type: 'number', title: 'JUN', width: 70 },
                { type: 'number', title: 'JULY', width: 70 },
                { type: 'number', title: 'AUG', width: 70 },
                { type: 'number', title: 'SEP', width: 70 },
                { type: 'number', title: 'OCT', width: 70 },
                { type: 'number', title: 'NOV', width: 70 },
                { type: 'number', title: 'DEC', width: 70 },
                { type: 'number', title: 'JAN', width: 70 },
                { type: 'number', title: 'FEB', width: 70 },
                { type: 'number', title: 'MAR', width: 70 },
                { type: 'number', title: 'APR', width: 70 },
                { type: 'text', readOnly: true, title: 'CreatedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'CreatedOn', width: 80 },
                { type: 'text', readOnly: true, title: 'ModifiedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'ModifiedOn', width: 80 },
                { type: 'hidden', readOnly: true, title: 'RowID', width: 80 }
            ],
            contextMenu: function (obj, x, y, e) {
                var items = [];
                if (x) {
                    if (obj.options.allowComments == true) {
                        items.push({ type: 'line' });

                        var title = obj.records[y][x].getAttribute('title') || '';
                        var innervalue = obj.records[y][x].innerHTML;

                        items.push({
                            title: (obj.records[y][x].innerHTML != title && title != "") ? obj.options.text.editComments : obj.options.text.addComments,
                            onclick: function () {
                                if (title == innervalue) {
                                    title = "";
                                }
                                var comment = prompt(obj.options.text.comments, title);
                                if (comment) {
                                    insert_directexpenses_comments(obj.records[y][0].innerHTML, x, comment)
                                    obj.setComments([x, y], comment);
                                }
                            }
                        });

                        if (title != obj.records[y][x].innerHTML && title != "") {
                            items.push({
                                title: obj.options.text.clearComments,
                                onclick: function () {
                                    delete_directexpenses_comments(obj.records[y][0].innerHTML, x);
                                    obj.setComments([x, y], '');
                                    obj.records[y][x].title = obj.records[y][x].innerHTML;
                                }
                            });
                        }
                    }
                }
                return items;
            },
            updateTable: function (instance, cell, col, row, val, label, cellName) {

                if (col == 0) {
                    var filtered = directexpenses_comments.filter(a => a.MasterID == val);
                    if (filtered.length > 0) {
                        for (var k = 0; k < filtered.length; k++) {
                            instance.jexcel.setComments([parseInt(filtered[k].ColumnID), row], filtered[k].Comments);
                        }
                    }
                    else {
                        cell.setAttribute('title', cell.innerHTML);
                    }
                }
                else {
                    if (cell.getAttribute('title') == null) {
                        cell.setAttribute('title', cell.innerHTML);
                    }
                }

                // Number formating
                if (col == 5 || col == 6 || col == 7 || col == 8 || col == 9 || col == 10 || col == 11 || col == 12 || col == 13 || col == 14 || col == 15 || col == 16 || col == 17) {
                    cell.onkeypress = function isNumberKey(evt) {
                        var charCode = (evt.which) ? evt.which : evt.keyCode;
                        if (charCode != 46 && charCode != 45 && charCode > 31
                            && (charCode < 48 || charCode > 57))
                            return false;
                        return true;
                    };

                    //if (col != 5) {
                    //    cell.innerHTML = Number.parseFloat(val).toFixed(2);
                    //}

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

        objdirectexpenses_checkbook.hideIndex();
    }

    function loadresourcetable_PC() {

        document.getElementById('tbl_resource_checkbook').innerHTML = "";

        var load_resource = function (instance) {
            var datavalues = document.getElementById("tbl_resource_checkbook").getElementsByTagName("thead");
            var subchilditem = datavalues[0].lastChild.getElementsByTagName("td");
            subchilditem[1].style = "display:none";
            subchilditem[2].style = "display:none";

            var height = parseInt(window.innerHeight) - 280;
            var subelms = document.getElementById("tbl_resource_checkbook").getElementsByTagName("*");
            var vartable = subelms[5].getAttribute("style");
            var newstyle = vartable + "; max-height: " + height + "px;"
            subelms[5].setAttribute("style", newstyle);

            document.getElementById('resource').setAttribute("style", "padding-left:20px; padding-right:20px; padding-bottom:10px; opacity:1;")
            updateprogressbar(100, "Completed....");

            document.getElementById('resourcecheckbookpanel').style.display = 'block';
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
            var jsonobj = obj_PC.getJson(false);

            //getting particular row from json object       
            var rowobj = jsonobj[row]; //row id getting from event

            //check for existance of respective rec in global object
            if (updatedInfo_resource_checkbook.find(x => x.MasterID === rowobj.MasterID)) {
                index = updatedInfo_resource_checkbook.indexOf(updatedInfo_resource_checkbook.find(x => x.MasterID === rowobj.MasterID)); //getting index of that rec
                updatedInfo_resource_checkbook.splice(index, 1); //remove the existing rec from object 
                updatedInfo_resource_checkbook.push(rowobj); //pushing newly updated rec
            }
            else
                updatedInfo_resource_checkbook.push(rowobj); //pushing updated rec for the first time

            document.getElementById('update_resource_checkbook1').innerHTML = updatedInfo_resource_checkbook.length;

            if (parseInt(updatedInfo_resource_checkbook.length) > 0) {
                document.getElementById('notification_resource_checkbook').style.display = 'block';
                document.getElementById('update_resource_checkbook1').style.display = 'initial';
                document.getElementById('update_resource_checkbook2').style.display = 'initial';
            }
            else {
                document.getElementById('notification_resource_checkbook').style.display = 'none';
                document.getElementById('update_resource_checkbook1').style.display = 'none';
                document.getElementById('update_resource_checkbook2').style.display = 'none';
            }
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
        obj_PC = jexcel(document.getElementById('tbl_resource_checkbook'), {
            data: dsResource_PC,
            search: false,
            tableOverflow: true,
            filters: false,
            tableWidth: mainwidth_PC,
            allowManualInsertRow: false,
            onchange: update,
            contextMenu: false,
            onload: load_resource,
            columns: [
                { type: 'hidden', title: 'ID', width: 30 },
                { type: 'hidden', title: 'Type', width: 100 },
                { type: 'dropdown', title: 'WBSNumber', width: 120, source: rowOperatingExpenseWBS, autocomplete: true },
                { type: 'dropdown', title: 'Business', width: 60, source: rowbusiness, autocomplete: true },
                { type: 'dropdown', title: 'BU', width: 60, source: rowbu, autocomplete: true, filter: ddbusinessunitFilter },
                { type: 'dropdown', title: 'High Org', width: resource_mainwidth - 20, source: rowhighorg, autocomplete: true, filter: ddHighOrgFilter },
                { type: 'dropdown', title: 'Mid Org', width: resource_mainwidth - 20, source: rowMidOrg, autocomplete: true, filter: ddMidOrgFilter },
                { type: 'dropdown', title: 'Team', width: resource_mainwidth - 20, source: rowTeam, autocomplete: true, filter: ddTeamFilter },
                { type: 'dropdown', title: 'Required Skill', width: resource_mainwidth, source: rowRequiredSkills, autocomplete: true, filter: ddRequiredSkillsFilter },
                { type: 'number', title: 'FYear', width: 50, maxlength: 4 },
                { type: 'number', title: 'MAY', width: 45 },
                { type: 'number', title: 'JUN', width: 45 },
                { type: 'number', title: 'JULY', width: 45 },
                { type: 'number', title: 'AUG', width: 45 },
                { type: 'number', title: 'SEP', width: 45 },
                { type: 'number', title: 'OCT', width: 45 },
                { type: 'number', title: 'NOV', width: 45 },
                { type: 'number', title: 'DEC', width: 45 },
                { type: 'number', title: 'JAN', width: 45 },
                { type: 'number', title: 'FEB', width: 45 },
                { type: 'number', title: 'MAR', width: 45 },
                { type: 'number', title: 'APR', width: 45 },
                { type: 'text', title: 'Comments', width: 150 },
                { type: 'text', readOnly: true, title: 'CreatedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'CreatedOn', width: 80 },
                { type: 'text', readOnly: true, title: 'ModifiedBy', width: 80 },
                { type: 'date', readOnly: true, title: 'ModifiedOn', width: 80 },
                { type: 'hidden', readOnly: true, title: 'RowID', width: 80 }
            ],
            contextMenu: function (obj, x, y, e) {

                var items = [];

                if (x) {
                    if (obj.options.allowComments == true) {
                        items.push({ type: 'line' });

                        var title = obj.records[y][x].getAttribute('title') || '';
                        var innervalue = obj.records[y][x].innerHTML;

                        items.push({
                            title: (obj.records[y][x].innerHTML != title && title != "") ? obj.options.text.editComments : obj.options.text.addComments,
                            onclick: function () {
                                if (title == innervalue) {
                                    title = "";
                                }
                                var comment = prompt(obj.options.text.comments, title);
                                if (comment) {
                                    insert_resource_comments(obj.records[y][0].innerHTML, x, comment)
                                    obj.setComments([x, y], comment);
                                }
                            }
                        });

                        if (title != obj.records[y][x].innerHTML && title != "") {
                            items.push({
                                title: obj.options.text.clearComments,
                                onclick: function () {
                                    delete_resource_comments(obj.records[y][0].innerHTML, x);
                                    obj.setComments([x, y], '');
                                    obj.records[y][x].title = obj.records[y][x].innerHTML;
                                }
                            });
                        }
                    }
                }

                return items;
            },
            updateTable: function (instance, cell, col, row, val, label, cellName) {

                if (col == 0) {
                    var filtered = resource_comments.filter(a => a.MasterID == val);
                    if (filtered.length > 0) {
                        for (var k = 0; k < filtered.length; k++) {
                            instance.jexcel.setComments([parseInt(filtered[k].ColumnID), row], filtered[k].Comments);
                        }
                    }
                    else {
                        cell.setAttribute('title', cell.innerHTML);
                    }
                }
                else {
                    if (cell.getAttribute('title') == null) {
                        cell.setAttribute('title', cell.innerHTML);
                    }
                }

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

        obj_PC.hideIndex();
    }

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
            params: { "ProjectID": localStorage.getItem("projectid"), "userid": localStorage.getItem("userID") },
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
app.filter('boolean', function () {
    return function (input) {
        if (input == 'true') {
            return true;
        }
        else {
            return false;
        }
    }
});

app.filter('dotsFilter', [
    '$filter',
    function ($filter) {
        /**
         * Shorten the input and add dots if it's needed
         * @param {string} input 
         * @param {number} limit
         */
        function dotsFilter(input, limit) {

            if (input == null) {
                return '';
            }
            else {
                var newContent = $filter('limitTo')(input, limit);
                if (newContent.length < input.length) { newContent += '...'; }
                return newContent;
            }

        }
        return dotsFilter;
    }
]);
app.directive('expand', function () {
    function link(scope, element, attrs) {
        scope.$on('onExpandAll', function (event, args) {
            scope.expanded = args.expanded;
        });
    }
    return {
        link: link
    };
});

