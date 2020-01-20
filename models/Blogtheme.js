const db = require('../db');

var Blogtheme = db.defineModel('blogtheme', {
    theme_class: db.INTEGER,
    content: db.STRING(50),
});

Blogtheme.createBlogtheme = async function(theme){
    let blogtheme = {theme_class: themeclass, content:theme.content};
    return await this.create(blogtheme);//将findOrCreate功能拆开 await才能使用                                  
};

Blogtheme.updateBlogtheme = async function(id, values){
    let blogtheme = await this.findByPk(id);
    let result=null;
    if(blog)result = await blogtheme.update(values);
    return result;
};

Blogtheme.deleteBlogtheme = async function(id){
    let blogtheme = await this.findByPk(id);
    if(blogtheme)return blogtheme.destroy({force:true});
};
Blogtheme.findBlogById = function(id){
    return this.findByPk(id);
};
Blogtheme.countAllBlogtheme = function(){
    return this.count({where:{theme_class: 1}, col:"id"});
};
Blogtheme.offsetFindBlogtheme = function(rowCount, currentPage, options){
    return this.findAll({where: options, offset: rowCount*(currentPage-1), limit: rowCount});
};
module.exports = Blogtheme;