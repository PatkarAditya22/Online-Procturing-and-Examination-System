const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({

	contactNum: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true
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
	city: {
		type: String,
		required: true,
	},
	tests: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Test',
	}],
	idProof:{
		type: String,
		default: ""
	},
	picture: {
		type: String,
		default: ""
	},
	results:[{
		test_id: String,
		Score: Number,
	}]
});

userSchema.pre('save', async function(next) {
	const user = this;
	try {
		if (!user.isModified('password')) {
			return next();
		}
		const hashedPassword = await bcrypt.hash(user.password, 10);
		user.password = hashedPassword;
		return next();
	} catch (err) {
		return next(err);
	}
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

userSchema.methods.comparePassword = comparePassword;
const User= mongoose.model('User', userSchema);

module.exports=User;
