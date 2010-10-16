WEB_SOCKET_SWF_LOCATION = "/javascripts/WebSocketMain.swf";
WEB_SOCKET_DEBUG = false;

socket = new WebSocket('ws://bioreactor.r10.railsrumble.com:8080')

socket.parse = function(data){
    console.log(data)
    var json = JSON.parse(data)
    canvas.draw(json)
}

socket.onopen = function(){ console.log('opened') }
socket.onclose = function(){ console.log('closed') }
socket.onerror = function(){ console.log('error') }
socket.onmessage = function(event){ socket.parse(event.data) }

canvas = $('canvas')[0].getContext('2d')
canvas.draw = function(objects){
    $.each(objects, function(index, object){
        var id = object[0],
            locations = object[1]

        $.each(locations, function(index, location){
            var x = location[0],
                y = location[1]

        })
    })
}