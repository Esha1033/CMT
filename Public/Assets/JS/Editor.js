var authEmail = localStorage.getItem("email");
var isEdi = localStorage.getItem("Editor");
const ediCon = localStorage.getItem("EdiCon");

var openAdvSet = false;

var nowRev = 0;
var maxRev = 0;
var maxASSIGN = 0;

var toPublishAuthEmail;


function createShareLink()
{
    
    var toShareLink = "localhost:2005/Submission/";

    for (let i = 0; i < ediCon.length; i++)
    { 
        if (ediCon[i] === ' ') 
            toShareLink += '%20'; 
        else
        toShareLink += ediCon[i]; 
    }

    document.querySelector("#copyShareLink").value = toShareLink;

}

function outFunc()
{
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
}

function copyShareLink()
{

    var copyText = document.querySelector("#copyShareLink");

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyText.value);

    document.querySelector("#myTooltip").innerHTML = "Copied!"; 
}

function checkEdiDet()
{

    if(!authEmail)
    {
        alert("Please Login First !");
        window.location.href = "/";
        return;
    }
    else if(!isEdi || isEdi == "NO")
    {
        alert("User Not Found !");
        window.location.href = "/AuthDash";
    }

    document.querySelector("#EdiMenu").innerHTML = authEmail;
    document.querySelector(".ConName").innerHTML = ediCon;

}

function changeMenuItem(toShow)
{

    document.getElementById("#chairDash").style.display = "none";
    document.getElementById("#chairAllSubs").style.display = "none";
    document.getElementById("#chairAllReviewers").style.display = "none";
    document.getElementById("#chairAssign").style.display = "none";
    document.getElementById("#chairAllReviewed").style.display = "none";
    document.getElementById("#chairAllPublished").style.display = "none";
    
    document.getElementById("#"+toShow).style.display = "flex";

}

function getSettings()
{

    var objCheckSettings = {
        type : "get",
        url : "/checkSettings",
        data : {
            CONNAME : ediCon,
        }
    }

    $.ajax(objCheckSettings).done( (resp) => {

        maxRev = resp[0].maxREV;
        maxASSIGN = resp[0].maxAssign;

        document.querySelector(".stat4Max").innerHTML = " (" + maxRev + ")";
        document.querySelector(".RevMaxVal").innerHTML = maxRev;
        
    })
    .fail( (err) => {
        alert(JSON.stringify(err));
    })

}


var module = angular.module("myModule",[]);

