// Deprecated use zazu.json instead.
const path = require('path')

module.exports = {
  "name": "zazu-dev-documentation",
  "version": "1.0.0",
  "description": "Zazu plugin to access development documentation.",
  "blocks": {
    "input": [
      {
        "id": "qt block",
        "type": "PrefixScript",
        "args": "Required",
        "prefix": "qt ",
        "script": "src/search_qt.js",
        "icon": "assets/qt.png",
        "connections": [
          "OpenDocumentation"
        ]
      }
    ],
    "output": [
      {
        "id": "OpenDocumentation",
        "type": "OpenInBrowser",
        "url": "{value}"
      }
    ]
  }
}