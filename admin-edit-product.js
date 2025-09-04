//archivo javascript para la funcionalidad de editar producto
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('editProductForm');
    
    //obtener ID del producto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        showAlert('No se especificó un producto para editar', 'error');
        setTimeout(() => {
            window.location.href = 'admin-inventory.html';
        }, 2000);
        return;
    }
    
    //cargar datos del producto
    loadProductData(productId);
    
    //manejo del envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        //obtener datos del formulario
        const formData = new FormData(form);
        const productData = {
            id: formData.get('productId'),
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
        
        //simular actualización del producto
        updateProduct(productData);
    });
    
    //cargar datos del producto
    function loadProductData(id) {
        //simular llamada a API para obtener datos del producto
        console.log('Cargando producto con ID:', id);
        
        //datos de ejemplo basados en el inventario existente
        const productData = getProductById(id);
        
        if (!productData) {
            showAlert('Producto no encontrado', 'error');
            setTimeout(() => {
                window.location.href = 'admin-inventory.html';
            }, 2000);
            return;
        }
        
        //llenar formulario con datos del producto
        fillFormWithProductData(productData);
    }
    
    //obtener producto por ID (simulación de base de datos)
    function getProductById(id) {
        const products = {
            '1': {
                id: '1',
                name: 'Led Zeppelin IV',
                artist: 'Led Zeppelin',
                year: 1971,
                category: 'rock',
                price: 25000,
                stock: 15,
                imageUrl: 'https://www.musicworld.cl/img/cms/cd%20vinilos/led%20zeppelin/d2IV.jpg',
                status: 'active',
                description: 'Cuarto álbum de estudio de Led Zeppelin, considerado uno de los mejores álbumes de rock de todos los tiempos.',
                tracklist: 'Black Dog\nRock and Roll\nThe Battle of Evermore\nStairway to Heaven\nMisty Mountain Hop\nFour Sticks\nGoing to California\nWhen the Levee Breaks'
            },
            '2': {
                id: '2',
                name: 'Back To Black',
                artist: 'Amy Winehouse',
                year: 2006,
                category: 'pop',
                price: 30000,
                stock: 8,
                imageUrl: 'https://thesoundofvinyl.us/cdn/shop/products/Amy-Winehouse-Backl-To-Black-1LP-Vinyl.png?v=1661868011&width=1000',
                status: 'active',
                description: 'Segundo álbum de estudio de Amy Winehouse, que le valió múltiples premios Grammy.',
                tracklist: 'Rehab\nYou Know I\'m No Good\nMe & Mr Jones\nJust Friends\nBack to Black\nLove Is a Losing Game\nTears Dry on Their Own\nWake Up Alone\nSome Unholy War\nHe Can Only Hold Her\nAddicted'
            },
            '3': {
                id: '3',
                name: 'Plastic Beach',
                artist: 'Gorillaz',
                year: 2010,
                category: 'pop',
                price: 28000,
                stock: 0,
                imageUrl: 'https://cdn.webshopapp.com/shops/13847/files/405053016/gorillaz-plastic-beach-vinyl-2lp.jpg',
                status: 'out-of-stock',
                description: 'Tercer álbum de estudio de Gorillaz, con colaboraciones de artistas como Snoop Dogg, Mos Def y Lou Reed.',
                tracklist: 'Orchestral Intro\nWelcome to the World of the Plastic Beach\nWhite Flag\nRhinestone Eyes\nStylo\nSuperfast Jellyfish\nEmpire Ants\nGlitter Freeze\nSome Kind of Nature\nOn Melancholy Hill\nBroken\nSweepstakes\nPlastic Beach\nTo Binge\nCloud of Unknowing\nPirate Jet'
            },
            '4': {
                id: '4',
                name: 'Dark Side of the Moon',
                artist: 'Pink Floyd',
                year: 1973,
                category: 'rock',
                price: 35000,
                stock: 22,
                imageUrl: 'https://www.musicworld.cl/img/cms/cd%20vinilos/pink%20floyd/dark%20side%20of%20the%20moon.jpg',
                status: 'active',
                description: 'Octavo álbum de estudio de Pink Floyd, uno de los álbumes más vendidos de la historia.',
                tracklist: 'Speak to Me\nBreathe (In the Air)\nOn the Run\nTime\nThe Great Gig in the Sky\nMoney\nUs and Them\nAny Colour You Like\nBrain Damage\nEclipse'
            },
            '5': {
                id: '5',
                name: 'Abbey Road',
                artist: 'The Beatles',
                year: 1969,
                category: 'rock',
                price: 40000,
                stock: 12,
                imageUrl: 'https://www.musicworld.cl/img/cms/cd%20vinilos/the%20beatles/abbey%20road.jpg',
                status: 'active',
                description: 'Undécimo álbum de estudio de The Beatles, el último álbum grabado por la banda.',
                tracklist: 'Come Together\nSomething\nMaxwell\'s Silver Hammer\nOh! Darling\nOctopus\'s Garden\nI Want You (She\'s So Heavy)\nHere Comes the Sun\nBecause\nYou Never Give Me Your Money\nSun King\nMean Mr. Mustard\nPolythene Pam\nShe Came In Through the Bathroom Window\nGolden Slumbers\nCarry That Weight\nThe End\nHer Majesty'
            }
        };
        
        return products[id];
    }
    
    //llenar formulario con datos del producto
    function fillFormWithProductData(product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('artist').value = product.artist;
        document.getElementById('year').value = product.year;
        document.getElementById('category').value = product.category;
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;
        document.getElementById('imageUrl').value = product.imageUrl;
        document.getElementById('status').value = product.status;
        document.getElementById('description').value = product.description || '';
        document.getElementById('tracklist').value = product.tracklist || '';
    }
    
    //validación de datos del producto
    function validateProductData(data) {
        if (!data.name || data.name.trim() === '') {
            showAlert('El nombre del producto es requerido', 'error');
            return false;
        }
        
        if (!data.artist || data.artist.trim() === '') {
            showAlert('El artista es requerido', 'error');
            return false;
        }
        
        if (!data.year || data.year < 1900 || data.year > 2024) {
            showAlert('El año debe estar entre 1900 y 2024', 'error');
            return false;
        }
        
        if (!data.category) {
            showAlert('Debe seleccionar una categoría', 'error');
            return false;
        }
        
        if (!data.price || data.price <= 0) {
            showAlert('El precio debe ser mayor a 0', 'error');
            return false;
        }
        
        if (data.stock < 0) {
            showAlert('El stock no puede ser negativo', 'error');
            return false;
        }
        
        if (!data.imageUrl || !isValidUrl(data.imageUrl)) {
            showAlert('Debe proporcionar una URL válida para la imagen', 'error');
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
    
    //actualizar producto
    function updateProduct(productData) {
        //simular llamada a API
        console.log('Actualizando producto:', productData);
        
        //mostrar indicador de carga
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        submitBtn.disabled = true;
        
        //simular delay de red
        setTimeout(() => {
            //simular éxito
            showAlert('Producto actualizado exitosamente', 'success');
            
            //restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            //redirigir al inventario después de un breve delay
            setTimeout(() => {
                window.location.href = 'admin-inventory.html';
            }, 1500);
            
        }, 2000);
    }
    
    //mostrar alertas
    function showAlert(message, type) {
        //crear elemento de alerta
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        //insertar al inicio del contenido
        const content = document.querySelector('.admin-content');
        content.insertBefore(alert, content.firstChild);
        
        //remover automáticamente después de 5 segundos
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }
    
    //previsualización de imagen
    const imageUrlInput = document.getElementById('imageUrl');
    imageUrlInput.addEventListener('blur', function() {
        const url = this.value.trim();
        if (url && isValidUrl(url)) {
            //aquí se podría agregar una previsualización de la imagen
            console.log('URL de imagen válida:', url);
        }
    });
    
    //formateo automático del precio
    const priceInput = document.getElementById('price');
    priceInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value) {
            value = parseInt(value).toLocaleString('es-CL');
            this.value = value;
        }
    });
    
    //validación en tiempo real del año
    const yearInput = document.getElementById('year');
    yearInput.addEventListener('input', function() {
        const year = parseInt(this.value);
        if (year < 1900 || year > 2024) {
            this.setCustomValidity('El año debe estar entre 1900 y 2024');
        } else {
            this.setCustomValidity('');
        }
    });
});
