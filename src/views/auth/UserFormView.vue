<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Registrar usuario</h5>
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

            <form @submit.prevent="onSubmit" novalidate>
              <!-- NOMBRE COMPLETO -->
              <div class="mb-3">
                <label for="fullName" class="form-label">Nombre completo</label>
                <input
                  id="fullName"
                  v-model.trim="form.fullName"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && !form.fullName }"
                  placeholder="Ej: Juan Pérez"
                  required
                />
                <div class="invalid-feedback">
                  El nombre completo es obligatorio.
                </div>
              </div>

              <!-- CORREO -->
              <div class="mb-3">
                <label for="email" class="form-label">Correo electrónico</label>
                <input
                  id="email"
                  v-model.trim="form.email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && !isValidEmail(form.email) }"
                  placeholder="usuario@dominio.com"
                  required
                />
                <div class="invalid-feedback">
                  Debes ingresar un correo electrónico válido.
                </div>
              </div>

              <!-- CONTRASEÑA -->
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && !isValidPassword }"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <div class="invalid-feedback">
                  La contraseña debe tener al menos 6 caracteres.
                </div>
              </div>

              <!-- CONFIRMAR CONTRASEÑA -->
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && !passwordsMatch }"
                  required
                />
                <div class="invalid-feedback">
                  Las contraseñas no coinciden.
                </div>
              </div>

              <!-- ROL -->
              <div class="mb-3">
                <label for="role" class="form-label">Rol</label>
                <select
                  id="role"
                  v-model="form.role"
                  class="form-select"
                  :class="{ 'is-invalid': submitted && !form.role }"
                  required
                >
                  <option value="" disabled>Selecciona un rol</option>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                  <option value="viewer">Solo lectura</option>
                </select>
                <div class="invalid-feedback">
                  Debes seleccionar un rol.
                </div>
              </div>

              <!-- ACTIVO -->
              <div class="form-check form-switch mb-3">
                <input
                  id="isActive"
                  v-model="form.isActive"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                />
                <label class="form-check-label" for="isActive">
                  Usuario activo
                </label>
              </div>

              <!-- BOTONES -->
              <div class="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="onReset"
                >
                  Limpiar
                </button>
                <button type="submit" class="btn btn-primary">
                  Guardar usuario
                </button>
              </div>
            </form>
          </div>

          <div class="card-footer text-muted small">
            Campos marcados son obligatorios.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";

const emptyForm = () => ({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  isActive: true,
});

const form = reactive(emptyForm());
const submitted = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const isValidEmail = (email) => {
  if (!email) return false;
  // Validación simple de email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = computed(() => form.password && form.password.length >= 6);

const passwordsMatch = computed(
  () => form.password && form.password === form.confirmPassword
);

const isFormValid = () => {
  if (!form.fullName) return false;
  if (!isValidEmail(form.email)) return false;
  if (!isValidPassword.value) return false;
  if (!passwordsMatch.value) return false;
  if (!form.role) return false;
  return true;
};

const onSubmit = () => {
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

  console.log("Usuario a registrar:", { ...form });

  successMessage.value = "Usuario registrado correctamente.";
  onReset(false); // limpiamos el formulario pero mantenemos el "submitted"
};

const onReset = (resetSubmitted = true) => {
  Object.assign(form, emptyForm());
  if (resetSubmitted) submitted.value = false;
  errorMessage.value = "";
  successMessage.value = "";
};
</script>
