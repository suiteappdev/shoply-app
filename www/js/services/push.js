    angular.module('starter').service('RequestsService', ['$http', '$q', '$ionicLoading', 'constants',  RequestsService]);

    function RequestsService($http, $q, constants, storage){

        function register(device_token){
            var deferred = $q.defer();
            
            var _data = {
                user : angular.fromJson(storage.get("user")._id),
                device_token : device_token
            };

            $http.post(constants.base_url +'push/register/' + _data.user, _data)
                .success(function(response){
                    deferred.resolve(response);
                })
                .error(function(data){
                    deferred.reject(data);
                });

            return deferred.promise;

        };


        return {
            register: register
        };
    }
