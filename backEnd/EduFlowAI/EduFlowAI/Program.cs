using EduFlowAI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using HealthChecks.UI.Client;
using EduFlowAI.Extensions;
using EduFlowAI.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddOpenApiDocumentation();

builder.Services.AddDatabase(builder.Configuration);

builder.Services.AddCorsConfiguration();

builder.Services.AddJwtAuthentication(builder.Configuration, builder.Environment);

builder.Services.AddEmailServices(builder.Configuration);

builder.Services.RegisterApplicationServices();


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

  var app = builder.Build();

app.UseOpenApiDocumentation();

app.UseHttpsRedirection();

app.UseCorsConfiguration();

app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
