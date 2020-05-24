using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PetroConnect.Data.Common;
using PetroConnect.Data.Context;
using Retro.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace Retrospective
{
    public interface IRetroService
    {
        int RetroAdd(RetroModel retro);
    }
    public class RetroService : IRetroService
    {
        private readonly PetroConnectContext _connectContext;
        public RetroService(PetroConnectContext connectContext)
        {
            _connectContext = connectContext;
        }
        public int RetroAdd(RetroModel retro)
        {
            try
            {
                var result = _connectContext.uspRetroAdd.FromSqlRaw("exec uspRetroAdd {0} , {1} , {2} , {3} , {4}, {5}, {6}",
                    retro.SprintId, 
                    retro.Message,
                    retro.CreatedBy,
                    retro.ColorCode,
                    retro.Type,
                    retro.VoteDown,
                    retro.VoteUp
                    ).ToList();
                return result.FirstOrDefault().Result;
            }
            catch (Exception ex)
            {
                return 0;            
            }
        }
    }
}
