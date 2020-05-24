using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PetroConnect.Data.Context;
using Retro.SignalR.Hubs;
using Retrospective;

namespace ChatSample
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(name: "AuthCorsPolicy",
                builder =>
                {
                    builder.WithOrigins("localhost", "localhost:4200", "http://localhost:4200").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                });
            });

            services.AddDbContext<PetroConnectContext>(
           op => op.UseSqlServer(Configuration.GetConnectionString("dbContext")));

            services.AddTransient<IRetroService, RetroService>();
            services.AddSignalR(options =>
            {
                options.EnableDetailedErrors = true;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseFileServer();
            app.UseRouting();
            // global cors policy 
            app.UseCors("AuthCorsPolicy");
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<ChatHub>("/chat");
            });
        }
    }
}
