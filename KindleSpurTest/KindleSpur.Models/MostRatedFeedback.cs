﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KindleSpur.Models
{
    public class MostRatedFeedback
    {
        public string Rating { get; set; }
        public string SkillOrTopic { get; set; }
        public DateTime feedbackDate { get; set; }
        public string FeedbackGiver { get; set; }
    }
}
