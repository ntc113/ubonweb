'use strict';

/* Controllers */

angular.module('ubon.controller', [
	'ubon.i18n',
	'ubon.services'
])

.controller ('welcomeCtrl', function ($scope, $location, $modal, $modalStack, ErrorService) {
	$scope.login = function () {
		ErrorService.confirm({
	        type: 'REQUIRED_MOBILEAPP',
	    }).then(function () {
	        $location.url ('/login');
	    });
	}

})

.controller ('loginCtrl', function ($scope, $rootScope, $location, $timeout, $modal, $modalStack, ErrorService, _) {
	var options = {dcID: 113, createNetworker: false},
        countryChanged = false,
        selectedCountry = false;

	$scope.credentials = {phone_country: '', phone_country_name: '', phone_number: '', phone_full: ''};
    $scope.progress = {};

    $scope.chooseCountry = function () {
      var modal = $modal.open({
        templateUrl: templateUrl('country_select_modal'),
        controller: 'CountrySelectModalController',
        windowClass: 'countries_modal_window mobile_modal'
      });

      modal.result.then(selectCountry);
    };

    function initPhoneCountry () {
      var langCode = (window.navigator.userLanguage || window.navigator.language).toLowerCase(), // get language by browser
          countryIso2 = Config.LangCountries[langCode],
          shouldPregenerate = !Config.Navigator.mobile;

      if (['en', 'en-us', 'en-uk'].indexOf(langCode) == -1) {
        if (countryIso2 !== undefined) {
          selectPhoneCountryByIso2(countryIso2);
        } else if (langCode.indexOf('-') > 0) {
          selectPhoneCountryByIso2(langCode.split('-')[1].toUpperCase());
        } else {
          selectPhoneCountryByIso2('US');
        }
      } else {
        selectPhoneCountryByIso2('US');
      }

      if (!shouldPregenerate) {
        return;
      }
    }

    function selectPhoneCountryByIso2 (countryIso2) {
      var i, country;
      for (i = 0; i < Config.CountryCodes.length; i++) {
        country = Config.CountryCodes[i];
        if (country[0] == countryIso2) {
          return selectCountry({name: _(country[1] + '_raw'), code: country[2]});
        }
      }
      return selectCountry({name: _('country_select_modal_country_us_raw'), code: '+1'});
    }

    function selectCountry (country) {
      selectedCountry = country;
      if ($scope.credentials.phone_country != country.code) {
        $scope.credentials.phone_country = country.code;
      } else {
        updateCountry();
      }
      $scope.$broadcast('country_selected');
    }
    function updateCountry () {
      var pn = $scope.credentials.phone_number || '';
      if (pn != '' && pn.indexOf('0') == 0) {
        $scope.credentials.phone_number = pn.substring(1);
      };
      var phoneNumber = (
            ($scope.credentials.phone_country || '') +
            ($scope.credentials.phone_number || '')
          ).replace(/\D+/g, ''),
          i, j, code,
          maxLength = 11,
          maxName = false;

      if (phoneNumber.length) {
        if (selectedCountry && !phoneNumber.indexOf(selectedCountry.code.replace(/\D+/g, ''))) {
          maxName = selectedCountry.name;
        } else {
          for (i = 0; i < Config.CountryCodes.length; i++) {
            for (j = 2; j < Config.CountryCodes[i].length; j++) {
              code = Config.CountryCodes[i][j].replace(/\D+/g, '');
              if (code.length > maxLength && !phoneNumber.indexOf(code)) {
                maxLength = code.length;
                maxName = _(Config.CountryCodes[i][1] + '_raw');
              }
            }
          }
        }
      }

      $scope.credentials.phone_full = phoneNumber;
      $scope.credentials.phone_country_name = maxName || _('login_controller_unknown_country_raw');
    };

    $scope.$watch('credentials.phone_country', updateCountry);
    $scope.$watch('credentials.phone_number', updateCountry);
    initPhoneCountry();

    $scope.editPhone = function () {
      delete $scope.credentials.phone_code;
      delete $scope.credentials.phone_code_hash;
      delete $scope.credentials.phone_unoccupied;
      delete $scope.credentials.phone_code_valid;
      delete $scope.credentials.viaApp;
    }
})

.controller ('imCtrl', function () {
	
})



.controller('CountrySelectModalController', function ($scope, $modalInstance, $rootScope, SearchIndexManager, _) {

	$scope.search = {};
	$scope.slice = {limit: 20, limitDelta: 20}

	var searchIndex = SearchIndexManager.createIndex();

	for (var i = 0; i < Config.CountryCodes.length; i++) {
	  var searchString = Config.CountryCodes[i][0];
	  searchString += ' ' + _(Config.CountryCodes[i][1] + '_raw');
	  searchString += ' ' + Config.CountryCodes[i].slice(2).join(' ');
	  SearchIndexManager.indexObject(i, searchString, searchIndex);
	}

	$scope.$watch('search.query', function (newValue) {
	  var filtered = false,
	      results = {};

	  if (angular.isString(newValue) && newValue.length) {
	    filtered = true;
	    results = SearchIndexManager.search(newValue, searchIndex);
	  }

	  $scope.countries = [];
	  $scope.slice.limit = 20;

	  var j;
	  for (var i = 0; i < Config.CountryCodes.length; i++) {
	    if (!filtered || results[i]) {
	      for (j = 2; j < Config.CountryCodes[i].length; j++) {
	        $scope.countries.push({name: _(Config.CountryCodes[i][1] + '_raw'), code: Config.CountryCodes[i][j]});
	      }
	    }
	  }
	  if (String.prototype.localeCompare) {
	    $scope.countries.sort(function(a, b) {
	      return a.name.localeCompare(b.name);
	    });
	  }
	});
})
;