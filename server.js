var express = require("express");
var fileupload = require("express-fileupload");
var app = express();
var path = require("path");
var mysql2 = require("mysql2");
var bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const LocalStorage = require('node-localstorage').LocalStorage, localStorage = new LocalStorage('./scratch');

const saltRounds = 10;
const saltRoundsADM = 12;


// ==========================================================


app.use(express.static("public"));
app.use(express.urlencoded(true));
app.use(fileupload());


// ==========================================================


app.listen(2005, function(){

    console.log("Server Started");    
    
});


// ==========================================================


app.get("/", function(req, resp)
{
    resp.sendFile(__dirname + "/Public/index.html");
})

app.get("/register", (req, resp) => {
    resp.sendFile(__dirname + "/Public/register.html");
})

app.get("/resetPass", (req, resp) => {
    resp.sendFile(__dirname + "/Public/resetPass.html");
})

app.get("/AuthDash", (req, resp) => {
    resp.sendFile(__dirname + "/Public/Author-Dashboard.html");
})

app.get("/Submission", (req, resp) => {
    resp.sendFile(__dirname + "/Public/Submission.html");
})

app.get("/Submission/:ID", (req, resp) => {
    const id = req.params.ID;
    localStorage.setItem("conName", id);
    resp.redirect("/Submission");
})

app.get("/create-Submission", (req, resp) => {
    resp.sendFile(__dirname + "/Public/NewSubmission.html");
})

app.get("/chair-Conferences", (req, resp) => {
    resp.sendFile(__dirname + "/Public/chairSelectCons.html");
})

app.get("/Rev-Conferences", (req, resp) => {
    resp.sendFile(__dirname + "/Public/RevSelectCons.html");
})

app.get("/Edi-Conferences", (req, resp) => {
    resp.sendFile(__dirname + "/Public/EdiSelectCons.html");
})

app.get("/chair-conDetails", (req, resp) => {
    resp.sendFile(__dirname + "/Public/chairConDet.html");
})

app.get("/Rev-conDetails", (req, resp) => {
    resp.sendFile(__dirname + "/Public/revConDet.html");
})

app.get("/Edi-conDetails", (req, resp) => {
    resp.sendFile(__dirname + "/Public/EdiConDet.html");
})

app.get("/ReviewPaper", (req, resp) => {
    resp.sendFile(__dirname + "/Public/revReviewPaper.html");
})

app.get("/loginAdminDash", (req, resp) => {
    resp.sendFile(__dirname + "/Public/admLogin.html");
})

app.get("/admDash", (req, resp) => {
    resp.sendFile(__dirname + "/Public/admin-Dash.html");
})


// ==========================================================


const config={
    host:"127.0.0.1",
    user:"root",
    password:"@Kunal.SQL2601",
    database:"chitkaraCMT",
    dateStrings: true
}

var mysqldb = mysql2.createConnection(config);

mysqldb.connect(function(err)
{
    
    if(err==null)
        console.log("DB Connected!");
    else
        console.log(err.message);

})


// ==========================================================


var transporter = nodemailer.createTransport
({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mails.kunalbhatia@gmail.com",
      pass: "tfyl klhz wxjz hhou",
    },
});


var sendMail = async (transporter, mailOptions) => {
    try{
        await transporter.sendMail(mailOptions)
        console.log("Email Sent !");
    }
    catch(error)
    {
        console.log(error);
    }
}


// ==========================================================


app.get("/regAUTH", function(req, resp)
{

    var uName = req.query.uName;
    var uEmail = req.query.uEmail; 
    var uPass = req.query.uPass;
    var uORG = req.query.uORG; 
    var uCNT = req.query.uCNT;

    bcrypt.hash(uPass.toString(), saltRounds, function(passerr, hash) {
        
        if(passerr)
        {
            console.log(passerr);
        }
        else
        {

            mysqldb.query("insert into Authors value(?, ?, ?, ?, ?, ?)", [uName, uEmail, hash, uORG, uCNT, "1"], function(err)
            {

                if(err == null)
                {


                    var mailOptions = {
  
                        from: {
                            name: "Kunal Bhatia",
                            address: "mails.kunalbhatia@gmail.com"
                        },
                        to: uEmail,
                        subject: "Welcome To Our Website !",
                        text: "Welcome To Our Website. We Are Happy To See Uh Here !",
                        html: "<h1><b>Welcome To Our Website.</b></h1><br>We Are Happy To See Uh Here !",
                    
                    }

                    sendMail(transporter, mailOptions);

                    resp.send("SignUp Successfull !!!");
                
                }
                else
                    resp.send(err);

            })
        }

    });


})


