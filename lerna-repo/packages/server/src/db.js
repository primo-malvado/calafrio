const SQL = require('sequelize');


const _cat = require("../models/category");

module.exports.createCon = () => {
    const Op = SQL.Op;
    const operatorsAliases = {
        $in: Op.in,
    };

    const db = new SQL('database', 'username', 'password', {
        dialect: 'sqlite',
        storage: './store.sqlite',
        operatorsAliases,
        logging: true,
    });
    return db;
};



module.exports.createStore = (db) => {

    const users = db.define('user', {
        id: {
            type: SQL.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        createdAt: SQL.DATE,
        updatedAt: SQL.DATE,
        email: SQL.STRING,
        token: SQL.STRING,
    });

    const trips = db.define('trip', {
        id: {
            type: SQL.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        createdAt: SQL.DATE,
        updatedAt: SQL.DATE,
        launchId: SQL.INTEGER,
        userId: SQL.INTEGER,
    });


    const Autor = db.define('autor', {
        id: {
            type: SQL.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        createdAt: SQL.DATE,
        updatedAt: SQL.DATE,
        name: SQL.STRING,
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'autores',
    });
 
        const Livro = db.define('livro', {
        id: {
            type: SQL.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: SQL.STRING,
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'livros',
    });

    Livro.belongsTo(Autor , { foreignKey: 'autor_id' }); 
    Autor.hasMany(Livro, {as: 'livros', foreignKey: 'autor_id' ,sourceKey: 'id' })

    const category = _cat(db, SQL);

    return {
        users,
        trips,
        autores:Autor,
        category:category,
        livros:Livro
    };
};