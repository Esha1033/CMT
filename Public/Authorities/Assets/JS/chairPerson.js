const authEmail = localStorage.getItem("email");
const isChair = localStorage.getItem("ChairPerson");


function checkChairDet()
{

    if(!authEmail)
    {
        alert("Please Login First !");
        window.location.href = "/";
        return;
    }
    else if(!isChair || isChair == "NO")
    {
        alert("Invalid User");
        window.location.href = "/AuthDash";
    }


    document.querySelector("#chairMenu").innerHTML = authEmail;

}


// var module = angular.module("myModule",[]);

// module.controller("myController",function($scope, $http)
// {

// })


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
                url : "/addCon",
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
                    alert("Conference Requested !");
                    location.reload();
                    return;
                }
                alert(resp);

            })
            .fail( (err) => {
                alert(JSON.stringify(err));
            })

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
                window.location.href = "/chairCons";
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
                        window.location.href = "/chairCons";
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

    })

})