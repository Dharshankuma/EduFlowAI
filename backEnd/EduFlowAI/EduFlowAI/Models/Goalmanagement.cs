using System;
using System.Collections.Generic;

namespace EduFlowAI.Models;

public partial class Goalmanagement
{
    public int Goalid { get; set; }

    public string Goalidentifier { get; set; } = null!;

    public string Goaltitle { get; set; } = null!;

    public string? Goaldescription { get; set; }

    public int Goaltypeid { get; set; }

    public DateTime Targetdate { get; set; }

    public int Prioritytypeid { get; set; }

    public int? Statusid { get; set; }

    public DateTime Createdat { get; set; }

    public int Createdby { get; set; }

    public DateTime? Updatedat { get; set; }

    public int? Updatedby { get; set; }

    public int Userid { get; set; }

    public virtual User CreatedbyNavigation { get; set; } = null!;

    public virtual Goaltypemaster Goaltype { get; set; } = null!;

    public virtual Prioritymaster Prioritytype { get; set; } = null!;

    public virtual ICollection<Schedulemanagement> Schedulemanagements { get; set; } = new List<Schedulemanagement>();

    public virtual Statusmaster? Status { get; set; }

    public virtual ICollection<Taskmanagement> Taskmanagements { get; set; } = new List<Taskmanagement>();

    public virtual User? UpdatedbyNavigation { get; set; }
}
