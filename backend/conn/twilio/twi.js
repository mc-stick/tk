import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phone = process.env.TWILIO_PHONE;
//const client = twilio(accountSid, authToken);  //ACTIVAR //produccion

export async function createMessage(msg,to) {
  const message = await client.messages.create({
    body: msg,
    from: phone,
    to: "+1"+to,
  });

}
