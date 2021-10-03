using System.ComponentModel.DataAnnotations;

namespace Cruisaholic.Models
{
    public class CustomerOrder 
    {
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
        public string ArrivalDate { get; set; }

        // CREDITCARD
        [RegularExpression(@"^[0-9]{16}$")]
        public long CardNumber { get; set; }

        [RegularExpression(@"^[a-zA-ZæøåÆØÅ. \-]{2,100}$")]
        public string CardholderName { get; set; }

        [RegularExpression(@"^[0-9]{3}$")]
        public int CVC { get; set; }

        [RegularExpression(@"^[0-9 \/]{5}$")]
        public string Expiry { get; set; }

        // CUSTOMER
        [Required]
        [RegularExpression(@"^[A-Za-zæøåÆØÅ0-9_\-,\. ]+@[a-zA-Z0-9]+\.[a-zA-Z]+$")]
        public string Email { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-ZæøåÆØÅ. \-]{2,20}$")]
        public string FirstName { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-ZæøåÆØÅ. \-]{2,20}$")]
        public string LastName { get; set; }

        [Required]
        [RegularExpression(@"^(?:\+[0-9]{10}|[0-9]{8})$")]
        public string PhoneNumber { get; set; }

        // ROUTE
        [Required]
        [RegularExpression(@"^[a-zA-ZæøåÆØÅ. \-,]{2,40}$")]
        public string FromDestination { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-ZæøåÆØÅ. \-,]{2,40}$")]
        public string ToDestination { get; set; }
    }
}
