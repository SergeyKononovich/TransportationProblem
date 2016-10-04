using System.Web.Mvc;

namespace TransportationProblem.PL.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return new FilePathResult("~/Dist/index.html", "text/html");
        }
    }
}
