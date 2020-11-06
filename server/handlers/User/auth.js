const User =  require('../../models/User');
const Test = require('../../models/Test');
const {getIdFromHeader} = require('../../helpers');
const jwt = require('jsonwebtoken');
const uploadToBucket = require('../../helpers/bucket');

const signup = async (req, res, next) => {
	try {
		
		const user = await User.findOne({email:req.body.email});
		if(user){
			return res.status(400).json({
				message: "Sorry, that email and/or contact number is already registered"
			});
		}
	//	const uniqueId = uuidv4();
		const usernew = await User.create({...req.body});
		const { id, name } = usernew;
		const fileName = `${name}-${id}`;
		uploadToBucket(req.file['path'],fileName);
		usernew.idProof=`https://objectstorage.ap-mumbai-1.oraclecloud.com/n/bmuguxlyea8m/b/proctor-bucket/o/${fileName}`
		usernew.save()
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
			err.message = "Sorry, that email and/or contact number is already registered";
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
		return res.status(200).json({
			message: err.message
		});
	}
};

module.exports = {
	signup,
	signout
}