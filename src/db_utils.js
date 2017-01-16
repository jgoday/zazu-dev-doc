const path = require('path')
const sql = require('sql.js')
const fs = require('fs')

const create_database = (db) =>
{
    db.run('CREATE TABLE IF NOT EXISTS docs(prefix TEXT, name TEXT, value TEXT)')

    return db
}

const initialize = (dir) =>
{
    const db_file = path.join(dir, "db.sqlite")
    return new Promise((resolve, reject) =>
    {
        const data = fs.existsSync(db_file) ? fs.readFileSync(db_file) : null

        const db = new sql.Database(data)

        return resolve(create_database(db))
    })
}

const is_empty = (db) =>
{
    return db.exec('SELECT DISTINCT(prefix) FROM docs').length <= 0
}

const insert_all = (db, prefix) =>
{
    return (res) =>
    {
        for (const item of res)
        {
            db.run(
                `INSERT INTO docs(prefix, name, value) VALUES('${prefix}', '${item.name}', '${item.value}')`)
        }
    }
}

const save = (db, dir) =>
{
    const db_file = path.join(dir, "db.sqlite")
    const data = db.export()
    const buffer = new Buffer(data)
    fs.writeFileSync(db_file, buffer)
}

const find = (db, prefix, query, limit = 10) =>
{
    return db.exec(`SELECT * FROM docs
        WHERE prefix = '${prefix}' AND name LIKE '%${query}%'
        LIMIT ${limit}`)[0].values
}

module.exports = {
    initialize,
    is_empty,
    insert_all,
    find,
    save
}
