<script setup lang="ts">
import { reactive, computed, watch } from 'vue';

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

const props = defineProps<{
  modelValue?: BlockConfig | null; // para editar si quieres
  mode?: 'create' | 'edit';
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: BlockConfig): void;
  (e: 'submit', value: BlockConfig): void;
  (e: 'cancel'): void;
}>();

const isEditMode = computed(() => props.mode === 'edit');

// Estado del formulario
const form = reactive<BlockConfig>({
  name: '',
  units: [],
  unitKeys: [],
  unitInfo: [],
  totalUnits: 0,
  columns: 1,
  rowsPerColumn: 1,
  fillOrder: 'col-first',
  position: { x: 0, y: 0, z: 0 },
  rotation: 0,
  color: 0x777777,
  footprintScale: 1,
  cubeScale: 1
});

// Cargar datos si viene un modelo desde el padre (modo edición)
watch(
  () => props.modelValue,
  (value) => {
    if (!value) return;
    Object.assign(form, JSON.parse(JSON.stringify(value)));
  },
  { immediate: true }
);

// helpers
const colorHex = computed({
  get: () => '#' + form.color.toString(16).padStart(6, '0'),
  set: (val: string) => {
    const clean = val.replace('#', '');
    const num = parseInt(clean, 16);
    if (!isNaN(num)) {
      form.color = num;
    }
  }
});

const unitsText = computed({
  get: () => form.units.join('\n'),
  set: (val: string) => {
    const list = val
      .split('\n')
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

    form.units = list;
    form.totalUnits = list.length;
    form.unitKeys = new Array(list.length).fill('');
    form.unitInfo = new Array(list.length).fill('');
  }
});

const handleSubmit = () => {
  const payload: BlockConfig = JSON.parse(JSON.stringify(form));
  emit('update:modelValue', payload);
  emit('submit', payload);
};

const handleCancel = () => emit('cancel');
</script>

