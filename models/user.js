var mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var AdminSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        minlength: 2,
        trim : true, 
    },
    lastName : {
        type: String,
        required: true,
        minlength: 2,
        trim : true, 
    },
    age : {
        type: Number,
        required: true 
    },
    sex : {
        type: String,
        required: true,
        minlength: 4,
        maxlength : 6,
        trim : true, 
    },
    phoneNo : {
        type: String,
        required: true,
        minlength: 10,
        maxlength : 10,
        trim : true, 
    },
    address : {
        type: String,
        required: true,
        minlength: 5,
        trim : true, 
    },
    email : {
        type: String,
        required: true,
        minlength: 1,
        trim : true, 
        unique : true,
        validate: {
            validator : validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password : {
        type: String,
        required: true,
        minlength:6
    },
    role:{
        type:String,
        required:true
    },
    tokens:[{
        access: {
            type:String,
            required: true
        },
        token: {
            type:String,
            required: true

        }
    }]
}, {usePushEach : true});

AdminSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject(); 

    return _.pick(userObject, ['_id', 'email', 'firstName', 'lastName', 'phoneNo', 'age', 'sex','address', 'role']);
}
AdminSchema.methods.generateAuthToken = function(){
    var user = this; 
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    
    user.tokens.push({access, token});

    return user.save().then(() =>{
        return token;
    });
   
}
AdminSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
        $pull : {
            tokens : {token}
        }
    })
}
AdminSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded, id;

    try{
        decoded = jwt.verify(token, 'abc123');
        id = decoded._id;
        
    }catch(e) {
        // return new Promise.reject();
     
    }
 
        return User.findOne({
        '_id': id,
        'tokens.token' : token,
        'tokens.access' : 'auth'
    })
}

AdminSchema.statics.findByCredentials = function(email, password){
    var user = this;

    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }
        return  new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user);
                }else{
                    reject()
                }
            })
        })
    })
}

AdminSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
        
    }else {
        next()
    }
})

var User = mongoose.model('User', AdminSchema);
module.exports = {User}

