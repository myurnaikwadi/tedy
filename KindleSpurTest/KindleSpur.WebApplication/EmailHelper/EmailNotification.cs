using KindleSpur.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace KindleSpur.WebApplication.MessageHelper
{
    public class EmailNotification
    {
        static string emailAddress = "kindlespur@livewireprojects.com";
        // static string emailAddress = "support@kindlespur.com";
        static string password = "livewireprojects";
        //static string password = "dreamwewillachieve";
        static MailAddress aliasemailsendername = new MailAddress(emailAddress.ToString(), "KindleSpur Support Team");
        static int portNumber = 587;
        //static string smtpServer = "smtpout.asia.secureserver.net";
        static string smtpServer = "smtp.gmail.com";

        public static void SendEmail(User signupObject, string uri)
        {

            MailMessage message = new MailMessage(aliasemailsendername.ToString(), signupObject.EmailAddress);
            message.Subject = "Account Activation";
            string firstName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(signupObject.FirstName);
            string body = "Hello " + firstName + ",";
            body += "<br/>";
            body += "<br/><br/><a style='background:#808080; color:#fafafa; padding:10px 100px 10px 100px; width:350px; text-decoration:none; text-transform: capitalize; font-weight:bold; font-size:13px;' href = '" + uri + "'>CLICK HERE TO ACTIVATE YOUR KINDLESPUR ACCOUNT.</a>";
            body += "<br /><br /><br/>Thanks, <br/> KindleSpur Team.";
            message.Body = body;
            message.IsBodyHtml = true;
            SmtpClient smtp = new SmtpClient(smtpServer.ToString(), portNumber);
            smtp.Credentials = new System.Net.NetworkCredential(emailAddress.ToString(), password.ToString());
            smtp.EnableSsl = true;
            smtp.Send(message);
        }

        public static void SendEmailForgotPassword(User signupObject, string uri)
        {

            MailMessage message = new MailMessage(aliasemailsendername.ToString(), signupObject.EmailAddress);
            message.Subject = "Forgot Password";
            string firstName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(signupObject.FirstName);
            string body = "Hello " + firstName + ",";
            body += "<br/>";
            body += "<br/><br/><a style='background:#808080; color:#fafafa; padding:10px 100px 10px 100px; width:350px; text-decoration:none;  text-transform: capitalize; font-weight:bold; font-size:13px;' href = '" + uri + "'>CLICK HERE TO ENTER NEW PASSWORD FOR KINDLESPUR ACCOUNT.</a>";
            body += "<br /><br /><br/>Thanks, <br/> KindleSpur Team.";
            message.Body = body;
            message.IsBodyHtml = true;
            SmtpClient smtp = new SmtpClient(smtpServer.ToString(), portNumber);
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
            SmtpClient smtp = new SmtpClient(smtpServer.ToString(), portNumber);
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
            SmtpClient smtp = new SmtpClient(smtpServer.ToString(), portNumber);
            smtp.Credentials = new System.Net.NetworkCredential(emailAddress.ToString(), password.ToString());
            smtp.EnableSsl = true;
            smtp.Send(message);
        }

    }
}