const spotAuthController = function() {
  this.authGet = () => {
    $.ajax({
      type: 'GET',
      url: '/mylists',
      success: function(result) {
        $('#playlists').html('');
        for (var i = 0; i < result.items.length; i++) {
          $('#playlists').append(
            '<h1>' + result.items[i].name + '</h1>' + '<img src="' + result.items[i].images[0].url + '" width="30%" />'
          );
        }
      },
      error: function(err) {
        console.log('err: ', err);
      }
    })
  }
};

const SpotAuth = function() {
  return {
    scope: {},
    restrict: 'E',
    controller: spotAuthController,
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: '/templates/spotauth.html'
  };
};

angular.module('tribal').directive('spotauth', SpotAuth);