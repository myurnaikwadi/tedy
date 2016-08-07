﻿using KindleSpur.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace KindleSpur.WebApplication.MessageHelper
{
    public class EmailNotification
    {
        static string emailAddress = "pranav.suknale@livewireprojects.com";
        static string password = "pranav2515";
        static MailAddress aliasemailsendername = new MailAddress(emailAddress.ToString(), "KindleSpur Support Team");

        public static void SendEmail(User signupObject, string uri)
        {
            
            MailMessage message = new MailMessage(aliasemailsendername.ToString(), signupObject.EmailAddress);
            message.Subject = "Account Activation";
            string body = "Hello " + signupObject.FirstName + ",";
            body += "<br/><br/>Please click the following link to activate your account<br/>";
            body += "<br/><br/><a style='background:#000000; color:#fafafa; padding:10px 100px 10px 100px; width:350px; text-decoration:none; font-weight:bold; font-size:20px;' href = '" + uri  + "'>Click here to activate your account.</a>";
            body += "<br /><br />Thanks, <br/> KindleSpur Team.";
            message.Body = body;
            message.IsBodyHtml = true;
            SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
            smtp.Credentials = new System.Net.NetworkCredential(emailAddress.ToString(), password.ToString());
            smtp.EnableSsl = true;
            smtp.Send(message);
        }

        public static void SendEmailForgotPassword(User signupObject, string uri)
        {
           
            MailMessage message = new MailMessage(aliasemailsendername.ToString(), signupObject.EmailAddress);
            message.Subject = "Forgot Password";
            string body = "Hello " + signupObject.FirstName + ",";
            body += "<br/><br/>Please click the following link to enter new password<br/>";
            body += "<br/><br/><a style='background:#000000; color:#fafafa; padding:10px 100px 10px 100px; width:350px; text-decoration:none; font-weight:bold; font-size:20px;' href = '" + uri + "'>Click here to enter new password.</a>";
            body += "<br /><br />Thanks, <br/> KindleSpur Team.";
            message.Body = body;
            message.IsBodyHtml = true;
            SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
            smtp.Credentials = new System.Net.NetworkCredential(emailAddress.ToString(), password.ToString());
            smtp.EnableSsl = true;
            smtp.Send(message);
        }

        public static void SendConversationEmail(Conversation _obj, string uri, string subject, string content)
        {
            MailMessage message = new MailMessage(aliasemailsendername.ToString(), _obj.ReceiverEmail);
            message.Subject = subject;
            message.Body = content;
            message.IsBodyHtml = true;
            SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
            smtp.Credentials = new System.Net.NetworkCredential(emailAddress.ToString(), password.ToString());
            smtp.EnableSsl = true;
            smtp.Send(message);
        }

        public static void SendMeetingEmail(MeetingSchedular _obj, string uri, string subject, string content)
        {
            MailMessage message = new MailMessage(aliasemailsendername.ToString(), _obj.ReceiverEmail);
            message.Subject = subject;
            message.Body = content;
            message.IsBodyHtml = true;
            SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
            smtp.Credentials = new System.Net.NetworkCredential(emailAddress.ToString(), password.ToString());
            smtp.EnableSsl = true;
            smtp.Send(message);
        }

    }
}