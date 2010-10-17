WEB_SOCKET_SWF_LOCATION = "/javascripts/WebSocketMain.swf";
WEB_SOCKET_DEBUG = false;

host = (document.location.href.indexOf('file://') == -1 && document.location.href.indexOf('192') == -1) ? 'bioreactor.r10.railsrumble.com' : '192.168.0.126'
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
cell = 40
canvas.element.width = 70 * cell
canvas.element.height = 50 * cell
canvas.images = {}

canvas.images.wall = new Image()
canvas.images.wall.src = 'images/wall.png'

canvas.images.packman = []
canvas.images.woman = []
canvas.images.bioreactor = []

canvas.images.packman[0] = new Image()
canvas.images.packman[0].src = 'images/packman1_s.png'

canvas.images.packman[1] = new Image()
canvas.images.packman[1].src = 'images/packman2_s.png'

canvas.images.packman[2] = canvas.images.packman[0]
canvas.images.packman[3] = canvas.images.packman[1]

canvas.images.packman[4] = new Image()
canvas.images.packman[4].src = 'images/girl_in_pac.png'

canvas.images.packman[5] = new Image()
canvas.images.packman[5].src = 'images/girl_in_pac2.png'

canvas.images.packman[6] = new Image()
canvas.images.packman[6].src = 'images/pac33png.png'

canvas.images.packman[7] = new Image()
canvas.images.packman[7].src = 'images/packman1_new.png'

canvas.images.packman[8] = new Image()
canvas.images.packman[8].src = 'images/packman2_new.png'

canvas.images.packman[9] = canvas.images.packman[7]
canvas.images.packman[10] = canvas.images.packman[8]


canvas.images.woman[0] = new Image()
canvas.images.woman[0].src = 'images/girl1.png'

canvas.images.woman[1] = new Image()
canvas.images.woman[1].src = 'images/girl2.png'

canvas.images.woman[2] = new Image()
canvas.images.woman[2].src = 'images/girl3.png'

canvas.images.woman[3] = new Image()
canvas.images.woman[3].src = 'images/girl4.png'

canvas.images.bioreactor[0] = new Image()
canvas.images.bioreactor[0].src = 'images/bioreactor1.png'

canvas.images.bioreactor[1] = new Image()
canvas.images.bioreactor[1].src = 'images/bioreactor2.png'

canvas.images.bioreactor[2] = new Image()
canvas.images.bioreactor[2].src = 'images/bioreactor3.png'

canvas.images.bioreactor[3] = new Image()
canvas.images.bioreactor[3].src = 'images/bioreactor4.png'

canvas.cycle = 0

canvas.clear = function(){
    canvas.clearRect(0,0,canvas.element.width,canvas.element.height)
    if (canvas.cycle < 3)
        canvas.cycle += 1
    else
        canvas.cycle = 0
}

canvas.previous = {};
canvas.direction = {}

