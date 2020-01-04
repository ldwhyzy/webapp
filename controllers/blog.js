const Blog = require('../models/Blog');
const Blogtheme = require('../models/Blogtheme');

// var blogs = [{id:1, title:'第一篇技术博客', created_at:200001,status:'发布'},
//                      {id:3, title:'第二篇技术博客', created_at:200002,status:'草稿'},
//                      {id:4, title:'二次元研究', created_at:200003,status:'隐藏'},
//                      {id:5, title:'第四篇技术博客', created_at:200009,status:'发布'},];
function sqlDataToblogData(sqlData, simple=true){
    var blogData = new Array();
    for(var i=0;i<sqlData.length;i++){
        blogData[i] = {
            id: sqlData[i].id,
            title: sqlData[i].title, 
            created_at: new Date(sqlData[i].updatedAt).toLocaleString('chinese',{hour12:false}),
            status: sqlData[i].publish,
        }
        if(simple){
            if(blogData[i].status==0)blogData[i].status = '发布';
            else if(blogData[i].status==1)blogData[i].status = '隐藏';
            else if(blogData[i].status==2)blogData[i].status = '草稿';
            else if(blogData[i].status==3)blogData[i].status = '不存在';
        }else{
            blogData[i].summary = sqlData[i].summary;
        }
    }
    return blogData;
}

function onesqlDataToblogData(sqlData, simple=true){
    var blogData = {};
   
    blogData = {
        id: sqlData.id,
        title: sqlData.title, 
        content: sqlData.content, 
        created_at: new Date(sqlData.updatedAt).toLocaleString('chinese',{hour12:false}),
        // status: sqlData.publish,
    }
    // if(simple){
    //     if(blogData.status==0)blogData.status = '发布';
    //     else if(blogData.status==1)blogData.status = '隐藏';
    //     else if(blogData.status==2)blogData.status = '草稿';
    //     else if(blogData.status==3)blogData.status = '不存在';
    // }else{
    //     blogData.summary = sqlData.summary;
    // }
    
    return blogData;
}

function ctxurlparse(urlstr){
    //sample /blog/blogs/theme/4?keyword=人工智能
    var keywordstr = urlstr.split('?')[1];
    var keywordarr = keywordstr.split('&');
    var keyword = {};
    for(var i=0;i<keywordarr.length;i++){
        var str = keywordarr[i].split('=');
        keyword[str[0]] = decodeURIComponent(str[1]);
    }
    return keyword;
}

