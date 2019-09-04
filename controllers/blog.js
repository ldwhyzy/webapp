const Blog = require('../models/Blog');

// var blogs = [{id:1, title:'第一篇技术博客', created_at:200001,status:'发布'},
//                      {id:3, title:'第二篇技术博客', created_at:200002,status:'草稿'},
//                      {id:4, title:'二次元研究', created_at:200003,status:'隐藏'},
//                      {id:5, title:'第四篇技术博客', created_at:200009,status:'发布'},];
function sqlDataToblogData(sqlData){
    var blogData = new Array();
    for(var i=0;i<sqlData.length;i++){
        blogData[i] = {
            id: sqlData[i].id,
            title: sqlData[i].title, 
            created_at: new Date(sqlData[i].updatedAt).toLocaleString('chinese',{hour12:false}),
            status: sqlData[i].publish,
        }
        if(blogData[i].status==0)blogData[i].status = '发布';
        else if(blogData[i].status==1)blogData[i].status = '隐藏';
        else if(blogData[i].status==2)blogData[i].status = '草稿';
        else if(blogData[i].status==3)blogData[i].status = '不存在';
    }
    return blogData;
}

module.exports = {
    'POST /blog/blog_edit': async (ctx, next) => {
        if(ctx.state.user&&ctx.state.user.admin){
            var blogData = {title:null, content:null, addClass:null,firstClass:null,secondClass:null,publish:null};
            if(ctx.request.body.id>0)
            blogData = {
                title: "第一篇博客 我的奋斗",
                content:"主人公はやや内気な普通の男子学生・浩太&lt;br&gt;\
                ある夏休み、両親が旅行へ行ってしまい、生活力のない彼の身の回りの世話をするために、<br>\
                遠縁の女性・結衣がやってくる。<br>\
                彼女は幼い頃、夏休みを共に過ごしていた初恋の人だった。<br>\
                数年前に結婚し、人妻になったためか、以前に増してやさしく甘い結衣に、<br>\
                主人公は惹かれ、抑えきれない欲望をぶつけてしまう。<br>\
                少年とお姉さんだったはずの2人の関係は徐々に深まっていく。<br>",
                addClass:"杂论快点完成吧",
                firstClass:0,
                secondClass:2,
                publish:0,
            };

            ctx.render('blog_edit.html', {
                title: '个人博客|技术|杂感',
                __admin__: true,
                __blogData__: blogData,
            });
        }
    },
    'GET /blog/blog_edit/:id': async (ctx, next) => {
        if(ctx.state.user&&ctx.state.user.admin){
            var blogData = {title:null, content:null, addClass:null,firstClass:null,secondClass:null,publish:null};
            if(parseInt(ctx.params.id)!=920)
            blogData = {
                title: "第一篇博客 我的奋斗",
                content:"主人公はやや内気な普通の男子学生・浩太&lt;br&gt;\
                ある夏休み、両親が旅行へ行ってしまい、生活力のない彼の身の回りの世話をするために、<br>\
                遠縁の女性・結衣がやってくる。<br>\
                彼女は幼い頃、夏休みを共に過ごしていた初恋の人だった。<br>\
                数年前に結婚し、人妻になったためか、以前に増してやさしく甘い結衣に、<br>\
                主人公は惹かれ、抑えきれない欲望をぶつけてしまう。<br>\
                少年とお姉さんだったはずの2人の関係は徐々に深まっていく。<br>",
                addClass:"杂论快点完成吧",
                firstClass:0,
                secondClass:2,
                publish:0,
            };

            ctx.render('blog_edit.html', {
                title: '个人博客|技术|杂感',
                __admin__: true,
                __blogData__: blogData,
            });
        }
    },
    'GET /api/blogs': async (ctx, next) => {
        if(ctx.state.user&&ctx.state.user.admin){
            var blogData = {title:null, content:null, addClass:null,firstClass:null,secondClass:null,publish:null};
            if(ctx.params.id>0)
            blogData = {
                title: "第一篇博客 我的奋斗",
                content:"主人公はやや内気な普通の男子学生・浩太&lt;br&gt;\
                ある夏休み、両親が旅行へ行ってしまい、生活力のない彼の身の回りの世話をするために、<br>\
                遠縁の女性・結衣がやってくる。<br>\
                彼女は幼い頃、夏休みを共に過ごしていた初恋の人だった。<br>\
                数年前に結婚し、人妻になったためか、以前に増してやさしく甘い結衣に、<br>\
                主人公は惹かれ、抑えきれない欲望をぶつけてしまう。<br>\
                少年とお姉さんだったはずの2人の関係は徐々に深まっていく。<br>",
                addClass:"杂论快点完成吧",
                firstClass:0,
                secondClass:2,
                publish:0,
            };
            ctx.rest({blogs:null});
        }
    },
    'POST /blog/api/blog_id_check': async (ctx, next) => {
        if(ctx.state.user&&ctx.state.user.admin){
            var blogid = parseInt(ctx.request.body.id);
            var blogData = {userid: ctx.state.user.id, title:null, content:null, addClass:null,firstClass:0,secondClass:0,publish:3};
            var blog = null;
            if(blogid>0){
                blog = await Blog.findBlogById(blogid).get({plain:true});
            }    
            else{//创建新博客后得到的ID
                blog = await Blog.createBlog(blogData).get({plain:true});
                blogid = blog.id;
            }
            ctx.rest({blog:blog});
        }
    },
    'POST /blog/api/manage': async (ctx, next) => {
        var result = null;
        if(ctx.state.user&&ctx.state.user.admin){
            var blogData = ctx.request.body.blogData;
            blogData.userid = parseInt(ctx.state.user.id);
            console.log('typeof blogData.id'+typeof(blogData.blogid));
            blogData.blogid = parseInt(blogData.blogid);
            var manage = ctx.request.body.manage;
            var checked = await Blob.findBlogById(blogData.blogid);//操作权限确认
            if(checked&&checked.user_id==blogData.userid){
                if(manage=='publish'){
                    blogData.publish = 0;
                    let rowsAffected = await Blog.updateBlog(blogData.id, blogData);
                    if(rowsAffected==1)result='success';
                }else if(manage=='tempsave'){
                    blogData.publish = 2;
                    let rowsAffected = await Blog.updateBlog(blogData.id, blogData);
                    if(rowsAffected==1)result='success';
                }else if(manage=='hide'){
                    blogData.publish = 1;
                    let rowsAffected = await Blog.updateBlog(blogData.id, blogData);
                    if(rowsAffected==1)result='success';
                }else if(manage=='cancel'){
                    if(checked.publish==3){
                        let rowsAffected = await Blog.deleteBlog(blogData.blogid);
                        if(rowsAffected==1)result='success';
                    }
                    else result='success';
                }else if(manage=='delete'){
                    let rowsAffected = await Blog.deleteBlog(blogData.blogid);
                    if(rowsAffected==1)result='success';
                }
            }
        }
        ctx.rest({result:result});
    },
    'GET /blog/api/blogs': async (ctx, next) => {
        if(ctx.state.user&&ctx.state.user.admin){
            var userid = ctx.state.user.id;
            var blogsCount = await Blog.countAllBlog();
            console.log('[/blog/aip/blogs]: '+blogsCount);
            ctx.rest({blogsCount: blogsCount});
        }
    },
    'POST /blog/api/blogs-page-get': async (ctx, next) => {
        if(ctx.state.user&&ctx.state.user.admin){
            var options = ctx.request.body;
            var userid = ctx.state.user.id;
            var blogs = null;
            var sqlData = await Blog.offsetFindBlog(parseInt(options.blogRow), parseInt(options.currentPage));
            if(sqlData)blogs = sqlDataToblogData(sqlData);
            // blogs = [{id:1, title:'第一篇技术博客', created_at:200001,status:'发布'},
            //          {id:3, title:'第二篇技术博客', created_at:200002,status:'草稿'},
            //          {id:4, title:'二次元研究', created_at:200003,status:'隐藏'},
            //          {id:5, title:'第四篇技术博客', created_at:200009,status:'发布'},];
            
            ctx.rest({blogs: blogs});
        }
    },
};