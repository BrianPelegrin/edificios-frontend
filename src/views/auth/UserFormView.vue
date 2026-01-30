<template>
  <div class="container-fluid">
    <div class="row py-4 bg-white shadow-sm mb-4">
      <div class="col">
        <h2 class="mb-0">
          {{ isEditing ? "Editar" : "Registrar" }} Usuario
        </h2>
        <p class="text-muted mb-0">
          Complete la información general de la proyecto
        </p>
      </div>
    </div>

    <div class="card shadow-none border">
      <form @submit.prevent="onSubmit" novalidate>
        <div class="card-header">

          <h5 class="fw-semibold mb-0">{{ isEditing ? 'Editar' : 'Registrar' }} usuario</h5>
        </div>

        <div class="card-body">
          <!-- ALERTA DE ÉXITO -->
          <div v-if="successMessage" class="alert alert-success py-2">
            {{ successMessage }}
          </div>

          <!-- ALERTA DE ERROR GENERAL -->
          <div v-if="errorMessage" class="alert alert-danger py-2">
            {{ errorMessage }}
          </div>


          <div class="row">

            <!-- CODIGO -->
            <div class="mb-3 col-md-4 col-12"">
              <label for="code" class="form-label">Codigo del Usuario</label>
              <input id="code" v-model.trim="form.codigo" type="text" class="form-control"
                :class="{ 'is-invalid': submitted && !form.codigo }"
                placeholder="Digite el codigo para asignar al usuario" required />
              <div class="invalid-feedback">
                El codigo es obligatorio.
              </div>
            </div>

            <!-- NOMBRE COMPLETO -->
            <div class="mb-3 col-md-8 col-12">
              <label for="fullName" class="form-label">Nombre completo</label>
              <input id="fullName" v-model.trim="form.nombre" type="text" class="form-control"
                :class="{ 'is-invalid': submitted && !form.nombre }" placeholder="Ej: Juan Pérez" required />
              <div class="invalid-feedback">
                El nombre completo es obligatorio.
              </div>
            </div>


            <!-- CORREO -->
            <div class="mb-3 col-md-12">
              <label for="email" class="form-label">Correo electrónico</label>
              <span v-if="isEditing" class="text-danger ms-1" style="font-size: 12px;">No editable</span>
              <input :disabled="isEditing" id="email" v-model.trim="form.email" type="email" class="form-control"
                :class="{ 'is-invalid': submitted && !isValidEmail(form.email) }" placeholder="usuario@dominio.com"
                required />

              <div class="invalid-feedback">
                Debes ingresar un correo electrónico válido.
              </div>
            </div>

            <div v-if="!!isEditing" class="mb-3 col-md-12">
              <hr />
              <div class="form-check">
                <input class="form-check-input" type="checkbox" v-model="form.actualizarClave" id="update-password"
                  name="update-password">
                <label class="form-check-label" for="update-password">
                  Actualizar Contraseña
                </label>
              </div>
            </div>

            <template v-if="!isEditing || (isEditing && form.actualizarClave)">

              <!-- CONTRASEÑA -->
              <div class="mb-3 col-md-6">
                <label for="password" class="form-label">Contraseña</label>
                <input id="password" v-model="form.clave" type="password" class="form-control"
                  :class="{ 'is-invalid': submitted && !isValidPassword }" placeholder="Mínimo 6 caracteres" required />
                <div class="invalid-feedback">
                  La contraseña debe tener al menos 6 caracteres.
                </div>
              </div>

              <!-- CONFIRMAR CONTRASEÑA -->
              <div class="mb-3 col-md-6">
                <label for="confirmPassword" class="form-label">
                  Confirmar contraseña
                </label>
                <input id="confirmPassword" v-model="form.claveConfirmacion" type="password" class="form-control"
                  :class="{ 'is-invalid': submitted && !passwordsMatch }" placeholder="Confirma la contraseña"
                  required />
                <div class="invalid-feedback">
                  Las contraseñas no coinciden.
                </div>
              </div>

            </template>

          </div>



          <!-- BOTONES -->
          <!-- <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary">
              Limpiar
            </button>
            <button type="submit" class="btn btn-primary">
              Guardar usuario
            </button>
          </div> -->

        </div>
        <!-- Footer -->
        <div class="card-footer d-flex justify-content-between">
          <button class="btn btn-outline-secondary" @click="$router.push({ name: 'users-list' })" >
            <i class="bi bi-arrow-left"></i> Cancelar
          </button>

          
          <button v-if="isLoading" disabled type="button" class="btn btn-primary">
            <div class="d-flex align-items-center">
              <div class="spinner-border spinner-border-sm text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <span class="ms-2"> Cargando </span>
            </div>
          </button>
          
          <button v-else type="submit" class="btn btn-primary">
            <i class="bi bi-save"></i>
            Guardar
          </button>
        </div>

      </form>
    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import type { IUser } from "../../interfaces/auth";
import { useRoute, useRouter } from "vue-router";
import buildingsApi from "../../apis/buildings-api";
import type { AxiosResponse } from "axios";


interface IFormUser extends IUser {
  claveConfirmacion: string;
  actualizarClave: boolean;
}

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => !!route.params.id)

onMounted(async () => {

  if (isEditing.value) {

    const response = await buildingsApi.get(`/api/users/${route.params.id}`)

    Object.assign(form, response.data)

  }


})


const submitted = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const successMessage = ref<string>("");
const errorMessage = ref<string>("");


const emptyForm = (): IFormUser => ({
  id: 0,
  codigo: '',
  nombre: '',
  email: '',
  clave: '',
  claveConfirmacion: '',
  actualizarClave: false
});

const form = reactive<IFormUser>(emptyForm());


const canValidatePassword = computed(()=> (!isEditing.value || (isEditing.value && form.actualizarClave)))

const isValidEmail = (email: string) => {
  if (!email) return false;
  // Validación simple de email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = computed(() => form.clave && form.clave.length >= 6);

const passwordsMatch = computed(
  () => form.clave === form.claveConfirmacion
);

//const isValidForm = computed(()=> form.nombre.length && isValidEmail(form.email) && isValidPassword.value && passwordsMatch.value )

const isFormValid = () => {
  if (!form.nombre) return false;
  if (!isValidEmail(form.email)) return false;

  if(canValidatePassword.value){
      if (!isValidPassword.value) return false;
      if (!passwordsMatch.value) return false;
  }

  return true;
};

const onSubmit = async () => {
  submitted.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  if (!isFormValid()) {
    errorMessage.value = "Por favor, corrige los campos marcados en rojo.";
    return;
  }

  // Aquí enviarías los datos al backend (Axios / fetch)
  // Ejemplo:
  // await axios.post('/api/users', form);

  const isSuccess = await saveUser()

  if(isSuccess) { router.push({ name: 'users-list' }) }
};


const saveUser = async (): Promise<boolean> => {

  let response: AxiosResponse;

  try {

    isLoading.value = true

    if(isEditing.value){

      response = await buildingsApi.put('/api/users/update', { ...form })

    }else{
      response = await buildingsApi.post('/api/users/register', { ...form })
    }

    if(response.status != 200){
      successMessage.value = response.data.message
    }

    
  } catch (error) {

    console.error(error)
    
  }finally{

    isLoading.value = false
    return response!.status == 200
  }

}

</script>
