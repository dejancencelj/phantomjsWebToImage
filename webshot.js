var webshot = require('webshot');
var static = require('node-static');

var options = {
    onLoadFinished: function() {
    var elements = document.getElementsByClassName('cookie-banner');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    $('#input-dialog').remove();
    
    
   
  },
    renderDelay:4000,
    screenSize: {
        width: 1600
        , height: 900
    }
    , shotSize: {
        width: 1280
        , height: 'all'
    }};




//
// Create a node-static server instance to serve the './public' folder
//
var fileServer = new static.Server('./public');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        var url = request.url.substring(1,request.url.length);
        request.url = request.url.replace(/\//g,"_"); 
        request.url = request.url.replace(/:/g,"_"); 
        request.url = request.url + ".jpg";
        console.log(request.url);
        var file = request.url;
        fileServer.serve(request, response, function (e, res) {
            
            if (e && (e.status === 404)) { // If the file wasn't found
                console.log('no file. generating: ' + url);
                webshot(url, './public/' + file, options, function (err) {
                    // screenshot now saved to google.png
                
                     fileServer.serveFile('/'+file, 200, {}, request, response);
                });
                
            }else{
               console.log('file served: ' + file); 
            }
        });
     
      
    }).resume();
}).listen(3333);