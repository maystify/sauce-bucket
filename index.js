#!/usr/bin/env node
var glob = require("glob-fs")({ gitignore: true })
var fs = require("fs")
var showdown = require("showdown")
var converter = new showdown.Converter()
var path = require("path")
var jsdom = require("jsdom")
var { JSDOM } = jsdom
var chalk = require("chalk")
var figlet = require("figlet")

//base program
var sauceBucket = {
  parseDirectories: function (directory) {
    return glob.readdirSync(directory + "/**/*.md")
  },
  ensureDirectoryExistence: function (filePath) {
    var dirname = path.dirname(filePath)
    if (fs.existsSync(dirname)) {
      return true
    }
    this.ensureDirectoryExistence(filePath)
    fs.mkdirSync(dirname)
  },
  printThing: function (text) {
    console.log(".net")
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    var randomValue = getRandomInt(0, 3)
    if (randomValue === 0) {
      console.log(chalk.blue(figlet.textSync(text, {
        font:"Standard",
        horizontalLayout:"default",
        verticalLayout:"default"
      })))
    }
    if (randomValue === 1) {
      console.log(chalk.red(figlet.textSync(text, {
        font:"Standard",
        horizontalLayout:"default",
        verticalLayout:"default"
      })))
    }
    if (randomValue === 2) {
      console.log(chalk.yellow(figlet.textSync(text, {
        font:"Standard",
        horizontalLayout:"default",
        verticalLayout:"default"
      })))
    }
  },
  convertDirectory: function (settings) {
    var day = new Date()
    var dom = new JSDOM(fs.readFileSync(__dirname + "/models/model.html", "utf8"))
    dom.window.document.getElementById("navbar").innerHTML = settings.name
    dom.window.document.getElementById("bottombar").innerHTML = day.getFullYear()
    if (settings.author) {
      dom.window.document.getElementById("bottombar").innerHTML = dom.window.document.getElementById("bottombar").innerHTML + " - " + settings.author + "<a href='" + settings.baseURL + "/auto_sauce_directory.html'>Page List</a>"
    }
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
    var write = fs.writeFileSync(settings.writeDirectory + "/auto_sauce_directory.html", dom.serialize())
  },
  cli: function() {
    var userArgs = process.argv.slice(2)
    var execLocation = process.cwd()
    var readLocation = execLocation + "/" + userArgs[1] + "/"
    if (userArgs[0] === "-b" || userArgs[0] === "--build") {
      var settings = JSON.parse(fs.readFileSync(readLocation + "settings.json"))
      settings.readDirectory = userArgs[1]
      sauceBucket.convertDirectory(settings)
      this.printThing("Done!")
    }
    if (userArgs[0] === "-m" || userArgs[0] === "--make") {
      var settings = fs.readFileSync("models/model.json")
      fs.writeFileSync(userArgs[1] + "/settings.json", settings)
      var index = fs.readFileSync("models/model.md")
      fs.writeFileSync(userArgs[1] + "/index.md", index)
      this.printThing("Done!")
    }
  }
}

//modularizing it
module.exports = sauceBucket

//CLI'ing it
sauceBucket.cli()
