using Microsoft.EntityFrameworkCore;
using PetroConnect.Auth.Models;
using PetroConnect.Data.Context;
using System;
using System.Linq;
using System.Text;

namespace PetroConnect.Data.Services
{
    public class UserDetails
    {
        public AuthModel GetUserDetails(string userName, string password)
        {
            try
            {
                //using (var db = new PetroConnectContext())
                //{
                //    var obj = db.Users
                //        .Where(x => x.UserName == userName && x.Password == password).Select(res => new AuthModel
                //        {
                //            FullName = res.FullName,
                //            UserId = res.UserId,
                //            Role = res.RoleId
                //        }).FirstOrDefault();

                //    obj.isAdmin = db.UserRoles.Where(item => item.RoleId == obj.Role && item.RoleDesc == "Admin").Any() ? "True" : "False";

                //    this.GetDatausingProcedure();
                //    return obj;

                //}

                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public bool GetDatausingProcedure()
        {
            //using (var db = new PetroConnectContext())
            //{
            //    var res = db.TestData.FromSqlRaw("exec uspGetEmployee ").ToList();
            //}

            return true;

        }
    }
}
