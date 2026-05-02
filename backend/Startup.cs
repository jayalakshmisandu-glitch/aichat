using System.IO;
using System.Linq;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var frontendUrl = Configuration["FrontendUrl"];
            var frontendUrls = Configuration["FrontendUrls"];

            services.AddControllers();
            services.AddSingleton<UserStore>();
            services.AddHttpClient<GeminiService>();
            services.AddDataProtection()
                .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(Directory.GetCurrentDirectory(), "DataProtectionKeys")));

            services.AddCors(options =>
            {
                options.AddPolicy("Frontend", builder =>
                {
                    var configuredOrigins = new[] { frontendUrl }
                        .Concat((frontendUrls ?? string.Empty).Split(';'))
                        .Where(origin => !string.IsNullOrWhiteSpace(origin))
                        .Select(origin => origin.Trim().TrimEnd('/'));

                    var origins = configuredOrigins
                        .Concat(new[]
                        {
                            "http://localhost:5173",
                            "http://localhost:5174",
                            "http://localhost:5175"
                        })
                        .Distinct()
                        .ToArray();

                    builder
                        .WithOrigins(origins)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.Cookie.Name = "ai_chat_auth";
                    options.Cookie.HttpOnly = true;
                    options.Cookie.SameSite = string.IsNullOrWhiteSpace(frontendUrl)
                        ? Microsoft.AspNetCore.Http.SameSiteMode.Lax
                        : Microsoft.AspNetCore.Http.SameSiteMode.None;
                    options.Cookie.SecurePolicy = string.IsNullOrWhiteSpace(frontendUrl)
                        ? Microsoft.AspNetCore.Http.CookieSecurePolicy.None
                        : Microsoft.AspNetCore.Http.CookieSecurePolicy.Always;
                    options.LoginPath = "/api/auth/login";
                    options.Events.OnRedirectToLogin = context =>
                    {
                        context.Response.StatusCode = 401;
                        return System.Threading.Tasks.Task.CompletedTask;
                    };
                });

            services.AddAuthorization();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseCors("Frontend");
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
