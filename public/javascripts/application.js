WEB_SOCKET_SWF_LOCATION = "/javascripts/WebSocketMain.swf";
WEB_SOCKET_DEBUG = false;

host = (document.location.href.indexOf('file://') == -1) ? 'bioreactor.r10.railsrumble.com' : '192.168.0.126'
host = 'ws://'+ host +':8080'
socket = new WebSocket(host)

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
    ping.start()
    // previousTime = new Date().getTime()
}
socket.onmessage = function(event){
    // currentTime = new Date().getTime()
    // console.log((currentTime - previousTime)/1000)
    // previousTime = currentTime
    socket.parse(event.data)
}

canvas = $('canvas')[0].getContext('2d')
canvas.element = $('canvas')[0]
canvas.position = $('canvas').position()
cell = 4
canvas.element.width = 70 * cell
canvas.element.height = 50 * cell

canvas.clear = function(){
    canvas.clearRect(0,0,canvas.element.width,canvas.element.height)
}

canvas.previous = {};

canvas.draw = function(objects){
    canvas.clear()

    for(id in objects){
        canvas.fillStyle = (id == socket.id) ? 'red' : 'black'
        var location = objects[id], prevLocation = canvas.previous[id];

        // if (id == socket.id){
        //     var elementTop = canvas.position.top + location[0][1]*cell,
        //         elementLeft = canvas.position.left + location[0][0]*cell,
        //         leftBorder = $('body').scrollLeft() + cell,
        //         topBorder = $('body').scrollTop() + cell,
        //         rightBorder = leftBorder + $(window).width(),
        //         bottomBorder = topBorder + $(window).height()
        //
        //
        //     if (elementTop <= topBorder)
        //         $('body').scrollTop(elementTop - cell)
        //     if  (elementTop >= bottomBorder)
        //         $('body').scrollTop(elementTop - $(window).height() + 2*cell)
        //     if ((elementLeft <= leftBorder) || (elementLeft >= rightBorder))
        //         $('body').scrollLeft(elementLeft - cell)
        // }

        for(var i = 0; i<location.length; i++){
            var x = location[i][0],
                y = location[i][1]

            if (prevLocation && prevLocation[i]){
                var prevX = prevLocation[i][0],
                    prevY = prevLocation[i][1];
            }

            if (typeof(id) == 'string' && id.indexOf('h') != -1)
                canvas.fillRect(x*cell+cell/4, y*cell+cell/4, cell/2, cell/2)
            else
                canvas.fillRect(x*cell, y*cell, cell, cell)

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
    ping: function(){ ping.update() },
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

ping = {
    start: function(){
        ping.element = $('<div id="ping">').appendTo('body')
        ping.time = new Date().getTime()
        ping.results = []
        setInterval(ping.show, 1000)
        socket.send('ping')
    },
    update: function(){
        ping.old_time = ping.time
        ping.time = new Date().getTime()
        ping.results.push(ping.time - ping.old_time)
        if (ping.results.length > 5) ping.results.shift
        socket.send('ping')
    },
    show: function(){
        var sum = 0
        $.each(ping.results, function(i,it){ sum += it })
        ping.element.text('Ping: ' + parseInt(sum / ping.results.length))
    }
}

keyboard.init()
