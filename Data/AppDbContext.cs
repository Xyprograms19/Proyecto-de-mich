using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Models;

namespace ExtraHours.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<ExtraHour> ExtraHours { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<ExtraHour>()
                .HasOne(eh => eh.User)
                .WithMany(u => u.RegisteredExtraHours)
                .HasForeignKey(eh => eh.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ExtraHour>()
                .HasOne(eh => eh.ApprovedBy)
                .WithMany(u => u.ApprovedExtraHours)
                .HasForeignKey(eh => eh.ApprovedById)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // modelBuilder.Entity<ExtraHour>().Property(eh => eh.TotalHours).HasColumnType("decimal(5,2)");

            base.OnModelCreating(modelBuilder);
        }
    }
}
