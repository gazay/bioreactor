WEB_SOCKET_SWF_LOCATION = "/javascripts/WebSocketMain.swf";
WEB_SOCKET_DEBUG = false;

socket = new WebSocket('ws://bioreactor.r10.railsrumble.com:8080')

socket.parse = function(data){
    var parsed = JSON.parse(data),
        command = parsed[0],
        arguments = parsed[1]

    api[command](arguments)
}

socket.onopen = function(){ console.log('opened') }
socket.onclose = function(){ console.log('closed') }
socket.onerror = function(){ console.log('error') }
socket.onmessage = function(event){ socket.parse(event.data) }

canvas = $('canvas')[0].getContext('2d')
canvas.jquery = $('canvas')

canvas.clear = function(){
    canvas.clearRect(0,0,canvas.jquery.width(),canvas.jquery.height())
}

canvas.draw = function(objects){
    $.each(objects, function(index, object){
        var id = object[0],
            locations = object[1]

        console.log(locations)
        $.each(locations, function(index, location){
            var x = location[0],
                y = location[1]

            console.log(x)
            canvas.fillRect(x*4, y*4, 4, 4)
        })
    })
}

api = {
    render: function(objects){ canvas.draw(objects) },
    id: function(value){ console.log(value); socket.id = value }
}