using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PetroConnect.Auth.Models
{
    public class AuthModel
    {
        public string isAdmin;

        public string FullName { get; set; }
        public int UserId { get; set; }
        public int Role { get; set; }
        public string IsAdmin { get; set; }

        public string Token;
    }
}
