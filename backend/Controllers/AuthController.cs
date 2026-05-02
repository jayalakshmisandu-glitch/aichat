using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserStore _users;

        public AuthController(UserStore users)
        {
            _users = users;
        }

        [HttpPost("signup")]
        public IActionResult Signup(AuthRequest request)
        {
            if (!IsValid(request))
            {
                return BadRequest("Enter a valid email and a password with at least 6 characters.");
            }

            if (!_users.TryCreate(request.Email!, request.Password!))
            {
                return Conflict("User already exists.");
            }

            return Ok(new { message = "Account created" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(AuthRequest request)
        {
            if (!IsValid(request) || !_users.Validate(request.Email!, request.Password!))
            {
                return Unauthorized("Invalid credentials.");
            }

            var email = request.Email!.Trim().ToLowerInvariant();
            var claims = new List<Claim> { new Claim(ClaimTypes.Name, email) };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity));

            return Ok(new { message = "Logged in", email });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            return Ok(new { email = User.Identity?.Name });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { message = "Logged out" });
        }

        private static bool IsValid(AuthRequest request)
        {
            return !string.IsNullOrWhiteSpace(request.Email)
                && request.Email.Contains("@")
                && !string.IsNullOrWhiteSpace(request.Password)
                && request.Password.Length >= 6;
        }
    }
}
