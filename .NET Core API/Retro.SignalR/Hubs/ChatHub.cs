using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;
using Retrospective;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Retro.SignalR.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IRetroService _retroService;
        public ChatHub(IRetroService retroService)
        {
            _retroService = retroService;
        }
        public static List<RetroModel> RetroList = new List<RetroModel>();
        [EnableCors("AuthCorsPolicy")]
        public async Task Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            await Clients.All.SendAsync("broadcastMessage", name, message);
        }

        [EnableCors("AuthCorsPolicy")]
        public async Task NewMessage(string username, RetroModel message)
        {
            _retroService.RetroAdd(message);
            RetroList.Add(message);
            await Clients.All.SendAsync("messageReceived", username, message);
        }

    }

    public class RetroModel
    {
        public int RetroId { get; set; }
        public int SprintId { get; set; }
        public int VoteUp { get; set; }
        public int VoteDown { get; set; }
        public bool Editable { get; set; }
        public string Message { get; set; }
        public RetroType Type { get; set; }
        public string ColorCode { get; set; }
        public int CreatedBy { get; set; }
    }

    public enum RetroType
    {
        well,
        wrong,
        action
    }
}