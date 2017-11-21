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
    this.ensureDirectoryExistence(dirname)
    fs.mkdirSync(dirname)
  },
  convertDirectory: function (settings) {
    var list_of_locations = this.parseDirectories(settings.readDirectory)
    dom.window.document.getElementById("title").innerHTML = settings.name
    for (var i=0; i<list_of_locations.length; i++) {
      var read = fs.readFileSync(list_of_locations[i], "utf8")
      list_of_locations[i] = list_of_locations[i].replace(settings.readDirectory, settings.writeDirectory)
      list_of_locations[i] = list_of_locations[i].replace(".md", ".html")
      this.ensureDirectoryExistence(list_of_locations[i])
      dom.window.document.getElementById("container").innerHTML = converter.makeHtml(read)
      var write = fs.writeFileSync(list_of_locations[i], dom.serialize())
    }
    dom.window.document.getElementById("container").innerHTML = "<h1>List Of Pages</h1>"
    for (var i=0; i<list_of_locations.length; i++) {
      list_of_locations[i] = list_of_locations[i].replace(settings.writeDirectory, "")
      dom.window.document.getElementById("container").innerHTML = dom.window.document.getElementById("container").innerHTML + "<p><a href='" + settings.baseURL + list_of_locations[i] + "'>" + list_of_locations[i].replace(".html", "") + "</a></p>"
    }
    var write = fs.writeFileSync(settings.writeDirectory + "/directory.html", dom.serialize())
  }
}

//sauceBucket.convertDirectory({"readDirectory":"raw", "writeDirectory":"docs", "name":"Sauce Bucket", "baseURL":"https://alexwaitz.github.io/sauce-bucket"})

module.exports = sauceBucket