module.controller("myController", ($scope, $http) =>
{

    $scope.fetchCONFERENCES = () => {

        const url = "/fetchEdiCons?email=" + authEmail;

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

    $scope.openConDet = (conName) => {

        localStorage.setItem("EdiCon", conName);

        window.location.href = "/Edi-conDetails";

    };

    $scope.fetchConStats1 = () => {

        const url = "/getTotalSubmissions?conName=" + ediCon;
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            document.querySelector(".stat1Info").innerHTML = resp.data.length;
            $scope.AllSubmissionsData = resp.data;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.fetchConStats2 = () => {

        const url = "/getReviewedSubmissions?conName=" + ediCon;
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            document.querySelector(".stat2Info").innerHTML = resp.data.length;
            $scope.AllReviewedData = resp.data;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.fetchConStats4 = () => {

        const url = "/getReviewers?conName=" + ediCon;
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            nowRev = resp.data.length;
            document.querySelector(".RevAssigned").innerHTML = nowRev + " /";

            document.querySelector(".stat4Info").innerHTML = nowRev;
            $scope.AllReviewersData = resp.data;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.AssignPaperToEmail = (data, paperEmail) => {

        if(data.RevStatus == "0")
        {
            alert("Reviewer is Blocked !");
            return;
        }

        const url = "/checkAllowedAssign?REmail=" + data.RevEmail + "&CONNAME=" + data.conName + "&AEmail=" + paperEmail;

        $http.get(url).then(done, fail);

        function done(resp)
        {

            if(resp.data == "ALREADYASSIGNED")
            {
                alert("Paper Already Assigned To The Reviewer !");
                return;
            }
            else if(resp.data.length < maxASSIGN)
            {

                const url2 = "/assignToEmail?REmail=" + data.RevEmail + "&CONNAME=" + data.conName + "&AEmail=" + paperEmail;

                $http.get(url2).then(donee, faill);

                function donee(respp)
                {

                    if(respp.data == "DONE")
                    {
                        alert("Paper Assigned Successfully !");
                        location.reload();
                    }
                }
                function faill(errr)
                {
                    alert(JSON.stringify(errr));
                }

            }
            else
                alert("Paper Assign Limit Reached !");


        }

        function fail(err)
        {
            alert(JSON.stringify(err));
        }

    }

    $scope.doReviewerResume = (uEmail, uStatus) => {

        if(uStatus != "0")
        {

            alert("Reviewer is Already Active !");
            return;

        }
        else
        {

            const url = "/resumeRev?conName=" + ediCon + "&Email=" + uEmail;
        
            $http.get(url).then(done, fail);
            
            function done(resp)
            {
                if(resp.data == "!DONE!")
                    location.reload();
            }

            function fail(err)
            {
                alert(JSON.stringify(err.data));
            }

        }

    };

    $scope.doReviewerBlock = (uEmail, uStatus) => {

        if(uStatus != "1")
        {

            alert("Reviewer is Already Blocked !");
            return;

        }
        else
        {

            const url = "/blockRev?conName=" + ediCon + "&Email=" + uEmail;
        
            $http.get(url).then(done, fail);
            
            function done(resp)
            {
                if(resp.data == "!DONE!")
                    location.reload();
            }

            function fail(err)
            {
                alert(JSON.stringify(err.data));
            }

        }

    };

    $scope.doReviewerRemove = (uEmail) => {

        if(confirm("Are You Sure To Remove Reviewer With Email : " + uEmail + " ?"))
        {
            
            const url = "/removeRev?conName=" + ediCon + "&Email=" + uEmail;
        
            $http.get(url).then(done, fail);
            
            function done(resp)
            {
                if(resp.data == "!DONE!")
                    location.reload();
            }

            function fail(err)
            {
                alert(JSON.stringify(err.data));
            }

        }

    };

    $scope.checkPaperStats = (AEmail) => {

        const url = "/getPaperStats?AEmail=" + AEmail + "&cName=" + ediCon;

        $http.get(url).then(done, fail);

        function done(resp)
        {
            alert(resp.data);
        }
        function fail(err)
        {
            alert(JSON.stringify(err));
        }

    };

    $scope.openSummary = (email, Title, Abs, Aff, File) => {

        toPublishAuthEmail = email;

        $("#SummaryConName").val(ediCon);
        $("#SummaryTitle").val(Title);
        $("#SummaryAbs").val(Abs);
        $("#SummaryAff").val(Aff);
        document.querySelector("#SummaryFile").setAttribute("href", "/Uploads/Papers/" + File)

        const url = "/getPublishingData?EMAIL=" + email + "&conName=" + ediCon;

        $http.get(url).then(done, fail);

        function done(resp)
        {

            const url2 = "/checkIfPublished?EMAIL=" + email + "&conName=" + ediCon + "&title=" + Title;

            $http.get(url2).then(donee, faill);

            function donee(respp)
            {

                if(respp.data == "YESSAVAILABLE")
                {

                    document.querySelector("#publishingINFOBTN").style.display = "none";
                    document.querySelector("#publishingINFO").innerHTML = "Paper Already Published !";
                    document.querySelector("#publishingINFO").style.color = "red";
                    document.querySelector("#publishingINFO").style.fontSize = "30px";

                }

            }
            function faill(errr)
            {
                alert(JSON.stringify(errr));
            }

            $scope.AllPublishingData = resp.data;
        }
        function fail(err)
        {
            alert(JSON.stringify(err));
        }  

    };

    $scope.getAllPubData = () => {

        const url = "/getPubData?cName=" + ediCon;

        $http.get(url).then(done, fail);

        function done(resp)
        {
            $scope.AllPubPaperData = resp.data;
        }
        function fail(err)
        {
            alert(JSON.stringify(err));
        }

    }

})


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

    $("#addReviewerBTN").click( () => {

        var Email = $("#addReviewerTxt").val();

        if(nowRev == maxRev)
        {
            alert("Maximum Reviewer Limit Reached !");
            return;
        }

        if(Email == "" || !Email || Email == " ")
        {
            alert("Please Enter Email !");
            return;
        }

        if(authEmail == Email)
        {
            alert("Reviewer Cannot Be Added as You Are Editor !");
            return;
        }

        var obj = {
            type : "get",
            url : "/checkDupUser",
            data : {
                uEmail : Email,
            }
        }

        $.ajax(obj).done( (resp) => 
        {

            if(resp == "Email Already Exists !")
            {

                var obj2 = {

                    type : "get",
                    url : "/checkIfRevExists",
                    data : {
                        uEmail : Email,
                        conName : ediCon,
                    }

                }

                $.ajax(obj2).done( (respp) => {

                    if(respp == "!YouCanAdd!")
                    {

                        var obj3 = {
                            type : "get",
                            url : "/AddNewRev",
                            data : {
                                email : Email,
                                conName : ediCon,
                            }
                        }
    
                        $.ajax(obj3).done( (resppp) =>{
                            if(resppp == "DONE")
                                location.reload();
                        })
                        .fail( (errrr) => {
                            alert(errrr);
                        })
    
                        return;

                    }
                    else
                    {
                        alert("Reviewer Already There !");
                        $("#addReviewerTxt").val("");
                    }

                })

                return;

            }
            
            alert("No User Found !");
            $("#addReviewerTxt").val("");

        })
        .fail( (err) => {
            alert(JSON.stringify(err));
        })

    })

    $("#publishingINFOBTN").click( () => {

        var obj = {

            type : "get",
            url : "/publishPaper",
            data : {

                conName : ediCon,
                aEmail : toPublishAuthEmail,
                pTitle : $("#SummaryTitle").val(),
                ediMail : authEmail,

            }

        }

        $.ajax(obj).done( (resp) => {

            if(resp == "done")
                alert("Paper Published Successfully !");

        })
        .fail( (err) => {

            alert(JSON.stringify(err));

        })

    })

})