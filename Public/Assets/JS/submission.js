const conName = localStorage.getItem("SubconName");
const authEMAIL = localStorage.getItem("email");

var wordLimit = true;

function getConName()
{

    var needReturn = true;


    var obj = {
        type : "get",
        url : "/checkIfSharedLink",
    }
    $.ajax(obj).done( (resp) => 
    {
        
        if(resp != "!NOPE!")
        {
            needReturn = false;
            localStorage.setItem("SubconName", resp);
            conName = localStorage.getItem("SubconName");
        }

        if(needReturn == true && (!conName || conName == ""))
        {
            alert("No Conference Selected !");
            window.location.href = "/AuthDash";
        }

    })
    .fail( (err) => {
        alert(JSON.stringify(err));
    })

    document.querySelector("#LogoConName").innerHTML = conName;
    document.querySelector("#mainTitle").innerHTML = "CMT - " + conName;
    document.querySelector("#NS_AuthEmail").value = authEMAIL;
    document.querySelector("#NS_ConName").value = conName;
}

function checkFileUploads(file, err)
{
    
    var fileName = file.value;
    var ext = fileName.substring(fileName.lastIndexOf(".") + 1);

    if(ext != "pdf" && ext != "zip")
    {
        fileName.value = "";
        err.innerHTML = "We Only Accept PDF or ZIP Files.";
    }
    else
        err.innerHTML = "";

}

function doCntChars(maxLimit)
{

    if(maxLimit == 10000)
    {

        wordLimit = true;

        let w1 = document.querySelector("#NS_Aff").value;
        let l1 = w1.length;
        document.querySelector("#NS_AffErr").innerHTML = 10000 - l1 + " Characters Left !";
        document.querySelector("#NS_AffErr").style.color = "";

        if(10000-l1 < 0)
        {
            wordLimit = false;
            document.querySelector("#NS_AffErr").innerHTML = "Word Limit Exceeded ! Max Limit = 10000";
            document.querySelector("#NS_AffErr").style.color = "red";
        }

    }
    else if(maxLimit == "3000")
    {    

        wordLimit = true;

        let w2 = document.querySelector("#NS_Abstract").value;
        let l2 = w2.length;
        document.querySelector("#NS_AbstractErr").innerHTML = 3000 - l2 + " Characters Left !";
        document.querySelector("#NS_AbstractErr").style.color = "";

        if(3000-l2 < "0")
        {
            wordLimit = false;
            document.querySelector("#NS_AbstractErr").innerHTML = "Word Limit Exceeded ! Max Limit = 3000";
            document.querySelector("#NS_AbstractErr").style.color = "red";
        }

    }
    

}

function getAllDetails(NS_Title, NS_Abstract, NS_Aff, NS_Email, NS_Title)
{

    if(localStorage.getItem("NS_Title"))
        NS_Title.value = localStorage.getItem("NS_Title");
    
    if(localStorage.getItem("NS_Abstract"))
        NS_Abstract.value = localStorage.getItem("NS_Abstract");
    
    if(localStorage.getItem("NS_Aff"))
        NS_Aff.value = localStorage.getItem("NS_Aff");

    if(localStorage.getItem("email"))
        NS_Email.value = localStorage.getItem("email");
    
    // if(localStorage.getItem("NS_Title"))
    //     NS_Title.innerHTML = localStorage.getItem("NS_Title");
    
    document.querySelector("#NS_AuthEmail").value = authEMAIL;
    document.querySelector("#NS_ConName").value = conName;

}

function submitPaper(NS_Form)
{

    var NS_Title = document.querySelector("#NS_Title");
    var NS_TitleErr = document.querySelector("#NS_TitleErr");

    var NS_Abstract = document.querySelector("#NS_Abstract");
    var NS_AbstractErr = document.querySelector("#NS_AbstractErr");
    
    var NS_Aff = document.querySelector("#NS_Aff");
    var NS_AffErr = document.querySelector("#NS_AffErr");

    var NS_Files = document.querySelector("#NS_Files");
    var NS_FilesErr = document.querySelector("#NS_FilesErr");


    if(!NS_Title.value)
    {
        NS_TitleErr.innerHTML = "Please Enter Title !";
        NS_TitleErr.style.color = "red";
    }
    else
    {
        NS_TitleErr.innerHTML = "";
        NS_TitleErr.style.color = "";
        localStorage.setItem("NS_Title", NS_Title.value);
    }

    if(!NS_Abstract.value)
    {
        NS_AbstractErr.innerHTML = "Please Enter Abstract !";
        NS_AbstractErr.style.color = "red";
    }
    else
    {
        localStorage.setItem("NS_Abstract", NS_Abstract.value);
    }

    if(!NS_Aff.value)
    {
        NS_AffErr.innerHTML = "Please Enter Affilation !";
        NS_AffErr.style.color = "red";
    }
    else
    {
        localStorage.setItem("NS_Aff", NS_Title.value);
    }

    if(NS_Files.value == null || NS_Files.value == "")
    {
        NS_FilesErr.innerHTML = "Please Attach Files !";
        NS_FilesErr.style.color = "red";
    }
    else
        NS_FilesErr.innerHTML = "";

    
    if(NS_Abstract.value && NS_Aff.value && NS_Title.value && wordLimit && NS_Files.value)
    {
        NS_Form.submit();
    }
    

}