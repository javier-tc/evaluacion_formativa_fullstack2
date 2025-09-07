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
    
    //validación de datos del producto según requerimientos
    function validateProductData(data) {
        //validar código producto (requerido, texto, min 3 caracteres)
        const codigoProducto = formData.get('codigoProducto');
        if (!codigoProducto || codigoProducto.trim() === '') {
            alert('El código del producto es requerido');
            return false;
        }
        if (codigoProducto.length < 3) {
            alert('El código del producto debe tener al menos 3 caracteres');
            return false;
        }
        
        //validar nombre (requerido, max 100 caracteres)
        if (!data.name || data.name.trim() === '') {
            alert('El nombre del producto es requerido');
            return false;
        }
        if (data.name.length > 100) {
            alert('El nombre del producto no puede exceder 100 caracteres');
            return false;
        }
        
        //validar descripción (opcional, max 500 caracteres)
        if (data.description && data.description.length > 500) {
            alert('La descripción no puede exceder 500 caracteres');
            return false;
        }
        
        //validar precio (requerido, min 0, puede ser decimal)
        if (data.price === null || data.price === undefined || data.price < 0) {
            alert('El precio debe ser mayor o igual a 0');
            return false;
        }
        
        //validar stock (requerido, min 0, solo números enteros)
        if (data.stock === null || data.stock === undefined || data.stock < 0) {
            alert('El stock debe ser mayor o igual a 0');
            return false;
        }
        if (!Number.isInteger(data.stock)) {
            alert('El stock debe ser un número entero');
            return false;
        }
        
        //validar stock crítico (opcional, min 0, solo números enteros)
        const stockCritico = parseInt(formData.get('stockCritico'));
        if (stockCritico && stockCritico < 0) {
            alert('El stock crítico debe ser mayor o igual a 0');
            return false;
        }
        if (stockCritico && !Number.isInteger(stockCritico)) {
            alert('El stock crítico debe ser un número entero');
            return false;
        }
        
        //validar categoría (requerido)
        if (!data.category) {
            alert('Debe seleccionar una categoría');
            return false;
        }
        
        //validar imagen (opcional)
        if (data.imageUrl && !isValidUrl(data.imageUrl)) {
            alert('Debe proporcionar una URL válida para la imagen');
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
