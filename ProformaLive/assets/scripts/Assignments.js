var app = angular.module('MECC', []);
app.controller('AssignmentController', function ($scope, $http, $window) {

    var dsAssignments = [];
    var jSuite_Teams = [];
    var assignsource = { assignitems: [] };
    var mainwidth = (window.innerWidth - 42) + "px";
    localStorage.setItem("CurrentPage", 2);
    loadmastersettings();
    getusername();
    loaddefaultfisyear();
    var dsResourceList = [];
    var defaultFisYear = [];

    var tablewidth = document.getElementById('maintableview').offsetWidth;
    $scope.MainAssignmentswidth = (tablewidth - 40) + "px";
    $scope.AssignmentProjectWidth = (tablewidth - 1020) + "px";

    function loaddefaultfisyear() {

        updateprogressbar(20, "Assign-Live is loading...");

        $http({
            method: 'GET',
            url: '../resource/get_defaultfisyear'
        }).then(function (response) {
            defaultFisYear = response.data;

            document.getElementById('dropfisyear').innerHTML = "";
            jSuite_dropfisyear = jSuites.dropdown(document.getElementById('dropfisyear'), {
                url: '../Assignments/getfisyear',
                autocomplete: true,
                lazyLoading: false,
                multiple: false,
                value: defaultFisYear,
                placeholder: "Select FisYear",
                width: '100%'
            });

            jSuite_Teams = jSuites.dropdown(document.getElementById('dropTeams'), {
                url: '../Assignments/getTeams',
                autocomplete: true,
                placeholder: "Select Team",
                lazyLoading: true,
                multiple: true,
                width: '100%',
                onclose: onTeamChange,
            });

            updateprogressbar(100, "Assign-Live is loading...");

        }, function (error) {
            console.log(error);
        });

    }


    $scope.setcolor = function (value) {

        var objcolors = [
            { "ID": -0.8, "Code": "#4dff4d", "BCode": "#80ff80" },
            { "ID": -0.7, "Code": "#4dff4d", "BCode": "#80ff80" },
            { "ID": -0.6, "Code": "#4dff4d", "BCode": "#80ff80" },
            { "ID": -0.5, "Code": "#66ff66", "BCode": "#80ff80" },
            { "ID": -0.4, "Code": "#80ff80", "BCode": "#66ff66" },
            { "ID": -0.3, "Code": "#99ff99", "BCode": "#80ff80" },
            { "ID": -0.2, "Code": "#b3ffb3", "BCode": "#99ff99" },
            { "ID": -0.1, "Code": "#ccffcc", "BCode": "#b3ffb" },
            { "ID": -0.01, "Code": "#e6ffe6", "BCode": "#ccffcc" },
            { "ID": 0.1, "Code": "#ffe6e6", "BCode": "#ffcccc" },
            { "ID": 0.3, "Code": "#ffcccc", "BCode": "#ffb3b3" },
            { "ID": 0.5, "Code": "#ffb3b3", "BCode": "#ff9999" },
            { "ID": 0.7, "Code": "#ff9999", "BCode": "#ff8080" },
            { "ID": 0.9, "Code": "#ff8080", "BCode": "#ff6666" },
            { "ID": 2.1, "Code": "#ff6666", "BCode": "#ff4d4d" },
            { "ID": 2.3, "Code": "#ff4d4d", "BCode": "#ff8080" },
            { "ID": 2.5, "Code": "#ff4d4d", "BCode": "#ff8080" },
            { "ID": 2.7, "Code": "#ff4d4d", "BCode": "#ff8080" },
            { "ID": 200, "Code": "#ff4d4d", "BCode": "#ff8080" }
        ];

        if (value != '' && value != null) {
            var result = objcolors.filter(a => a.ID >= value);
            if (result.length > 0) {
                return {
                    "background-color": result[0].Code,
                    "text-align": "right",
                    "border": "0.5px solid " + result[0].BCode,
                }
            }
        }
        else {
            return {
                "background-color": "#fff",
                "text-align": "right",
                "border": "0.5px solid #ccdaea",
            }
        }
    }

    $scope.setunassignedcolor = function (value) {

        var objcolors = [
            { "ID": -10, "Code": "#ff66b3", "BCode": "#ff66b3" },
            { "ID": -0.7, "Code": "#ff66b3", "BCode": "#ff66b3" },
            { "ID": -0.6, "Code": "#ff80bf", "BCode": "#ff66b3" },
            { "ID": -0.5, "Code": "#ff99cc", "BCode": "#ff80bf" },
            { "ID": -0.4, "Code": "#ff80bf", "BCode": "#ff99cc" },
            { "ID": -0.3, "Code": "#ff99cc", "BCode": "#ff80bf" },
            { "ID": -0.2, "Code": "#ffb3d9", "BCode": "#ff99cc" },
            { "ID": -0.1, "Code": "#ffcce6", "BCode": "#ffb3d9" },
            { "ID": 0.1, "Code": "#ffe6e6", "BCode": "#ffcccc" },
            { "ID": 0.3, "Code": "#ffcccc", "BCode": "#ffb3b3" },
            { "ID": 0.5, "Code": "#ffb3b3", "BCode": "#ff9999" },
            { "ID": 0.7, "Code": "#ff9999", "BCode": "#ff8080" },
            { "ID": 0.9, "Code": "#ff8080", "BCode": "#ff6666" },
            { "ID": 2.1, "Code": "#ff6666", "BCode": "#ff4d4d" },
            { "ID": 2.3, "Code": "#ff4d4d", "BCode": "#ff8080" },
            { "ID": 2.5, "Code": "#ff4d4d", "BCode": "#ff8080" },
            { "ID": 2.7, "Code": "#ff4d4d", "BCode": "#ff8080" },
            { "ID": 200, "Code": "#ff4d4d", "BCode": "#ff8080" }
        ];

        if (value != '' && value != null && value != 0) {
            var result = objcolors.filter(a => a.ID >= value);
            if (result.length > 0) {
                return {
                    "background-color": result[0].Code,
                    "text-align": "right",
                    "border": "0.5px solid " + result[0].BCode,
                }
            }
        }
        else {
            return {
                "background-color": "#66ff66",
                "text-align": "right",
                "border": "0.5px solid #00ff00",
            }
        }
    }

    function onTeamChange() {

        updateprogressbar(10, "Assign-Live is loading...");
        $http({
            method: 'GET',
            url: '../Assignments/getAssignlivemainview',
            params: { "intFisYear": defaultFisYear, "strTeam": jSuite_Teams.getValue() }
        }).then(function (response) {
            $scope.AssignmentData = response.data;

            $http({
                method: 'GET',
                url: '../Assignments/getResourceList',
                params: { "strTeam": jSuite_Teams.getValue(), "intFisYear": defaultFisYear }
            }).then(function (response) {
                dsResourceList = response.data;
            }, function (error) {
                console.log(error);
            });

            $http({
                method: 'GET',
                url: '../Assignments/getunassignedremaining',
                params: { "intFisYear": defaultFisYear, "strTeam": jSuite_Teams.getValue() }
            }).then(function (response) {
                $scope.UnassignedRemaining = response.data;
            }, function (error) {
                console.log(error);
            });

            $http({
                method: 'GET',
                url: '../Assignments/getassignmentdata',
                params: { "intFisYear": defaultFisYear, "strTeam": jSuite_Teams.getValue() }
            }).then(function (response) {
                var sourcedata = response.data;
                $scope.dsAssignmentsDataSource = response.data;
                var maindata = $scope.AssignmentData;

                for (var i = 0; i < maindata.length; i++) {
                    dsAssignments = sourcedata.filter(a => a.Project == maindata[i].Project);
                    if (dsAssignments.length > 0) {
                        loadAssignmentTable("decb_" + i);
                    }
                }

            }, function (error) {
                console.log(error);
            });

            document.getElementById('divAssignments').style.display = 'block';

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

    $scope.updatemasteritem = function () {

        updateprogressbar(10, "saving changes...");
        var projectID = $scope.modelAssignProjectID;
        var dropAssignTeam = jSuite_dropAssignTeams.getValue();
        var dropRequiredSkills = jSuite_dropRequiredSkills.getValue();
        var dropAssignResource = jSuite_dropAssignResources.getValue();

        if (dropAssignTeam == '' || dropAssignTeam == null) {
            document.getElementById('error').style.display = 'block';
            document.getElementById('errortext').innerText = "Please Select Team";
        }
        else if (dropRequiredSkills == '' || dropRequiredSkills == null) {
            document.getElementById('error').style.display = 'block';
            document.getElementById('errortext').innerText = "Please Select RequiredSkill";
        }
        else if (dropAssignResource == '' || dropAssignResource == null) {
            document.getElementById('error').style.display = 'block';
            document.getElementById('errortext').innerText = "Please Select Resource";
        }

        $http({
            method: 'POST',
            url: '../Assignments/insert_Assignment',
            params: { "strProjectID": projectID, "strTeam": dropAssignTeam, "strRequiredSkills": dropRequiredSkills, "strResourcename": dropAssignResource, "defaultYear": defaultFisYear }
        }).then(function (response) {

            document.getElementById('masterhandler').style.display = 'none'
            onTeamChange();
            setTimeout(function () {
                $scope.$apply(function () {
                    if (assignsource != null) {
                        for (var i = 0; i < assignsource.assignitems.length; i++) {
                            document.getElementById("assign-" + assignsource.assignitems[0].fid).click();
                        }
                        updateprogressbar(100, "Completed...");

                    }
                });
            }, 1000);

        }, function (error) {
            console.log(error);
        });
    }

    function newprojectcategory() {

        var myid = 'jexcel' + this.id.replace('btn_', '');
        var items = window[myid].getJson(false);

        $scope.modelAssignProjectID = items[0].ProjectID;

        var teamlookup = {};
        var teamresult = [];
        for (var item, i = 0; item = items[i++];) {
            var Team = item.Team;
            if (!(Team in teamlookup)) {
                teamlookup[Team] = 1;
                teamresult.push(Team);
            }
        }

        document.getElementById('masterhandlerText').innerHTML = "Add New Assignment";
        document.getElementById('masterhandler').style.display = 'block'

        document.getElementById('dropAssignTeams').innerHTML = "";
        jSuite_dropAssignTeams = jSuites.dropdown(document.getElementById('dropAssignTeams'), {
            data: teamresult,
            autocomplete: true,
            lazyLoading: false,
            multiple: false,
            placeholder: "Select Team",
            width: '100%'
        });

        var requiredskillslookup = {};
        var requiredskillsresult = [];
        for (var item, j = 0; item = items[j++];) {
            var RequiredSkill = item.RequiredSkill;

            if (!(RequiredSkill in requiredskillslookup)) {
                requiredskillslookup[RequiredSkill] = 1;
                requiredskillsresult.push(RequiredSkill);
            }
        }

        document.getElementById('dropRequiredSkills').innerHTML = "";
        jSuite_dropRequiredSkills = jSuites.dropdown(document.getElementById('dropRequiredSkills'), {
            data: requiredskillsresult,
            autocomplete: true,
            lazyLoading: false,
            multiple: false,
            placeholder: "Select Required Skills",
            width: '100%'
        });

        document.getElementById('dropAssignResources').innerHTML = "";
        jSuite_dropAssignResources = jSuites.dropdown(document.getElementById('dropAssignResources'), {
            data: dsResourceList,
            autocomplete: true,
            lazyLoading: false,
            multiple: false,
            placeholder: "Select Resource",
            width: '100%'
        });

        clearmessage();
    }

    function clearmessage() {
        document.getElementById('success').style.display = 'none';
        document.getElementById('error').style.display = 'none';
    }

    function removemasterhandler() {
        document.getElementById('masterhandler').style.display = 'none'
    }

    $scope.viewUnAssignment = function () {
        var newWindowContent = document.getElementById('divUnAssignment').innerHTML;
        var newWindow = $window.open("", "", "width=1200,height=300");
        newWindow.document.write('<html><head><title>Unassigned Remaining</title><link href="../assets/css/proforma.css?ID=94000" rel="stylesheet" /></head><body>');
        newWindow.document.write(newWindowContent);
        newWindow.document.write('</body></html>');
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

    function savechanges() {

        updateprogressbar(10, "Saving Changes...");
        document.getElementById(this.id).style.display = "none";
        var myid = 'jexcel' + this.id.replace('btn_save_', '');
        var items = window[myid].getJson(false);
        console.log(items);

        var data = {
            update: items
        };

        $http({
            method: 'POST',
            url: '../Assignments/saveassignmentdata',
            data: data
        }).then(function (response) {
            onTeamChange();
            setTimeout(function () {
                $scope.$apply(function () {
                    if (assignsource != null) {
                        for (var i = 0; i < assignsource.assignitems.length; i++) {
                            document.getElementById("assign-" + assignsource.assignitems[0].fid).click();
                        }
                        updateprogressbar(100, "Completed...");
                    }
                });
            }, 1000);
        }, function (error) {
            console.log(error);
        });
    }

    $scope.expandde = function (status, id) {

        assignsource = JSON.parse(localStorage.getItem("assign_expandid"));
        if (status == false) {
            if (assignsource != null) {
                if (assignsource.assignitems.find(x => x.fid === id)) {
                    const index = assignsource.assignitems.findIndex(c => c.fid === id);
                    assignsource.assignitems.splice(index, 1)
                    localStorage.setItem("assign_expandid", JSON.stringify(assignsource));
                }
            }
        }
        else {
            if (assignsource == null) {
                assignsource = { assignitems: [] };
            }
            else {
                if (assignsource.assignitems.find(x => x.fid === id)) {
                    const index = assignsource.assignitems.findIndex(c => c.fid === id);
                    assignsource.assignitems.splice(index, 1)
                    localStorage.setItem("assign_expandid", JSON.stringify(assignsource));
                }
            }
            assignsource.assignitems.push({ "fid": id });
            localStorage.setItem("assign_expandid", JSON.stringify(assignsource));
        }
    }

    function loadAssignmentTable(item) {

        document.getElementById(item).innerHTML = "";
        var loaded = function () {
            var datavalues = document.getElementById(item).getElementsByTagName("thead");
            var newsubchilditem = datavalues[0].firstChild.getElementsByTagName("td");
            newsubchilditem[3].innerHTML = "Project <button title='Add New Assignment' ID='btn_" + item + "' style='z-index: 99999;' class='btn btn-success btn-sm pull-right additem'><i class='fa fa-plus-circle' aria-hidden='true'></i></button> <button title='Save Changes' ID='btn_save_" + item + "' style='z-index: 99999; display:none; margin-right: 5px;' class='btn btn-primary btn-sm pull-right additem'><i class='fa fa fa-floppy-o' aria-hidden='true'></i></button>";
            document.getElementById('btn_' + item).onclick = newprojectcategory;
            document.getElementById('btn_save_' + item).onclick = savechanges;
            document.getElementById('removehandler').onclick = removemasterhandler;
            updateprogressbar(100, "Completed...");
        }

        var update = function (instance, cell, col, row, value) {

            var data = instance.jexcel.getJson(false);
            var dsAssigned = data.filter(x => x.RequestType == 'Assigned')
            var dsDemand = data.filter(x => x.RequestType == 'Demand')

            var f1 = 0;
            var columnname = "";
            for (let x in dsAssigned[0]) {
                if (f1 == col) {
                    columnname = x;
                }
                f1 = f1 + 1;
            }

            var intAssigned = 0;
            var ProjectID = data[0]["ProjectID"];
            var res = item.split("_");

            for (var i = 0; i < dsAssigned.length; i++) {
                if (dsAssigned[i][columnname] != null) {
                    intAssigned = intAssigned + parseFloat(dsAssigned[i][columnname]);
                }
            }
            intAssigned = intAssigned.toFixed(2)

            var intDemand = 0;
            for (var i = 0; i < dsDemand.length; i++) {
                if (dsDemand[i][columnname] != null) {
                    intDemand = intDemand + parseFloat(dsDemand[i][columnname]);
                }
            }
            intDemand = intDemand.toFixed(2)
            document.getElementById(ProjectID + '_' + col + '_' + res[1]).innerHTML = (intDemand - intAssigned).toFixed(2);
            document.getElementById('btn_save_' + item).style.display = "block";
        }

        window['jexcel' + item] = jexcel(document.getElementById(item), {
            data: dsAssignments,
            search: false,
            tableOverflow: true,
            onload: loaded,
            filters: false,
            onchange: update,
            contextMenu: false,
            allowManualInsertRow: false,
            columns: [
                { type: 'hidden', title: 'ID' },
                { type: 'hidden', title: 'ProjectID' },
                { type: 'text', readOnly: true, title: 'Project', width: (tablewidth - 1050) / 4 },
                { type: 'text', readOnly: true, title: 'Team', width: (tablewidth - 1050) / 4 },
                { type: 'text', readOnly: true, title: 'RequiredSkills', width: (tablewidth - 1050) / 4 },
                { type: 'text', readOnly: true, title: 'ResourceName', width: (tablewidth - 1050) / 4 },
                { type: 'number', title: 'MAY', width: 70, align: 'right' },
                { type: 'number', title: 'JUN', width: 70, align: 'right' },
                { type: 'number', title: 'JULY', width: 70, align: 'right' },
                { type: 'number', title: 'AUG', width: 70, align: 'right' },
                { type: 'number', title: 'SEP', width: 70, align: 'right' },
                { type: 'number', title: 'OCT', width: 70, align: 'right' },
                { type: 'number', title: 'NOV', width: 70, align: 'right' },
                { type: 'number', title: 'DEC', width: 70, align: 'right' },
                { type: 'number', title: 'JAN', width: 70, align: 'right' },
                { type: 'number', title: 'FEB', width: 70, align: 'right' },
                { type: 'number', title: 'MAR', width: 70, align: 'right' },
                { type: 'number', title: 'APR', width: 70, align: 'right' },
                { type: 'text', readOnly: true, title: 'RequestType', width: 120 }
            ],
            updateTable: function (instance, cell, col, row, val) {

                var findDemandrow = instance.jexcel.getValue('S' + parseInt(row + 1))
                if (findDemandrow == 'Demand') {
                    cell.classList.add('readonly');
                }

                if (val == 'Demand') {
                    instance.jexcel.setStyle('C' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('D' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('E' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('F' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('G' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('H' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('I' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('J' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('K' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('L' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('M' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('N' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('O' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('P' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('Q' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('R' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                }
            }
        });
        window['jexcel' + item].hideIndex();
    }

    function loadmastersettings() {
        var usertype = localStorage.getItem("isAdmin");
        document.getElementById("menudashboard").setAttribute("class", "nav-item");
        document.getElementById("menuresource").setAttribute("class", "nav-item");
        document.getElementById("menuassignments").setAttribute("class", "nav-item");
        document.getElementById("mastermenu").setAttribute("class", "nav-item dropdown");
        document.getElementById("menuassignments").setAttribute("class", "nav-item active");

        if (usertype === "true") {
            document.getElementById("roles").innerHTML = "Admin";
            document.getElementById("mastermenu").setAttribute("style", "display:block;");
        }
        else {
            document.getElementById("roles").innerHTML = "User";
            document.getElementById("mastermenu").setAttribute("style", "display:none;");
        }
    }

});