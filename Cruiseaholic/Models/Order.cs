using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Cruiseaholic.Models
{
    [ExcludeFromCodeCoverage]
    public class Order
    {
        public int Id { get; set; }

        // TRIP
        [Required]
        public int NumberOfAdults { get; set; }

        [Required]
        public int NumberOfChildren { get; set; }

        [Required]
        public int NumberOfVehicles { get; set; }

        [Required]
        public bool IsRoundtrip { get; set; }

        [Required]
        [RegularExpression(@"^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$")]
        public string DepartureDate { get; set; }

        [RegularExpression(@"^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$")]
        public string ReturnDate { get; set; }

        // CREDITCARD
        [RegularExpression(@"^[0-9]{16}$")]
        public long CardNumber { get; set; }

        [RegularExpression(@"^[a-zA-ZæøåÆØÅ. \-]{2,100}$")]
        public string CardholderName { get; set; }

        [RegularExpression(@"^[0-9]{3}$")]
        public int CVC { get; set; }

        [RegularExpression(@"^[0-9 \/]{5}$")]
        public string Expiry { get; set; }

        public virtual Customer Customer { get; set; }

        public virtual Route Route { get; set; }
    }
}