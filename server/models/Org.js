var mongoose = require('mongoose');
const Test = require('./Test');
const bcrypt = require("bcrypt");

const orgSchema = new mongoose.Schema({
  
	contactNum: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique:true
	},
	password: {
		type: String,
		required: true,
	},
	users:[],
	orgName: String,
	test:{type: [{
		type:mongoose.Schema.Types.ObjectId,
		ref: 'Test'
	}],
	default: []
	},
});
const comparePassword= async function (candidatePassword, next) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return true;
    } catch (err) {
        next(err);
        return false;
    }
};
orgSchema.methods.comparePassword = comparePassword;

const Org = mongoose.model('Org',orgSchema);
module.exports= Org;
