//validaciones de usuarios según requerimientos
document.addEventListener('DOMContentLoaded', function() {
    //validaciones para formularios de usuarios
    const userForms = document.querySelectorAll('form[id*="user"], form[id*="User"]');
    
    userForms.forEach(form => {
        if (form) {
            setupUserFormValidation(form);
        }
    });
});

//función para configurar validaciones de formulario de usuario
function setupUserFormValidation(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    //validación en tiempo real
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateUserField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.parentElement.classList.contains('error')) {
                validateUserField(this);
            }
        });
    });
    
    //validación al enviar formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        inputs.forEach(input => {
            validateUserField(input);
            if (input.parentElement.classList.contains('error')) {
                isValid = false;
            }
        });
        
        if (isValid) {
            //procesar formulario
            processUserForm(form);
        } else {
            alert('Por favor, corrige los errores en el formulario.');
        }
    });
}

//función para validar un campo específico de usuario
function validateUserField(input) {
    const value = input.value;
    const name = input.name;
    let errorMessage = '';
    
    switch (name) {
        case 'run':
            errorMessage = validateRun(value);
            break;
        case 'nombre':
            errorMessage = validateNombre(value);
            break;
        case 'apellidos':
            errorMessage = validateApellidos(value);
            break;
        case 'correo':
        case 'email':
            errorMessage = validateCorreo(value);
            break;
        case 'fechaNacimiento':
            errorMessage = validateFechaNacimiento(value);
            break;
        case 'direccion':
            errorMessage = validateDireccion(value);
            break;
        case 'region':
            errorMessage = validateRegion(value);
            break;
        case 'comuna':
            errorMessage = validateComuna(value);
            break;
        case 'tipoUsuario':
            errorMessage = validateTipoUsuario(value);
            break;
    }
    
    if (errorMessage) {
        showUserFieldError(input, errorMessage);
    } else {
        showUserFieldSuccess(input);
    }
}

//validación del RUN
function validateRun(run) {
    if (!run || run.trim() === '') {
        return 'El RUN es requerido';
    }
    
    //remover puntos y guiones
    const cleanRun = run.replace(/[.-]/g, '');
    
    if (cleanRun.length < 7 || cleanRun.length > 9) {
        return 'El RUN debe tener entre 7 y 9 caracteres';
    }
    
    //validar formato: números + dígito verificador
    const runRegex = /^[0-9]{7,8}[0-9Kk]$/;
    if (!runRegex.test(cleanRun)) {
        return 'Formato de RUN inválido. Ejemplo: 19011022K';
    }
    
    return '';
}

//validación del nombre
function validateNombre(nombre) {
    if (!nombre || nombre.trim() === '') {
        return 'El nombre es requerido';
    }
    
    if (nombre.length > 50) {
        return 'El nombre no puede exceder 50 caracteres';
    }
    
    return '';
}

//validación de apellidos
function validateApellidos(apellidos) {
    if (!apellidos || apellidos.trim() === '') {
        return 'Los apellidos son requeridos';
    }
    
    if (apellidos.length > 100) {
        return 'Los apellidos no pueden exceder 100 caracteres';
    }
    
    return '';
}

//validación del correo
function validateCorreo(correo) {
    if (!correo || correo.trim() === '') {
        return 'El correo es requerido';
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

//validación de fecha de nacimiento
function validateFechaNacimiento(fecha) {
    if (!fecha) {
        return ''; //opcional
    }
    
    const fechaObj = new Date(fecha);
    const hoy = new Date();
    
    if (fechaObj > hoy) {
        return 'La fecha de nacimiento no puede ser futura';
    }
    
    //verificar que sea mayor de edad (18 años)
    const edad = hoy.getFullYear() - fechaObj.getFullYear();
    if (edad < 18) {
        return 'Debe ser mayor de 18 años';
    }
    
    return '';
}

//validación de dirección
function validateDireccion(direccion) {
    if (!direccion || direccion.trim() === '') {
        return 'La dirección es requerida';
    }
    
    if (direccion.length > 300) {
        return 'La dirección no puede exceder 300 caracteres';
    }
    
    return '';
}

//validación de región
function validateRegion(region) {
    if (!region) {
        return 'Debe seleccionar una región';
    }
    
    return '';
}

//validación de comuna
function validateComuna(comuna) {
    if (!comuna) {
        return 'Debe seleccionar una comuna';
    }
    
    return '';
}

//validación de tipo de usuario
function validateTipoUsuario(tipoUsuario) {
    if (!tipoUsuario) {
        return 'Debe seleccionar un tipo de usuario';
    }
    
    const tiposValidos = ['Administrador', 'Vendedor', 'Cliente'];
    if (!tiposValidos.includes(tipoUsuario)) {
        return 'Tipo de usuario inválido';
    }
    
    return '';
}

//función para mostrar error en campo
function showUserFieldError(input, message) {
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

//función para mostrar éxito en campo
function showUserFieldSuccess(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

//función para procesar formulario de usuario
function processUserForm(form) {
    const formData = new FormData(form);
    const userData = {
        run: formData.get('run'),
        nombre: formData.get('nombre'),
        apellidos: formData.get('apellidos'),
        correo: formData.get('correo') || formData.get('email'),
        fechaNacimiento: formData.get('fechaNacimiento'),
        direccion: formData.get('direccion'),
        region: formData.get('region'),
        comuna: formData.get('comuna'),
        tipoUsuario: formData.get('tipoUsuario')
    };
    
    console.log('Datos del usuario:', userData);
    
    //simular procesamiento
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('Usuario procesado exitosamente');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        //remover clases de validación
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.parentElement.classList.remove('success', 'error');
        });
    }, 2000);
}
