$(document).ready( () => {


    $("#myloginbtn").click( () => {

        var EMAIL = $("#admEmail").val();
        var PASS = $("#admPass").val();

        if(EMAIL == "")
        {
            $("#admEmail").focus();
            return;
        }

        if(PASS == "")
        {
            $("#admPass").focus();
            return;
        }

        var obj = {
            type : "get",
            url : "/doAdmLogin",
            data : {
                email : EMAIL,
                pass : PASS,
            }
        }
    
        $.ajax(obj).done( (resp) => {
    
            if(resp == "!yesLogin!")
            {
                window.location.href = "/admDash";
            }
            else
            {
                alert(resp);
                $("#admEmail").val("");
                $("#admPass").val("");
            }

    
        })
        .fail( (err) => {
            alert(JSON.stringify(err));
        })

    })

})

function checkLogin()
{

    var mail = localStorage.getItem("Amail");

    if(mail)
    {

        document.querySelector("#admEmail").value = mail;
        document.querySelector("#admEmail").setAttribute("readonly", "true");

        document.querySelector("#admPass").value = "HELLO";
        document.querySelector("#admPass").setAttribute("readonly", "true");

        document.querySelector("#myloginbtnBox").style.display = "none";
        document.querySelector("#myloggedBox").style.display = "block";

    }

}

function DirectLogin()
{
    window.location.href = "/admDash";
}