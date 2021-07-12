var app = angular.module('MECC', []);
app.controller('Master_SnapshotController', function ($scope, $http) {

    getusername();
    loadmastersettings();
    getcompletelistofnotification();
    updateprogressbar(20, "Page is loading...");
    localStorage.setItem("CurrentPage", 3);
    loadmaster_snapshot();
    gettitle();
    var jSuite_dropTitle = [];
    $scope.addsnapshot = true;
    $scope.updatesnapshot = false;

    document.getElementById("masterHelpCenter").addEventListener("click", loadhelpdesk);
    function loadhelpdesk() {
        document.getElementById('helpcenter').style.display = 'block';
        dragElement(document.getElementById("helpcenter"));
        $scope.getcompletelist();
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

    function updateprogressbar(value, item) {
        document.getElementById('progressBarText').innerHTML = item;
        document.getElementById('progressbar').style.display = 'block'
        progressbarstyle = document.getElementsByClassName('progress-bar progress-bar-striped progress-bar-animated');
        pstyle = "width: " + value + "%";
        progressbarstyle[0].setAttribute("style", pstyle)
    }

    $scope.btnresetSnapshotData = function () {
        document.getElementById('textFisYear').value = "";
        document.getElementById('textDesc').value = "";
        jSuite_dropTitle.setValue("");
        document.getElementById('textCalender').value = "";
        $scope.addsnapshot = true;
        $scope.updatesnapshot = false;
    }

    $scope.btnInsertSnapshotData = function () {
        var textFisYearData = document.getElementById('textFisYear').value;
        var textDescData = document.getElementById('textDesc').value;
        var dropTitle = jSuite_dropTitle.getText();
        var textCalenderData = document.getElementById('textCalender').value;

        if (textFisYearData == "" || textFisYearData == undefined) {
            showalert('Please enter fisyear!');
        }
        else if (textDescData == "" || textDescData == undefined) {
            showalert('Please enter description!');
        }
        else if (dropTitle == "" || dropTitle == undefined) {
            showalert('Please select title!');
        }
        else if (textCalenderData == "" || textCalenderData == undefined) {
            showalert('Please select date!');
        }
        else {
            insertSnapshotdata(textFisYearData, dropTitle, textDescData, textCalenderData);
            document.getElementById('textFisYear').value = "";
            jSuite_dropTitle.setValue("");
            document.getElementById('textCalender').value = "";
        }
    }

    $scope.deletesnapshot = function (sysid) {
        var result = confirm("Want to delete?");
        if (result) {
            $http({
                method: 'POST',
                url: '../Config_Snapshot/deletesnapshot',
                params: { "intsysid": sysid }
            }).then(function (response) {
                loadmaster_snapshot();
            }, function (error) {
                console.log(error);
            });
        }        
    }

    $scope.editsnapshot = function (fisyear, title, desc , calender, sysid) {

        $scope.addsnapshot = false;
        $scope.updatesnapshot = true;
        localStorage.setItem("snapshotID", sysid);
        const now = new Date(calender);
        document.getElementById('textFisYear').value = fisyear;
        document.getElementById('textDesc').value = desc;
        jSuite_dropTitle.setValue(title);
        document.getElementById('textCalender').value = now.getFullYear() + '-' + ((now.getMonth() > 8) ? (now.getMonth() + 1) : ('0' + (now.getMonth() + 1))) + '-' + ((now.getDate() > 9) ? now.getDate() : ('0' + now.getDate()));
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

    $scope.refresh = function (date, sysid) {
        updateprogressbar(50, "Updating Snapshot...");
        $http({
            method: 'POST',
            url: '../Config_Snapshot/updatesnapshot',
            params: { "snapshotdate": date, "Master_SnapshotID": sysid }
        }).then(function (response) {
            loadmaster_snapshot();
            updateprogressbar(100, "Snapshot creation has been done...");
            document.getElementById('progressbar').style.display = 'none';
        }, function (error) {
            console.log(error);
        });
    }

    $scope.updatesnapshotdata = function () {

        var textFisYearData = document.getElementById('textFisYear').value;
        var textDescData = document.getElementById('textDesc').value;
        var dropTitle = jSuite_dropTitle.getText();
        var textCalenderData = document.getElementById('textCalender').value;

        if (textFisYearData == "" || textFisYearData == undefined) {
            showalert('Please enter fisyear!');
        }
        else if (textDescData == "" || textDescData == undefined) {
            showalert('Please enter description!');
        }
        else if (dropTitle == "" || dropTitle == undefined) {
            showalert('Please select title!');
        }
        else if (textCalenderData == "" || textCalenderData == undefined) {
            showalert('Please select date!');
        }
        else {

            updateprogressbar(50, "Updating Snapshot...");
            $http({
                method: 'POST',
                url: '../Config_Snapshot/update_snapshot',
                params: {
                    "intFisYear": textFisYearData, "strTitle": dropTitle, "strDesc": textDescData,  "strDate": textCalenderData, "intsysid": localStorage.getItem("snapshotID") }
            }).then(function (response) {
                loadmaster_snapshot();
                updateprogressbar(100, "Snapshot creation has been done...");
                document.getElementById('progressbar').style.display = 'none';
            }, function (error) {
                console.log(error);
            });

        }
    }

    function insertSnapshotdata(FisYear, Title, Desc, Date) {
        updateprogressbar(50, "Updating Snapshot...");
        $http({
            method: 'POST',
            url: '../Config_Snapshot/insert_snapshot',
            params: {
                "intFisYear": FisYear, "strTitle": Title, "strDesc": Desc, "strDate": Date }
        }).then(function (response) {
            loadmaster_snapshot();
            updateprogressbar(100, "Snapshot creation has been done...");
            document.getElementById('progressbar').style.display = 'none';
        }, function (error) {
            console.log(error);
        });
    }

    function gettitle() {
        $http({
            method: 'GET',
            url: '../Config_Snapshot/get_snapshottitle'
        }).then(function (response) {
            var title = response.data;

            document.getElementById('drop_title').innerHTML = '';
            jSuite_dropTitle = jSuites.dropdown(document.getElementById('drop_title'), {
                data: title,
                autocomplete: true,
                placeholder: "Select Title",
                lazyLoading: false,
                multiple: false,
                width: '100%'
            });
        }, function (error) {
            console.log(error);
        });
    }



    function loadmaster_snapshot() {

        $http({
            method: 'GET',
            url: '../Config_Snapshot/get_snapshotdata'
        }).then(function (response) {

            $scope.master_snapshot = response.data;
            updateprogressbar(100, "Page is loading....");
            document.getElementById('progressbar').style.display = 'none';
            document.getElementById('mainbody').style.display = 'block';

        }, function (error) {
            console.log(error);
        });

    }

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

});