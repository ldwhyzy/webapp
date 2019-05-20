module.exports = { 
    'GET /study/:id': async (ctx, next) => {
        var id = ctx.params.id;
        var commits = [];
        var study = {};
        ctx.render('study.html', {
            title: '个人博客|技术|杂感',
            study:{name:"第一篇技术博客", created_at:12304, body:"技术博客正文"},
            commits:commits
        });
    },  
        'GET /tst/:id': async (ctx, next) => {
        var id = ctx.params.id;
        var commits = [];
        var study = {};
        ctx.render('study.html', {
            title: '个人博客|技术|杂感',
            study:{name:"第一篇技术博客", created_at:12304, body:"技术博客正文"},
            commits:commits
        });
    }
};