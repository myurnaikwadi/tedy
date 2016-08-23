using System;

namespace KindleSpur.Data
{
    internal class StackTrace
    {
        private Exception e;
        private bool v;

        public StackTrace(Exception e, bool v)
        {
            this.e = e;
            this.v = v;
        }
    }
}