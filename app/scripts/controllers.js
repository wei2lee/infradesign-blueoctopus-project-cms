/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */

function MainCtrl($state) {
    var _this = this;
    this.$state = $state;
    this.userName = 'blueoctopusadmin';
    this.userClass = 'System Admin'
    this.userAvatar = 'img/avatar.png';
}

function TopNavBarCtrl(authencation) {
    this.authencation = authencation;
}

function LoginCtrl($scope, authencation, $modal, $timeout, $state) {
    var _this = this;
    this.alert = null;
    this.login = function () {
        $scope.loading = {
            message: 'Login...'
        }
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static',
            scope: $scope,
        });
        authencation.login($scope.userName, $scope.password).done(function () {
            $state.go('index.team-list');
        }).fail(function (error) {
            //console.log(error);
            _this.alert = {
                title: '',
                message: error.message,
            };
        }).always(function () {
            $loading.dismiss('cancel');
        });
    }

    this.submitLoginForm = function (isValid) {
        if (isValid) {
            _this.login();
        }
    };
}

function ProjectListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseProject, $rootScope, $state) {
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
                type: 'danger'
            };
        }).always(function () {
            $scope.$apply();
        });
    };
    this.edit = function (project) {
        $rootScope.editProject = project;
        $state.go('index.project-edit', {
            objectId: project.data.id
        });
    };
    _this.alert = null;
    var query = new Parse.Query("Project");
    query.find().done(function (result) {
        _this.projects = _.map(result, function (o) {
            return new ParseProject(o);
        });
        $scope.$apply();
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: error.message,
            type: 'danger'
        };
    }).always(function () {
        $scope.$apply();
    });
}

function ProjectCreateEditCtrl($scope, ParseProject, $modal, $rootScope, $state, $stateParams) {
    var _this = this;
    this.alert = null;
    this.isEdit = $state.current.name.indexOf("project-edit") >= 0;
    if (this.isEdit) {
        this.project = $rootScope.editProject;
        if (!this.project) {
            this.project = new ParseProject();
            this.project.data.id = $stateParams.objectId;
            this.project.data.fetch().fail(function (error) {
                _this.alert = {
                    title: 'Fail',
                    message: error.message,
                    type: 'danger'
                };
            }).always(function () {
                $scope.$apply();
            });
        }
    } else {
        this.project = new ParseProject();
    }
    this.save = function () {
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static'
        });
        _this.alert = null;
        this.project.data.save().done(function (result) {
            var project = new ParseProject(result);
            _this.alert = {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + project.title + ' is saved to the system.' : 'New record ' + project.title + ' is added to the system.',
                type: 'success'
            };
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                type: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });
    }
}

function TeamListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseTeam, ParseMember, ParseUserRole, $rootScope, $state) {
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
                type: 'danger'
            };
        }).always(function () {
            $scope.$apply();
        });
    };

    this.edit = function (team) {
        $rootScope.editTeam = team;
        $state.go('index.team-edit', {
            objectId: team.data.id
        });
    };

    var teamQuery = new Parse.Query("Team");
    teamQuery.find().done(function (result) {
        _this.teams = _.map(result, function (o) {
            o = new ParseTeam(o);
            o.memberFullnames = '';
            return o;
        });

        console.log(_this.teams.length);

        var userQuery = new Parse.Query("Member");
        userQuery.include('userRole');
        return userQuery.find();
    }).done(function (result) {
        _this.users = _.map(result, function (o) {
            var ret = new ParseMember(o);
            ret.userRole = ret.data.get('userRole') ? new ParseUserRole(ret.data.get('userRole')) : null;
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
            type: 'danger'
        };
    }).always(function () {
        $scope.$apply();
    });

}

function TeamCreateEditCtrl($scope, ParseTeam, $modal, $rootScope, $state, $stateParams) {
    var _this = this;
    this.alert = null;
    this.isEdit = $state.current.name.indexOf("team-edit") >= 0;

    if (this.isEdit) {
        this.team = $rootScope.editTeam;
        if (!this.team) {
            this.team = new ParseTeam();
            this.team.data.id = $stateParams.objectId;
            this.team.data.fetch().done(function () {
                if (!_this.team.defaultCountry) _this.team.defaultCountry = 'MY';
            }).fail(function (error) {
                _this.alert = {
                    title: 'Fail',
                    message: error.message,
                    type: 'danger'
                };
            }).always(function () {
                $scope.$apply();
            });
        }
    } else {
        this.team = new ParseTeam();
        if (!this.team.defaultCountry) this.team.defaultCountry = 'MY';
    }


    this.save = function () {
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static'
        });
        _this.alert = null;
        this.team.data.save().done(function (result) {
            var team = new ParseTeam(result);
            _this.alert = {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + team.name + ' is saved to the system.' : 'New record ' + team.name + ' is added to the system.',
                type: 'success'
            };
            if (!_this.isEdit) {
                _this.team = new ParseTeam();
                if (!_this.team.defaultCountry) _this.team.defaultCountry = 'MY';
                $scope.$apply();
            }
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                type: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });
    }
}

function MemberListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseMember, ParseUserRole, ParseTeam, $rootScope, $state, $stateParams) {
    var _this = this;
    this.alert = null;
    this.users = [];

    this.team = $rootScope.editTeam;
    if (!this.team) {
        this.team = new ParseTeam();
        this.team.data.id = $stateParams.objectId;
        this.team.data.fetch().done(function () {
            if (!_this.team.defaultCountry) _this.team.defaultCountry = 'MY';
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                type: 'danger'
            };
        }).always(function () {
            $scope.$apply();
        });
    }


    this.delete = function (user) {
        var indexOf = _this.teams.indexOf(team);
        _this.users.splice(indexOf, 1);

        user.data.destroy().fail(function () {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                type: 'danger'
            };
        }).always(function () {
            $scope.$apply();
        });
    };

    this.edit = function (user) {
        $rootScope.editUser = user
        $state.go('index.user-edit', {
            objectId: user.data.id
        });
    };

    if (this.team) {
        this.team.members = [];
        var userQuery = new Parse.Query("Member");
        userQuery.include('userRole');
        userQuery.find().done(function (result) {
            _this.users = _.map(result, function (o) {
                var ret = new ParseMember(o);
                ret.userRole = ret.data.get('userRole') ? new ParseUserRole(ret.data.get('userRole')) : null;
                return ret;
            });
            _this.team.members = _.filter(_this.users, function (user) {
                return user.team && user.team.id == _this.team.data.id;
            });
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                type: 'danger'
            };
        }).always(function () {
            $scope.$apply();
        });
    }
}


function UserCreateEditCtrl($scope, ParseMember, ParseUserRole, $modal, $rootScope, $state, $stateParams) {
    var _this = this;
    this.alert = null;
    this.isEdit = $state.current.name.indexOf("user-edit") >= 0;
    this.roles = [];
    this.team = $rootScope.editTeam;
    if (this.isEdit) {
        this.user = $rootScope.editUser;
        if (!this.user) {
            this.user = new ParseMember();
            this.user.data.id = $stateParams.objectId;
            this.user.data.fetch().done(function () {
                if (!_this.user.country) _this.user.country = _this.team.defaultCountry;
            }).fail(function (error) {
                _this.alert = {
                    title: 'Fail',
                    message: error.message,
                    type: 'danger'
                };
            }).always(function () {
                $scope.$apply();
            });
        }
    } else {
        this.user = new ParseMember();
        if (!_this.user.country) _this.user.country = _this.team.defaultCountry;
    }

    var roleQuery = new Parse.Query("UserRole");
    roleQuery.find().done(function (result) {
        _this.roles = _.map(result, function (o) {
            return new ParseUserRole(o);
        });
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: error.message,
            type: 'danger'
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
            var user = new ParseMember(result);
            if (!this.isEdit) _this.user.country = _this.team.defaultCountry;
            _this.alert = {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + user.fullName + ' is saved to the system.' : 'New record ' + user.fullName + ' is added to the system.',
                type: 'success'
            };
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                type: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });
    }
}




function RoleListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseUserRole, $rootScope, $state, $stateParams) {
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
                type: 'danger'
            };
        }).always(function () {
            $scope.$apply();
        });
    };

    this.edit = function (role) {
        $rootScope.editRole = role;
        $state.go('index.role-edit', {
            objectId: role.data.id
        });
    };

    var roleQuery = new Parse.Query("UserRole");
    roleQuery.find().done(function (result) {
        _this.roles = _.map(result, function (o) {
            return new ParseUserRole(o);
        });
        $scope.$apply();
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: error.message,
            type: 'danger'
        };
    }).always(function () {
        $scope.$apply();
    });
}

function RoleCreateEditCtrl($scope, ParseUserRole, $modal, $rootScope, $state, $stateParams) {
    var _this = this;
    this.alert = null;
    this.isEdit = $state.current.name.indexOf("role-edit") >= 0;

    if (this.isEdit) {
        this.role = $rootScope.editRole;
        if (!this.role) {
            this.role = new ParseUserRole();
            this.role.data.id = $stateParams.objectId;
            this.role.data.fetch().fail(function (error) {
                _this.alert = {
                    title: 'Fail',
                    message: error.message,
                    type: 'danger'
                };
            }).always(function () {
                $scope.$apply();
            });
        }
    } else {
        this.role = new ParseUserRole();
    }

    this.save = function () {
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static'
        });
        _this.alert = null;
        this.role.data.save().done(function (result) {
            var role = new ParseUserRole(result);
            _this.alert = {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + role.name + ' is saved to the system.' : 'New record ' + role.name + ' is added to the system.',
                type: 'success'
            };
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: error.message,
                type: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });
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
    .controller('TopNavBarCtrl', TopNavBarCtrl)
    .controller('LoginCtrl', LoginCtrl)
    .controller('MemberListCtrl', MemberListCtrl)
    .controller('UserCreateEditCtrl', UserCreateEditCtrl)
    .controller('TeamListCtrl', TeamListCtrl)
    .controller('TeamCreateEditCtrl', TeamCreateEditCtrl)
    .controller('ProjectCreateEditCtrl', ProjectCreateEditCtrl)
    .controller('ProjectListCtrl', ProjectListCtrl)
    .controller('RoleCreateEditCtrl', RoleCreateEditCtrl)
    .controller('RoleListCtrl', RoleListCtrl);