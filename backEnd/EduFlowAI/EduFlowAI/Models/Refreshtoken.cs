using System;
using System.Collections.Generic;

namespace EduFlowAI.Models;

public partial class Refreshtoken
{
    public int Refreshtokenid { get; set; }

    public string Refreshtoken1 { get; set; } = null!;

    public DateTime? Refreshexpiry { get; set; }

    public bool? Isrevoked { get; set; }

    public int Userid { get; set; }

    public DateTime? Createdat { get; set; }

    public virtual User User { get; set; } = null!;
}
