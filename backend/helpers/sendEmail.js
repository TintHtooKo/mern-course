const nodemailer = require("nodemailer");
const ejs = require('ejs')

let sendEmail = async({view,data,from,to,subject}) => {
    try {
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "4b11d68529f901",
              pass: "2591be8ea34210"
            }
          });
    
          let dataString = await ejs.renderFile('./views/'+view+'.ejs',data);
            const info = await transport.sendMail({
                from, // sender address
                to, // list of receivers
                subject, // Subject line
                html:dataString, // html body
              });
            
              console.log("Message sent: %s", info.messageId);
    } catch (e) {
        throw new Error(e)
    }
      
}

module.exports = sendEmail
