const messageSchema = require("../../schemas/messages")

module.exports = async (client, message) => {
  if (message.author.bot || message.channel.id !== "1074391258333716581") {
    return;
  }

  const memberid = message.author.id;
   await messageSchema.findOneAndUpdate(
    { userid: memberid },
    { $inc: { messages: 1 } },
    { upsert: true }
  );
};
