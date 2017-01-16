const parser = require('htmlparser2')

const parse_class_name = (name) =>
{
    return name.replace(/struct/g, '')
               .replace(/class/g, '')
               .replace(/.html/g, '')
}

const parse_class = (host, str) =>
{
    return {
        name: parse_class_name(str),
        value: host + str
    }
}

const parse_html = (host) =>
{
    return (res) =>
    {
        const classes = []

        const htmlparser = new parser.Parser({
            onopentag: (name, attrs) =>
            {
                if (name == 'a' && attrs.href)
                {
                    classes.push(parse_class(host, attrs.href))
                }
            }
        }, {decodeEntities: true})

        htmlparser.write(res.data)
        htmlparser.end()

        return classes
    }
}

module.exports = {
    parse_html
}