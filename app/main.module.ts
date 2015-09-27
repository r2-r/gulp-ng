module app {
	'use strict';

	interface IMainScope extends ng.IScope {
		title: string;
	}

	angular
		.module('app', [])
		.directive('main', main);

	function main(): ng.IDirective {
		var directive = <ng.IDirective> {
			restrict: 'E',
			templateUrl: 'templates/mainPage.tpl.html',
			link: link,
			scope: {}
		}

		function link(scope: IMainScope, element: ng.IAugmentedJQuery): void {
			scope.title = 'Shopping List';
		}

		return directive;
	};
}