(function(){
            'use strict';
            var app = angular.module('TakeTask', ['onsen', 'TakeTask.connection']);
			app.controller('JobListController', ['$scope', '$window', 'connectService', JobListController]);
			app.controller('LoginController', ['$scope', '$window', 'connectService',LoginController]);
			app.controller('showJobDetailController', showJobDetailController);
			app.controller('takePicJobController', takePicJobController);
			app.controller('submitJobController', submitJobController);
			app.controller('bookmarkPageController', bookmarkPageController);
			app.controller('profileController', ['$scope', 'connectService',profileController]);
			app.controller('jobMapController', jobMapController);
			app.controller('MapViewController', MapViewController);
			app.controller('dateController', dateController);
			app.controller('popupController', popupController);
			app.controller('ItemController', ItemController);
})();


ons.ready(function(){
	if (localStorage.getItem("userToken"))
        appNavi.resetToPage('tabBar.html');
});

function LoginController ($scope, $window, connectService){
	
    $scope.login = function(id, password){

        connectService.login({user:id, pass:password}, function(){
            $scope.appNavi.resetToPage('tabBar.html');
        });

	};
    
    $scope.logout = function(){
        connectService.logout(function(){
            appNavi.resetToPage('login.html');
        });
    }
}



function JobListController($scope, $window, connectService){
	
			 $scope.items = [1,2,3];
			$scope.doRefresh = function() {
			$http.get('/new-items')
			 .success(function(newItems) {
			   $scope.items = newItems;
			 })
			 .finally(function() {
			   // Stop the ion-refresher from spinning
			   $scope.$broadcast('scroll.refreshComplete');
			 });
		  };
	
	
	
	refreshpage();
	
    
    function refreshpage(){
		connectService.connect('taketask_login.php',{action:"renew", token:localStorage.getItem("userToken")}, function ( data){
				if (data.length == 32){
					localStorage.setItem("userToken", data);
					localStorage.setItem("require_auth","");
					
					connectService.connect('getData.php',{token:localStorage.getItem("userToken")}, function (data){
						localStorage.setItem("jobList", angular.toJson(data));
						$scope.joblist = data;

					});
					
				}else{
					alert("Please Login to Continue...");
					appNavi.resetToPage('login.html');
				}	
		});
	};
	
    $scope.refresh = refreshpage;
	
    
    $scope.viewjob = function(job_num){
        
        for (i=0; i< $scope.joblist.length; i++){
            if ($scope.joblist[i].jobID == job_num){
                localStorage.setItem("last_job", angular.toJson($scope.joblist[i]));
            }
        }
        
        localStorage.setItem("capturePic","");
		localStorage.setItem("info_text","");
        appNavi.pushPage('detail.html');
    };
	
}


function showJobDetailController($scope){
    
    $scope.current_job = angular.fromJson(localStorage.getItem("last_job"));
	var page = 'jobMap.html';
	
	var onSuccess = function(position) {
		ActivityIndicator.hide();
		localStorage.setItem("currentPos",angular.toJson(position));
    //alert('Latitude: '          + position.coords.latitude          + '\n' +
    //      'Longitude: '         + position.coords.longitude         + '\n' +
    //      'Accuracy: '          + position.coords.accuracy          + '\n' +
    //      'Timestamp: '         + position.timestamp                + '\n');
		  appNavi.pushPage(page);
	};

	function onError(error) {
		ActivityIndicator.hide();
		localStorage.setItem("currentPos","");
		appNavi.pushPage(page);
	}
	
	$scope.taketask = function(){
		appNavi.pushPage('instruction.html');
		page = 'instruction.html';
	}
	
	$scope.gotoMap = function(){
		ActivityIndicator.show("Obtaining Location Data...");
		navigator.geolocation.getCurrentPosition(onSuccess,onError,{timeout: 7000, enableHighAccuracy: true});		
		page = 'jobMap.html';
	}
}



