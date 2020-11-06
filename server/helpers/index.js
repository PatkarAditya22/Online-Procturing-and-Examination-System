const jwt = require('jsonwebtoken');

 const getIdFromHeader = async (req)=>{
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    return decoded.id;
}

 const getCurrentTime = ()=>{
    const currentTime = new Date();
    const currentOffset = currentTime.getTimezoneOffset();
    const ISTOffset = 330;
    const ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
    return ISTTime
}
module.exports = {getIdFromHeader,getCurrentTime}