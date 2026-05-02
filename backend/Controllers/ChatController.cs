using System;
using System.Threading;
using System.Threading.Tasks;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly GeminiService _gemini;

        public ChatController(GeminiService gemini)
        {
            _gemini = gemini;
        }

        [HttpPost("send")]
        public async Task<IActionResult> Send(ChatRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("Message is required.");
            }

            try
            {
                var response = await _gemini.GenerateAsync(request.Message.Trim(), cancellationToken);
                return Ok(new { response });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(502, ex.Message);
            }
        }
    }
}
