//archivo javascript para la funcionalidad de crear nuevo producto
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('newProductForm');
    
    //manejo del envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        //obtener datos del formulario
        const formData = new FormData(form);
        const productData = {
            name: formData.get('productName'),
            artist: formData.get('artist'),
            year: parseInt(formData.get('year')),
            category: formData.get('category'),
            price: parseInt(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            imageUrl: formData.get('imageUrl'),
            status: formData.get('status'),
            description: formData.get('description'),
            tracklist: formData.get('tracklist')
        };
        
        //validar datos requeridos
        if (!validateProductData(productData)) {
            return;
        }
        
        //simular creación del producto
        createProduct(productData);
    });
    
    //validación de datos del producto
    function validateProductData(data) {
        if (!data.name || data.name.trim() === '') {
            // showAlert('El nombre del producto es requerido', 'error');
            return false;
        }
        
        if (!data.artist || data.artist.trim() === '') {
            // showAlert('El artista es requerido', 'error');
            return false;
        }
        
        if (!data.year || data.year < 1900 || data.year > 2025) {
            // showAlert('El año debe estar entre 1900 y 2025', 'error');
            return false;
        }
        
        if (!data.category) {
            // showAlert('Debe seleccionar una categoría', 'error');
            return false;
        }
        
        if (!data.price || data.price <= 0) {
            // showAlert('El precio debe ser mayor a 0', 'error');
            return false;
        }
        
        if (data.stock < 0) {
            // showAlert('El stock no puede ser negativo', 'error');
            return false;
        }
        
        if (!data.imageUrl || !isValidUrl(data.imageUrl)) {
            // showAlert('Debe proporcionar una URL válida para la imagen', 'error');
            return false;
        }
        
        return true;
    }
    
    //validar URL
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    //crear producto
    function createProduct(productData) {
        //simular llamada a API
        console.log('Creando producto:', productData);
        
        //mostrar indicador de carga
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';
        submitBtn.disabled = true;
        
        //simular delay de red
        setTimeout(() => {
            //simular éxito
            // showAlert('Producto creado exitosamente', 'success');
            
            //limpiar formulario
            form.reset();
            
            //restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            //redirigir al inventario después de un breve delay
            setTimeout(() => {
                window.location.href = 'admin-inventory.html';
            }, 1500);
            
        }, 2000);
    }
    
    
    
    //formateo automático del precio
    const priceInput = document.getElementById('price');
    priceInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value) {
            value = parseInt(value).toLocaleString('es-CL');
            this.value = value;
        }
    });
    
});
