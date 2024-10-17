import nodemailer from 'nodemailer'


export const sendEmail =async({to,subject,html})=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
          user: "rehamwael1212003@gmail.com",
          pass: "rgzoprgeeopajqgd",
        },
      });
      await transporter.sendMail({
        from: '"Route Academy" <rehamwael1212003@gmail.com>',
        to,
        subject,
        html,
      });
    
}