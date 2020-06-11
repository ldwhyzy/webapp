const db = require('../db');
//const User = require('./User.js');
const Op = db.Op; 

var Blog = db.defineModel('blogs', {
    user_id: db.STRING(50),
    title: db.STRING(50),
    content: db.TEXT('medium'),
    add_Class: {
        type: db.STRING(50),
        allowNull: true
    },
    first_class: db.INTEGER,
    second_class: db.INTEGER,
    publish: db.INTEGER,
});

Blog.createBlog = async function(blog){
    let blogData = {};
    blogData.user_id = blog.userid;
    blogData.title = blog.title;
    blogData.content = blog.content;
    blogData.add_Class = blog.addClass;
    blogData.first_class = blog.firstClass;
    blogData.second_class = blog.secondClass;
    blogData.publish = blog.publish;
    try{
        var blog = await this.create(blogData);
        return blog; 
    }catch(err){
        console.log(err);
        return false;
    }
                                  
};

Blog.updateBlog = async function(id, values){
    let blog = await this.findByPk(id);
    let result=null;
    if(blog)result = await blog.update(values);
    return result;
};

Blog.deleteBlog = async function(id){
    let blog = await this.findByPk(id);
    if(blog)return blog.destroy({force:true});
};

Blog.findBlogById = function(id){
    return this.findByPk(id, {'raw':true});
};

Blog.countAllBlog = function(options={}){
    return this.count({col:"id", where:options});
};

Blog.countSearchBlog = function(blogtheme){
    return this.count({col:"id", where:{[Op.or]:[{'content':{[Op.regexp]:blogtheme}}, {'title':{[Op.regexp]:blogtheme}}]
                                       }});
};

Blog.offsetFindBlog = function(rowCount, currentPage, options={}){
    return this.findAll({where: options, offset: rowCount*(currentPage-1), limit: rowCount, raw: true});
};

Blog.offsetSearchBlog = function(rowCount, currentPage, blogtheme){
    return this.findAll({where:{[Op.or]:[{'content':{[Op.regexp]:blogtheme}}, {'title':{[Op.regexp]:blogtheme}}]
    }, offset: rowCount*(currentPage-1), limit: rowCount, raw: true});
};
module.exports = Blog;