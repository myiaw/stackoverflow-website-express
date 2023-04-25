var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var fs = require('fs');
var path = require('path');
var Schema = mongoose.Schema;

// Read default image file into a buffer
var defaultImagePath = path.join(__dirname, 'default.png');
var defaultImageBuffer = fs.readFileSync(defaultImagePath);

var userSchema = new Schema({
    'username': String,
    'password': String,
    'email': String,
    'image': {
        type: Buffer,
        default: defaultImageBuffer
    },
    'questionCount': {
        type: Number,
        default: 0
    },
	'answerCount': {
		type: Number,
		default: 0
	},
    'answeredQuestionCount': {
        type: Number,
        default: 0
    }
});

userSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err){
            return next(err);
        }
        user.password = hash;
        next();
    });
});

userSchema.statics.authenticate = function(username, password, callback){
    User.findOne({username: username})
    .exec(function(err, user){
        if(err){
            return callback(err);
        } else if(!user) {
            var err = new Error("User not found.");
            err.status = 401;
            return callback(err);
        } 
        bcrypt.compare(password, user.password, function(err, result){
            if(result === true){
                return callback(null, user);
            } else{
                return callback();
            }
        });
         
    });
}

var User = mongoose.model('user', userSchema);
module.exports = User;
