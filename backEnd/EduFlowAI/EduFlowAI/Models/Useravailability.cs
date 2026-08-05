using System;
using System.Collections.Generic;

namespace EduFlowAI.Models;

public partial class Useravailability
{
    public int Availabilityid { get; set; }

    public int Userid { get; set; }

    public decimal Availablehours { get; set; }

    public DateTime Createdat { get; set; }

    public DateTime? Updatedat { get; set; }

    public bool Isenable { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public int DayOfWeek { get; set; }

    public virtual User? CreatedbyNavigation { get; set; }

    public virtual User? UpdatedbyNavigation { get; set; }

    public virtual User User { get; set; } = null!;
}
