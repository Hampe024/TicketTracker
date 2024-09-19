import Router from "./components/router.js";
import Navigation from "./components/nav.js";
import NotFound from "./components/not-found.js";

customElements.define('router-outlet', Router);
customElements.define('navigation-outlet', Navigation);
customElements.define('not-found', NotFound);
