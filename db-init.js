// require('babel-core/register')({
//     presets: ['stage-3']
// });

//有效的三个语句，等到init db ok.打印则表初始化完成
const model = require('./model.js');

// const Comment = require('./models/Comment.js');
// const User = require('./models/User.js');
// Comment.blongsTo(User, {foreignKey:'user_id'});
//model.Comment.belongsTo(model.User, {foreignKey:'user_id'});
//model.Blog.belongsTo(model.User, {foreignKey:'user_id'});

(async ()=>{
    try{
        //await Promise.all([model.sync(),]);
        model.sync();
        console.log('init db ok.');
        //process.exit();
    }catch(err){
        console.log(err);
    }
})();
//process.exit(0); 程序会直接终止，model.sync();无法执行。
// const model = require('./model.js');
// model.sequelize.sync().then(()=>{
//     console.log('init db ok.');
// }).catch((e)=>{
//     console.log(`failed: ${e}`);
// });

// process.exit(0);