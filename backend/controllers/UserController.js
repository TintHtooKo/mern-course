const User = require('../models/User');
const createToken = require('../helpers/createToken');

const UserController = {
    me : async(req,res) => {
        return res.json(req.user)
    },
    login : async (req,res) => {
        try {
            let {email,password} = req.body;
            let user = await User.login(email,password);
            let token = createToken(user._id)
            res.cookie('jwt',token, { httpOnly : true, maxAge : 3 * 24 * 60 * 60 * 1000 });
            return res.json({user,token});
        }catch(e) {
            return res.status(400).json({error : e.message});    
        }
    },
    register : async (req,res) => {
        try {
            let {name,email,password} = req.body;
            let user = await User.register(name,email,password);
            let token = createToken(user._id)
            res.cookie('jwt',token, { httpOnly : true, maxAge : 3 * 24 * 60 * 60 * 1000 });
            return res.json({user,token});
        }catch(e) {
            return res.status(400).json({error : e.message});
        }
    },
    logout : (req,res) => {
        res.cookie('jwt','', {  maxAge : 1 });
        return res.json({message : "user logged out"});
    }
}

module.exports = UserController;