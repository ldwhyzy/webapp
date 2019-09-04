const db = require('../db');

var Blog = db.defineModel('blogs', {
    user_id: db.STRING(50),
    title: db.STRING(50),
    summary: db.STRING(200),
    content: db.TEXT('medium'),
    add_Class: db.STRING(50),
    first_class: db.INTEGER,
    second_class: db.INTEGER,
    publish: db.INTEGER,
});

Blog.createBlog = async function(blog){
    let blogData = {};
    blogData.user_id = blog.userid;
    blogData.title = blog.title;
    blogData.summary = blog.content&&blog.content.slice(0, 200);
    blogData.content = blog.content;
    blogData.add_Class = blog.addClass;
    blogData.first_class = blog.firstClass;
    blogData.second_class = blog.secondClass;
    blogData.publish = blog.publish;

    return await this.create(blogData);//将findOrCreate功能拆开 await才能使用                                  
};

Blog.updateBlog = async function(id, values){
    let blog = await this.findByPk(id);
    let result = await blog.update(values);
    return result;
};

Blog.deleteBlog = async function(id){
    let blog = await this.findByPk(id);
    if(blog)return blog.destroy({force:true});
};
Blog.findBlogById = function(id){
    return this.findByPk(id);
};
Blog.countAllBlog = function(){
    return this.count({col:"id"});
};
Blog.offsetFindBlog = function(rowCount, currentPage){
    return this.findAll({offset: rowCount*(currentPage-1), limit: rowCount});
};
module.exports = Blog;