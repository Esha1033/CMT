const authEmail = localStorage.getItem("email");
const isRev = localStorage.getItem("Reviewer");
const RevCon = localStorage.getItem("RevCon");
var openAdvSet = false;


function checkRevDet()
{

    if(!authEmail)
    {
        alert("Please Login First !");
        window.location.href = "/";
        return;
    }
    else if(!isRev || isRev == "NO")
    {
        alert("User Not Found !");
        window.location.href = "/AuthDash";
    }

    localStorage.clear();

    localStorage.setItem("email", authEmail);
    localStorage.setItem("RevCon", RevCon);
    localStorage.setItem("Reviewer", isRev);

    document.querySelector("#RevMenu").innerHTML = authEmail;
    document.querySelector(".ConName").innerHTML = RevCon;

}

function checkRevDet2()
{

    if(!authEmail)
    {
        alert("Please Login First !");
        window.location.href = "/";
        return;
    }
    else if(!isRev || isRev == "NO")
    {
        alert("User Not Found !");
        window.location.href = "/AuthDash";
    }

    document.querySelector("#RevMenu").innerHTML = authEmail;
    document.querySelector(".ConName").innerHTML = RevCon;

    if(!localStorage.getItem("revPaperTitle"))
        window.location.href = "/Rev-conDetails";

    document.querySelector("#reviewTitle").value = localStorage.getItem("revPaperTitle");
    document.querySelector("#reviewAuthEmail").value = localStorage.getItem("revPaperEmail");

}

function changeMenuItem(toShow)
{

    document.getElementById("#chairDash").style.display = "none";
    document.getElementById("#chairAllSubs").style.display = "none";
    document.getElementById("#chairAllReviewed").style.display = "none";
    
    document.getElementById("#"+toShow).style.display = "flex";

}

var module = angular.module("myModule",[]);

module.controller("myController",function($scope, $http)
{

    $scope.fetchCONFERENCES = () => {

        const url = "/fetchRevCons?email=" + authEmail;
        
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

        localStorage.setItem("RevCon", conName);

        window.location.href = "/Rev-conDetails";

    };

    $scope.fetchConStats1 = () => {

        const url = "/getAssignedPapers?conName=" + RevCon + "&Email=" + authEmail;
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            document.querySelector(".stat1Info").innerHTML = resp.data.length;
            $scope.AllAssignedData = resp.data;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.fetchConStats2 = () => {

        const url = "/getReviewedPapers?conName=" + RevCon + "&Email=" + authEmail;
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            document.querySelector(".stat2Info").innerHTML = resp.data.length;
            $scope.PaperReviewed = resp.data;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.fetchRating = (Email) => {

        const url = "/getReviewedRating?conName=" + RevCon + "&Email=" + Email;
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            $scope.PaperReviewed = resp.data;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.openSummary = (Title, Abs, Aff, File) => {

        $("#SummaryConName").val(RevCon);
        $("#SummaryTitle").val(Title);
        $("#SummaryAbs").val(Abs);
        $("#SummaryAff").val(Aff);
        document.querySelector("#SummaryFile").setAttribute("href", "/Uploads/Papers/" + File)

    }

    $scope.openReview = (Email, Title) => {

        localStorage.setItem("revPaperEmail", Email);
        localStorage.setItem("revPaperTitle", Title);

        window.location.href = "/ReviewPaper";

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

    $("#reviewSubmitBTN").click( () => {

        var pAuthEmail = $("#reviewAuthEmail");
        var revEmail = authEmail;

        var q1 = $("#reviewQ1");
        var q2 = $("#reviewQ2");
        var q3 = $("#reviewQ3");
        var q4 = $("#reviewQ4");
        var q5 = $("#reviewQ5");
        var q6 = $("#reviewQ6");
        var q7 = $("#reviewQ7");
        var q8 = $("#reviewQ8");
        var q9 = $("#reviewQ9");
        var q10 = $("#reviewQ10");

        if(q1.val() == "none")
        {
            q1.focus();
            return;
        }

        if(q2.val() == "" || !q2.val())
        {
            q2.focus();
            return;
        }

        if(q3.val() == "none")
        {
            q3.focus();
            return;
        }

        if(q4.val() == "none")
        {
            q4.focus();
            return;
        }

        if(q5.val() == "none")
        {
            q5.focus();
            return;
        }

        if(q6.val() == "none")
        {
            q6.focus();
            return;
        }

        if(q7.val() == "none")
        {
            q7.focus();
            return;
        }

        if(q8.val() == "none")
        {
            q8.focus();
            return;
        }

        if(q9.val() == "none")
        {
            q9.focus();
            return;
        }

        if(q10.val() == "" || !q10.val())
        {
            q10.focus();
            return;
        }

        var overAllrating = (parseInt(q1.val()) + parseInt(q3.val()) + parseInt(q4.val()) + parseInt(q5.val()) + parseInt(q6.val()) + parseInt(q7.val()) + parseInt(q8.val()) + parseInt(q9.val()))/8;
        overAllrating = overAllrating.toFixed(2);

        
        var obj = {
            type : "get",
            url : "/checkReview",
            data : {
                conName : RevCon,
                AuthEmail : pAuthEmail.val(),
                Review : q2.val(),
                Rating : overAllrating,
            }
        }
        $.ajax(obj).done( (resp) => 
        {})
        .fail( (err) => {
            alert(JSON.stringify(err));
        })

        
        var obj3 = {
            type : "get",
            url : "/addReview",
            data : {
                conName : RevCon,
                AuthEmail : pAuthEmail.val(),
                revEmail : revEmail,
                q1 : q1.val(),
                q2 : q2.val(),
                q3 : q3.val(),
                q4 : q4.val(),
                q5 : q5.val(),
                q6 : q6.val(),
                q7 : q7.val(),
                q8 : q8.val(),
                q9 : q9.val(),
                q10 : q10.val(),
                overall : overAllrating,
            }
        }

        $.ajax(obj3).done( (resp) => 
        {

            if(resp == "!ALL Done!")
            {
                alert("Paper Reviewed Successfully !!!");
                window.location.href = "/Rev-conDetails";
                return;
            }

        })
        .fail( (err) => {
            alert(JSON.stringify(err));
        })


    })

})