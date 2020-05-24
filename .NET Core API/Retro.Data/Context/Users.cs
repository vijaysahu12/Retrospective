using System;
using System.Collections.Generic;

namespace PetroConnect.Data.Context
{
    public partial class Users
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Gender { get; set; }
        public bool IsActive { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }

        public virtual UserRoles Role { get; set; }
    }
}
