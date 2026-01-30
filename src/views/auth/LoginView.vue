<template>
    <main class="d-flex align-items-center justify-content-center p-3">
        <form @submit.prevent="handleSubmit" class="card border-0 p-4">
            <div class="card-header bg-white border-0 pb-0 ">
                <p class="mb-1 text-muted fw-medium  ">Ingrese sus credenciales</p>
                <h1 class="fw-bold">Bienvenido </h1>
            </div>
            <fieldset class="card-body ">
                <div class="form-group mb-4">
                    <input 
                        v-model="loginForm.email"
                        @blur="triggerValidation('email')"
                        id="email" 
                        name="email" 
                        type="email" 
                        class="form-control form-control-lg"
                        :class="{'is-invalid': errors.email}" 
                        placeholder="Correo Electronico" 
                        autocomplete="email"
                        required 
                    />
                    <span 
                        v-if="errors.email" 
                        class="invalid-feedback  d-block">
                        {{ errors.email }}
                    </span>
                </div>
                <div class="form-group mb-4">
                    <input 
                        v-model="loginForm.password"
                        @blur="triggerValidation('password')"
                        id="password" 
                        name="password" 
                        type="password" 
                        class="form-control form-control-lg"
                        :class="{'is-invalid': errors.password}" 
                        placeholder="Contraseña" 
                        autocomplete="current-password"
                        required 
                    />
                    <span 
                        v-if="errors.password" 
                        class="invalid-feedback  d-block">
                        {{ errors.password }}
                    </span>
                </div>
                <div class="form-group">
                    <div class="form-check">
                        <input 
                            id="remember" 
                            class="form-check-input" 
                            type="checkbox"
                        >
                        <label class="form-check-label text-muted" for="remember">
                            Recordar cuenta
                        </label>
                    </div>
                </div>                
            </fieldset>
            <div class="card-footer bg-white border-0 pt-4">

                <button 
                    :disabled="isLoading"
                    type="submit" 
                    class="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center p-2">
                    <LoadingSpinner v-if="isLoading" />
                    <span class="mx-2">{{ isLoading ? 'Iniciando Sesion...' : 'Iniciar Sesion'  }}</span>
                </button>
                <p class="text-center my-3">
                    <router-link to="/login">¿Olvidaste tu contraseña?</router-link>
                </p>
            </div>
        </form>
    </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { IAuthCredentials } from '../../interfaces/auth';
import { validateEmail, validatePassword } from '../../helpers/validations';
import { useRouter } from 'vue-router';
import LoadingSpinner from '../../components/LoadingSpinner.vue';
import { useAuthStore } from '../../stores/authStore';

const router = useRouter();
const authStore = useAuthStore()
const isLoading = ref<boolean>(false);
const errors = reactive({
    email:'',
    password:'',
    loginError:''
})
const loginForm = reactive<IAuthCredentials>({
    email: '',
    password:''
})

const triggerValidation = (fieldToValidate: 'email' | 'password') => {

    if(fieldToValidate == 'email'){
        const emailVallidation = validateEmail(loginForm.email)
        errors.email = emailVallidation
    }
    else{
        const passwordValidation = validatePassword(loginForm.password)    
        errors.password = passwordValidation
    }

}

const handleSubmit = async (): Promise<void> => {

    if(errors.email || errors.password) return;

    try {
        
        isLoading.value = true    
        await authStore.login(loginForm)
        router.push({ name: 'projects-list' })
    } catch (e:any) {        
        errors.loginError = e.message
        console.log(e.message)
    }
    finally{
        isLoading.value = false;
    }

    await setTimeout(() => {
    }, 2000);

}

</script>

<style scoped>
main {
    min-height: 100vh;
}
form{
    max-width: 500px;
    width: 100%;
}
</style>