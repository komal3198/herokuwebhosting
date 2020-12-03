const socket = io('/')
const videoGrid = document.getElementById('videogrid')
//const mypeer=new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})
const mypeer = new Peer(undefined, { 
    //host: 'peerjs-server.herokuapp.com',
    host:'/',
     port: 3001
    })
    const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)
  mypeer.on('call',call =>{
      call.answer(stream)
      const video=document.createElement('video')
      call.on('stream',userVideoStream =>{
          addVideoStream(video,userVideoStream)
      })
  })
  socket.on('user-connected',userId=>{
    //console.log('user-connected:' + userId)
    connectToNewUser(userId,stream)
})
})
//herokuwebhosting


 mypeer.on('open',id=>{
    socket.emit('join-room',RoomId,id)
 })

//socket.emit('join-room',RoomId ,10)

function connectToNewUser(userId,stream){
    const call=mypeer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream)
    })
    call.on('close',() => {
        video.remove()
    })
}

function addVideoStream(video,stream){
    video.srcObject=stream
    video.addEventListener('loadedmetadata',() =>{
        video.play()
    })
    videoGrid.append(video)
}
// https://demo-app-komal.herokuapp.com