using System;
using System.Collections.Generic;

namespace EduFlowAI.Models;

public partial class Goaltypemaster
{
    public int Goaltypeid { get; set; }

    public string Goaltypeidentifier { get; set; } = null!;

    public string Goaltype { get; set; } = null!;

    public DateTime? Createdat { get; set; }

    public DateTime? Updatedat { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public virtual User? CreatedbyNavigation { get; set; }

    public virtual ICollection<Goalmanagement> Goalmanagements { get; set; } = new List<Goalmanagement>();

    public virtual User? UpdatedbyNavigation { get; set; }
}
