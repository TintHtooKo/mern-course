const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
});

UserSchema.statics.register = async function(name,email,password) {
    let userExists = await this.findOne({email});
    if(userExists) {
        throw new Error('user already exists');
    }
    
    let salt = await bcrypt.genSalt();
    let hashValue = await bcrypt.hash(password,salt);

    let user = await this.create({
        name,
        email,
        password : hashValue
    });
    return user;
}

UserSchema.statics.login = async function(email,password) {
    let user = await this.findOne({email});
    if(!user) {
        throw new Error('user does not exists');
    }
    let isCorrect = await bcrypt.compare(password,user.password)
    if(isCorrect) {
        return user;
    }else {
        throw new Error('Password incorrect');
    }
}

module.exports = mongoose.model('User',UserSchema);