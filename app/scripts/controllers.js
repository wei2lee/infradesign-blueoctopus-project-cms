/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
Parse.initialize("NyrUCp8l7LezGnpE7YSUN26quUylPmjJpxA0n1cm", "NPBTNCS2bwrzQqxCfVZ2eYfPjuwYPUwSbnWlZCVQ");

var TeamProperties = ['name', 'defaultCountry', 'createdBy'];
var ProjectProperties = ['title', 'images', 'features', 'description', 'forVIP'];
var UserRoleProperties = ['name', 'remarks'];
var UserProperties = ['team', 'fullName', 'country', 'createdBy', 'userRole'];
var controllerParameter = {};

function MainCtrl() {

    this.userName = 'blueoctopusadmin';
    this.userClass = 'System Admin'
    this.userAvatar = 'img/avatar.png';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';

};

function ProjectListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseObject, ParseQuery, $rootScope, $state) {
    var _this = this;
    this.alert = null;
    this.projects = [];
    this.delete = function (project) {
        var indexOf = _this.projects.indexOf(project);
        _this.projects.splice(indexOf, 1);

        project.data.destroy().fail(function () {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                class: 'danger'
            };
        }).always(function () {
            $scope.$apply();
        });
    };

    this.edit = function (project) {
        $rootScope.editProject = project;
        $state.transitionTo('index.project-edit');
    };

    var query = new Parse.Query("Project");
    query.find().done(function (result) {
        _this.projects = result;
        _.each(_this.projects, function (project) {
            project.selected = false;
        });
        $scope.$apply();
    }).fail(function (error) {});
}

function ProjectCreateEditCtrl($scope, ParseObject, $modal, $rootScope, $state) {
    var _this = this;
    this.alert = null;
    this.isEdit = $state.current.name.indexOf("project-edit") >= 0;
    this.project = this.isEdit ? $rootScope.editProject : new ParseObject("Project", ProjectProperties);
    this.save = function () {
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static'
        });
        _this.alert = null;
        this.project.data.save().done(function (result) {
            var project = new ParseObject(result, ProjectProperties);
            _this.alert = {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + project.title + ' is saved to the system.' : 'New record ' + project.title + ' is added to the system.',
                type: 'success'
            };
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                class: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });

        $scope.$apply();
    }
}

function TeamListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseObject, ParseQuery, $rootScope, $state) {
    var _this = this;
    this.alert = null;
    this.teams = [];
    this.delete = function (team) {
        var indexOf = _this.teams.indexOf(team);
        _this.teams.splice(indexOf, 1);

        team.data.destroy().fail(function () {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                class: 'danger'
            };
        }).always(function () {
            $scope.$apply();
        });
    };

    this.edit = function (team) {
        $rootScope.editTeam = team;
        $state.transitionTo('index.team-edit');
    };

    var teamQuery = new Parse.Query("Team");
    teamQuery.find().done(function (result) {
        _this.teams = _.map(result, function (o) {
            return new ParseObject(o, TeamProperties);
        });
        _.each(_this.teams, function (team) {
            team.memberFullnames = '';
            team.selected = false;
        });

        $scope.$apply();
        var userQuery = new Parse.Query(Parse.User);
        userQuery.include('userRole');
        return userQuery.find();
    }).done(function (result) {
        _this.users = _.map(result, function (o) {
            var ret = new ParseObject(o, UserProperties);
            ret.userRole = ret.data.get('userRole') ? new ParseObject(ret.data.get('userRole'), UserRoleProperties) : null;
            return ret;
        });
        _.each(_this.teams, function (team) {
            team.members = _.filter(_this.users, function (user) {
                return user.team && user.team.id == team.data.id;
            });
            team.memberFullnames = _.map(team.members, function (member) {
                return member.fullName || '(Empty)';
            }).join(', ');
        });
        $scope.$apply();
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: error.message,
            class: 'danger'
        };
    }).always(function () {
        $scope.$apply();
    });

}

function TeamCreateEditCtrl($scope, ParseObject, $modal, $rootScope, $state) {
    var _this = this;
    this.alert = null;
    this.isEdit = $state.current.name.indexOf("team-edit") >= 0;
    this.team = this.isEdit ? $rootScope.editTeam : new ParseObject("Team", TeamProperties);
    this.save = function () {
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static'
        });
        _this.alert = null;
        this.team.data.save().done(function (result) {
            var team = new ParseObject(result, TeamProperties);
            _this.alert = {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + team.name + ' is saved to the system.' : 'New record ' + team.name + ' is added to the system.',
                type: 'success'
            };
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                class: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });

        $scope.$apply();
    }
}

function MemberListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseObject, ParseQuery, $rootScope, $state) {
    var _this = this;
    this.alert = null;
    this.users = [];
    this.team = $rootScope.editTeam;
    this.team.members = [];
    this.team.memberFullnames = '';
    this.delete = function (team) {
        var indexOf = _this.teams.indexOf(team);
        _this.teams.splice(indexOf, 1);

        team.data.destroy().fail(function () {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                class: 'danger'
            };
        }).always(function () {
            $scope.$apply();
        });
    };

    var userQuery = new Parse.Query(Parse.User);
    userQuery.include('userRole');
    userQuery.find().done(function (result) {
        _this.users = _.map(result, function (o) {
            var ret = new ParseObject(o, UserProperties);
            ret.userRole = ret.data.get('userRole') ? new ParseObject(ret.data.get('userRole'), UserRoleProperties) : null;
            return ret;
        });
        _this.team.members = _.filter(_this.users, function (user) {
            return user.team && user.team.id == team.data.id;
        });
        team.memberFullnames = _.map(team.members, function (member) {
            return member.fullName || '(Empty)';
        }).join(', ');
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: error.message,
            class: 'danger'
        };
    }).always(function () {
        $scope.$apply();
    });

}


function UserCreateEditCtrl($scope, ParseObject, $modal, $rootScope, $state) {
    var _this = this;
    this.alert = null;
    this.isEdit = $state.current.name.indexOf("user-edit") >= 0;
    this.user = this.isEdit ? $rootScope.editUser : new ParseObject(new Parse.User(), UserProperties);
    this.roles = [];
    this.team = $rootScope.editTeam;

    var roleQuery = new Parse.Query("UserRole");
    roleQuery.find().done(function (result) {
        _this.roles = _.map(result, function (o) {
            return new ParseObject(o, UserRoleProperties);
        });
        $scope.$apply();
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: error.message,
            class: 'danger'
        };
    }).always(function () {
        $scope.$apply();
    });

    this.save = function () {
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static'
        });
        _this.alert = null;
        this.user.data.save().done(function (result) {
            var user = new ParseObject(result, UserProperties);
            _this.alert = {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + user.fullName + ' is saved to the system.' : 'New record ' + user.fullName + ' is added to the system.',
                type: 'success'
            };
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                class: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });

        $scope.$apply();
    }
}




function RoleListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseObject, ParseQuery, $rootScope, $state) {
    var _this = this;
    this.alert = null;
    this.roles = [];
    this.delete = function (role) {
        var indexOf = _this.roles.indexOf(role);
        _this.roles.splice(indexOf, 1);

        role.data.destroy().fail(function () {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                class: 'danger'
            };
        }).always(function () {
            $scope.$apply();
        });
    };

    this.edit = function (role) {
        $rootScope.editRole = role;
        $state.transitionTo('index.role-edit');
    };

    var roleQuery = new Parse.Query("UserRole");
    roleQuery.find().done(function (result) {
        _this.roles = _.map(result, function (o) {
            return new ParseObject(o, UserRoleProperties);
        });
        _.each(_this.roles, function (role) {
            role.selected = false;
        });
        $scope.$apply();
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: error.message,
            class: 'danger'
        };
    }).always(function () {
        $scope.$apply();
    });
}

function RoleCreateEditCtrl($scope, ParseObject, $modal, $rootScope, $state) {
    var _this = this;
    this.alert = null;
    this.isEdit = $state.current.name.indexOf("role-edit") >= 0;
    this.role = this.isEdit ? $rootScope.editRole : new ParseObject("UserRole", UserRoleProperties);
    this.save = function () {
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static'
        });
        _this.alert = null;
        this.role.data.save().done(function (result) {
            var role = new ParseObject(result, UserRoleProperties);
            _this.alert = {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + role.name + ' is saved to the system.' : 'New record ' + role.name + ' is added to the system.',
                type: 'success'
            };
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                class: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });

        $scope.$apply();
    }
}

function ModalInstanceCtrl($scope, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


angular
    .module('inspinia')
    .controller('MainCtrl', MainCtrl)
    .controller('MemberListCtrl', MemberListCtrl)
    .controller('UserCreateEditCtrl', UserCreateEditCtrl)
    .controller('TeamListCtrl', TeamListCtrl)
    .controller('TeamCreateEditCtrl', TeamCreateEditCtrl)
    .controller('ProjectCreateEditCtrl', ProjectCreateEditCtrl)
    .controller('ProjectListCtrl', ProjectListCtrl)
    .controller('RoleCreateEditCtrl', RoleCreateEditCtrl)
    .controller('RoleListCtrl', RoleListCtrl);