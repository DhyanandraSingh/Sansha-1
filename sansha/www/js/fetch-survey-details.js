(function() {
  
  var app = angular.module("myApp", []);

  app.controller('myCtrl', ['$scope', '$http',
      
    function ($scope, $http) {
    
    $http.get("http://localhost:8080/TheSanshaWorld/sfcms/fetch-survey-details").success(function(data) {
      $scope.surveys = data;
    });

    $scope.index = 0;
    $scope.pre = 0;

    $scope.selections = [];

    var tmp = 0;

    function findAndRemove(array, property, value) {
      array.forEach(function(result, index) {
        if(result[property] === value) {
          array.splice(index, 1);
          tmp = 1;
        } 
      });
    }
    
    $scope.toggleSelectionCheckbox = function (value) {
      tmp = 0;
      findAndRemove($scope.selections, 'subCategoryId', value.subCategoryId);
      if (tmp != 1) {
        $scope.selections.push({
          subCategoryId: value.subCategoryId,
          subCategoryName: value.subCategoryName,
          storeId: 1
        });
      }
    };

    $scope.array = [];
    
    $scope.myClick = function(id, name, radioValue) {
      for (var i = 0; i < $scope.array.length; i++) {
        if ($scope.array[i].queCategoryName === name) {
          $scope.array.splice(i, 1);
          break;
        }
      }
      $scope.array.push({
        categoryId: id,
        queCategoryName: name,
        itemId: radioValue
      });
    }

    $scope.submitSelection = function() {
      $scope.value = $scope.selections;
      $scope.hideSubmitButton = true;
      $scope.disableCheckbox = true;
      $scope.hideEditButton = true;
      $("span").removeClass("subcategory-item");      
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
    
    $scope.nextQuestion = function() {
      $scope.length = $scope.selections.length;
      $scope.index += 1;
      $scope.value = false;
      $scope.hideEditButton = false;
      /*  Find Each value of category and store as Question */
      if ($scope.surveys[$scope.index].category) {
        $scope.Question = $scope.surveys[$scope.index].category;
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
        } else {
          $scope.inc += 1;
          $scope.hideSidebarItem = false;
          angular.forEach(value.categoryItemDto, function(value, key) {
            if (value.subCategoryId === null ) {
              $scope.checkSubCategoryValueIsNull.push(value);
            } else {
              $scope.hideSubmitButton = false;
              $scope.disableCheckbox = false;
            }
          });
        }
      });

      if ($scope.array.length) {
        $scope.newSelections = $scope.selections.concat($scope.array);
      }
    }

  }]);

})();