//validaciones del formulario de registro
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
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
    
    //validación del nombre
    function validateNombre(nombre) {
        if (nombre.trim() === '') {
            return 'El nombre es obligatorio';
        }
        if (nombre.length < 3) {
            return 'El nombre debe tener al menos 3 caracteres';
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
            return 'El nombre solo puede contener letras y espacios';
        }
        return '';
    }
    
    //validación del email
    function validateEmail(email) {
        if (email.trim() === '') {
            return 'El email es obligatorio';
        }
        const emailRegex = /^[^\s@]+@(admin\.cl|vendedor\.cl|duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (!emailRegex.test(email)) {
            return 'Solo se permiten correos con @admin.cl, @vendedor.cl, @duoc.cl, @profesor.duoc.cl y @gmail.com';
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
        if (!/(?=.*[a-z])/.test(password)) {
            return 'La contraseña debe contener al menos una minúscula';
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return 'La contraseña debe contener al menos una mayúscula';
        }
        if (!/(?=.*\d)/.test(password)) {
            return 'La contraseña debe contener al menos un número';
        }
        return '';
    }
    
    //validación de confirmación de contraseña
    function validateConfirmPassword(password, confirmPassword) {
        if (confirmPassword === '') {
            return 'Confirma tu contraseña';
        }
        if (password !== confirmPassword) {
            return 'Las contraseñas no coinciden';
        }
        return '';
    }
    
    //validación del teléfono
    function validateTelefono(telefono) {
        if (telefono.trim() === '') {
            return ''; //el teléfono es opcional
        }
        const telefonoRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        if (!telefonoRegex.test(telefono)) {
            return 'Ingresa un teléfono válido';
        }
        return '';
    }
    
    //validación de términos y condiciones
    function validateTerminos(terminos) {
        if (!terminos.checked) {
            return 'Debes aceptar los términos y condiciones';
        }
        return '';
    }
    
    //validación en tiempo real para cada campo
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    //función para validar un campo específico
    function validateField(input) {
        const value = input.value;
        const name = input.name;
        let errorMessage = '';
        
        switch (name) {
            case 'nombre':
                errorMessage = validateNombre(value);
                break;
            case 'email':
                errorMessage = validateEmail(value);
                break;
            case 'password':
                errorMessage = validatePassword(value);
                break;
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                errorMessage = validateConfirmPassword(password, value);
                break;
            case 'telefono':
                errorMessage = validateTelefono(value);
                break;
            case 'terminos':
                errorMessage = validateTerminos(input);
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
        
        //validar todos los campos
        inputs.forEach(input => {
            validateField(input);
            if (input.parentElement.classList.contains('error')) {
                isValid = false;
            }
        });
        
        if (isValid) {
            //simular envío exitoso
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creando cuenta...';
            
            setTimeout(() => {
                alert('¡Cuenta creada exitosamente! Bienvenido a VinylStore.');
                form.reset();
                inputs.forEach(input => {
                    input.parentElement.classList.remove('success', 'error');
                });
                submitBtn.disabled = false;
                submitBtn.textContent = 'Crear Cuenta';
            }, 1500);
        } else {
            //mostrar mensaje de error general
            alert('Por favor, corrige los errores en el formulario.');
        }
    });
});
