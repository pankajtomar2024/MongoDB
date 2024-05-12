// genrating token
const jwt = require('jsonwebtoken');
module.exports = {
    genrateAuthToken: function(userId, callBack){
    try{
        const token = jwt.sign({ id: userId},"mynameispankajtomarandhowareyou");
        callBack(token);
    }catch(error){
        console.log("token Genrated Error==>",error);
        // error.send("token Genrated Error==>",error,message)

    }
    }
}