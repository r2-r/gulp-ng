module directives {
	export interface IMainScope extends ng.IScope {
		title: string;
	}

	export function MainDirective(): ng.IDirective {
		return {
			template: '<h1>{{title}}</h1>',
			scope: {},
			link: (scope: IMainScope) => {
				scope.title = 'Shopping List';
			}
		};
	}
}