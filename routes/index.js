
require("fs").readdirSync("./routes").forEach(function(file) {
    if (file!='index.js') {
        exports[file.replace(/\.js$/i, '')] = require("./" + file );
    }
});