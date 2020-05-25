using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;
using Retro.SignalR.Modals;
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

    [EnableCors("AuthCorsPolicy")]
    public async Task Send(string name, string message)
    {
      // Call the broadcastMessage method to update clients.
      await Clients.All.SendAsync("broadcastMessage", name, message);
    }

    [EnableCors("AuthCorsPolicy")]
    public async Task NewMessage(string username, RetroModel message)
    {
      _retroService.RetroAddOrUpdateOrDelete(message);
      await Clients.All.SendAsync("messageReceived", username, message);
      
    }

  }
}