<template>
  <div class="container-fluid">
    <!-- HEADER -->
    <div class="row py-4 bg-white shadow-sm mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h2 class="mb-0">
            {{ isEditMode ? 'Editar bloque' : 'Nuevo bloque' }}
          </h2>
          <p class="text-muted mb-0">
            Configura las propiedades del bloque y sus unidades.
          </p>
        </div>
        <div class="text-end small text-muted">
          <div>
            Total unidades:
            <span class="fw-semibold">{{ form.totalUnits }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FORM CARD -->
    <form @submit.prevent="handleSubmit">
      <div class="card mb-3">
        <div class="card-body">
          <!-- Sección: Datos generales -->
          <h5 class="fw-semibold mb-3">Datos generales</h5>
          <div class="row g-3">
            <div class="col-12 col-md-4">
              <label class="form-label form-label-sm">Nombre del bloque</label>
              <input
                v-model="form.name"
                type="text"
                class="form-control form-control-sm"
                placeholder="Ej: 2"
                required
              />
            </div>

            <div class="col-6 col-md-2">
              <label class="form-label form-label-sm">Columnas</label>
              <input
                v-model.number="form.columns"
                type="number"
                min="1"
                class="form-control form-control-sm"
              />
            </div>

            <div class="col-6 col-md-2">
              <label class="form-label form-label-sm">Filas por columna</label>
              <input
                v-model.number="form.rowsPerColumn"
                type="number"
                min="1"
                class="form-control form-control-sm"
              />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label form-label-sm">Orden de llenado</label>
              <select
                v-model="form.fillOrder"
                class="form-select form-select-sm"
              >
                <option value="col-first">Columnas primero</option>
                <option value="row-first">Filas primero</option>
              </select>
            </div>
          </div>

          <hr class="my-4" />

          <!-- Sección: Posición y escala -->
          <h5 class="fw-semibold mb-3">Posición y escala</h5>
          <div class="row g-3">
            <div class="col-4 col-md-2">
              <label class="form-label form-label-sm">Posición X</label>
              <input
                v-model.number="form.position.x"
                type="number"
                step="0.001"
                class="form-control form-control-sm"
              />
            </div>
            <div class="col-4 col-md-2">
              <label class="form-label form-label-sm">Posición Y</label>
              <input
                v-model.number="form.position.y"
                type="number"
                step="0.001"
                class="form-control form-control-sm"
              />
            </div>
            <div class="col-4 col-md-2">
              <label class="form-label form-label-sm">Posición Z</label>
              <input
                v-model.number="form.position.z"
                type="number"
                step="0.001"
                class="form-control form-control-sm"
              />
            </div>

            <div class="col-6 col-md-2">
              <label class="form-label form-label-sm">Rotación</label>
              <input
                v-model.number="form.rotation"
                type="number"
                step="0.1"
                class="form-control form-control-sm"
              />
            </div>

            <div class="col-6 col-md-2">
              <label class="form-label form-label-sm">Footprint scale</label>
              <input
                v-model.number="form.footprintScale"
                type="number"
                min="0"
                step="0.1"
                class="form-control form-control-sm"
              />
            </div>

            <div class="col-6 col-md-2">
              <label class="form-label form-label-sm">Cube scale</label>
              <input
                v-model.number="form.cubeScale"
                type="number"
                min="0"
                step="0.1"
                class="form-control form-control-sm"
              />
            </div>
          </div>

          <hr class="my-4" />

          <!-- Sección: Apariencia -->
          <h5 class="fw-semibold mb-3">Apariencia</h5>
          <div class="row g-3">
            <div class="col-12 col-md-4">
              <label class="form-label form-label-sm d-flex justify-content-between">
                <span>Color (hex)</span>
                <code>{{ colorHex }}</code>
              </label>
              <div class="d-flex align-items-center gap-2">
                <input
                  v-model="colorHex"
                  type="color"
                  class="form-control form-control-color p-0"
                />
                <input
                  v-model="colorHex"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label form-label-sm">Color (número)</label>
              <input
                v-model.number="form.color"
                type="number"
                min="0"
                class="form-control form-control-sm"
              />
            </div>
          </div>

          <hr class="my-4" />

          <!-- Sección: Unidades -->
          <h5 class="fw-semibold mb-3">Unidades</h5>
          <div class="row g-3">
            <div class="col-12 col-lg-6">
              <label class="form-label form-label-sm">
                Códigos de unidades
                <small class="text-muted d-block">
                  Escribe un código por línea (ej: NT8-DN-101).
                </small>
              </label>
              <textarea
                v-model="unitsText"
                rows="8"
                class="form-control form-control-sm"
                placeholder="NT8-DN-101&#10;NT8-DN-102&#10;NT8-DN-201"
              ></textarea>
              <small class="text-muted">
                Total: <strong>{{ form.totalUnits }}</strong> unidades.
              </small>
            </div>

            <div class="col-12 col-lg-6">
              <div class="border rounded p-3 bg-light-subtle small">
                <p class="text-muted mb-2">
                  Las listas <code>unitKeys</code> y <code>unitInfo</code> se
                  reajustan automáticamente para tener la misma cantidad de
                  elementos que <code>units</code>.
                </p>
                <ul class="mb-0">
                  <li>
                    <strong>units:</strong>
                    {{ form.units.length }} ítems
                  </li>
                  <li>
                    <strong>unitKeys:</strong>
                    {{ form.unitKeys.length }} ítems
                  </li>
                  <li>
                    <strong>unitInfo:</strong>
                    {{ form.unitInfo.length }} ítems
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer de acciones -->
        <div class="card-footer d-flex justify-content-between">
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            @click="handleCancel"
          >
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary btn-sm">
            {{ isEditMode ? 'Guardar cambios' : 'Crear bloque' }}
          </button>
        </div>
      </div>
    </form>
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
</style>
