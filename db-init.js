// require('babel-core/register')({
//     presets: ['stage-3']
// });

//有效的三个语句，等到init db ok.打印则表初始化完成
const model = require('./model.js');
model.sync();

console.log('init db ok.');

//process.exit(0); 程序会直接终止，model.sync();无法执行。
// const model = require('./model.js');
// model.sequelize.sync().then(()=>{
//     console.log('init db ok.');
// }).catch((e)=>{
//     console.log(`failed: ${e}`);
// });

// process.exit(0);