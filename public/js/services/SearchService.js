angular.module('SearchService', [])
    .factory('Search', ['$http', function($http) {

        return {
            getCompanies: getCompanies,
            getClusters: getClusters,
            getCluster: getCluster
        };

        function getCompanies(data) {
            return $http({
                    url: '/company',
                    method: "POST",
                    data: data
                })
                .then(getDataComplete)
                .catch(getDataFailed);

            function getDataComplete(response) {
                return response.data;
            }

            function getDataFailed(error) {
                return error.data;
            }
        }

        function getClusters() {
            return $http({
                    url: '/cluster/all',
                    method: 'POST'
                })
                .then(getDataSuccess)
                .catch(getDataFailed);

            function getDataSuccess(response) {
                return response.data;
            }

            function getDataFailed(error) {
                return error.data;
            }
        }

        function getCluster(params) {
            return $http({
                    url: '/cluster',
                    method: 'GET',
                    data: params
                })
                .then(getDataSuccess)
                .catch(getDataFailed);

            function getDataSuccess(response) {
                return response.data;
            }

            function getDataFailed(error) {
                return error.data;
            }
        }
    }]);