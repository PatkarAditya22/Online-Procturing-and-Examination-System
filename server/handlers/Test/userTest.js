const User =  require('../../models/User');
const Test =  require('../../models/Test');
const Org =  require('../../models/Org');
const uuidv4 = require("uuid/v4")
const jwt = require('jsonwebtoken');
const helpers=require('../../helpers');

const getAllTests = async (req, res, next) => {
	try{
        //const  userId = await helpers.getIdFromHeader(req);
        const tests = await Test.find({})
        //const tests = user.test;
        return res.status(200).json({
            tests
        });
    }catch (e) {
		return res.status(400).json({message: e.message });
	}
};

module.exports ={
    getAllTests
}
