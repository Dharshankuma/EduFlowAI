using System;
using System.Collections.Generic;

namespace EduFlowAI.Models;

public partial class Schedulemanagement
{
    public int Scheduleid { get; set; }

    public string Scheduleidentifier { get; set; } = null!;

    public int Taskid { get; set; }

    public int Goalid { get; set; }

    public DateTime Scheduleddate { get; set; }

    public decimal Plannedhours { get; set; }

    public int? Statusid { get; set; }

    public int Createdby { get; set; }

    public DateTime Createdat { get; set; }

    public int? Updatedby { get; set; }

    public DateTime? Updatedat { get; set; }

    public virtual User CreatedbyNavigation { get; set; } = null!;

    public virtual Goalmanagement Goal { get; set; } = null!;

    public virtual Statusmaster? Status { get; set; }

    public virtual Taskmanagement Task { get; set; } = null!;

    public virtual User? UpdatedbyNavigation { get; set; }
}
