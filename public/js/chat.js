const socket = io()

//elements
const $messageform = document.querySelector('#message-form')
const $messageformInput = $messageform.querySelector('input')
const $messageformButton = $messageform.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messagetemplate =document.querySelector('#message-temp').innerHTML 
const Locationtemplate = document.querySelector('#Location-message-temp').innerHTML

//optioins
const{username, room}= Qs.parse(location.search, {ignoreQueryPrefix:true})

//sidebar
const sidebarTemplate = document.querySelector('#sidebar').innerHTML

const scroll =()=>{
    //new message
    const $newMessage = $messages.lastElementChild
    //height of new message
    const newmessstyle = getComputedStyle($newMessage)
    const newMessageMargin  = parseInt(newmessstyle.marginBottom) 
    const newmessHeight = $newMessage.offsetHeight + newMessageMargin 
    const visibleheight = $messages.offsetHeight
    const mesageContainer = $messages.scrollHeight
    const scrolloffset = $messages.scrollTop +visibleheight

    if(mesageContainer - newmessHeight <=scrolloffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message)=>{
    const html = Mustache.render(messagetemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    scroll()
})

socket.on('locationmessage',(message)=>{
    const html = Mustache.render(Locationtemplate,{
        username:message.username,
        url:message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    scroll()
})

socket.on('roomData', ({room, users})=>{
    console.log(room)
    console.log(users)
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar_chat').innerHTML = html
})

$messageform.addEventListener('submit', (e)=>{
    e.preventDefault()
    //const message = document.querySelector('input').value

    //this disables the button after sending
    $messageformButton.setAttribute('disabled','disabled')
  

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error)=>{

        $messageformButton.removeAttribute('disabled')
        $messageformInput.value=''
        $messageformInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('message delivered')
    })
})

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('location has been shared')
        })
    })
})

socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href('/')
    }
})