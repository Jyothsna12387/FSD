 <template>
  <nav class="navbar" :class="{'dark-theme': isDarkTheme}">
    <div class="navbar-container">
      <router-link to="/" class="navbar-logo">
        <font-awesome-icon :icon="['fas', 'users']" />
        Hostel Buddy
      </router-link>

      <!-- Theme Toggle Button -->
      <button @click="toggleTheme" class="theme-toggle">
        {{ isDarkTheme ? '☀️' : '🌙' }}
      </button>

      <div class="menu-toggle" @click="toggleMenu">
        <span :class="{'bar': true, 'active': isOpen}"></span>
        <span :class="{'bar': true, 'active': isOpen}"></span>
        <span :class="{'bar': true, 'active': isOpen}"></span>
      </div>
      
      <ul class="nav-menu" :class="{'active': isOpen}">
        <li class="nav-item">
          <router-link to="/hostel-buddy" class="nav-links">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/student-dashboard" class="nav-links">Dashboard</router-link>
        </li>
        <li class="nav-item quick-actions-item">
          <div class="quick-actions-trigger" @click.stop="toggleQuickActions">
            <span class="quick-actions-lines">
              <span class="quick-actions-line"></span>
              <span class="quick-actions-line"></span>
              <span class="quick-actions-line"></span>
            </span>
          </div>
          <div class="quick-actions-menu" :class="{'show': showQuickActions}">
            <router-link to="/payments" class="quick-action-item" @click="closeQuickActions">
              <font-awesome-icon :icon="['fas', 'money-bill-wave']" />
              <span>Pay Fee</span>
            </router-link>
            <router-link to="/apply" class="quick-action-item" @click="closeQuickActions">
              <font-awesome-icon :icon="['fas', 'door-open']" />
              <span>Apply for Room</span>
            </router-link>
            <router-link to="/change-request" class="quick-action-item" @click="closeQuickActions">
              <font-awesome-icon :icon="['fas', 'exchange-alt']" />
              <span>Change Room</span>
            </router-link>
            <router-link to="/complaints" class="quick-action-item" @click="closeQuickActions">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
              <span>Raise Issue</span>
            </router-link>
            <router-link to="/cancel-meal" class="quick-action-item" @click="closeQuickActions">
              <font-awesome-icon :icon="['fas', 'utensils']" />
              <span>Cancel Meal</span>
            </router-link>
            <router-link to="/apply-leave" class="quick-action-item" @click="closeQuickActions">
              <font-awesome-icon :icon="['fas', 'calendar-minus']" />
              <span>Apply Leave</span>
            </router-link>
            <router-link to="/menu" class="quick-action-item" @click="closeQuickActions">
              <font-awesome-icon :icon="['fas', 'clipboard-list']" />
              <span>Check Menu</span>
            </router-link>
            <router-link to="/feedback" class="quick-action-item" @click="closeQuickActions">
              <font-awesome-icon :icon="['fas', 'comment-alt']" />
              <span>Meal Feedback</span>
            </router-link>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'Navbar',
  setup() {
    const isOpen = ref(false);
    const isDarkTheme = ref(false);
    const showQuickActions = ref(false);

    const toggleMenu = () => {
      isOpen.value = !isOpen.value;
      showQuickActions.value = false;
    };

    const toggleTheme = () => {
      isDarkTheme.value = !isDarkTheme.value;
      localStorage.setItem('darkTheme', isDarkTheme.value ? 'dark' : 'light');
      window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { isDark: isDarkTheme.value }
      }));
    };

    const toggleQuickActions = () => {
      showQuickActions.value = !showQuickActions.value;
    };

    const closeQuickActions = () => {
      showQuickActions.value = false;
    };

    onMounted(() => {
      const savedTheme = localStorage.getItem('darkTheme');
      if (savedTheme) {
        isDarkTheme.value = savedTheme === 'dark';
      }
      
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.quick-actions-item')) {
          showQuickActions.value = false;
        }
      });
    });

    return {
      isOpen,
      isDarkTheme,
      showQuickActions,
      toggleMenu,
      toggleTheme,
      toggleQuickActions,
      closeQuickActions
    };
  }
}
</script>