app.get("/checkDupUser", function(req, resp)
{
    
    var toCheckEmail = req.query.uEmail;

    mysqldb.query("select * from Authors where authEmail=?", [toCheckEmail], function(err, result)
    {

        if(err==null)
        {
            if(result.length!=0)
            {
                resp.send("Email Already Exists !");
            }
            else
                resp.send("");
        }

        else
        {
            resp.send(err.message);
        }

    })

})


app.get("/loginAuth", function(req, resp)
{

    var uEmail = req.query.uEmail;
    var uPass = req.query.uPwd;

    mysqldb.query("select * from Authors where authEmail=?", [uEmail], function(err, result)
    {

        if(err == null)
        {

            if(result.length == 1 && result[0].authStatus == 1)
            {

                bcrypt.compare(uPass.toString(), result[0].authPass, function(errr, passRes)
                {

                    if(errr)
                        resp.send("Some Error !");

                    else if(passRes)
                        resp.send("!yesLogin!");

                    else
                        resp.send("Wrong Password !");
                })

            }
            else if(result.length != 1)
                resp.send("User Account Not Found !");
            else
                resp.send("Your Account is Blocked !");

        }

        else
            resp.send(err);

    })

})


app.get("/frgtPass", (req, resp) => {

    var uEmail = req.query.uEmail;

    mysqldb.query("select * from Authors where authEmail=?", [uEmail], (err, result) => {

        if(!err)
        {

            if(result.length==1)
            {

                var mailOptions = {
  
                    from: {
                        name: "Kunal Bhatia",
                        address: "mails.kunalbhatia@gmail.com"
                    },
                    to: uEmail,
                    subject: "Reset Password !",
                    text: "Reset Your Password To Login Again !",
                    html: "<p>Your Temporary Password : " + result[0].authPass + "</p><br>Use This To Reset Your Password. <br><a href='/resetPass'>Click Here</a> To Reset Your Password.",
                
                }

                sendMail(transporter, mailOptions);

                resp.send("Email Sent !");

            }

        }

    })

})


app.get("/reset", (req, resp) => {
    
    var uEmail = req.query.uEmail;
    var tPass = req.query.tempPass;
    var nPass = req.query.newPass;
    
    mysqldb.query("select * from Authors where authEmail=?", [uEmail], function(err, result)
    {

        if(!err)
        {
            if(result.length == 1)
            {
                if(result[0].authPass == tPass)
                {

                    bcrypt.hash(nPass.toString(), saltRounds, function(passerr, hash)
                    {

                        if(!passerr)
                        {
                            mysqldb.query("update Authors set authPass=? where authEmail=?", [hash, uEmail], (errr) => {
                            
                                if(!err)
                                    resp.send("Password Updated !");
                                else
                                    resp.send(errr);
                                
                            })
                        }
                        else
                            resp.send(passerr);

                    });

                }
                else
                    resp.send("Wrong Temporary Password !");
            }
            else
                resp.send("Invalid User !");
        }
        else
            resp.send(err);


    })
    
})

app.get("/fetchExtC", (req, resp) => {

    mysqldb.query("select * from ExtCons", (err, result) => {
        if(!err)
            resp.send(result);
        else
            resp.send(err);
    })

})


// =========================================================


app.get("/doAdmLogin", function(req, resp)
{

    var uEmail = req.query.email;
    var uPass = req.query.pass;

    mysqldb.query("select * from SiteAdmins where email=?", [uEmail], function(err, result)
    {

        if(err == null)
        {

            if(result.length == 1 && result[0].maxLogin > 0)
            {

                bcrypt.compare(uPass.toString(), result[0].pass, function(errr, passRes)
                {

                    if(errr)
                        resp.send("Some Error !");

                    else if(passRes)
                    {

                        mysqldb.query("update SiteAdmins set maxLogin=? where email=?", [result[0].maxLogin-1, uEmail], (errrr) => {

                            if(!errrr)
                            {
                                localStorage.setItem("AEmail", uEmail);
                                resp.send("!yesLogin!");
                            }
                        })

                    }
                    else
                        resp.send("Wrong Password !");
                })

            }
            else if(result.length != 1)
                resp.send("Account Not Found !");
            else
                resp.send("Login Limit Reached !");

        }

        else
            resp.send(err);

    })

})

