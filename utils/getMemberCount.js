const axios = require("axios")
module.exports = async () => {
    try {
      const response = await axios.get('https://groups.roblox.com/v1/groups/16000842');
      const data = response.data;
      
      return data.memberCount;
    } catch (error) {
    //  console.error("⚠️  | Failed to fetch member count, skipping cycle.");
    }
  }
