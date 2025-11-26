import DashboardPage from './pages/DashboardPage.js';
import ContentPage from './pages/ContentPage.js';
import CampaignPage from './pages/CampaignPage.js';
import LivestreamPage from './pages/LivestreamPage.js';
import SEOPage from './pages/SEOPage.js';
import UserPage from './pages/UserPage.js';
import CalendarPage from './pages/CalendarPage.js';


const routes = {
'#/dashboard': DashboardPage,
'#/content': ContentPage,
'#/campaigns': CampaignPage,
'#/livestream': LivestreamPage,
'#/seo': SEOPage,
'#/users': UserPage,
'#/calendar': CalendarPage,
'': DashboardPage, // mặc định
};


function setActiveLink() {
const hash = location.hash || '#/dashboard';
document.querySelectorAll('.nav a').forEach((a) => {
a.classList.toggle('active', a.getAttribute('href') === hash);
});
}


export function router(outlet) {
function render() {
const key = location.hash || '#/dashboard';
const Page = routes[key] || DashboardPage;
outlet.replaceChildren(Page().el);
setActiveLink();
}
window.addEventListener('hashchange', render);
window.addEventListener('load', render);
render();
}