angular
    .module('WelcomeModule', [])
    .controller('WelcomeCtrl', function($state, Search, $scope, $window) {

        $scope.cluster_companies = [];

        $scope.getClusters = function() {
            Search.getClusters().then(function(response) {
                if (response.type == "success") {
                    $scope.cluster_companies = response.cluster_companies;
                    $scope.cluster_countries = response.cluster_countries;

                    console.log("===>cluster companies...", $scope.cluster_companies);
                    console.log("===>cluster countries...", $scope.cluster_countries);
                }
            });
        }

        $scope.getClusters();

        $scope.goWebsite = function(url) {
            window.location = url;
        }
    })