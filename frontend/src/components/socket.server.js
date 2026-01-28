import io from 'socket.io-client';

const socketInit = ({user_id, token ,room})=>{
    return io(`https://friendly-29oc.onrender.com`, {
        extraHeaders:{
            user_id,
            token,
            room
        },
    })
}

export default socketInit