function takePicJobController($scope){
     
        if (localStorage.getItem("capturePic")){
            document.getElementById("previewImage").innerHTML = '<img style="width: 100%; height: 100%" src='+"data:image/jpeg;base64," +localStorage.getItem("capturePic")+">";
			document.getElementById("previewImageSize").innerHTML = "Image Size: ~" + Math.round(localStorage.getItem("capturePic").length / 1024) + "Kb";
		}
        
    
    $scope.takePic = function(){
        
        navigator.camera.getPicture(onSuccess, onFail,{   
                quality: 50, 
                PictureSourceType :Camera.PictureSourceType.CAMERA , 
                allowEdit: false,
                destinationType: Camera.DestinationType.DATA_URL, 
                saveToPhotoAlbum: false,
                correctOrientation: true
        });
        
        
        
        function onSuccess(imageURI){
            document.getElementById("previewImage").innerHTML = '<img style="width: 100%; height: 100%" src='+"data:image/jpeg;base64," +imageURI+">";
            localStorage.setItem("capturePic", imageURI);
			document.getElementById("previewImageSize").innerHTML = "Image Size: ~" + Math.round(localStorage.getItem("capturePic").length / 1024) + "Kb";
        }
        
        function onFail(message){
        }
    }
}



function submitJobController($scope,$http){
    
    if (localStorage.getItem("info_text"))
        $scope.infotext = localStorage.getItem("info_text");
    
    $scope.submitJob = function(){
		
		if (navigator.connection.type != Connection.WIFI){
			navigator.notification.confirm("Data Transmission may be charged by ISP when Wi-Fi is disabled. Do you wish to continue?",
				function(btnID){
					if (btnID<2)
						saveTask();
					else	
						uploadTask();	
			},"Warm Reminder", ["Save Progress","Upload Anyway"]);
		}else
			uploadTask();
    }
	
    
    $scope.saveProgress = saveTask;
	
	
	
	function uploadTask(){
		ActivityIndicator.show("Uploading..");
		
        localStorage.setItem("info_text", $scope.infotext);
        
        var job_var = angular.fromJson(localStorage.getItem("last_job"));
        
        var job_obj = {file:localStorage.getItem("capturePic"), 
                        token: localStorage.getItem("userToken"),
                        job:job_var.jobID, 
                        text:$scope.infotext};
         
        $http.post('http://137.189.97.77:8080/cgi/jobUpload.php',job_obj,{timeout:90000})
        .success(function(data){
            ActivityIndicator.hide();
			
			var i = parseInt(data);
			
            if (i){
				var db = window.openDatabase('TestTask1', '0.1', 'bookmarked', 65535);
				db.transaction(function(tx){tx.executeSql("delete from bookmarked where jobID =?",[job_var.jobID]);});
				
				alert("Upload Success!");
                $scope.appNavi.resetToPage('tabBar.html');
            }else if (data == "MOVE")
                alert("Photo is Empty. Please take the photo before upload.");
            else if (data == "LOGIN")
                alert("Login session is expired. Please re-login and try again.");
            else
                alert("Upload Failed. Please try again Later.");
        }).error(function(data, status){
			alert("failed " + data);
			alert(status);
			ActivityIndicator.hide();
			alert("Connection Timeout. Please Check your network connection");
		});
	}
	
	
	
	function saveTask(){
            var job_var = angular.fromJson(localStorage.getItem("last_job"));
            
            var db = window.openDatabase('TestTask1', '0.1', 'bookmarked', 65535);
            var data = [job_var.jobID, localStorage.getItem("last_job"),localStorage.getItem("capturePic"),$scope.infotext,job_var.jobDeadline];
            
            
            db.transaction(
                function(tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS bookmarked ('jobID' INT, 'job' TEXT, 'jobPhoto' TEXT, 'jobDescription' TEXT, 'jobDeadline' DateTime)");
                    tx.executeSql("select * from bookmarked where jobID = ?",[data[0]], function(tx,rs){
                        if (rs.rows.length > 0) 
                            tx.executeSql("delete from bookmarked where jobID = ?",[data[0]]);
                        tx.executeSql("insert into bookmarked values(?,?,?,?,?)",data);
						localStorage.setItem("defaultPage","bookmark.html");
                        appNavi.resetToPage('tabBar.html');
                    });
                }
            );
    
    };
}


	
function profileController($scope, connectService){
	$scope.bkjob = 0;
	var db = window.openDatabase('TestTask1', '0.1', 'bookmarked', 65535);
	
	db.transaction(function(tx) {
				
				tx.executeSql("delete from bookmarked where jobDeadline <= datetime('now')",[],function(tx,result){
					tx.executeSql("select * from bookmarked ",[],function(tx,result){
						$scope.bkjob = result.rows.length;
						$scope.$apply();
					});
				});
				
    });
	
	
    connectService.connect('taketask_login.php',{action:"show", token:localStorage.getItem("userToken")},function(data){
            if (data == "Fail")
                alert("There is a problem when retrieving your profile...");
            else{
                var profile = angular.fromJson(data);
                $scope.userdisplayName = profile.agentName;
                $scope.userloginName = profile.loginName;
                $scope.userBalance = profile.balance;
                $scope.completedJob = profile.completedJob;
            }
    });
	
}




