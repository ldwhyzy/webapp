const db = require('../db');
const User = require('./User');
const Op = db.Op; 

var Comment = db.defineModel('comments', {
    blog_id: db.INTEGER,
    //title: db.STRING(50),
    //user_id: db.STRING(50),
    //user_name: db.STRING(50),
    content: db.TEXT('text'),
    //reply_to: db.INTEGER,
    floor_no: db.INTEGER,   
});

Comment.belongsTo(User, {as:'self', foreignKey:'user_id'});
Comment.belongsTo(User, {as:'reply', foreignKey:'reply_to'});

Comment.createComment = async function(comment){
    try{
        let transaction = await db.transaction();
        if(!comment.reply_to){
            //let lastFloor = await Comment.findOne({where:{blog_id: comment.blog_id}, order:[[db.fn('max', db.col('floor_no')), 'DESC']], limit:1, transaction: transaction}); //???
            let lastFloor = await this.findOne({where:{blog_id: comment.blog_id}, order:[['floor_no','DESC']], limit:1, transaction: transaction}); 
            comment.floor_no = lastFloor?lastFloor.floor_no+1:1;
        }
        let commentInstance = await Comment.create(comment);//将findOrCreate功能拆开 await才能使用
        return {comment:commentInstance.get({plain:true}), success:true};     
    }catch(err){
        console.log(err);
        return {success:false, errorInfo:"comment_error"};
        }                            
};

Comment.updateComment = async function(id, values){
    try{
        let comment = await Comment.findByPk(id);
        if(comment) result = await comment.update(values);
        return {success:true, comment:result};
    }catch(err){
        return {success:false};
    }
};

Comment.deleteComment = async function(id){
    let comment = await this.findByPk(id);
    if(comment)return comment.destroy({force:true});
};
Comment.findcommentById = function(id){
    return this.findByPk(id);
};

Comment.countAllComment = function(options={}){
    return this.count({col:"id", where:options});
};
Comment.offsetFindComment = function(rowCount, currentPage, options={}){
    return this.findAll({where: options, offset: rowCount*(currentPage-1), limit: rowCount});
};

Comment.floorOffsetFindComment =  function(rowCount, currentPage, options={}){//查找主楼评论
    options['reply_to'] = null;
    return this.findAll({where: options, include:[{model: User, as:'self', attributes: ['id', 'name']}], attributes: ['id', 'content', 'floor_no', 'createdAt','reply_to'], 
        offset: rowCount*(currentPage-1), limit: rowCount, order:[['floor_no',]], raw: true});
};

Comment.findReplyComment =  function(blogid, floorNo){//查找回复评论
    return this.findAll({where: {blog_id:blogid, floor_no:floorNo, reply_to:{[Op.not]:0}}, include:[{model: User, as:'self', attributes: ['id', 'name']}, {model: User, as:'reply', attributes: ['id', 'name']}], attributes: ['id', 'content', 'floor_no', 'createdAt',], 
    order:[['createdAt','DESC']], raw: true});
};

module.exports = Comment;