module.exports = {
    'GET /user/manage': async (ctx, next) => {
        var userid = ctx.state.userid;
        if(userid || ctx.cookies.get("userid")){
             var userInfo = {}//用户信息汇总，包括USER表，comment表，blog表信息 
             ctx.render("user.html", {userInfo: userInfo});
        }else{
            ctx.response.redirect('/404');
        }
        /*
            email = ctx.request.body.email || '',
            password = ctx.request.body.password || '';
        if (email === 'admin@example.com' && password === '123456') {
            console.log('signin ok!');
            ctx.render('signin-ok.html', {
                title: 'Sign In OK',
                name: 'Mr Node'
            });
        } else {
            console.log('signin failed!');
            ctx.render('signin-failed.html', {
                title: 'Sign In Failed'
            });
        }*/
    },
    "POST /user/manage/info": async (ctx, next)=>{
        var userid = ctx.state.userid;
        var user = {
            name: "user2",
            email: "user2@example.com",
            portrait: "/static/images/2.jpg",
            selfInfo: "这是个人简介，想做什么就去做吧。"
        }
        ctx.rest(user);
    },
    "POST /user/manage/info_save": async (ctx, next)=>{
        name = ctx.request.body.name+"re";
        email = ctx.request.body.email+"re";
        portrait = ctx.request.body.portrait;
        selfInfo = ctx.request.body.selfInfo+"re";
        ctx.rest({name: name, email: email, portrait: portrait, selfInfo: selfInfo});
    }
};