function bookmarkPageController($scope){
    $scope.bookmarkList = [];
    
	var db = window.openDatabase('TestTask1', '0.1', 'bookmarked', 65535);
	
            
            db.transaction(function(tx) {
				
				tx.executeSql("delete from bookmarked where jobDeadline <= datetime('now')",[],function(tx,result){
					tx.executeSql("select * from bookmarked ",[],function(tx,result){
						for(i=0;i<result.rows.length; i++){
							$scope.bookmarkList[i] = angular.fromJson(result.rows.item(i).job);
						}	
						$scope.$apply();
					}, function(tx,error){
						//alert("Error("+error.code+") :"+error.message);
					});
				}, function(tx,error){
					//alert("Error("+error.code+") :"+error.message);
				});
				
            });
    
	
    $scope.viewBookmarkedJob = function(id){
        
         db.transaction(
                function(tx) {
                    tx.executeSql("select * from bookmarked where jobID = ?",[id],function(tx,result){
                        localStorage.setItem("last_job",result.rows.item(0).job);
                        localStorage.setItem("capturePic",result.rows.item(0).jobPhoto);
                        $scope.infotext = localStorage.setItem("info_text", result.rows.item(0).jobDescription);
                        
                    });
        });
        appNavi.pushPage('detail.html');
    };
}





function jobMapController($scope){

	var position = {};
	
	if (localStorage.getItem("currentPos")){
		position = angular.fromJson(localStorage.getItem("currentPos"));
	}else{
		position = { coords: {latitude: "22.4212272", longitude: "114.2099545"}};
	}
		
	
	var location = angular.fromJson(localStorage.getItem("last_job")).jobCoordinates.split(",");
	initializeMap(eval(location[0]),eval(location[1]));

	function initializeMap(lat, lng) {
 　　	var latlng = new google.maps.LatLng(lat, lng);
 　　	var myOptions = {
			zoom: 15,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
    　	};
	　	map1 = new google.maps.Map(document.getElementById("mapDiv1"),myOptions);
	
		var marker = new MarkerWithLabel({
			position: latlng,
			map: map1,
			labelContent: "Task Location",
			labelAnchor: new google.maps.Point(22, 0),
			labelClass: "map-task-label", // the CSS class for the label
			labelStyle: {opacity: 0.75}
		});
		
		if (position){
			mylatlng = new google.maps.LatLng(eval(position.coords.latitude), eval(position.coords.longitude));
			var marker2 = new MarkerWithLabel({
			position: mylatlng,
			map: map1,
			labelContent: "You are here",
			labelAnchor: new google.maps.Point(22, 0),
			labelClass: "map-current-label", // the CSS class for the label
			labelStyle: {opacity: 0.75}
			});
		}
	};
}


