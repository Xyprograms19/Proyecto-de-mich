
using ExtraHours.API.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExtraHours.API.Models
{
    public class ExtraHour
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "date")]
        public DateTime Date { get; set; }

        [Required]
        [StringLength(5)]
        public string StartTime { get; set; } = string.Empty;

        [Required]
        [StringLength(5)]
        public string EndTime { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string TypeOfHour { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Project { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [StringLength(50)]
        public string Status { get; set; } = "Pendiente";

        [Column(TypeName = "decimal(5,2)")]
        public decimal TotalHours { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal ExtraHoursCount { get; set; }


        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }

        public int? ApprovedById { get; set; }
        [ForeignKey("ApprovedById")]
        public User? ApprovedBy { get; set; }


        public DateTime? ApprovedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}