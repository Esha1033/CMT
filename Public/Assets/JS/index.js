const authEmail = localStorage.getItem("email");

function checkLogin()
{

    if(authEmail)
    {
        document.querySelector("#loginAuthEmail").value = authEmail;
        document.querySelector("#loginAuthPass").value = "PASSWORD";
        document.querySelector("#loginAuthBtn").style.display = "none";
        document.querySelector("#AlreadyLoggedInBtn").style.display = "block";
        document.querySelector("#lowerDivLogin").style.display = "none";
    }

}


$(document).ready( () => {

    $("#loginAuthBtn").click( () => {

        var Email = $("#loginAuthEmail").val();
        var pwd = $("#loginAuthPass").val();

        
        if(!Email)
            $("#loginEmailErr").html("Please Enter Email !").css("color", "red");
        else
            $("#loginEmailErr").html("");
        
        if(!pwd)
            $("#loginPassErr").html("Please Enter Password !").css("color", "red");      
        else
            $("#loginPassErr").html("");
        
        if(Email && pwd)
        {
            var obj = {

                type : "get",
                url : "/loginAuth",

                data : {
                    uEmail : Email,
                    uPwd : pwd
                }

            }

            $.ajax(obj).done( (resp) => {

                if(resp == "!yesLogin!")
                {
                    localStorage.setItem("email", Email);
                    window.location.href = "/AuthDash";
                    return;
                }

                alert(JSON.stringify(resp));
            })
            .fail( (err) => {
                alert(JSON.stringify(err));
            })
        }

    });

    $("#passFrgtBtn").click( () => {

        var Email = $("#passFrgtEmail").val();
        
        if(!Email)
            $("#FrgtEmailErr").html("Please Enter Email !").css("color", "red");
        else
            $("#FrgtEmailErr").html("");


        if(Email)
        {

            var obj = {

                type : "get",
                url : "/frgtPass",

                data : {
                    uEmail : Email
                }

            }

            $.ajax(obj).done( (resp) =>
            {
                alert(resp);
                window.location.href = "/resetPass";
            })
            .fail( (err) => 
            {
                alert(err);
            })

        }


    });

    $("#resetPassBtn").click( () => {

        var Email = $("#resetEmail").val();
        var tPass = $("#resetTempPass").val();
        var nPass = $("#resetNewPass").val();

        if(!Email)
            $("#resetEmailErr").html("Enter Email Please !").css("color", "red");
        else
            $("#resetEmailErr").html("");

        if(!tPass)
            $("#resetTempPassErr").html("Enter Password Sent On Email !").css("color", "red");
        else
            $("#resetTempPassErr").html("");

        if(!nPass)
            $("#resetNewPassErr").html("Enter New Password !").css("color", "red");
        else
            $("#resetNewPassErr").html("");

        if(Email && tPass && nPass)
        {
            var obj = {

                type : "get",
                url : "/reset",

                data : {
                    uEmail : Email,
                    tempPass : tPass,
                    newPass : nPass
                }

            }

            $.ajax(obj).done(function(resp)
            {
                alert(resp);

                if(resp = "Password Updated !")
                    window.location.href = "/";

            })
            .fail(function(err)
            {
                alert(err);
            })

        }

    })

    $("#AlreadyLoggedInBtn").click( () => {
        window.location.href = "/AuthDash";
    })

})

var module = angular.module("myModule",[]);

module.controller("myController",function($scope, $http)
{

    $scope.fetchExtCons = () => {

        const url = "/fetchExtC";
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
          $scope.extCons = resp.data;
        }
        
        function fail(err)
        {
          alert(JSON.stringify(err.data));
        }

    };

})