var app = angular.module('ShopSmileController', []);

app.controller('ShopSmileCtrl', function ($scope, $rootScope, $firebaseObject, $routeParams, $route) {
    console.log("Reset sau xoa");

    var ref = firebase.database().ref();

    var syncObject = $firebaseObject(ref);
    syncObject.$bindTo($scope, "data");

    $scope.isLogin = false;
    $scope.isAvatar = false;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (user.photoURL == null) {

            } else {
                $scope.isAvatar = true;
                $scope.userAvatar = user.photoURL;
            }

            if (user.displayName == null) {
                $scope.userName = user.email;
            } else {
                $scope.userName = user.displayName;
            }

            $scope.linkInvite = 'http://www.1312168nchai.esy.es/DoAnCuoiKi/index.html#/regiter/' + user.uid;
            $scope.isLogin = true;
            $scope.resetLogin();
            $scope.$apply();
        } else {

        }
    });

    function filerByUID(data) {
        var user = firebase.auth().currentUser;
        return data.salesman.uid === user.uid;
    };

    $scope.loadPage = function (key, pageNumber = 0) {
        $scope.currentPage = pageNumber;
        $scope.myListTypeProduct = [];
        $scope.itemListName = key;
        listItems = [];
        if (key == 'MyPost') {
            var listProduct = Object.keys($scope.data['products']);
            listProduct.forEach(function (keyList) {
                var resultFilter = $scope.data['products'][keyList].filter(filerByUID);
                for (i = 0; i < resultFilter.length; i++) {
                    $scope.myListTypeProduct.push(keyList);
                }

                listItems = listItems.concat($scope.data['products'][keyList].filter(filerByUID));
            });
            console.log("DSSP:" + $scope.myListTypeProduct);
            $rootScope.outItems = listItems.slice(parseInt(pageNumber) * 6, parseInt(pageNumber) * 6 + 6);
            $rootScope.maxPages = listItems.length / 6;
        } else {
            listItems = $scope.data['products'][key];
            $rootScope.outItems = listItems.slice(parseInt(pageNumber) * 6, parseInt(pageNumber) * 6 + 6);
            $rootScope.maxPages = listItems.length / 6;
        };
    };


    var providerFace = new firebase.auth.FacebookAuthProvider();
    providerFace.addScope('public_profile');

    $scope.loginFacebook = function () {
        firebase.auth().signInWithPopup(providerFace).then(function (result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            $scope.messageError = "Đăng nhập thành công";
            $scope.userName = result.user.displayName;
            if (result.user.photoURL == null) {

            } else {
                $scope.isAvatar = true;
                $scope.userAvatar = result.user.photoURL;
            }
            $scope.isLogin = true;
            $('#mySignIn').modal('hide');

            var user = firebase.auth().currentUser;
            if ($scope.data['users'][user.uid] != undefined) {
                $scope.userCoin = $scope.data['users'][user.uid]['coin'];
                $scope.$apply();
                return;
            } else {
                var postData = {
                    coin: 100
                };

                var newPostKey = user.uid;
                var updates = {};
                updates['/users/' + newPostKey] = postData;
                ref.update(updates);
            }

            $scope.$apply();
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    };

    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    $scope.loginGoogle = function () {
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            $scope.messageError = "Đăng nhập thành công";
            $scope.userName = result.user.displayName;
            if (result.user.photoURL == null) {

            } else {
                $scope.isAvatar = true;
                $scope.userAvatar = result.user.photoURL;
            }

            $scope.isLogin = true;
            $('#mySignIn').modal('hide');

            var user = firebase.auth().currentUser;
            if ($scope.data['users'][user.uid] != undefined) {
                $scope.userCoin = $scope.data['users'][user.uid]['coin'];
                $scope.$apply();
                return;
            } else {
                var postData = {
                    coin: 100
                };

                var newPostKey = user.uid;
                var updates = {};
                updates['/users/' + newPostKey] = postData;
                ref.update(updates);
            }

            $scope.$apply();
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    };

    $scope.createAccount = function () {
        firebase.auth().createUserWithEmailAndPassword($scope.userEmail, $scope.userPassword).then(function () {
            // The signed-in user info.
            $scope.messageError = "Tạo tài khoản thành công";
            $('#mySignIn').modal('hide');

            var user = firebase.auth().currentUser;
            if ($scope.data['users'][user.uid] != undefined) {
                $scope.userCoin = $scope.data['users'][user.uid]['coin'];
                $scope.$apply();
                return;
            } else {
                if ($routeParams.uid != undefined) {
                    if ($scope.data['users'][$routeParams.uid] != undefined) {
                        var temp = $scope.data['users'][$routeParams.uid]['coin'] += 50;

                        var post = {
                            coin: temp
                        };

                        var newPostKey = $routeParams.uid;
                        var updat = {};
                        updat['/users/' + newPostKey] = post;

                        ref.update(updat);
                    }
                }
                var postData = {
                    coin: 100
                };

                var newPostKey = user.uid;
                var updates = {};
                updates['/users/' + newPostKey] = postData;
                ref.update(updates);
            }


            $scope.$apply();

        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/email-already-in-use') {
                $scope.messageError = "Email tài khoản đã tồn tại";
            } else if (errorCode == 'auth/invalid-email') {
                $scope.messageError = "Email không hợp lệ";
            } else if (errorCode == 'auth/operation-not-allowed') {
                $scope.messageError = "Tài khoản không thể dùng được";
            } else if (errorCode == 'auth/weak-password') {
                $scope.messageError = "Mật khẩu không đủ mạnh để đăng kí";
            }
            $scope.$apply();
        });
    };

    $scope.userPassword = "";
    $scope.loginAccount = function () {
        firebase.auth().signInWithEmailAndPassword($scope.userEmail, $scope.userPassword).then(function () {
            // The signed-in user info.
            $scope.messageError = "Đăng nhập thành công";
            $scope.userName = $scope.userEmail;
            $scope.isLogin = true;
            $('#mySignIn').modal('hide');

            var user = firebase.auth().currentUser;
            if ($scope.data['users'][user.uid] != undefined) {
                $scope.userCoin = $scope.data['users'][user.uid]['coin'];
                $scope.$apply();
                return;
            } else {
                var postData = {
                    coin: 100
                };

                var newPostKey = user.uid;
                var updates = {};
                updates['/users/' + newPostKey] = postData;
                ref.update(updates);
            }

            $scope.$apply();
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/user-disabled') {
                $scope.messageError = "Tài khoản đã bị khóa";
            } else if (errorCode == 'auth/invalid-email') {
                $scope.messageError = "Email không hợp lệ";
            } else if (errorCode == 'auth/user-not-found') {
                $scope.messageError = "Tài khoản không tồn tại";
            } else if (errorCode == 'auth/wrong-password') {
                $scope.messageError = "Mật khẩu không đúng";
            } else if (errorCode == 'auth/argument-error') {
                $scope.messageError = "Nhập đầy đủ tài khoản và mật khẩu";
            }
            $scope.$apply();
        });
    };


    $scope.logout = function () {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            $scope.userName = "";
            $scope.isLogin = false;
            $scope.$apply();
        }, function (error) {
            // An error happened.
        });
    };
    ////////////////////////////////////////////////////////////////////////////////////////////
    $scope.getNumber = function (num) {
        intNum = parseInt(num);
        if (isNaN(intNum)) {
            intNum = 0;
        }
        if (intNum < num) {
            intNum = intNum + 1;
        }
        return new Array(intNum);
    };

    $scope.loadDetail = function (index, key = "") {
        index = parseInt(index);

        if (key != "") {
            switch (key) {
                case 'vehicles':
                    $rootScope.product = $scope.vehiclesHotProducts[index];
                    break;
                case 'houses':
                    $rootScope.product = $scope.housesHotProducts[index];
                    break;
                case 'fashions':
                    $rootScope.product = $scope.fashionsHotProducts[index];
                    break;
                case 'electrical_equipments':
                    $rootScope.product = $scope.electrical_equipmentsHotProducts[index];
                    break;
                case 'mobiles':
                    $rootScope.product = $scope.mobilesHotProducts[index];
                    break;
                case 'jobs':
                    $rootScope.product = $scope.jobsHotProducts[index];
                    break;
                case 'housewares':
                    $rootScope.product = $scope.housewaresHotProducts[index];
                    break;
                case 'books':
                    $rootScope.product = $scope.booksHotProducts;
                    break;
                case 'sports':
                    $rootScope.product = $scope.sportsHotProducts[index];
                    break;
                case 'office_equipments':
                    $rootScope.product = $scope.office_equipmentsHotProducts[index];
                    break;
                case 'health':
                    $rootScope.product = $scope.healthHotProducts[index];
                    break;
                case 'services':
                    $rootScope.product = $scope.servicesHotProducts[index];
                    break;
                case 'others':
                    $rootScope.product = $scope.othersHotProducts[index];
                    break;
                default:
                    break;

            }
        } else {
            $rootScope.product = $rootScope.outItems[index];
        }
    };



    //////////////////////////////////////////////////////////////////////////////////////////////

    // root in Storage
    var storageRef = firebase.storage().ref();
    var urlUploadImage = null;
    var file = null;

    $scope.imageUpload = function (element) {
        console.log($scope.type);
        var reader = new FileReader();
        reader.onload = function (event) {
                $scope.images = event.target.result
                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
        reader.readAsDataURL(element.files[0]);
        file = element.files[0];
    };

    $scope.PostNewProduct = function () {
        var user = firebase.auth().currentUser;
        if ($scope.data['users'][user.uid]['coin'] >= 20) {
            $scope.type = $scope.type == undefined ? "others" : $scope.type;
            var user = firebase.auth().currentUser;
            var newPostKey = $scope.data['products'][$scope.type].length;
            if (user) {
                if (file == null) {
                    var postData = {
                        avatar: "Khong co",
                        detail: $scope.detail == undefined ? "Không nhập" : $scope.detail,
                        price: $scope.price == undefined ? "Không nhập" : $scope.price,
                        salesman: {
                            address: $scope.address == undefined ? "Không nhập" : $scope.address,
                            name: $scope.name == undefined ? "Không nhập" : $scope.name,
                            phone: $scope.phone == undefined ? "Không nhập" : $scope.phone,
                            uid: firebase.auth().currentUser.uid
                        },
                        status: $scope.status == undefined ? "Không nhập" : $scope.status,
                        title: $scope.title == undefined ? "Không nhập" : scope.title,
                        priority: "0",
                        index: newPostKey
                    };

                    var updates = {};
                    updates['/products/' + $scope.type + '/' + newPostKey] = postData;
                    ref.update(updates);
                    // tru tien khi post bai
                    var temp = $scope.data['users'][user.uid]['coin'] - 20;
                        var postDat = {
                            coin: temp
                        };

                        var newPostKe = user.uid;
                        var update = {};
                        update['/users/' + newPostKe] = postDat;
                        ref.update(update);


                    $rootScope.product = postData;
                } else {
                    // upload image to server
                    var uploadTask = storageRef.child($scope.type + '/' + file.name).put(file);
                    uploadTask.on('state_changed', null, function (error) {
                        console.error('Upload failed:', error);
                    }, function () {
                        // tao data
                        var postData = {
                            avatar: uploadTask.snapshot.metadata.downloadURLs[0],
                            detail: $scope.detail,
                            price: $scope.price,
                            salesman: {
                                address: $scope.address,
                                name: $scope.name,
                                phone: $scope.phone,
                                uid: firebase.auth().currentUser.uid
                            },
                            status: $scope.status,
                            title: $scope.title,
                            priority: "0",
                            index: newPostKey
                        };

                        var updates = {};
                        updates['/products/' + $scope.type + '/' + newPostKey] = postData;
                        ref.update(updates);

                        var temp = $scope.data['users'][user.uid]['coin'] - 20;
                        var postDat = {
                            coin: temp
                        };

                        var newPostKe = user.uid;
                        var update = {};
                        update['/users/' + newPostKe] = postDat;
                        ref.update(update);

                        $rootScope.product = postData;
                    });
                }
            } else {
                window.location.href = "index.html";
            }
        } else {
            alert("Bạn không đủ tiền để đăng bài !");
        }
    };

    $scope.Post = function () {
        var user = firebase.auth().currentUser;
        if (user) {} else {
            window.location.href = "index.html";
        }
    };

    ////////////////////////////////////////
    $scope.setCoin = function () {
        var user = firebase.auth().currentUser;
        if ($scope.data['users'][user.uid] != undefined) {
            $scope.userCoin = $scope.data['users'][user.uid]['coin'];
        }
    }

    $scope.resetLogin = function () {
        $scope.userEmail = "";
        $scope.userPassword = "";
        $scope.messageError = "";
    }

    $scope.maxTitle = 40;
    $scope.maxDetail = 80;

    function initialize() {

        var mapProp = {
            center: new google.maps.LatLng(10.745439, 106.692296),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(10.745439, 106.692296),
            animation: google.maps.Animation.BOUNCE
        });

        marker.setMap(map);
    }
    google.maps.event.addDomListener(window, 'load', initialize);

    function filterByPriority(data) {
        return data.priority == 1;
    }

    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    $scope.$watch('data', function () {
        if ($scope.data != undefined) {
            if ($scope.checkLoadDB == 0) {
                $scope.vehiclesHotProducts = shuffle($scope.data['products']['vehicles'].filter(filterByPriority)).slice(0, 6);
                $scope.booksHotProducts = shuffle($scope.data['products']['books'].filter(filterByPriority)).slice(0, 6);
                $scope.housesHotProducts = shuffle($scope.data['products']['houses'].filter(filterByPriority)).slice(0, 6);
                $scope.fashionsHotProducts = shuffle($scope.data['products']['fashions'].filter(filterByPriority)).slice(0, 6);
                $scope.electrical_equipmentsHotProducts = shuffle($scope.data['products']['electrical_equipments'].filter(filterByPriority)).slice(0, 6);
                $scope.mobilesHotProducts = shuffle($scope.data['products']['mobiles'].filter(filterByPriority)).slice(0, 6);
                $scope.jobsHotProducts = shuffle($scope.data['products']['jobs'].filter(filterByPriority)).slice(0, 6);
                $scope.housewaresHotProducts = shuffle($scope.data['products']['housewares'].filter(filterByPriority)).slice(0, 6);
                $scope.sportsHotProducts = shuffle($scope.data['products']['sports'].filter(filterByPriority)).slice(0, 6);
                $scope.office_equipmentsHotProducts = shuffle($scope.data['products']['office_equipments'].filter(filterByPriority)).slice(0, 6);
                $scope.healthHotProducts = shuffle($scope.data['products']['health'].filter(filterByPriority)).slice(0, 6);
                $scope.servicesHotProducts = shuffle($scope.data['products']['services'].filter(filterByPriority)).slice(0, 6);
                $scope.othersHotProducts = shuffle($scope.data['products']['others'].filter(filterByPriority)).slice(0, 6);
                $scope.checkLoadDB = 1;
                $scope.loadPage('vehicles');
            }

        }
    }, true);

    $scope.$on('loadSlider', function (ngRepeatFinishedEvent) {
        $(document).ready(function () {
            slider = $('.sliderProduct').bxSlider({
                slideWidth: 280,
                minSlides: 1,
                maxSlides: 4,
                moveSlides: 1,
                slideMargin: 10,
                controls: false,
                auto: true,
                pager: false
            });

        });
    });

    $scope.$watch('$viewContentLoaded', function () {
        if ($routeParams.list != "") {
            index = $routeParams.index;
            switch ($routeParams.list) {
                case 'vehicles':
                    $rootScope.product = $scope.vehiclesHotProducts[index];
                    break;
                case 'houses':
                    $rootScope.product = $scope.housesHotProducts[index];
                    break;
                case 'fashions':
                    $rootScope.product = $scope.fashionsHotProducts[index];
                    break;
                case 'electrical_equipments':
                    $rootScope.product = $scope.electrical_equipmentsHotProducts[index];
                    break;
                case 'mobiles':
                    $rootScope.product = $scope.mobilesHotProducts[index];
                    break;
                case 'jobs':
                    $rootScope.product = $scope.jobsHotProducts[index];
                    break;
                case 'housewares':
                    $rootScope.product = $scope.housewaresHotProducts[index];
                    break;
                case 'books':
                    $rootScope.product = $scope.booksHotProducts[index];
                    break;
                case 'sports':
                    $rootScope.product = $scope.sportsHotProducts[index];
                    break;
                case 'office_equipments':
                    $rootScope.product = $scope.office_equipmentsHotProducts[index];
                    break;
                case 'health':
                    $rootScope.product = $scope.healthHotProducts[index];
                    break;
                case 'services':
                    $rootScope.product = $scope.servicesHotProducts[index];
                    break;
                case 'others':
                    $rootScope.product = $scope.othersHotProducts[index];
                    break;
                default:
                    break;
            }
        };
    });


    var page_like_callback = function (respone) {
        var user = firebase.auth().currentUser;
        if (user) {
            $scope.data['users'][user.uid]['coin'] += 50;
        } else {
            alert("Bạn chưa đăng nhập vào website nên không nhận được xu.");
        }
    }

    var page_unlike_callback = function (respone) {
        var user = firebase.auth().currentUser;
        if (user) {
            $scope.data['users'][user.uid]['coin'] -= 50;
        } else {
            alert("Bạn chưa đăng nhập vào website.");
        }
    }

    $scope.FB = function () {
        FB.Event.subscribe('edge.create', page_like_callback);
        FB.Event.subscribe('edge.remove', page_unlike_callback);
        FB.init({
            appId: '873801186058936',
            xfbml: true,
            version: 'v2.1'
        });
        FB.ui({
            method: 'share',
            display: 'popup',
            href: 'https://www.facebook.com/ShopSmileRaoVat/',
        }, function (response) {
            if (response && !response.error_message) {
                var user = firebase.auth().currentUser;
                if (user) {
                    $scope.data['users'][user.uid]['coin'] += 20;
                    console.log("Bạn chưa đăng nhập vào website nên không nhận được xu");
                } else {
                    alert("Bạn chưa đăng nhập vào website nên không nhận được xu");
                }
            }
        });
    }

    $scope.ShareFB = function () {
        FB.init({
            appId: '873801186058936',
            xfbml: true,
            version: 'v2.1'
        });
        FB.ui({
            method: 'share',
            display: 'popup',
            href: 'https://www.facebook.com/ShopSmileRaoVat/',
        }, function (response) {
            if (response && !response.error_message) {
                var user = firebase.auth().currentUser;
                if (user) {
                    $scope.data['users'][user.uid]['coin'] += 20;
                    console.log("Bạn chưa đăng nhập vào website nên không nhận được xu");
                } else {
                    alert("Bạn chưa đăng nhập vào website nên không nhận được xu");
                }
            }
        });
    }




    $scope.deleteProduct = function (index) {
        var indexOfMyList = $scope.currentPage * 6 + index;
        var id = $rootScope.outItems[index]['index'];

        var updates = {};
        updates['/products/' + $scope.myListTypeProduct[indexOfMyList] + '/' + id] = null;
        ref.update(updates);
        alert("Delete thanh cong refresh lai trang de xem.");
    }

    $scope.postToHome = function (index) {
        var user = firebase.auth().currentUser;
        if (user) {
            $scope.data['users'][user.uid]['coin'] -= 100;
            var indexOfMyList = $scope.currentPage * 6 + index;
            var id = $rootScope.outItems[index]['index'];
            $scope.data['products'][$scope.myListTypeProduct[indexOfMyList]][id]['priority'] = 1;
            alert("Post vao trang chu thanh cong refresh lai trang de xem.");
        } else {
            alert("Bạn chưa đăng nhập vào website.");
        }
    }

});
