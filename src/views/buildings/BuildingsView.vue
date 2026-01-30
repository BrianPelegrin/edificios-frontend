<script setup lang="ts">
import { computed, reactive } from 'vue';

interface BlockPosition {
  x: number;
  y: number;
  z: number;
}

interface BlockConfig {
  name: string;
  units: string[];
  unitKeys: string[];
  unitInfo: string[];
  totalUnits: number;
  columns: number;
  rowsPerColumn: number;
  fillOrder: string;
  position: BlockPosition;
  rotation: number;
  color: number;
  footprintScale: number;
  cubeScale: number;
}

// Recibes la lista de bloques desde el padre
const props = defineProps<{
  blocks?: BlockConfig[];
}>();

// Mock de ejemplo, por si quieres probar directo
const defaultBlocks: BlockConfig[] = [
  {
    name: '2',
    units: [
      'NT8-DN-101',
      'NT8-DN-102',
      'NT8-DN-202',
      'NT8-DN-201',
      'NT8-DN-301',
      'NT8-DN-302',
      'NT8-DN-401',
      'NT8-DN-402'
    ],
    unitKeys: ['', '', '', '', '', '', '', ''],
    unitInfo: ['', '', '', '', '', '', '', ''],
    totalUnits: 8,
    columns: 1,
    rowsPerColumn: 8,
    fillOrder: 'col-first',
    position: { x: 32.75, y: 0, z: 71.725 },
    rotation: 0,
    color: 4886754,
    footprintScale: 1,
    cubeScale: 1
  }
];

const blocks = computed(() => props.blocks ?? defaultBlocks);

// Filtros
const filters = reactive({
  search: ''
});

const filteredBlocks = computed(() => {
  const term = filters.search.trim().toLowerCase();
  if (!term) return blocks.value;

  return blocks.value.filter(b => {
    const nameMatch = b.name.toLowerCase().includes(term);
    const unitsMatch = b.units.some(u => u.toLowerCase().includes(term));
    return nameMatch || unitsMatch;
  });
});

const resetFilters = () => {
  filters.search = '';
};

// Helpers
const colorHex = (color: number) =>
  '#' + color.toString(16).padStart(6, '0');

const unitsPreview = (units: string[]) => {
  if (!units.length) return 'Sin unidades';
  if (units.length <= 3) return units.join(', ');
  return units.slice(0, 3).join(', ') + ` +${units.length - 3} más`;
};
</script>

<template>
  <div class="container-fluid">
    <!-- Encabezado -->
    <div class="row py-4 bg-white align-items-center shadow-sm mb-4">
      <div class="col">
         <div>
          <h2 class="mb-0">Bloques / Líneas de Edificios</h2>
          <p class="text-muted mb-0">
            Vista general de los bloques configurados para el proyecto.
          </p>
        </div>
      </div>
      <div class="col-auto">
        <button @click="$router.push({ name: 'buildings-form' })" class="btn btn-lg btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">
          <i class="bi bi-building-add"></i> Agregar Edificios
        </button>
      </div>
    </div>

    <!-- CARD FILTROS -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row g-2 align-items-end">
          <!-- Búsqueda -->
          <div class="col-12 col-md-6 col-lg-4">
            <label class="form-label form-label-sm">Buscar</label>
            <input
              v-model="filters.search"
              type="text"
              class="form-control form-control-sm"
              placeholder="Nombre de bloque o código de unidad"
            />
          </div>

          <!-- Botón limpiar -->
          <div class="col-12 col-md-6 col-lg-2 ms-lg-auto">
            <button
              class="btn btn-outline-secondary btn-sm w-100 mt-2 mt-md-0"
              type="button"
              @click="resetFilters"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLA PRINCIPAL -->
    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 80px;">#</th>
                <th>Bloque</th>
                <th class="text-end">Total unidades</th>
                <th>Unidades</th>
                <th class="text-center">Columnas</th>
                <th class="text-center">Filas/columna</th>
                <th>Orden llenado</th>
                <th>Posición (X, Y, Z)</th>
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(b, idx) in filteredBlocks" :key="b.name + idx">
                <td class="text-muted">
                  <span class="badge bg-secondary-subtle text-secondary">
                    {{ idx + 1 }}
                  </span>
                </td>
                <td class="fw-semibold">
                  Bloque {{ b.name }}
                </td>
                <td class="text-end">
                  {{ b.totalUnits ?? b.units.length }}
                </td>
                <td>
                  <small class="text-muted">
                    {{ unitsPreview(b.units) }}
                  </small>
                </td>
                <td class="text-center">
                  {{ b.columns }}
                </td>
                <td class="text-center">
                  {{ b.rowsPerColumn }}
                </td>
                <td class="text-capitalize">
                  <span class="badge bg-primary-subtle text-primary">
                    {{ b.fillOrder }}
                  </span>
                </td>
                <td>
                  <small class="text-muted">
                    X: {{ b.position.x }},
                    Y: {{ b.position.y }},
                    Z: {{ b.position.z }}
                  </small>
                </td>
                <td>
                  <span class="d-inline-flex align-items-center">
                    <span
                      class="color-dot rounded-circle me-2"
                      :style="{ backgroundColor: colorHex(b.color) }"
                    ></span>
                    <code class="small">{{ colorHex(b.color) }}</code>
                  </span>
                </td>
              </tr>

              <tr v-if="!filteredBlocks.length">
                <td colspan="9" class="text-center text-muted py-4">
                  No hay bloques que coincidan con los filtros.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-label-sm {
  font-size: 0.8rem;
  font-weight: 500;
}
.bg-light-subtle {
  background-color: #f8f9fa;
}
.color-dot {
  width: 14px;
  height: 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
