const { fetchUserByUN } = require('../models/users.model')

const getUserByUN = (req, res, next) => {
    fetchUserByUN(req).then((user)=>{
            res.status(200).send({user})
    })
    .catch(next)
}


module.exports = { getUserByUN }