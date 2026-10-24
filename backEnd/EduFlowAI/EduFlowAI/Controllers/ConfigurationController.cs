using EduFlowAI.Services.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduFlowAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ConfigurationController : BaseController
    {
        private readonly IConfigurationService _service;

        public ConfigurationController(IConfigurationService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("Getconfiguration")]
        public async Task<IActionResult> GetConfiguration(CancellationToken cancellation)
        {
            var config = await _service.GetConfigurationDetails(cancellation);
            return Success(config.ConfigurationDetails, "Configuration retrieved successfully");
        }
    }
}
