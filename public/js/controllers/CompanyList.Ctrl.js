angular.module('CompanyModule', [])
    .controller('CompanyListCtrl', function($scope, Search, $state) {


        // clinical trials variables
        $scope.pageNumber = 1;
        $scope.recordsPerPage = 20;
        $scope.maxSize = 3;
        $scope.records = [];
        $scope.totalCount = 0;
        var pageNo = 1;

        $scope.is_loading = false;

        /***
         * Global search function
         * ***/
        $scope.searchValue = '';

        function getCompanies(searchKeys) {
            Search.getCompanies(searchKeys)
                .then(function(res) {
                        if (res.status == 'success') {
                            $scope.is_loading = false;
                            // Clinical trials
                            console.log("--->Res,", res);
                            $scope.records = res.companies;
                            $scope.totalCount = res.totalCount;
                            $scope.myvar = $scope.totalCount > 0 ? true : false;
                            $scope.pageBtns = $scope.totalCount > $scope.recordsPerPage ? true : false;
                        }
                    },
                    function(err) {
                        console.log(err);
                    });

        }

        /***
         * Function called on search button click
         * ***/
        $scope.search = function() {

            $scope.is_loading = true;

            var s_data = {
                recordsPerPage: $scope.recordsPerPage,
                search: $scope.searchValue,
                pageNo: pageNo
            };
            getCompanies(s_data);
        };


        /***
         * Call function
         * ***/

        $scope.search();

        /***
         * 
         * Pagination functions
         * 
         * ***/

        // clinical Trials
        $scope.pageChanged = function(page) {
            pageNo = page;
            $scope.search();
        }

        // View Details of products

        $scope.viewDetails = function(p_id, p_type) {
            var data = {
                p_id: p_id,
                p_type: p_type
            };
            //~ $state.go('productsDetails',{p_type:p_type,p_id:p_id});
            var state = $state.current.name;
            if (state == 'products') {
                Search.viewDetails(data)
                    .then(function(res) {
                        console.log(res);
                    });
            } else {
                Search.trViewDetails(data)
                    .then(function(res) {
                        console.log(res);
                    });
            }
        }
    });