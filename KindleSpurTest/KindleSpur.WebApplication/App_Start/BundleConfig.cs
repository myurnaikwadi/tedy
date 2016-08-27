using System.Web;
using System.Web.Optimization;

namespace KindleSpur.WebApplication
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/JS").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js",
                       "~/Scripts/Angular/Library Files/angular.js",
                       "~/Scripts/angular-cookies.js",
                       "~/Scripts/Angular/Library Files/angular-ui-router.js",
                       "~/Scripts/jquery-2.2.3.js",
                       "~/Scripts/bootstrap.js",
                       "~/Scripts/bootstrap.min.js",
                       "~/Scripts/d3.v3.min.js",
                       "~/Scripts/glow.js",
                      "~/Scripts/Angular/App/app.js",
                       "~/Scripts/Angular/App/stateController.js",
               "~/Scripts/Angular/Services/ksService.js",
               "~/Scripts/Angular/Services/ksGenericDirective.js",
               "~/Scripts/Angular/Services/ksIsotope.js",
               "~/Scripts/Angular/Services/ksPluginService.js",
               "~/Scripts/Angular/Services/ksCommonRepo.js",
               "~/Scripts/Angular/Controller/Login/ksLoginController.js",
               "~/Scripts/Angular/Controller/Home/ksStateHomeController.js",
               "~/Scripts/Angular/Controller/Home/ksHomePageController.js",
               "~/Scripts/Angular/Controller/Home/ksVCGController.js",
               "~/Scripts/Angular/Controller/Home/ksProfile/ksProfileController.js",
               "~/Scripts/Angular/Controller/Home/ksDashBoardController.js",
               "~/Scripts/Angular/Controller/Home/ksDashBoardCoachController.js",
               "~/Scripts/Angular/Controller/Home/ksDashBoardCoacheeController.js",
               "~/Scripts/Angular/Controller/Home/ksDashBoardMenteeController.js",
               "~/Scripts/Angular/Controller/Home/ksDashBoardMentorController.js",
               "~/Scripts/Angular/Controller/Home/ksVcsController.js",
                      "~/Scripts/MyScript.js"));


            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Scripts/css/global.css",
                "~/Content/bootstrap.css",
                "~/Content/font-awesome.css",
                "~/Scripts/css/ksLogin/ksLogin.css",
                "~/Scripts/css/ksLogin/ksSavePassoword.css",
                "~/Scripts/css/ksProfile/ksProfile.css",
                "~/Scripts/css/ksDashBoard/ksDashBoard.css",
                "~/Scripts/css/ksDashBoard/ksDashBoardCoach.css",
                "~/Scripts/css/rewards/ksRewardProgram.css",
                "~/Content/Styles/FindCoach.css",
                "~/Scripts/css/ksDashBoard/ksDashBoardCoachee.css",
                "~/Scripts/css/ksDashBoard/ksDashBoardMentee.css",
                "~/Scripts/css/ksDashBoard/ksDashBoardMentor.css",
                "~/Scripts/css/communication/ksCommunication.css",
                "~/Scripts/css/VCS/ksVcs.css",
                      "~/Content/site.css"));
        }
    }
}
