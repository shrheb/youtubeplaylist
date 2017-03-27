// Code goes here

var app = angular.module('myApp', ['youtube']);

app.factory('youtubeSearch', function ($q, $http,$rootScope) {

    return {

        getYoutubeData: function (search) {
            var deferred = $q.defer();
            var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyBkLQiJRCGWlMsroWR6ccJ3TAlvioWpOZY&q=" + search;

            $http.get(url).success(function (json) {
                $rootScope.videos = json.items[0];
                console.log($rootScope.videos);
                deferred.resolve($rootScope.videos);
            }).error(function (error) {
                console.log(JSON.stringify(error));
            });
            return deferred.promise;
        }
    };
});



app.controller('YoutubeSearchController', ['$scope', 'youtubeSearch', 'Player', '$timeout', '$rootScope','$rootScope','$http', function ($scope, youtubeSearch, Player, $timeout, $rootScope,$rootScope,$http) {

    $scope.player = Player;
    $scope.search = "Enter search string";
    $scope.videos = [];
    $scope.startTime=0;
    $scope.endTime=900;
    $scope.Totalcount=100;

		$scope.editPlaylistView = false;

		$scope.searchView = true;
		  $scope.playlistVideos = [
             {title: "You and Me - Penny & The Quarters", thumbnail: "http://i.ytimg.com/vi/zjYxNnzNhRs/0.jpg",startTime:40,endTime:9999999, url: "http://www.youtube.com/watch?v=zjYxNnzNhRs&feature=youtube_gdata", duration: 186, videoId: "zjYxNnzNhRs" },
         
        ];  
       
        $scope.playlistVideosTemp=localStorage.getItem('playlistData');
        if($scope.playlistVideosTemp)
        {
       //     alert("not null")

            $scope.playlistVideos=JSON.parse($scope.playlistVideosTemp);
            console.log($scope.playlistVideos);
        }
		$scope.currentVideo = $scope.playlistVideos[0];
		$scope.currentVideoIndex = 0;
				
		$scope.removeVideo = function(index) {
			$scope.playlistVideos.splice(index, 1);
            localStorage.setItem('playlistData',JSON.stringify($scope.playlistVideos));
		};
    

    $scope.$watch(function combinedWatch() {
        return {
            search: $scope.search
        };
    }, function (value) {
        if (value.search) {
            $scope.videos = [];
            var promise = youtubeSearch.getYoutubeData($scope.search);

            promise.then(function (videosData) {
                // $scope.videos = data;
                angular.forEach(videosData, function (video) {
										var searchVideo = {};
                    console.log("video");
                    console.log($rootScope.videos);
                    searchVideo.title = $rootScope.videos.snippet.title;
                   // alert(searchVideo.title);
                    searchVideo.thumbnail = $rootScope.videos.snippet.thumbnails.default.url;
                    console.log("videothumbbbb");
                    console.log(searchVideo.thumbnail);
                  //  alert()
                    searchVideo.url = "https://www.youtube.com/watch?v="+$rootScope.videos.id.videoId;
                    console.log(searchVideo.url);
               //     searchVideo.duration = video.media$group.media$content[0].duration;
                    searchVideo.starTime= $scope.startTime;
                   // alert(searchVideo.starTime);
                    searchVideo.videoId =$rootScope.videos.id.videoId;
										$scope.videos.push(searchVideo);
                });
            });

        }
    }, true);
    
    $scope.addVideo = function (video) {
      video.starTime=$scope.startTime;
      video.endTime=$scope.endTime;
      console.log(video);

      this.playlistVideos.push(video);
			this.videos.splice(this.videos.indexOf(video), 1);
            localStorage.setItem('playlistData',JSON.stringify(this.playlistVideos));
           

    };

		$scope.togglePlaylistView = function() {
			$scope.editPlaylistView = !$scope.editPlaylistView;
		};
		
		$scope.toggleSearchView = function() {
      $scope.searchView = !$scope.searchView;
		};
		
		$scope.nextVideo = function() {
			// technically, if you took out all the songs, and then clicked next, it would throw an error, but this is just for the fiddle.
			nextIndex = $scope.currentVideoIndex >= $scope.playlistVideos.length - 1 ? 0 : $scope.currentVideoIndex + 1;
			$scope.playVideo($scope.playlistVideos[nextIndex]);
		};
		
		$scope.previousVideo = function() {
			var previousIndex = $scope.currentVideoIndex === 0 ? $scope.playlistVideos.length - 1 : $scope.currentVideoIndex - 1;
			$scope.playVideo($scope.playlistVideos[previousIndex]);
		};
		
	$scope.togglePlayerState = function() {
      var video1=this.player.player;
      var playerState = this.player.player.getPlayerState();
     /*   console.log(playerState);
        console.log(this.player.player);
        console.log(playerState);
    */
         
            if(playerState ===5)
            {

                     $scope.seekToTime=$scope.playlistVideos[$scope.currentVideoIndex].starTime;
                     this.player.player.seekTo($scope.seekToTime);
            }
       playerState == 1 ? this.player.player.pauseVideo() : this.player.player.playVideo();
          var Timer=setInterval(function(){ 
                var currtime= video1.getCurrentTime();
                var duration=video1.getDuration()-4;
                console.log(currtime);
                console.log("duration");
                console.log(duration);
                    if(duration <= currtime )
                    {
                        $scope.nextVideo();
                        clearInterval(myTimer);
                            if(nextIndex == 0)
                            {
                                alert("finished playing playlist...Press ok to replay the playlist");
                            }
              // 
                    }
          }, 3000);
       var url = "https://www.googleapis.com/youtube/v3/videos?id="+$scope.playlistVideos[$scope.currentVideoIndex].videoId+"&part=statistics&key=AIzaSyBkLQiJRCGWlMsroWR6ccJ3TAlvioWpOZY";

            $http.get(url).success(function (json) {
                   $scope.views = json;
                  console.log("views are");
                      $scope.Totalcount=$scope.views.items[0].statistics.viewCount;
             }).error(function (error) {
                    console.log(JSON.stringify(error));
            });
			
		};

    $scope.playVideo = function(video) {
            //    alert("calling");
		this.currentVideo = video;
        var video1=this.player.player;
		this.currentVideoIndex = this.playlistVideos.indexOf(video);
        $scope.seekToTime=$scope.playlistVideos[this.currentVideoIndex].starTime;
        console.log($scope.playlistVideos[$scope.currentVideoIndex]);
        $scope.seekToendTime=$scope.playlistVideos[this.currentVideoIndex].endTime;
        console.log($scope.seekToTime);
            //    alert($scope.seekToendTime);
            var myTimer=setInterval(function(){ 
                var currtime= video1.getCurrentTime();
                var duration=video1.getDuration()-4;
                console.log(currtime);
                console.log("duration");
                console.log(duration);
                    if(duration <= currtime || currtime >= $scope.seekToendTime)
                    {
                                 $scope.nextVideo();
                                 clearInterval(myTimer);
             
                         if(nextIndex == 0)
                        { 
                            alert("finished playing playlist...Press ok to replay the playlist");
                        }
                    }
             }, 3000);
    	 this.player.player.loadVideoById(video.videoId,$scope.seekToTime);
         console.log(this.player.player);
         var url = "https://www.googleapis.com/youtube/v3/videos?id="+video.videoId+"&part=statistics&key=AIzaSyBkLQiJRCGWlMsroWR6ccJ3TAlvioWpOZY";            
                $http.get(url).success(function (json) {
                        $scope.views = json;
                        console.log("views are");
                        $scope.Totalcount=$scope.views.items[0].statistics.viewCount;
                }).error(function (error) {
                        console.log(JSON.stringify(error));
                });
           
  
    };
             
                  
 

}]);