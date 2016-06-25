
namespace KindleSpur.Models
{
    public class CTSFilter
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public FilterType Type { get; set; }
        public string ParentId { get; set; }
    }

    public enum FilterType
    {
        Category,
        Topic,
        Skill
    }
}
