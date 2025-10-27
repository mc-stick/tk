// Download the helper library from https://www.twilio.com/docs/node/install
//const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";
import twilio from 'twilio';
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function createMessage(msg,from,to) {
//   const message = await client.messages.create({
//     body: msg, // "This is the ship that made the Kessel Run in fourteen parsecs?",
//     from: from, // "+15017122661",
//     to: to, // "+15558675310",
//   });

  console.log(msg, from, to);
//   console.log(message.body);
}

// createMessage();