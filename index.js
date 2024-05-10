import express from "expres";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const _dirname=dirname(fileURLToPath(import.meta.url));
var app=express();

const port=5000;

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"world",
    password:"123456"
})
db.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.sendFile(_dirname+"/public/login.html");
})
app.get("/signup",(req,res)=>{
    res.sendFile(_dirname+"/public/signup.html")
});
app.get("/about",(req,res)=>{
    res.render("about.ejs");
});
//-----  A L L   D I S H E S  -----------------------------------------------------------------------------------------------------------//
app.get("/sushi",(req,res)=>{
   res.sendFile(_dirname+"/public/dishes/sushi.html")
});
app.get("/rendang",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/rendang.html")
 });
 app.get("/ramen",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/ramen.html")
 });
 app.get("/tomyamgoong",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/tomyamgoong.html")
 });
 app.get("/kebab",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/kebab.html")
 });
app.get("/dosa",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/dosa.html")
 });
 app.get("/goulash",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/goulash.html")
 });
 app.get("/kimchi",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/kimchi.html")
 });
 app.get("/biryani",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/biryani.html")
 });
 app.get("/paella",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/paella.html")
 });
 app.get("/pekingduck",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/pekingduck.html")
 });
 app.get("/padthai",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/padthai.html")
 });
 app.get("/poutine",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/poutine.html")
 });
 app.get("/pasta",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/pasta.html")
 });
 app.get("/pizza",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/pizza.html")
 });
 app.get("/beef",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/beef.html")
 });
 app.get("/pierogi",(req,res)=>{
    res.sendFile(_dirname+"/public/dishes/pierogi.html")
 });
 app.get("/wantupdate",(req,res)=>{
    res.sendFile(_dirname+"/public/profileupdate.html");
 });
 app.get("/wantpwdupdate",(req,res)=>{
    res.sendFile(_dirname+"/public/pwdupdate.html");
 });
 app.get("/wantdelete",(req,res)=>{
    res.sendFile(_dirname+"/public/deleteprofile.html");
 });

//-------   L O G   I N   V E R I F I C A T I O N   --------------------------------------------------------------------------------//
app.post("/Submit",async (req,res)=>{
    var xemail=req.body.email;
    var xpwd=req.body.pwd;
try{
 const checkresult=await db.query("SELECT * FROM userprofile WHERE email=$1",[xemail]);

 if(checkresult.rows.length > 0)
 {
    const user=checkresult.rows[0];
    const storedpwd=user.pwd;

    if(xpwd === storedpwd)
    { 
        res.render("home.ejs",{
            useremail:user.email,
            uniquename:user.username,
            myname:user.uname,
            usercontactno:user.contactno
        }); 
    }
    else{
        res.render("loginauthf.ejs",{
            response:"WRONG PASSWORD"
        });
    }
 }
 else{
    res.render("loginauthf.ejs",{
        response:"INVALID EMAIL"
    });
 }
}catch(err){
    console.log(err);
}
});

//----  S I G N U P  ------------------------------------------------------------------------------------------------------------------//
app.post("/signup-process",async (req,res)=>{
    var xemail=req.body.email;

    try{
    const checkresult=await db.query("SELECT * FROM userprofile WHERE email=$1",[xemail]);

    if(checkresult.rows.length > 0)
    {
        res.sendFile(_dirname+"/public/authf.html");
    }
    else{
        var xuname=req.body.uname;
        var xcontactno=req.body.contactno;
        var xusername=req.body.username;
        var xpwd=req.body.pwd;
        db.query("INSERT INTO userprofile (email,uname,contactno,username,pwd) VALUES ($1,$2,$3,$4,$5)",[xemail,xuname,xcontactno,xusername,xpwd]);
        res.render("home.ejs",{
            useremail: xemail,
            uniquename:xusername,
            myname:xuname,
            usercontactno:xcontactno
        });
    }
}
catch(err)
{
    console.log(err);
}
});

