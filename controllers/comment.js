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

async function getBlogComments(blogid, offset, options){
    var comments =  new Array();
    var floorComment = {};
    var mainComments = await Comment.floorOffsetFindComment(offset.commentRow, offset.currentPage, options);
    if(mainComments){
        for(var i=0;i<mainComments.length;i++){
            floorComment['mainComment'] = mainComments[i];
            floorComment['subComment'] = await Comment.findReplyComment(blogid, mainComments[i].floor_no);
            comments.push(JSON.parse(JSON.stringify(floorComment)));
        }
    }
    comments = sqlDataToCommentData(comments);
    return comments;
}

module.exports = {
    'POST /api/comment/page/:currentPage': async (ctx, next) => {  //f
        //var currentPage = parseInt(ctx.params.currentPage);
        var comments =  new Array();
        var floorComment = {};
        var offset = ctx.request.body.offsetData;
        offset = {commentRow:parseInt(offset.commentRow), currentPage:parseInt(offset.currentPage)};
        var blogid = parseInt(ctx.request.body.blogid);
        var options = {blog_id: blogid};
        // var mainComments = await Comment.floorOffsetFindComment(offset.commentRow, offset.currentPage, options);
        // if(mainComments){
        //     for(var i=0;i<mainComments.length;i++){
        //         floorComment['mainComment'] = mainComments[i];
        //         floorComment['subComment'] = await Comment.findReplyComment(blogid, mainComments[i].floor_no);
        //         comments.push(JSON.parse(JSON.stringify(floorComment)));
        //     }
        // }
        // comments = sqlDataToCommentData(comments);
        comments = await getBlogComments(blogid, offset, options);

        ctx.rest({comments: comments});
    },
    'POST /api/comment/comments_count': async (ctx, next) => {  //f
        var blogid = parseInt(ctx.request.body.blogid);
        var commentsCount = 0;
        commentsCount = await Comment.countAllComment({blog_id: blogid, reply_to:null});
        ctx.rest({commentsCount: commentsCount});
    },
    'GET /comments/:id': async (ctx, next) => {
        // var id = ctx.params.id;
        // if(userid || ctx.cookies.get("userid")){
        //      var userInfo = {}//用户信息汇总，包括USER表，comment表，blog表信息
        //      ctx.render("user.html", {userInfo: userInfo});
        // }else{
        //     ctx.response.redirect('/404');
        // }
        
    },
    "POST /api/comment/manage": async (ctx, next)=>{
        var result = {success:false};
        if(ctx.state.user){
            var options = transformCommentOptions(ctx.request.body);
            var manage = parseInt(ctx.request.body.manage);
            if(options){
                switch(manage){
                    case 0:
                        if(ctx.state.user.admin){
                            let id = parseInt(ctx.request.body.commentId);
                            result = await Comment.deleteComment(id);
                        }    
                        break;
                    case 1:
                        result = await Comment.createComment(options);
                        break;
                    case 2:
                        if(ctx.state.user.admin||ctx.state.user.id==options.user_id){
                            result = await Comment.updateComment(options);
                    }
                        break;        
                }
            }
        }
        ctx.rest(result);
    }    
};