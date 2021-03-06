#!/usr/bin/env node
var glob = require("glob-fs")({ gitignore: true })
var fs = require("fs")
var showdown = require("showdown")
var converter = new showdown.Converter()
var path = require("path")
var jsdom = require("jsdom")
var { JSDOM } = jsdom

//base program
var sauceBucket = {
  parseFiles: function (directory) {
    return glob.readdirSync(directory + "/**/*.md")
  },
  parseDirectories: function (directory) {
    return glob.readdirSync(directory + "/**/")
  },
  convertDirectory: function (settings) {
    console.log("-initializing conversion process")
    console.log("-reading and initializing the page model")
    try {
      var dom = new JSDOM(fs.readFileSync(__dirname + "/" + settings.readDirectory + "/model.html", "utf8"))
    }
    catch (err) {
      var dom = new JSDOM(fs.readFileSync(__dirname + "/models/model.html", "utf8"))
    }
    dom.window.document.getElementById("navbar").innerHTML = settings.name
    var day = new Date()
    dom.window.document.getElementById("bottombar").innerHTML = day.getFullYear()
    if (settings.author) {
      dom.window.document.getElementById("bottombar").innerHTML = settings.author + " - " + dom.window.document.getElementById("bottombar").innerHTML + "<a href='" + settings.baseURL + "/auto_sauce_directory.html'>Page List</a>"
    }
    dom.window.document.getElementById("title").innerHTML = settings.name
    var list_of_locations = this.parseFiles(settings.readDirectory)
    var list_of_directories = this.parseDirectories(settings.readDirectory)
    for (var i=0; i<list_of_directories.length; i++) {
      if (list_of_directories[i].endsWith("/") === true) {
        list_of_directories[i] = list_of_directories[i].replace(settings.readDirectory, settings.writeDirectory)
        if (!fs.existsSync(list_of_directories[i])) {
          fs.mkdirSync(list_of_directories[i])
        }
      }
    }
    for (var i=0; i<list_of_locations.length; i++) {
      if (!list_of_locations[i].endsWith("/")) {
        console.log("-converting " + list_of_locations[i])
        var read = fs.readFileSync(list_of_locations[i], "utf8")
        list_of_locations[i] = list_of_locations[i].replace(settings.readDirectory, settings.writeDirectory)
        list_of_locations[i] = list_of_locations[i].replace(".md", ".html")
        dom.window.document.getElementById("container").innerHTML = converter.makeHtml(read)
        var write = fs.writeFileSync(list_of_locations[i], dom.serialize())
      }
    }
    dom.window.document.getElementById("container").innerHTML = "<h1>List Of Pages</h1>"
    console.log("-creating auto directory")
    for (var i=0; i<list_of_locations.length; i++) {
      list_of_locations[i] = list_of_locations[i].replace(settings.writeDirectory, "")
      dom.window.document.getElementById("container").innerHTML = dom.window.document.getElementById("container").innerHTML + "<p><a href='" + settings.baseURL + list_of_locations[i] + "'>" + list_of_locations[i].replace(".html", "") + "</a></p>"
    }
    var write = fs.writeFileSync(settings.writeDirectory + "/auto_sauce_directory.html", dom.serialize())
  },
  cli: function() {
    var userArgs = process.argv.slice(2)
    var execLocation = process.cwd()
    var readLocation = execLocation + "/" + userArgs[1] + "/"
    if (userArgs[0] === "-b" || userArgs[0] === "--build") {
      console.log("-reading configs")
      var settings = JSON.parse(fs.readFileSync(readLocation + "settings.json"))
      settings.readDirectory = userArgs[1]
      console.log("-convert begin")
      sauceBucket.convertDirectory(settings)
      console.log("-done!")
      return
    }
    if (userArgs[0] === "-n" || userArgs[0] === "--new") {
      console.log("-writing out base files")
      var settings = fs.readFileSync(__dirname + "/models/model.json")
      fs.writeFileSync(userArgs[1] + "/settings.json", settings)
      var index = fs.readFileSync(__dirname + "/models/model.md")
      fs.writeFileSync(userArgs[1] + "/index.md", index)
      var model = fs.readFileSync(__dirname + "/models/model.html")
      fs.writeFileSync(userArgs[1] + "/model.html", index)
      console.log("-done!")
      return
    }
    else {
      console.log("\nusage: sbit [--command] [passed variable]\n\nHere are the commands:\n\n-b or --build converts the passed directory into the html version\n-m or --make writes out a template project in the passed directory\n")
    }
  }
}

//modularizing it
module.exports = sauceBucket

//CLI'ing it
sauceBucket.cli()
