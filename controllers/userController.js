var UserModel = require('../models/userModel.js');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {
    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    /**
     * userController.create()
     */
    create: function (req, res) {
        var user = new UserModel({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            image: req.body.image,
            questionCount: 0,
            answeredQuestionCount: 0,
            answerCount: 0
        });
    
        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }
    
            //return res.status(201).json(user);
            return res.redirect('/users/login');
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
    
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }
    
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
    
            user.username = req.body.username ? req.body.username : user.username;
            user.password = req.body.password ? req.body.password : user.password;
            user.email = req.body.email ? req.body.email : user.email;
            user.image = req.body.image ? req.body.image : user.image;
            user.questionCount = req.body.questionCount ? req.body.questionCount : user.questionCount;
            user.answeredQuestionCount = req.body.answeredQuestionCount ? req.body.answeredQuestionCount : user.answeredQuestionCount;
            user.answerCount = req.body.answerCount ? req.body.answerCount : user.answerCount;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }
    
                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    showRegister: function(req, res){
        res.render('user/register');
    },

    showLogin: function(req, res){
        res.render('user/login');
    },

    login: function(req, res, next){
        UserModel.authenticate(req.body.username, req.body.password, function(err, user){
            if(err || !user){
                var err = new Error('Wrong username or paassword');
                err.status = 401;
                return next(err);
            }
            req.session.userId = user._id;
            console.log("User ID: ", req.session.userId);
            res.redirect('/users/profile');
        });
    },

    profile: function(req, res,next){
        UserModel.findById(req.session.userId)
        .exec(function(error, user){
            if(error){
                return next(error);
            } else{
                if(user===null){
                    var err = new Error('Not authorized, go back!');
                    err.status = 400;
                    return next(err);
                } else{
                    console.log("img: "+user.image);
                    console.log("imgsize:" + user.image.length);
                    return res.render('user/profile', user);
                }
            }
        });  
    },

    logout: function(req, res, next){
        if(req.session){
            req.session.destroy(function(err){
                if(err){
                    return next(err);
                } else{
                    return res.redirect('/');
                }
            });
        }
    },
    uploadImage: [
        upload.single('image'), 
        function(req, res, next) {
            const userId = req.params.id;
            const imageFile = req.file;
    
            UserModel.findByIdAndUpdate(userId, { $set: { image: imageFile.buffer } }, function(err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user image.',
                        error: err
                    });
                }
    
                return res.redirect(`/users/profile`);
            });
        }
    ]
};
