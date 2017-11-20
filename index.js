var glob = require("glob-fs")({ gitignore: true })
var fs = require("fs")
var showdown = require("showdown")
var converter = new showdown.Converter()
var path = require("path")
var jsdom = require("jsdom")
var { JSDOM } = jsdom
var dom = new JSDOM(fs.readFileSync("model.html", "utf8"))

var sauceBucket = {
  parseDirectories: function (directory) {
    return glob.readdirSync(directory + "/**/*.md")
  },
  ensureDirectoryExistence: function (filePath) {
    var dirname = path.dirname(filePath)
    if (fs.existsSync(dirname)) {
      return true
    }
    ensureDirectoryExistence(dirname)
    fs.mkdirSync(dirname)
  },
  /*buildTreeHTML: function (directory) {
    var list_of_locations = this.parseDirectories(directory)
    var tree = {}
    for (var i=0; i<list_of_locations.length; i++) {
      var read = fs.readFileSync(list_of_locations[i], "utf8")
      list_of_locations[i] = list_of_locations[i].replace(directory, "build")
    }
  },*/
  convertDirectory: function (directory, name) {
    var list_of_locations = this.parseDirectories(directory)
    dom.window.document.getElementById("title").innerHTML = name
    for (var i=0; i<list_of_locations.length; i++) {
      var read = fs.readFileSync(list_of_locations[i], "utf8")
      list_of_locations[i] = list_of_locations[i].replace(directory, "build")
      list_of_locations[i] = list_of_locations[i].replace(".md", ".html")
      this.ensureDirectoryExistence(list_of_locations[i])
      dom.window.document.getElementById("container").innerHTML = converter.makeHtml(read)
      var write = fs.writeFileSync(list_of_locations[i], dom.serialize())
    }
  }
}

sauceBucket.convertDirectory("raw", "Sauce Bucket")

module.exports = sauceBucket