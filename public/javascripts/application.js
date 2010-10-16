WEB_SOCKET_SWF_LOCATION = "/javascripts/WebSocketMain.swf";
WEB_SOCKET_DEBUG = false;

socket = new WebSocket('ws://bioreactor.r10.railsrumble.com:8080')

socket.parse = function(data){
    var parsed = JSON.parse(data),
        command = parsed[0],
        arguments = parsed[1]

    console.log(parsed)
    api[command](arguments)
}

socket.onopen = function(){ console.log('opened') }
socket.onclose = function(){ console.log('closed') }
socket.onerror = function(){ console.log('error') }
socket.onmessage = function(event){ socket.parse(event.data) }

canvas = $('canvas')[0].getContext('2d')
canvas.element = $('canvas')[0]
canvas.element.width = 280
canvas.element.height = 200

canvas.clear = function(){
    canvas.clearRect(0,0,canvas.element.width,canvas.element.height)
}

canvas.draw = function(objects){
    // canvas.clear()
    console.log(objects)

    $.each(objects, function(index, object){
        var id = object[0],
            locations = object.slice(1,-1)

        $.each(locations, function(index, location){
            var x = location[0],
                y = location[1]

            canvas.fillRect(100, 100, 4, 4)
        })
    })
}

api = {
    render: function(objects){ canvas.draw(objects) },
    id: function(value){ socket.id = value }
}