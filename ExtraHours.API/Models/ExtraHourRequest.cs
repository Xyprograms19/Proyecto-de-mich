
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace ExtraHours.API.Models
{
    public class ExtraHourRequest
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }

        [Required]
        public DateTime DateOfExtraHours { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }


        // [Required]
        // public int ExtraHourTypeId { get; set; }



        [Required]
        [StringLength(500)]
        public string Reason { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }

        [StringLength(500)]
        public string AdminComments { get; set; }

        public DateTime RequestDate { get; set; }
        public DateTime? ApprovedRejectedAt { get; set; }

        public int? ApprovedRejectedByUserId { get; set; }
        [JsonIgnore]
        public User ApprovedRejectedByUser { get; set; }
    }
}