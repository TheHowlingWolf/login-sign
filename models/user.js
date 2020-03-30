const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type:String,
        maxlength:32,
        trim:true
    },
    email: {
        type: String,
        required:true,
        trim:true,
        unique: true
    },
    userinfo:{
        type:String,
        trim:true
    },
    //Todo Come back here
    encry_password:{
        type: String,
        required: true,
    },
    //Salt for Passwords
    salt: String, //defined in virtuals
    //Defining Roles
    role:{
        type: Number,//Higher the number higher the priviledges
        default: 0
    },
    //purchases history
    HireHistory:{
        type: Array,
        default: []
    }
},
{
    timestamps:true //this timestamp records the time of entry in the db
});

//Virtuals to set password

userSchema.virtual("password")
    .set(function(password){
        //to declare a private variable use _
        this._password = password;
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password;
    })


    userSchema.methods = {
    //Password authentication check 
    authenticate:function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;
    },

    //Password encryption using crypto
    securePassword: function(plainpassword){
        if(!plainpassword) return "";
        try{
            return crypto.createHmac('sha256',this.salt)
            .update(plainpassword)
            .digest('hex');
        }catch (err){
            return "";
        }
    }
}




//throw mongoose model("Name we want to call", Defined schema name)
module.exports = mongoose.model("User",userSchema)