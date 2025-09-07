//validaciones del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, textarea');
    
    //función para mostrar mensaje de error
    function showError(input, message) {
        const formGroup = input.parentElement;
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
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
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    
    //validación del nombre
    function validateNombre(nombre) {
        if (nombre.trim() === '') {
            return 'El nombre es obligatorio';
        }
        if (nombre.length > 100) {
            return 'El nombre no puede exceder 100 caracteres';
        }
        return '';
    }
    
    //validación del correo
    function validateCorreo(correo) {
        if (correo.trim() === '') {
            return 'El correo es obligatorio';
        }
        if (correo.length > 100) {
            return 'El correo no puede exceder 100 caracteres';
        }
        const emailRegex = /^[^\s@]+@(admin\.cl|vendedor\.cl|duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (!emailRegex.test(correo)) {
            return 'Solo se permiten correos con @admin.cl, @vendedor.cl, @duoc.cl, @profesor.duoc.cl y @gmail.com';
        }
        return '';
    }
    
    //validación del comentario
    function validateComentario(comentario) {
        if (comentario.trim() === '') {
            return 'El comentario es obligatorio';
        }
        if (comentario.length > 500) {
            return 'El comentario no puede exceder 500 caracteres';
        }
        return '';
    }
    
    //validación en tiempo real para cada campo
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.parentElement.classList.contains('error')) {
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
            case 'correo':
                errorMessage = validateCorreo(value);
                break;
            case 'descripcion':
                errorMessage = validateComentario(value);
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
            const nombre = document.getElementById('nombre').value;
            const asunto = document.getElementById('asunto').value;
            const descripcion = document.getElementById('descripcion').value;
            
            //simular envío exitoso
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            setTimeout(() => {
                alert(`¡Gracias ${nombre}! Tu mensaje sobre "${asunto}" ha sido enviado. Te contactaremos pronto.`);
                form.reset();
                inputs.forEach(input => {
                    input.parentElement.classList.remove('success', 'error');
                });
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';
            }, 1500);
        } else {
            alert('Por favor, corrige los errores en el formulario.');
        }
    });
});