module.exports = {
    'GET /blog/blogs/theme/:id': async (ctx, next) => {
            var userid = ctx.state.user&&ctx.state.user.id;
            var themeid = parseInt(ctx.params.id);
            console.log('[GET /blog/blogs/theme/:id] '+themeid);
            var keywords = ctxurlparse(ctx.url);
            console.log('[GET /blog/blogs/theme/:id] '+JSON.stringify(keywords));
            ctx.render('blogs_theme.html', {
                title: keywords.keyword+' | 个人博客',
            });
    },
    'GET /blog/fun': async (ctx, next) => {
            var title = '杂趣';    
            ctx.render('footles.html', {
                title: title+' | 个人博客',
            });
    },
    'GET /blog/:id': async (ctx, next) => {
        var blogid = parseInt(ctx.params.id);
        var blog = blogid && await Blog.findBlogById(blogid);
        blog = blog && onesqlDataToblogData(blog);        
        ctx.render('blog.html', {
            title: blog.title+' | 个人博客',
            blog: blog,
        });
    },
    'GET /api/blog/themes': async (ctx, next) => {
        var secondClass = [{id:1, str:'Javascript'}, {id:2,str:'Python'}, {id:3, str:'Vue'}, {id:4, str:'人工智能'}, 
                {id:5, str:'人生感悟'}, {id:6, str:'思辨'}, {id:7, str:'其他'}];

        ctx.rest({themes: secondClass});
    },
    'GET /blog/blog_edit/:id': async (ctx, next) => {
        if(ctx.state.user&&ctx.state.user.admin){
            var blogData = {title:null, content:null, addClass:null,firstClass:null,secondClass:null,publish:null};
            var blogid = parseInt(ctx.params.id);
            var secondClass = [{id:1, str:'Javascript'}, {id:2,str:'Python'}, {id:3, str:'Vue'}, {id:4, str:'人工智能'}, 
                {id:5, str:'人生感悟'}, {id:6, str:'思辨'}, {id:7, str:'其他'}];
            if(blogid!=0){
                var blog = await Blog.findBlogById(blogid);
                if(blog && blog.user_id==ctx.state.user.id){
                    blogData = {
                        title: blog.title,
                        content: blog.content,
                        addClass: blog.add_class,
                        firstClass: blog.first_class,
                        secondClass: blog.second_class,
                        publish: blog.publish,
                    };
                }
            }

            ctx.render('blog_edit.html', {
                title: '个人博客|技术|杂感',
                __admin__: true,
                __blogData__: blogData,
                __secondClass__: secondClass,
            });
        }
    },
    'GET /api/blog/blogs_count': async (ctx, next) => {
        var blogsCount = await Blog.countAllBlog();
        ctx.rest({blogsCount: blogsCount});
    },
    'POST /api/blog/blogs_count': async (ctx, next) => {
        var first_class = parseInt(ctx.request.body.firstClass);
        var blogsCount = await Blog.countAllBlog({first_class:first_class});
        ctx.rest({blogsCount: blogsCount});
    },
    'POST /api/blog/page/:currentPage': async (ctx, next) => {
            //var currentPage = parseInt(ctx.params.currentPage);
            var offset = ctx.request.body.offsetData;
            offset = {blogRow:parseInt(offset.blogRow), currentPage:parseInt(offset.currentPage)};
            var firstClass = parseInt(ctx.request.body.firstClass);
            var options = firstClass&&{first_class:firstClass}||null;
            var blogs = null;
            var sqlData = await Blog.offsetFindBlog(offset.blogRow, offset.currentPage, options);
            if(sqlData)blogs = sqlDataToblogData(sqlData, false);
            ctx.rest({blogs: blogs});
    },
    'POST /api/blog/blogs-page-get': async (ctx, next) => {
        //if(ctx.state.user&&ctx.state.user.admin){
            var options = ctx.request.body;
            var blogs = null;
            var sqlData = await Blog.offsetFindBlog(parseInt(options.blogRow), parseInt(options.currentPage));
            if(sqlData)blogs = sqlDataToblogData(sqlData);
            // blogs = [{id:1, title:'第一篇技术博客', created_at:200001,status:'发布'},
            //          {id:3, title:'第二篇技术博客', created_at:200002,status:'草稿'},
            //          {id:4, title:'二次元研究', created_at:200003,status:'隐藏'},
            //          {id:5, title:'第四篇技术博客', created_at:200009,status:'发布'},];
            
            ctx.rest({blogs: blogs});
        //}
    },
    'POST /api/blog/manage': async (ctx, next) => {
        var result = null;
        if(ctx.state.user&&ctx.state.user.admin){
            console.log('[POST /blog/api/manage/]: '+JSON.stringify(ctx.request.body));
            var blogData = ctx.request.body.blogData;
            blogData.userid = parseInt(ctx.state.user.id);//前端传后端会数字会变成字符串
            blogData.blogid = parseInt(blogData.blogid);
            var manage = parseInt(ctx.request.body.manage);
            if(blogData.blogid!=0){
                var checked = await Blog.findBlogById(blogData.blogid);//操作权限确认
                if(checked&&(checked.user_id==blogData.userid)){
                    //manage 3 publish, 2 hide, 1 tempsave, 0 delete, 9 edit.
                    console.log('[POST /blog/api/manage/]: '+JSON.stringify(checked));
                    if(manage>0){
                        let rowsAffected = await Blog.updateBlog(blogData.id, blogData);
                        if(rowsAffected==1)result='success';
                    }else if(manage==0){
                        let rowsAffected = await Blog.deleteBlog(blogData.blogid);
                        if(rowsAffected==1)result='success';
                    }

                    // if(manage=='publish'){
                    //     blogData.publish = 0;
                    //     let rowsAffected = await Blog.updateBlog(blogData.id, blogData);
                    //     if(rowsAffected==1)result='success';
                    // }else if(manage=='tempsave'){
                    //     blogData.publish = 2;
                    //     let rowsAffected = await Blog.updateBlog(blogData.id, blogData);
                    //     if(rowsAffected==1)result='success';
                    // }else if(manage=='hide'){
                    //     blogData.publish = 1;
                    //     let rowsAffected = await Blog.updateBlog(blogData.id, blogData);
                    //     if(rowsAffected==1)result='success';
                    // }else if(manage=='cancel'){
                    //     if(checked.publish==3){
                    //         let rowsAffected = await Blog.deleteBlog(blogData.blogid);
                    //         if(rowsAffected==1)result='success';
                    //     }
                    //     else result='success';
                    // }else if(manage=='delete'){
                    //     let rowsAffected = await Blog.deleteBlog(blogData.blogid);
                    //     if(rowsAffected==1)result='success';
                    // }     
                }
            }
            else if(blogData.blogid==0){
                var blog = await Blog.createBlog(blogData);
                if(blog&&blog.id)result='success';
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
        //if(ctx.state.user&&ctx.state.user.admin){
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
        //}
    },
    'GET /blog/search': async (ctx, next) => {
        console.log('***********************');
        console.log(ctx.querystring);
        console.log('***********************');
        ctx.render('register.html', {
            title: ctx.querystring+' | 个人博客',
        });
    },
};