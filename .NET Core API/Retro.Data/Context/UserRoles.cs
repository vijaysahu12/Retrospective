using System;
using System.Collections.Generic;

namespace PetroConnect.Data.Context
{
    public partial class UserRoles
    {
        public UserRoles()
        {
            Users = new HashSet<Users>();
        }

        public int RoleId { get; set; }
        public string RoleDesc { get; set; }

        public virtual ICollection<Users> Users { get; set; }
    }
}
