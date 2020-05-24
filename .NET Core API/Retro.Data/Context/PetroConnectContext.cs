using System;
using System.ComponentModel.Design;
using System.Configuration;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace PetroConnect.Data.Context
{
    public partial class PetroConnectContext : DbContext
    {

        public PetroConnectContext()
        {
        }
        public PetroConnectContext(DbContextOptions<PetroConnectContext> options)
            : base(options)
        {
        }

        public virtual DbSet<uspRetroAdd_Result> uspRetroAdd { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<uspRetroAdd_Result>(entity =>
                       {
                           entity.HasNoKey();
                       });
            OnModelCreatingPartial(modelBuilder);
        }
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    if (!optionsBuilder.IsConfigured)
        //    {

        //        //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
        //        optionsBuilder.UseSqlServer(ConfigurationManager.ConnectionStrings[""].ConnectionString);
        //    }
        //}
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
