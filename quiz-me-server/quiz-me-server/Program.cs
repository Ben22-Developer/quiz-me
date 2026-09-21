using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using quiz_me_server.code.constant;
using quiz_me_server.code.controller.auth;
using quiz_me_server.code.controller.quiz;
using quiz_me_server.code.database;
using quiz_me_server.code.repository.contract;
using quiz_me_server.code.repository.implementation;
using quiz_me_server.code.service;
using quiz_me_server.code.service.auth;
using quiz_me_server.code.service.question_answer.quiz_mark;
using quiz_me_server.code.service.question_answer.quiz_request;
using quiz_me_server.code.service.user;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


builder.Services.AddSwaggerGen();

// Console.WriteLine(builder.Configuration["Google:client_secret"]);

builder.Services.AddCors(cors => cors.AddPolicy("cors", build =>
{
    build
        .WithOrigins(builder.Configuration["AllowedCorsOrigin"])
        .AllowAnyHeader()
        .AllowCredentials() 
        .AllowAnyMethod();
}));

builder.Services.AddDbContext<QuizMeDatabaseContext>(o =>
{
    o.UseSqlServer(builder.Configuration.GetConnectionString("QuizMeDatabase"));
});

builder.Services.AddControllers();

builder.Services.AddScoped(typeof(QuizRequestService));
builder.Services.AddScoped(typeof(QuizSubmitService));
builder.Services.AddScoped(typeof(QuestionService));
builder.Services.AddScoped(typeof(AnswerService));
builder.Services.AddScoped(typeof(JWTIssuerService));
builder.Services.AddScoped(typeof(JWTRefreshTokenService));
builder.Services.AddScoped(typeof(UserService));

builder.Services.AddScoped<IQuestionRepositoryContract, QuestionRepositoryImpl>();
builder.Services.AddScoped<IAnswerRepositoryContract, AnswerRepositoryImpl>();
builder.Services.AddScoped<IUserRepository, UserRepositoryImpl>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(o =>
{
    o.TokenValidationParameters = 
        new TokenValidationParameters
        {
            
            ClockSkew = TimeSpan.Zero,
            
            ValidAudience = builder.Configuration[QuizMeJWTConstant.AudienceKey],
            ValidIssuer = builder.Configuration[QuizMeJWTConstant.IssuerKey],
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration[QuizMeJWTConstant.IssuerSigningKey]))
        }; 
    o.IncludeErrorDetails = true;
});

builder.Services.AddAuthorization();

var app = builder.Build();

GoogleTokenService.InstatiateHttpClient();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseSwagger();

app.UseSwaggerUI();

app.UseCors("cors");

app.UseAuthentication();

app.UseAuthorization();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();