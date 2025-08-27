//validaciones del formulario de login
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const inputs = form.querySelectorAll('input');
    
    //función para mostrar mensaje de error
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
        errorElement.textContent = message;
    }
    
    //función para mostrar mensaje de éxito
    function showSuccess(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        errorElement.textContent = '';
    }
    
    //validación del email
    function validateEmail(email) {
        if (email.trim() === '') {
            return 'El email es obligatorio';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Ingresa un email válido';
        }
        return '';
    }
    
    //validación de la contraseña
    function validatePassword(password) {
        if (password === '') {
            return 'La contraseña es obligatoria';
        }
        if (password.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres';
        }
        return '';
    }
    
    //validación en tiempo real para cada campo
    inputs.forEach(input => {
        if (input.type !== 'checkbox') { //excluir checkbox de recordar
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        }
    });
    
    //función para validar un campo específico
    function validateField(input) {
        const value = input.value;
        const name = input.name;
        let errorMessage = '';
        
        switch (name) {
            case 'email':
                errorMessage = validateEmail(value);
                break;
            case 'password':
                errorMessage = validatePassword(value);
                break;
        }
        
        if (errorMessage) {
            showError(input, errorMessage);
        } else {
            showSuccess(input);
        }
    }
    
    //manejo del envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        //validar campos obligatorios
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        
        validateField(email);
        validateField(password);
        
        if (email.parentElement.classList.contains('error') || 
            password.parentElement.classList.contains('error')) {
            isValid = false;
        }
        
        if (isValid) {
            //simular proceso de login
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Ingresando...';
            
            setTimeout(() => {
                alert('¡Bienvenido de vuelta a VinylStore!');
                form.reset();
                inputs.forEach(input => {
                    if (input.type !== 'checkbox') {
                        input.parentElement.classList.remove('success', 'error');
                    }
                });
                submitBtn.disabled = false;
                submitBtn.textContent = 'Ingresar';
            }, 1500);
        } else {
            //mostrar mensaje de error general
            alert('Por favor, corrige los errores en el formulario.');
        }
    });
});
