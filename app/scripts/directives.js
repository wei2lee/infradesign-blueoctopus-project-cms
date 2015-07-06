/**
 * INSPINIA - Responsive Admin Theme
 *
 */


/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function (scope, element) {
            var listener = function (event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'INSPINIA | Responsive Admin Theme';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'INSPINIA | ' + toState.data.pageTitle;
                $timeout(function () {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function () {
                element.metisMenu();
            });
        }
    };
};

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                    var ibox = $element.closest('div.ibox');
                    var icon = $element.find('i:first');
                    var content = ibox.find('div.ibox-content');
                    content.slideToggle(200);
                    // Toggle icon from up to down
                    icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    ibox.toggleClass('').toggleClass('border-bottom');
                    $timeout(function () {
                        ibox.resize();
                        ibox.find('[id^=map-]').resize();
                    }, 50);
                },
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                }
        }
    };
};

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 100);
                } else if ($('body').hasClass('fixed-sidebar')) {
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 300);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};

/**
 * dropZone - Directive for Drag and drop zone file upload plugin
 */
function dropZone() {
    return function (scope, element, attrs) {
        element.dropzone({
            url: "/upload",
            addRemoveLinks: true,
            autoProcessQueue: false,
            maxFiles: attrs.maxfiles,
            maxFilesize: 100,
            paramName: "uploadfile",
            maxThumbnailFilesize: attrs.maxfiles,
            dictDefaultMessage: '',
            init: function () {
                this.idid = '123';


                var _this = this;
                var filesPropertyName = attrs.filespropertyname || 'files';

                console.log('dropZone.init');
                if (scope[filesPropertyName] === undefined) scope[filesPropertyName] = [];
                this.on('success', function (file, json) {
                    console.log('dropZone.success');
                });


                this.on('maxfilesexceeded', function (file) {
                    console.log('dropZone.maxfilesexceeded');
                    _this.removeFile(file);
                });

                this.on('sending', function (file, xhr, formData) {
                    console.log('dropZone.sending');
                });

                this.on('addedfile', function (file) {
                    console.log('dropZone.addedfile');
                    if (scope[filesPropertyName].length + 1 > attrs.maxfiles) {
                        return;
                    }
                    var parseFile = new Parse.File(file.name, file);
                    var savePromise = parseFile.save();
                    parseFile.savePromise = savePromise;
                    parseFile.file = file;
                    savePromise.done(function (result) {
                        console.log(result);
                        parseFile.saveDone = true;
                    }).fail(function (error) {
                        console.log(error);
                        parseFile.saveError = error;
                    });
                    scope.$apply(function () {
                        scope[filesPropertyName].push(parseFile);
                    });
                });
                this.on('drop', function (file) {
                    //                    alert('file');
                    console.log('dropZone.drop');

                });
            }
        });
    }
}

/**
 * fitHeight - Directive for set height fit to window height
 */
function fitHeight() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.css("height", $(window).height() + "px");
            element.css("min-height", $(window).height() + "px");
        }
    };
}

/**
 *
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('dropZone', dropZone);