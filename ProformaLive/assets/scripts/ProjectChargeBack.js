var app = angular.module('MECC', []);
app.controller('ProjectChargeBackController', function ($scope, $http) {

    var PCBack = [];
    var ProjectChargeBack = [];
    var mainwidth = window.innerWidth;
    var columnwidth = mainwidth - 628;
    mainwidth = (mainwidth - 62) + "px";

    var mainheight = window.innerHeight;
    mainheight = (mainheight - 170) + "px";
    updateprogressbar(20, "Page is loading...");
    localStorage.setItem("CurrentPage", 3);

    var updatedInfo = [];
    var deleteInfo = [];
    var formSubmitting = null;

    var s_startvalue = 0;
    var s_endvalue = 0;
    ProjectChargeBackController();
    getusername();
    loadmastersettings();

    document.getElementById("masterHelpCenter").addEventListener("click", loadhelpdesk);
    function loadhelpdesk() {
        document.getElementById('helpcenter').style.display = 'block';
        dragElement(document.getElementById("helpcenter"));
        $scope.getcompletelist();
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

    $scope.closepopup = function (value) {
        document.getElementById(value).style.display = 'none';
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

    function loadmastersettings() {

        var usertype = localStorage.getItem("isAdmin");
        document.getElementById("menudashboard").setAttribute("class", "nav-item");
        document.getElementById("menuresource").setAttribute("class", "nav-item");
        document.getElementById("menuassignments").setAttribute("class", "nav-item");
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

    function ProjectChargeBackController() {
        $http({
            method: 'GET',
            url: '../ProjectChargeBack/getProjectChargeBack'
        }).then(function (response) {
            if (response.data.responseCode === 200) {
                ProjectChargeBack = response.data.Message;
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

    $scope.updatefilters = function () {
        var filters = PCBack.filters.map(function (arr) { if (arr == null) { return null; } else { return arr.slice(); } });
        for (var i = 0; i < filters.length; i++) {
            if (filters[i] != null) {
                var filtersinfo = PCBack.filter.children[i + 1].innerHTML;
                console.log(filters[i]);
                localStorage.setItem("PC_filterkey", i);
                localStorage.setItem("PC_filtervalue", filtersinfo);
            }
        }
    }

    $scope.export_projectchargeback = function () {

        var currentdate = new Date();
        currentdate = currentdate.getDate() + "-" + currentdate.getMonth() + "-" + currentdate.getFullYear() + "_" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        var sheetname = {
            sheetid: 'ProjectChargeBack'
        };

        var ExcelName = "ProjectChargeBack List-" + currentdate + ".xlsx";
        alasql('SELECT [Sysid], [MidOrg],[Status]  INTO XLSX(?,?) FROM ?', [ExcelName, sheetname, ProjectChargeBack]);

    }

    function updateprogressbar(value, item) {
        document.getElementById('progressBarText').innerHTML = item;
        document.getElementById('progressbar').style.display = 'block'
        progressbarstyle = document.getElementsByClassName('progress-bar progress-bar-striped progress-bar-animated');
        pstyle = "width: " + value + "%";
        progressbarstyle[0].setAttribute("style", pstyle)
    }

    function loadProjectTable() {

        var loaded = function (instance) {
            //var datavalues = document.getElementById("spreadsheetProjectChargeBack").getElementsByTagName("thead");
            //console.log(datavalues);
            //var subchilditem = datavalues[0].lastChild.getElementsByTagName("td");
            //subchilditem[1].style = "display:none";
        }

        var selectionActive = function (instance, x1, y1, x2, y2, origin) {
            s_startvalue = y1;
            s_endvalue = y2;
        }

        var deletedRow = function (instance) {

            var i;
            for (i = s_startvalue; i <= s_endvalue; i++) {

                //creates json object of jexcel
                var jsonobj = PCBack.getJson(false);

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

            //creates json object of jexcel
            var jsonobj = PCBack.getJson(false);

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

            console.log(updatedInfo);
        }

        PCBack = jexcel(document.getElementById('spreadsheetProjectChargeBack'), {
            data: ProjectChargeBack,
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
                { type: 'hidden', title: 'Sysid', width: 100 },
                { type: 'text', title: 'MidOrg', width: 500 },
                { type: 'text', title: 'Site', width: columnwidth/2 },
                { type: 'text', title: 'ProjectCharging', width: columnwidth/2 },
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
        var reloadfilterinfo = localStorage.getItem("PC_filtervalue");
        var reloadfilterkey = localStorage.getItem("PC_filterkey");
        if (reloadfilterinfo != null && reloadfilterkey != null) {
            var res = reloadfilterinfo.split(";");
            res = res.map(s => s.trim());
            PCBack.filter.children[parseInt(reloadfilterkey) + 1].innerHTML = reloadfilterinfo;
            PCBack.filters[reloadfilterkey] = res;
            PCBack.closeFilter();
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
            url: '../ProjectChargeBack/submitchanges',
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