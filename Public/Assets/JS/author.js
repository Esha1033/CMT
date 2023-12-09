const authEmail = localStorage.getItem("email");
var openAdvSet = false;


var module = angular.module("myModule",[]);

module.controller("myController",function($scope, $http)
{

    $scope.fetchCONFERENCES = () => {

        const url = "/fetch-All-Conferences";
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
          $scope.conDATA = resp.data;
        }
        
        function fail(err)
        {
          alert(JSON.stringify(err.data));
        }

    };

    $scope.fetchContriPaperData = () => {

        const url = "/fetch-Papers?Email=" + authEmail + "&ConName=" + localStorage.getItem("SubconName");
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            $scope.myPaperDATA = resp.data;

            if($scope.myPaperDATA != "")
            {
                removeSubBtn();
            }

            if(localStorage.getItem("EndTime") - localStorage.getItem("curTime") <= 0)
            {
                document.querySelector(".createSubErr").innerHTML = "Conference Not Active.";
                document.querySelector(".createSubErr").style.color = "red";
                removeSubBtn();
            }

            if(localStorage.getItem("StartTime") - localStorage.getItem("curTime") >= 0)
            {
                document.querySelector(".createSubErr").innerHTML = "Conference Not Active.";
                document.querySelector(".createSubErr").style.color = "red";
                removeSubBtn();
            }

        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.fetchContriPaper = () => {

        const url = "/fetch-All-contriPapers?email=" + authEmail;
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            $scope.myContriData = resp.data;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.openSubPage = function(conName, startDate, endDate)
    {

        localStorage.setItem("SubconName", conName);

        var curTime = new Date().getTime();
        var StartTime = new Date(`${startDate}`).getTime();
        var EndTime = new Date(`${endDate}`).getTime();

        localStorage.setItem("curTime", curTime);
        localStorage.setItem("StartTime", StartTime);
        localStorage.setItem("EndTime",EndTime);

        window.location.href = "/Submission";

    };

    $scope.loadAuthDet = function()
    {
        const url = "/getAuthDet?email=" + authEmail;
        
        $http.get(url).then(done, fail);

        function done(resp)
        {
            $scope.TableData = resp.data;
        }
        
        function fail(err)
        {
            console.log("NOT OK");
        }
    };

})

function removeSubBtn()
{
    document.querySelector(".createSubBTN").style.display = "none";
}

function checkLogin()
{

    if(!authEmail)
    {
        alert("Please Login First !");
        window.location.href = "/";
        return;
    }

    if(window.location.href == "/AuthDash")
        localStorage.removeItem("conName");

    document.querySelector("#authMenu").innerHTML = authEmail;

}

function removeStorages()
{
    localStorage.removeItem('conName');
    localStorage.removeItem('NS_Title');
    localStorage.removeItem('NS_Abstract');
    localStorage.removeItem('NS_Aff');
    localStorage.removeItem('curTime');
    localStorage.removeItem('EndTime');
    localStorage.removeItem('StartTime');
    localStorage.removeItem('SubconName');
}


$(document).ready( () => {

    $("#LogoutBTN").click( () => {
        
        localStorage.clear();
        window.location.href = "/";
        
    })

    $("#DeleteAccBtn").click( () => {

        if(confirm("Are You Sure To Delete Your Account ?"))
        {
            if(!prompt("Please Enter Reason :"))
                return;

            var obj = {
                type : "get",
                url : "/deleteAuth",
                data : {
                    Email : authEmail
                }
            }

            $.ajax(obj).done( (resp) => {

                if(resp == "!Deleted!")
                {
                    alert("Account Deleted Successfully !");
                    localStorage.clear();
                    window.location.href = "/";
                }

            })
            .fail( (err) => {
                alert(JSON.stringify(err));
            })

        }

    })

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
                url : "/cngPass",
                data : {
                    Email : authEmail,
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

        var conEmail = localStorage.getItem("email");


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

    $("#changeRole").change( () => {

        var role = $("#changeRole").val();

        if(role == "Author")
        {
            window.location.href = "/AuthDash";
        }

        else if(role == "ChairPerson")
        {

            if(localStorage.getItem("ChairPerson") == "YES")
            {
                window.location.href = "/chair-Conferences";
            }
            else if(localStorage.getItem("ChairPerson") == "NO")
            {
                alert("User Not Available As ChairPerson !");
                location.reload();
            }
            else
            {

                var obj = {
                    type : "get",
                    url : "/checkIfChair",
                    data : {
                        email : authEmail,
                    }
                }
    
                $.ajax(obj).done( (resp) => 
                {
    
                    if(resp == "!YES!")
                    {
                        window.location.href = "/chair-Conferences";
                        localStorage.setItem("ChairPerson", "YES");
                    }
                    else if(resp == "Nope")
                    {
                        alert("User Not Available As ChairPerson !");
                        localStorage.setItem("ChairPerson", "NO");
                        location.reload();
                    }
    
                })
                .fail( (err) => {
                    alert(JSON.stringify(err));
                })

            }

        }

        else if(role == "Reviewer")
        {

            if(localStorage.getItem("Reviewer") == "YES")
            {
                window.location.href = "/Rev-Conferences";
            }
            else if(localStorage.getItem("Reviewer") == "NO")
            {
                alert("User Not Available As Reviewer !");
                location.reload();
            }
            else
            {

                var obj = {
                    type : "get",
                    url : "/checkIfRev",
                    data : {
                        email : authEmail,
                    }
                }
    
                $.ajax(obj).done( (resp) => 
                {
    
                    if(resp == "!YES!")
                    {
                        window.location.href = "/Rev-Conferences";
                        localStorage.setItem("Reviewer", "YES");
                    }
                    else if(resp == "Nope")
                    {
                        alert("User Not Available As Reviewer !");
                        localStorage.setItem("Reviewer", "NO");
                        location.reload();
                    }
    
                })
                .fail( (err) => {
                    alert(JSON.stringify(err));
                })

            }

        }

        else if(role == "Editor")
        {

            if(localStorage.getItem("Editor") == "YES")
            {
                window.location.href = "/Edi-Conferences";
            }
            else if(localStorage.getItem("Editor") == "NO")
            {
                alert("User Not Available As Editor !");
                location.reload();
            }
            else
            {

                var obj = {
                    type : "get",
                    url : "/checkIfEdi",
                    data : {
                        email : authEmail,
                    }
                }
    
                $.ajax(obj).done( (resp) => 
                {
    
                    if(resp == "!YES!")
                    {
                        window.location.href = "/Edi-Conferences";
                        localStorage.setItem("Editor", "YES");
                    }
                    else if(resp == "Nope")
                    {
                        alert("User Not Available As Editor !");
                        localStorage.setItem("Editor", "NO");
                        location.reload();
                    }
    
                })
                .fail( (err) => {
                    alert(JSON.stringify(err));
                })

            }

        }

    })

})

// ============================================================