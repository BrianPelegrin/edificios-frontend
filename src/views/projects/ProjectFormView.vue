<script setup lang="ts">
import { reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { IProject } from "../../interfaces/projects";
import buildingsApi from "../../apis/buildings-api";



const router = useRouter();
const route = useRoute();

// Simulación: si viene ID → edición
const isEditMode = computed(() => !!route.params.id);

// Modelo del formulario
const form = reactive<IProject>({
  id: "",
  nombre: "",
  direccion: "",
  provincia: "",
  municipio: "",
  edificios:[]
});

// ⚠️ Aquí normalmente cargarías desde API si es edición
onMounted(async ()=>{
  if (!isEditMode.value) return;

  const response = await buildingsApi.get(`/api/projects/${ route.params.id }`)

  if(!response.data) return;

  Object.assign(form, response.data);

})

const handleSubmit = async () => {
  console.log("Proyecto:", form);

  try{

    if (isEditMode.value) {
      await buildingsApi.put(`/api/projects/${ route.params.id }`, form)
    } else {
      await buildingsApi.post('/api/Projects', form)
    }
    
    router.push({ name: "projects-list" });
  }catch(error: any){
    console.log(error);    
  }

};

const cancel = () => {
  router.back();
};
</script>

<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="row py-4 bg-white shadow-sm mb-4">
      <div class="col">
        <h2 class="mb-0">
          {{ isEditMode ? "Editar Proyecto" : "Nueva Proyecto" }}
        </h2>
        <p class="text-muted mb-0">
          Complete la información general de la proyecto
        </p>
      </div>
    </div>

    <!-- Card formulario -->
    <div class="card shadow-none border">
      <form @submit.prevent="handleSubmit">
        <div class="card-body">
          <!-- Información general -->
          <h5 class="fw-semibold mb-3">Información general</h5>

          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">
                Codigo
                <span v-if="isEditMode" style="font-size: 12px;" class="text-danger">(Campo no editable)</span>
              </label>
              <input
                v-model="form.id"
                :disabled="isEditMode"
                type="text"
                class="form-control"
                placeholder="Ej: Sucursal Central"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Nombre</label>
              <input
                v-model="form.nombre"
                type="text"
                class="form-control"
                placeholder="Ej: Sucursal Central"
                required
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">Provincia</label>
              <input
                v-model="form.provincia"
                type="text"
                class="form-control"
                placeholder="Ej: Duarte"
                required
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">Municipio</label>
              <input
                v-model="form.municipio"
                type="text"
                class="form-control"
                placeholder="Ej: San Francisco de Macorís"
                required
              />
            </div>

            <div class="col-md-12">
              <label class="form-label">Dirección</label>
              <textarea
                v-model="form.direccion"
                class="form-control"
                rows="3"
                placeholder="Dirección completa de la localidad"
                required
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer d-flex justify-content-between">
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="cancel"
          >
            <i class="bi bi-arrow-left"></i> Cancelar
          </button>

          <button type="submit" class="btn btn-primary">
            <i class="bi bi-save"></i>
            {{ isEditMode ? "Guardar cambios" : "Crear Localidad" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
