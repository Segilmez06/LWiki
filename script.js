window.onload = function() {
    $('#scrollBtn').on('click', function(){
        $('#content').animate({
            scrollTop: 0
        }, 250);
    });

    $('#content').on('scroll', function(){
        if($(this).scrollTop() > 0){
            $('#scrollBtn').fadeIn();
        }else{
            $('#scrollBtn').fadeOut();
        }
    });

    var path = location.href;
    var query = getQueryFromPath(path);

    var searchKey = "page";
    var pagesDir = "pages";
    var defaultPage = "main";
    var fileType = "md";
    var notFoundPage = "404";

    var settingsPath = "settings.json";
    fetch(settingsPath).then(response=> response.text()).then(function(settingsStr){
        var settings = JSON.parse(settingsStr);
        searchKey = settings.queryKey;
        pagesDir = settings.pageDirectory;
        defaultPage = settings.default;
        fileType = settings.pageType;
        notFoundPage = settings.notFoundPage;

        var filename = pagesDir + "/" + defaultPage + "." + fileType;

        if(query != undefined){
            filename = pagesDir + "/" + getValueFromQuery(query, searchKey) + "." + fileType;
        }
    
        document.getElementById('pathTxt').innerHTML = filename;

        fetch(filename).then(response=> {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.text();
        }).then(function(text){
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
        }).catch(function(error){
            filename = pagesDir + "/" + notFoundPage + "." + fileType;
            fetch(filename).then(response=> {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.text();
            }).then(function(errmsg){
                var content = errmsg;
    
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
            }).catch(function(error){
                document.getElementById("content").innerHTML = "<h1>Page not found!</h1>The page you requested is not found.";
            });
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
