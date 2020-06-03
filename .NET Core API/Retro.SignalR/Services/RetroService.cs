using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PetroConnect.Data.Common;
using PetroConnect.Data.Context;
using Retro.SignalR.Hubs;
using Retro.SignalR.Modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace Retrospective
{
  public interface IRetroService
  {
    int CommentsAddOrUpdateOrDelete(RetroModel retro);
    List<RetroModel> RetroGet(string RetroToken);
    bool RetroAdd(RetroSprintModal retro);
  }
  public class RetroService : IRetroService
  {
    private readonly PetroConnectContext _connectContext;
    public RetroService(PetroConnectContext connectContext)
    {
      _connectContext = connectContext;
    }
    public int CommentsAddOrUpdateOrDelete(RetroModel retro)
    {
      try
      {
        var result = _connectContext.uspRetroAddorUPpdate.FromSqlRaw("exec uspRetroAddorUPpdate {0} , {1} , {2} , {3} , {4}, {5}, {6} , {7} , {8} , {9}",
            retro.CommentId,

            retro.SprintId,
            retro.token,
            retro.Message,
            retro.CreatedBy,
            retro.ColorCode,
            retro.Type,
            retro.VoteDown,
            retro.VoteUp,
            retro.action
            ).ToList();
        return result.FirstOrDefault().Result;
      }
      catch (Exception ex)
      {
        return 0;
      }
    }

    public List<RetroModel> RetroGet(string RetroToken)
    {
      try
      {
        var result = _connectContext.uspRetroGet
          .FromSqlRaw("exec uspRetroGet {0} ", RetroToken)
          .ToList().AsEnumerable();
        return result.Select(x => new RetroModel
        {
          CommentId = x.CommentId,
          token = x.token,
          SprintId = x.SprintId,
          Message = x.Message,
          ColorCode = x.ColorCode,
          CreatedBy = x.CreatedBy,
          Editable = x.Editable,
          Type = x.Type,
          VoteDown = x.VoteDown,
          VoteUp = x.VoteUp
        }).ToList();
      }
      catch (Exception ex)
      {
        return new List<RetroModel>();
      }
    }

    public bool RetroAdd(RetroSprintModal retro)
    {
      try
      {
        var result = _connectContext.uspRetroAddorUPpdate.FromSqlRaw("exec uspRetroAdd {0} , {1} , {2} ",
            retro.ProjectName,
            retro.SprintToken,
            1
            ).ToList();
        return result != null && result.FirstOrDefault().Result <=2;
      }
      catch (Exception ex)
      {
        return false;
      }
    }

  }
}
