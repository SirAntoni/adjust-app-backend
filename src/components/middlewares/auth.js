const fetch = require('node-fetch');
const API_AUTH=  process.env.API_AUTH;

module.exports = async (req, res, next) => {
    try {
        const response = await fetch(API_AUTH + "users/token/validar", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization
            }
        });
        if(response.ok){
            let result = await response.json();
            const { bEstado, obj } = result;

            if(bEstado){
                req.user = obj[0];
                return next();
            }
        }
    
        return res.status(403).json({message: 'Not Authorized'})
    } catch (error) {
        return res.status(500).json({message: 'Error intern'})
    }
    

}