using System;
using System.Collections.Generic;

namespace EduFlowAI.Models;

public partial class Emailverification
{
    public int Emailtokenid { get; set; }

    public int Userid { get; set; }

    public string Token { get; set; } = null!;

    public DateTime Expiresat { get; set; }

    public bool? Isused { get; set; }

    public DateTime? Createdat { get; set; }

    public virtual User User { get; set; } = null!;
}
