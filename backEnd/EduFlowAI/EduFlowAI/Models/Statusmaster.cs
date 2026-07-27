using System;
using System.Collections.Generic;

namespace EduFlowAI.Models;

public partial class Statusmaster
{
    public int Statusid { get; set; }

    public string Statusidentifier { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateTime Createdat { get; set; }

    public DateTime? Updateat { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public virtual User? CreatedbyNavigation { get; set; }

    public virtual ICollection<Goalmanagement> Goalmanagements { get; set; } = new List<Goalmanagement>();

    public virtual ICollection<Schedulemanagement> Schedulemanagements { get; set; } = new List<Schedulemanagement>();

    public virtual ICollection<Taskmanagement> Taskmanagements { get; set; } = new List<Taskmanagement>();

    public virtual User? UpdatedbyNavigation { get; set; }
}
