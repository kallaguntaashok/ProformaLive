var app = angular.module('MECC', []);
app.controller('RateCardController', function ($scope, $http) {

    var spreadsheetRateCard = [];
    var RateCarddata = [];
    var mainwidth = window.innerWidth;
    var columnwidth = mainwidth - 648;
    mainwidth = (mainwidth - 64) + "px";

    var mainheight = window.innerHeight;
    mainheight = (mainheight - 170) + "px";
    updateprogressbar(20, "Page is loading...");
    localStorage.setItem("CurrentPage", 3);

    var updatedInfo = [];
    var deleteInfo = [];
    var formSubmitting = null;

    var s_startvalue = 0;
    var s_endvalue = 0;

    RateCardProjects();
    getusername();
    loadmastersettings();

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
            document.getElementById("notificationID").innerHTML = response.data[0].Sysid;
            document.getElementById("notificationBody").innerHTML = encodenotification;
            document.getElementById('notificationpanel').style.display = 'block';
            document.getElementById("closeNotification").style.display = 'block';
            var summaryheight = parseInt(window.innerHeight);
            summaryheight = summaryheight - 270;
            document.getElementById('notificationBody').setAttribute('style', 'height: ' + (parseInt(window.innerHeight) - parseInt(110)) + 'px;');
        }, function (error) {
            console.log(error);
        });
    }
    $scope.closenotification = function () {
        document.getElementById('notificationpanel').style.display = 'none';
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

    function RateCardProjects() {
        $http({
            method: 'GET',
            url: '../RateCard/getRateCard'
        }).then(function (response) {
            if (response.data.responseCode === 200) {
                RateCarddata = response.data.Message;
                updateprogressbar(100, "Page is loading....");
                document.getElementById('progressbar').style.display = 'none';
                document.getElementById('mainbody').style.display = 'block';
                loadProjectTable();
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

    $scope.export_ratecarddata = function () {

        var currentdate = new Date();
        currentdate = currentdate.getDate() + "-" + currentdate.getMonth() + "-" + currentdate.getFullYear() + "_" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        var sheetname = {
            sheetid: 'RateCardMaster'
        };

        var ExcelName = "Rate Card List-" + currentdate + ".xlsx";
        alasql('SELECT [Sysid], [FisYear], [FisYear], [FisMonth], [MonthlyProjectLaborRate], [MidOrg]  INTO XLSX(?,?) FROM ?', [ExcelName, sheetname, RateCarddata]);

    }

    $scope.updatefilters = function () {
        var filters = spreadsheetRateCard.filters.map(function (arr) { if (arr == null) { return null; } else { return arr.slice(); } });
        for (var i = 0; i < filters.length; i++) {
            if (filters[i] != null) {
                var filtersinfo = spreadsheetRateCard.filter.children[i + 1].innerHTML;
                console.log(filters[i]);
                localStorage.setItem("RC_filterkey", i);
                localStorage.setItem("RC_filtervalue", filtersinfo);
            }
        }
    }

    function loadProjectTable() {


        var loaded = function (instance) {
            var datavalues = document.getElementById("spreadsheetRateCard").getElementsByTagName("thead");            
            var subchilditem = datavalues[0].lastChild.getElementsByTagName("td");
            subchilditem[1].style = "display:none";
        }

        var selectionActive = function (instance, x1, y1, x2, y2, origin) {
            s_startvalue = y1;
            s_endvalue = y2;
        }

        var deletedRow = function (instance) {

            var i;
            for (i = s_startvalue; i <= s_endvalue; i++) {

                //creates json object of jexcel
                var jsonobj = spreadsheetRateCard.getJson(false);

                //getting particular row from json object       
                var rowobj = jsonobj[i]; //row id getting from event

                if (rowobj.ProjectID != "") {
                    deleteInfo.push(rowobj);
                    if (updatedInfo.find(x => x.Sysid === rowobj.Sysid)) {
                        index = updatedInfo.indexOf(updatedInfo.find(x => x.Sysid === rowobj.Sysid)); //getting index of that rec
                        updatedInfo.splice(index, 1); //remove the existing rec from object 
                    }
                }
                else {
                    //check for existance of respective rec in global object
                    if (updatedInfo.find(x => x.Sysid === rowobj.Sysid)) {
                        index = updatedInfo.indexOf(updatedInfo.find(x => x.Sysid === rowobj.Sysid)); //getting index of that rec
                        updatedInfo.splice(index, 1); //remove the existing rec from object 
                    }
                }

                document.getElementById('update_notificationnumber1').innerHTML = updatedInfo.length;
                document.getElementById('delete_notificationnumber1').innerHTML = deleteInfo.length;

                if (parseInt(updatedInfo.length) > 0) {
                    document.getElementById('notification').style.display = 'block';
                    document.getElementById('update_notificationnumber1').style.display = 'initial';
                    document.getElementById('update_notificationnumber2').style.display = 'initial';
                }
                else {
                    document.getElementById('update_notificationnumber1').style.display = 'none';
                    document.getElementById('update_notificationnumber2').style.display = 'none';
                }

                if (parseInt(deleteInfo.length) > 0) {
                    document.getElementById('notification').style.display = 'block';
                    document.getElementById('delete_notificationnumber1').style.display = 'initial';
                    document.getElementById('delete_notificationnumber2').style.display = 'initial';
                }
                else {
                    document.getElementById('delete_notificationnumber1').style.display = 'none';
                    document.getElementById('delete_notificationnumber2').style.display = 'none';
                }
            }

            setFormSubmitting();
        }

        var setFormSubmitting = function () { formSubmitting = false; };

        var update = function (instance, cell, col, row, value) {

            setFormSubmitting();

            debugger

            //creates json object of jexcel
            var jsonobj = spreadsheetRateCard.getJson(false);

            //getting particular row from json object       
            var rowobj = jsonobj[row]; //row id getting from event

            //check for existance of respective rec in global object
            if (updatedInfo.find(x => x.Sysid === rowobj.Sysid)) {
                index = updatedInfo.indexOf(updatedInfo.find(x => x.Sysid === rowobj.Sysid)); //getting index of that rec
                updatedInfo.splice(index, 1); //remove the existing rec from object 
                updatedInfo.push(rowobj); //pushing newly updated rec
            }
            else
                updatedInfo.push(rowobj); //pushing updated rec for the first time

            document.getElementById('update_notificationnumber1').innerHTML = updatedInfo.length;
            if (parseInt(updatedInfo.length) > 0) {
                document.getElementById('notification').style.display = 'block';
                document.getElementById('update_notificationnumber1').style.display = 'initial';
                document.getElementById('update_notificationnumber2').style.display = 'initial';
            }
            else {
                document.getElementById('update_notificationnumber1').style.display = 'none';
                document.getElementById('update_notificationnumber2').style.display = 'none';
            }
        }

        spreadsheetRateCard = jexcel(document.getElementById('spreadsheetRateCard'), {
            data: RateCarddata,
            tableOverflow: true,
            tableWidth: mainwidth,
            tableHeight: mainheight,
            search: true,
            filters: true,
            onload: loaded,
            onchange: update,
            onbeforedeleterow: deletedRow,
            onselection: selectionActive,
            columns: [
                { type: 'hidden', title: 'Sysid', width: 50 },
                { type: 'text', title: 'FisYear', width: 100 },
                { type: 'text', title: 'FisMonth', width: 100 },
                { type: 'text', title: 'MonthlyProjectLaborRate', width: 300 },
                { type: 'text', title: 'MidOrg', width: columnwidth },
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
                    if (obj.options.allowDeleteRow == true) {
                        items.push({ type: 'line' });
                        items.push({
                            title: obj.options.text.deleteSelectedRows,
                            onclick: function () {
                                if (confirm('Are you sure do you want to delete?'))
                                    obj.deleteRow(obj.getSelectedRows().length ? undefined : parseInt(y));
                            }
                        });
                    }
                }

                return items;
            }
        });

        //reload filter information.
        var reloadfilterinfo = localStorage.getItem("RC_filtervalue");
        var reloadfilterkey = localStorage.getItem("RC_filterkey");
        if (reloadfilterinfo != null && reloadfilterkey != null) {
            var res = reloadfilterinfo.split(";");
            res = res.map(s => s.trim());
            spreadsheetRateCard.filter.children[parseInt(reloadfilterkey) + 1].innerHTML = reloadfilterinfo;
            spreadsheetRateCard.filters[reloadfilterkey] = res;
            spreadsheetRateCard.closeFilter();
        }

    }


    $scope.savechanges = function () {

        updateprogressbar(45, "Saving changes....");

        var data = {
            update: updatedInfo,
            delete: deleteInfo
        };


        console.log(data);

        $http({
            method: 'POST',
            url: '../RateCard/submitchanges',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            updateprogressbar(100, "Saving changes....");
            document.getElementById('progressbar').style.display = 'none';
            document.getElementById('notification').style.display = 'none';
            document.getElementById('update_notificationnumber1').innerHTML = 0;
            document.getElementById('delete_notificationnumber1').innerHTML = 0;
            updatedInfo = [];
            deleteInfo = [];
            formSubmitting = true;

        }, function (error) {
            console.log(error);
        });
    }

});