app.get("/checkAdmLog", (req, resp) => {

    if(!localStorage.getItem("AEmail") || localStorage.getItem("AEmail") == "")
        resp.send("Nope");
    else
        resp.send(localStorage.getItem("AEmail"));

})

app.get("/logOutAdm", (req, resp) => {

    var email = req.query.email;

    mysqldb.query("select * from SiteAdmins where email=?", [email], (err, result) => {

        if(!err)
        {

            var x = parseInt(result[0].maxLogin) + 1;

            mysqldb.query("update SiteAdmins set maxLogin=? where email=?", [x, email], (errr) => {

                if(!err)
                {
                    localStorage.clear();
                    resp.send("Done");
                }

            })

        }

    })

})

app.get("/cngAdmPass", (req, resp) => {

    var Email = req.query.Email;
    var cPass = req.query.cPass;
    var nPass = req.query.nPass;


    mysqldb.query("select * from SiteAdmins where email=?", [Email], function(err, result)
    {

        if(err == null)
        {

            if(result.length == 1)
            {

                bcrypt.compare(cPass.toString(), result[0].pass, function(errr, passRes)
                {

                    if(errr)
                        resp.send("Some Error !");

                    else if(passRes)
                    {

                        bcrypt.hash(nPass.toString(), saltRoundsADM, function(passerr, hash) {
        
                            if(passerr)
                            {
                                console.log(passerr);
                            }
                            else
                            {
                    
                                mysqldb.query("update SiteAdmins set pass=? where email=?", [hash, Email], function(err)
                                {
                    
                                    if(err == null)
                                        resp.send("Password Updated !");
                                    
                                    else
                                        resp.send(err);
                    
                                })
                            }
                    
                        });

                    }

                    else
                        resp.send("Wrong Password !");
                })

            }

        }

        else
            resp.send(err);

    })

})

app.get("/admAllCons" ,(req, resp) => {

    mysqldb.query("select * from allPapers" , (err, result) => {

        if(!err)
            resp.send(result);

    })

})

app.get("/addCon", (req, resp) => {

    var cName = req.query.cName;
    var cWeb = req.query.cWeb;
    var cSub = req.query.cSub;
    var cCty = req.query.cCty;
    var cCNTRY = req.query.cCNTRY;
    var cStart = req.query.cStart;
    var cEnd = req.query.cEnd;
    var cEmail = req.query.cEmail;


    mysqldb.query("insert into Conferences values(?, ?, ?, ?, ?, ?, ?, ?)", [cName, cWeb, cSub, cCty, cCNTRY, cStart, cEnd, cEmail], (err) => {

        if(err)
            resp.send(err);
        else
        {

            var mailOptions = {
  
                from: {
                    name: "Kunal Bhatia",
                    address: "mails.kunalbhatia@gmail.com"
                },
                to: cEmail,
                subject: "Conference Request Accepted !",
                text: "Conference Request Accepted !",
                html: "Conguratulations Your Conference '" + cName + "' is Live Now !" + "<p>You Can Login Using Your Email and Password And Switch Profile As ChairPerson.</p>",
            
            }

            sendMail(transporter, mailOptions);

            mysqldb.query("delete from ConReqs where conName=?", [cName], (err) => {

                if(!err)
                    resp.send("!ALL Done!");

            })


        }

    })


})

app.get("/rejConReq", (req, resp) => {

    var conName = req.query.conName;
    var email = req.query.email;

    mysqldb.query("delete from ConReqs where conName=?", [conName], (err) => {

        if(!err)
        {

            var mailOptions = {
  
                from: {
                    name: "Kunal Bhatia",
                    address: "mails.kunalbhatia@gmail.com"
                },
                to: email,
                subject: "Conference Request Rejected !",
                text: "Conference Request Rejected !",
                html: "Your Conference '" + conName + "' is Rejected !",
            
            }

            sendMail(transporter, mailOptions);

            mysqldb.query("delete from ConAdmins where conName=?", [conName], (err) => {

                if(!err)
                    resp.send("!ALL Done!");

            })

        }

    })

})

