angular.module('youtube', ['ng']).run(function () {})
    .service('youtubePlayerApi', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {
    var service = $rootScope.$new(true);

    // Youtube callback when API is ready
    $window.onYouTubeIframeAPIReady = function () {
        $log.info('Youtube API is ready');
        service.ready = true;
        service.loadPlayer();
    };

    service.ready = false;
    service.playerId = "ytplayer";
    service.player = null;
    service.videoId = "zjYxNnzNhRs";
    service.playerHeight = '200';
    service.playerWidth = '356';

    service.bindVideoPlayer = function (elementId) {
        service.playerId = elementId;
        service.loadPlayer();
    };

    service.createPlayer = function () {
        return new YT.Player(this.playerId, {
            height: this.playerHeight,
            width: this.playerWidth,
            videoId: this.videoId,
            playerVars: {
                controls: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0
            }
        });
    };

    service.loadPlayer = function () {
        // API ready?
        if (this.ready && this.playerId && this.videoId) {
            if (this.player) {
                this.player.destroy();
            }
            this.player = this.createPlayer();
        }
    };

    return service;
}])
    .directive('youtubePlayer', ['youtubePlayerApi', function (youtubePlayerApi) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            youtubePlayerApi.bindVideoPlayer(element[0].id);
        }
    };
}]);

app.factory('Player', ['youtubePlayerApi', function (youtubePlayerApi) {
    return youtubePlayerApi;
}]);