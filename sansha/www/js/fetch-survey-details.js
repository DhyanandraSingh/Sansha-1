(function() {
  
  var app = angular.module("myApp", []);

  app.controller('myCtrl', ['$scope', '$http', 'myService', '$timeout',
    
    function ($scope, $http, myService, $timeout) {

      myService.getData(function(dataResponse) {

          $scope.surveys = dataResponse;
          
          $scope.selections = [];

          var numInternalArrays = $scope.surveys.length;
          for (var i = 0; i < numInternalArrays; i++) {
            $scope.selections[i] = [];
          }
          
          var tmp = 0;
          $scope.index = 0;
        
          function findAndRemove(array, property, value) {
            array.forEach(function(result, index) {
              if(result[property] === value) {
                array.splice(index, 1);
                tmp = 1;
              } 
            });
          }
          
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

      $scope.previousQuestion = function() {
        $scope.index -= 1;
        $scope.hideSidebarItem = false;
        $scope.isQuestionTrue = [];
        $scope.hideEditButton = true;
      }
      
      $scope.newSelections = [];
      
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
          $scope.index = 0;
        }

        $scope.isQuestionTrue = [];
        $scope.checkSubCategoryValueIsNull = [];

        if (!$scope.Question) {
          return;
        }

        angular.forEach($scope.Question, function(value, key) {
          if (value.isQuestion) {
            $scope.i = 0;
            $scope.isQuestionTrue.push(value);
          }
        });
        
        if($scope.isQuestionTrue.length) {
          $scope.hideSidebarItem = true;
          angular.forEach($scope.isQuestionTrue, function(value, key) {
            $scope.selections[$scope.index].push({
              questionId: $scope.surveys[$scope.index].questionId,
              categoryId: value.categoryId,
              categoryName: value.categoryName,
              storeId: 1,
              comment: ""
            });
          });
          // $("#wrapper").toggleClass("toggled");
        } 
        else {
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