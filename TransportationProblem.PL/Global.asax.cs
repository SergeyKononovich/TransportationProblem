using System;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using log4net;

namespace TransportationProblem.PL
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(WebApiApplication));


        void Application_Error(object sender, EventArgs e)
        {
            log.Fatal("Unhandled application error.", Server.GetLastError().GetBaseException());
        }

        protected void Application_Start()
        {
            log4net.Config.XmlConfigurator.Configure();
            
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
