using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Cruisaholic.Models
{
    public class Customer
    {
        public int Id { get; set; }

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

        public virtual List<Order> Orders { get; set; }
    }
}
