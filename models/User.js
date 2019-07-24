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
    admin: {
        type: db.BOOLEAN,
        defaultValue: false
    },
});
//*
User.createUser = async function(user){
    // this.findOrCreate({where: {[Op.or]:[{name: user.name},
    //                                     {email: user.email}]}, defaults:user})
    //     .spread((userInstance, created)=>{
    //         console.log(userInstance.get({plain:true}));
    //         console.log(created);
    //         return created;
    //     });
    // let result = await this.findOrCreate({where: {[Op.or]:[{name: user.name},
    //                                      {email: user.email}]}, defaults:user})[1];
    return await this.create(user);//将findOrCreate功能拆开                                  
};

User.userExist = async function(userFind){
    let checkInfo = {nameE:false, emailE:false};
    // User.findOne({where:{name:user.name}}).then(
    //     (user)=>{
    //         if(user)userInfo.nameE = true;
    //         return User.findOne({where:{email:user.email}});
    //     }).then(
    //         (user)=>{
    //             if(user)userInfo.emailE = true;
    //             console.log("in then: "+ JSON.stringify(userInfo));    
    //         });     
    let result1 = await this.findOne({where:{name:userFind.name}});
    let result2 = await this.findOne({where:{email:userFind.email}});
    checkInfo = {nameE:checkInfo.nameE||!!result1, emailE:checkInfo.emailE||!!result2};
    let user = result1||result2;
    //return userInfo;
    return {checkInfo:checkInfo, user:user};
};

User.updateUser = async function(id, values){
    let user = await this.findByPk(id);
    let result = await user.update(values);
    return result;
};
User.deleteUser = async function(id){
    let user = await this.findByPk(id);
    if(user)return user.destroy({force:true});
};
User.findUserById = function(id){
    return this.findByPk(id);
};
User.countUser = function(){
    return this.count({col:"id"});
};
module.exports = User;