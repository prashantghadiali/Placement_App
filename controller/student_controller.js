const Student = require('../models/student');
const bodyParser = require('body-parser');

// create Student Data
module.exports.student = async function(req, res){
    try{
        console.log("status", req.body.status);
        // Convert the value of "on" or "off" to true or false
        if (req.body.status === 'on') {
            req.body.status = true;
        } else {
            req.body.status = false;
        }
        console.log("status", req.body.status);
        let std = await Student.findOne({});
        if(std){
            std = await Student.create(req.body);
            const doc = await Student.findOne(std);
            // push the body value to interview array in created student
            doc.interview.push({date:req.body.date, comp:req.body.comp, result:req.body.result})
            // if pushed complete then save the value
            await doc.save()
            console.log("Interview:", doc);
            // console.log("create Success Student", req.body);
            return res.redirect('back'); 
        }
        else{
            return res.redirect('back')
        }
    }catch(err){
        console.log("Error in Student Create", err);
    }
}


// for Student list page.
module.exports.stdlist = async function(req, res){
    try{
        let std = await Student.find({}).limit(10).sort({ _id: -1 });  // sort for latest entry first with 10 entries
        // console.log(std);
        if(std){
            // console.log("Find Student", std);
            return res.render('stdlist', {
                title: "App | Students List",
                stdlist: std
            }) 
        }
        else{
            return res.redirect('back')
        }
    }catch(err){
        console.log("Error in Student Find", err);
    }
}


