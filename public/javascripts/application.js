WEB_SOCKET_SWF_LOCATION = "/javascripts/WebSocketMain.swf";
WEB_SOCKET_DEBUG = false;

socket = new WebSocket('ws://bioreactor.r10.railsrumble.com:8080')

socket.parse = function(data){
    var parsed = JSON.parse(data),
        command = parsed[0],
        arguments = parsed[1]

    api[command](arguments)
}


socket.onopen = function(){ socket.opened = true }
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
    canvas.clear()

    $.each(objects, function(index, object){
        var id = object[0],
            locations = object.slice(1)

        $.each(locations, function(index, location){
            var x = location[0],
                y = location[1]

            canvas.fillRect(x*4-2, y*4-2, 4, 4)
        })
    })
}

api = {
    render: function(objects){ canvas.draw(objects) },
    id: function(value){ socket.id = value }
}

keyboard = {
    init: function(){
        $(document).keydown(function(event){
            if (!socket.opened) return

            switch(event.which){
                case 37:
                    socket.send(4)
                    break
                case 38:
                    socket.send(1)
                    break
                case 39:
                    socket.send(2)
                    break
                case 40:
                    socket.send(3)
                    break
            }
        })
    }
}

keyboard.init()