var isDupUser = false;

// ======================================================================

$(document).ready(function()
{

    $("#regEmail").blur(function()
    {

        var Email = $("#regEmail").val();

        var obj = {

            url : "/checkDupUser",
            type : "get",

            data : {
                uEmail : Email
            }

        }

        $.ajax(obj).done(function(resp)
        {
            if(resp == "Email Already Exists !")
            {
                $("#regEmailErr").html("Email Already Exits !").css("color", "red");
                isDupUser = true;
            }
            else
            {
                $("#regEmailErr").html("");
                isDupUser = false;
            }
        })
        .fail(function(err)
        {
            alert(JSON.stringify(err));
        })

    });


    $("#regBTN").click(function()
    {

        var Name = $("#regName").val();
        var Email = $("#regEmail").val();
        var Pass = $("#regPass").val();
        var ORG = $("#regORG").val();
        var CNT = $("#regCNT").val();
        var AGREE = $("#regTerms").prop("checked");

        if(!Name)
            $("#regNameErr").html("Please Enter Your Name !").css("color", "red");
        else
            $("#regNameErr").html("");

        if(!Email)
            $("#regEmailErr").html("Please Enter Your Email !").css("color", "red");
        else if(isDupUser)
            $("#regEmailErr").html("Email Already Exits !").css("color", "red");
        else
            $("#regEmailErr").html("");

        if(!Pass)
            $("#regPassErr").html("Please Enter Your Pass !").css("color", "red");
        else
            $("#regPassErr").html("");
        
        if(!ORG)
            $("#regORGErr").html("Please Enter Your Organization !").css("color", "red");
        else
            $("#regORGErr").html("");
        
        if(CNT == "none")
            $("#regCNTErr").html("Please Enter Your Country !").css("color", "red");
        else
            $("#regCNTErr").html("");
        
        if(!AGREE)
            $("#regTermsErr").html("Please Agree Terms !").css("color", "red");
        else
            $("#regTermsErr").html("");


        if(Name && Email && Pass && ORG && CNT && AGREE && !isDupUser)
        {


            var obj = {

                type : "get",
                url : "/regAUTH",

                data : {
                    uName : Name,
                    uEmail : Email,
                    uPass : Pass,
                    uORG : ORG,
                    uCNT : CNT
                }

            }

            $.ajax(obj).done(function(resp)
            {
                alert(resp);
                window.location.href = "/";
            })
            .fail(function(err)
            {
                alert(JSON.stringify(err));
            })

        }


    })

})