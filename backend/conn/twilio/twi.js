// Download the helper library from https://www.twilio.com/docs/node/install
//const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phone = process.env.TWILIO_PHONE;
//const client = twilio(accountSid, authToken);  //ACTIVAR

export async function createMessage(msg,to) {
  const message = await client.messages.create({
    body: msg, // "This is the ship that made the Kessel Run in fourteen parsecs?",
    from: phone, // "+15017122661",
    //to: "+1"+to, // "+15558675310",
    to: "", // "+15558675310",
  });

  console.log("sccId:",accountSid, " atk:",authToken, " TWph:",phone, " mgs:",msg || 'errOutPut', " toPh:",to);
  console.log(message.body);
}

// createMessage();