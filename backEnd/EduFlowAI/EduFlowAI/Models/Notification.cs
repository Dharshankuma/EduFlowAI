using System;
using System.Collections.Generic;

namespace EduFlowAI.Models;

public partial class Notification
{
    public int Notificationid { get; set; }

    public string Notificationidentifier { get; set; } = null!;

    public string Notification1 { get; set; } = null!;

    public DateTime Createdat { get; set; }

    public DateTime? Updateat { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public virtual User? CreatedbyNavigation { get; set; }

    public virtual User? UpdatedbyNavigation { get; set; }
}
