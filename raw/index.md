# Sauce Bucket
A Lightweight, Easy Static Website Generator

# Why?
The purpose of this project was to make an easy way to convert a directory of markdown files to a directory of html files, as I didn't want to have to write out every single html page.

# Getting Started
Note: Currently, this package isn't CLI enabled so you'll have to use it through a script.

First, you need to install the Sauce Bucket module:
```
npm install sauce-bucket --save
```
Next, import the module:
```
var sauceBucket = require("sauce-bucket")
```
Finally, run the `convertDirectory()` method. There are a few variables that need to be passed:
```
sauceBucket.convertDirectory({"readDirectory":READ_DIRECTORY_NAME, "writeDirectory":WRITE_DIRECTORY_NAME, "name":SITE_NAME, "baseURL":URL_THAT_ALL_THE_FILES_WILL_FOLLOW})
```
For example:
```
sauceBucket.convertDirectory({"readDirectory":"raw", "writeDirectory":"docs", "name":"Sauce Bucket", "baseURL":"https://alexwaitz.github.io/sauce-bucket"})
```

# Notes
The directory you convert should just be a directory of `.md` files. Having subdirectories for categories of pages is perfectly fine, and is recommended for a good website layout.

Also, in your main directory, don't have a file named `auto_sauce_directory.md` because that's automatically generated as a basic directory list.

# Todo
- [ ] Add more dynamics to the base model
- [ ] Create a CLI accessible component of this package

# Demo
Currently, you're seeing a working demo of the project. Hopefully, as the projects progresses, this page's advancement will also increase.

# Directory
Check out a directory of pages [here](https://alexwaitz.github.io/sauce-bucket/directory.html)
