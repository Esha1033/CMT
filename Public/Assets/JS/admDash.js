var openAdvSet = false;
var openMenu = false;

function chkLogin()
{

    var obj = {
        type : "get",
        url : "/checkAdmLog",
    }

    $.ajax(obj).done( (resp) => {

        if(resp == "Nope")
        {
            alert("Login To Access This Page !");
            window.location.href = "/";
            return;
        }
        
        localStorage.setItem("Amail", resp);
        $(".AdmEmail").html(localStorage.getItem("Amail"));

    })
    .fail( (err) => {
        alert(JSON.stringify(err));
    })

}

function doLogout()
{

    var EMAIL = localStorage.getItem("Amail");
    localStorage.removeItem("Amail");

    var obj = {
        type : "get",
        url : "/logOutAdm",
        data : {
            email : EMAIL,
        }
    }

    $.ajax(obj).done( (resp) => {

        window.location.href = "/";

    })
    .fail( (err) => {
        alert(JSON.stringify(err));
    })

}

function openAdmMenu()
{
    if(openMenu == false)
    {
        document.querySelector(".sideBar").style.display = "block";
        document.querySelector(".sideBar").style.position = "fixed";
        openMenu = true;
    }
    else
    {
        document.querySelector(".sideBar").style.display = "none";
        openMenu = false;
    }
}

function changeMenu(x)
{

    document.querySelector("#dashboard").style.display = "none";
    document.querySelector("#ExternalCon").style.display = "none";
    document.querySelector("#ConReqs").style.display = "none";
    document.querySelector("#ConAdms").style.display = "none";
    document.querySelector("#AllCons").style.display = "none";

    document.querySelector("#" + x).style.display = "flex";

}

function ExtConBtn(conTitle, conLink)
{
    
    if(conTitle.value == "")
    {
        conTitle.focus();
        return;
    }

    if(conLink.value == "")
    {
        conLink.focus();
        return;
    }

    var obj = {
        type : "get",
        url : "/addExtCon",
        data : {
            cTitle : conTitle.value,
            cLink : conLink.value,
        }
    }

    $.ajax(obj).done( (resp) => {
        alert(resp);
        location.reload();
    })
    .fail( (err) => {
        alert(JSON.stringify(err));
    })

}

$(document).ready( () => {

    $("#chngPassBtn").click( () => {
    

        var curPass = $("#CngCurrPass").val();
        var newPass = $("#CngNewPass").val();

        if(!curPass)
            $("#CngCurrPassErr").html("Enter Current Password !").css("color", "red");
        else
            $("#CngCurrPassErr").html("");

        if(!newPass)
            $("#CngNewPassErr").html("Enter New Password !").css("color", "red");
        else
            $("#CngNewPassErr").html("");
        

        if(curPass && newPass)
        {

            var obj = {
                type : "get",
                url : "/cngAdmPass",
                data : {
                    Email : localStorage.getItem("Amail"),
                    cPass : curPass,
                    nPass : newPass
                }
            }

            $.ajax(obj).done( (resp) => 
            {
                alert(resp);
            })
            .fail( (err) => {
                alert(JSON.stringify(err));
            })

        }

    })

    $("#reqConBTN").click( () => {

        var conName = $("#conName").val();
        var conSub = $("#conSub").val();
        var conStart = $("#conStart").val();
        var conEnd = $("#conEnd").val();
        var conCNTRY = $("#conCNTRY").val();
        var conCty = $("#conCty").val();
        var conWeb = $("#conWeb").val();

        var conEmail = localStorage.getItem("Amail");


        if(!conName)
            $("#conNameErr").html("Enter Conference Name !").css("color", "red");
        else
            $("#conNameErr").html("");

        if(!conSub)
            $("#conSubErr").html("Enter Conference Subject Area !").css("color", "red");
        else
            $("#conSubErr").html("");

        if(!conStart)
            $("#conStartErr").html("Enter Conference Start Date !").css("color", "red");
        else
            $("#conStartErr").html("");

        if(!conEnd)
            $("#conEndErr").html("Enter Conference End Date !").css("color", "red");
        else
            $("#conEndErr").html("");

        if(!conCty)
            $("#conCtyErr").html("Enter Conference City !").css("color", "red");
        else
            $("#conCtyErr").html("");

        if(conCNTRY == "none")
            $("#conCNTRYErr").html("Enter Conference Country !").css("color", "red");
        else
            $("#conCNTRYErr").html("");

        if(!conWeb)
            $("#conWebErr").html("Enter Conference Website !").css("color", "red");
        else
            $("#conWebErr").html("");

        
        if(conEnd && conCNTRY != "none" && conCty && conName && conStart && conSub && conWeb)
        {

            var obj = {
                type : "get",
                url : "/ReqCon",
                data : {
                    cName : conName,
                    cSub : conSub,
                    cStart : conStart,
                    cEnd : conEnd,
                    cCNTRY : conCNTRY,
                    cCty : conCty,
                    cWeb : conWeb,
                    cEmail : conEmail,
                }
            }

            $.ajax(obj).done( (resp) => 
            {

                if(resp == "!ALL Done!")
                {

                    var obj2 = {

                        type : "get",
                        url : "/doSettings",
                        data : {
                            cName : conName,
                            maxREV : $("#maxREV").val(),
                            maxEDI : $("#maxEDI").val(),
                            maxASSIGN : $("#maxASSIGN").val()
                        }

                    }

                    $.ajax(obj2).done( (respp) => {

                        alert("Conference Requested !");
                        location.reload();
                        return;

                    })
                    .fail( (errr) => {
                        alert(JSON.stringify(errr));
                    })

                }

            })
            .fail( (err) => {
                alert(JSON.stringify(err));
            })

        }


    })
    
    $("#ADVANCESETTINGSBTN").click( () => {

        if(openAdvSet == false)
        {
            $("#ADVANCESETTINGSBTN").html("Collapse Settings");
            $("#ADVANCESETTINGS").css("display", "block");
            openAdvSet = true;
        }
        else
        {
            $("#ADVANCESETTINGSBTN").html("Advance Settings");
            $("#ADVANCESETTINGS").css("display", "none");
            openAdvSet = false;
        }

    })

})

