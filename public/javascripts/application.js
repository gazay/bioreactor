WEB_SOCKET_SWF_LOCATION = "/javascripts/WebSocketMain.swf";
WEB_SOCKET_DEBUG = false;

socket = new WebSocket('ws://192.168.0.126:8080')

socket.parse = function(data){
    var parsed = JSON.parse(data),
        command = parsed[0],
        arguments = parsed[1]

    api[command](arguments)
}

var previousTime, currentTime

socket.onclose = function(){ console.log('closed') }
socket.onerror = function(){ console.log('error') }
socket.onopen = function(){
    socket.opened = true
    previousTime = new Date().getTime()
}
socket.onmessage = function(event){
    currentTime = new Date().getTime()
    console.log((currentTime - previousTime)/1000)
    previousTime = currentTime
    socket.parse(event.data)
}

canvas = $('canvas')[0].getContext('2d')
canvas.element = $('canvas')[0]
canvas.element.width = 280
canvas.element.height = 200

canvas.clear = function(){
    canvas.clearRect(0,0,canvas.element.width,canvas.element.height)
}

canvas.previous = '';


canvas.draw = function(objects){
    canvas.clear()

	for(id in objects){
		var location = objects[id], prevLocation = canvas.previous != '' ? canvas.previous[id] : objects[id];
		console.log(canvas.previous)
		// console.log('===' + Object.prototype.toString(location[1]))
		for(var i = 0; i<location.length; i++){
            	var x = location[i][0],
                	y = location[i][1],
					prevX = prevLocation[i][0],
					prevY = prevLocation[i][1];
					console.log(x+" : "+prevX)
				canvas.fillRect(x*4, y*4, 4, 4)
			/*var j = 4;	
			while(j>0){
				prevX += (prevX-x);
				prevY += (prevY-y);
            	canvas.fillRect(prevX, prevY, 4, 4)
			j--
			}
			console.log(x+" : "+prevX)*/	
        }
	}
	
	
	canvas.previous = objects;

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
                    if (keyboard.direction != 4){
                        keyboard.direction = 4
                        socket.send(4)
                    }
                    break
                case 38:
                    if (keyboard.direction != 1){
                        keyboard.direction = 1
                        socket.send(1)
                    }
                    break
                case 39:
                    if (keyboard.direction != 2){
                        keyboard.direction = 2
                        socket.send(2)
                    }
                    break
                case 40:
                    if (keyboard.direction != 3){
                        keyboard.direction = 3
                        socket.send(3)
                    }
                    break
            }
        })
    }
}

keyboard.init()