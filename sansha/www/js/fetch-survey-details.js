(function() {

  var app = angular.module("myApp", []);

  app.controller('myCtrl', ['$scope', '$http', 'myService', '$timeout',

    function ($scope, $http, myService, $timeout) {

      var tmp = 0;

      function findAndRemove(array, property, value) {
        array.forEach(function(result, index) {
          if(result[property] === value) {
            array.splice(index, 1);
            tmp = 1;
          }
        });
      }

      myService.getData(function(dataResponse) {

          $scope.surveys = dataResponse;

          $scope.selections = [];

          var numInternalArrays = $scope.surveys.length;
          for (var i = 0; i < numInternalArrays; i++) {
            $scope.selections[i] = [];
          }

          $scope.index = 0;

          $scope.toggleSelectionCheckbox = function (QuestionId, value) {
            tmp = 0;
            if (!value) { return; }
            findAndRemove($scope.selections[$scope.index], 'categoryId', value.subCategoryId);
            if (tmp != 1) {
              $scope.selections[$scope.index].push({
                questionId: QuestionId.questionId,
                categoryId: value.subCategoryId,
                categoryName: value.subCategoryName,
                storeId: 1,
                comment: ""
              });
            }
          };

          $scope.submitSelection = function() {
            $scope.value = $scope.selections[$scope.index];
            $scope.hideSubmitButton = true;
            $scope.disableCheckbox = true;
            $scope.hideEditButton = true;
            $("span").removeClass("subcategory-item");
            $("ul li label span").css("color", "#636D7A");
          }

      });

      $scope.onlyRadioButtonGetQuestionId = function(QuestionId, a) {
        $scope.selections[$scope.index][$scope.inc].questionId = QuestionId.questionId;
        $scope.selections[$scope.index][$scope.inc].storeId = 1;
      }

      $scope.pre = 0;
      $scope.array = [];
      $scope.i = 0;

      $scope.EditSelection = function() {
        $scope.hideEditButton = false;
        $scope.hideSubmitButton = false;
        $scope.disableCheckbox = false;
        $scope.value = false;
        $("ul li label span").addClass("subcategory-item");
      }

      $scope.inc = 0;

      $scope.items = [];

      $scope.next = function() {
        $scope.inc += 1;
      }

      $scope.prev = function() {
        $scope.inc -= 1;
      }

      $scope.addValue = function(val) {
        $scope.selection = {
          "surveyResultTestDtos" : $scope.selections,
          "customerDetailDto" : val
        }

         $http.post("http://localhost:8080/TheSanshaWorld/sfcms/save-survey-result-data", $scope.selection).success(function(data, status) {
           alert("data", data)
         });
       }

      var prevFlag = 0;

      $scope.previousQuestion = function() {

        $scope.index -= 1;
        $scope.inc = 0;
        prevFlag = 1;
        // Check if subcategoryId is null or not
        angular.forEach($scope.surveys[$scope.index].category, function(value) {

          angular.forEach(value.categoryItemDto, function(value1) {

            if (value1.subCategoryId != undefined) {

              $scope.hideSidebarItem = false;
              $scope.viewQuestionTrue = false;
              $scope.hideEditButton = true;

            } else {

              if ($scope.surveys[$scope.index] != undefined) {
                if ($scope.surveys[$scope.index].category) {
                  $scope.Question = $scope.surveys[$scope.index].category;
                }
              }

              $scope.isQuestionTrue = [];

              angular.forEach($scope.Question, function(value) {
                if (value.isQuestion) {
                  $scope.isQuestionTrue.push(value);
                }
              });

              $scope.showOnlyRadioButton = false;
              $scope.viewQuestionTrue = true;
            }

          });
        });
        if ($scope.surveys[$scope.index].questionType == "2") {
          $scope.noIndex = false;
          $scope.showOnlyRadioButton = true;
        }
      }

      $scope.nextQuestion = function() {
        $scope.index += 1;
        $scope.inc = 0;
        $scope.value = false;
        $scope.hideEditButton = false;
        /*  Find Each value of category and store as Question */
        if ($scope.surveys[$scope.index] != undefined) {
          if ($scope.surveys[$scope.index].category) {
            $scope.Question = $scope.surveys[$scope.index].category;
          }
        } else {
          // $scope.index = 0;
          $scope.showOnlyRadioButton = false;
          $scope.noIndex = true;
          return;
        }

        $scope.isQuestionTrue = [];
        $scope.checkSubCategoryValueIsNull = [];

        if (!$scope.Question) return;

        angular.forEach($scope.Question, function(value, key) {
          if (value.isQuestion) {
            $scope.isQuestionTrue.push(value);
          }
        });

        if($scope.isQuestionTrue.length) {

          $scope.viewQuestionTrue = true;
          $scope.hideSidebarItem = true;

          /* if user goes previous que. and go back then not override array. so, skip this step  */
          if (prevFlag === 0) {
            angular.forEach($scope.isQuestionTrue, function(value, key) {
              for(var i = 2 ; i < $scope.isQuestionTrue.length ; i++) {
                $scope.selections[$scope.index].push({
                  questionId: $scope.surveys[$scope.index].questionId,
                  categoryId: value.categoryId,
                  categoryName: value.categoryName,
                  answer: "",
                  storeId: 1,
                  comment: ""
                });
              }
            });
          }
          prevFlag = 0;
          // $("#wrapper").toggleClass("toggled");
          // $scope.toggleHide = true;
        } else {
           $scope.viewQuestionTrue = false;
          // $scope.hideSubmitButton = false;
          // $scope.selections = [];
          // $scope.hideSidebarItem = false;
          // angular.forEach(value.categoryItemDto, function(value, key) {
          //   if (value.subCategoryId === null ) {
          //     $scope.checkSubCategoryValueIsNull.push(value);
          //   } else {
          //     $scope.hideSubmitButton = false;
          //     $scope.disableCheckbox = false;
          //   }
          // });
          $scope.showOnlyRadioButton = true;
          if (prevFlag === 0) {
            $scope.selections[$scope.index].push({
              questionId: $scope.surveys[$scope.index].questionId,
              categoryId: $scope.surveys[$scope.index].categoryId,
              categoryName: "",
              comment: "",
              answer: "",
              storeId: 1,
            });
          }
        }
      }
  }]);

  app.service('myService', function($http) {
    this.getData = function(callbackFunc) {
      $http({
          method: 'GET',
          url: "http://localhost:8080/TheSanshaWorld/sfcms/fetch-survey-details"
        }).success(function(data){
          callbackFunc(data);
      }).error(function(){
          alert("error");
      });
    }
  });

})();
