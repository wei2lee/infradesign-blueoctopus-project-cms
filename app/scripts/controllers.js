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

function LoginCtrl($scope, authencation, $modal, $timeout, $state, ParseSDK) {
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
            _this.alert = {
                title: '',
                message: (error && error.message) ? error.message : error,
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

        project.data.destroy().fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: (error && error.message) ? error.message : error,
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
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: (error && error.message) ? error.message : error,
            type: 'danger'
        };
    }).always(function () {
        $scope.$apply();
    });
}

function ProjectCreateEditCtrl($scope, ParseProject, $modal, $rootScope, $state, $stateParams, $timeout) {
    var _this = this;
    this.alert = null;
    this.isEdit = $state.current.name.indexOf("project-edit") >= 0;
    this.delete = function () {
        $scope.loading = {
            message: "Deleting..."
        }
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static',
            scope: $scope
        });
        _this.alert = null;
        this.project.data.destroy().done(function (result) {
            $state.go('index.project-list');
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: (error && error.message) ? error.message : error,
                type: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });
    }
    this.save = function () {
        _this.project.mainPhotos = $scope.mainPhotos;
        _this.project.photos = $scope.photos;
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
            if (!_this.isEdit) {
                _this.project = new ParseProject();
                $scope.$apply();
            }
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: (error && error.message) ? error.message : error,
                type: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });
    }

    var fetch = null;
    if (this.isEdit) {
        if ($rootScope.editProject) {
            fetch = Parse.Promise.as($rootScope.editProject.data);
        } else {
            var item = new ParseProject();
            item.data.id = $stateParams.objectId;
            fetch = item.data.fetch()
        }
    } else {
        fetch = Parse.Promise.as(new ParseProject().data);
    }
    fetch.done(function (result) {
        _this.project = new ParseProject(result);
        $scope.mainPhotos = _this.project.mainPhotos || [];
        $scope.photos = _this.project.photos || [];
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: (error && error.message) ? error.message : error,
            type: 'danger'
        };
    }).always(function () {
        $timeout(function () {
            $scope.$apply();
        });
    });
}

function TeamListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseTeam, ParseMember, ParseUserRole, $rootScope, $state) {
    var _this = this;
    this.alert = null;
    this.teams = [];
    this.delete = function (team) {
        var indexOf = _this.teams.indexOf(team);
        _this.teams.splice(indexOf, 1);

        team.data.destroy().fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: (error && error.message) ? error.message : error,
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

    var teamQuery = new Parse.Query(new ParseTeam().className);
    teamQuery.find().done(function (result) {
        _this.teams = _.map(result, function (o) {
            o = new ParseTeam(o);
            return o;
        });
        var userQuery = new Parse.Query("Member");
        return userQuery.find();
    }).done(function (result) {
        _this.users = _.map(result, function (o) {
            return new ParseMember(o);
        });
        _.each(_this.teams, function (team) {
            team.members = _.filter(_this.users, function (user) {
                return user.team && user.team.data.id == team.data.id;
            });
        });
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: (error && error.message) ? error.message : error,
            type: 'danger'
        };
    }).always(function () {
        $scope.$apply();
    });

}

function TeamCreateEditCtrl($scope, ParseTeam, $modal, $rootScope, $state, $stateParams, $timeout) {
    var _this = this;
    this.alert = null;
    this.isEdit = $state.current.name.indexOf("team-edit") >= 0;

    this.delete = function () {
        $scope.loading = {
            message: "Deleting..."
        }
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static',
            scope: $scope
        });
        _this.alert = null;

        this.team.data.destroy().done(function (result) {
            $state.go('index.team-list');
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: (error && error.message) ? error.message : error,
                type: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });
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
                message: (error && error.message) ? error.message : error,
                type: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });
    }

    var fetch = null;
    if (this.isEdit) {
        if ($rootScope.editTeam) {
            fetch = Parse.Promise.as($rootScope.editTeam.data);
        } else {
            var item = new ParseTeam();
            item.data.id = $stateParams.objectId;
            fetch = item.data.fetch()
        }
    } else {
        fetch = Parse.Promise.as(new ParseTeam().data);
    }
    fetch.done(function (result) {
        _this.team = new ParseTeam(result);
        if (!_this.team.defaultCountry) _this.team.defaultCountry = 'MY';
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: (error && error.message) ? error.message : error,
            type: 'danger'
        };
    }).always(function () {
        $timeout(function () {
            $scope.$apply();
        });
    });
}

function MemberListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseMember, ParseUserRole, ParseTeam, $rootScope, $state, $stateParams, $timeout) {
    var _this = this;
    this.alert = null;
    this.users = [];
    this.team = null;
    this.delete = function (user) {
        var indexOf = _this.team.members.indexOf(user);
        _this.team.members.splice(indexOf, 1);
        user.data.destroy().fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: (error && error.message) ? error.message : error,
                type: 'danger'
            };
            console.log(error.message);
        }).always(function () {
            $scope.$apply();
        });
    };

    this.edit = function (team, user) {
        $rootScope.editTeam = team;
        $rootScope.editUser = user;
        $state.go('index.user-edit', {
            teamId: team.data.id,
            objectId: user.data.id
        });
    };

    var fetchTeam = null;
    var fetchUsers = null;
    if ($rootScope.editTeam) {
        fetchTeam = Parse.Promise.as($rootScope.editTeam.data);
        if ($rootScope.editTeam.members) {
            fetchUsers = Parse.Promise.as(_.map($rootScope.editTeam.members, function (o) {
                return o.data
            }));
        } else {
            var userQuery = new Parse.Query("Member");
            userQuery.include('userRole');
            fetchUsers = userQuery.find();
        }
    } else {
        var item = new ParseTeam();
        item.data.id = $stateParams.objectId;
        fetchTeam = item.data.fetch()

        var userQuery = new Parse.Query("Member");
        userQuery.include('userRole');
        fetchUsers = userQuery.find();
    }

    Parse.Promise.when(fetchTeam, fetchUsers).done(function (team, users) {
        _this.team = new ParseTeam(team);
        _this.users = _.map(users, function (o) {
            return new ParseMember(o);
        });
        console.log(_this.users);
        _this.users = _.filter(_this.users, function (o) {
            return o.team && o.team.data.id == $stateParams.objectId;
        });
        _this.team.members = _this.users;
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: (error && error.message) ? error.message : error,
            type: 'danger'
        };
    }).always(function () {
        $timeout(function () {
            $scope.$apply();
        });
    });
}


function UserCreateEditCtrl($scope, ParseMember, ParseUserRole, ParseTeam, $modal, $rootScope, $state, $stateParams, $timeout) {
    var _this = this;
    this.alert = null;
    this.isEdit = $state.current.name.indexOf("user-edit") >= 0;
    this.roles = [];
    this.userRole = null;
    this.team = $rootScope.editTeam;

    this.delete = function () {
        $scope.loading = {
            message: "Deleting..."
        }
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static',
            scope: $scope
        });
        _this.alert = null;
        this.user.data.destroy().done(function (result) {
            $state.go('index.team-edit', {
                objectId: _this.team.data.id
            });
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: (error && error.message) ? error.message : error,
                type: 'danger'
            };

            console.log(error.message);
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });
    }


    this.save = function () {
        _this.user.userRole = _this.userRole;
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static'
        });
        _this.alert = null;
        this.user.data.save().done(function (result) {
            var user = new ParseMember(result);
            _this.alert = {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + user.username + ' is saved to the system.' : 'New record ' + user.username + ' is added to the system.',
                type: 'success'
            };
            if (!_this.isEdit) {
                _this.user = new ParseMember();
                _this.userRole = _this.user.userRole;
                _this.user.country = _this.team.defaultCountry;
                $scope.$apply();
            }
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: (error && error.message) ? error.message : error,
                type: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });
    }

    var fetchTeam = null;
    var fetchUser = null;
    var fetchRoles = null;
    if (this.isEdit) {
        if ($rootScope.editTeam) {
            fetchTeam = Parse.Promise.as($rootScope.editTeam.data);
        } else {
            var item = new ParseTeam();
            item.data.id = $stateParams.teamId;
            fetchTeam = item.data.fetch()
        }
        if ($rootScope.editUser) {
            fetchUser = Parse.Promise.as($rootScope.editUser.data);
        } else {
            var item = new ParseMember();
            item.data.id = $stateParams.objectId;
            fetchUser = item.data.fetch()
        }
    } else {
        if ($rootScope.editTeam) {
            fetchTeam = Parse.Promise.as($rootScope.editTeam.data);
        } else {
            var item = new ParseTeam();
            item.data.id = $stateParams.teamId;
            fetchTeam = item.data.fetch()
        }
        fetchUser = Parse.Promise.as(new ParseMember().data);
    }
    var fetchRoleQuery = new Parse.Query("UserRole");
    fetchRoleQuery.notEqualTo('objectId', 'sPNteI2ahV');
    fetchRoles = fetchRoleQuery.find();

    Parse.Promise.when(fetchTeam, fetchUser, fetchRoles).done(function (team, user, roles) {
        _this.team = new ParseTeam(team);
        _this.user = new ParseMember(user);
        _this.user.team = _this.team;
        if (!_this.user.country) _this.user.country = _this.team.defaultCountry || 'MY';
        _this.roles = _.map(roles, function (o) {
            return new ParseUserRole(o);
        });
        _this.userRole = _this.user.userRole;
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: (error && error.message) ? error.message : error,
            type: 'danger'
        };
    }).always(function () {
        $timeout(function () {
            $scope.$apply();
        });
    });
}




function RoleListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseUserRole, $rootScope, $state, $stateParams, u) {
    var _this = this;
    this.alert = null;
    this.roles = [];
    this.delete = function (role) {
        var indexOf = _this.roles.indexOf(role);
        _this.roles.splice(indexOf, 1);

        role.data.destroy().fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: (error && error.message) ? error.message : error,
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
            o = new ParseUserRole(o);
            o.allowDeleteRow = u.allowDeleteRow(o);
            return o;
        });
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: (error && error.message) ? error.message : error,
            type: 'danger'
        };
    }).always(function () {
        $scope.$apply();
    });
}

function RoleCreateEditCtrl($scope, ParseUserRole, $modal, $rootScope, $state, $stateParams, $timeout, u) {
    var _this = this;
    this.alert = null;
    this.isEdit = $state.current.name.indexOf("role-edit") >= 0;

    this.delete = function () {
        $scope.loading = {
            message: "Deleting..."
        }
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static',
            scope: $scope
        });
        _this.alert = null;
        this.role.data.destroy().done(function (result) {
            $state.go('index.role-list');
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: (error && error.message) ? error.message : error,
                type: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });
    }

    this.save = function () {
        $loading = $modal.open({
            templateUrl: 'views/modal-loading.html',
            backdrop: 'static'
        });
        _this.alert = null;
        _this.role.data.save().done(function (result) {
            var role = new ParseUserRole(result);
            _this.alert = {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + role.name + ' is saved to the system.' : 'New record ' + role.name + ' is added to the system.',
                type: 'success'
            };
            if (!_this.isEdit) {
                _this.role = new ParseUserRole();
                $scope.$apply();
            }
        }).fail(function (error) {
            _this.alert = {
                title: 'Fail',
                message: (error && error.message) ? error.message : error,
                type: 'danger'
            };
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });
    }

    var fetch = null;
    if (this.isEdit) {
        if ($rootScope.editRole) {
            fetch = Parse.Promise.as($rootScope.editRole.data);
        } else {
            var item = new ParseUserRole();
            item.data.id = $stateParams.objectId;
            fetch = item.data.fetch()
        }
    } else {
        fetch = Parse.Promise.as(new ParseUserRole().data);
    }
    fetch.done(function (result) {
        _this.role = new ParseUserRole(result);
        _this.role.allowDeleteRow = u.allowDeleteRow(_this.role);
    }).fail(function (error) {
        _this.alert = {
            title: 'Fail',
            message: (error && error.message) ? error.message : error,
            type: 'danger'
        };
    }).always(function () {
        $timeout(function () {
            $scope.$apply();
        });
    });
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