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
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }


        [StringLength(500)]
        public string? Description { get; set; }


        public ExtraHourStatus Status { get; set; } = ExtraHourStatus.Pending;

        public int? ApprovedById { get; set; }
        [ForeignKey("ApprovedById")]
        public User? ApprovedBy { get; set; }

        public DateTime? ApprovedAt { get; set; }

        [StringLength(500)]
        public string? RejectionReason { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;


        [NotMapped]
        public double TotalHours => (EndTime - StartTime).TotalHours;
    }
}