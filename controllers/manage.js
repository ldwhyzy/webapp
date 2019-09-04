module.exports = {
    'GET /manage': async (ctx, next) => {
        if(ctx.state.user&&ctx.state.user.admin){
            ctx.render('manage.html', {
                title: '个人博客|技术|杂感',
                __admin__: true,
            });
        }else{
            ctx.response.redirect('/');    
        }
    },
};