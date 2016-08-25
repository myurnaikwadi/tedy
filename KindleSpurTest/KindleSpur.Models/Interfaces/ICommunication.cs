using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces
{
   public interface ICommunication
    {
        string CommunicationId { get; set; }
        string From { get; set; }
        string To { get; set; }
        string Status { get; set; }
        string SkillName { get; set; }
        string TopicName { get; set; }
        List<IRequest> Requests { get; set; }
        List<IChat> Chats { get; set; }
        List<IMeeting> Meetings { get; set; }
        List<IDocument> Documents { get; set; }    
        string Type { get; set; }
    }

    public interface IRequest
    {
        string RequestId { get; set; }
        string Type { get; set; }   
        string Content { get; set; }

    }
 
    public interface IChat
    {
        string RequestId { get; set; }
        string ChatId { get; set; }
        string Role { get; set; }
        string Message { get; set; }
        string Sender { get; set; }
        Boolean ReadStatus { get; set; }
        String Progress { get; set; }
        DateTime StartDate { get; set; }
        DateTime CreateDate { get; set; }
        DateTime EndDate { get; set; }
    }

    public interface IMeeting
    {
        string MeetingId { get; set; }
        string From { get; set; }
        string To { get; set; }
        string SkillName { get; set; }
        string TopicName { get; set; }
        string Subject { get; set; }
        String Status { get; set; }
        DateTime StartDate { get; set; }
        String TimeSlot { get; set; }
        DateTime EndDate { get; set; }
        Boolean IsVerified { get; set; }
    }

    public interface IDocument
    {
        string Name { get; set; }
        string Type { get; set; }
        string Size { get; set; }
        string Location { get; set; }
    }
}
