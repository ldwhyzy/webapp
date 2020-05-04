const Blog = require('../models/Blog');
const Blogtheme = require('../models/Blogtheme');
const BLOG_ROW = require('../config').BLOG_ROW;

module.exports = {
    'GET /': async (ctx, next) => {
        var title = '学习|杂趣';
        var blogs = await Blog.offsetFindBlog(BLOG_ROW, 1, {first_class:0});
        var blogthemes = await Blogtheme.offsetFindBlogtheme(20, 1, {theme_class: 1});       
        ctx.render('blogs_page.html', {
            title: title+' | 个人博客',
            study: true,
            blogs: blogs,
            blogthemes: blogthemes
        });
    },
    
    'GET /404': async (ctx, next) => {
        ctx.render('404.html', {
            title: '未找到相关页面',
        });
    }
};