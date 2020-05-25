using Microsoft.VisualBasic;
using Retro.SignalR.Modals;
using System;
using System.ComponentModel.DataAnnotations;

namespace PetroConnect.Data.Context
{
  public class uspRetroGet_Result
  {
    public int CommentId { get; set; }
    public string token { get; set; }
    public int SprintId { get; set; }
    public int VoteUp { get; set; }
    public int VoteDown { get; set; }
    public bool Editable { get; set; }
    public string Message { get; set; }
    public RetroType Type { get; set; }
    public string ColorCode { get; set; }
    public int CreatedBy { get; set; }
  }

  public class uspRetroAdd_Result
  {
    public int Result { get; set; }
  }
}
