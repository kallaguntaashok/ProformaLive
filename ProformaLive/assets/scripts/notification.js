var app = angular.module('MECC', []);
app.controller('notificationController', function ($scope, $http, $q) {

    $scope.lbl_name = "Notification";
    var myEditor;
    loadmastersettings();   
    getusername();
    getcompletelist();
    getcompletelistofnotification();

    CKEDITOR.replace('editor1', {
        filebrowserImageUploadUrl: '/notification/UploadImage'
    });   
    
    $scope.loadnotificationdata = function () {
        $scope.lbl_name = "Notification";        
        getcompletelist();
    }
    $scope.loadhelpdata = function () {
        $scope.lbl_name = "Help";        
        getcompletelist();
    }

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
            stringStatus: stringStatus,
            strType: $scope.lbl_name
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
            url: '../notification/get_completenotification',
            params: { "strType": $scope.lbl_name }
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

        //var panelheight = parseInt(window.innerHeight);
        //panelheight = panelheight - 100;
        //document.getElementById('notificationbody').setAttribute('style', 'height: ' + panelheight + 'px;');

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