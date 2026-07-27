using System;
using System.Collections.Generic;

namespace EduFlowAI.Models;

public partial class User
{
    public int Userid { get; set; }

    public string Useridentifier { get; set; } = null!;

    public string? Username { get; set; }

    public string Emailid { get; set; } = null!;

    public string? Passwordhash { get; set; }

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public string? Profilepicturepath { get; set; }

    public string? Usertimezone { get; set; }

    public DateTime Createdat { get; set; }

    public DateTime? Updatedat { get; set; }

    public bool Isactive { get; set; }

    public string? Passwordresettoken { get; set; }

    public DateTime? Passwordresettokenexpiry { get; set; }

    public string? Autuhprovider { get; set; }

    public bool? Emailverified { get; set; }

    public DateTime? Lastloginat { get; set; }

    public string? Googleid { get; set; }

    public virtual ICollection<Emailverification> Emailverifications { get; set; } = new List<Emailverification>();

    public virtual ICollection<Goalmanagement> GoalmanagementCreatedbyNavigations { get; set; } = new List<Goalmanagement>();

    public virtual ICollection<Goalmanagement> GoalmanagementUpdatedbyNavigations { get; set; } = new List<Goalmanagement>();

    public virtual ICollection<Goaltypemaster> GoaltypemasterCreatedbyNavigations { get; set; } = new List<Goaltypemaster>();

    public virtual ICollection<Goaltypemaster> GoaltypemasterUpdatedbyNavigations { get; set; } = new List<Goaltypemaster>();

    public virtual ICollection<Notification> NotificationCreatedbyNavigations { get; set; } = new List<Notification>();

    public virtual ICollection<Notification> NotificationUpdatedbyNavigations { get; set; } = new List<Notification>();

    public virtual ICollection<Prioritymaster> PrioritymasterCreatedbyNavigations { get; set; } = new List<Prioritymaster>();

    public virtual ICollection<Prioritymaster> PrioritymasterUpdatedbyNavigations { get; set; } = new List<Prioritymaster>();

    public virtual ICollection<Refreshtoken> Refreshtokens { get; set; } = new List<Refreshtoken>();

    public virtual ICollection<Schedulemanagement> SchedulemanagementCreatedbyNavigations { get; set; } = new List<Schedulemanagement>();

    public virtual ICollection<Schedulemanagement> SchedulemanagementUpdatedbyNavigations { get; set; } = new List<Schedulemanagement>();

    public virtual ICollection<Statusmaster> StatusmasterCreatedbyNavigations { get; set; } = new List<Statusmaster>();

    public virtual ICollection<Statusmaster> StatusmasterUpdatedbyNavigations { get; set; } = new List<Statusmaster>();

    public virtual ICollection<Taskmanagement> TaskmanagementCreatedbyNavigations { get; set; } = new List<Taskmanagement>();

    public virtual ICollection<Taskmanagement> TaskmanagementUpdatedbyNavigations { get; set; } = new List<Taskmanagement>();

    public virtual ICollection<Useravailability> UseravailabilityCreatedbyNavigations { get; set; } = new List<Useravailability>();

    public virtual ICollection<Useravailability> UseravailabilityUpdatedbyNavigations { get; set; } = new List<Useravailability>();

    public virtual ICollection<Useravailability> UseravailabilityUsers { get; set; } = new List<Useravailability>();
}
