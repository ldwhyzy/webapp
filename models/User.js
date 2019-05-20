const db = require('../db');

const Op = db.Op; 

var User = db.defineModel('users', {
    email: {
        type: db.STRING(50),
        unique: true
    },    
    name: {
        type: db.STRING(50),
        unique: true
    },
    passwd: db.STRING(50),
    admin: db.BOOLEAN
});
//*
User.createUser = function(user){
    console.log('User create function.');
    this.findOrCreate({where: {[Op.or]:[{name: user.name},
                                        {email: user.email}]}, defaults:user})
        .spread((userInstance, created)=>{
            console.log(userInstance.get({plain:true}));
            console.log(created);
        });
};

User.updateUser = function(user){
    
};
User.deleteUser = function(){};
User.findUser = function(){};
//*/
module.exports = User;