var glob = require("glob-fs")({ gitignore: true })
var fs = require("fs")
var showdown = require("showdown")
var converter = new showdown.Converter()
var path = require("path")

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
  convertDirectory: function (directory) {
    var list_of_locations = this.parseDirectories(directory)
    for (var i=0; i<list_of_locations.length; i++) {
      var read = fs.readFileSync(list_of_locations[i], "utf8")
      list_of_locations[i] = list_of_locations[i].replace(directory, "build")
      list_of_locations[i] = list_of_locations[i].replace(".md", ".html")
      this.ensureDirectoryExistence(list_of_locations[i])
      var write = fs.writeFileSync(list_of_locations[i], converter.makeHtml(read))
    }
  }
}