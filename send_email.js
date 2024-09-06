const nodemailer = require('nodemailer');
module.exports={
SendEmail:async(to, subject , body)=>{
    try{
        let mailTransporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSEMAIL
            }
        });
        let mailDetails = {
            from:process.env.EMAIL,
            to,
            subject,
            html:body
        };
        let info = await mailTransporter.sendMail(mailDetails);
        console.log("email sent successfully: ",info.response);
    }
    catch(err){
        console.error('Error sending email: ', err.message);
    }
}

};