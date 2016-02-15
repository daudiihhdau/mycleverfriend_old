/**
 * Created by daudiihhdau on 17.12.15.
 */
var path = require('path');

var paths = {
    "name": "Paths",
    "description": "Defines the directories you like to search through.",
    "direction": "Input",
    "properties":   [{ "name": "path", "type": "path", "description": "Path where you like to search the expected files." }
        ,{ "name": "ignoreSubDirectories", "type": "boolean", "description": "If true, all subfolders will be ignored." }
    ]
};

var fileSettings = {
    "name": "FileSettings",
    "description": "Defines the extensions of the files you like to search for.",
    "direction": "Input",
    "properties":   [{ "name": "extension", "type": "string", "description": "Extension of the file you search for. (example: bmp, pdf, txt)" }]
};

var foundFiled = {
    "name": "FoundFiled",
    "description": "Defines all found files with the expected data.",
    "direction": "Output",
    "properties":   [{ "name": "filename", "type": "path", "description": "The expected result of the filesearch." }]
};

module.exports.packageDefinitions = [paths, fileSettings, foundFiled];

module.exports.work = function(pluginProxy, callback) {

    /*var pathsPackage = getPackage(paths);
    while (pathsPackage.Read())
    {

    }*/

    add(2,4);

    fs.readdir("/home/daudiihhdau/Dokumente", function(err, items) {
        for (var i=0; i<items.length; i++) {

            if (path.extname(items[i]) == ".odt") {
                console.log(items[i]);
            }
        }
    });

    callback(null, null);

    /*DataTableReader baseDirectories = this.GetDataReader(typeof(BaseDirectories));
    while (baseDirectories.Read())
    {
        string basePath = baseDirectories[BaseDirectories.PathName.ToString()].ToString();
        this.AddNewLoggingMessage(typeof(BaseDirectories), String.Format("go to base directory:{0}", basePath));

        DataTableReader newDirectories = this.GetDataReader(typeof(NewDirectories));
        while (newDirectories.Read())
        {
            this.AddNewLoggingMessage(typeof(NewDirectories), String.Format("create new directory:{0}", newDirectories[NewDirectories.DirectoryName.ToString()].ToString()));

            Directory.CreateDirectory(basePath + "\\" + newDirectories[NewDirectories.DirectoryName.ToString()].ToString());
        }
    }*/


}