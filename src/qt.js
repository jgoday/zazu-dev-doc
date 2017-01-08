const axios = require('axios')
const fs = require('fs')
const jsonfile = require('jsonfile')
const path = require('path')
const parser = require('htmlparser2')

const OUT_FILE = 'qt_classes.json'
const ALL_CLASSES_URL = 'http://doc.qt.io/qt-5/classes.html'

const parse_class_name = (str) =>
    str.substr(0, str.lastIndexOf('.')) || str

const download_classes = (ctx) =>
{
    const parse_response = (data) =>
    {
        const classes = []
        let startCapturing = false

        const htmlparser = new parser.Parser({
            onopentag: (name, attrs) =>
            {
                if (name == 'div' && attrs.class == 'flowListDiv')
                {
                    startCapturing = true;
                }
                else if (name == 'a' && startCapturing && attrs.href)
                {
                    classes.push(parse_class_name(attrs.href))
                }
            },
            onclosetag: (name) =>
            {
                if (startCapturing && name == 'div')
                {
                    startCapturing = false
                }
            }
        }, {decodeEntities: true})

        htmlparser.write(data.data)
        htmlparser.end()

        jsonfile.writeFileSync(
            path.join(ctx.cwd, OUT_FILE),
            classes)
    }

    axios.get(ALL_CLASSES_URL)
        .then(parse_response)
        .catch(err => ctx.console.log('error', err))
}

const is_initialized = (ctx) => fs.existsSync(path.join(ctx.cwd, OUT_FILE))

const load_classes = (ctx) => jsonfile.readFileSync(path.join(ctx.cwd, OUT_FILE))

const make_link = (name) => 'http://doc.qt.io/qt-5/' + name + '.html'

module.exports = {
    download_classes,
    is_initialized,
    load_classes,
    make_link
}