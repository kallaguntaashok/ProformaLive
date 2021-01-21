/*
 * PageName: ProformaLive landing page.
 * Actions:
 *      1. authenticate the users.
 *      2. validate the roles.
 *      3. display total projects, if user is valid, or else it will navigate to unAuthroized page.
 */

var app = angular.module('PLLandingPage', []);
app.controller('contorllerlanding', function ($scope, $http) {

    updateprogressbar(20, "Page is loading...");
    createuserprofile();    

    var jSuite_dropProjects = jSuites.dropdown(document.getElementById('dropProjects'), {
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