<style scoped>
.navbar {
  background-color: #fff;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  top: 0;
  z-index: 999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* Dark theme styles */
.navbar.dark-theme {
  background-color: #1A1C2D;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.navbar.dark-theme .nav-links {
  color: #e0e0e0;
}

.navbar.dark-theme .nav-links:hover {
  color: #44d4c5;
}

.navbar.dark-theme .nav-links.router-link-exact-active {
  color: #44d4c5;
  border-bottom: 3px solid #44d4c5;
}

.navbar.dark-theme .navbar-logo {
  color: #44d4c5;
}

.navbar.dark-theme .navbar-logo:hover svg {
  color: #44d4c5;
}

.navbar.dark-theme .bar {
  background-color: #e0e0e0;
}

/* Mobile menu dark theme */
@media screen and (max-width: 768px) {
  .navbar.dark-theme .nav-menu {
    background-color: #2E3047;
  }

  .navbar.dark-theme .nav-links:hover {
    background-color: #3a3d5a;
    color: #44d4c5;
  }

  .navbar.dark-theme .nav-links.router-link-exact-active {
    background-color: #3a3d5a;
  }
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  height: 80px;
  width: 100%;
  max-width: 1500px;
  padding: 0 24px;
}

.navbar-logo svg {
  margin-right: 10px;
  margin-left: 0px;
  font-size: 1.2em;
  color: inherit; 
  transition: transform 0.3s ease;
}

.navbar-logo:hover svg {
  transform: scale(1.1);
  color: #16a085; 
}

.navbar-logo {
  color: #1BBC9B;
  justify-self: flex-start;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  font-weight: bold;
  text-decoration: none;
}

.menu-toggle {
  display: none;
  cursor: pointer;
}

.nav-menu {
  display: flex;
  align-items: center;
  list-style: none;
  text-align: center;
}

.nav-item {
  height: 80px;
}

.nav-links {
  color: #333;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  transition: all 0.3s ease;
}

.nav-links:hover {
  color: #1BBC9B;
}

.nav-links.router-link-exact-active {
  color: #1BBC9B;
  border-bottom: 3px solid #1BBC9B;
}

/* Theme toggle button styles */
.theme-toggle {
  background-color: #44D4C5;
  color: #1A1C2D;
  border: none;
  border-radius: 5px;
  padding: 0px 10px;
  margin-top: 28px;
  height: 30px;
  margin-left: auto;
  margin-right: 15px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  height: 40px;
  width: 50px;
}

.navbar.dark-theme .theme-toggle {
  background-color: #44D4C5;
  color: #1A1C2D;
}

/* Quick Actions Styles */
.quick-actions-item {
  position: relative;
  display: flex;
  align-items: center;
}

.quick-actions-trigger {
  cursor: pointer;
  padding: 0 1rem;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-actions-lines {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 18px;
  width: 24px;
}

.quick-actions-line {
  height: 2px;
  width: 100%;
  background-color: #333;
  transition: all 0.3s ease;
}

.navbar.dark-theme .quick-actions-line {
  background-color: #e0e0e0;
}

.quick-actions-trigger:hover .quick-actions-line {
  background-color: #1BBC9B;
}

.navbar.dark-theme .quick-actions-trigger:hover .quick-actions-line {
  background-color: #44d4c5;
}

.quick-actions-menu {
  position: absolute;
  right: 0;
  top: 80px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 200px;
  padding: 10px 0;
  z-index: 1000;
  display: none;
  flex-direction: column;
}

.navbar.dark-theme .quick-actions-menu {
  background-color: #2E3047;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.quick-actions-menu.show {
  display: flex;
}

.quick-action-item {
  padding: 10px 15px;
  text-decoration: none;
  color: #333;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.navbar.dark-theme .quick-action-item {
  color: #e0e0e0;
}

.quick-action-item:hover {
  background-color: #f5f5f5;
  color: #1BBC9B;
}

.navbar.dark-theme .quick-action-item:hover {
  background-color: #3a3d5a;
  color: #44d4c5;
}

.quick-action-item svg {
  margin-right: 10px;
  width: 16px;
  text-align: center;
}

/* Mobile responsive */
@media screen and (max-width: 768px) {
  .theme-toggle {
    position: absolute;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0;
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .menu-toggle {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 60%);
    font-size: 1.8rem;
    cursor: pointer;
  }

  .bar {
    display: block;
    width: 25px;
    height: 3px;
    margin: 5px auto;
    background-color: #333;
    transition: all 0.3s ease-in-out;
  }

  .bar.active:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .bar.active:nth-child(2) {
    opacity: 0;
  }

  .bar.active:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  .nav-menu {
    position: fixed;
    left: -100%;
    top: 80px;
    flex-direction: column;
    background-color: #fff;
    width: 100%;
    height: calc(100vh - 80px);
    transition: all 0.5s ease;
  }

  .nav-menu.active {
    left: 0;
  }

  .nav-item {
    width: 100%;
    height: auto;
    padding: 20px 0;
  }

  .nav-links {
    text-align: center;
    padding: 2rem;
    width: 100%;
    display: table;
  }

  .nav-links:hover {
    background-color: #f5f5f5;
    color: #1BBC9B;
  }

  .nav-links.router-link-exact-active {
    border-bottom: none;
    background-color: #f5f5f5;
  }

  .quick-actions-item {
    width: 100%;
  }
  
  .quick-actions-trigger {
    padding: 2rem;
    width: 100%;
    display: table;
    text-align: center;
    height: auto;
    justify-content: center;
  }
  
  .quick-actions-menu {
    position: static;
    width: 100%;
    box-shadow: none;
    border-radius: 0;
  }
  
  .navbar.dark-theme .quick-actions-menu {
    background-color: #3a3d5a;
  }
  
  .quick-action-item {
    padding: 15px 30px;
  }
}
</style>