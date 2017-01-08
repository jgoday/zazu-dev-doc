const qt = require('./qt.js')

// 
const filter_class_by_name = (name) =>
{
    return (item) => name.length > 2 && item.startsWith(name)
}

//
const create_class_url = (name) =>
{
    return {
        icon: 'assets/qt.png',
        title: name,
        value: qt.make_link(name)
    }
}

module.exports = (pluginContext) =>
{
    // first time we download the class list from qt
    if (!qt.is_initialized(pluginContext))
    {
        qt.download_classes(pluginContext)
    }

    // load all classes from previous file
    const classes = qt.load_classes(pluginContext)

    return (query, env = {}) => {
        return new Promise((resolve, reject) => {
            const values = classes
                .filter(filter_class_by_name(query)) // filter by input query
                .map(create_class_url)               // create each class url

            resolve(values)
        })
    }
}