//------   P R O F I L E   U P D A T E   ------------------------------------------------------------------------------------------//
app.post("/profile-update",async (req,res)=>{
    var xemail=req.body.email;
    var xuname=req.body.uname;
    var xcontactno=req.body.contactno;
    var xusername=req.body.username;
    var xpwd=req.body.pwd;
try{
 const checkresult=await db.query("SELECT * FROM userprofile WHERE email=$1",[xemail]);

 if(checkresult.rows.length > 0)
 {
    const user=checkresult.rows[0];
    const storedpwd=user.pwd;

    if(xpwd === storedpwd)
    { 
        db.query("UPDATE userprofile SET (uname,contactno,username)=($1,$2,$3) WHERE email=$4",[xuname,xcontactno,xusername,xemail]);
        res.render("home.ejs",{
            useremail: xemail,
            uniquename:xusername,
            myname:xuname,
            usercontactno:xcontactno
        });
    }
    else{
        res.render("loginauthf.ejs",{
            response:"WRONG PASSWORD"
        });
    }
 }
 else{
    res.render("loginauthf.ejs",{
        response:"INVALID EMAIL"
    });
 }
}catch(err){
    console.log(err);
}
});

//-------   P A S S W O R D   U P D A T E   ----------------------------------------------------------------------------------------------------//
app.post("/pwd-update",async (req,res)=>{
    var xemail=req.body.email;
    var xpwd=req.body.pwd;
    var xnpwd=req.body.newpwd;
try{
 const checkresult=await db.query("SELECT * FROM userprofile WHERE email=$1",[xemail]);

 if(checkresult.rows.length > 0)
 {
    const user=checkresult.rows[0];
    const storedpwd=user.pwd;

    if(xpwd === storedpwd)
    { 
        db.query("UPDATE userprofile SET pwd=$1 WHERE email=$2",[xnpwd,xemail]);
        res.redirect("/");
    }
    else{
        res.render("loginauthf.ejs",{
            response:"Incorrect PASSWORD!"
        });
    }
 }
 else{
    res.render("loginauthf.ejs",{
        response:"INVALID EMAIL"
    });
 }
}catch(err){
    console.log(err);
}
});

//------   P R O F I L E   D E L E T E   -----------------------------------------------------------------------------------------//
app.post("/profile-delete",async (req,res)=>{
    var xemail=req.body.email;
    var xpwd=req.body.pwd;
    var xnpwd=req.body.newpwd;
try{
 const checkresult=await db.query("SELECT * FROM userprofile WHERE email=$1",[xemail]);

 if(checkresult.rows.length > 0)
 {
    const user=checkresult.rows[0];
    const storedpwd=user.pwd;

    if(xpwd === storedpwd)
    { 
        db.query("DELETE FROM userprofile WHERE email=$1",[xemail]);
        res.redirect("/");
    }
    else{
        res.render("loginauthf.ejs",{
            response:"Incorrect PASSWORD!"
        });
    }
 }
 else{
    res.render("loginauthf.ejs",{
        response:"INVALID EMAIL"
    });
 }
}catch(err){
    console.log(err);
}
});

//------   S E A R C H I N G   ------------------------------------------------------------------------------------------//
app.post("/search",async (req,res)=>{
    var xsearch=req.body.search;
    const checkresult=await db.query("SELECT * FROM recipetable WHERE dname=$1",[xsearch]);
    try{
        if(checkresult.rows.length > 0)
        {
            var result=checkresult.rows[0];
            var show=result.recipe;

           
            res.render("searchrecipe.ejs",{
                dishname: xsearch,
                searchedrecipe: show,
            });
        }
        else{
            res.render("failsearchrecipe.ejs",{
                dishname: xsearch,
            })
        }
    }
catch(err)
{
    console.log(err);
}
});
app.listen(port,()=>{
    console.log(`server started at port http://localhost:${port}`);
});

