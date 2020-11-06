const User =  require('../../models/User');
const Test = require('../../models/Test');
const Org = require('../../models/Org');
const {getIdFromHeader} = require('../../helpers');
const jwt = require('jsonwebtoken');
const uuidv4 = require("uuid/v4")

const signup = async (req, res, next) => {
	try {
		const org = await Org.findOne({email:req.body.email});
		if(org){
			return res.status(400).json({
				message: "Sorry, that email and/or contact number is already"
			});
		}
		//const orgId = uuidv4();
		const orgnew = await Org.create({...req.body});
		const { id, name } = orgnew;
		const token = jwt.sign(
			{
				id,
				name,
			},
			process.env.SECRET_KEY,
			{ expiresIn: '365d' }
		);
		return res.status(200).json({
			token: "Bearer " + token
		});
	} catch (err) {
		if (err.code === 11000) {
			err.message = "Sorry, that email and/or contact number is already registered hereeeee";
		}
		return res.status(400).json({
			message: err.message
		});
	}
};


const signout = async (req, res, next) => {
	try {
		const userId = await getIdFromHeader(req);
		await User.findByIdAndUpdate(userId);
		return res.status(200).json({
			message: "Successfully Signed Out"
		});
	} catch (err) {
		return res.status.json({
			message: err.message
		});
	}
};

module.exports = {
	signup,
	signout
}