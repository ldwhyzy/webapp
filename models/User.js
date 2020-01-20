const db = require('../db');

const Op = db.Op; 

var User = db.defineModel('users', {
    email: {
        type: db.STRING(50),
        allowNull: true
    },    
    name: {
        type: db.STRING(50),
        unique: true
    },
    passwd: db.STRING(50),
    admin: {
        type: db.INTEGER,
        defaultValue: 1
    },
});

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
    if(typeof user!=='object'||!user.name||!user.passwd)return {result:false};
    let userData = { email: user.email||'', name: user.name, passwd: user.passwd};
    try{
        let userInstance =  await this.create(userData);//将findOrCreate功能拆开
        if(userInstance)return {userInstance, result:true};   
    }catch(err){
        console.log('[User Model]createUser error.');
        return {result:false};
    }                              
};

//userFind: Object {name:string, email:string}
User.userExist = async function(userFind){
    let checkInfo = {nameE:false, emailE:false};
    let result1=null, result2=null;  
    try{
        if(userFind.name)result1 = await this.findOne({where:{name:userFind.name}});
        if(userFind.email)result2 = await this.findOne({where:{email:userFind.email}});
        let user = result1||result2;
        checkInfo = {nameE:checkInfo.nameE||!!result1, emailE:checkInfo.emailE||!!result2};
        return {checkInfo:checkInfo, user:user, result:true};
    }catch(err){
        console.log('[User Model]userExist error.');
        return {result:false};
    }    
};

User.updateUser = async function(id, options){
    try{
        let t = await db.transaction();
        let user = await this.findByPk(id, {transaction: t});
        if(user)var effect = await user.update(options, {transaction: t});
        await t.commit();
        return {effect: effect, result:true};
    }catch(err){
        await t.rollback();
        console.log('[User Model]updateUser error.');
        return {result: false};
    }
};

User.deleteUser = async function(id){
    try{
        let user = await this.findByPk(id);
        if(user)return user.destroy({force:true});
    }catch(err){
        console.log('[User Model]deleteUser error.');
        return {result: false};
    }

};
User.findUserById = function(id){
    return this.findByPk(id);
};
User.countUser = function(){
    return this.count({col:"id"});
};
module.exports = User;