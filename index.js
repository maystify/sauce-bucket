var prompt = require("prompt-sync")()

var human_input = prompt("What directory do you want to use? ")

var glob = require("glob-fs")({ gitignore: true })

//reading the directory
var getDirectories = function (src) {
  return glob.readdirSync(src + "/**/*.md")
}

var list_of_locations = getDirectories(human_input)

var showdown = require("showdown")
var converter = new showdown.Converter()

var fs = require("fs")

var path = require("path")

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

for (var i=0; i<list_of_locations.length; i++) {
  
  //reading files
  var read = fs.readFileSync(list_of_locations[i], "utf8")
  
  list_of_locations[i] = list_of_locations[i].replace(human_input, "build")
  list_of_locations[i] = list_of_locations[i].replace(".md", ".html")
  
  //ensuring directory exists
  ensureDirectoryExistence(list_of_locations[i])
  
  //writing files
  var write = fs.writeFileSync(list_of_locations[i], converter.makeHtml(read))
}