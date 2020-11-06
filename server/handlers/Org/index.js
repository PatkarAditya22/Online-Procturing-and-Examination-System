const User =  require('../../models/User');
const Test = require('../../models/Test');
const Org = require('../../models/Org');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const neatCsv = require('neat-csv');
const fs = require('fs')

const sendmail = async (req, res, next) => {

fs.readFile('users.csv', async (err, data) => {
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
                pass: ''
            }
            });
            
            var mailOptions = {
            from: 'dscvjtigmail.com',
            to: excelData[i].email,
            subject: 'Sending Email for hack Test',
            text: 'Email Sent!'
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
}
  
const signin = async (req, res, next) => {
	try{
        const org = await Org.findOne({email:req.body.email});
            const { id, name } = org;
            const isMatch = await org.comparePassword(req.body.password, next);
            if (isMatch) {

                const token = jwt.sign(
                    {
                        id,
                        name,
                    },
                    process.env.SECRET_KEY,
                    { expiresIn: '365d' }
                );
            
                return res.status(200).json({
                    token: "Bearer " + token,
                    ...org.toObject(),
                    password: ""
                });
            }
      else {
                return res.status(400).json({
                    message: "Invalid Credentials"
                });
            }

    }catch (e) {
		return res.status(400).json({message: e.message });
	}
};

const resetPassword = async (req, res, next) => {
	try{
        const User = await User.findOne({$or: [{email:req.body.user_id},{contactNum:req.body.user_id}]});
        
            const isMatch = await User.comparePassword(req.body.newPassword, next);
            if(!isMatch){
                User.password = req.body.newPassword;
                User.save().catch(err => console.log('Error saving new password ',err));
                return res.status(200).json({
                    ...User.toObject(),
                    password: ""
                });
            }
            return res.status(400).json({message:"New password cannot be the same as old password"});
        
    }catch (e) {
            return res.status(400).json({message: "Invalid Credentials" });
        }
      
      

	
    }
const getProfile = async (req,res,next)=>{
    try{
       
            const User = await User.findById(req.params.id);
            return res.status(200).json({
                ...User.toObject(),
                password:""
            });
        

    } catch(err) {
        return res.status(400).json({
            message: err.message
        });
    }
}

const editProfile = async (req,res,next) => {
    try{
      
            const User = await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
            return res.status(200).json({
                message:"Successfully updated profile",
                ...User.toObject(),
                password:""
            });
      
    }catch(e){
        return res.status(400).json({message: "Something went wrong " + e.message });
    }
}

module.exports ={
    sendmail,
    signin,
    resetPassword,
    getProfile,
    editProfile
}
