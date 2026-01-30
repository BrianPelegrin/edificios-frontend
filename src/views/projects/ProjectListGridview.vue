<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { IProject } from "../../interfaces/projects";
import buildingsApi from "../../apis/buildings-api";
import LoadingSpinner from "../../components/LoadingSpinner.vue";


const router = useRouter();


onMounted(async ()=> await getProjects())

const getProjects = async () =>{

  isLoading.value = true
  try {
    const response = await buildingsApi.get<IProject[]>('/api/Projects')
    localidades.value = response.data;
    
  } catch (error) {
    console.error(error)
  }
  finally{
    setTimeout(() => {      
      isLoading.value = false
    }, 500);
  }

}

// ✅ Lista (puedes reemplazarla por tu data real/API)
const localidades = ref<IProject[]>([]);

// Filtros
const searchQuery = ref("");
const filterProvincia = ref("");
const filterMunicipio = ref("");
const isLoading = ref<boolean>(false)

const provinciasDisponibles = computed(() => {
  return Array.from(new Set(localidades.value.map((x) => x.provincia))).sort();
});

const municipiosDisponibles = computed(() => {
  const base = filterProvincia.value
    ? localidades.value.filter((x) => x.provincia === filterProvincia.value)
    : localidades.value;

  return Array.from(new Set(base.map((x) => x.municipio))).sort();
});

const filteredLocalidades = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return localidades.value.filter((l) => {
    const matchText =
      !q ||
      l.nombre.toLowerCase().includes(q) ||
      l.direccion.toLowerCase().includes(q) ||
      l.provincia.toLowerCase().includes(q) ||
      l.municipio.toLowerCase().includes(q);

    const matchProvincia = !filterProvincia.value || l.provincia === filterProvincia.value;
    const matchMunicipio = !filterMunicipio.value || l.municipio === filterMunicipio.value;

    return matchText && matchProvincia && matchMunicipio;
  });
});

const resetFilters = () => {
  searchQuery.value = "";
  filterProvincia.value = "";
  filterMunicipio.value = "";
};

// Acciones (conecta aquí tu lógica)
const addLocalidad = () => router.push({ name: "projects-form" });
const editLocalidad = (item: IProject) => router.push({ name: "projects-form-edit", params: { id: item.id } });
const viewApartments = (item: IProject) => router.push({ name: "apartments-list", params: { id: item.id } });
const deleteLocalidad = async (item: IProject) => {
  // ejemplo simple
  if (confirm(`¿Eliminar "${item.nombre}"?`)) {

    try{

      await buildingsApi.delete(`/api/projects/${ item.id }`)
  
      localidades.value = localidades.value.filter((x) => x.id !== item.id);
    }
    catch(error: any){

      console.log(error)

    }
  }
};
</script>

<template>

  
  <div class="container-fluid">
    <!-- Header -->
    <div class="row py-4 bg-white shadow-sm mb-4">
      <div class="col">
        <h2 class="mb-0">Gestión de Proyectos</h2>
      </div>
      <div class="col-auto">
        <button @click="addLocalidad" class="btn btn-primary">
          <i class="bi bi-plus-circle"></i> Agregar Proyecto
        </button>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="row mb-4 g-2">
      <div class="col-md-4">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Buscar por nombre, dirección, provincia o municipio..."
          />
        </div>
      </div>

      <div class="col-md-3">
        <select v-model="filterProvincia" class="form-select">
          <option value="">Todas las provincias</option>
          <option v-for="p in provinciasDisponibles" :key="p" :value="p">
            {{ p }}
          </option>
        </select>
      </div>

      <div class="col-md-3">
        <select v-model="filterMunicipio" class="form-select">
          <option value="">Todos los municipios</option>
          <option v-for="m in municipiosDisponibles" :key="m" :value="m">
            {{ m }}
          </option>
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
    <!-- Tabla -->
    <div v-else class="card shadow-none border">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Codigo</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Provincia</th>
                <th>Municipio</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in filteredLocalidades" :key="item.id">
                <td>
                  <div class="text-muted">{{ item.id }}</div>
                </td>
                <td>
                  <div class="fw-semibold">{{ item.nombre }}</div>
                </td>
                <td>{{ item.direccion }}</td>
                <td>
                  <span class="badge bg-primary-subtle text-primary">
                    {{ item.provincia }}
                  </span>
                </td>
                <td>
                  <span class="badge bg-secondary-subtle text-black ">
                    {{ item.municipio }}
                  </span>
                </td>
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <a
                      class="btn btn-sm btn-primary"                      
                      title="Visualizar en RD"
                      :href="`/building_units_complete.html?code=${item.id}`"
                    >
                      <i class="bi bi-boxes"></i>
                    </a>
                    <button
                      class="btn btn-sm btn-info"
                      @click="viewApartments(item)"
                      title="Editar"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-primary"
                      @click="editLocalidad(item)"
                      title="Editar"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-secondary"
                      @click="deleteLocalidad(item)"
                      title="Eliminar"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!filteredLocalidades.length">
                <td colspan="6" class="text-center text-muted py-4">
                  No hay registros que coincidan con los filtros.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer estilo paginación (placeholder igual a tu diseño) -->
      <div class="card-footer d-flex justify-content-between align-items-center">
        <div class="text-muted">
          Mostrando {{ filteredLocalidades.length }} de {{ localidades.length }} localidades
        </div>
        <nav>
          <ul class="pagination mb-0">
            <li class="page-item disabled">
              <a class="page-link" href="#">Anterior</a>
            </li>
            <li class="page-item active">
              <a class="page-link" href="#">1</a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#">2</a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#">3</a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#">Siguiente</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
