using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
   public class Reward
    {
        public int TotalRewardPoints { get; set; }
        public int RedeemedPoints { get; set; }
        public int BalanceRewardPoints { get; set; }
        public int InviteRewardPoints { get; set; }
        public int CoachRewardPoints { get; set; }
        public int CoacheeRewardPoints { get; set; }
        public int MentorRewardPoints { get; set; }
        public int MenteeRewardPoints { get; set; }
        public List<ActiveGamesAndPSR> PSRAndGames { get; set; }
    }
}
