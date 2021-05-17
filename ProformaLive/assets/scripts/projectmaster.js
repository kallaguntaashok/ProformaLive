var app = angular.module('MECC', []);
app.controller('ProjectController', function ($scope, $http) {

    localStorage.setItem("CurrentPage", 3);
    var projectmasterdata = [];
    var progressbarstyle = [];
    var updatedInfo = [];
    var deleteInfo = [];
    var projectmaster_cloneproforma = [];
    var s_startvalue = 0;
    var s_endvalue = 0;
    var pstyle = "";
    var mainwidth = window.innerWidth;
    var formSubmitting = null;
    mainwidth = (mainwidth - 32) + "px";
    var mainheight = window.innerHeight;
    mainheight = (mainheight - 160) + "px";
    updateprogressbar(20, "Page is loading...");
    getusername();
    Projects();
    loadmastersettings();

    document.getElementById("masterHelpCenter").addEventListener("click", loadhelpdesk);
    function loadhelpdesk() {
        document.getElementById('helpcenter').style.display = 'block';
        dragElement(document.getElementById("helpcenter"));
        $scope.getcompletelist();
    }

    $scope.closepopup = function (value) {
        document.getElementById(value).style.display = 'none'; 
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

    $scope.getcompletelist = function () {
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

    let abc;
    abc = Number(5.5567);
    console.log(typeof abc);
    console.log(abc.toFixed(2));

    $scope.btncreatenewproject = function () {
        document.getElementById('CreateNewProject').style.display = 'block';
        localStorage.setItem("CReferencePID", 262);
        document.getElementById("newCreateProject").value = "";
        document.getElementById("newCreateProjectName").value = "";
    }

    $scope.export_projectdata = function () {

        var currentdate = new Date();
        currentdate = currentdate.getDate() + "-" + currentdate.getMonth() + "-" + currentdate.getFullYear() + "_" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        var sheetname = {
            sheetid: 'ProjectMaster'
        };

        var ExcelName = "Project List-" + currentdate + ".xlsx";
        alasql('SELECT [ProjectID], [ProjectName]  , [ProjectNumber] , [PMNetworkID] , [PMName] , [ProjectCategory] , [ParentChild] , [WBSElement],[CapitalExpenditureWBS], [GPSProjectNumber] , [Program] , [BusinessUnit] , [PeriodBurdenExpense] , [SettlementCostCenter], [SettlementCostCenterName] , [SettlemnetSummary] , [EndingBusinessUnit], [FundingSource] , [SourceCard], [InPLAN] , [Function], [CapitalGRPType], [Funded] , [PercentFunded] , [PCTPropabiltyFunded] INTO XLSX(?,?) FROM ?', [ExcelName, sheetname, projectmasterdata]);

    }

    function loadmastersettings() {

        var usertype = localStorage.getItem("isAdmin");
        document.getElementById("menudashboard").setAttribute("class", "nav-item");
        document.getElementById("menuresource").setAttribute("class", "nav-item");
        document.getElementById("mastermenu").setAttribute("class", "nav-item dropdown");
        document.getElementById("mastermenu").setAttribute("class", "nav-item dropdown active");

        if (usertype === "true") {
            document.getElementById("roles").innerHTML = "Admin";
            document.getElementById("mastermenu").setAttribute("style", "display:block;");
        }
        else {
            document.getElementById("roles").innerHTML = "User";
            document.getElementById("mastermenu").setAttribute("style", "display:none;");
        }

    }

    var setFormSubmitting = function () { formSubmitting = false; };

    window.onload = function () {
        window.addEventListener("beforeunload", function (e) {
            if (formSubmitting) {
                return undefined;
            }

            var confirmationMessage = 'It looks like you have been editing something. '
                + 'If you leave before saving, your changes will be lost.';

            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
        });
    };

    function removemasterhandler() {
        document.getElementById('masterhandler').style.display = 'none'
    }

    $scope.savechanges = function () {

        updateprogressbar(45, "Saving changes....");

        var data = {
            update: updatedInfo,
            delete: deleteInfo
        };

        $http({
            method: 'POST',
            url: '../Projects/submitchanges',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {

            if (response.data.responseCode === 200) {
                updateprogressbar(100, "Saving changes....");
                document.getElementById('progressbar').style.display = 'none';
                document.getElementById('notification').style.display = 'none';
                document.getElementById('update_notificationnumber1').innerHTML = 0;
                document.getElementById('delete_notificationnumber1').innerHTML = 0;
                updatedInfo = [];
                deleteInfo = [];
                formSubmitting = true;

                var screenst = $scope.ProjectsTable_fullscreen;

                if (screenst) {
                    var width = parseInt(window.innerWidth);
                    var height = parseInt(window.innerHeight);
                    document.getElementById('spreadsheetprojectmaster').setAttribute('style', 'position: fixed; top: 0px; left: 0px; width:100%; height:100%; background-color: white;');
                    var elms = document.getElementById('spreadsheetprojectmaster').getElementsByTagName("*");
                    height = height - 40;
                    elms[5].setAttribute('style', 'overflow: auto; top: 33px; transition: all 1s ease; height:' + height + 'px; width: ' + width + 'px;')
                }
            }
            else {
                document.getElementById('progressbar').style.display = 'none';
                showalertsavechangesalert(response.data.Message)
            }

        }, function (error) {
            console.log(error);
        });

    }

    function getusername() {

        var updatedUsername = localStorage.getItem("userName")
        if (updatedUsername === null || updatedUsername === undefined) {

            $http({
                method: 'GET',
                url: '../index/CreateUserProfile'
            }).then(function (response) {
                if (response.data.responseCode === 200) {
                    var user = response.data.Message;
                    localStorage.setItem("userID", user.userID);
                    localStorage.setItem("userName", user.userName);
                    localStorage.setItem("isAdmin", user.isAdmin);

                    document.getElementById('loginusername').innerHTML = "Welcome, " + user.userName;
                    document.getElementById('userprofilepanel1').style.display = 'block';
                    document.getElementById('userprofilepanel2').style.display = 'block';
                }
            }, function (error) {
                updateprogressbar(100, "unAuthorized request...");
                if (error.status === 403) {
                    window.location.href = '../unAuthorized/Index';
                }
                else {
                    console.error(error);
                }
            });
        }
        else {

            document.getElementById('loginusername').innerHTML = "Welcome, " + updatedUsername;
            document.getElementById('userprofilepanel1').style.display = 'block';
            document.getElementById('userprofilepanel2').style.display = 'block';
        }

    }

    function Projects() {

        formSubmitting = true;
        $http({
            method: 'GET',
            url: '../Projects/getProjects'
        }).then(function (response) {
            if (response.data.responseCode === 200) {
                projectmasterdata = response.data.Message;
                loadProjectTable(true, "Page is loading...");
            }
        }, function (error) {
            updateprogressbar(100, "unAuthorized request...");
            if (error.status === 403) {
                window.location.href = '../unAuthorized/Index';
            }
            else {
                console.error(error);
            }
        });
    }



    function updateprogressbar(value, item) {
        document.getElementById('progressBarText').innerHTML = item;
        document.getElementById('progressbar').style.display = 'block'
        progressbarstyle = document.getElementsByClassName('progress-bar progress-bar-striped progress-bar-animated');
        pstyle = "width: " + value + "%";
        progressbarstyle[0].setAttribute("style", pstyle)
    }

    function updatemasteritem() {
                
        var mastertext = document.getElementById('masterhandlerText').innerHTML;
        var mastervalue = document.getElementById('masteritem').value;
        var type = "";

        var methodname = "";
        var id = 0;

        if (mastertext === "Add New Project Category") {
            type = "projectcategory";
            methodname = "getProjectCategory";
            id = 5;
        } else if (mastertext === "Add New Status") {
            type = "status";
            methodname = "getParentChild";
            id = 6;
        } else if (mastertext === "Add New Funded") {
            type = "funded";
            methodname = "getFunded";
            id = 18;
        } else if (mastertext === "Add New Capital  GRP Type") {
            type = "capitalgrptype";
            methodname = "getCapitalGRPType";
            id = 20;
        } else if (mastertext === "Add New In Plan") {
            type = "inplan";
            methodname = "getInPLAN";
            id = 22;
        }

        if (mastervalue != "") {

            $http({
                method: 'POST',
                url: '../Projects/updatemasterdata',
                params: { "strtype": type, "strvalue": mastervalue }
            }).then(function (response) {

                document.getElementById('spreadsheetprojectmaster').innerHTML = "";
                Projects();

                document.getElementById('success').style.display = 'block';
                document.getElementById('error').style.display = 'none';
                document.getElementById('masterhandler').style.display = 'none';

            }, function (error) {
                console.log(error);
            });

        }
        else {
            document.getElementById('error').style.display = 'block';
            document.getElementById('errortext').innerText = "Please " + mastertext;
        }

    }

    function loadProjectTable(status, progressbartext) {

        updateprogressbar(80, progressbartext);

        var loaded = function (instance) {

            updateprogressbar(100, progressbartext);
            var datavalues = document.getElementById("spreadsheetprojectmaster").getElementsByTagName("thead");
            var subchilditem = datavalues[0].lastChild.getElementsByTagName("td");
            subchilditem[3].style = "display:none";            
            document.getElementById('progressbar').style.display = 'none';
            document.getElementById('mainbody').style.display = 'block';

            var newdatavalues = document.getElementById("spreadsheetprojectmaster").getElementsByTagName("thead");
            var newsubchilditem = datavalues[0].firstChild.getElementsByTagName("td");

            newsubchilditem[6].innerHTML = "";
            //newsubchilditem[7].innerHTML = "";
            newsubchilditem[20].innerHTML = "";
            newsubchilditem[22].innerHTML = "";
            newsubchilditem[23].innerHTML = "";

            newsubchilditem[6].innerHTML = "Project Category <button id='addnewprojectcategory' title='Add New Project Category' style='z-index: 99999;' class='btn btn-warning btn-sm pull-right additem'><i class='fa fa-plus-circle' aria-hidden='true'></i></button>";
            //newsubchilditem[7].innerHTML = "Satus <button id='addnewparentchild' title='Add New Dropdown Item In Parent-Child' style='z-index: 99999;' class='btn btn-warning btn-sm pull-right additem'><i class='fa fa-plus-circle' aria-hidden='true'></i></button>";
            newsubchilditem[20].innerHTML = "In Plan <button id='addnewInPlan' title='Add New InPlan Category' style='z-index: 99999;' class='btn btn-warning btn-sm pull-right additem'><i class='fa fa-plus-circle' aria-hidden='true'></i></button>";
            newsubchilditem[22].innerHTML = "Capital GRP Type <button id='addnewCapitalGRPType' title='Add New Capital GRP Type' style='z-index: 99999;' class='btn btn-warning btn-sm pull-right additem'><i class='fa fa-plus-circle' aria-hidden='true'></i></button>";
            newsubchilditem[23].innerHTML = "Funded <button id='addnewFunded' style='z-index: 99999;' title='Add New Funded Type' class='btn btn-warning pull-right btn-sm additem'><i class='fa fa-plus-circle' aria-hidden='true'></i></button>";

            document.getElementById('addnewprojectcategory').onclick = newprojectcategory;
            //document.getElementById('addnewparentchild').onclick = newparentchild;
            document.getElementById('removehandler').onclick = removemasterhandler;
            document.getElementById('updatemaster').onclick = updatemasteritem;
            document.getElementById('addnewInPlan').onclick = newInPlan;
            document.getElementById('addnewCapitalGRPType').onclick = newCapitalGRPType;
            document.getElementById('addnewFunded').onclick = newFunded;
        }

        var selectionActive = function (instance, x1, y1, x2, y2, origin) {
            s_startvalue = y1;
            s_endvalue = y2;
        }

        function newInPlan() {
            document.getElementById('masterhandlerText').innerHTML = "Add New In Plan";
            document.getElementById('masterhandler').style.display = 'block'
            document.getElementById('masteritem').placeholder = "Enter new in plan";
            document.getElementById('masteritem').value = "";
            clearmessage();
        }

        function clearmessage() {
            document.getElementById('success').style.display = 'none';
            document.getElementById('error').style.display = 'none';
        }

        function newCapitalGRPType() {
            document.getElementById('masterhandlerText').innerHTML = "Add New Capital  GRP Type";
            document.getElementById('masterhandler').style.display = 'block'
            document.getElementById('masteritem').placeholder = "Enter new capital GRP type";
            document.getElementById('masteritem').value = "";
            clearmessage();
        }

        function newFunded() {
            document.getElementById('masterhandlerText').innerHTML = "Add New Funded";
            document.getElementById('masterhandler').style.display = 'block'
            document.getElementById('masteritem').placeholder = "Enter new funded";
            document.getElementById('masteritem').value = "";
            clearmessage();
        }

        function newprojectcategory() {
            document.getElementById('masterhandlerText').innerHTML = "Add New Project Category";
            document.getElementById('masterhandler').style.display = 'block'
            document.getElementById('masteritem').placeholder = "Enter new project category";
            document.getElementById('masteritem').value = "";
            clearmessage();
        }

        function newparentchild() {
            document.getElementById('masterhandlerText').innerHTML = "Add New Status";
            document.getElementById('masterhandler').style.display = 'block'
            document.getElementById('masteritem').placeholder = "Enter new status";
            document.getElementById('masteritem').value = "";
            clearmessage();
        }
                
        //Considers only updated records from jexcel 
        var update = function (instance, cell, col, row, value) {

            if (col === 22 || col === 23) {
                if (value > 100) {
                    projectmaster.rows[row].children[(parseInt(col) + 2)].innerHTML = "100";
                    //projectmaster.setValueFromCoords(col, row, 100, true);
                }
            }

            setFormSubmitting();
            var index = -1;
            var userid = cell.innerHTML;
            var validationstatus = true;
            if (col == 3) {

                $http({
                    method: 'POST',
                    url: '../Projects/validateuser',
                    params: { "strUserID": userid }
                }).then(function (response) {
                    //if (response.data === "") {
                    //    validationstatus = false;
                    //    document.getElementById('notification').style.display = 'block';
                    //    //projectmaster.setValueFromCoords((parseInt(col) + 1), row, "Invalid Id", true);
                    //    projectmaster.rows[row].children[(parseInt(col) + 2)].innerHTML = "Invalid Id";
                    //}
                    //else {
                    //    var dsUserfullname = response.data;                                          
                    //    projectmaster.rows[row].children[(parseInt(col) + 2)].innerHTML = dsUserfullname;
                    //    //projectmaster.setValueFromCoords((parseInt(col) + 1), row, dsUserfullname, false);                        
                    //}

                    var dsUserfullname = response.data;
                    projectmaster.rows[row].children[(parseInt(col) + 2)].innerHTML = dsUserfullname;
                    updatetracker(validationstatus, instance, cell, col, row, value);
                }, function (error) {
                    console.log(error);
                });
            }
            else if (col == 1) {

                var projectID = cell.innerHTML;
                $http({
                    method: 'Get',
                    url: '../Resource/validateDuplicateProjectnumber',
                    params: { "strProjectNumber": projectID }
                }).then(function (response) {
                    var result = response.data;
                    if (result = "False") {
                        updatetracker(validationstatus, instance, cell, col, row, value);
                    }
                    else if (result = "True") {
                        showalertsavechangesalert("Project number already used, please enter different project number!");
                    }
                    else {
                        updatetracker(validationstatus, instance, cell, col, row, value);
                    }
                }, function (error) {
                    console.log(error);
                });
            }
            else if (col != 4) {

                updatetracker(validationstatus, instance, cell, col, row, value);
            }
        }

        $scope.discard_project_changes = function () {
            formSubmitting = true;
            updatedInfo = [];
            deleteInfo = [];
            duplicateInfo = [];
            document.getElementById('notification').style.display = 'none';
            document.getElementById('update_notificationnumber1').innerHTML = 0;
            document.getElementById('delete_notificationnumber1').innerHTML = 0;

            $http({
                method: 'GET',
                url: '../Projects/getProjects'
            }).then(function (response) {
                if (response.data.responseCode === 200) {
                    projectmasterdata = response.data.Message;
                    projectmaster.setData(projectmasterdata);
                }
            }, function (error) {
                if (error.status === 403) {
                    window.location.href = '../unAuthorized/Index';
                }
                else {
                    console.error(error);
                }
            });

        }

        function updatetracker(validationstatus, instance, cell, col, row, value) {
            if (validationstatus) {

                //creates json object of jexcel
                var jsonobj = projectmaster.getJson(false);

                //getting particular row from json object       
                var rowobj = jsonobj[row]; //row id getting from event

                //check for existance of respective rec in global object
                if (updatedInfo.find(x => x.ProjectID === rowobj.ProjectID)) {
                    index = updatedInfo.indexOf(updatedInfo.find(x => x.MasterID === rowobj.MasterID)); //getting index of that rec
                    updatedInfo.splice(index, 1); //remove the existing rec from object 
                    updatedInfo.push(rowobj); //pushing newly updated rec
                }
                else
                    updatedInfo.push(rowobj); //pushing updated rec for the first time

                document.getElementById('update_notificationnumber1').innerHTML = updatedInfo.length;

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

                var screenst = $scope.ProjectsTable_fullscreen;
                loadfullscreencss(screenst);
            }
        }

        if (status === false)
            projectmaster.destroy();

        var moveProjectRow = function (instance, from, to) {

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

            updateprogressbar(50, "Updating...");
            $http({
                method: 'POST',
                url: '../Resource/moverows',
                params: { "intFrom": vfrom[30], "intTo": vto[30], "intMasterID": vfrom[2], "strTabname": "projectmaster" }
            }).then(function (response) {


                $http({
                    method: 'GET',
                    url: '../Projects/getProjects'
                }).then(function (response) {
                    if (response.data.responseCode === 200) {
                        projectmasterdata = response.data.Message;
                        projectmaster.setData(projectmasterdata);
                        updateprogressbar(100, "Completed....");
                        document.getElementById('progressbar').style.display = 'none';
                    }
                }, function (error) {
                    if (error.status === 403) {
                        window.location.href = '../unAuthorized/Index';
                    }
                    else {
                        console.error(error);
                    }
                });


            }, function (error) {
                console.log(error);
            });
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

        function deleteupdateinfo(rowobj) {
            if (rowobj.ProjectID != "") {
                if (updatedInfo.find(x => x.ProjectID === rowobj.ProjectID)) {
                    index = updatedInfo.indexOf(updatedInfo.find(x => x.ProjectNumber === rowobj.ProjectNumber)); //getting index of that rec
                    updatedInfo.splice(index, 1); //remove the existing rec from object 
                }
            }
            else {
                //check for existance of respective rec in global object
                if (updatedInfo.find(x => x.ProjectNumber === rowobj.ProjectNumber)) {
                    index = updatedInfo.indexOf(updatedInfo.find(x => x.ProjectNumber === rowobj.ProjectNumber)); //getting index of that rec
                    updatedInfo.splice(index, 1); //remove the existing rec from object 
                }
            }
        }

        projectmaster = jexcel(document.getElementById('spreadsheetprojectmaster'), {
            data: projectmasterdata,
            tableOverflow: true,
            tableWidth: mainwidth,
            tableHeight: mainheight,
            search: true,
            filters: true,
            onload: loaded,
            onchange: update,
            onmoverow: moveProjectRow,
            onselection: selectionActive,
            freezeColumns: 2,
            columns: [
                { type: 'text', title: 'Project Name', width: 250 },
                { type: 'text', title: 'Project Number', width: 120 },
                { type: 'hidden', title: 'ID', width: 50 },
                { type: 'text', title: 'Project Manager ID', width: 150 },
                { type: 'text', title: 'Project Manager Name', width: 180, readOnly: true },
                { type: 'dropdown', title: 'Project Category', width: 220, url: '/Projects/getProjectCategory', autocomplete: true },
                { type: 'dropdown', title: 'Status', width: 120, url: '/Projects/getParentChild', autocomplete: true, readOnly: true },                
                { type: 'text', title: 'Operating Expense WBS', width: 180 },
                { type: 'text', title: 'Capital Expenditure WBS', width: 180 },
                { type: 'text', title: 'GPS Project Number', width: 180 },
                { type: 'text', title: 'Program', width: 180 },
                { type: 'text', title: 'Business Unit', width: 180 },
                { type: 'text', title: 'Period Burden Expense', width: 180 },
                { type: 'text', title: 'Settlement Cost Center', width: 180 },
                { type: 'text', title: 'Settlement Cost Center Name', width: 250 },
                { type: 'text', title: 'Summary of Settlement', width: 250 },
                { type: 'text', title: 'Ending Business Unit', width: 180 },
                { type: 'text', title: 'Funding Source', width: 180 },
                { type: 'text', title: 'Score Card', width: 180 },
                { type: 'dropdown', title: 'In Plan', width: 120, url: '/Projects/getInPLAN', autocomplete: true },
                { type: 'text', title: 'Department', width: 160 },
                { type: 'dropdown', title: 'Capital GRP Type', width: 140, url: '/Projects/getCapitalGRPType', autocomplete: true },
                { type: 'dropdown', title: 'Funded', width: 140, url: '/Projects/getFunded', autocomplete: true },
                { type: 'text', title: 'PCT Funded', width: 140, editor: new InputMaxLenght(3) },
                { type: 'text', title: 'PCT Probability Funded', width: 180, editor: new InputMaxLenght(3) },
                { type: 'hidden', title: 'Created By', width: 100 },
                { type: 'hidden', title: 'Created On', width: 170 },
                { type: 'text', readOnly: true, title: 'Modified By', width: 100 },
                { type: 'date', readOnly: true, title: 'Modified On', width: 100 },
                { type: 'hidden', readOnly: true, title: 'VersionNumber', width: 100 },
                { type: 'hidden', readOnly: true, title: 'RowID', width: 80 }
            ],
            contextMenu: function (obj, x, y, e) {
                var items = [];
                if (y == null) {
                }
                else {

                    // Insert new row
                    if (obj.options.allowInsertRow == true) {
                        items.push({
                            title: 'Insert a new row',
                            onclick: function () {
                                obj.insertRow(1, parseInt(y), 1);
                            }
                        });
                    }
                    // Insert new row
                    if (obj.options.allowInsertRow == true) {
                        items.push({
                            title: 'Clone Proforma',
                            onclick: function () {
                                for (i = s_startvalue; i <= s_endvalue; i++) {
                                    var jsonobj = projectmaster.getJson(false);
                                    var rowobj = jsonobj[i];
                                    document.getElementById('cloneproject').style.display = 'block';
                                    //$scope.clonealert = false;                   
                                    //document.getElementById("newprojectid").value = rowobj.ProjectNumber;
                                    //document.getElementById("newprojectname").value = rowobj.ProjectName;  

                                    cloneproformafun(rowobj.ProjectNumber);
                                }
                            }
                        });
                    }
                    if (obj.options.allowInsertRow == true) {
                        items.push({
                            title: 'Mark As Primary Project',
                            onclick: function () {
                                localStorage.setItem("PID", 0);
                                localStorage.setItem("SID", 0);
                                document.getElementById("newPrimaryProject").value = "";
                                document.getElementById("newSecondryprojectname").value = "";
                                for (i = s_startvalue; i <= s_endvalue; i++) {
                                    var jsonobj = projectmaster.getJson(false);
                                    var rowobj = jsonobj[i];
                                    document.getElementById('MasterProject').style.display = 'block';
                                    $scope.primaryalert = false;
                                    localStorage.setItem("PID", rowobj.ProjectID);
                                    document.getElementById("newPrimaryProject").value = rowobj.ProjectNumber + "-" + rowobj.ProjectName + "   (Secondary)";
                                    getmasterprojectdetails(rowobj.ProjectNumber);
                                    //document.getElementById("newprojectname").value = rowobj.ProjectName;
                                    //cloneproformafun(rowobj.ProjectNumber);
                                }
                            }
                        });
                    }

                    if (obj.options.allowDeleteRow == true) {
                        items.push({ type: 'line' });
                        items.push({
                            title: obj.options.text.deleteSelectedRows,
                            onclick: function () {
                                //if (confirm('Are you sure do you want to delete?'))
                                //    obj.deleteRow(obj.getSelectedRows().length ? undefined : parseInt(y));


                                if (confirm('Are you sure do you want to delete?')) {

                                    var rowsElement = obj.getSelectedRows();
                                    console.log(rowsElement);

                                    for (var indexRow = 0; indexRow < rowsElement.length; indexRow++) {

                                        var displaystatus = rowsElement[indexRow].style.display;
                                        if (displaystatus == "") {

                                            var y = parseInt(rowsElement[indexRow].getAttribute("data-y"));
                                            var jsonobj = obj.getJson(false);
                                            var rowobj = jsonobj[y];
                                            deleteInfo.push(rowobj);
                                            updatedeletenotificationbar();
                                            deleteupdateinfo(rowobj);
                                            obj.deleteRow(y);
                                        }

                                    }
                                }
                            }
                        });
                    }
                }

                return items;
            },
            updateTable: function (instance, cell, col, row, val, label, cellName) {
                // Number formating
                if (col == 22 || col == 23) {
                    cell.onkeypress = function isNumberKey(evt) {
                        var charCode = (evt.which) ? evt.which : evt.keyCode;
                        if (charCode != 46 && charCode > 31
                            && (charCode < 48 || charCode > 57))
                            return false;
                        return true;
                    };
                }
                //setTimeout(function () {
                //    $scope.$apply(function () {
                //        document.getElementById('addnewFunded').focus();
                //    });
                //}, 100);
            }
        });

    }

    $scope.updatetotalsum = function () {
        setTimeout(function () {
            $scope.$apply(function () {

            });
        }, 1000);
    }

    function getmasterprojectdetails(strProjectID) {
        $http({
            method: 'POST',
            url: '../Projects/getmasterproforma',
            params: { "strProjectID": strProjectID }
        }).then(function (response) {
            if (response.data != null && response.data != "") {
                document.getElementById("swappingbutton").disabled = false;
                localStorage.setItem("SID", response.data[0].ProjectID);
                document.getElementById("newSecondryprojectname").value = response.data[0].ProjectNumber + "-" + response.data[0].ProjectName + "   (Primary)";
            }
            else {
                $scope.primaryalert = true;
                $scope.primarymessage = "selected projects doesn't has master project";
                document.getElementById("swappingbutton").disabled = true;
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.startSwapping = function () {

        updateprogressbar(20, "Swapping....");

        $http({
            method: 'POST',
            url: '../Projects/swapprojects',
            params: {
                "intPrimaryProjectID": localStorage.getItem("PID"), "intSecondaryProjectID": localStorage.getItem("SID")
            }
        }).then(function (response) {
            $http({
                method: 'GET',
                url: '../Projects/getProjects'
            }).then(function (response) {
                if (response.data.responseCode === 200) {
                    projectmasterdata = response.data.Message;
                    projectmaster.setData(projectmasterdata);
                    document.getElementById('MasterProject').style.display = 'none';
                    updateprogressbar(100, "Completed....");
                    document.getElementById('progressbar').style.display = 'none';
                }
            }, function (error) {
                if (error.status === 403) {
                    window.location.href = '../unAuthorized/Index';
                }
                else {
                    console.error(error);
                }
            });
        }, function (error) {
            console.log(error);
        });

    }

    function cloneproformafun(strProjectID) {

        $http({
            method: 'GET',
            url: '../Resource/getversiondetails',
            params: { "strProjectID": strProjectID }
        }).then(function (response) {

            document.getElementById('cloneproject').style.display = 'block';
            $scope.clonealert = false;
            $scope.model_newProjectID = response.data[0].ProjectNumber + '_V' + response.data[0].VersionNumber;
            $scope.model_newProjectName = response.data[0].ProjectName + '_V' + response.data[0].VersionNumber;
            localStorage.setItem("cloneProjectID", strProjectID);

        }, function (error) {
            console.log(error);
        });

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

            projectmaster_cloneproforma = [];
            for (i = s_startvalue; i <= s_endvalue; i++) {
                var jsonobj = projectmaster.getJson(false);
                var rowobj = jsonobj[i];
                projectmaster_cloneproforma.push(rowobj);
            }
            cloneproforma($scope.model_newProjectID, $scope.model_newProjectName);
        }
    }

    $scope.createnewproject = function () {

        var newprojectID = document.getElementById("newCreateProject").value;
        var newprojectName = document.getElementById("newCreateProjectName").value;

        if (newprojectID == "" || newprojectID == undefined) {
            $scope.createnewprojectalert = true;
            $scope.createnewprojectmessage = "Please enter new project id";
        }
        else if (newprojectName == "" || newprojectName == undefined) {
            $scope.createnewprojectalert = true;
            $scope.createnewprojectmessage = "Please enter new project name";
        }
        else {

            updateprogressbar(50, "Creating New Proforma....");

            $http({
                method: 'POST',
                url: '../Projects/createnewproforma',
                params: {
                    "ID": localStorage.getItem("CReferencePID"), "strProjectID": newprojectID, "strProjectName": newprojectName, "strUserID": localStorage.getItem("userID")
                }
            }).then(function (response) {

                $http({
                    method: 'GET',
                    url: '../Projects/getProjects'
                }).then(function (response) {
                    alert(response.data.responseCode);
                    if (response.data.responseCode === 200) {
                        projectmasterdata = response.data.Message;
                        projectmaster.setData(projectmasterdata);
                        document.getElementById('CreateNewProject').style.display = 'none';
                        updateprogressbar(100, "Completed....");
                        document.getElementById('progressbar').style.display = 'none';
                    }
                }, function (error) {
                    if (error.status === 403) {
                        window.location.href = '../unAuthorized/Index';
                    }
                    else {
                        console.error(error);
                    }
                });

            }, function (error) {
                console.log(error);
            });
        }
    }

    $scope.closecloning = function () {
        document.getElementById('cloneproject').style.display = 'none';
    }

    $scope.closeprimary = function () {
        document.getElementById('MasterProject').style.display = 'none';
    }

    $scope.closecreatenew = function () {
        document.getElementById('CreateNewProject').style.display = 'none';
    }

    function cloneproforma(newid, newname) {        

        var data = {
            clone: projectmaster_cloneproforma,
            ID: newid,
            Name: newname
        };

        $http({
            method: 'POST',
            url: '../Projects/cloneproformaproject',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {

            var closestatus = response.data;           
            if (closestatus != "Invalid ProjectID") {

                updateprogressbar(20, "Cloning started...");
                $http({
                    method: 'GET',
                    url: '../Projects/getProjects'
                }).then(function (response) {
                    if (response.data.responseCode === 200) {
                        projectmasterdata = response.data.Message;
                        projectmaster.setData(projectmasterdata);
                        document.getElementById('cloneproject').style.display = 'none';
                        updateprogressbar(100, "Completed....");
                        document.getElementById('progressbar').style.display = 'none';
                    }
                }, function (error) {
                    if (error.status === 403) {
                        window.location.href = '../unAuthorized/Index';
                    }
                    else {
                        console.error(error);
                    }
                });
            }
            else {
                document.getElementById('cloneproject').style.display = 'none';
                showalertsavechangesalert("Project ID already exists!");
            }

        }, function (error) {
            console.log(error);
        });

    }

    function loadfullscreencss(fullscreenstatus) {

        var width = parseInt(window.innerWidth);
        var height = parseInt(window.innerHeight);
        var insertcount = "";
        var deletecount = "";

        insertcount = updatedInfo.length;
        deletecount = deleteInfo.length;

        if (parseInt(insertcount) > 0 || parseInt(deletecount) > 0) {
            document.getElementById('notification').style.display = 'block';
            if (fullscreenstatus) {
                document.getElementById('notification').setAttribute('style', 'position: fixed; top: 0px; left: 0px; width: 100%; display: block;');
                document.getElementById('spreadsheetprojectmaster').setAttribute('style', 'position: fixed; top: 30px; left: 0px; width:100%; height:100%; background-color: white;');

                var elms = document.getElementById('spreadsheetprojectmaster').getElementsByTagName("*");
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

            var insertcount = document.getElementById('update_notificationnumber1').innerHTML;
            var deletecount = document.getElementById('delete_notificationnumber1').innerHTML;
            document.getElementById('notification').style.display = 'none';

            var topvalue = 0;
            if (parseInt(insertcount) > 0 || parseInt(deletecount) > 0) {
                topvalue = 30;
                height = height - 30;
                document.getElementById('notification').style.display = 'block';
                var _height = height - 140;
                searchtablestyle = "overflow: auto; width: " + (width - 65).toString() + "px; height: " + _height + "px;"
            }
            else {
                var _height = height - 140;
                searchtablestyle = "overflow: auto; width: " + mainwidth + "; height: " + _height + "px;"
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
            var elms = document.getElementById("spreadsheetprojectmaster").getElementsByTagName("*");
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
            var ProjectMasterFullScreen = document.getElementById("spreadsheetprojectmaster");
            var projectnotification = document.getElementById("notification");

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

    function InputMaxLenght(maxLength) {

        // Methods
        this.closeEditor = function (cell, save) {
            var value = cell.children[0].value;
            cell.innerHTML = value;
            return value;
        };
        this.openEditor = function (cell) {
            var previousvalue = cell.innerHTML;
            // Create input
            var element = document.createElement('input');
            element.maxLength = maxLength;
            element.id = "tempID";
            element.value = previousvalue;
            element.onkeyup = function fnc() {

                var value = document.getElementById('tempID').value;
                if (parseInt(value) < 0 || isNaN(value))
                    document.getElementById('tempID').value = 0;
                else if (parseInt(value) > 100) {
                    document.getElementById('tempID').value = 100;
                }

            };

            // // Update cell
            cell.classList.add('editor');
            cell.innerHTML = "";
            cell.appendChild(element);
            // // Focus on the element
            element.focus();
        };
        this.getValue = function (cell) {
            return cell.innerHTML;
        };
        this.setValue = function (cell, value) {
            console.log(value);
            cell.innerHTML = value;
        };
        this.updateCell = function (cell, value) {
            let instance = cell.parentNode.parentNode.parentNode.parentNode.parentNode.jexcel;
            let y = cell.dataset.y;
            let x = cell.dataset.x
            cell.innerHTML = value;
            instance.options.data[y][x] = value;
            return value;
        };
    }


    getcompletelistofnotification();
    function getcompletelistofnotification() {
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
            document.getElementById('notificationBody').setAttribute('style', 'height: ' + (parseInt(window.innerHeight) - parseInt(210)) + 'px;');
        }, function (error) {
            console.log(error);
        });
    }
    $scope.closenotification = function () {
        document.getElementById('notificationpanel').style.display = 'none';
    }

})
