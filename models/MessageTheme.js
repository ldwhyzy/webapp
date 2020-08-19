const db = require('../db');
const Op = db.Op; 

var Messagetheme = db.defineModel('messagethemes', {
    theme_class: db.INTEGER,   //1 用户空间消息，2 聊天室主题
    content: db.STRING(50),
});

Messagetheme.createMessagetheme = async function(theme){
    let messagetheme = {theme_class: theme.themeclass, content:theme.content};
    return await this.create(messagetheme, {raw: true});//将findOrCreate功能拆开 await才能使用                                  
};

Messagetheme.findMessagethemeContent = async function(content){
    return await this.findOne({where:{content: {[Op.like]: `%${content}%`}}, raw:true});                                 
};

Messagetheme.updateMessagetheme = async function(id, values){
    let messagetheme = await this.findByPk(id);
    let result=null;
    if(message)result = await Messagetheme.update(values);
    return result;
};

Messagetheme.deleteMessagetheme = async function(id){
    let Messagetheme = await this.findByPk(id);
    if(Messagetheme)return Messagetheme.destroy({force:true});
};
Messagetheme.findMessageById = function(id){
    return this.findByPk(id, {raw:true});
};
Messagetheme.countAllMessagetheme = function(options={theme_class:2}){
    return this.count({where:options, col:"id"});
};
Messagetheme.offsetFindMessagetheme = function(rowCount, currentPage, options){
    return this.findAll({where: options, offset: rowCount*(currentPage-1), limit: rowCount, attributes:['id', ['content', 'str']], raw: true});
};
module.exports = Messagetheme;