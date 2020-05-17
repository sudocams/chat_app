

users =[]
const addUser=({id, username, room})=>{
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate data
    if(!username || !room){
        return{
            error:'username and room required'
        }
    }
    //check for existing user
    const existingUsers = users.find((user)=>{
        return user.room ===room && user.username === username
    })
    //validate username
    if(existingUsers){
        return{
            error:'username is in use'
        }
    }

    //storeuser
    const user = {id, username, room}
    users.push(user)
    return{user}

}

const removeUsers =(id)=>{
    const index = users.findIndex((user)=>{
        return user.id=id
    })
    if(index !==-1){
        return users.splice(index, 1)[0]
    }
}


const getUser=(id)=>{
    return users.find((user)=>user.id ===id)
}

const getUsersInRoom=(room)=>{
    room = room.trim().toLowerCase()
    return users.filter((user)=>user.room === room)
}


module.exports = {
    addUser,
    removeUsers,
    getUser,
    getUsersInRoom
}