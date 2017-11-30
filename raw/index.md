# Sauce Bucket
A Lightweight, Easy Static Website Generator

# Contact
If you have any questions, concerns, or comments, send me an email at [alexanderjwaitz@gmail.com](mailto:alexanderjwaitz@gmail.com)

# Why?
The purpose of this project was to make an easy way to convert a directory of markdown files to a directory of html files, as I didn't want to have to write out every single html page.

# Getting Started
### Command Line Interface (CLI)
Install the package globally:
```
npm install sauce-bucket -g
```
If you want to build a directory into a site, use this command:
```
sbit -b READ_DIRECTORY_NAME
```
(by the way, `sbit` stands for (s)auce (b)ucket (it))

In order to build correctly, you have to have a file in the parent directory called `settings.json` that contains the required settings. Here's a template you can follow:
```
{
  "writeDirectory":"WRITE_DIRECTORY_NAME",
  "name":"SITE_NAME",
  "baseURL":"URL_THAT_ALL_THE_FILES_WILL_FOLLOW",
  "author":"AUTHOR_NAME"
}
```
Note: the author field is optional

However, to generate a template to start writing out stuff, use this command:
```
sbit -m WRITE_DIRECTORY_NAME
```
This will put a few files into the given to get you started on your site. Remember, these files are all templates, and you must actually go into them and fill them out with your data. When you're done, use the command from above to build the raw data into a directory of web ready html files

### Modular
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

Don't like the styling? Simply open up `model.html` and edit away! The styling you add will be present in every page of the build.

When you give Sauce Bucket directory names to either read or write to, make sure that the directories already exist, as Sauce Bucket won't make a parent directory for you.

# Todo
- [ ] Add more dynamics to the base model

# Demo
Currently, you're seeing a working demo of the project. Hopefully, as the projects progresses, this page's advancement will also increase.

# Directory
Check out a directory of pages [here](https://alexwaitz.github.io/sauce-bucket/auto_sauce_directory.html)
