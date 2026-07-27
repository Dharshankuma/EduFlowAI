using System;
using System.Collections.Generic;

namespace EduFlowAI.Models;

public partial class Taskmanagement
{
    public int Taskid { get; set; }

    public string Taskidentifier { get; set; } = null!;

    public string Taskname { get; set; } = null!;

    public int Goalid { get; set; }

    public string? Taskdescription { get; set; }

    public DateTime Duedate { get; set; }

    public bool Isaigenerated { get; set; }

    public int? Statusid { get; set; }

    public int Createdby { get; set; }

    public int? Updatedby { get; set; }

    public DateTime Createdat { get; set; }

    public DateTime? Updatedat { get; set; }

    public virtual User CreatedbyNavigation { get; set; } = null!;

    public virtual Goalmanagement Goal { get; set; } = null!;

    public virtual ICollection<Schedulemanagement> Schedulemanagements { get; set; } = new List<Schedulemanagement>();

    public virtual Statusmaster? Status { get; set; }

    public virtual User? UpdatedbyNavigation { get; set; }
}
