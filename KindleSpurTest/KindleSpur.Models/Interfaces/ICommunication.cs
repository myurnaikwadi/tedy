using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces
{
   public interface ICommunication
    {
        string RequestFrom { get; set; }
        string RequestTo { get; set; }
        string Status { get; set; }
        List<IChat> Chats { get; set; }
        List<IMeeting> Meetings { get; set; }
        List<IDocument> Documents { get; set; }
        DateTime CreateDate { get; set; }
        DateTime UpdateDate { get; set; }
        DateTime EndDate { get; set; }
    }

    public interface IChat
    {
        string SessionName { get; set; }
        DateTime StartDate { get; set; }
        string Message { get; set; }
        string Sender { get; set; }
        DateTime Date { get; set; } 
        Boolean ReadStatus { get; set; }
        String Progress { get; set; }
    }

    public interface IMeeting
    {
        string Subject { get; set; }
        List<string> Topics { get; set; }
        DateTime StartDate { get; set; }
        String TimeSlot { get; set; }
        DateTime EndDate { get; set; }
        String Status { get; set; }
        IFeedback Feedbacks { get; set; }
    }

    public interface IDocument
    {
        string Name { get; set; }
        string Type { get; set; }
        string Size { get; set; }
        string Location { get; set; }
    }
}
