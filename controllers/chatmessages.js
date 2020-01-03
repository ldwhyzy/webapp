const Blog = require('../models/Blog');
const Blogtheme = require('../models/Blogtheme');

module.exports = {
    'GET /chat/history': async (ctx, next) => {
            
        ctx.render('404.html', {
            title: '聊天信息 | 个人博客',
        });
    },
    'GET /chat/:id': async (ctx, next) => {
        var chatthemeid = parseInt(ctx.params.id); 
        ctx.render('404.html', {
            title: '聊天信息 | 个人博客',
        });
    },
    
};