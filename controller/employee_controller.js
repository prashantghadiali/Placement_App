const Employees = require('../models/employees');
const bodyParser = require('body-parser');
const Student = require('../models/student');
var cookieParser = require('cookie-parser');
const fs = require("fs");
const csv = require("fast-csv");


// for render sign up page
module.exports.signUp = function(req, res){
    return res.render('sign_up_view', {
        title: "Placement App | Sign Up"
    })
}

// for render sign in page
module.exports.signIn = function(req, res){
    return res.render('sign_in_view', {
        title: "Placement App | Sign In"
    });
}

// create Employee in Database
module.exports.create = async function(req, res, next){
    // if password and confirm password not matched redirect back
    if (req.body.password != req.body.conf_pass) {
        console.log("pass and conf pass not matched");
        return res.status(400).json({
            messeage: "Please Enter Same Value of Password and Confirm Password!",
            data: {},
        });
        // return res.redirect('back');
    }
    console.log("req.body: ",req.body.email);
    try{
        // If password and confirm password matched, find employee.
        let emp = await Employees.findOne({email:req.body.email});
        
        // if that email is not in database, then create new employee.
        if(!emp){
            emp = await Employees.create(req.body);
                
                console.log("create Success", req.body);
                return res.status(201).json({
                    messeage: "Employee Created!",
                    data: {},
                });
                // return res.redirect('/emp/signin');
        }
        else{
            return res.redirect('back');    // if eployee is in database then redirect back 
        }
    }catch(err){
        console.log("Error in Employee Create", err);   // if detects any error
    }
}

// for employee page "emppage.ejs"
module.exports.empPage = async function(req, res){
    try {
        //Student list is fetch in db. It is sort by latest entry and limit by 10 entries.
        let findList = await Student.find({}).limit(10).sort({ _id: -1 });     
        var emp_id = req.cookies.emp_id;     //cookie is get by request to browser.
        
        // if cookie is available then renders Employee Page else redirect back.
        if(emp_id){
            // console.log("cookie", emp_id);
            return res.render('emppage', {
                title: "App | Employee Section",
                stdlist: findList,
                emp_id: emp_id
            });
        }
        else{
            return res.redirect('back')  // if detects no cookie value
        }
    } catch (error) {
        console.log("Eroor :", error);    // if it detects any error.
    }
}

// for sign in page (named sign in)
module.exports.makeSession = async function(req, res){
    try {
        let emp = await Employees.findOne({email: req.body.email});
        if (emp) {
            console.log("Success, Employee is Found in Database", emp);
            if (emp.password != req.body.password) {
                console.log("Password Doesen't Match");
                return res.status(400).json({
                    messeage: "Please Enter Same Value of Password and Confirm Password!",
                    data: {},
                });
                // return res.redirect('back');
            }
            console.log("req body:", req.body);

            // Handle Session Creation
            res.cookie('emp_id', emp.id);
            return res.redirect('/emp/emppage');
        }else{
            return res.redirect('back');
        }
    } catch (error) {
        console.log("Employee is not Found in Database", error);    
    }
}

// to set the interview find by student ID and push the interview array.
module.exports.updateStudent = async function(req, res) {
    try { 
      // console.log("in Update");
      let std = await Student.find({}).limit(10).sort({ _id: -1 });
      // Get the form data from the body parameters
      console.log("update body :", req.body);
      const { stuid, comp, shdate } = req.body;
      if(std){
        // Find the student by id and push a new interview object to the interview array
        let student = await Student.findByIdAndUpdate(stuid, {
          $push: {
            interview: {
              stuid: stuid,
              comp: comp,
              date: shdate,
            }
          }
        }, { new: true });
        if (student) {
          console.log("Interview Created");
          return res.redirect('back');
        }else{
          return res.redirect('back');
        }
      }
    } catch (err) {
      // Handle error
      console.error(err);
      res.status(500).send("Something went wrong");
    }
  };


// for download csv
module.exports.csvdown = async function(req, res){
    try {
        // creating writestream from fs
        const ws = fs.createWriteStream('public/StudentsData.csv');
        // getting student model, find all in less required data(Enabling the lean option tells Mongoose to skip instantiating a full Mongoose document)
        // exec method will execute the query and return a Promise
        Student.find().lean().exec().then(function(data) {
            // for parsing interview data [object object] to useful value
            data.forEach(function(item) {
                item.interview = JSON.stringify(item.interview);
            });
            // using fast csv to write the mode data and when complete it respond with finish html notification
            csv.write(data, { headers: true })
            .on("finish", function(){
                    res.send(`
                    <div class="alert" id="myAlert">
                        <span class="closebtn" onclick="this.parentElement.style.display='none';">×</span>
                        <strong>Success!</strong> Your file has been downloaded. Please Check Public/CSV Folder...
                    </div>
                    <div class="container">
                        <h1>Download Successful...</h1>
                    </div>
                    
                    <style>
                    .alert {
                        padding: 20px;
                        background-color: #4CAF50;
                        color: white;
                        animation-name: slideIn;
                        animation-duration: 2s;
                    }
                    .container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 300px;
                        border: 1px solid black;
                        color: green;
                      }
                    
                      h1 {
                        font-size: 36px;
                      }
                    
                    @keyframes slideIn {
                        from {
                        margin-top: -50px;
                        opacity: 0;
                        }
                        to {
                        margin-top: 0px;
                        opacity: 1;
                        }
                    }
                    </style>
                  `) 
                })
            .pipe(ws);

          }).catch(function(err) {
            // handle error
            console.log("exec Error", err);
          });
          
    } catch (error) {
        console.log("CSV Error", error);
    }
}

