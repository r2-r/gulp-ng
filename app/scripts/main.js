var app;
(function (app) {
    'use strict';
    angular
        .module('app', [])
        .directive('main', main);
    function main() {
        var directive = {
            restrict: 'E',
            templateUrl: 'templates/mainPage.tpl.html',
            link: link,
            scope: {}
        };
        function link(scope, element) {
            scope.title = 'Shopping List';
        }
        return directive;
    }
    ;
})(app || (app = {}));
