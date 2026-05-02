using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet("/")]
        public IActionResult Root()
        {
            return Ok(new
            {
                message = "AI Chat backend is running",
                apiBaseUrl = "http://localhost:5146/api",
                endpoints = new[]
                {
                    "/api/auth/signup",
                    "/api/auth/login",
                    "/api/auth/me",
                    "/api/auth/logout",
                    "/api/chat/send"
                }
            });
        }

        [HttpGet("/api/health")]
        public IActionResult Health()
        {
            return Ok(new { status = "ok" });
        }
    }
}
