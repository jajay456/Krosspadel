import { useState, useEffect, useContext } from "react";
import Nav from "./components/Nav";
import BookModal from "./components/BookModal";
import Notif from "./components/Notif";
import HomePage from "./pages/HomePage";
import VenuesPage from "./pages/VenuesPage";
import VenueDetailPage from "./pages/VenueDetailPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import StoriesPage from "./pages/StoriesPage";
import StoryDetailPage from "./pages/StoryDetailPage";
import ActivityDetailPage from "./pages/ActivityDetailPage";
import MembershipPage from "./pages/MembershipPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import BecomePartnerPage from "./pages/BecomePartnerPage";
import LifestylePage from "./pages/LifestylePage";
import ComingSoonPage from "./pages/ComingSoonPage";
import BePartOfKrossPage from "./pages/BePartOfKrossPage";
import FranchiseesPage from "./pages/FranchiseesPage";
import BrandsCollabsPage from "./pages/BrandsCollabsPage";
import { VenueProvider } from "./context/VenueProvider";
import { VenueContext } from "./context/VenueContext";
import { AuthProvider } from "./context/AuthProvider";
import { AuthContext } from "./context/AuthContext";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVenuesPage from "./pages/admin/AdminVenuesPage";
import AdminStoriesPage from "./pages/admin/AdminStoriesPage";
import AdminActivitiesPage from "./pages/admin/AdminActivitiesPage";
import AdminMembershipPage from "./pages/admin/AdminMembershipPage";
import AdminTeamPage from "./pages/admin/AdminTeamPage";
import AdminPricingPage from "./pages/admin/AdminPricingPage";

function AppInner() {
  const { user } = useContext(AuthContext);
  const { venues } = useContext(VenueContext);
  const getCurrentPage = () => {
  const path = window.location.pathname;
    if (path === "/" || path === "") return "home";

    return path.replace("/", "");
  };
  const [page, setPage] = useState(getCurrentPage());
  const [bookOpen, setBookOpen] = useState(false);
  const [notifMsg, setNotifMsg] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const navigate = (p) => {
    setPage(p);

    const url = p === "home" ? "/" : `/${p}`;
    window.history.pushState({}, "", url);

    window.scrollTo(0, 0);
  };

  const openBook = () => window.open("https://apps.apple.com/kz/app/kross-padel/id6741785490", "_blank");
  const notify = (msg) => { setNotifMsg(msg); setTimeout(() => setNotifMsg(""), 3200); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setBookOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
  const onPopState = () => {
      setPage(getCurrentPage());
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  
  const venueMatch = page.startsWith("venue-")
    ? venues.find(v => "venue-" + v.id === page)
    : null;

  return (
    <>
      <Nav navigate={navigate} scrolled={scrolled} page={page} />
      <BookModal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        onSubmit={() => { setBookOpen(false); notify("Booking confirmed! Check your email."); }}
      />
      <Notif msg={notifMsg} />

      {page === "home" && <HomePage navigate={navigate} openBook={openBook} />}
      {page === "venues" && <VenuesPage navigate={navigate} openBook={openBook} />}
      {page === "activities" && <ActivitiesPage navigate={navigate} openBook={openBook} />}
      {page === "stories" && <StoriesPage navigate={navigate} />}
      {page === "membership" && <MembershipPage navigate={navigate} notify={notify} openBook={openBook} />}
      {page === "contact" && <ContactPage navigate={navigate} notify={notify} />}
      {page === "about" && <AboutPage navigate={navigate} />}
      {page === "lifestyle" && <LifestylePage navigate={navigate} />}
      {page === "partner" && <BecomePartnerPage navigate={navigate} />}
      {page === "partner-be-part" && <BePartOfKrossPage navigate={navigate} />}
      {page === "partner-franchisees" && <FranchiseesPage navigate={navigate} notify={notify} />}
      {page === "partner-brands" && <BrandsCollabsPage navigate={navigate} />}
      {page === "whatsapp" && <ComingSoonPage navigate={navigate} title="WhatsApp" icon="💬" />}
      {page === "krosspark" && <ComingSoonPage navigate={navigate} title="Kross Park" icon="🏟️" />}
      {page === "admin-login" && <AdminLoginPage navigate={navigate} />}
      {page === "admin" && (user ? <AdminDashboard navigate={navigate} /> : <AdminLoginPage navigate={navigate} />)}
      {page === "admin-venues" && (user ? <AdminVenuesPage navigate={navigate} /> : <AdminLoginPage navigate={navigate} />)}
      {page === "admin-stories" && (user ? <AdminStoriesPage navigate={navigate} /> : <AdminLoginPage navigate={navigate} />)}
      {page === "admin-activities" && (user ? <AdminActivitiesPage navigate={navigate} /> : <AdminLoginPage navigate={navigate} />)}
      {page === "admin-membership" && (user ? <AdminMembershipPage navigate={navigate} /> : <AdminLoginPage navigate={navigate} />)}
      {page === "admin-team" && (user ? <AdminTeamPage navigate={navigate} /> : <AdminLoginPage navigate={navigate} />)}
      {page === "admin-pricing" && (user ? <AdminPricingPage navigate={navigate} /> : <AdminLoginPage navigate={navigate} />)}
      {venueMatch && <VenueDetailPage venue={venueMatch} navigate={navigate} openBook={openBook} />}
      {page.startsWith("story-") && <StoryDetailPage navigate={navigate} page={page} />}
      {page.startsWith("activity-") && <ActivityDetailPage navigate={navigate} activityId={page.replace("activity-", "")} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <VenueProvider>
        <AppInner />
      </VenueProvider>
    </AuthProvider>
  );
}