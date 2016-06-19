using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces.Repository
{
   public interface ICoachOrMentorRepository
    {
        bool AddNewCoachOrMentor(ICoachOrMentor Data);

        bool EditCoachOrMentor(string UserId, ICoachOrMentor Data);

        bool DeleteCoachOrMentor(string Id);

        List<ICoachOrMentor> GetAllCoachOrMentorDetails();

        ICoachOrMentor GetCoachOrMentorDetail(string Id);
    }
}