var module = angular.module("myModule",[]);

module.controller("myController",function($scope, $http)
{

    $scope.fetchCONFERENCES = () => {

        const url = "/fetch-All-Conferences";
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
          $scope.conDATA = resp.data;
          document.querySelector(".stat1Txt").innerHTML = resp.data.length;
        }
        
        function fail(err)
        {
          alert(JSON.stringify(err.data));
        }

    };

    $scope.fetchTotalSubs = () => {

        const url = "/admAllCons";
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            document.querySelector(".stat4Txt").innerHTML = resp.data.length;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.fetchTotalReqs = () => {

        const url = "/admAllReqCons";
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            $scope.AllReqCons = resp.data;
            document.querySelector(".stat3Txt").innerHTML = resp.data.length;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.fetchConAdms = () => {

        const url = "/admConAdms";
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            $scope.AllConsAdms = resp.data;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.AcceptCon = (obj) => {

        const url = "/addCon?cName=" + obj.conName + "&cWeb=" + obj.conWeb + "&cSub=" + obj.SubjectArea + "&cCty=" + obj.conCity + "&cCNTRY=" + obj.conCNT + "&cStart=" + obj.conStart + "&cEnd=" + obj.conEnd + "&cEmail=" + obj.conAdmin; 

        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            if(resp.data == "!ALL Done!")
                alert("Accepted !");
            $scope.fetchTotalReqs();
            $scope.fetchTotalSubs();
            $scope.fetchCONFERENCES();
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.RejCon = (obj) => {

        const url = "/rejConReq?conName=" + obj.conName + "&email=" + obj.conAdmin;

        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            if(resp.data == "!ALL Done!")
                alert("Rejected !");
            $scope.fetchTotalReqs();
            $scope.fetchTotalSubs();
            $scope.fetchCONFERENCES();
            $scope.fetchConAdms();
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

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

    $scope.dltExtCon = (conLink) => {

        const url = "/dltExtC?cLink=" + conLink;
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            alert(resp.data);
            $scope.fetchExtCons();
        }
        
        function fail(err)
        {
          alert(JSON.stringify(err.data));
        }

    };

    $scope.changeConAdmStatus = (obj, action) => {

        var status;

        if(action == "r")
        {

            if(obj.conAdmStatus == "1")
            {
                alert("User is Already Active");
                return;
            }
            else
                status = 1;

        }

        else if(action == "b")
        {

            if(obj.conAdmStatus == "0")
            {
                alert("User is Already Blocked");
                return;
            }
            else
                status = 0;

        }

        const url = "/changeConAdmStatus?conName=" + obj.conName + "&DoStatus=" + status;

        $http.get(url).then(done, fail);

        function done(resp)
        {
            alert("Status Changed !");
            $scope.fetchConAdms();
        }
        
        function fail(err)
        {
          alert(JSON.stringify(err.data));
        }

    };

})