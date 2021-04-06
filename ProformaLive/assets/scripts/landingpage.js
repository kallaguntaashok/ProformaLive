/*
 * PageName: ProformaLive landing page.
 * Actions:
 *      1. authenticate the users.
 *      2. validate the roles.
 *      3. display total projects, if user is valid, or else it will navigate to unAuthroized page.
 */

var app = angular.module('PLLandingPage', []);
app.controller('contorllerlanding', function ($scope, $http) {

    var jSuite_dropProjects = [];
    updateprogressbar(20, "Page is loading...");
    createuserprofile();

    jSuite_dropProjects = jSuites.dropdown(document.getElementById('dropProjects'), {
        url: '../index/getprojectlist',
        autocomplete: true,
        placeholder: "Select Project",
        lazyLoading: true,
        multiple: false,
        width: '100%',
    });

    $scope.gotodashboard = function () {

        var ID = jSuite_dropProjects.getValue();
        if (ID != "") {

            $http({
                method: 'POST',
                url: '../index/updateprojectname',
                params: { "strProjectID": ID }
            }).then(function (response) {

                var projectdata = response.data;
                localStorage.setItem("CurrentPage", "2");
                localStorage.setItem("projectid", projectdata[0].ProjectID);
                localStorage.setItem("projectnumber", projectdata[0].ProjectNumber);
                localStorage.setItem("projectname", projectdata[0].ProjectName);
                localStorage.setItem("projectselectedvalue", jSuite_dropProjects.getText());
                window.location.href = '../Resource/Index';
            }, function (error) {
                console.log(error);
            });

        }
        else {
            document.getElementById('alertbox').style.display = 'block';
            setTimeout(function () {
                $scope.$apply(function () {
                    document.getElementById('alertbox').style.display = 'none';
                });
            }, 1000);
        }
    }

    $scope.btncreatenewproject = function () {
        document.getElementById('CreateNewProject').style.display = 'block';
        localStorage.setItem("CReferencePID", 262);
        document.getElementById("newCreateProject").value = "";
        document.getElementById("newCreateProjectName").value = "";
    }

    $scope.closecreatenew = function () {
        document.getElementById('CreateNewProject').style.display = 'none';
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

                console.log(response.data.Message);
                if (response.data.Message == 'Success') {
                    document.getElementById('dropProjects').innerHTML = "";
                    jSuite_dropProjects = jSuites.dropdown(document.getElementById('dropProjects'), {
                        url: '../index/getprojectlist',
                        autocomplete: true,
                        placeholder: "Select Project",
                        lazyLoading: true,
                        multiple: false,
                        value: response.data.Status,
                        width: '100%',
                    });

                    document.getElementById('CreateNewProject').style.display = 'none';
                    updateprogressbar(100, "Completed....");
                    document.getElementById('progressbar').style.display = 'none';
                }
                else {
                    $scope.createnewprojectalert = true;
                    $scope.createnewprojectmessage = "Project ID already exists!";
                }

            }, function (error) {
                console.log(error);
            });
        }
    }

    function updateprogressbar(value, item) {
        document.getElementById('progressBarText').innerHTML = item;
        document.getElementById('progressbar').style.display = 'block'
        progressbarstyle = document.getElementsByClassName('progress-bar progress-bar-striped progress-bar-animated');
        pstyle = "width: " + value + "%";
        progressbarstyle[0].setAttribute("style", pstyle)
    }
    function createuserprofile() {

        $http({
            method: 'GET',
            url: '../index/CreateUserProfile'
        }).then(function (response) {

            if (response.data.responseCode === 200) {
                updateprogressbar(100, "Profile has been created...");
                var user = response.data.Message;

                localStorage.clear();
                localStorage.setItem("userID", user.userID);
                localStorage.setItem("userName", user.userName);
                localStorage.setItem("isAdmin", user.isAdmin);

                document.getElementById('loginusername').innerHTML = "Welcome, " + user.userName;
                document.getElementById('loginuser').style.display = 'block';
                document.getElementById('mainlogin').style.display = 'block';
                document.getElementById('progressbar').style.display = 'none';
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
})