app.get("/admAllReqCons", (req, resp) => {

    mysqldb.query("select * from ConReqs", (err, result) => {
        
        if(!err)
        {
            resp.send(result);
        }
        else
            resp.send(err);
        
    })

})

app.get("/addExtCon", (req, resp) => {

    var title = req.query.cTitle;
    var link = req.query.cLink;

    mysqldb.query("insert into ExtCons values(?, ?)", [title, link], (err) => {

        if(!err)
            resp.send("External Conference Added");

    })

})

app.get("/dltExtC", (req, resp) => {

    var cLink = req.query.cLink;

    mysqldb.query("delete from ExtCons where conLink=?", [cLink], (err) => {

        if(!err)
            resp.send("External Conference Deleted");

    })

})

app.get("/admConAdms", (req, resp) => {

    mysqldb.query("select * from ConAdmins", (err, result) => {

        if(!err)
            resp.send(result);

    })

})

app.get("/changeConAdmStatus", (req, resp) => {

    var conName = req.query.conName;
    var DoStatus = req.query.DoStatus;

    mysqldb.query("update ConAdmins set conAdmStatus=? where conName=?", [DoStatus, conName], (err) => {

        if(!err)
            resp.send("Done");

    })

})


// ==========================================================


app.get("/deleteAuth", (req, resp) => {

    var Email = req.query.Email;

    mysqldb.query("delete from Authors where authEmail=?", [Email], (err) => {

        if(!err)
        {

            var mailOptions = {
  
                from: {
                    name: "Kunal Bhatia",
                    address: "mails.kunalbhatia@gmail.com"
                },
                to: Email,
                subject: "Account Deleted !",
                text: "See You Soon Again !",
                html: "<p>Your Account is Deleted Successfully!</p>",
            
            }

            sendMail(transporter, mailOptions);

            resp.send("!Deleted!");
        }
        else
            resp.send(err);

    })

})


app.get("/cngPass", (req, resp) => {

    var Email = req.query.Email;
    var cPass = req.query.cPass;
    var nPass = req.query.nPass;


    mysqldb.query("select * from Authors where authEmail=?", [Email], function(err, result)
    {

        if(err == null)
        {

            if(result.length == 1)
            {

                bcrypt.compare(cPass.toString(), result[0].authPass, function(errr, passRes)
                {

                    if(errr)
                        resp.send("Some Error !");

                    else if(passRes)
                    {

                        bcrypt.hash(nPass.toString(), saltRounds, function(passerr, hash) {
        
                            if(passerr)
                            {
                                console.log(passerr);
                            }
                            else
                            {
                    
                                mysqldb.query("update Authors set authPass=? where authEmail=?", [hash, Email], function(err)
                                {
                    
                                    if(err == null)
                                        resp.send("Password Updated !");
                                    
                                    else
                                        resp.send(err);
                    
                                })
                            }
                    
                        });

                    }

                    else
                        resp.send("Wrong Password !");
                })

            }

        }

        else
            resp.send(err);

    })

})


