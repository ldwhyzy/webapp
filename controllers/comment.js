module.exports = {
    'GET /comments/:id': async (ctx, next) => {
        // var id = ctx.params.id;
        // if(userid || ctx.cookies.get("userid")){
        //      var userInfo = {}//用户信息汇总，包括USER表，comment表，blog表信息
        //      ctx.render("user.html", {userInfo: userInfo});
        // }else{
        //     ctx.response.redirect('/404');
        // }
        
    },
    "POST /comment/add": async (ctx, next)=>{
        var rtstr = ctx.request.body;

        ctx.rest(rtstr);
    }
};