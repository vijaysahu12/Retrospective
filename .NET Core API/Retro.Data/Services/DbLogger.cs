using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PetroConnect.Data.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PetroConnect.Data.Services
{
    public class DbLogger : ILogger
    {

        private string _categoryName;
        private Func<string, LogLevel, bool> _filter;
        private PetroConnectContext _context;
        private bool _selfException = false;

        public IDisposable BeginScope<TState>(TState state)
        {
            return null;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return (_filter == null || _filter(_categoryName, logLevel));
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {

            //using(var db = new PetroConnectContext())
            //{
            //    var res = db.TestData.FromSqlRaw("exec uspGetEmployee ").ToList();
            //}
        }
    }
}
