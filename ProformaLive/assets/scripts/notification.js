﻿var app = angular.module('MECC', []);
app.controller('notificationController', function ($scope, $http, $q) {

    var myEditor;
    loadmastersettings();   
    getusername();
    getcompletelist();

    CKEDITOR.replace('editor1', {
        filebrowserImageUploadUrl: '/notification/UploadImage'
    });    

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

    $scope.updat_notification = function () {

        var content = CKEDITOR.instances['editor1'].getData();
        var notificationdata = btoa(content);
        var notificationTitle = $scope.notificationTitle;

        var status = $scope.displaycheckbox_resource;
        var stringStatus = "Active";
        if (status == true) {
            stringStatus = "Active";
        }
        else {
            stringStatus = "InActive";
        }

        var data = {
            intID: $scope.notificationid,
            strTitle: notificationTitle,
            strNotificationdata: notificationdata,
            strUser: localStorage.getItem("userID"),
            stringStatus: stringStatus
        };

        if (notificationTitle != "" && notificationTitle != undefined) {
            $http({
                method: 'POST',
                url: '../notification/update_notification',
                data: data,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response) {
                getcompletelist();                
            }, function (error) {
                console.log(error);
            });
        }
        else {
            showalert('Please enter notification title!');
        }

    }

    $scope.validatecheckbox = function () {
        var value = $scope.displaycheckbox_resource;
        if (value == true) {
            $scope.display_resourceform = true;
        }
        else {
            $scope.display_resourceform = false;
        }
    }
    
    function getcompletelist() {
        $http({
            method: 'GET',
            url: '../notification/get_completenotification'
        }).then(function (response) {
            $scope.notificationList = response.data;            
            $scope.notificationid = 0;
            $scope.notificationTitle = "";
            CKEDITOR.instances['editor1'].setData("");
            document.getElementById('mainbody').style.display = 'block';
            document.getElementById('progressbar').style.display = 'none';
            $scope.displaycheckbox_resource = false;
        }, function (error) {
            console.log(error);
        });
    }

    $scope.editnotification = function (item) {

        $scope.notificationid = item.Sysid;
        $scope.notificationTitle = item.Title;
        var encodenotification = atob(item.Data);
        CKEDITOR.instances['editor1'].setData(encodenotification);
        debugger
        if (item.Status == "Active") {
            $scope.displaycheckbox_resource = true;
        }
        else {
            $scope.displaycheckbox_resource = false;
        }
    }

    $scope.deletenotification = function (item) {
       
        $http({
            method: 'POST',
            url: '../notification/delete_notification',
            params: { "intID": item.Sysid }
        }).then(function (response) {            
            getcompletelist();
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

        var panelheight = parseInt(window.innerHeight);
        panelheight = panelheight - 100;
        document.getElementById('notificationbody').setAttribute('style', 'height: ' + panelheight + 'px;');

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

    function updateprogressbar(value, item) {
        document.getElementById('progressBarText').innerHTML = item;
        document.getElementById('progressbar').style.display = 'block'
        progressbarstyle = document.getElementsByClassName('progress-bar progress-bar-striped progress-bar-animated');
        pstyle = "width: " + value + "%";
        progressbarstyle[0].setAttribute("style", pstyle)
    }

});