function MapViewController($scope){

	var position = {};
	
	ActivityIndicator.show("Obtaining Location Data...");
	navigator.geolocation.getCurrentPosition(function(pos) {
		ActivityIndicator.hide();
		position = pos;
	},function(error) {
		ActivityIndicator.hide();
	},{timeout: 7000, enableHighAccuracy: true});	
	
	if (localStorage.getItem("currentPos")){
		position = angular.fromJson(localStorage.getItem("currentPos"));
	}else{
		position = { coords: {latitude: "22.4179398", longitude: "114.207407"}};
	}
	var map = initializeMap(eval(position.coords.latitude), eval(position.coords.longitude));
	var job_var = angular.fromJson(localStorage.getItem("jobList"));
	
	var minD = 100;
	var minjob;
	for(var i=0;i<job_var.length;i++){
		var location = job_var[i].jobCoordinates.split(",");
		var d = Math.sqrt(Math.pow((eval(location[0])-eval(position.coords.latitude)), 2)+ Math.pow((eval(location[1])-eval(position.coords.longitude)), 2));
		if (minD>d){
			minD = d;
			minjob = job_var[i];
		}
	}

	for(var i=0;i<job_var.length;i++){
		var location = job_var[i].jobCoordinates.split(",");
		addMarker(map,eval(location[0]),eval(location[1]),job_var[i]);
	}
	
	function initializeMap(lat, lng) {
 　　	var latlng = new google.maps.LatLng(lat, lng);
 　　	var myOptions = {
			zoom: 15,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
    　	};
	　	map = new google.maps.Map(document.getElementById("mapDiv"),myOptions);
	
		var marker2 = new MarkerWithLabel({
			position: latlng,
			map: map,
			labelContent: "You are here",
			labelAnchor: new google.maps.Point(22, 0),
			labelClass: "map-current-label", // the CSS class for the label
			labelStyle: {opacity: 0.75}
			});
			
		return map;
	}
	
	
	function addMarker(map,lat, lng, job){
		var latlng2 = new google.maps.LatLng(lat, lng);
		var marker = {};
		if (minjob == job )
			marker = new MarkerWithLabel({
			position: latlng2,
			map: map,
			labelContent: "Recommended Task",
			labelAnchor: new google.maps.Point(22, 0),
			labelClass: "map-close-label", // the CSS class for the label
			labelStyle: {opacity: 0.75}
			});
		else
			marker = new MarkerWithLabel({
			position: latlng2,
			map: map,
			labelContent: "Task Location",
			labelAnchor: new google.maps.Point(22, 0),
			labelClass: "map-task-label", // the CSS class for the label
			labelStyle: {opacity: 0.75}
			});
		
		google.maps.event.addListener(marker, 'click', function() {
			localStorage.setItem("last_job",angular.toJson(job));
			localStorage.setItem("capturePic","");
			localStorage.setItem("info_text","");
			appNavi.pushPage('detail.html');
		});
		return map;
	}
	
}





function dateController($scope){

   $scope.date = 31;
   $scope.month = 12;
   $scope.year = 60;
   $scope.getNumber = function(num) {
        return new Array(num);   
   };
}



function popupController($scope,$ionicPopup,$timeout){
	

// Triggered on a button click, or some other target
$scope.showPopup = function() {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input type="password" ng-model="data.wifi">',
    title: 'Enter Wi-Fi Password',
    subTitle: 'Please use normal things',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.wifi) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.wifi;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });
  $timeout(function() {
     myPopup.close(); //close the popup after 3 seconds for some reason
  }, 3000);
 };
 // A confirm dialog
 $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Consume Ice Cream',
     template: 'Are you sure you want to eat this ice cream?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
 };

 // An alert dialog
 $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Invalid Email',
     template: 'Please enter correct email address.'
   });
   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 };
}

function ItemController($scope){

  $scope.items = ['Apple', 'Orange', 'Pear', 'Mango', 'Papaya'];

 
}