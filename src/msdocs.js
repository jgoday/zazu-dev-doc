const make_item = (url, item) =>
{
    return {
        name: item.toc_title,
        value: url + item.relative_path_in_depot
    }
}

const parse_children = (url, item) =>
{
    if (item.children && item.children.length > 1)
    {
        let values = [
            make_item(url, item)
        ]

        for (const child of item.children)
        {
            values = values.concat(parse_children(url, child))
        }

        return values
    }
    else
    {
        return [make_item(url, item)]
    }
}
// parse toc.json file and make the results
const parse_toc_file = (url) =>
{
    return (res) =>
    {
        let values = []
        for (const ns of res.data)
        {
            values = values.concat(parse_children(url, ns))
        }

        return values
    }
}

module.exports = {
    parse_toc_file
}