This project is designed to help people in Rwanda prepare 'Provisoire' exam.



Technologies used are React Js and asap dotnet



Process for running this project:



1. Install Visual Studio or Rider or any other IDE to support C# development and JavaScript development



2\. Install Microsoft SQL Server and SQL Server Management Studio



3\. Now after the initial setup u can navigate to the project root folder.



4\. Supposing you are in the root folder, create '.env' file in this path exactly quiz-me-client/



In the file put this-> VITE\_GOOGLE\_CLIENT\_ID="Your Google Client Id" \[This project depends on Google Oauth, so u need to have your Google Client Id].



5\. Supposing you are in the root folder, create 'appsettings.Development.json' file in the following path quiz-me-server/quiz-me-server/



Here it is how the file will look like:



{

&#x20; "Logging": {

&#x20;   "LogLevel": {

&#x20;     "Default": "Information",

&#x20;     "Microsoft.AspNetCore": "Warning"

&#x20;   }

&#x20; },



&#x20; "ConnectionStrings": {

&#x20;   "QuizMeDatabase" : "Put here the connection string from your Microsoft SQL Server database"

&#x20; },



&#x20; "AllowedCorsOrigin":"Put here your react app origin"

}





6\. In the same path create 'appsettings.json', it's content should look like:



{

&#x20; "Logging": {

&#x20;   "LogLevel": {

&#x20;     "Default": "Information",

&#x20;     "Microsoft.AspNetCore": "Warning"

&#x20;   }

&#x20; },

&#x20; "AllowedHosts": "\*",



&#x20; "ConnectionStrings": {

&#x20;   "QuizMeDatabase" : "Data Source=localhost\\\\SQLEXPRESS;Initial Catalog=quiz\_me\_app;User Id=sa;Password=MicrosoftSQLServer0781172951;TrustServerCertificate=True;"

&#x20; },

&#x20; 

&#x20; "Google": {

&#x20;   "client\_id" : "registered google client\_id",

&#x20;   "client\_secret" : "registered google client\_secret",

&#x20;   "auth\_code\_grant\_type" : "authorization\_code", // let it like this, as of 2026 the official docs states this as the official way to do it.

&#x20;   "redirect\_uri" : "registered google redirect\_uri",

&#x20;   "auth\_code\_exchange\_uri" : "https://oauth2.googleapis.com/token", // let it like this, as of 2026 the official docs states this as the official way to do it.



&#x20;   "refresh\_token\_grant\_type" : "refresh\_token", // let it like this, as of 2026 the official docs states this as the official way to do it.



&#x20;   "refresh\_token\_uri" : "https://oauth2.googleapis.com/token", // let it like this, as of 2026 the official docs states this as the official way to do it.



&#x20;   "userinfo\_by\_access\_token\_url" : "https://www.googleapis.com/oauth2/v3/userinfo" // let it like this, as of 2026 the official docs states this as the official way to do it.



&#x20; },

&#x20; "QuizMeJWT": {

&#x20;   "aud" : "your asap dotnet port",

&#x20;   "iss" : "your asap dotnet port",

&#x20;   "access\_token\_lifetime" : 30,  // access token lifetime in minutes

&#x20;   "refresh\_token\_lifetime" : 7, // refresh token lifetime in days

&#x20;   "iss\_signing\_key" : "your symmetric signing key string"

&#x20; }

}



7\. Supposing you are in the root folder, you need to go to 'quiz-me-server/quiz-me-server' . You need to start c# IDE when u're actually in this folder



8\. Open the terminal run the following commands:



&#x20;- dotnet tool install --global dotnet-ef // installs entity framework globally. This will help in talking to the database



&#x20;- dotnet add package Microsoft.EntityFrameworkCore.Design // installs tools that helps in Data Definition Language SQL Queries like ALTER.



&#x20;- dotnet ef migrations add InitialCreate // initialize the database and create migration files.



&#x20;- dotnet ef database update // create your actual database initiated using the command above.



9\. Run the c# or asap dotnet project



10\. Supposing you are in the root folder, you need to go to 'quiz-me-client/' folder . You need to start JS IDE when u're actually in this folder



11\. Open the terminal and run this command 'npm run dev'. Then u can see your react js origin.



NB: This project is for learning purposes. You can debug it on your own and improve it.



Also they'll be no questions-answers so u'll have to go to the database and add them yourself.



Note that a question can have many answers and in those answers they must be 1 right answer.



Happy Coding.







