const Comment = require('../model').Comment;

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
    'GET /thought': async (ctx, next) => {
        var user = ctx.state.user;
        ctx.render('thought_page.html', {
            title: '思想碰撞',
            //studies: blog_items
            __user__:user
        });
    },
    'GET /api/thought/wsauthenticate': async (ctx, next) => {
        var user = ctx.state.user;
        var token = null; 
        if(user){
            let aid = 'test33';
            token = `id=${user.id};name=${user.name};aid=${aid};expire=1`;
            console.log('ws token:'+token);
            token = encodeURIComponent(token);
        }
        ctx.rest({token:token});
    },
};