using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindleSpur.Models.Interfaces.Repository
{
    interface ICoachOrMentorRepository
    {
        bool AddNewCoachOrMentor(ICoachOrMentor Data);

        bool EditCoachOrMentor(int id, ICoachOrMentor Data);

        bool DeleteCoachOrMentor(int Id);

        List<ICoachOrMentor> GetAllCoachOrMentorDetails();

        ICoachOrMentor GetCoachOrMentorDetail(int Id);
    }
}
