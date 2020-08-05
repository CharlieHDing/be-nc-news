const connection = require('../db/connection')

const fetchUserByUN = (req)=>{
    const username = req.params.username
    return connection
    .select('*')
    .from('users')
    .where('username', username)
    .then((userArr)=>{
        const user = userArr[0]
        if (user === undefined) {
            return Promise.reject({status:404, msg:`No user found for username: ${username}` })
        } else {
            return user
        }
    })
}

module.exports = { fetchUserByUN }