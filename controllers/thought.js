const jwt = require('jsonwebtoken');
const secret = require('../config').TOKEN_SECRET;
const Comment = require('../model').Comment;
const ctxurlparse = require('../utils/tools').ctxurlparse;

function sqlDataToCommentData(sqlData){
    //comment like: 
    /*
    {
        id: integer,
        content: string, 
        reply_to: integer,
        floor_no: integer,
        self:{
            user_id: integer,
            user_name: string,
        }
    }*/
    var commentData = new Array();
    //var floorComment = {};
    for(var i=0;i<sqlData.length;i++){
        commentData[i]={mainComment:{}, subComment:new Array()};
        commentData[i].mainComment = {
                id: sqlData[i].mainComment.id,
                content: sqlData[i].mainComment.content, 
                self: {id:sqlData[i].mainComment['self.id'], name:sqlData[i].mainComment['self.name']}, 
                floor_no: sqlData[i].mainComment.floor_no, 
                created_at: new Date(sqlData[i].mainComment.createdAt).toLocaleString('chinese',{hour12:false}),
        };
        for(var j=0;j<sqlData[i].subComment.length;j++){
            commentData[i].subComment[j] = {
                id: sqlData[i].subComment[j].id,
                content: sqlData[i].subComment[j].content, 
                self: {id:sqlData[i].subComment[j]['self.id'], name:sqlData[i].subComment[j]['self.name']}, 
                reply: sqlData[i].subComment[j]['reply.id']===sqlData[i].mainComment['self.id']?null:{id:sqlData[i].subComment[j]['reply.id'], name:sqlData[i].subComment[j]['reply.name']}, 
                //floor_no: sqlData[i].subComment[j].floor_no, 
                created_at: new Date(sqlData[i].subComment[j].createdAt).toLocaleString('chinese',{hour12:false}),
            };
        }
    }
    return commentData;
}

function transformCommentOptions(optionsData){
    if(typeof optionsData!=='object')return null;
    var options = {
        blog_id: parseInt(optionsData.blogId),
        floor_no: parseInt(optionsData.floor),
        content: optionsData.content,
        user_id: parseInt(optionsData.userId),
        reply_to: optionsData.replyTo?parseInt(optionsData.replyTo):null,
    };
    return options;
}

module.exports = {
    'GET /thoughts': async (ctx, next) => {
        var user = ctx.state.user;
        ctx.render('thought_page.html', {
            title: '思想碰撞',
            //studies: blog_items
            thoughts: true,
            __user__:user
        });
    },
    'GET /api/thought/wsauthenticate': async (ctx, next) => {
        var user = ctx.state.user;
        var token = null; 
        if(user){
            token = jwt.sign({id: user.id, name: user.name}, secret,{expiresIn: '12h'});
            console.log('ws token:'+token);
            token = encodeURIComponent(token);
        }
        ctx.rest({token:token});
    },
    'GET /thoughts/history': async (ctx, next) => {
        var title = '讨论集';
        var keywords = ctxurlparse(ctx.querystring);
        var page = keywords.page||1;
        ctx.response.redirect('/404');
        // var blogs = await Blog.offsetFindBlog(BLOG_ROW, parseInt(page), {first_class:0});
        // var secondClasses = await Blogtheme.offsetFindBlogtheme(20, 1, {theme_class: 1});
        // ctx.render('blogs_page.html', {
        //     study: true,
        //     title: title+' | 个人博客',
        //     blogs: [],
        //     blogthemes: []
        // });
    },
};