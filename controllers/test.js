module.exports = {
    'GET /test': async (ctx, next) => {
        ctx.render('blog_edit.html', {
            title: '个人博客|技术|杂感'
        });
    }
};