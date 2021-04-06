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



    function updateprogressbar(value, item) {
        document.getElementById('progressBarText').innerHTML = item;
        document.getElementById('progressbar').style.display = 'block'
        progressbarstyle = document.getElementsByClassName('progress-bar progress-bar-striped progress-bar-animated');
        pstyle = "width: " + value + "%";
        progressbarstyle[0].setAttribute("style", pstyle)
    }

    $scope.btnresetSnapshotData = function () {
        document.getElementById('textFisYear').value = "";
        jSuite_dropTitle.setValue("");
        document.getElementById('textCalender').value = "";
        $scope.addsnapshot = true;
        $scope.updatesnapshot = false;
    }

    $scope.btnInsertSnapshotData = function () {
        var textFisYearData = document.getElementById('textFisYear').value;
        var dropTitle = jSuite_dropTitle.getText();
        var textCalenderData = document.getElementById('textCalender').value;

        if (textFisYearData == "" || textFisYearData == undefined) {
            showalert('Please enter fisyear!');
        }
        else if (dropTitle == "" || dropTitle == undefined) {
            showalert('Please select title!');
        }
        else if (textCalenderData == "" || textCalenderData == undefined) {
            showalert('Please select date!');
        }
        else {
            insertSnapshotdata(textFisYearData, dropTitle, textCalenderData);
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

    $scope.editsnapshot = function (fisyear, title, calender, sysid) {

        $scope.addsnapshot = false;
        $scope.updatesnapshot = true;
        localStorage.setItem("snapshotID", sysid);
        const now = new Date(calender);
        document.getElementById('textFisYear').value = fisyear;
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
        var dropTitle = jSuite_dropTitle.getText();
        var textCalenderData = document.getElementById('textCalender').value;

        if (textFisYearData == "" || textFisYearData == undefined) {
            showalert('Please enter fisyear!');
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
                params: { "intFisYear": textFisYearData, "strTitle": dropTitle, "strDate": textCalenderData, "intsysid": localStorage.getItem("snapshotID") }
            }).then(function (response) {
                loadmaster_snapshot();
                updateprogressbar(100, "Snapshot creation has been done...");
                document.getElementById('progressbar').style.display = 'none';
            }, function (error) {
                console.log(error);
            });

        }
    }

    function insertSnapshotdata(FisYear, Title, Date) {
        updateprogressbar(50, "Updating Snapshot...");
        $http({
            method: 'POST',
            url: '../Config_Snapshot/insert_snapshot',
            params: { "intFisYear": FisYear, "strTitle": Title, "strDate": Date }
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