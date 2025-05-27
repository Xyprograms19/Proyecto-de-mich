
using System;
using System.ComponentModel.DataAnnotations;

namespace ExtraHours.API.DTOs
{
    public class ExtraHourRequestCreateDto
    {
        [Required]
        public DateTime DateOfExtraHours { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [Required]
        public int ExtraHourTypeId { get; set; }

        [Required]
        [StringLength(500, MinimumLength = 10)]
        public string Reason { get; set; }
    }
}