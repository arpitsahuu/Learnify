import { Request, Response, NextFunction } from 'express';
import errorHandler from "../utils/errorHandler" 
import ejs from "ejs"
import * as path from 'path';
import nodemailer,{Transport, Transporter} from 'nodemailer';

interface EamilOptions{
    email:string,
    subject:string,
    template:string,
    data:{[key:string]:any}
}

const sendmail = async ( next: NextFunction, email: string, subject: string, template: string, data: any) => {
    const transport:Transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.MAIL_EMAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    console.log(process.env.MAIL_EMAIL_ADDRESS)
    const templatePath = path.join(__dirname, "../mails", template);

    const html:string = await ejs.renderFile(templatePath, data);

    const mailOption: nodemailer.SendMailOptions = {
        from: "LMG Pvt. Ltd.",
        to: email,
        subject,
        html
    };

    transport.sendMail(mailOption, (err, info) => {
        if (err) return next(new errorHandler(err, 500));
        console.log("jo")
        return;
        // res.status(200).json({
        //     success: true,
        //     message: "successfully send mail pleas check your Mail",
        // });
    });
};

export default sendmail;
