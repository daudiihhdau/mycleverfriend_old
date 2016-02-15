/**
 * Created by daudiihhdau on 17.12.15.
 */

var urlInfoPackage = {
    "name": "URLInfo",
    "description": "Defines the rss-feeds you like to subscribe for.",
    "direction": "Input",
    "properties":   [{ "name": "NumFeedItems", "type": "integer", "description": "Numbers of feeds to store.", "defaultValue": 200 }
        ,{ "name": "URL", "type": "url", "description": "URL where you get the rss-feed from." }
        ,{ "name": "Username", "type": "string", "description": "Sometimes you need a username to get access to the rss-feed." }
        ,{ "name": "Password", "type": "password", "description": "Sometimes you need a password to get access to the rss-feed." }
    ]
};

var rssOutputPackage = {
    "name": "RSSOutput",
    "description": "Defines the content of the expected rss-feeds.",
    "direction": "Output",
    "properties":   [{ "name": "Guid", "type": "string", "description": "" }
        ,{ "name": "Title", "type": "string", "description": "Headline of the feed item." }
        ,{ "name": "Link", "type": "url", "description": "Link to the website of this feed item." }
        ,{ "name": "Description", "type": "string", "description": "The article/text itself." }
        ,{ "name": "Author", "type": "email", "description": "The e-mail address of the author." }
        ,{ "name": "Category", "type": "string", "description": "One or more categories the item belongs to." }
    ]
};


module.exports.packageDefinitions = [urlInfoPackage, rssOutputPackage];

module.exports.work = function() {

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