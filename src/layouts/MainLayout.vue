<template>
  <div class="layout">
    <!-- SIDEBAR -->
    <nav
      class="sidebar border justify-content-between"
      :class="{ 'sidebar--mobile-open': isSidebarOpen }"
    >
      <ul>
        <li>
          <div class="nav-brand">
            <i class="bi bi-building"></i>
          </div>
        </li>
      </ul>

      <ul>
        <!-- <li>
          <router-link
            to="/projects-map"
            class="nav-link-item"
            @click="closeSidebar"
          >
            <i class="bi bi-buildings"></i>
          </router-link>
        </li> -->

        <li>
          <router-link
            to="/projects"
            class="nav-link-item"
            @click="closeSidebar"
          >
            <i class="bi bi-buildings"></i>
          </router-link>
        </li>

        <li>
          <router-link
            to="/users"
            class="nav-link-item"
            @click="closeSidebar"
          >
            <i class="bi bi-people"></i>
          </router-link>
        </li>

        <!-- <li>
          <router-link
            to="/users-form"
            class="nav-link-item"
            @click="closeSidebar"
          >
            <i class="bi bi-house-door-fill"></i>
          </router-link>
        </li> -->

        <!-- <li>
          <router-link
            to="/apartments"
            class="nav-link-item"
            @click="closeSidebar"
          >
            <i class="bi bi-house-door-fill"></i>
          </router-link>
        </li> -->
        <li>
          <router-link
            to="/buildings"
            class="nav-link-item"
            @click="closeSidebar"
          >
            <i class="bi bi-building-gear"></i>
          </router-link>
        </li>
      </ul>

      <ul>
        <li>
          <button class="nav-link-item btn" @click="()=>{
            authStore.logout()
            $router.push({ name: 'login' })
          }">
            <i class="bi bi-box-arrow-left"></i>
          </button>
        </li>
      </ul>
    </nav>

    <!-- BACKDROP SOLO EN MÓVIL -->
    <div
      v-if="isSidebarOpen"
      class="sidebar-backdrop d-md-none"
      @click="closeSidebar"
    ></div>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="main-content">
      <!-- TOPBAR SOLO EN MÓVIL -->
      <header class="topbar d-md-none">
        <button
          class="btn btn-outline-primary me-2"
          type="button"
          @click="toggleSidebar"
        >
          <i class="bi bi-list"></i>
        </button>
        <span class="topbar-title">
          <!-- Cambia el título si quieres algo dinámico -->
          Panel
        </span>
      </header>

      <div class="main-inner">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  background: var(--bs-gray-100);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  position: relative;
}

.sidebar {
  width: 120px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  border-right: 1px solid #e5e7eb;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Listas del sidebar */
.sidebar ul {
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

.sidebar li {
  margin-bottom: 14px;
}

.nav-brand {
  width: 60px;
  height: 60px;
  display: flex;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background: var(--bs-primary);
  color: white;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 28px;
}

.nav-link-item {
  width: 60px;
  height: 60px;
  display: flex;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  background: var(--bs-gray-200);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.5s;
  font-size: 20px;
}

.nav-link-item:hover {
  background: var(--bs-primary);
  color: white;
}

.nav-link-item.router-link-active {
  background: var(--bs-primary);
  color: white;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Contenedor del contenido real */
.main-inner {
  flex: 1;
  overflow: auto;
}

/* Topbar (solo móvil) */
.topbar {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.topbar-title {
  font-weight: 500;
}

/* ---------- RESPONSIVE / OFFCANVAS ---------- */

/* MÓVIL: el sidebar se vuelve offcanvas */
@media (max-width: 767.98px) {
  .layout {
    border-radius: 0;
    box-shadow: none;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1040; /* similar a offcanvas de Bootstrap */
    transform: translateX(-100%);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  }

  .sidebar.sidebar--mobile-open {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.25);
  }

  .sidebar-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 1030;
  }
}

/* ESCRITORIO: sidebar fijo normal */
@media (min-width: 768px) {
  .sidebar {
    position: static;
    height: 100%;
    transform: none !important;
    box-shadow: none;
    z-index: 1025;
  }

  .topbar {
    display: none;
  }

  .sidebar-backdrop {
    display: none;
  }
}
</style>
