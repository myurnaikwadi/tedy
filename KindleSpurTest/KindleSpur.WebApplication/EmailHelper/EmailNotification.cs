using KindleSpur.Models;
using KindleSpur.Models.Communication;
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
        static string link = "www.kindlespur.com";

        public static void SendEmail(User signupObject, string uri)
        {

            MailMessage message = new MailMessage(aliasemailsendername.ToString(), signupObject.EmailAddress);
            message.Subject = "Account Activation";
            string firstName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(signupObject.FirstName);
            string body = "Hello " + firstName + ",";
            body += "<br/>";
            body += "<br/><br/><a style='background:#808080; color:#fafafa; padding:10px 100px 10px 100px; width:350px; text-decoration:none; text-transform: capitalize; font-weight:bold; font-size:13px;' href = '" + uri + "'>CLICK HERE TO ACTIVATE YOUR KINDLESPUR ACCOUNT.</a>";
            body += "<br /><br /><br/>Thanks, <br/> KindleSpur Team";
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
            body += "<br /><br /><br/>Thanks, <br/> KindleSpur Team";
            message.Body = body;
            message.IsBodyHtml = true;
            SmtpClient smtp = new SmtpClient(smtpServer.ToString(), portNumber);
            smtp.Credentials = new System.Net.NetworkCredential(emailAddress.ToString(), password.ToString());
            smtp.EnableSsl = true;
            smtp.Send(message);
        }

        public static void MentoringCoachingInviteEmail(Conversation _obj, List<KeyValuePair<string, string>> listofSenderAndReceiverDetails)
        {
            MailMessage message = new MailMessage(aliasemailsendername.ToString(), _obj.ReceiverEmail);
            string receiverName = string.Empty;
            string senderFirstName = string.Empty;
            string senderLastName = string.Empty;
            string uri = string.Empty;
            string role = string.Empty;
            foreach (KeyValuePair<string, string> pair in listofSenderAndReceiverDetails)
            {
                switch (pair.Key.ToString())
                {
                    case "SenderFirstName":
                        senderFirstName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(pair.Value);
                        break;
                    case "SenderLastName":
                        senderLastName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(pair.Value);
                        break;
                    case "ReceiverName":
                        receiverName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(pair.Value);
                        break;
                    case "Uri":
                        uri = pair.Value;
                        break;
                    case "Role":
                        role = pair.Value;
                        break;
                }
            }
            
            string body = "Hello " + receiverName + ",";
            body += "<br/>";
            if (role == "Coachee")
            {
                body += "<br/>I am looking for Coaching on Skill - '" + _obj.skill + "'.<br/><br/>";
                body += "Would you like to be my Coach?";
                message.Subject = "Coaching Invite from " + senderFirstName.ToString() + " " + senderLastName.ToString();
            }

            else if (role == "Mentee")
            {
                body += "<br/>I am looking for Mentoring on Topic - '" + _obj.skill + "'.<br/><br/>";
                body += "Would you like to be my Mentor?";
                message.Subject = "Mentoring Invite from " + senderFirstName.ToString() + " " + senderLastName.ToString();
            }

            body += "<br /><br /><br/>Thanks, <br/>";
            body += senderFirstName + " " + senderLastName;
            message.Body = body;
            message.IsBodyHtml = true;

            SmtpClient smtp = new SmtpClient(smtpServer.ToString(), portNumber);
            smtp.Credentials = new System.Net.NetworkCredential(emailAddress.ToString(), password.ToString());
            smtp.EnableSsl = true;
            smtp.Send(message);

        }

        public static void MentoringCoachingAcceptDeclineEmail(Conversation _obj, List<KeyValuePair<string, string>> listofSenderAndReceiverDetails)
        {
            MailMessage message = new MailMessage(aliasemailsendername.ToString(), _obj.ReceiverEmail);
            string receiverName = string.Empty;
            string senderFirstName = string.Empty;
            string senderLastName = string.Empty;
            string uri = string.Empty;
            string role = string.Empty;
            foreach (KeyValuePair<string, string> pair in listofSenderAndReceiverDetails)
            {
                switch (pair.Key.ToString())
                {
                    case "SenderFirstName":
                        senderFirstName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(pair.Value);
                        break;
                    case "SenderLastName":
                        senderLastName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(pair.Value);
                        break;
                    case "ReceiverName":
                        receiverName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(pair.Value);
                        break;
                    case "Uri":
                        uri = pair.Value;
                        break;
                    case "Role":
                        role = pair.Value;
                        break;
                }
            }

            string body = "Hello " + receiverName + ",";
         
            
            if (role == "Coaching")
            {
                if (_obj.IsVerified == true)
                {
                    message.Subject = "Glad to start Coaching you on Skill - " + _obj.skill;
                    body += "<br /><br />You can start communicating with me via KindleSpur platform - " + "<a href = " + link + "> " + link + ".</a>";
                    body += "<br /><br /><br/>Thanks, <br/>";
                    body += senderFirstName + " " + senderLastName;
                }
                else if (_obj.IsVerified == false)
                {
                    message.Subject = "Coaching invite is declined by " + senderFirstName + " on Skill - " + _obj.skill;
                    body += "<br /><br />Sorry, to hear this.";
                    body += "<br /><br />You can search for other Coaches on KindleSpur platfrom - " + "<a href = " + link + "> " + link + ".</a>";
                    body += "<br /><br /><br/>Thanks, <br/> KindleSpur Team";
                }
            }
            if (role == "Mentoring")
            {
                if (_obj.IsVerified == true)
                {
                    message.Subject = "Glad to start Mentoring you on Topic - " + _obj.skill;
                    body += "<br /><br />You can start communicating with me via KindleSpur platform - " + "<a href = " + link + "> " + link + ".</a>";
                    body += "<br /><br /><br/>Thanks, <br/>";
                    body += senderFirstName + " " + senderLastName;
                }
                else if (_obj.IsVerified == false)
                {
                    message.Subject = "Mentoring invite is declined by " + senderFirstName + " on Topic - " + _obj.skill;
                    body += "<br /><br />Sorry, to hear this.";
                    body += "<br /><br />You can search for other Mentors on KindleSpur platform - " + "<a href = " + link + "> " + link + ".</a>";
                    body += "<br /><br /><br/>Thanks, <br/> KindleSpur Team";
                }
            }
            
          
            message.Body = body;
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

        public static void SendMeetingEmail(Meeting _obj, string uri, string subject, string content)
        {
            MailMessage message = new MailMessage(aliasemailsendername.ToString(), _obj.To);
            message.Subject = subject;
            message.Body = content;
            message.IsBodyHtml = true;
            SmtpClient smtp = new SmtpClient(smtpServer.ToString(), portNumber);
            smtp.Credentials = new System.Net.NetworkCredential(emailAddress.ToString(), password.ToString());
            smtp.EnableSsl = true;
            smtp.Send(message);
        }


        public static void SendEmailOnInvitation(User userDetails, Invitation invitation, string uri)
        {
            foreach (var inviteEmailAddress in invitation.Invites)
            {
                MailMessage message = new MailMessage(aliasemailsendername.ToString(), inviteEmailAddress);
                message.Subject = "Your friend " + userDetails.FirstName + " has invited You to Grow Knowledge @KindleSpur";
                string firstName = "Friend";
                string body = "Dear " + firstName + ",";
                body += "<br/>";
                body += "<br/><br/><a style='background:#808080; color:#fafafa; padding:10px 100px 10px 100px; width:350px; text-decoration:none;  text-transform: capitalize; font-weight:bold; font-size:13px;' href = '" + uri + "'> " + invitation.Description + " </a>";
                body += "<br /><br/>Thanks, <br/> KindleSpur Team, On Behalf of " + userDetails.FirstName + " " + userDetails.LastName;
                message.Body = body;
                message.IsBodyHtml = true;
                SmtpClient smtp = new SmtpClient(smtpServer.ToString(), portNumber);
                smtp.Credentials = new System.Net.NetworkCredential(emailAddress.ToString(), password.ToString());
                smtp.EnableSsl = true;
                smtp.Send(message);
            }
        }

    }
}