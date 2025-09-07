//validaciones del formulario de nuevo usuario
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('newUserForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    //cargar regiones y comunas
    cargarRegionesYComunas();
    
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
    
    //validación del RUN
    function validateRun(run) {
        if (run.trim() === '') {
            return 'El RUN es obligatorio';
        }
        
        //remover puntos y guiones
        const runLimpio = run.replace(/[.-]/g, '');
        
        if (runLimpio.length < 7 || runLimpio.length > 9) {
            return 'El RUN debe tener entre 7 y 9 caracteres';
        }
        
        //validar formato básico (número + dígito verificador)
        const runRegex = /^[0-9]{7,8}[0-9K]$/i;
        if (!runRegex.test(runLimpio)) {
            return 'El RUN debe tener el formato correcto (ej: 19011022K)';
        }
        
        return '';
    }
    
    //validación del nombre
    function validateNombre(nombre) {
        if (nombre.trim() === '') {
            return 'El nombre es obligatorio';
        }
        if (nombre.length > 50) {
            return 'El nombre no puede exceder 50 caracteres';
        }
        return '';
    }
    
    //validación de los apellidos
    function validateApellidos(apellidos) {
        if (apellidos.trim() === '') {
            return 'Los apellidos son obligatorios';
        }
        if (apellidos.length > 100) {
            return 'Los apellidos no pueden exceder 100 caracteres';
        }
        return '';
    }
    
    //validación del correo
    function validateEmail(email) {
        if (email.trim() === '') {
            return 'El correo es obligatorio';
        }
        if (email.length > 100) {
            return 'El correo no puede exceder 100 caracteres';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Ingresa un correo válido';
        }
        //validar dominios permitidos
        const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        const hasValidDomain = allowedDomains.some(domain => email.endsWith(domain));
        if (!hasValidDomain) {
            return 'Solo se permiten correos de @duoc.cl, @profesor.duoc.cl y @gmail.com';
        }
        return '';
    }
    
    //validación del tipo de usuario
    function validateTipoUsuario(tipoUsuario) {
        if (tipoUsuario === '') {
            return 'El tipo de usuario es obligatorio';
        }
        return '';
    }
    
    //validación de la región
    function validateRegion(region) {
        if (region === '') {
            return 'La región es obligatoria';
        }
        return '';
    }
    
    //validación de la comuna
    function validateComuna(comuna) {
        if (comuna === '') {
            return 'La comuna es obligatoria';
        }
        return '';
    }
    
    //validación de la dirección
    function validateDireccion(direccion) {
        if (direccion.trim() === '') {
            return 'La dirección es obligatoria';
        }
        if (direccion.length > 300) {
            return 'La dirección no puede exceder 300 caracteres';
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
            case 'run':
                errorMessage = validateRun(value);
                break;
            case 'firstName':
                errorMessage = validateNombre(value);
                break;
            case 'lastName':
                errorMessage = validateApellidos(value);
                break;
            case 'email':
                errorMessage = validateEmail(value);
                break;
            case 'tipoUsuario':
                errorMessage = validateTipoUsuario(value);
                break;
            case 'region':
                errorMessage = validateRegion(value);
                break;
            case 'comuna':
                errorMessage = validateComuna(value);
                break;
            case 'direccion':
                errorMessage = validateDireccion(value);
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
            //simular proceso de creación de usuario
            const submitBtn = form.querySelector('.btn-primary');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';
            
            //obtener datos del formulario
            const formData = new FormData(form);
            const usuarioData = {
                run: formData.get('run'),
                nombre: formData.get('firstName'),
                apellidos: formData.get('lastName'),
                correo: formData.get('email'),
                fechaNacimiento: formData.get('fechaNacimiento'),
                tipoUsuario: formData.get('tipoUsuario'),
                region: formData.get('region'),
                comuna: formData.get('comuna'),
                direccion: formData.get('direccion')
            };
            
            setTimeout(() => {
                //simular éxito
                alert(`¡Usuario "${usuarioData.nombre} ${usuarioData.apellidos}" creado exitosamente!`);
                
                //limpiar formulario
                form.reset();
                inputs.forEach(input => {
                    input.parentElement.classList.remove('success', 'error');
                });
                
                //restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Crear Usuario';
                
                //redirigir a usuarios
                setTimeout(() => {
                    window.location.href = 'admin-users.html';
                }, 1000);
                
            }, 2000);
        } else {
            //mostrar mensaje de error general
            alert('Por favor, corrige los errores en el formulario.');
        }
    });
});
