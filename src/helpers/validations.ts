export const validateEmail = ( email:string ) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
        return 'El correo electrónico es requerido'
    }
    
    if (!emailRegex.test(email)) {
        return 'Por favor, ingresa un correo electrónico válido'
    }

    return ''

}


export const validatePassword = ( password:string ) => {

    if (!password) {
        return  'La contraseña es requerida'
    }
    if (password.length < 6) {
        return  'La contraseña debe tener al menos 6 caracteres'
    }
    
    return  ''
}