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


function MainCtrl() {

    this.userName = 'blueoctopusadmin';
    this.userClass = 'System Admin'
    this.userAvatar = 'img/avatar.png';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';

};

function ProjectListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseObject, ParseQuery) {
    var _ctrl = this;
    var query = new Parse.Query("Project");
    query.find().done(function (result) {
        _ctrl.projects = result;
        _.each(_ctrl.projects, function (project) {
            project.selected = false;
        });
        $scope.$apply();
    }).fail(function (error) {
        console.log(error);
    });

    var vm = this;
    //    vm.dtOptions = DTOptionsBuilder.newOptions()
    //        .withPaginationType('full_numbers')
    //        .withDisplayLength(2)
    //        .withDOM('pitrfl');
    //    vm.dtColumnDefs = [
    //        DTColumnDefBuilder.newColumnDef(0),
    //    ];
}

function TeamListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseObject, ParseQuery) {
    var _ctrl = this;
    var teamQuery = new Parse.Query("Team");
    teamQuery.find().done(function (result) {
        _ctrl.teams = _.map(result, function (o) {
            return new ParseObject(o, TeamProperties);
        });
        _.each(_ctrl.teams, function (team) {
            team.members = '';
            team.selected = false;
        });
        $scope.$apply();
        var userQuery = new Parse.Query(Parse.User);
        return userQuery.find();
    }).done(function (result) {
        _ctrl.teams = _.map(result, function (o) {
            return new ParseObject(o, UserProperties);
        });
        _.each(_ctrl.teams, function (team) {
            var members = _.filter(_ctrl.users, function (user) {
                return user.team && user.team.id == team.data.id;
            });
            team.members = _.map(members, function (member) {
                return member.fullName || '(Empty)';
            }).join(', ');

            console.log(team);
        });
        $scope.$apply();
    }).fail(function (error) {
        console.log(error);
    });

}

function RoleListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseObject, ParseQuery) {
    var _ctrl = this;
}


angular
    .module('inspinia')
    .controller('MainCtrl', MainCtrl)
    .controller('TeamListCtrl', TeamListCtrl)
    .controller('ProjectListCtrl', ProjectListCtrl)
    .controller('RoleListCtrl', RoleListCtrl);