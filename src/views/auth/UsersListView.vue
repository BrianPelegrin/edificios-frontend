<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="row py-4 bg-white shadow-sm mb-4">
      <div class="col">
        <h2 class="mb-0">Gestión de Usuarios</h2>
      </div>
      <div class="col-auto">
        <button @click="$router.push({ name: 'users-form' })" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">
          <i class="bi bi-plus-circle"></i> Agregar Usuario
        </button>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Buscar usuario..."
          />
        </div>
      </div>
      <div class="col-md-3">
        <select v-model="filterStatus" class="form-select">
          <option value="">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
      <div class="col-md-2">
        <button @click="resetFilters" class="btn btn-outline-secondary w-100">
          <i class="bi bi-arrow-clockwise"></i> Limpiar
        </button>
      </div>
    </div>

        <div v-if="isLoading">
      <LoadingSpinner label="Cargando.." :size="50" :label-size="24" />    
    </div>

    <!-- Tabla de usuarios -->
    <div v-else class="card shadow-none border">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Codigo</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Estado</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
               
                <td>
                    <div class="">{{ user.codigo }}</div>                
                </td>
                <td>
                    <div class="fw-semibold">{{ user.nombre }}</div>                
                </td>
                <td>{{ user.email }}</td>                
                <td>
                  <span class="badge bg-primary">
                    Activo
                  </span>
                </td>
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <!-- <button
                      class="btn  btn-info"
                      @click="viewUser(user)"
                      title="Ver detalles"
                    >
                      <i class="bi bi-eye"></i>
                    </button> -->
                    <button
                      class="btn  btn-primary"
                      @click="$router.push({ name: 'users-form-edit', params: { id: user.id } })"
                      title="Editar"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn  btn-danger"
                      @click="deleteUser(user)"
                      title="Eliminar"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import buildingsApi from '../../apis/buildings-api'
import type { IUser } from '../../interfaces/auth'
import LoadingSpinner from '../../components/LoadingSpinner.vue'

const searchQuery = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const isLoading = ref<boolean>(false)
const userList = ref<IUser[]>([])

onMounted(async ()=>{

  try { 

    isLoading.value = true;
    const response = await buildingsApi.get<IUser[]>('/api/users');
    userList.value = response.data;

  } catch (error) {

    console.error(error);

  }finally{

    setTimeout(() => {
      
      isLoading.value = false;
    }, 500);

  }

})

const filteredUsers = computed<IUser[]>(
  () => (
    userList.value.filter((user:IUser) => user.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    user.email!.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    user.codigo!.toLowerCase().includes(searchQuery.value.toLowerCase()) 
  ))
)

const resetFilters = () => {
  searchQuery.value = ''
  filterRole.value = ''
  filterStatus.value = ''
}

const deleteUser = (user: IUser) => {
  if (confirm(`¿Eliminar a ${user.nombre}?`)) {
    userList.value = userList.value.filter(u => u.id !== user.id)
  }
}
</script>

<style scoped>


</style>