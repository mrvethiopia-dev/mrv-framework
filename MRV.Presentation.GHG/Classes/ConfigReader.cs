using System.Configuration;

namespace MRV.Presentation.GHG.Classes
{
    public static class ConfigReader
    {
        public static string GetConnectionString(string key)
        {
            
            return ConfigurationManager.ConnectionStrings[key].ConnectionString;
        }
    }
}