canvas.draw = function(objects){
    canvas.clear()

    for(id in objects){
        var location = objects[id];

        if (id == socket.id){
            var elementTop = canvas.position.top + location[0][1]*cell,
                elementLeft = canvas.position.left + location[0][0]*cell

            $('body').scrollTop(elementTop - $(window).height()/2)
            $('body').scrollLeft(elementLeft - $(window).width()/2)
        }

        for(var i = 0; i<location.length; i++){
            var x = location[i][0],
                y = location[i][1]

            if (id.indexOf('h') != -1)
                canvas.drawImage(canvas.images.woman[canvas.cycle], 11 + x*cell, y*cell)
            else if (id.indexOf('w') != -1)
                canvas.drawImage(canvas.images.wall, x*cell, y*cell)
            else if (id.indexOf('b') != -1)
                canvas.drawImage(canvas.images.bioreactor[canvas.cycle], x*cell, y*cell)
            else if (i == 0){
                var cycle = (location.length > 1) ? (canvas.cycle + 7) : canvas.cycle

                if (canvas.previous[id]){

                    if (x != canvas.previous[id][0])
                        canvas.direction[id] = (x > canvas.previous[id][0]) ? 2 : 4

                    if (y != canvas.previous[id][1])
                        canvas.direction[id] = (y > canvas.previous[id][1]) ? 3 : 1

                    if (canvas.direction[id] == 2){
                        canvas.save()
                        canvas.scale(-1,1)
                        canvas.drawImage(canvas.images.packman[cycle], -40-x*cell, y*cell)
                        canvas.restore()
                    } else if (canvas.direction[id] == 3){
                        canvas.save()
                        canvas.rotate(270*Math.PI/180)
                        canvas.drawImage(canvas.images.packman[cycle], -40-y*cell, x*cell)
                        canvas.restore()
                    } else if (canvas.direction[id] == 1){
                        canvas.save()
                        canvas.rotate(90*Math.PI/180)
                        canvas.drawImage(canvas.images.packman[cycle], y*cell, -40-x*cell)
                        canvas.restore()
                    } else
                        canvas.drawImage(canvas.images.packman[cycle], x*cell, y*cell)
                } else
                    canvas.drawImage(canvas.images.packman[cycle], x*cell, y*cell)
            } else if (i == location.length - 1){
                if (x < location[i-1][0]){
                    canvas.save()
                    canvas.scale(-1,1)
                    canvas.drawImage(canvas.images.packman[5], -40-x*cell, y*cell)
                    canvas.restore()
                } else if (y < location[i-1][1]){
                    canvas.save()
                    canvas.rotate(270*Math.PI/180)
                    canvas.drawImage(canvas.images.packman[5], -40-y*cell, x*cell)
                    canvas.restore()
                } else if (y > location[i-1][1]){
                    canvas.save()
                    canvas.rotate(90*Math.PI/180)
                    canvas.drawImage(canvas.images.packman[5], y*cell, -40-x*cell)
                    canvas.restore()
                } else
                    canvas.drawImage(canvas.images.packman[5], x*cell, y*cell)
            } else {
                var x1 = location[i-1][0],
                    x2 = location[i+1][0],
                    y1 = location[i-1][1],
                    y2 = location[i+1][1]

                if ((x == x1 && x == x2) || (y == y1 && y == y2))
                    canvas.drawImage(canvas.images.packman[4], x*cell, y*cell)
                else {
                    if ((x2>x1 && y2>y1 && y==y2) || (x2<x1 && y2<y1 && x==x2)){
                        canvas.save()
                        canvas.rotate(Math.PI)
                        canvas.drawImage(canvas.images.packman[6], -40-x*cell, -40-y*cell)
                        canvas.restore()
                    } else if ((x2<x1 && y2>y1 && x==x2) || (x2>x1 && y2<y1 && y==y2)){
                        canvas.save()
                        canvas.scale(-1,1)
                        canvas.drawImage(canvas.images.packman[6], -40-x*cell, y*cell)
                        canvas.restore()
                    } else if ((x2>x1 && y2<y1 && x==x2) || (x2<x1 && y2>y1 && y==y2)){
                        canvas.save()
                        canvas.rotate(90*Math.PI/180)
                        canvas.drawImage(canvas.images.packman[6], y*cell, -40-x*cell)
                        canvas.restore()
                    } else
                        canvas.drawImage(canvas.images.packman[6], x*cell, y*cell)
                }
            }



      /*var j = 4;
      while(j>0){
        prevX += (prevX-x);
        prevY += (prevY-y);
              canvas.fillRect(prevX, prevY, 4, 4)
      j--
      }
      console.log(x+" : "+prevX)*/
        }
        canvas.previous[id] = objects[id][0]
  }
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
                case 65:
                case 37:
                    if (keyboard.direction != 4){
                        keyboard.direction = 4
                        socket.send(4)
                    }
                    return false
                case 87:
                case 38:
                    if (keyboard.direction != 1){
                        keyboard.direction = 1
                        socket.send(1)
                    }
                    return false
                case 68:
                case 39:
                    if (keyboard.direction != 2){
                        keyboard.direction = 2
                        socket.send(2)
                    }
                    return false
                case 83:
                case 40:
                    if (keyboard.direction != 3){
                        keyboard.direction = 3
                        socket.send(3)
                    }
                    return false
            }
        })
    }
}

ping = {
    start: function(){
        ping.element = $('<div id="ping" style="position:fixed; background: white; top:0; right:0">').appendTo('body')
        ping.time = new Date().getTime()
        ping.results = []
        setInterval(ping.show, 2000)
        socket.send('ping')
    },
    update: function(){
        ping.results.push(new Date().getTime() - ping.time)
        if (ping.results.length > 5) ping.results.shift()
        setTimeout(function(){
            ping.time = new Date().getTime()
            socket.send('ping')
        }, 1500)
    },
    show: function(){
        var sum = 0
        $.each(ping.results, function(i,it){ sum += it })
        var result = parseInt(sum / ping.results.length),
            sorry = '<br/>Sorry, you can experience delay<br/>because of the distance to our server'

        if (result > 150)
            ping.element.html('Ping: ' + result + sorry)
        else
            ping.element.html('Ping: ' + result)
    }
}

keyboard.init()
