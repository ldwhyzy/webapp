const config = {
    dialect: 'mysql',
    database: 'personalblog',
    username: 'root',
    password: '********',//
    host: 'localhost',
    port: 3306
};

const ADMIN_CODE = 5;
const COMMAN_CODE = 2;

const BLOG_ROW = 10;
const BLOG_THEME_STUDY = 'study';
const BLOG_THEME_FUN = 'fun';
const BLOG_SEARCH = 'search';
const BLOG_THEME = 'theme';
const TOKEN_SECRET = '*******';//
const WEBSOCKET_ON = true;

module.exports = {config, ADMIN_CODE, COMMAN_CODE, BLOG_ROW, TOKEN_SECRET, WEBSOCKET_ON};