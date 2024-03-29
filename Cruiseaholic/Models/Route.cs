﻿using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Cruiseaholic.Models
{
    [ExcludeFromCodeCoverage]
    public class Route
    {
        public int Id { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-ZæøåÆØÅ. \-,]{2,40}$")]
        public string FromDestination { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-ZæøåÆØÅ. \-,]{2,40}$")]
        public string ToDestination { get; set; }

        [Required]
        public int PriceChildren { get; set; }

        [Required]
        public int PriceAdults { get; set; }

        [Required]
        public int PriceVehicle { get; set; }
    }
}
