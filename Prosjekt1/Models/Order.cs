using System;
using System.ComponentModel.DataAnnotations;

namespace PizzaBestilling.Models
{
    public class Order
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string PizzaType { get; set; }
        [Required]
        public string PizzaStyle { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
    }
}