using Microsoft.EntityFrameworkCore;
using quiz_me_server.code.dto;
using quiz_me_server.code.dto.question_answer.db_model;
using quiz_me_server.code.dto.user;

namespace quiz_me_server.code.database;

public class QuizMeDatabaseContext : DbContext
{
    public DbSet<Question> Question { set; get; } 
    
    public DbSet<Answer> Answer { set; get; }
    
    public DbSet<User> User { set; get; }
    
    public DbSet<UserMark> UserMark { set; get; }

    public QuizMeDatabaseContext(DbContextOptions<QuizMeDatabaseContext> options) : base(options)
    {}
}