/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written stat for all view in theme.
 *
 */


var resolvePluginDataTable = {
    loadPlugin: function ($ocLazyLoad) {
        return $ocLazyLoad.load([
            {
                serie: true,
                files: ['js/plugins/dataTables/jquery.dataTables.js', 'css/plugins/dataTables/dataTables.bootstrap.css']
                        },
            {
                serie: true,
                files: ['js/plugins/dataTables/dataTables.bootstrap.js']
                        },
            {
                name: 'datatables',
                files: ['js/plugins/dataTables/angular-datatables.min.js']
                        }
                    ]);
    }
};

var resolvePluginDropZone = {
    loadPlugin: function ($ocLazyLoad) {
        return $ocLazyLoad.load([
            {
                files: ['css/plugins/dropzone/basic.css', 'css/plugins/dropzone/dropzone.css', 'js/plugins/dropzone/dropzone.js']
                        }
                    ]);
    }
}

function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");

    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            data: {
                pageTitle: 'Login',
                specialClass: 'gray-bg'
            }
        })
        .state('index', {
            abstract: true,
            url: "/",
            templateUrl: "views/common/content.html",
        })
        .state('index.team-list', {
            url: "team/list",
            templateUrl: "views/team-list.html",
            data: {
                pageTitle: 'Team Management - List'
            },
            resolve: resolvePluginDataTable
        })
        .state('index.team-create', {
            url: "team/create",
            templateUrl: "views/team-create-edit.html",
            data: {
                pageTitle: 'Team Management - Create'
            }
        })
        .state('index.team-edit', {
            url: "team/edit/{objectId}",
            templateUrl: "views/team-create-edit.html",
            data: {
                pageTitle: 'Team Management - Edit'
            },
            resolve: resolvePluginDataTable
        })
        .state('index.user-create', {
            url: "user/create",
            templateUrl: "views/user-create-edit.html",
            data: {
                pageTitle: 'Team Management - Create Team Member'
            }
        })
        .state('index.user-edit', {
            url: "user/edit/{objectId}",
            templateUrl: "views/user-create-edit.html",
            data: {
                pageTitle: 'Team Management - Edit Team Member'
            }
        })
        .state('index.role-list', {
            url: "role/list",
            templateUrl: "views/role-list.html",
            data: {
                pageTitle: 'Role Management - List'
            },
            resolve: resolvePluginDataTable
        })
        .state('index.role-create', {
            url: "role/create",
            templateUrl: "views/role-create-edit.html",
            data: {
                pageTitle: 'Role Management - Create'
            }
        })
        .state('index.role-edit', {
            url: "role/edit/{objectId}",
            templateUrl: "views/role-create-edit.html",
            data: {
                pageTitle: 'Role Management - Edit'
            }
        })
        .state('index.project-list', {
            url: "project/list",
            templateUrl: "views/project-list.html",
            data: {
                pageTitle: 'Project Management - List'
            },
            resolve: resolvePluginDataTable
        })
        .state('index.project-create', {
            url: "project/create",
            templateUrl: "views/project-create-edit.html",
            data: {
                pageTitle: 'Project Management - Create'
            },
            resolve: resolvePluginDropZone
        })
        .state('index.project-edit', {
            url: "project/edit/{objectId}",
            templateUrl: "views/project-create-edit.html",
            data: {
                pageTitle: 'Project Management - Edit'
            },
            resolve: resolvePluginDropZone
        })
}
angular
    .module('inspinia')
    .config(config)
    .service('authencation', function ($state, $cookies, ParseMember) {
        this.isAuthencated = function () {
            return $cookies.get('logon') == 1;
        };
        this.login = function (username, password) {
            var loginQuery = new Parse.Query("Member");
            loginQuery.equalTo('username', username);
            loginQuery.equalTo('password', password);
            var $d = $.Deferred();
            var find = loginQuery.find();
            find.done(function (result) {
                if (result && result.length) {
                    $cookies.put('logon', 1);
                    $cookies.put('logonUser', new ParseMember(result[0]));
                    if ($state.current.name == 'login') {
                        $state.go('index.team-list');
                    }
                    $d.resolve();
                } else {
                    $cookies.put('logon', 0);
                    $cookies.put('logonUser', undefined);

                    console.log(this);

                    $d.reject(new Parse.Error(0, 'Username is not matched with password.'));
                }
            }).fail(function (error) {
                $d.reject(error);
            });
            return $d.promise();
        }
        this.logout = function () {
            $cookies.put('logon', 0);
            $cookies.put('logonUser', undefined);
            $state.go('login');
        };
    })
    .run(function ($rootScope, $state, authencation) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            console.log($state.current.name + '>' + toState.name + ' : ' + authencation.isAuthencated());
            if (toState.name == 'login' && authencation.isAuthencated()) {
                if ($state.current.name != 'index.team-list') {
                    $state.go('index.team-list');
                }
            } else if (toState.name == 'login' && !authencation.isAuthencated()) {

            } else if (toState.name != 'login' && authencation.isAuthencated()) {

            } else if (toState.name != 'login' && !authencation.isAuthencated()) {
                //if ($state.current.name != 'login') {
                $state.go('login');
                //}
            }
        });
    });