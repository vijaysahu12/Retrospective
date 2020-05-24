1. Application is completely .NET COre 3.1 
2. Entity Framework is also aspnetcore
3. using database first approach 
4. To update the model from database we have to use scafffolding 

run the below command to 

//run this on command prompt
dotnet ef dbcontext scaffold "Data Source=DESKTOP-TD3L0N9;Initial Catalog=PetroConnect;Integrated Security=True" Microsoft.EntityFrameworkCore.SqlServer -o Models

Note: Before running this make sure you are alredy inside the PreConnect.Data folder 


