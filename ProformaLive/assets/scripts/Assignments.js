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
    var assign_comments = [];
    var formSubmitting = true;
    var savesource = { saveitems: [] };
    var uniqueresource = [];

    localStorage.setItem("save_status", JSON.stringify(savesource));
    var newWindow = false;
    var tablewidth = document.getElementById('maintableview').offsetWidth;
    $scope.MainAssignmentswidth = (tablewidth - 40) + "px";
    $scope.AssignmentProjectWidth = (tablewidth - 1020) + "px";

    var setFormSubmitting = function () { formSubmitting = false; };
    window.onload = function () {
        window.addEventListener("beforeunload", function (e) {
            if (formSubmitting == false) {
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
                width: '100%',
                onchange: onFisYearChange
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

        var backgroundcolor = "";
        var bordercolor = "";
        var color = "";

        if (value == 0) {
            backgroundcolor = "#83ce83";
            bordercolor = "#76bb76";
            color = "#fff";
        }
        else if (value >= 1) {
            backgroundcolor = "#b3d9ff";
            bordercolor = "#99ccff";
            color = "#212529";
        }
        else if (value < 0) {
            backgroundcolor = "#be2fd8";
            bordercolor = "#b110d0";
            color = "#fff";
        }
        else if (value < 1 && value > 0) {
            backgroundcolor = "#ff99c2";
            bordercolor = "#ff80b3";
            color = "#212529";
        }

        if (value != '' && value != null) {
            return {
                "background-color": backgroundcolor,
                "text-align": "right",
                "border": "0.5px solid " + bordercolor,
                "color": color
            }
        }
        else {
            return {
                "background-color": "#83ce83",
                "text-align": "right",
                "border": "0.5px solid #76bb76",
                "color": "#fff"
            }
        }
    }

    $scope.setunassignedcolor = function (value) {

        var backgroundcolor = "";
        var bordercolor = "";

        if (value == 0) {
            backgroundcolor = "#83ce83";
            bordercolor = "#76bb76";
            color = "#fff";
        }
        else if (value >= 1) {
            backgroundcolor = "#b3d9ff";
            bordercolor = "#99ccff";
            color = "#212529";
        }
        else if (value < 0) {
            backgroundcolor = "#be2fd8";
            bordercolor = "#b110d0";
            color = "#fff";
        }
        else if (value < 1 && value > 0) {
            backgroundcolor = "#ff99c2";
            bordercolor = "#ff80b3";
            color = "#212529";
        }

        if (value != '' && value != null && value != 0) {
            return {
                "background-color": backgroundcolor,
                "text-align": "right",
                "border": "0.5px solid " + bordercolor,
                "color": color
            }
        }
        else {
            return {
                "background-color": "#83ce83",
                "text-align": "right",
                "border": "0.5px solid #76bb76",
                "color": "#fff"
            }
        }
    }

    function onFisYearChange() {
        defaultFisYear = jSuite_dropfisyear.getValue();
        var strTeamvalue = jSuite_Teams.getValue();
        if (strTeamvalue != null && strTeamvalue != '') {
            onTeamChange();
        }
        else {
            showalertsavechangesalert('Please Select Team!');
        }
    }

    function onTeamChange() {

        var strTeam = jSuite_Teams.getValue();
        if (strTeam.length > 0) {

            update_assign_comments();
            updateprogressbar(10, "Assign-Live is loading...");
            $http({
                method: 'GET',
                url: '../Assignments/getAssignlivemainview',
                params: { "intFisYear": defaultFisYear, "strTeam": jSuite_Teams.getValue() }
            }).then(function (response) {
                $scope.AssignmentData = response.data;
                updateUnassignedSum(response.data);

                $http({
                    method: 'GET',
                    url: '../Assignments/getResourceList',
                    params: { "strTeam": jSuite_Teams.getValue(), "intFisYear": defaultFisYear }
                }).then(function (response) {
                    dsResourceList = response.data;
                }, function (error) {
                    console.log(error);
                });
                loadunassignedamount();
                $http({
                    method: 'GET',
                    url: '../Assignments/getassignmentdata',
                    params: { "intFisYear": defaultFisYear, "strTeam": jSuite_Teams.getValue() }
                }).then(function (response) {
                    var sourcedata = response.data;
                    update_demand_sum(response.data);
                    update_assigned_sum(response.data);
                    $scope.dsAssignmentsDataSource = response.data;
                    var maindata = $scope.AssignmentData;
                    for (var i = 0; i < maindata.length; i++) {
                        dsAssignments = sourcedata.filter(a => a.WBSNumber == maindata[i].WBSNumber && a.ProjectID == maindata[i].ProjectID);
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
        else {
            showalertsavechangesalert('Please Select Team');
        }

    }

    function updateUnassignedSum(tableobj) {
        var ths = document.getElementById('tblMainAssignments').getElementsByTagName('th');
        var months = ["MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR"];
        for (var i = 0; i < months.length; i++) {
            var monthtotal = 0;
            for (var j = 0; j < tableobj.length; j++) {
                if (tableobj[j][months[i]] != null) {
                    monthtotal = monthtotal + parseFloat(tableobj[j][months[i]]);
                }
            }
            ths[i + 43].innerHTML = monthtotal.toFixed(2);
        }
    }

    $scope.exportassigndata = function () {
        updateprogressbar(50, "Exporting assign-live data into excel format, please wait...");
        $http({
            method: 'GET',
            url: '../Assignments/export_assignlivedata',
            params: { "intFisYear": defaultFisYear, "strTeam": jSuite_Teams.getValue() }
        }).then(function (response) {
            downloadURI("../upload/" + response.data, response.data);
            updateprogressbar(100, "Completed...");
        }, function (error) {
            console.log(error);
        });
    }

    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    }


    function update_supply_sum(tabledemandobj) {
        var ths = document.getElementById('tblMainAssignments').getElementsByTagName('th');
        var months = ["MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR"];
        for (var i = 0; i < months.length; i++) {
            var monthtotal = 0;
            for (var j = 0; j < tabledemandobj.length; j++) {
                if (tabledemandobj[j][months[i]] != null) {
                    monthtotal = monthtotal + parseFloat(tabledemandobj[j][months[i]]);
                }
            }
            ths[i + 1].innerHTML = monthtotal.toFixed(2);
        }
    }

    function update_demand_sum(tabledemandobj) {
        tabledemandobj = tabledemandobj.filter(x => x.RequestType == 'Demand')
        var ths = document.getElementById('tblMainAssignments').getElementsByTagName('th');
        var months = ["MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR"];
        for (var i = 0; i < months.length; i++) {
            var monthtotal = 0;
            for (var j = 0; j < tabledemandobj.length; j++) {
                if (tabledemandobj[j][months[i]] != null) {
                    monthtotal = monthtotal + parseFloat(tabledemandobj[j][months[i]]);
                }
            }
            ths[i + 15].innerHTML = monthtotal.toFixed(2);
        }
    }

    function update_assigned_sum(tableassignedobj) {
        tableassignedobj = tableassignedobj.filter(x => x.RequestType == 'Assigned')
        var ths = document.getElementById('tblMainAssignments').getElementsByTagName('th');
        var months = ["MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR"];
        for (var i = 0; i < months.length; i++) {
            var monthtotal = 0;
            for (var j = 0; j < tableassignedobj.length; j++) {
                if (tableassignedobj[j][months[i]] != null) {
                    monthtotal = monthtotal + parseFloat(tableassignedobj[j][months[i]]);
                }
            }
            ths[i + 29].innerHTML = monthtotal.toFixed(2);
        }
    }

    function loadunassignedamount() {
        $http({
            method: 'GET',
            url: '../Assignments/getunassignedremaining',
            params: { "intFisYear": defaultFisYear, "strTeam": jSuite_Teams.getValue() }
        }).then(function (response) {
            $scope.UnassignedRemaining = response.data;
            update_supply_sum(response.data);
            if (newWindow && !newWindow.closed) {
                setTimeout(function () {
                    $scope.$apply(function () {
                        var newWindowContent = document.getElementById('divUnAssignment').innerHTML;
                        newWindow.document.getElementsByTagName('body')[0].innerHTML = '';
                        newWindow.document.getElementsByTagName('body')[0].innerHTML = newWindowContent;
                    });
                }, 1000);
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

    $scope.updatemasteritem = function () {

        var projectID = $scope.modelAssignProjectID;
        var wbsNumber = $scope.modelAssignWBSNumber;

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
        else {

            updateprogressbar(10, "saving changes...");
            $http({
                method: 'POST',
                url: '../Assignments/insert_Assignment',
                params: { "intProjectID": projectID, "strWBSNumber": wbsNumber, "strTeam": dropAssignTeam, "strRequiredSkills": dropRequiredSkills, "strResourcename": dropAssignResource, "defaultYear": defaultFisYear }
            }).then(function (response) {

                $http({
                    method: 'GET',
                    url: '../Assignments/getassignmentdata',
                    params: { "intFisYear": defaultFisYear, "strTeam": jSuite_Teams.getValue() }
                }).then(function (response) {
                    var sourcedata = response.data;
                    var stringModelName = $scope.modelName;
                    var dsAssignments = sourcedata.filter(a => a.WBSNumber == wbsNumber && a.ProjectID == projectID);
                    window[stringModelName].setData(dsAssignments);

                    $http({
                        method: 'GET',
                        url: '../Assignments/getResourceList',
                        params: { "strTeam": jSuite_Teams.getValue(), "intFisYear": defaultFisYear }
                    }).then(function (response) {
                        dsResourceList = response.data;
                    }, function (error) {
                        console.log(error);
                    });

                    onSkillChange();                    

                }, function (error) {
                    console.log(error);
                });

            }, function (error) {
                console.log(error);
            });

        }

    }

    function onSkillChange() {

        var jexcelID = localStorage.getItem("temp_skillID")
        var items = window[jexcelID].getJson(false);
        var dropRSValue = jSuite_dropRequiredSkills.getValue();
        var itemresourceData = items.filter(x => x.RequiredSkill == dropRSValue);

        $http({
            method: 'GET',
            url: '../Assignments/getResourceList',
            params: { "strTeam": jSuite_Teams.getValue(), "intFisYear": defaultFisYear }
        }).then(function (response) {
            dsResourceList = response.data;            
        }, function (error) {
            console.log(error);
        });
                
        uniqueresource = dsResourceList;
        var resource_lookup = {};
        var resource_result = [];

        for (var item, j = 0; item = itemresourceData[j++];) {
            var resource_name = item.ResourceName;
            if (!(resource_name in resource_lookup)) {
                resource_lookup[resource_name] = 1;
                if (resource_name.length > 0) {
                    resource_result.push(resource_name);
                }                
            }
        }
                
        for (var i = 0; i < resource_result.length; i++) {
            uniqueresource.splice(uniqueresource.indexOf(resource_result[i]), 1);
        }

        document.getElementById('dropAssignResources').innerHTML = "";
        jSuite_dropAssignResources = jSuites.dropdown(document.getElementById('dropAssignResources'), {
            data: uniqueresource,
            autocomplete: true,
            lazyLoading: false,
            multiple: false,
            placeholder: "Select Resource",
            width: '100%'
        });

        clearmessage();

    }

    function newprojectcategory() {

        var myid = 'jexcel' + this.id.replace('btn_', '');
        localStorage.setItem("temp_skillID", myid);
        var items = window[myid].getJson(false);

        savesource = JSON.parse(localStorage.getItem("save_status"));
        if (savesource.saveitems.find(x => x.fid === this.id.replace('btn_', ''))) {
            showalertsavechangesalert('Please save the changes!');
        }
        else {

            $scope.modelAssignProjectID = items[0].ProjectID;
            $scope.modelAssignWBSNumber = items[0].WBSNumber;
            $scope.modelName = myid;

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
                value: teamresult[0],
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
                value: requiredskillsresult[0],
                placeholder: "Select Required Skills",
                onchange: onSkillChange,
                width: '100%'
            });

            onSkillChange();
        }
    }

    function clearmessage() {
        document.getElementById('success').style.display = 'none';
        document.getElementById('error').style.display = 'none';
    }

    function removemasterhandler() {
        document.getElementById('masterhandler').style.display = 'none'
    }

    $scope.viewUnAssignment = function () {
        //checks to see if window is open
        if (newWindow && !newWindow.closed) {
            loadunassignedamount();
            newWindow.focus(); //If already Open Set focus
        }
        else {
            var newWindowContent = document.getElementById('divUnAssignment').innerHTML;
            newWindow = $window.open("", "", "width=1200,height=300");
            newWindow.document.write('<html><head><title>Unassigned Remaining</title><link href="../assets/css/proforma.css?ID=94000" rel="stylesheet" /></head><body>');
            newWindow.document.write(newWindowContent);
            newWindow.document.write('</body></html>');
        }
    }

    $scope.testmethod = function () {
        newWindow.document.getElementsByTagName('body')[0].innerHTML = '';
        newWindow.document.getElementsByTagName('body')[0].innerHTML = '<h1>Test request</h1>'
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

    $scope.saveallchanges = function () {

        updateprogressbar(10, "Saving Changes...");
        var instanceIDs = JSON.parse(localStorage.getItem("save_status"));
        for (var i = 0; i < instanceIDs.saveitems.length; i++) {
            var instanceID = instanceIDs.saveitems[i].fid;
            document.getElementById("btn_save_" + instanceID).style.display = "none";
            document.getElementById("btn_discardchanges_" + instanceID).style.display = "none";

            var items = window['jexcel' + instanceID].getJson(false);
            var data = {
                update: items
            };

            $http({
                method: 'POST',
                url: '../Assignments/saveassignmentdata',
                data: data
            }).then(function (response) {                
                
            }, function (error) {
                console.log(error);
            });
                        
            if ((i + 1) == instanceIDs.saveitems.length) {
                loadunassignedamount();
                refreshsum();
                savesource = { saveitems: [] };
                localStorage.setItem("save_status", JSON.stringify(savesource));
                updateprogressbar(100, "Completed...");
                document.getElementById('saveallchanges').style.display = "none";
                document.getElementById('discardallchanges').style.display = "none";
                formSubmitting = true;
            }
        }
    }

    $scope.discardallchanges = function () {

        updateprogressbar(10, "Saving Changes...");
        $http({
            method: 'GET',
            url: '../Assignments/getassignmentdata',
            params: { "intFisYear": defaultFisYear, "strTeam": jSuite_Teams.getValue() }
        }).then(function (response) {
            var sourcedata = response.data;

            var instanceIDs = JSON.parse(localStorage.getItem("save_status"));
            for (var i = 0; i < instanceIDs.saveitems.length; i++) {
                var instanceID = instanceIDs.saveitems[i].fid;
                var items = window['jexcel' + instanceID].getJson(false);
                var WBSNumber = items[0].WBSNumber;
                var ProjectID = items[0].ProjectID;   
                var res = instanceID.split("_");
                var tempSourceData = sourcedata; 
                var dsAssignments = tempSourceData.filter(a => a.WBSNumber == WBSNumber && a.ProjectID == ProjectID);
                window['jexcel' + instanceID].setData(dsAssignments);
                
                refreshDelta_AfterDelete(dsAssignments, res[1])
                if ((i + 1) == instanceIDs.saveitems.length) {
                    loadunassignedamount();
                    refreshsum();
                    savesource = { saveitems: [] };
                    localStorage.setItem("save_status", JSON.stringify(savesource));
                    updateprogressbar(100, "Completed...");
                    document.getElementById('saveallchanges').style.display = "none";
                    document.getElementById('discardallchanges').style.display = "none";
                    formSubmitting = true;
                }
            }

        }, function (error) {
            console.log(error);
        });

    }

    function discardchanges() {

        document.getElementById(this.id).style.display = "none";
        var myid = 'jexcel' + this.id.replace('btn_discardchanges_', '');
        var items = window[myid].getJson(false);
        var WBSNumber = items[0].WBSNumber;
        var ProjectID = items[0].ProjectID;
        var res = this.id.split("_");
        var instanceID = this.id.replace('btn_discardchanges_', '');
        $http({
            method: 'GET',
            url: '../Assignments/getassignmentdata',
            params: { "intFisYear": defaultFisYear, "strTeam": jSuite_Teams.getValue() }
        }).then(function (response) {
            var sourcedata = response.data;
            var dsAssignments = sourcedata.filter(a => a.WBSNumber == WBSNumber && a.ProjectID == ProjectID);
            window[myid].setData(dsAssignments);
            refreshDelta_AfterDelete(dsAssignments, res[3])
            savesource = JSON.parse(localStorage.getItem("save_status"));
            if (savesource != null) {
                if (savesource.saveitems.find(x => x.fid === instanceID)) {
                    const index = savesource.saveitems.findIndex(c => c.fid === instanceID);
                    savesource.saveitems.splice(index, 1);
                    if (savesource.saveitems.length == 0) {
                        formSubmitting = true;
                        document.getElementById('saveallchanges').style.display = "none";
                        document.getElementById('discardallchanges').style.display = "none";
                    }
                    localStorage.setItem("save_status", JSON.stringify(savesource));
                }
            }
            else {
                formSubmitting = true;
                document.getElementById('saveallchanges').style.display = "none";
                document.getElementById('discardallchanges').style.display = "none";
            }

        }, function (error) {
            console.log(error);
        });
    }

    function savechanges() {

        updateprogressbar(10, "Saving Changes...");
        document.getElementById(this.id).style.display = "none";
        document.getElementById(this.id.replace("btn_save_", "btn_discardchanges_")).style.display = "none";

        var instanceID = this.id.replace('btn_save_', '');
        var myid = 'jexcel' + this.id.replace('btn_save_', '');
        var items = window[myid].getJson(false);

        var data = {
            update: items
        };

        $http({
            method: 'POST',
            url: '../Assignments/saveassignmentdata',
            data: data
        }).then(function (response) {
            loadunassignedamount();
            refreshsum();

            savesource = JSON.parse(localStorage.getItem("save_status"));
            if (savesource != null) {
                if (savesource.saveitems.find(x => x.fid == instanceID)) {
                    const index = savesource.saveitems.findIndex(c => c.fid == instanceID);
                    savesource.saveitems.splice(index, 1);
                    if (savesource.saveitems.length == 0) {
                        formSubmitting = true;
                        document.getElementById('saveallchanges').style.display = "none";
                        document.getElementById('discardallchanges').style.display = "none";
                    }
                    localStorage.setItem("save_status", JSON.stringify(savesource));
                }
            }
            else {
                formSubmitting = true;
                document.getElementById('saveallchanges').style.display = "none";
                document.getElementById('discardallchanges').style.display = "none";
            }

        }, function (error) {
            console.log(error);
        });
    }

    function refreshsum() {
        $http({
            method: 'GET',
            url: '../Assignments/getassignmentdata',
            params: { "intFisYear": defaultFisYear, "strTeam": jSuite_Teams.getValue() }
        }).then(function (response) {
            update_demand_sum(response.data);
            update_assigned_sum(response.data);

            $http({
                method: 'GET',
                url: '../Assignments/getAssignlivemainview',
                params: { "intFisYear": defaultFisYear, "strTeam": jSuite_Teams.getValue() }
            }).then(function (response) {
                updateUnassignedSum(response.data);
                updateprogressbar(100, "Completed...");
            }, function (error) {
                console.log(error);
            });

        }, function (error) {
            console.log(error);
        });
    }

    $scope.expandde = function () {
        if (formSubmitting == false) {
            showalertsavechangesalert('It looks like you have been editing something, so please savechanges!');
        }
    }

    function loadAssignmentTable(item) {

        document.getElementById(item).innerHTML = "";
        var loaded = function () {
            var datavalues = document.getElementById(item).getElementsByTagName("thead");
            var newsubchilditem = datavalues[0].firstChild.getElementsByTagName("td");
            newsubchilditem[4].innerHTML = "Project <button title='Add New Assignment' ID='btn_" + item + "' style='z-index: 99999;' class='btn btn-success btn-sm pull-right additem'><i class='fa fa-plus-circle' aria-hidden='true'></i></button> <button title='Save Changes' ID='btn_save_" + item + "' style='z-index: 99999; display:none; margin-right: 5px;' class='btn btn-primary btn-sm pull-right additem'><i class='fa fa fa-floppy-o' aria-hidden='true'></i></button> <button title='Discard Changes' ID='btn_discardchanges_" + item + "' style='z-index: 99999; display:none; margin-right: 5px;' class='btn btn-danger btn-sm pull-right additem'><i class='fa fa-undo' aria-hidden='true'></i></button>";
            document.getElementById('btn_' + item).onclick = newprojectcategory;
            document.getElementById('btn_save_' + item).onclick = savechanges;
            document.getElementById('btn_discardchanges_' + item).onclick = discardchanges;
            document.getElementById('removehandler').onclick = removemasterhandler;
            updateprogressbar(100, "Completed...");
        }

        var update = function (instance, cell, col, row, value) {

            var instanceID = instance.getAttribute('id');

            var data = instance.jexcel.getJson(false);
            var dsAssigned = data.filter(x => x.RequestType == 'Assigned')
            var dsDemand = data.filter(x => x.RequestType == 'Demand')

            var f1 = 0;
            var columnname = "";
            for (let x in dsDemand[0]) {
                if (f1 == col) {
                    columnname = x;
                }
                f1 = f1 + 1;
            }

            var intAssigned = 0;
            var ProjectID = data[0]["ProjectID"];
            var wbsNumber = data[0]["WBSNumber"].replace(/[^a-zA-Z0-9]/g, "");
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
            document.getElementById(ProjectID + '_' + wbsNumber + '_' + col + '_' + res[1]).innerHTML = (intDemand - intAssigned).toFixed(2);

            if ((intDemand - intAssigned) == 0) {
                backgroundcolor = "#83ce83";
                bordercolor = "#76bb76";
                color = "#fff";
            }
            else if ((intDemand - intAssigned) >= 1) {
                backgroundcolor = "#b3d9ff";
                bordercolor = "#99ccff";
                color = "#212529";
            }
            else if ((intDemand - intAssigned) < 0) {
                backgroundcolor = "#be2fd8";
                bordercolor = "#b110d0";
                color = "#fff";
            }
            else if ((intDemand - intAssigned) < 1 && (intDemand - intAssigned) > 0) {
                backgroundcolor = "#ff99c2";
                bordercolor = "#ff80b3";
                color = "#212529";
            }

            document.getElementById(ProjectID + '_' + wbsNumber + '_' + col + '_' + res[1]).setAttribute("style", "color:" + color + ";background-color: " + backgroundcolor + "; border: 0.5px solid " + bordercolor + ";text-align: right;");
            document.getElementById('btn_save_' + item).style.display = "block";
            document.getElementById('btn_discardchanges_' + item).style.display = "block";
            document.getElementById('saveallchanges').style.display = "block";
            document.getElementById('discardallchanges').style.display = "block";
            setFormSubmitting();

            savesource = JSON.parse(localStorage.getItem("save_status"));
            if (savesource != null) {
                if (savesource.saveitems.find(x => x.fid === instanceID)) {
                    const index = savesource.saveitems.findIndex(c => c.fid === instanceID);
                    savesource.saveitems.splice(index, 1)
                    localStorage.setItem("save_status", JSON.stringify(savesource));
                }
            }
            savesource.saveitems.push({ "fid": instanceID });
            localStorage.setItem("save_status", JSON.stringify(savesource));

        }

        window['jexcel' + item] = jexcel(document.getElementById(item), {
            data: dsAssignments,
            search: false,
            tableOverflow: true,
            onload: loaded,
            filters: false,
            onchange: update,
            allowManualInsertRow: false,
            columns: [
                { type: 'hidden', title: 'ID' },
                { type: 'hidden', title: 'ProjectID' },
                { type: 'hidden', title: 'WBSNumber' },
                { type: 'text', readOnly: true, title: 'Project', width: ((tablewidth - 1050) / 4) + 30 },
                { type: 'text', readOnly: true, title: 'Team', width: ((tablewidth - 1050) / 4) - 30 },
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

                if (col == 0) {

                    var intProjectID = instance.jexcel.getValue('B' + parseInt(row + 1))
                    var strTeam = instance.jexcel.getValue('E' + parseInt(row + 1))
                    var strRequiredSkills = instance.jexcel.getValue('F' + parseInt(row + 1))

                    if (val > 0) {
                        var filtered = assign_comments.filter(a => a.MasterID == val);
                        if (filtered.length > 0) {
                            for (var k = 0; k < filtered.length; k++) {
                                instance.jexcel.setComments([parseInt(filtered[k].ColumnID), row], filtered[k].Comments);
                            }
                        }                        
                    }
                    else {
                        var filtered = assign_comments.filter(a => a.ProjectID == intProjectID && a.MasterID == 0 && a.Team == strTeam && a.RequiredSkills == strRequiredSkills);
                        if (filtered.length > 0) {
                            for (var j = 0; j < filtered.length; j++) {
                                instance.jexcel.setComments([parseInt(filtered[j].ColumnID), row], filtered[j].Comments);
                            }
                        }
                    }                    
                }
                
                var findDemandrow = instance.jexcel.getValue('T' + parseInt(row + 1))
                if (findDemandrow == 'Demand') {
                    cell.classList.add('readonly');
                }

                if (val == 'Demand') {      
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
                    instance.jexcel.setStyle('S' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                    instance.jexcel.setStyle('T' + parseInt(row + 1), 'background-color', 'rgb(245 220 144)');
                }
            },
            contextMenu: function (obj, x, y, e) {
                var items = [];
                if (x) {
                    if (obj.options.allowDeleteRow == true) {
                        items.push({
                            title: obj.options.text.deleteSelectedRows,
                            onclick: function () {
                                var rowsElement = obj.getSelectedRows();
                                for (var indexRow = 0; indexRow < rowsElement.length; indexRow++) {
                                    var displaystatus = rowsElement[indexRow].style.display;
                                    if (displaystatus == "") {
                                        var y = parseInt(rowsElement[indexRow].getAttribute("data-y"));
                                        var jsonobj = obj.getJson(false);
                                        var res = obj.el.getAttribute('id').split("_");
                                        var rowobj = jsonobj[y];
                                        if (rowobj.ID > 0) {
                                            if (confirm('Are you sure you want to delete?')) {
                                                deleterow(rowobj.ID);
                                                obj.deleteRow(y);
                                                console.log(res[1]);
                                                refreshDelta_AfterDelete(obj.getJson(false), res[1])
                                            }
                                        }
                                        else {
                                            //showalertsavechangesalert("Your not allowed to delete a demand row.")
                                        }
                                    }

                                }
                            }
                        });
                    }

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
                                    insert_assignment_comments(obj.records[y][0].innerHTML, x, comment, obj.records[y][4].innerHTML, obj.records[y][5].innerHTML, obj.records[y][1].innerHTML)
                                    obj.setComments([x, y], comment);
                                }
                            }
                        });

                        if (title != obj.records[y][x].innerHTML && title != "") {
                            items.push({
                                title: obj.options.text.clearComments,
                                onclick: function () {
                                    delete_assign_comments(obj.records[y][0].innerHTML, x, obj.records[y][4].innerHTML, obj.records[y][5].innerHTML, obj.records[y][1].innerHTML);
                                    obj.setComments([x, y], '');
                                    obj.records[y][x].title = obj.records[y][x].innerHTML;
                                }
                            });
                        }
                    }

                    return items;
                }
            }
        });
        window['jexcel' + item].hideIndex();
    }

    function insert_assignment_comments(MasterID, ColumnID, Comments, team, requiredskills, ProjectID) {
        updateprogressbar(50, "Updating comments...");
        $http({
            method: 'POST',
            url: '../Assignments/insert_assigncomments',
            params: {
                "intProjectID": ProjectID, "intMasterID": MasterID, "intColumnID": ColumnID, "strTeam": team, "strRequiredSkills": requiredskills, "strComments": Comments, "userid": localStorage.getItem("userID") }
        }).then(function (response) {
            update_assign_comments();
            updateprogressbar(100, "Completed...");
        }, function (error) {
            console.log(error);
        });
    }

    function delete_assign_comments(MasterID, ColumnID, team, requiredskills, ProjectID) {
        updateprogressbar(50, "Updating comments...");
        $http({
            method: 'POST',
            url: '../Assignments/delete_assigncomments',
            params: { "intMasterID": MasterID, "intColumnID": ColumnID, "intColumnID": ColumnID, "strTeam": team, "strRequiredSkills": requiredskills, "intProjectID": ProjectID }
        }).then(function (response) {
            update_assign_comments();
            updateprogressbar(100, "Completed...");
        }, function (error) {
            console.log(error);
        });
    }

    function update_assign_comments() {
        $http({
            method: 'GET',
            url: '../Assignments/getAssignComments',
            params: { "strTeams": jSuite_Teams.getValue() }
        }).then(function (response) {
            assign_comments = response.data;
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

    function deleterow(id) {
        updateprogressbar(20, "Deleting...");
        $http({
            method: 'POST',
            url: '../Assignments/delete_assignment',
            params: { "intID": id }
        }).then(function (response) {
            updateprogressbar(100, "Deleting...");
            loadunassignedamount();
        }, function (error) {
            console.log(error);
        });
    }

    $scope.expandAll = function (expanded) {
        $scope.$broadcast('onExpandAll', { expanded: expanded });
    };

    function refreshDelta_AfterDelete(objAssignData, res) {
        var ProjectID = objAssignData[0]["ProjectID"];
        var WBSNumber = objAssignData[0]["WBSNumber"].replace(/[^a-zA-Z0-9]/g, "");
        var dsAssigned = objAssignData.filter(x => x.RequestType == 'Assigned')
        var dsDemand = objAssignData.filter(x => x.RequestType == 'Demand')
        var months = ["MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR"];

        var f1 = 0;
        for (let x in dsDemand[0]) {
            if (months.includes(x)) {

                var intAssigned = 0;
                for (var i = 0; i < dsAssigned.length; i++) {
                    if (dsAssigned[i][x] != null) {
                        intAssigned = intAssigned + parseFloat(dsAssigned[i][x]);
                    }
                }
                intAssigned = intAssigned.toFixed(2)

                var intDemand = 0;
                for (var i = 0; i < dsDemand.length; i++) {
                    if (dsDemand[i][x] != null) {
                        intDemand = intDemand + parseFloat(dsDemand[i][x]);
                    }
                }
                intDemand = intDemand.toFixed(2)
                document.getElementById(ProjectID + '_' + WBSNumber + '_' + f1 + '_' + res).innerHTML = (intDemand - intAssigned).toFixed(2);


                if ((intDemand - intAssigned) == 0) {
                    backgroundcolor = "#83ce83";
                    bordercolor = "#76bb76";
                    color = "#fff";
                }
                else if ((intDemand - intAssigned) >= 1) {
                    backgroundcolor = "#b3d9ff";
                    bordercolor = "#99ccff";
                    color = "#212529";
                }
                else if ((intDemand - intAssigned) < 0) {
                    backgroundcolor = "#be2fd8";
                    bordercolor = "#b110d0";
                    color = "#fff";
                }
                else if ((intDemand - intAssigned) < 1 && (intDemand - intAssigned) > 0) {
                    backgroundcolor = "#ff99c2";
                    bordercolor = "#ff80b3";
                    color = "#212529";
                }

                document.getElementById(ProjectID + '_' + WBSNumber + '_' + f1 + '_' + res).setAttribute("style", "color:" + color + "; background-color: " + backgroundcolor + "; border: 0.5px solid " + bordercolor + ";text-align: right;");
            }
            f1 = f1 + 1;
        }
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

app.filter('removeDot', [
    '$filter',
    function ($filter) {

        function removeDot(input) {

            if (input == null) {
                return '';
            }
            else {
                return input.replace(/[^a-zA-Z0-9]/g, "");
            }

        }
        return removeDot;
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