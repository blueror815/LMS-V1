angular.module('appRoutes', [])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('welcome', {
                url: '/',
                templateUrl: 'views/welcome.html',
                controller: 'WelcomeCtrl'
            })
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html',
                controller: 'CompanyListCtrl',
                controllerAs: 'cpList'
            });
        $locationProvider.html5Mode(true);
    });