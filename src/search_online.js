const axios = require('axios')

const parse_cpp_reference = (res) =>
{
    const make_url = (item) =>
    {
        return {
            icon: 'assets/cpp.png',
            title: item.title,
            value: `http://en.cppreference.com/w/${item.title}`,
            id: 1
        }
    }
    
    return res.data.query.search.map(make_url)
}

// available online searches
const online_sites = {
    cpp: {
        host: 'http://en.cppreference.com/w',
        search_url: 'http://en.cppreference.com/mwiki/api.php?action=query&list=search&format=json&srsearch=',
        parse_fn: parse_cpp_reference
    }
}

module.exports = (pluginContext) =>
{
    // prefixes
    const keys = Object.keys(online_sites)

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

            // gets the provider
            const provider = online_sites[site]
            // gets the search url
            const url = provider.search_url + name
            // gets the parse function
            const parse = provider.parse_fn
            // query online
            return axios.get(url).then(parse)
        }
    }
}