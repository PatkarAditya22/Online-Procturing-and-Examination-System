const User =  require('../../models/User');
const Test =  require('../../models/Test');
const Org =  require('../../models/Org');
const uuidv4 = require("uuid/v4");
const fs = require("fs");
const neatCsv = require('neat-csv');
const nodemailer = require('nodemailer');

const jwt = require('jsonwebtoken');
const helpers=require('../../helpers');

const createTest = async (req, res, next) => {
	try {
        
        const orgId =await helpers.getIdFromHeader(req);
        // console.log("============="+orgId);
        
        // console.log(req.file);
        const reqBody = JSON.parse(req.body['test']);
        // console.log(reqBody);
        // console.log(req.file['path']);
        fs.rename(req.file['path'],`./${orgId}.csv`, function(err) {
            console.log(err);
        });
        const test = await Test.create({...reqBody,orgId: orgId})
        const org = await Org.findById(orgId);
        console.log(org)
        org.test.push(test._id)
        org.save().catch(err => console.log('Error saving org ',err));
        fs.readFile(`./${orgId}.csv`, async (err, data) => {
            if (err) {
              console.error(err)
              return
            }
            const excelData = await neatCsv(data);
            for (var i = 0; i < excelData.length; ++i) {
        
          
                console.log(excelData[i].email);
                    var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'dscvjti@gmail.com',
                        pass: 'palakdsc@P'
                    }
                    });
                    var variable1="hack";
                    var variable2=test.testName;
                    
                    var mailOptions = {
                    from: 'dscvjtigmail.com',
                    to: excelData[i].email,
                    subject: 'Organization Test Link Invitation',
                    html: "Dear Student<br> Thank you for applying to the"+variable2+"Test. The test would be of duration"+test.settings.testDuration+"with a total score of"+test.settings.testScore+"<a href='http://152.67.10.242/org/login'>Click here to be redirected to the Test</a>"
                };
                    
                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                    });
            }
            
                });
        
;
        return res.status(200).json(test);
    }catch (e) {
		return res.status(400).json({message: e.message });
	}
};
const getAllTests = async (req, res, next) => {
	try{
        const orgId = await helpers.getIdFromHeader(req);
        const org = await Org.findById(orgId).populate("test");
        const tests = org.test;
        return res.status(200).json({
            tests,
            orgName:org.orgName
        });
    }catch (e) {
		return res.status(400).json({message: e.message });
	}
};

module.exports ={
    createTest, 
    getAllTests
}
