//validaciones del formulario de editar producto
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('editProductForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    //cargar datos del producto a editar (simulado)
    cargarDatosProducto();
    
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
    
    //cargar datos del producto (simulado)
    function cargarDatosProducto() {
        //datos simulados del producto
        const productoData = {
            codigoProducto: 'VIN001',
            productName: 'Led Zeppelin IV',
            description: 'El cuarto álbum de estudio de Led Zeppelin, considerado uno de los mejores álbumes de rock de todos los tiempos.',
            price: 25000,
            stock: 15,
            stockCritico: 5,
            category: 'rock',
            imageUrl: 'https://www.musicworld.cl/img/cms/cd%20vinilos/led%20zeppelin/d2IV.jpg'
        };
        
        //llenar formulario con datos
        document.getElementById('codigoProducto').value = productoData.codigoProducto;
        document.getElementById('productName').value = productoData.productName;
        document.getElementById('description').value = productoData.description;
        document.getElementById('price').value = productoData.price;
        document.getElementById('stock').value = productoData.stock;
        document.getElementById('stockCritico').value = productoData.stockCritico;
        document.getElementById('category').value = productoData.category;
        document.getElementById('imageUrl').value = productoData.imageUrl;
    }
    
    //validación del código producto
    function validateCodigoProducto(codigo) {
        if (codigo.trim() === '') {
            return 'El código producto es obligatorio';
        }
        if (codigo.length < 3) {
            return 'El código producto debe tener al menos 3 caracteres';
        }
        return '';
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
    
    //validación de la descripción
    function validateDescripcion(descripcion) {
        if (descripcion.length > 500) {
            return 'La descripción no puede exceder 500 caracteres';
        }
        return '';
    }
    
    //validación del precio
    function validatePrecio(precio) {
        if (precio === '' || precio === null) {
            return 'El precio es obligatorio';
        }
        const precioNum = parseFloat(precio);
        if (isNaN(precioNum)) {
            return 'El precio debe ser un número válido';
        }
        if (precioNum < 0) {
            return 'El precio no puede ser negativo';
        }
        return '';
    }
    
    //validación del stock
    function validateStock(stock) {
        if (stock === '' || stock === null) {
            return 'El stock es obligatorio';
        }
        const stockNum = parseInt(stock);
        if (isNaN(stockNum)) {
            return 'El stock debe ser un número entero válido';
        }
        if (stockNum < 0) {
            return 'El stock no puede ser negativo';
        }
        return '';
    }
    
    //validación del stock crítico
    function validateStockCritico(stockCritico, stock) {
        if (stockCritico === '' || stockCritico === null) {
            return ''; //stock crítico es opcional
        }
        const stockCriticoNum = parseInt(stockCritico);
        if (isNaN(stockCriticoNum)) {
            return 'El stock crítico debe ser un número entero válido';
        }
        if (stockCriticoNum < 0) {
            return 'El stock crítico no puede ser negativo';
        }
        const stockNum = parseInt(stock);
        if (!isNaN(stockNum) && stockCriticoNum > stockNum) {
            return 'El stock crítico no puede ser mayor al stock disponible';
        }
        return '';
    }
    
    //validación de la categoría
    function validateCategoria(categoria) {
        if (categoria === '') {
            return 'La categoría es obligatoria';
        }
        return '';
    }
    
    //validación de la URL de imagen
    function validateImageUrl(url) {
        if (url.trim() === '') {
            return ''; //imagen es opcional
        }
        const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
        if (!urlRegex.test(url)) {
            return 'La URL debe ser válida y apuntar a una imagen (jpg, png, gif, webp)';
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
            case 'codigoProducto':
                errorMessage = validateCodigoProducto(value);
                break;
            case 'productName':
                errorMessage = validateNombre(value);
                break;
            case 'description':
                errorMessage = validateDescripcion(value);
                break;
            case 'price':
                errorMessage = validatePrecio(value);
                break;
            case 'stock':
                errorMessage = validateStock(value);
                //si hay stock crítico, también validarlo
                const stockCriticoInput = document.getElementById('stockCritico');
                if (stockCriticoInput && stockCriticoInput.value.trim() !== '') {
                    validateField(stockCriticoInput);
                }
                break;
            case 'stockCritico':
                const stockInput = document.getElementById('stock');
                errorMessage = validateStockCritico(value, stockInput.value);
                break;
            case 'category':
                errorMessage = validateCategoria(value);
                break;
            case 'imageUrl':
                errorMessage = validateImageUrl(value);
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
            //simular proceso de actualización de producto
            const submitBtn = form.querySelector('.btn-primary');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            
            //obtener datos del formulario
            const formData = new FormData(form);
            const productoData = {
                codigoProducto: formData.get('codigoProducto'),
                nombre: formData.get('productName'),
                descripcion: formData.get('description'),
                precio: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock')),
                stockCritico: formData.get('stockCritico') ? parseInt(formData.get('stockCritico')) : 0,
                categoria: formData.get('category'),
                imagen: formData.get('imageUrl') || 'https://via.placeholder.com/300x300?text=Sin+Imagen'
            };
            
            setTimeout(() => {
                //simular éxito
                alert(`¡Producto "${productoData.nombre}" actualizado exitosamente!`);
                
                //restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
                
                //redirigir al inventario
                setTimeout(() => {
                    window.location.href = 'admin-inventory.html';
                }, 1000);
                
            }, 2000);
        } else {
            //mostrar mensaje de error general
            alert('Por favor, corrige los errores en el formulario.');
        }
    });
});
