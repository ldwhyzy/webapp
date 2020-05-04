const Sequelize = require('sequelize');
const uuid = require('uuid');
const config = require('./config').config;

console.log('init sequelize...');

const Op = Sequelize.Op; 

function generateId(){
    return uuid.v1();
}

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    operatorsAliases: false,
});

//const ID_TYPE = Sequelize.STRING(50);

function defineModel(name, attributes){
    var attrs = {};
    for (let key in attributes) {  //表的定义可以有简略形式和用{}表示的完整形式，简略形式则处理，所有列属性默认设置为NOT NULL，除非特别设置，所以定义表时不需设置
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }

    attrs.id = {//为创建的表统一添加id列，所有表均会有该列
        //type: ID_TYPE,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    };
    attrs.createdAt = {//为创建的表统一添加createdAt列
        type: Sequelize.BIGINT,//毫秒数？
        allowNull: false
    };
    attrs.updatedAt = {//为创建的表统一添加updatedAt列
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.version = {//为创建的表统一添加version列
        type: Sequelize.BIGINT,
        allowNull: false
    };
    
    console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function (k, v) {//序列化表属性
        if (k === 'type') {
            return "tss.....";
            /*
            for (let key in Sequelize) {
                if (key === 'ABSTRACT' || key === 'NUMBER') {
                    continue;
                }
                let dbType = Sequelize[key];
                if (typeof dbType === 'function') {
                    if (v instanceof dbType) {
                        if (v._length) {
                            return `${dbType.key}(${v._length})`;
                        }
                        return dbType.key;
                    }
                    if (v === dbType) {
                        return dbType.key;
                    }
                }
            }
            */
        }
        return v;
    }, '  '));

    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if (obj.isNewRecord) {
                    console.log('will create entity...' + obj);
                    /*
                    if (!obj.id) {
                        obj.id = generateId();
                    }*/
                    obj.createdAt = now;
                    obj.updatedAt = now;
                    obj.version = 0;
                } else {
                    console.log('will update entity...');
                    obj.updatedAt = now;
                    obj.version++;
                }
            },
        }
    });
}

async function transaction(options={isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE}, autoCallback=null){
    return sequelize.transaction(options, autoCallback);
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

var exp = {
    fn: sequelize.fn,
    col: sequelize.col,
    defineModel: defineModel,
    transaction: transaction,
    Op: Op,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            sequelize.sync({ force: true });
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}

//exp.ID = ID_TYPE;
//exp.generateId = generateId;

module.exports = exp;