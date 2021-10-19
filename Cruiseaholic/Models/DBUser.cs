using System.Diagnostics.CodeAnalysis;

namespace Cruiseaholic.Models
{
    [ExcludeFromCodeCoverage]
    public class DBUser
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public byte[] Password { get; set; }
        public byte[] Salt { get; set; }
    }
}
