const Blog = require('../models/Blog');
const Blogtheme = require('../models/Blogtheme');

module.exports = {
    'GET /': async (ctx, next) => {
        // var blog_items = [];
        // var user = null;
        // ctx.render('index.html', {
        //     title: '个人博客|技术|杂感',
        //     //studies: blog_items
        //     //__user__:user
        // });
        var title = '学习';
        var blogs = [
            {
                id: 1, 
                title: '瞬间狙击', 
                summary:'谁能统计下花丸b站收益，今天又是几十个舰长，好恐怖啊，虽然我也很喜欢花丸，感觉花丸是不是放弃ytb，专心冲国dd',
                created_at: 1578304782651,
            }
        ]; 
        var blogthemes = [{id:1, value:'Javascript'}, {id:2,value:'Python'}, {id:3, value:'Vue'}, {id:4, value:'人工智能'}, 
        {id:5, value:'人生感悟'}, {id:6, value:'思辨'}, {id:7, value:'其他'}];          
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