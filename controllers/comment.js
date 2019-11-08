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
                reply: {id:sqlData[i].subComment[j]['reply.id'], name:sqlData[i].subComment[j]['reply.name']}, 
                //floor_no: sqlData[i].subComment[j].floor_no, 
                created_at: new Date(sqlData[i].subComment[j].createdAt).toLocaleString('chinese',{hour12:false}),
            };
        }
    }
    return commentData;
}

module.exports = {
    'POST /api/comment/page/:currentPage': async (ctx, next) => {
        //var currentPage = parseInt(ctx.params.currentPage);
        var comments =  new Array();
        var floorComment = {};
        var offset = ctx.request.body.offsetData;
        offset = {blogRow:parseInt(offset.blogRow), currentPage:parseInt(offset.currentPage)};
        var blogid = parseInt(ctx.request.body.blogid);
        var options = {blog_id: blogid};
        var mainComments = await Comment.floorOffsetFindComment(offset.blogRow, offset.currentPage, options);
        if(mainComments){
            for(var i=0;i<mainComments.length;i++){
                floorComment['mainComment'] = mainComments[i];
                floorComment['subComment'] = await Comment.findReplyComment(blogid, mainComments[i].floor_no);
                comments.push(JSON.parse(JSON.stringify(floorComment)));
            }
        }
        console.log(JSON.stringify(comments));
        comments = sqlDataToCommentData(comments);
        console.log(JSON.stringify(comments));
        ctx.rest({comments: comments});
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

    "POST /comment/add": async (ctx, next)=>{
        var rtstr = ctx.request.body;

        ctx.rest(rtstr);
    }
};