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
            if (!value) return;
            findAndRemove($scope.selections[$scope.index], 'subCategoryName', value.subCategoryName);
            if (tmp != 1) {
              $scope.selections[$scope.index].push({
                questionId: QuestionId.questionId,
                subCategoryId: value.subCategoryId,
                subCategoryName: value.subCategoryName,
                storeId: 1
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
        // console.log("AAA", $scope.selections[$scope.index][$scope.inc])
        $scope.selections[$scope.index][$scope.inc].questionId = QuestionId.questionId;
      }
      
      $scope.pre = 0;
      $scope.array = [];
      
      $scope.myClick = function(QuestionId, id, name, radioValue) {
        for (var i = 0; i < $scope.array.length; i++) {
          if ($scope.array[i].queCategoryName === name) {
            $scope.array.splice(i, 1);
            break;
          }
        }
        $scope.array.push({
          questionId: QuestionId.questionId,
          categoryId: id,
          queCategoryName: name,
          itemId: radioValue
        });
      }
      
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
        
          if ($scope.selections[$scope.index].length == 0) {
            $scope.newSelections = $scope.newSelections.concat($scope.array);
          } else {
            $scope.newSelections = $scope.newSelections.concat($scope.selections[$scope.index]);
          }
          console.log("LL", $scope.newSelections)
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
        //  $scope.hideSidebarItem = false;
        //  $scope.hideEditButton = true;
        //  $scope.showOnlyRadioButton = false;
        //  $scope.inc= 0;
        //  $scope.value = false;
          // var res = $http.post("http://localhost:8080/TheSanshaWorld/sfcms/save-survey-result-data", $scope.newSelections[0]);
          // res.success(function(data, status, headers, config) {
          //   $scope.message = data;
          //   alert("data"+ data);
          // });
          // res.error(function(data, status, headers, config) {
          //   alert( "failure message: " + JSON.stringify({data: data}));
          // });	
        console.log("AAA", $scope.newSelections);
        }

        $scope.isQuestionTrue = [];
        $scope.checkSubCategoryValueIsNull = [];

        if (!$scope.Question) {
          return;
        }

        angular.forEach($scope.Question, function(value, key) {

          if (value.isQuestion) {
            $scope.isQuestionTrue.push(value);
            // $("#wrapper").toggleClass("toggled");
          }

          // Check if isQuestion is true or false
          // if it is true, then we show all categoryName and radio button on same page, and do not show sidebar
          // if it is false, then we have to check again
          // 1) if subCategoryId is null or not, if it is null then we assign categoryName as a checkbox
          // 2) if is not null, then assign categoryName and subcategoryName 
          if($scope.isQuestionTrue.length) {
            $scope.hideSidebarItem = true;
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
        });
      }
  }]);

  app.service('myService', function($http) {
    this.getData = function(callbackFunc) {
      $http({
          method: 'GET',
          url: "http://localhost:8080/TheSanshaWorld/sfcms/fetch-survey-details"
        }).success(function(data){
          // With the data succesfully returned, call our callback
          callbackFunc(data);
      }).error(function(){
          alert("error");
      });
    }
  });

})();