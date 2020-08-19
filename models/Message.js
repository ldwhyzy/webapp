const db = require('../db');
const User = require('./User');
const MessageTheme = require('./MessageTheme');
const Op = db.Op; 

var Message = db.defineModel('messages', {
    // from: db.STRING(50),
    // to: db.STRING(50),
    // message_theme: {              //1 用户空间消息，2 聊天室主题
    //     type: db.INTEGER,
    //     allowNull: false
    // }, 
    content: db.STRING(200),
    message_type: {
        type: db.STRING(50),  //聊天室消息类型
        allowNull: true
    }
});

Message.belongsTo(User, {as:'from_user', foreignKey:'from'});
Message.belongsTo(User, {as:'to_user', foreignKey:'to'});
Message.belongsTo(MessageTheme, {targetKey:'theme_class', foreignKey:'message_theme'});

Message.createMessage = async function(message){
    let messageData = {};
    try{
        messageData.from = parseInt(message.from);
        messageData.to = parseInt(message.to);
        messageData.content = message.content;
        messageData.message_type = message.messageType;
        return await this.create(messageData);//将findOrCreate功能拆开 await才能使用      
    }catch(err){
        console.log('Message create error.');
    }                            
};

// Message.updateMessage = async function(id, values){
//     let message = await this.findByPk(id);
//     let result=null;
//     if(message)result = await message.update(values);
//     return result;
// };
Message.createMessages = async function(messages){
    let messagesData = messages;   //check in reserve
    let result = {success:false, messagesArr:null};
    try{ 
        let  messagesArr = await this.bulkCreate(messagesData);
        result = {success:true, messagesArr: messagesArr};  
    }catch(err){
        console.log('Messages create error.');
    }                            
    return result;
};

Message.deleteMessage = async function(id){
    let message = await this.findByPk(id);
    if(message)return message.destroy({force:true});
};
Message.findMessageById = function(id){
    return this.findByPk(id);
};

Message.countAllMessage = function(options={}){
    return this.count({col:"id", where:options});
};
Message.findMessage = function(options={}){
    return this.findOne({where: options,  include:[{model: User, as:'from_user', attributes: ['id', 'name']},
                                                   {model: User, as:'to_user', attributes: ['id', 'name']}], raw: true});
};
Message.offsetFindMessage = function(rowCount, currentPage, options={}){
    return this.findAll({where: options,  include:[{model: User, as:'from_user', attributes: ['id', 'name']},
                                                   {model: User, as:'to_user', attributes: ['id', 'name']}],
                                                   offset: rowCount*(currentPage-1), limit: rowCount, order:[['createdAt',]], raw: true});
};
module.exports = Message;