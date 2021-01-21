var app = angular.module('app', []);
app.controller('AppCtrl', function AppCtrl($scope, $http, $sce) {

    //creating summary PIVOTE Table.    

    var vm = this;

    vm.YMNames = [];
    vm.itemName = [];

    $http({
        method: 'GET',
        url: '../Resource/getsummarydata',
        params: {
            "strFisyear": ""
        }
    }).then(function (response) {

        $scope.SummaryDetails = response.data;
        if ($scope.SummaryDetails.length > 0) {


            var uniqueYMName = {},
                i;

            for (i = 0; i < $scope.SummaryDetails.length; i += 1) {
                //For column wise YM add    
                uniqueYMName[$scope.SummaryDetails[i].FinYear_Month] = $scope.SummaryDetails[i];
            }

            // For Column wise YM add    
            for (i in uniqueYMName) {
                vm.YMNames.push(uniqueYMName[i]);
            }

            vm.getYMDetails();
        }

    }, function (error) {
        console.log(error);
    });

    vm.getYMDetails = function () {       

        var UniqueItemName = {}, i

        for (i = 0; i < $scope.SummaryDetails.length; i += 1) {

            UniqueItemName[$scope.SummaryDetails[i].Name] = $scope.SummaryDetails[i];
        }
        for (i in UniqueItemName) {

            var ItmDetails = {
                Name: UniqueItemName[i].Name
            };
            vm.itemName.push(ItmDetails);
        }

    }

    // To Display Toy Details as Toy Name wise Pivot Price Sum calculate 
    vm.showYMItemDetails = function (colName, colYM) {                
        $scope.getvalues = 0;

        for (i = 0; i < $scope.SummaryDetails.length; i++) {
            if (colName == $scope.SummaryDetails[i].Name) {
                if (colYM == $scope.SummaryDetails[i].FinYear_Month) {

                    $scope.getvalues = parseInt($scope.getvalues) + parseInt($scope.SummaryDetails[i].Value);

                }
            }
        }
        if (parseInt($scope.getvalues) > 0) {
            return $sce.trustAsHtml("<font style='color:#007bff; font-weight:400;'><b>" + $scope.getvalues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b></font>");
        }
        else {
            return $sce.trustAsHtml("<b>" + $scope.getvalues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b>");
        }
    }

    // To Display Toy Details as Toy Name wise Pivot Column wise Total
    vm.showYMColumnGrandTotal = function (colName, colToyName) {       

        $scope.getColumTots = 0;

        for (i = 0; i < $scope.SummaryDetails.length; i++) {
            if (colName == $scope.SummaryDetails[i].Name) {
                $scope.getColumTots = parseInt($scope.getColumTots) + parseInt($scope.SummaryDetails[i].Value);
            }
        }
              
        return $sce.trustAsHtml("<font color='#203e5a'><b>" + $scope.getColumTots.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b></font>");
    }

    //var vm = this;
    //$scope.vm.cars = [
    //    {
    //        id: 1,
    //        make: 'Audi',
    //        model: 'A3 SE',
    //        engine: '1.2 TFSI',
    //        power: '110PS',
    //        transmission: '6-speed manual',
    //        co2: 114,
    //        rrp: 18180.0,
    //        otr: 18865,
    //    },
    //    {
    //        id: 2,
    //        make: 'Audi',
    //        model: 'A3 SE',
    //        engine: '1.2 TFSI',
    //        power: '110PS',
    //        transmission: '7-speed S tronic',
    //        co2: 110,
    //        rrp: 19660.0,
    //        otr: 20345,
    //    },
    //    {
    //        id: 3,
    //        make: 'Audi',
    //        model: 'A3 SE',
    //        engine: '1.4 TFSI',
    //        power: '125PS',
    //        transmission: '6-speed manual',
    //        co2: 117,
    //        rrp: 19480.0,
    //        otr: 20165,
    //    },
    //    {
    //        id: 4,
    //        make: 'Audi',
    //        model: 'A3 SE',
    //        engine: '1.4 TFSI',
    //        power: '125PS',
    //        transmission: '7-speed S tronic',
    //        co2: 110,
    //        rrp: 20960.0,
    //        otr: 21645,
    //    },
    //    {
    //        id: 5,
    //        make: 'Audi',
    //        model: 'A3 SE',
    //        engine: '1.4 TFSI',
    //        power: '150PS',
    //        transmission: '6-speed manual',
    //        co2: 105,
    //        rrp: 20330.0,
    //        otr: 21015,
    //    },
    //    {
    //        id: 6,
    //        make: 'Audi',
    //        model: 'A3 SE',
    //        engine: '1.4 TFSI',
    //        power: '150PS',
    //        transmission: '7-speed S tronic',
    //        co2: 104,
    //        rrp: 21810.0,
    //        otr: 22495,
    //    },
    //    {
    //        id: 7,
    //        make: 'Audi',
    //        model: 'A3 SE',
    //        engine: '1.6 TDI',
    //        power: '110PS',
    //        transmission: '6-speed manual',
    //        co2: 99,
    //        rrp: 20430.0,
    //        otr: 21115,
    //    },
    //    {
    //        id: 8,
    //        make: 'Audi',
    //        model: 'A3 SE',
    //        engine: '1.6 TDI',
    //        power: '110PS',
    //        transmission: '7-speed S tronic',
    //        co2: 99,
    //        rrp: 21910.0,
    //        otr: 22595,
    //    },
    //    {
    //        id: 9,
    //        make: 'Audi',
    //        model: 'A3 SE',
    //        engine: '2.0 TDI',
    //        power: '150PS',
    //        transmission: '6-speed manual',
    //        co2: 108,
    //        rrp: 21780.0,
    //        otr: 22465,
    //    },
    //    {
    //        id: 10,
    //        make: 'Audi',
    //        model: 'A3 SE',
    //        engine: '2.0 TDI',
    //        power: '150PS',
    //        transmission: '6-speed S tronic',
    //        co2: 119,
    //        rrp: 23260.0,
    //        otr: 23945,
    //    },
    //];    



});

app.directive('fixedColumnTable', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            fixedColumns: "@"
        },
        link: function (scope, element) {
            var container = element[0];

            function activate() {
                applyClasses('thead tr', 'cross', 'th');
                applyClasses('tbody tr', 'fixed-cell', 'td');

                var leftHeaders = [].concat.apply([], container.querySelectorAll('tbody td.fixed-cell'));
                var topHeaders = [].concat.apply([], container.querySelectorAll('thead th'));
                var crossHeaders = [].concat.apply([], container.querySelectorAll('thead th.cross'));

                console.log('line before setting up event handler');

                container.addEventListener('scroll', function () {
                    console.log('scroll event handler hit');
                    var x = container.scrollLeft;
                    var y = container.scrollTop;

                    //Update the left header positions when the container is scrolled
                    leftHeaders.forEach(function (leftHeader) {
                        leftHeader.style.transform = translate(x, 0);
                    });

                    //Update the top header positions when the container is scrolled
                    topHeaders.forEach(function (topHeader) {
                        topHeader.style.transform = translate(0, y);
                    });

                    //Update headers that are part of the header and the left column
                    crossHeaders.forEach(function (crossHeader) {
                        crossHeader.style.transform = translate(x, y);
                    });

                });

                function translate(x, y) {
                    return 'translate(' + x + 'px, ' + y + 'px)';
                }

                function applyClasses(selector, newClass, cell) {
                    var arrayItems = [].concat.apply([], container.querySelectorAll(selector));
                    var currentElement;
                    var colspan;

                    arrayItems.forEach(function (row, i) {
                        var numFixedColumns = scope.fixedColumns;
                        for (var j = 0; j < numFixedColumns; j++) {
                            currentElement = angular.element(row).find(cell)[j];
                            currentElement.classList.add(newClass);

                            if (currentElement.hasAttribute('colspan')) {
                                colspan = currentElement.getAttribute('colspan');
                                numFixedColumns -= (parseInt(colspan) - 1);
                            }
                        }
                    });
                }
            }

            $timeout(function () {
                activate();
            }, 2000);

            scope.$on('refreshFixedColumns', function () {
                $timeout(function () {
                    activate();
                    container.scrollLeft = 0;
                }, 2000);
            });
        }
    };
});