/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written stat for all view in theme.
 *
 */


function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/index/main");

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "views/main.html",
            data: {
                pageTitle: 'Example view'
            }
        })
        .state('index.minor', {
            url: "/minor",
            templateUrl: "views/minor.html",
            data: {
                pageTitle: 'Example view'
            }
        })
        .state('index.team-list', {
            url: "/team-list",
            templateUrl: "views/team-list.html",
            data: {
                pageTitle: 'Team Management - List'
            },
            resolve: {
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
            }
        })
        .state('index.team-create', {
            url: "/team-create",
            templateUrl: "views/team-create-edit.html",
            data: {
                pageTitle: 'Team Management - Create'
            }
        })
        .state('index.team-edit', {
            url: "/team-edit",
            templateUrl: "views/team-create-edit.html",
            data: {
                pageTitle: 'Team Management - Edit'
            }
        })
        .state('index.user-create', {
            url: "/user-create",
            templateUrl: "views/user-create-edit.html",
            data: {
                pageTitle: 'Team Management - Create Team Member'
            }
        })
        .state('index.user-edit', {
            url: "/user-edit",
            templateUrl: "views/user-create-edit.html",
            data: {
                pageTitle: 'Team Management - Edit Team Member'
            }
        })
        .state('index.role-list', {
            url: "/role-list",
            templateUrl: "views/role-list.html",
            data: {
                pageTitle: 'Role Management - List'
            },
            resolve: {
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
            }
        })
        .state('index.role-create', {
            url: "/role-create",
            templateUrl: "views/role-create-edit.html",
            data: {
                pageTitle: 'Role Management - Create'
            }
        })
        .state('index.role-edit', {
            url: "/role-edit",
            templateUrl: "views/role-create-edit.html",
            data: {
                pageTitle: 'Role Management - Edit'
            }
        })
        .state('index.project-list', {
            url: "/project-list",
            templateUrl: "views/project-list.html",
            data: {
                pageTitle: 'Project Management - List'
            },
            resolve: {
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
            }
        })
        .state('index.project-create', {
            url: "/project-create",
            templateUrl: "views/project-create-edit.html",
            data: {
                pageTitle: 'Project Management - Create'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/dropzone/basic.css', 'css/plugins/dropzone/dropzone.css', 'js/plugins/dropzone/dropzone.js']
                        }
                    ]);
                }
            }
        })
        .state('index.project-edit', {
            url: "/project-edit",
            templateUrl: "views/project-create-edit.html",
            data: {
                pageTitle: 'Project Management - Edit'
            },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/dropzone/basic.css', 'css/plugins/dropzone/dropzone.css', 'js/plugins/dropzone/dropzone.js']
                        }
                    ]);
                }
            }
        })
}
angular
    .module('inspinia')
    .config(config)
    .run(function ($rootScope, $state) {
        $rootScope.$state = $state;
    });