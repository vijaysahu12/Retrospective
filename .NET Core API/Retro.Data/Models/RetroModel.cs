using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Retro.SignalR.Modals
{
  public class RetroModel
  {
    public int RetroCommentId { get; set; }
    public int SprintId { get; set; }
    public int VoteUp { get; set; }
    public int VoteDown { get; set; }
    public bool Editable { get; set; }
    public string Message { get; set; }
    public RetroType Type { get; set; }
    public string ColorCode { get; set; }
    public int CreatedBy { get; set; }
    public string actionToTaken { get; set; }
  }

  public enum RetroType
  {
    well,
    wrong,
    action
  }
}