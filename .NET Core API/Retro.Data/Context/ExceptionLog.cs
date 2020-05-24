using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PetroConnect.Data.Context
{
    public partial class ExceptionLog
    {
        [Key]
        public int Id { get; set; }
        public string Message { get; set; }
        public string Level { get; set; }
    }
}
