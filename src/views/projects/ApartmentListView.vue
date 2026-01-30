<template>


  <div class="container-fluid">
    <div class="row py-4 bg-white shadow-sm mb-4">
        <h2 class="mb-0">Apartamentos</h2>
    </div>

    <div class="card mb-3">
      <div class="card-body">
        <!-- FILTROS -->
        <div class="row g-2 align-items-end">
          <!-- Búsqueda general -->
          <div class="col-12 col-md-6 col-lg-3">
            <label class="form-label form-label-sm">Buscar</label>
            <input
              v-model="filters.search"
              type="text"
              class="form-control form-control-sm"
              placeholder="Código, unidad o cliente"
            />
          </div>

          <!-- Estado -->
          <div class="col-12 col-md-6 col-lg-3">
            <label class="form-label form-label-sm">Estado</label>
            <select
              v-model="filters.estado"
              class="form-select form-select-sm"
            >
              <option value="">Todos</option>
              <option value="Vendido">Vendido</option>
              <option value="Disponible">Disponible</option>
              <option value="Reservado">Reservado</option>
            </select>
          </div>

          <!-- Edificio -->
          <div class="col-12 col-md-6 col-lg-3">
            <label class="form-label form-label-sm">Edificio</label>
            <select
              v-model="filters.edificio"
              class="form-select form-select-sm"
            >
              <option value="">Todos</option>
              <option
                v-for="ed in edificiosDisponibles"
                :key="ed"
                :value="ed"
              >
                {{ ed }}
              </option>
            </select>
          </div>

          <!-- Entregada -->
          <div class="col-6 col-md-3 col-lg-1-5">
            <label class="form-label form-label-sm">Entregada</label>
            <select
              v-model="filters.entregada"
              class="form-select form-select-sm"
            >
              <option value="">Todas</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

          <!-- Saldo -->
          <div class="col-6 col-md-3 col-lg-1-5">
            <label class="form-label form-label-sm">Saldo</label>
            <select
              v-model="filters.saldo"
              class="form-select form-select-sm"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="aldia">Al día</option>
            </select>
          </div>

          <!-- Botón limpiar -->
          <div class="col-12 col-md-3 col-lg-2 d-flex justify-content-md-end">
            <button
              class="btn btn-outline-secondary  w-100 mt-2 mt-md-0"
              type="button"
              @click="resetFilters"
            >
              Limpiar filtros
            </button>
          </div>

          <!-- Botón Ver en 3D -->
          <div class="col-12 col-md-3 col-lg-2 d-flex justify-content-md-end">
            <a
              :href="`/building_units_complete.html?code=${route.params.id}&estado=${filters.estado}&edificio=${filters.edificio}&entregada=${filters.entregada}&saldo=${filters.saldo}&search=${filters.search}`"
              class="btn btn-primary  w-100 mt-2 mt-md-0"
              type="button"              
            >
              Visualizar en 3D
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading">
      <LoadingSpinner label="Cargando.." :size="50" :label-size="24" />    
    </div>

    <!-- TABLA PRINCIPAL -->
    <div v-else class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Código</th>
                <th>Edificio</th>
                <th>Unidad</th>
                <th class="text-end">Metraje (m²)</th>
                <th>Estado</th>
                <th>Cliente</th>
                <th class="text-end">Precio</th>
                <th class="text-end">Pagado</th>
                <th class="text-end">Adeudado</th>
                <th class="text-center">Entregada</th>
                <th class="text-center">Saldo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in filteredUnidades" :key="u.id">
                <td>{{ u.codUnidad }}</td>
                <td>{{ u.edificio }}</td>
                <td>{{ u.unidad }}</td>
                <td class="text-end">{{ u.metraje }}</td>
                <td>
                  <span class="badge" :class="estadoClass(u.estado)">
                    {{ u.estado }}
                  </span>
                </td>
                <td>{{ u.nombre || '—' }}</td>
                <td class="text-end">{{ formatCurrency(u.precio) }}</td>
                <td class="text-end">{{ formatCurrency(u.pagado) }}</td>
                <td
                  class="text-end"
                  :class="{
                    'text-danger fw-semibold': u.adeudado && u.adeudado > 0,
                    'text-success': u.adeudado && u.adeudado <= 0
                  }"
                >
                  {{ formatCurrency(u.adeudado) }}
                </td>
                <td class="text-center">
                  <span
                    class="badge"
                    :class="u.entregada ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'"
                  >
                    {{ u.entregada ? 'Sí' : 'No' }}
                  </span>
                </td>
                <td class="text-center">
                  <span
                    class="badge"
                    :class="u.saldo ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'"
                  >
                    {{ u.saldo ? 'Pendiente' : 'Al día' }}
                  </span>
                </td>
                <td class="text-end">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    @click="openDetails(u)"
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
              <tr v-if="!filteredUnidades.length">
                <td colspan="12" class="text-center text-muted py-4">
                  No hay unidades que coincidan con los filtros.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL DE DETALLES -->
    <div
      v-if="selectedUnidad"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Detalles de la unidad {{ selectedUnidad.codUnidad }}
            </h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Grupo: Información básica -->
            <h6 class="fw-bold mb-2">Información de la unidad</h6>
            <div class="row mb-3">
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Código</small>
                <span>{{ selectedUnidad.codUnidad }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Edificio</small>
                <span>{{ selectedUnidad.edificio }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Unidad</small>
                <span>{{ selectedUnidad.unidad }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Metraje (m²)</small>
                <span>{{ selectedUnidad.metraje }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Estado</small>
                <span class="badge" :class="estadoClass(selectedUnidad.estado)">
                  {{ selectedUnidad.estado }}
                </span>
              </div>
            </div>

            <hr />

            <!-- Grupo: Cliente -->
            <h6 class="fw-bold mb-2">Cliente</h6>
            <div class="row mb-3">
              <div class="col-md-6 mb-2">
                <small class="text-muted d-block">Nombre</small>
                <span>{{ selectedUnidad.nombre || '—' }}</span>
              </div>
              <div class="col-md-3 mb-2">
                <small class="text-muted d-block">Teléfono</small>
                <span>{{ selectedUnidad.telefono || '—' }}</span>
              </div>
              <div class="col-md-3 mb-2">
                <small class="text-muted d-block">Cédula</small>
                <span>{{ selectedUnidad.cedula || '—' }}</span>
              </div>
              <div class="col-md-6 mb-2">
                <small class="text-muted d-block">Correo</small>
                <span>{{ selectedUnidad.correo || '—' }}</span>
              </div>
            </div>

            <hr />

            <!-- Grupo: Financiero -->
            <h6 class="fw-bold mb-2">Información financiera</h6>
            <div class="row mb-3">
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Precio</small>
                <span>{{ formatCurrency(selectedUnidad.precio) }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Inicial</small>
                <span>{{ formatCurrency(selectedUnidad.inicial) }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Inicial (USD)</small>
                <span>{{ formatCurrency(selectedUnidad.inicialDolar) }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Pagado</small>
                <span>{{ formatCurrency(selectedUnidad.pagado) }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Adeudado</small>
                <span>{{ formatCurrency(selectedUnidad.adeudado) }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Forma de pago</small>
                <span>{{ selectedUnidad.formaPago || '—' }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Banco</small>
                <span>{{ selectedUnidad.banco || '—' }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Saldo</small>
                <span>{{ selectedUnidad.saldo ? 'Pendiente' : 'Al día' }}</span>
              </div>
            </div>

            <hr />

            <!-- Grupo: Procesos -->
            <h6 class="fw-bold mb-2">Procesos</h6>
            <div class="row mb-3">
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Inspección</small>
                <span>{{ selectedUnidad.enInspeccion ? 'En inspección' : '—' }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Entregada</small>
                <span>{{ selectedUnidad.entregada ? 'Sí' : 'No' }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Título</small>
                <span>{{ selectedUnidad.titulo ?? '—' }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Descargada DGII</small>
                <span>{{ selectedUnidad.descargadaDGII ? 'Sí' : 'No' }}</span>
              </div>
            </div>

            <hr />

            <!-- Grupo: Responsables (Legal, Gobierno, Misceláneos, etc.) -->
            <h6 class="fw-bold mb-2">Responsables y otros</h6>
            <div class="row mb-3">
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Responsable legal</small>
                <span>{{ selectedUnidad.responsableLegal || '—' }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Responsable gobierno</small>
                <span>{{ selectedUnidad.responsableGobierno || '—' }}</span>
              </div>
              <div class="col-md-4 mb-2">
                <small class="text-muted d-block">Responsable misceláneos</small>
                <span>{{ selectedUnidad.responsableMicelaneos || '—' }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- BACKDROP DEL MODAL -->
    <div
      v-if="selectedUnidad"
      class="modal-backdrop fade show"
      @click="closeModal"
    ></div>
  </div>

  <!-- Button trigger modal -->
<span ref="dialogButton" hidden data-bs-toggle="modal" data-bs-target="#alertModal">
</span>

<!-- Modal -->
<div class="modal fade" id="alertModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Alerta</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
          {{ message }}
      </div>
      <div class="modal-footer">
        <button @click="closeDialog()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { IApartment } from '../../interfaces/projects';
import buildingsApi from '../../apis/buildings-api';
import { useRoute, useRouter } from 'vue-router';
import LoadingSpinner from '../../components/LoadingSpinner.vue';

const apartments = ref<IApartment[]>([]);

const dialogButton = ref<HTMLButtonElement>()
const message = ref<string>('')
const isLoading = ref<boolean>(false)
const closeButtonAction = ref<Function|null>(null)

const selectedUnidad = ref<IApartment | null>(null);
const route = useRoute();
const router = useRouter();

const closeDialog = () =>{
  if(closeButtonAction.value == null) return;

  closeButtonAction.value()
}

const showDialog = ( dialogMessage: string, closeAction: Function | null = null ) => {

  message.value = dialogMessage;

  dialogButton.value?.click();
  closeButtonAction.value = closeAction

}

// Filtros reactivos
const filters = ref({
  search: '',
  estado: '',
  edificio: '',
  entregada: '',
  saldo: '',
});


watch(filters.value,()=>{
  // updates: { page: 2, search: "abc", sort: null }
  const nextQuery = { ...route.query };

  for (const [filterName, filterValue] of Object.entries(filters.value)) {
    if (filterValue === null || filterValue === undefined || filterValue === "") {
      delete nextQuery[filterName];           // quita el query param si viene vacío
    } else {
      nextQuery[filterName] = String(filterValue);      // router maneja strings en query
    }
  }

  router.replace({ query: nextQuery }); // no cambia la ruta, solo el query
})

const getQueryParams = () =>{

console.log(route.query)

Object.entries(route.query)
  .forEach(([key, val])=>{

    //@ts-ignore
    filters.value[key] = val;
  })

}

onMounted(async () => {

  if(route.params.id){

    getQueryParams()
    

    try{
      isLoading.value = true;
      const response = await buildingsApi.get<IApartment[]>(`/api/Apartamentos/GetBySheet/${ route.params.id }`)
      apartments.value = response.data;
    }catch(error: any){
      console.log(error);
      console.log(error.response.data);
      showDialog(error.response.data, ()=>{
        router.back()
      });
    }
    finally{
      isLoading.value = false
    }

  }else{
    showDialog('Debe seleccionar un proyecto', ()=>{
      router.back()
    })

  }

})

// Edificios disponibles (dinámico según los datos)
const edificiosDisponibles = computed(() => {
  const set = new Set(apartments.value.map((u) => u.edificio).filter(Boolean));
  return Array.from(set);
});

const filteredUnidades = computed(() => {
  return apartments.value.filter((u) => {
    // Search
    if (filters.value.search.trim()) {
      const q = filters.value.search.toLowerCase();
      const match =
        u.codUnidad.toLowerCase().includes(q) ||
        u.unidad.toLowerCase().includes(q) ||
        (u.nombre || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    // Estado
    if (filters.value.estado && u.estado !== filters.value.estado) {
      return false;
    }

    // Edificio
    if (filters.value.edificio && u.edificio !== filters.value.edificio) {
      return false;
    }

    // Entregada
    if (filters.value.entregada === 'true' && !u.entregada) return false;
    if (filters.value.entregada === 'false' && u.entregada) return false;

    // Saldo
    if (filters.value.saldo === 'pendiente' && !u.saldo) return false;
    if (filters.value.saldo === 'aldia' && u.saldo) return false;

    return true;
  });
});

const openDetails = (u: IApartment) => {
  selectedUnidad.value = u;
};

const closeModal = () => {
  selectedUnidad.value = null;
};

const resetFilters = () => {
  filters.value = {
    search: '',
    estado: '',
    edificio: '',
    entregada: '',
    saldo: '',
  };
};

const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  return value.toLocaleString('es-DO', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const estadoClass = (estado: string) => {
  const e = estado.toLowerCase();
  if (e.includes('vendido')) return 'bg-success-subtle text-success';
  if (e.includes('reservado')) return 'bg-warning-subtle text-warning';
  if (e.includes('disponible')) return 'bg-primary-subtle text-primary';
  return 'bg-secondary-subtle text-secondary';
};
</script>

<style scoped>
/* pequeño ajuste opcional de label "compacto" */
.form-label-sm {
  font-size: 0.8rem;
  margin-bottom: 0.15rem;
}

/* Truco para columnas "1.5" en desktop (entregada/saldo) */
@media (min-width: 992px) {
  .col-lg-1-5 {
    flex: 0 0 auto;
    width: 12.5%;
  }
}

/* Ajuste para modal manual */
.modal {
  background: transparent;
}
</style>
