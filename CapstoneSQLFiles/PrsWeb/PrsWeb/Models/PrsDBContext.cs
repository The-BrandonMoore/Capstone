using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace PrsWeb.Models;

public partial class PrsDBContext : DbContext
{
    //public PrsDBContext()
    //{
    //}

    public PrsDBContext(DbContextOptions<PrsDBContext> options)
        : base(options)
    {
    }

    public virtual DbSet<LineItem> LineItems { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Request> Requests { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vendor> Vendors { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//        => optionsBuilder.UseSqlServer("Server=DESKTOP-VDMQ3OL\\SQLEXPRESS;Database=prsdb;Integrated Security=True;TrustServerCertificate=True;");

//    protected override void OnModelCreating(ModelBuilder modelBuilder)
//    {
//        modelBuilder.Entity<LineItem>(entity =>
//        {
//            entity.HasKey(e => e.Id).HasName("PK__LineItem__3214EC07FE18356F");

//            entity.HasOne(d => d.Product).WithMany(p => p.LineItems)
//                .OnDelete(DeleteBehavior.ClientSetNull)
//                .HasConstraintName("FK__LineItem__Produc__4CA06362");

//            entity.HasOne(d => d.Request).WithMany(p => p.LineItems)
//                .OnDelete(DeleteBehavior.ClientSetNull)
//                .HasConstraintName("FK__LineItem__Reques__4BAC3F29");
//        });

//        modelBuilder.Entity<Product>(entity =>
//        {
//            entity.HasKey(e => e.Id).HasName("PK__Product__3214EC0796E77CE0");

//            entity.HasOne(d => d.Vendor).WithMany(p => p.Products)
//                .OnDelete(DeleteBehavior.ClientSetNull)
//                .HasConstraintName("FK__Product__VendorI__4222D4EF");
//        });

//        modelBuilder.Entity<Request>(entity =>
//        {
//            entity.HasKey(e => e.Id).HasName("PK__Request__3214EC07694309FA");

//            entity.Property(e => e.Status).HasDefaultValue("New");
//            entity.Property(e => e.SubmittedDate).HasDefaultValueSql("(getdate())");

//            entity.HasOne(d => d.User).WithMany(p => p.Requests)
//                .OnDelete(DeleteBehavior.ClientSetNull)
//                .HasConstraintName("FK__Request__UserId__47DBAE45");
//        });

//        modelBuilder.Entity<User>(entity =>
//        {
//            entity.HasKey(e => e.Id).HasName("PK__User__3214EC072F3C110E");
//        });

//        modelBuilder.Entity<Vendor>(entity =>
//        {
//            entity.HasKey(e => e.Id).HasName("PK__Vendor__3214EC073661F779");

//            entity.Property(e => e.State).IsFixedLength();
//            entity.Property(e => e.Zip).IsFixedLength();
//        });

//        OnModelCreatingPartial(modelBuilder);
//    }

//    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
