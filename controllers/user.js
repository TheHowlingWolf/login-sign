const User = require('../models/user');

exports.getUserById = (req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{ //always db return 2 things err or user
        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            });
        }

        req.profile = user; //storing the user object in a object name profile
        next();
    });
}

exports.getUser = (req,res)=>{
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
}

/* exports.getAllUsers = (req,res,next)=>{
    User.find().exec((err,users)=>{
        if(err || !users)
        {
            return res.status(400).json({
                error: "No users found."
            })
        }

        res.json(users);
    })
} */

exports.updateUser = (req,res)=>{
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body}, //updates everything in the body
        {new: true, useFindandModify: false},
        (err,user)=>{
            if(err || !user)
            {
                return res.status(400).json({
                    error:"User Not authorised to update this user"
                })
            }
            //since we are getting an user here we will update the user not req.profile
            user.salt = undefined;
            user.encry_password = undefined;
            res.json(user);
        }
    )
}