app.get("/fetch-All-Conferences", (req, resp) => {

    mysqldb.query("select * from Conferences", (err, result) => {
        
        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})


app.get("/fetch-Papers", (req, resp) => {

    var email = req.query.Email;
    var ConName = req.query.ConName;

    mysqldb.query("select * from allPapers where authEmail=? and conName=?", [email, ConName], (err, result) => {

        if(!err)
            resp.send(result);
        else
            console.log(err);

    })

})


app.get("/fetch-All-contriPapers", (req, resp) => {

    var email = req.query.email;

    mysqldb.query("select Conferences.conName, Conferences.conWeb, Conferences.conAdmin, Conferences.conStart, Conferences.conEnd from Conferences INNER JOIN allPapers where Conferences.conName = allPapers.conName and allPapers.authEmail=?", [email], (err, result) => {
        
        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/ReqCon", (req, resp) => {

    var cName = req.query.cName;
    var cWeb = req.query.cWeb;
    var cSub = req.query.cSub;
    var cCty = req.query.cCty;
    var cCNTRY = req.query.cCNTRY;
    var cStart = req.query.cStart;
    var cEnd = req.query.cEnd;
    var cEmail = req.query.cEmail;


    mysqldb.query("insert into ConReqs values(?, ?, ?, ?, ?, ?, ?, ?)", [cName, cWeb, cSub, cCty, cCNTRY, cStart, cEnd, cEmail], (err) => {

        if(err)
            resp.send(err);
        else
        {

            mysqldb.query("insert into ConAdmins values(?, ?, ?)", [cName, cEmail, "1"], (errr) => {

                if(errr)
                    resp.send(errr);
                else
                {

                    var mailOptions = {
  
                        from: {
                            name: "Kunal Bhatia",
                            address: "mails.kunalbhatia@gmail.com"
                        },
                        to: cEmail,
                        subject: "Conference Requested !",
                        text: "Conference Requested !",
                        html: "Your Conference '" + cName + "' Has Been Requested !",
                    
                    }
    
                    sendMail(transporter, mailOptions);

                    resp.send("!ALL Done!");

                }

            })

        }

    })


})


app.get("/doSettings", (req, resp) => {

    var conName = req.query.cName;
    var maxREV = req.query.maxREV;
    var maxEDI = req.query.maxEDI;
    var maxASSIGN = req.query.maxASSIGN;

    mysqldb.query("insert into conSettings values(?, ?, ?, ?, ?)", [conName, maxREV, maxEDI, maxASSIGN, "NONE"], (err) => {

        if(!err)
        {
            resp.send("allok!!");
        }

    })

})

app.get("/updateSettings", (req, resp) => {

    var CN = req.query.CN;
    var SMR = req.query.SMR;
    var SME = req.query.SME;
    var SMA = req.query.SMA;

    mysqldb.query("update conSettings set maxRev=?, maxEDI=?, maxAssign=? where conName=?", [SMR, SME, SMA, CN], (err, result) => {

        if(!err)
            resp.send("DONE");
        else
            resp.send(err);

    })

})

app.get("/getAuthDet", (req, resp) => {

    var email = req.query.email;

    mysqldb.query("select * from Authors where authEmail=?", [email], (err, result) => {
        
        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})


app.post("/submitPaper", (req, resp) => {

    var conName = req.body.NS_ConName;
    var authEmail = req.body.NS_AuthEmail;
    var title = req.body.NS_Title;
    var abstract = req.body.NS_Abstract;
    var aff = req.body.NS_Aff;
    var Filename = conName + "_" + authEmail + "_" + req.files.NS_Files.name;

    
    var filePath=path.join(__dirname, "Public", "Uploads", "Papers", Filename);
    req.files.NS_Files.mv(filePath);

    
    mysqldb.query("insert into allPapers values(?, ?, ?, ?, ?, ?, ?, ?)", [conName, authEmail, title, abstract, aff, Filename, "Not Reviewed", "NULL"], (err) => {

        if(!err)
            resp.sendFile(__dirname + "/Public/Author-Dashboard.html");
        else
        {
            console.log(JSON.stringify(err));
            resp.sendFile(__dirname + "/Public/NewSubmission.html");
        }

    })

})


app.get("/checkIfSharedLink", (req, resp) => {

    var x = localStorage.getItem("conName");
    localStorage.clear();


    mysqldb.query("select * from Conferences where conName=?", [x], (err, result) => {

        if(!err)
        {

            if(result.length == 0)
                resp.send("!NOPE!");
            else
                resp.send(x);

        }
        else
            resp.send(err);

    })

})

// ==========================================================


app.get("/checkIfChair", (req, resp) => {

    var email = req.query.email;

    mysqldb.query("select * from ConAdmins where conAdmEmail=?", [email], (err, result) => {

        if(!err)
        {

            if(result.length > 0)
                resp.send("!YES!");
            else
                resp.send("Nope");

        }

    })

})

app.get("/checkIfRev", (req, resp) => {

    var email = req.query.email;

    mysqldb.query("select * from Reviewers where RevEmail=?", [email], (err, result) => {

        if(!err)
        {

            if(result.length > 0)
                resp.send("!YES!");
            else
                resp.send("Nope");

        }

    })

})

app.get("/checkIfEdi", (req, resp) => {

    var email = req.query.email;

    mysqldb.query("select * from Editors where EdiEmail=?", [email], (err, result) => {

        if(!err)
        {

            if(result.length > 0)
                resp.send("!YES!");
            else
                resp.send("Nope");

        }

    })

})

app.get("/fetchChairCons", (req, resp) => {

    var email = req.query.email;

    mysqldb.query("select Conferences.conName, Conferences.conWeb from Conferences INNER JOIN ConAdmins where Conferences.conName = ConAdmins.conName and ConAdmins.conAdmEmail=? and ConAdmins.conAdmStatus=?", [email, "1"], (err, result) => {
        
        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/fetchRevCons", (req, resp) => {

    var email = req.query.email;

    mysqldb.query("select Conferences.conName, Conferences.conWeb from Conferences INNER JOIN Reviewers where Conferences.conName = Reviewers.conName and Reviewers.RevEmail=? and Reviewers.RevStatus=?", [email, "1"], (err, result) => {
        
        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/checkSettings", (req, resp) => {

    var conName = req.query.CONNAME;

    mysqldb.query("select * from conSettings where conName=?", [conName], (err, result) => {

        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})


// ==========================================================


app.get("/getTotalSubmissions", (req, resp) => {

    var conName = req.query.conName;

    mysqldb.query("select * from allPapers where conName=?", [conName], (err, result) => {

        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/getReviewedSubmissions", (req, resp) => {

    var conName = req.query.conName;

    mysqldb.query("select * from allPapers where conName=? and pRating!=?", [conName, "NULL"], (err, result) => {

        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/getEditors", (req, resp) => {

    var conName = req.query.conName;

    mysqldb.query("select * from Editors where conName=?", [conName], (err, result) => {

        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/resumeEdi", (req, resp) => {

    var conName = req.query.conName;
    var email = req.query.Email;

    mysqldb.query("update Editors set EdiStatus=? where conName=? and EdiEmail=?", ["1", conName, email], (err, result) => {

        if(!err)
        {

            if(result.affectedRows == 1)
                resp.send("!DONE!");

        }
        else
            resp.send(err);

    })

})

app.get("/blockEdi", (req, resp) => {

    var conName = req.query.conName;
    var email = req.query.Email;

    mysqldb.query("update Editors set EdiStatus=? where conName=? and EdiEmail=?", ["0", conName, email], (err, result) => {

        if(!err)
        {

            if(result.affectedRows == 1)
                resp.send("!DONE!");

        }
        else
            resp.send(err);

    })

})

app.get("/removeEdi", (req, resp) => {

    var conName = req.query.conName;
    var email = req.query.Email;

    mysqldb.query("delete from Editors where conName=? and EdiEmail=?", [conName, email], (err, result) => {

        if(!err)
        {
            resp.send("!DONE!");
        }
        else
            resp.send(err);

    })

})

app.get("/getReviewers", (req, resp) => {

    var conName = req.query.conName;

    mysqldb.query("select * from Reviewers where conName=?", [conName], (err, result) => {

        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/resumeRev", (req, resp) => {

    var conName = req.query.conName;
    var email = req.query.Email;

    mysqldb.query("update Reviewers set RevStatus=? where conName=? and RevEmail=?", ["1", conName, email], (err, result) => {

        if(!err)
        {

            if(result.affectedRows == 1)
                resp.send("!DONE!");

        }
        else
            resp.send(err);

    })

})

app.get("/blockRev", (req, resp) => {

    var conName = req.query.conName;
    var email = req.query.Email;

    mysqldb.query("update Reviewers set RevStatus=? where conName=? and RevEmail=?", ["0", conName, email], (err, result) => {

        if(!err)
        {

            if(result.affectedRows == 1)
                resp.send("!DONE!");

        }
        else
            resp.send(err);

    })

})

app.get("/removeRev", (req, resp) => {

    var conName = req.query.conName;
    var email = req.query.Email;

    mysqldb.query("delete from Reviewers where conName=? and RevEmail=?", [conName, email], (err, result) => {

        if(!err)
        {
            resp.send("!DONE!");
        }
        else
            resp.send(err);

    })

})

app.get("/checkIfAuthorExists", (req, resp) => {

    var email = req.query.uEmail;
    var conName = req.query.conName;

    mysqldb.query("select * from Editors where conName=? and EdiEmail=?", [conName, email], (err, result) => {

        if(!err)
        {
            if(result.length == 0)
                resp.send("!YouCanAdd!");
            else
                resp.send("No");
        }

    })

})

app.get("/AddNewEditor", (req, resp) => {

    var email = req.query.email;
    var conName = req.query.conName;

    mysqldb.query("insert into Editors values(?, ?, ?)", [conName, email, "1"], (err, result) => {

        if(!err)
            resp.send("DONE");
        else
            resp.send(err);

    })

})

app.get("/checkIfRevExists", (req, resp) => {

    var email = req.query.uEmail;
    var conName = req.query.conName;

    mysqldb.query("select * from Reviewers where conName=? and RevEmail=?", [conName, email], (err, result) => {

        if(!err)
        {
            if(result.length == 0)
                resp.send("!YouCanAdd!");
            else
                resp.send("No");
        }

    })

})

app.get("/AddNewRev", (req, resp) => {

    var email = req.query.email;
    var conName = req.query.conName;

    mysqldb.query("insert into Reviewers values(?, ?, ?)", [conName, email, "1"], (err, result) => {

        if(!err)
            resp.send("DONE");
        else
            resp.send(err);

    })

})

app.get("/checkAllowedAssign", (req, resp) => {

    var REmail = req.query.REmail;
    var CONNAME = req.query.CONNAME;
    var AEmail = req.query.AEmail;

    mysqldb.query("select * from AssignedPapers where RevEmail=? and conName=? and authEmail=?", [REmail, CONNAME, AEmail], (err, result) => {

        if(!err)
        {

            if(result.length > 0)
            {
                resp.send("ALREADYASSIGNED");
            }
            else
            {

                mysqldb.query("select * from AssignedPapers where RevEmail=? and conName=?", [REmail, CONNAME], (errr, resultt) => {

                    if(!errr)
                    {
                        resp.send(resultt);
                    }

                })

            }

        }

    })

})

app.get("/assignToEmail", (req, resp) => {

    var REmail = req.query.REmail;
    var CONNAME = req.query.CONNAME;
    var AEmail = req.query.AEmail;

    mysqldb.query("insert into AssignedPapers values(?, ?, ?)", [REmail, CONNAME, AEmail], (err, result) => {

        if(!err)
        {
            resp.send("DONE");
        }
        else
            resp.send(err);

    })

})

app.get("/getPaperStats", (req, resp) => {

    var AEmail = req.query.AEmail;
    var cName = req.query.cName;
    var total, Reviewed;

    mysqldb.query("select * from ReviewedPapers where conName=? and authEmail=?", [cName, AEmail], (err, result) => {

        if(!err)
        {

            Reviewed = result.length;

            mysqldb.query("select * from AssignedPapers where conName=? and authEmail=?", [cName, AEmail], (errr, resultt) => {

                if(!errr)
                {
                    total = resultt.length + Reviewed;
                    resp.send("Assigned : " + total + " Times\nReviewed : " + Reviewed + " Times");
                }
                else
                    resp.send(errr);
        
            })

        }
        else
            resp.send(err);

    })

})

// ==========================================================

app.get("/getAssignedPapers", (req, resp) => {

    var email = req.query.Email;
    var conName = req.query.conName;

    mysqldb.query("select allPapers.authEmail, allPapers.pTitle, allPapers.pAbs, allPapers.pAff, allPapers.pFile from allPapers INNER JOIN AssignedPapers where allPapers.conName = AssignedPapers.conName and allPapers.authEmail = AssignedPapers.authEmail and AssignedPapers.revEmail=? and AssignedPapers.conName=?", [email, conName], (err, result) => {

        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/getReviewedPapers", (req, resp) => {

    var email = req.query.Email;
    var conName = req.query.conName;

    mysqldb.query("select allPapers.authEmail, allPapers.pTitle from allPapers INNER JOIN ReviewedPapers where allPapers.conName = ReviewedPapers.conName and allPapers.authEmail = ReviewedPapers.authEmail and ReviewedPapers.revEmail=? and ReviewedPapers.conName=?", [email, conName], (err, result) => {

        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/getReviewedRating", (req, resp) => {

    var email = req.query.Email;
    var conName = req.query.conName;

    mysqldb.query("select * from ReviewedPapers where conName=? and revEmail=?", [conName, email], (err, result) => {

        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/checkReview", (req, resp) => {

    var authEmail = req.query.AuthEmail;
    var conName = req.query.conName;
    var Review = req.query.Review;
    var Rating = req.query.Rating;

    mysqldb.query("select * from allPapers where conName=? and authEmail=? and pRating!=?", [conName, authEmail, "NULL"], (err, result) => {

        if(!err)
        {

            if(result.length > 0)
            {

                Review = Review + " => " + result[0].pReview;
                Rating = (parseFloat(Rating) + parseFloat(result[0].pRating))/2;


                mysqldb.query("update allPapers set pReview=?, pRating=? where conName=? and authEmail=?", [Review, Rating, conName, authEmail], (errr, resultt) => {

                    if(!err)
                    {
                        resp.send("GoodWork!!!");
                    }
                    else
                    {
                        resp.send(errr);
                    }

                })

            }
            else
            {

                mysqldb.query("update allPapers set pReview=?, pRating=? where conName=? and authEmail=?", [Review, Rating, conName, authEmail], (errr) => {

                    if(!err)
                    {
                        resp.send("Good");
                    }
                    else
                        resp.send(errr)

                })

            }

        }

    })

})

app.get("/addReview", (req, resp) => {

    var conName = req.query.conName;
    var AuthEmail = req.query.AuthEmail;
    var revEmail = req.query.revEmail;
    var q1 = req.query.q1;
    var q2 = req.query.q2;
    var q3 = req.query.q3;
    var q4 = req.query.q4;
    var q5 = req.query.q5;
    var q6 = req.query.q6;
    var q7 = req.query.q7;
    var q8 = req.query.q8;
    var q9 = req.query.q9;
    var q10 = req.query.q10;
    var overall = req.query.overall;

    mysqldb.query("insert into ReviewedPapers values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [conName, AuthEmail, revEmail, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, overall], (err, result) => {

        if(!err)
        {

            mysqldb.query("delete from AssignedPapers where conName=? and authEmail=? and RevEmail=?", [conName, AuthEmail, revEmail], (errr) => {

                if(!errr)
                    resp.send("!ALL Done!");
                else
                    resp.send(errr)

            })

        }
        else
            resp.send(err);

    })

})

// ==========================================================


app.get("/fetchEdiCons", (req, resp) => {

    var email = req.query.email;

    mysqldb.query("select Conferences.conName, Conferences.conWeb from Conferences INNER JOIN Editors where Conferences.conName = Editors.conName and Editors.EdiEmail=? and Editors.EdiStatus=?", [email, "1"], (err, result) => {
        
        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/getPublishingData", (req, resp) => {

    var email = req.query.EMAIL;
    var conName = req.query.conName;

    mysqldb.query("select * from ReviewedPapers where authEmail=? and conName=?", [email, conName], (err, result) => {

        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/checkIfPublished", (req, resp) => {

    var email = req.query.EMAIL;
    var conName = req.query.conName;
    var title = req.query.title;

    mysqldb.query("select * from publishedPapers where authEmail=? and conName=? and paperTitle=?", [email, conName, title], (err, result) => {

        if(!err)
        {

            if(result.length > 0)
            {
                resp.send("YESSAVAILABLE");
            }
            else
                resp.send("Noep");

        }
        else
            resp.send(err);

    })

})

app.get("/publishPaper", (req, resp) => {

    var conName = req.query.conName;
    var aEmail = req.query.aEmail;
    var pTitle = req.query.pTitle;
    var ediMail = req.query.ediMail;

    mysqldb.query("insert into publishedPapers values(?, ?, ?, ?)", [conName, aEmail, pTitle, ediMail], (err) => {

        if(!err)
        {

            var mailOptions = {
  
                from: {
                    name: "Kunal Bhatia",
                    address: "mails.kunalbhatia@gmail.com"
                },
                to: aEmail,
                subject: "Congratulations!!! Your Paper Have Been Published...",
                text: "Congratulations!!! Your Paper Have Been Published...",
                html: "Congratulations!!! Your Paper '" + pTitle + "' of Conference '" + conName + "' Have Been Published...",
            
            }

            sendMail(transporter, mailOptions);

            resp.send("done");
        }
        else
            resp.send(err);

    })

})

app.get("/getPubData", (req, resp) => {

    var cName = req.query.cName;

    mysqldb.query("select * from publishedPapers where conName=?", [cName], (err, result) => {

        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})