using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Models;

namespace ExtraHours.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ExtraHour> ExtraHours { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<ExtraHourRequest> ExtraHourRequests { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ExtraHour>()
                .HasOne(eh => eh.User)
                .WithMany(u => u.RegisteredExtraHours)
                .HasForeignKey(eh => eh.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ExtraHour>()
                .HasOne(eh => eh.ApprovedRejectedByUser)
                .WithMany(u => u.ApprovedExtraHours)
                .HasForeignKey(eh => eh.ApprovedRejectedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Department>()
                .Property(d => d.Name)
                .IsRequired();

            modelBuilder.Entity<Department>()
                .Property(d => d.Status)
                .IsRequired();
        }
    }
}
