var app = angular.module('MECC', []);
app.controller('AssignmentController', function ($scope, $http) {
        
    var dsAssignments = [];
    var jSuite_Teams = [];
    var mainwidth = (window.innerWidth - 42) + "px";
    localStorage.setItem("CurrentPage", 2);

    jSuite_Teams = jSuites.dropdown(document.getElementById('dropTeams'), {
        url: '../Assignments/getTeams',
        autocomplete: true,
        placeholder: "Select Team",
        lazyLoading: true,
        multiple: true,
        width: '100%',
        onchange: onTeamChange,
    });

    document.getElementById('mainbody').style.display = 'block';

    function onTeamChange() {

        $scope.AssignmentData =
            [
                {
                    "PROJECT_NAME": "API Insourcing",
                    "MAY": "0",
                    "JUN": "0",
                    "JUL": "0",
                    "AUG": "0",
                    "SEP": "0",
                    "OCT": "0",
                    "NOV": "0",
                    "DEC": "0",
                    "JAN": "0",
                    "FEB": "0",
                    "MAR": "0",
                    "APR": "0"
                },
                {
                    "PROJECT_NAME": "Common Pin Material for Glass Feedthroug",
                    "MAY": "0",
                    "JUN": "0",
                    "JUL": "0",
                    "AUG": "0",
                    "SEP": "0",
                    "OCT": "0",
                    "NOV": "0",
                    "DEC": "0",
                    "JAN": "0",
                    "FEB": "0",
                    "MAR": "0",
                    "APR": "0"
                },
                {
                    "PROJECT_NAME": "Diabetes 8xx Pump",
                    "MAY": "0",
                    "JUN": "0",
                    "JUL": "0",
                    "AUG": "0",
                    "SEP": "0",
                    "OCT": "0",
                    "NOV": "0",
                    "DEC": "0",
                    "JAN": "0",
                    "FEB": "0",
                    "MAR": "0",
                    "APR": "0"
                },
                {
                    "PROJECT_NAME": "EV ICD Cap",
                    "MAY": "0",
                    "JUN": "0",
                    "JUL": "0",
                    "AUG": "0.95",
                    "SEP": "0.85",
                    "OCT": "0.85",
                    "NOV": "0.75",
                    "DEC": "0.75",
                    "JAN": "0.75",
                    "FEB": "1.7",
                    "MAR": "1.5",
                    "APR": "1.5"
                },
                {
                    "PROJECT_NAME": "Glass Feedthrough for Sensing",
                    "MAY": "0",
                    "JUN": "0",
                    "JUL": "0",
                    "AUG": "0",
                    "SEP": "0",
                    "OCT": "0",
                    "NOV": "0",
                    "DEC": "0",
                    "JAN": "0",
                    "FEB": "0",
                    "MAR": "0",
                    "APR": "0"
                },
                {
                    "PROJECT_NAME": "LINQ HF",
                    "MAY": "0.1",
                    "JUN": "0.1",
                    "JUL": "0.1",
                    "AUG": "0",
                    "SEP": "0",
                    "OCT": "0",
                    "NOV": "0",
                    "DEC": "0",
                    "JAN": "0",
                    "FEB": "0",
                    "MAR": "0",
                    "APR": "0"
                },
                {
                    "PROJECT_NAME": "MECC Development Product Support",
                    "MAY": "0.1",
                    "JUN": "0.1",
                    "JUL": "0.1",
                    "AUG": "0.15",
                    "SEP": "0.25",
                    "OCT": "0.25",
                    "NOV": "0.25",
                    "DEC": "0.25",
                    "JAN": "0.25",
                    "FEB": "0.25",
                    "MAR": "0.25",
                    "APR": "0.25"
                },
                {
                    "PROJECT_NAME": "MECC Reactive CAPA",
                    "MAY": "0",
                    "JUN": "0",
                    "JUL": "0",
                    "AUG": "0",
                    "SEP": "0",
                    "OCT": "0",
                    "NOV": "0",
                    "DEC": "0",
                    "JAN": "0",
                    "FEB": "0",
                    "MAR": "0",
                    "APR": "0"
                },
                {
                    "PROJECT_NAME": "Micra CAPA",
                    "MAY": "0",
                    "JUN": "0",
                    "JUL": "0",
                    "AUG": "0",
                    "SEP": "0",
                    "OCT": "0",
                    "NOV": "0",
                    "DEC": "0",
                    "JAN": "0",
                    "FEB": "0",
                    "MAR": "0",
                    "APR": "0"
                },
                {
                    "PROJECT_NAME": "Micra EL Battery",
                    "MAY": "0",
                    "JUN": "0",
                    "JUL": "0",
                    "AUG": "0",
                    "SEP": "0",
                    "OCT": "0",
                    "NOV": "0",
                    "DEC": "0",
                    "JAN": "0",
                    "FEB": "0",
                    "MAR": "0",
                    "APR": "0"
                },
                {
                    "PROJECT_NAME": "Micra H5",
                    "MAY": "0",
                    "JUN": "0",
                    "JUL": "0",
                    "AUG": "0",
                    "SEP": "0",
                    "OCT": "0",
                    "NOV": "0",
                    "DEC": "0",
                    "JAN": "0",
                    "FEB": "0",
                    "MAR": "0",
                    "APR": "0"
                }
            ]

        document.getElementById('dropfisyear').innerHTML = "";
        jSuite_dropfisyear = jSuites.dropdown(document.getElementById('dropfisyear'), {
            url: '../Assignments/getfisyear',
            autocomplete: true,
            lazyLoading: false,
            multiple: false,
            placeholder: "Select FisYear",
            width: '100%'
        });

        $http({
            method: 'GET',
            url: '../Assignments/getassignmentdata',
            params: { "intFisYear": 2021, "strTeam": jSuite_Teams.getValue() }
        }).then(function (response) {
            var sourcedata = response.data;
            $scope.dsAssignmentsDataSource = response.data;
            var maindata = $scope.AssignmentData;

            for (var i = 0; i < maindata.length; i++) {
                dsAssignments = sourcedata.filter(a => a.Project == maindata[i].PROJECT_NAME);
                if (dsAssignments.length > 0) {
                    loadAssignmentTable("decb_" + i);
                }
            }            
        }, function (error) {
            console.log(error);
        });
    }

    function loadAssignmentTable(item) {

        document.getElementById(item).innerHTML = "";
        var obj = jexcel(document.getElementById(item), {
            data: dsAssignments,
            search: false,
            tableOverflow: true,
            filters: false,
            allowManualInsertRow: false,
            columns: [
                { type: 'hidden', title: 'ProjectID' },
                { type: 'text', title: 'Project', width: 200 },
                { type: 'text', title: 'Team', width: 172 },
                { type: 'text', title: 'ResourceName', width: 172 },
                { type: 'number', title: 'MAY', width: 70 },
                { type: 'number', title: 'JUN', width: 70 },
                { type: 'number', title: 'JULY', width: 70 },
                { type: 'number', title: 'AUG', width: 70 },
                { type: 'number', title: 'SEP', width: 70 },
                { type: 'number', title: 'OCT', width: 70 },
                { type: 'number', title: 'NOV', width: 70 },
                { type: 'number', title: 'DEC', width: 70 },
                { type: 'number', title: 'JAN', width: 70 },
                { type: 'number', title: 'FEB', width: 70 },
                { type: 'number', title: 'MAR', width: 70 },
                { type: 'number', title: 'APR', width: 70 },
                { type: 'text', title: 'RequestType', width: 120 }
            ]
        });
        obj.hideIndex();

        var datavalues = document.getElementById(item).getElementsByTagName("thead");
        var newsubchilditem = datavalues[0].firstChild.getElementsByTagName("td");
        newsubchilditem[2].innerHTML = "Project <button title='Add New Assignment' style='z-index: 99999;' class='btn btn-success btn-sm pull-right additem'><i class='fa fa-plus-circle' aria-hidden='true'></i></button>";
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