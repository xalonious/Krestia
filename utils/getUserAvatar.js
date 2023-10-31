const axios = require("axios")
module.exports = async (userId) => {
    try {
      const response = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=180x180&format=Png&isCircular=false`);
      const data = response.data;
      
        
      
      
        if(data.data[0].imageUrl !== "") {
             return data.data[0].imageUrl;
        } else {
            return "https://img.favpng.com/0/16/15/woman-question-mark-female-png-favpng-JRuwedyFNNkcVvpqzN1dGbTEw.jpg"
        }
        
     
    } catch (error) {
      console.error(`⚠️  | Error while fetching user avatar: ${error}`);
    }
  }
