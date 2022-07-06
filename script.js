window.onload = function() {
    delay(50);

    var path = location.href;
    var query = getQueryFromPath(path);

    var searchKey = "page";
    var pagesDir = "/pages";
    var defaultPage = "main";
    var fileType = "md";

    var settingsPath = "/settings.json";
    fetch(settingsPath).then(response=> response.text()).then(function(settingsStr){
        var settings = JSON.parse(settingsStr);
        searchKey = settings.queryKey;
        pagesDir = settings.pageDirectory;
        defaultPage = settings.default;
        fileType = settings.pageType;

        var filename = pagesDir + "/" + defaultPage + "." + fileType;

        if(query != undefined){
            filename = pagesDir + "/" + getValueFromQuery(query, searchKey) + "." + fileType;
        }
    
        fetch(filename).then(response=> response.text()).then(function(text){
            var content = text;

            var htmlData = "";
            switch(fileType){
                case "md":
                    htmlData = new showdown.Converter().makeHtml(content);
                    break;
                case "html":
                    htmlData = content;
                    break;
                case "txt":
                    htmlData = content;
                    break;
                default:
                    htmlData = content;
                    break;
            }
            document.getElementById("content").innerHTML = htmlData;
        });
    });
}

function getQueryFromPath(path){
    return path.split("?")[1];
}

function getValueFromQuery(query, searchkey){
    var args = query.split("&");
    for(var i = 0; i < args.length; i++){
        var key = args[i].split("=")[0];
        var value = args[i].split("=")[1];
        if(searchkey == key){
            return value;
        }
    }
    return undefined;
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
