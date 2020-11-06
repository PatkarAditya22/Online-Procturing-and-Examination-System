const User =  require('../../models/User');
const Test = require('../../models/Test');
const jwt = require('jsonwebtoken');
const Org = require('../../models/Org');
const helpers = require('../../helpers');

const testValidation= async (req, res, next) => {
	try{
        const user = await User.findOne({email:req.body.email});
            const { id, name } = user;
            const isMatch = await user.comparePassword(req.body.password, next);
            if (isMatch) {
                const token = jwt.sign(
                    {
                        id,
                        name,
                    },
                    process.env.SECRET_KEY,
                    { expiresIn: '365d' }
                );
                //const userId = await helpers.getIdFromHeader(req);
                console.log("===================="+id);
                return res.status(200).json({
                    token: "Bearer " + token,
                    ...user.toObject(),
                    password: ""
                });
            }
      else {
                return res.status(400).json({
                    message: "Invalid Credentials"
                });
            }

    }catch (e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
};
const signin = async (req, res, next) => {
	try{
        const user = await User.findOne({email:req.body.email});
            const { id, name } = user;
            const isMatch = await user.comparePassword(req.body.password, next);
            if (isMatch) {
                const token = jwt.sign(
                    {
                        id,
                        name,
                    },
                    process.env.SECRET_KEY,
                    { expiresIn: '365d' }
                );
                //const userId = await helpers.getIdFromHeader(req);
                console.log("===================="+id);
                return res.status(200).json({
                    token: "Bearer " + token,
                    ...user.toObject(),
                    password: ""
                });
            }
      else {
                return res.status(400).json({
                    message: "Invalid Credentials"
                });
            }

    }catch (e) {
		return res.status(400).json({ status: 400, message: e.message });
	}
};

const resetPassword = async (req, res, next) => {
	try{
        const User = await User.findOne({$or: [{email:req.body.user_id},{contactNum:req.body.user_id}]});
        
            const isMatch = await User.comparePassword(req.body.newPassword, next);
            if(!isMatch){
                User.password = req.body.newPassword;
                if(req.body.fcmToken){
                    User.fcmToken = req.body.fcmToken
                }
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
        return res.status.json({message: "Something went wrong " + e.message });
    }
}

const submitResponse = async (req,res,next) => {
    try{
        console.log(req.body);
        //await Test.findByIdAndUpdate(req.body.testId,{$push:{responses:req.body}});
        const test = await Test.findById(req.params.testId);
        test.responses.push(req.body);
        test.save();
        console.log(test,req.body);
        return res.status(200).json({message:"response submitted successfully"})
    }catch(e){
        return res.status(400).json({message: "Something went wrong " + e.message });
    }
};

module.exports ={
    signin,
    resetPassword,
    getProfile,
    editProfile,
    submitResponse
}
