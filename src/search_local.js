const axios = require('axios')
const db_utils = require('./db_utils')
const msdocs = require('./msdocs')
const html = require('./htmldoc')

const sites = {
    asp: {
        url: 'https://docs.microsoft.com/aspnet/core/api/toc.json',
        parse_fn: msdocs.parse_toc_file('https://docs.microsoft.com/')
    },
    cs: {
        url: 'https://docs.microsoft.com/dotnet/core/api/toc.json',
        parse_fn: msdocs.parse_toc_file('https://docs.microsoft.com/')
    },
    ef: {
        url: 'https://docs.microsoft.com/ef/core/api/toc.json',
        parse_fn: msdocs.parse_toc_file('https://docs.microsoft.com/')
    },
    vtk: {
        url: 'http://www.vtk.org/doc/nightly/html/classes.html',
        parse_fn: html.parse_html('http://www.vtk.org/doc/nightly/html/')
    },
    qt: {
        url: 'http://doc.qt.io/qt-5/classes.html',
        parse_fn: html.parse_html('http://doc.qt.io/qt-5/'),
        icon: 'assets/qt.png'
    }
}

const parse_db_resuls = (site, res) =>
{
    const icon = sites[site].icon

    return res.map(i =>
    {
        return {
            title: i[1],
            value: i[2],
            id: 1,
            icon
        }
    })
}

const download_sites = (dir) =>
{
    return (db) =>
    {
        if (db_utils.is_empty(db))
        {
            const keys = Object.keys(sites)
            const promises = []
            // download all docs
            for (const key of keys)
            {
                const url = sites[key].url
                const parse = sites[key].parse_fn

                promises.push(
                    axios.get(url)
                        .then(parse)
                        .then(db_utils.insert_all(db, key)))
            }

            Promise.all(promises).then(() => db_utils.save(db, dir))
        }

        return db
    }
}

const find = (site, name) =>
{
    return (db) =>
    {
        const results = db_utils.find(db, site, name)

        return parse_db_resuls(site, results)
    }
}

module.exports = (pluginContext) =>
{
    // prefixes
    const keys = Object.keys(sites)

    // initialize db if neccessary and download available docs
    const db = db_utils.initialize(pluginContext.cwd)
                       .then(download_sites(pluginContext.cwd))

    return {
        respondsTo: (query) =>
        {
            const site = query.split(/\s+/)[0]
            return keys.indexOf(site) >= 0
        },
        search: (query, env = {}) =>
        {
            const site = query.split(/\s+/)[0]
            const name = query.split(/\s+/)[1] || ''

            return db.then(find(site, name))
        }
    }
}
