using System;
using System.Collections.Generic;
using EduFlowAI.Models;
using Microsoft.EntityFrameworkCore;

namespace EduFlowAI.Data;

public partial class EduFlowDbContext : DbContext
{
    public EduFlowDbContext()
    {
    }

    public EduFlowDbContext(DbContextOptions<EduFlowDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Emailverification> Emailverifications { get; set; }

    public virtual DbSet<Goalmanagement> Goalmanagements { get; set; }

    public virtual DbSet<Goaltypemaster> Goaltypemasters { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Prioritymaster> Prioritymasters { get; set; }

    public virtual DbSet<Refreshtoken> Refreshtokens { get; set; }

    public virtual DbSet<Schedulemanagement> Schedulemanagements { get; set; }

    public virtual DbSet<Statusmaster> Statusmasters { get; set; }

    public virtual DbSet<Taskmanagement> Taskmanagements { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Useravailability> Useravailabilities { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=LAPTOP-BVQG4NVS;Database=EduFlowAIDB;User Id=sa;Password=123456;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Emailverification>(entity =>
        {
            entity.HasKey(e => e.Emailtokenid).HasName("PK__EMAILVER__6F744182E23A0E57");

            entity.ToTable("EMAILVERIFICATIONS");

            entity.Property(e => e.Emailtokenid).HasColumnName("EMAILTOKENID");
            entity.Property(e => e.Createdat)
                .HasColumnType("datetime")
                .HasColumnName("CREATEDAT");
            entity.Property(e => e.Expiresat)
                .HasColumnType("datetime")
                .HasColumnName("EXPIRESAT");
            entity.Property(e => e.Isused).HasColumnName("ISUSED");
            entity.Property(e => e.Token)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("TOKEN");
            entity.Property(e => e.Userid).HasColumnName("USERID");

            entity.HasOne(d => d.User).WithMany(p => p.Emailverifications)
                .HasForeignKey(d => d.Userid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EMAILVERIFICATIONS_USERS");
        });

        modelBuilder.Entity<Goalmanagement>(entity =>
        {
            entity.HasKey(e => e.Goalid).HasName("PK__GOALMANA__5D992F195D2DAC18");

            entity.ToTable("GOALMANAGEMENT");

            entity.Property(e => e.Goalid).HasColumnName("GOALID");
            entity.Property(e => e.Createdat)
                .HasColumnType("datetime")
                .HasColumnName("CREATEDAT");
            entity.Property(e => e.Createdby).HasColumnName("CREATEDBY");
            entity.Property(e => e.Goaldescription)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("GOALDESCRIPTION");
            entity.Property(e => e.Goalidentifier)
                .HasMaxLength(32)
                .IsUnicode(false)
                .HasColumnName("GOALIDENTIFIER");
            entity.Property(e => e.Goaltitle)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("GOALTITLE");
            entity.Property(e => e.Goaltypeid).HasColumnName("GOALTYPEID");
            entity.Property(e => e.Prioritytypeid).HasColumnName("PRIORITYTYPEID");
            entity.Property(e => e.Statusid).HasColumnName("STATUSID");
            entity.Property(e => e.Targetdate)
                .HasColumnType("datetime")
                .HasColumnName("TARGETDATE");
            entity.Property(e => e.Updatedat)
                .HasColumnType("datetime")
                .HasColumnName("UPDATEDAT");
            entity.Property(e => e.Updatedby).HasColumnName("UPDATEDBY");
            entity.Property(e => e.Userid).HasColumnName("USERID");

            entity.HasOne(d => d.CreatedbyNavigation).WithMany(p => p.GoalmanagementCreatedbyNavigations)
                .HasForeignKey(d => d.Createdby)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Goaltype).WithMany(p => p.Goalmanagements)
                .HasForeignKey(d => d.Goaltypeid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GOALMANAGEMENT_GOALTYPEMASTER");

            entity.HasOne(d => d.Prioritytype).WithMany(p => p.Goalmanagements)
                .HasForeignKey(d => d.Prioritytypeid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GOALMANAGEMENT_PRIORITYMASTER");

            entity.HasOne(d => d.Status).WithMany(p => p.Goalmanagements)
                .HasForeignKey(d => d.Statusid)
                .HasConstraintName("FK_GOALMANAGEMENT_STATUSMASTER");

            entity.HasOne(d => d.UpdatedbyNavigation).WithMany(p => p.GoalmanagementUpdatedbyNavigations).HasForeignKey(d => d.Updatedby);
        });

        modelBuilder.Entity<Goaltypemaster>(entity =>
        {
            entity.HasKey(e => e.Goaltypeid).HasName("PK__GOALTYPE__4E7D35F1BF649BC1");

            entity.ToTable("GOALTYPEMASTER");

            entity.Property(e => e.Goaltypeid).HasColumnName("GOALTYPEID");
            entity.Property(e => e.Createdat)
                .HasColumnType("datetime")
                .HasColumnName("CREATEDAT");
            entity.Property(e => e.Createdby).HasColumnName("CREATEDBY");
            entity.Property(e => e.Goaltype)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("GOALTYPE");
            entity.Property(e => e.Goaltypeidentifier)
                .HasMaxLength(32)
                .IsUnicode(false)
                .HasColumnName("GOALTYPEIDENTIFIER");
            entity.Property(e => e.Updatedat)
                .HasColumnType("datetime")
                .HasColumnName("UPDATEDAT");
            entity.Property(e => e.Updatedby).HasColumnName("UPDATEDBY");

            entity.HasOne(d => d.CreatedbyNavigation).WithMany(p => p.GoaltypemasterCreatedbyNavigations).HasForeignKey(d => d.Createdby);

            entity.HasOne(d => d.UpdatedbyNavigation).WithMany(p => p.GoaltypemasterUpdatedbyNavigations).HasForeignKey(d => d.Updatedby);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Notificationid).HasName("PK__NOTIFICA__EAF93BF430D3BC1F");

            entity.ToTable("NOTIFICATIONS");

            entity.Property(e => e.Notificationid).HasColumnName("NOTIFICATIONID");
            entity.Property(e => e.Createdat)
                .HasColumnType("datetime")
                .HasColumnName("CREATEDAT");
            entity.Property(e => e.Createdby).HasColumnName("CREATEDBY");
            entity.Property(e => e.Notification1)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("NOTIFICATION");
            entity.Property(e => e.Notificationidentifier)
                .HasMaxLength(32)
                .IsUnicode(false)
                .HasColumnName("NOTIFICATIONIDENTIFIER");
            entity.Property(e => e.Updateat)
                .HasColumnType("datetime")
                .HasColumnName("UPDATEAT");
            entity.Property(e => e.Updatedby).HasColumnName("UPDATEDBY");

            entity.HasOne(d => d.CreatedbyNavigation).WithMany(p => p.NotificationCreatedbyNavigations).HasForeignKey(d => d.Createdby);

            entity.HasOne(d => d.UpdatedbyNavigation).WithMany(p => p.NotificationUpdatedbyNavigations).HasForeignKey(d => d.Updatedby);
        });

        modelBuilder.Entity<Prioritymaster>(entity =>
        {
            entity.HasKey(e => e.Priorityid).HasName("PK__PRIORITY__64B4B424E085ADE9");

            entity.ToTable("PRIORITYMASTER");

            entity.Property(e => e.Priorityid).HasColumnName("PRIORITYID");
            entity.Property(e => e.Createdat)
                .HasColumnType("datetime")
                .HasColumnName("CREATEDAT");
            entity.Property(e => e.Createdby).HasColumnName("CREATEDBY");
            entity.Property(e => e.Priority)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("PRIORITY");
            entity.Property(e => e.Priorityidentifier)
                .HasMaxLength(32)
                .IsUnicode(false)
                .HasColumnName("PRIORITYIDENTIFIER");
            entity.Property(e => e.Updatedat)
                .HasColumnType("datetime")
                .HasColumnName("UPDATEDAT");
            entity.Property(e => e.Updatedby).HasColumnName("UPDATEDBY");

            entity.HasOne(d => d.CreatedbyNavigation).WithMany(p => p.PrioritymasterCreatedbyNavigations).HasForeignKey(d => d.Createdby);

            entity.HasOne(d => d.UpdatedbyNavigation).WithMany(p => p.PrioritymasterUpdatedbyNavigations).HasForeignKey(d => d.Updatedby);
        });

        modelBuilder.Entity<Refreshtoken>(entity =>
        {
            entity.HasKey(e => e.Refreshtokenid).HasName("PK__REFRESHT__A105BD6327C0D283");

            entity.ToTable("REFRESHTOKENS");

            entity.Property(e => e.Refreshtokenid).HasColumnName("REFRESHTOKENID");
            entity.Property(e => e.Createdat)
                .HasColumnType("datetime")
                .HasColumnName("CREATEDAT");
            entity.Property(e => e.Isrevoked).HasColumnName("ISREVOKED");
            entity.Property(e => e.Refreshexpiry)
                .HasColumnType("datetime")
                .HasColumnName("REFRESHEXPIRY");
            entity.Property(e => e.Refreshtoken1)
                .HasMaxLength(32)
                .IsUnicode(false)
                .HasColumnName("REFRESHTOKEN");
            entity.Property(e => e.Userid).HasColumnName("USERID");

            entity.HasOne(d => d.User).WithMany(p => p.Refreshtokens)
                .HasForeignKey(d => d.Userid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_REFRESHTOKENS_USERS");
        });

        modelBuilder.Entity<Schedulemanagement>(entity =>
        {
            entity.HasKey(e => e.Scheduleid).HasName("PK__SCHEDULE__8999A48C5CF6E39E");

            entity.ToTable("SCHEDULEMANAGEMENT");

            entity.Property(e => e.Scheduleid).HasColumnName("SCHEDULEID");
            entity.Property(e => e.Createdat)
                .HasColumnType("datetime")
                .HasColumnName("CREATEDAT");
            entity.Property(e => e.Createdby).HasColumnName("CREATEDBY");
            entity.Property(e => e.Goalid).HasColumnName("GOALID");
            entity.Property(e => e.Plannedhours)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("PLANNEDHOURS");
            entity.Property(e => e.Scheduleddate)
                .HasColumnType("datetime")
                .HasColumnName("SCHEDULEDDATE");
            entity.Property(e => e.Scheduleidentifier)
                .HasMaxLength(32)
                .IsUnicode(false)
                .HasColumnName("SCHEDULEIDENTIFIER");
            entity.Property(e => e.Statusid).HasColumnName("STATUSID");
            entity.Property(e => e.Taskid).HasColumnName("TASKID");
            entity.Property(e => e.Updatedat)
                .HasColumnType("datetime")
                .HasColumnName("UPDATEDAT");
            entity.Property(e => e.Updatedby).HasColumnName("UPDATEDBY");

            entity.HasOne(d => d.CreatedbyNavigation).WithMany(p => p.SchedulemanagementCreatedbyNavigations)
                .HasForeignKey(d => d.Createdby)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Goal).WithMany(p => p.Schedulemanagements)
                .HasForeignKey(d => d.Goalid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SCHEDULEMANAGEMENT_GOALMANAGEMENT");

            entity.HasOne(d => d.Status).WithMany(p => p.Schedulemanagements)
                .HasForeignKey(d => d.Statusid)
                .HasConstraintName("FK_SCHEDULEMANAGEMENT_STATUSMASTER");

            entity.HasOne(d => d.Task).WithMany(p => p.Schedulemanagements)
                .HasForeignKey(d => d.Taskid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SCHEDULEMANAGEMENT_TASKMANAGEMENT");

            entity.HasOne(d => d.UpdatedbyNavigation).WithMany(p => p.SchedulemanagementUpdatedbyNavigations).HasForeignKey(d => d.Updatedby);
        });

        modelBuilder.Entity<Statusmaster>(entity =>
        {
            entity.HasKey(e => e.Statusid).HasName("PK__STATUSMA__D135272E6870B78D");

            entity.ToTable("STATUSMASTER");

            entity.Property(e => e.Statusid).HasColumnName("STATUSID");
            entity.Property(e => e.Createdat)
                .HasColumnType("datetime")
                .HasColumnName("CREATEDAT");
            entity.Property(e => e.Createdby).HasColumnName("CREATEDBY");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("STATUS");
            entity.Property(e => e.Statusidentifier)
                .HasMaxLength(32)
                .IsUnicode(false)
                .HasColumnName("STATUSIDENTIFIER");
            entity.Property(e => e.Updateat)
                .HasColumnType("datetime")
                .HasColumnName("UPDATEAT");
            entity.Property(e => e.Updatedby).HasColumnName("UPDATEDBY");

            entity.HasOne(d => d.CreatedbyNavigation).WithMany(p => p.StatusmasterCreatedbyNavigations).HasForeignKey(d => d.Createdby);

            entity.HasOne(d => d.UpdatedbyNavigation).WithMany(p => p.StatusmasterUpdatedbyNavigations).HasForeignKey(d => d.Updatedby);
        });

        modelBuilder.Entity<Taskmanagement>(entity =>
        {
            entity.HasKey(e => e.Taskid).HasName("PK__TASKMANA__27AB8576D0289F9D");

            entity.ToTable("TASKMANAGEMENT");

            entity.Property(e => e.Taskid).HasColumnName("TASKID");
            entity.Property(e => e.Createdat)
                .HasColumnType("datetime")
                .HasColumnName("CREATEDAT");
            entity.Property(e => e.Createdby).HasColumnName("CREATEDBY");
            entity.Property(e => e.Duedate)
                .HasColumnType("datetime")
                .HasColumnName("DUEDATE");
            entity.Property(e => e.Goalid).HasColumnName("GOALID");
            entity.Property(e => e.Isaigenerated).HasColumnName("ISAIGENERATED");
            entity.Property(e => e.Statusid).HasColumnName("STATUSID");
            entity.Property(e => e.Taskdescription)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("TASKDESCRIPTION");
            entity.Property(e => e.Taskidentifier)
                .HasMaxLength(32)
                .IsUnicode(false)
                .HasColumnName("TASKIDENTIFIER");
            entity.Property(e => e.Taskname)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("TASKNAME");
            entity.Property(e => e.Updatedat)
                .HasColumnType("datetime")
                .HasColumnName("UPDATEDAT");
            entity.Property(e => e.Updatedby).HasColumnName("UPDATEDBY");

            entity.HasOne(d => d.CreatedbyNavigation).WithMany(p => p.TaskmanagementCreatedbyNavigations)
                .HasForeignKey(d => d.Createdby)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Goal).WithMany(p => p.Taskmanagements)
                .HasForeignKey(d => d.Goalid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TASKMANAGEMENT_GOALMANAGEMENT");

            entity.HasOne(d => d.Status).WithMany(p => p.Taskmanagements)
                .HasForeignKey(d => d.Statusid)
                .HasConstraintName("FK_TASKMANAGEMENT_STATUSMASTER");

            entity.HasOne(d => d.UpdatedbyNavigation).WithMany(p => p.TaskmanagementUpdatedbyNavigations).HasForeignKey(d => d.Updatedby);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Userid).HasName("PK__USERS__7B9E7F353F56FFDC");

            entity.ToTable("USERS");

            entity.Property(e => e.Userid).HasColumnName("USERID");
            entity.Property(e => e.Autuhprovider)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("AUTUHPROVIDER");
            entity.Property(e => e.Createdat)
                .HasColumnType("datetime")
                .HasColumnName("CREATEDAT");
            entity.Property(e => e.Emailid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("EMAILID");
            entity.Property(e => e.Emailverified).HasColumnName("EMAILVERIFIED");
            entity.Property(e => e.Firstname)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FIRSTNAME");
            entity.Property(e => e.Googleid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("GOOGLEID");
            entity.Property(e => e.Isactive)
                .HasDefaultValue(true)
                .HasColumnName("ISACTIVE");
            entity.Property(e => e.Lastloginat)
                .HasColumnType("datetime")
                .HasColumnName("LASTLOGINAT");
            entity.Property(e => e.Lastname)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("LASTNAME");
            entity.Property(e => e.Passwordhash)
                .HasMaxLength(256)
                .IsUnicode(false)
                .HasColumnName("PASSWORDHASH");
            entity.Property(e => e.Passwordresettoken)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("PASSWORDRESETTOKEN");
            entity.Property(e => e.Passwordresettokenexpiry)
                .HasColumnType("datetime")
                .HasColumnName("PASSWORDRESETTOKENEXPIRY");
            entity.Property(e => e.Profilepicturepath)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("PROFILEPICTUREPATH");
            entity.Property(e => e.Updatedat)
                .HasColumnType("datetime")
                .HasColumnName("UPDATEDAT");
            entity.Property(e => e.Useridentifier)
                .HasMaxLength(32)
                .IsUnicode(false)
                .HasColumnName("USERIDENTIFIER");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("USERNAME");
            entity.Property(e => e.Usertimezone)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("USERTIMEZONE");
        });

        modelBuilder.Entity<Useravailability>(entity =>
        {
            entity.HasKey(e => e.Availabilityid).HasName("PK__USERAVAI__5BF5FC1C78EDB522");

            entity.ToTable("USERAVAILABILITY");

            entity.Property(e => e.Availabilityid).HasColumnName("AVAILABILITYID");
            entity.Property(e => e.Availablehours)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("AVAILABLEHOURS");
            entity.Property(e => e.Createdat)
                .HasColumnType("datetime")
                .HasColumnName("CREATEDAT");
            entity.Property(e => e.Createdby).HasColumnName("CREATEDBY");
            entity.Property(e => e.Isenable)
                .HasDefaultValue(true)
                .HasColumnName("ISENABLE");
            entity.Property(e => e.Updatedat)
                .HasColumnType("datetime")
                .HasColumnName("UPDATEDAT");
            entity.Property(e => e.Updatedby).HasColumnName("UPDATEDBY");
            entity.Property(e => e.Userid).HasColumnName("USERID");

            entity.HasOne(d => d.CreatedbyNavigation).WithMany(p => p.UseravailabilityCreatedbyNavigations).HasForeignKey(d => d.Createdby);

            entity.HasOne(d => d.UpdatedbyNavigation).WithMany(p => p.UseravailabilityUpdatedbyNavigations).HasForeignKey(d => d.Updatedby);

            entity.HasOne(d => d.User).WithMany(p => p.UseravailabilityUsers)
                .HasForeignKey(d => d.Userid)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
