import http from 'http'
import socketIO from 'socket.io'

const server = http.createServer()

const io = socketIO(server,{
    cors : {
        origin : "*",
    }
})

ws.on('headers',(headers)=>{
    console.log('Headers -->' ,headers);
})

ws.on('connection',(socket)=>{

})