const db = require('../db');

module.exports = db.defineModel('blogs', {
    blog_type: db.STRING(50),
    user_id: db.STRING(50),
    user_name: db.STRING(50),
    title: db.STRING(50),
    summary: db.STRING(200),
    content: db.TEXT('medium')
});