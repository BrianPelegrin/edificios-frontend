import { computed, reactive, ref } from "vue"
import buildingsApi from "../apis/buildings-api"
import type { IAuthCredentials, ILoginResponse, IUser } from "../interfaces/auth"


interface IAuthState { 
    user: IUser | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const authState = reactive<IAuthState>({
    user: null,
    token: null,
    loading: false,
    error: null
});

const STORAGE_KEY = 'app.session';

export const useAuthStore = () =>{

    const login = async ( credentials:IAuthCredentials ): Promise<void> =>{        
        const userSession = await buildingsApi.post<ILoginResponse>( '/api/users/login', {
            email:credentials.email,
            clave:credentials.password
        } )
        authState.user = userSession.data.user;
        authState.token = userSession.data.token;
        saveToStorage()
    }

    const saveToStorage = (): void => {
        try {
            const localSession = JSON.stringify({
                user: authState.user,
                token: authState.token
            });

            localStorage.setItem(STORAGE_KEY, localSession);
        } catch (error) {
            
        }
    }

    function loadFromStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return;

            const parsed = JSON.parse(data);
            authState.user = parsed.user ?? null;
            authState.token = parsed.token ?? null;
        } catch (e) {
            console.error('Error leyendo sesión de localStorage', e);
        }
    }

    const clearStorage = (): void => {
        localStorage.removeItem(STORAGE_KEY);
    }

    const logout = (): void => {
        authState.token = null;
        authState.user = null;
        clearStorage()
    }    
    

    return{
        isAuthenticated: computed<boolean>( ()=> !!authState.token ),
        isLoading: computed<boolean>( ()=> authState.loading ),
        login,
        logout,
        loadFromStorage,
        authState        
    }
}