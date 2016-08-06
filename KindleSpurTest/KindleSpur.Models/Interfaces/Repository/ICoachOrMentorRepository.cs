using MongoDB.Bson;
using System.Collections.Generic;

namespace KindleSpur.Models.Interfaces.Repository
{
   public interface ICoachOrMentorRepository
    {
        bool AddNewCoachOrMentor(ICoachOrMentor Data);

        bool EditCoachOrMentor(string UserId, ICoachOrMentor Data);

        bool DeleteCoachOrMentor(string Id);

        List<ICoachOrMentor> GetAllCoachOrMentorDetails();

        ICoachOrMentor GetCoachOrMentorDetail(string Id);

        List<SearchCoachOrMentor> GetAllCoachOrMentors(CTSFilter ctsFilter, string Role);
    }
}
