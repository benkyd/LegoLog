import { RegisterComponent, Component, SideLoad } from './components.mjs';
import { LoginSignup, Signout } from '../auth.mjs';
import * as StorageListener from '../local-storage-listener.mjs';

// due to peculiarities in asynchronus loading of components,
// we need to have this remember the state of the logged in user
// so that we can display the correct navbar
let navbarCallback = null;
export function NotifyNavbar(type) {
    if (navbarCallback && type === 'login') {
        navbarCallback.OnLogin();
    }
    if (navbarCallback && type === 'logout') {
        navbarCallback.OnLogout();
    }
}

class NavBar extends Component {
    static __IDENTIFY() { return 'navbar'; }

    constructor() {
        super(NavBar);
        navbarCallback = this;
    }

    Render() {
        return {
            template: SideLoad('/components/templates/navbar.html'),
            style: SideLoad('/components/css/navbar.css'),
        };
    }

    SetupHamburger() {
        const menuToggler = document.querySelector('navbar-component').shadowRoot.querySelector('#menu-toggler');
        const navMenu = document.querySelector('navbar-component').shadowRoot.querySelector('.navbar');

        menuToggler.addEventListener('click', function () {
            menuToggler.classList.toggle('menu-active');
            navMenu.classList.toggle('menu-active');
        });
    }

    OnLogin() {
        if (!localStorage.user || localStorage.user === 'Guest') {
            this.OnLogout();
            return;
        }

        const account = this.root.querySelector('.account-item');

        if (localStorage.admin === 'true' || localStorage.admin === true) {
            this.root.querySelector('.stock-mode').style.display = 'flex';
            account.innerHTML = `
                <a class="nav-link" href="#">${localStorage.user}▾</a>
                <ul class="sub-nav" >
                    <li><a class="sub-nav-link" href="/orders">My Orders</a></li>
                    <li><a class="sub-nav-link" href="/staff/stock">Add or Remove Stock</a></li>
                    <li><a class="sub-nav-link" href="/staff/revieworders">Review Open Orders</a></li>
                    <li><a class="sub-nav-link logout-button" href="#">Log Out</a></li>
                </ul>
            `;
        } else {
            this.root.querySelector('.stock-mode').style.display = 'none';
            account.innerHTML = `
                <a class="nav-link" href="#">${localStorage.user}▾</a>
                <ul class="sub-nav" >
                    <li><a class="sub-nav-link" href="/orders">My Orders</a></li>
                    <li><a class="sub-nav-link logout-button" href="#">Log Out</a></li>
                </ul>
            `;
        }

        const logoutButton = account.querySelector('.logout-button');
        logoutButton.addEventListener('click', () => {
            Signout();
        });
    }

    OnLogout() {
        const account = this.root.querySelector('.account-item');
        account.innerHTML = '<a class="account-button nav-link" href="#">My Account</a>';
        const loginButton = this.root.querySelector('.account-button');
        loginButton.addEventListener('click', () => {
            LoginSignup(this);
        });
    }

    OnRender() {
        this.SetupHamburger();
        this.OnLogin();

        StorageListener.ListenOnKey('admin', (e) => {
            const admin = e.value;
            if (admin) {
                this.root.querySelector('.stock-mode').style.display = 'flex';

                if (localStorage.getItem('stock-mode') === 'true') {
                    this.root.querySelector('.stock-slider').checked = true;
                } else {
                    this.root.querySelector('.stock-slider').checked = false;
                }
            } else {
                this.root.querySelector('.stock-mode').style.display = 'none';
            }
        });

        this.root.querySelector('.stock-slider').addEventListener('change', (e) => {
            const stock = e.target.checked;
            localStorage.setItem('stock-mode', stock);
        });

        // setup log in button
        const loginButton = this.root.querySelector('.account-button');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                LoginSignup(this);
            });
        }
    }
}

RegisterComponent(NavBar);
