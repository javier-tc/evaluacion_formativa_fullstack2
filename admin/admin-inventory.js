//funcionalidad para la gestión de productos
document.addEventListener('DOMContentLoaded', function() {
    //inicializar funcionalidades de productos
    initializeProductsPage();
    
    //configurar búsqueda y filtros
    setupSearchAndFilters();
    
    //configurar paginación
    setupPagination();
});

function initializeProductsPage() {
    //cargar datos de productos (simulado)
    loadProductsData();
    
    //configurar eventos de la tabla
    setupTableEvents();
}

function loadProductsData() {
    //simular carga de datos desde API
    const products = [
        {
            id: 1,
            name: 'Led Zeppelin IV',
            artist: 'Led Zeppelin',
            category: 'rock',
            price: 25000,
            stock: 15,
            status: 'active',
            year: 1971,
            image: 'https://www.musicworld.cl/img/cms/cd%20vinilos/led%20zeppelin/d2IV.jpg'
        },
        {
            id: 2,
            name: 'Back To Black',
            artist: 'Amy Winehouse',
            category: 'pop',
            price: 30000,
            stock: 8,
            status: 'active',
            year: 2006,
            image: 'https://thesoundofvinyl.us/cdn/shop/products/Amy-Winehouse-Backl-To-Black-1LP-Vinyl.png?v=1661868011&width=1000'
        },
        {
            id: 3,
            name: 'Plastic Beach',
            artist: 'Gorillaz',
            category: 'pop',
            price: 28000,
            stock: 0,
            status: 'out-of-stock',
            year: 2010,
            image: 'https://cdn.webshopapp.com/shops/13847/files/405053016/gorillaz-plastic-beach-vinyl-2lp.jpg'
        },
        {
            id: 4,
            name: 'Dark Side of the Moon',
            artist: 'Pink Floyd',
            category: 'rock',
            price: 35000,
            stock: 22,
            status: 'active',
            year: 1973,
            image: 'https://www.musicworld.cl/img/cms/cd%20vinilos/pink%20floyd/dark%20side%20of%20the%20moon.jpg'
        },
        {
            id: 5,
            name: 'Abbey Road',
            artist: 'The Beatles',
            category: 'rock',
            price: 40000,
            stock: 12,
            status: 'active',
            year: 1969,
            image: 'https://www.musicworld.cl/img/cms/cd%20vinilos/the%20beatles/abbey%20road.jpg'
        }
    ];
    
    //almacenar datos globalmente
    window.productsData = products;
}

function setupTableEvents() {
    //configurar eventos de los botones de acción
    const tableBody = document.getElementById('productsTableBody');
    
    if (tableBody) {
        tableBody.addEventListener('click', function(e) {
            const target = e.target;
            
            //manejar clic en botón editar
            if (target.closest('.btn-edit')) {
                const productId = target.closest('tr').querySelector('td:first-child').textContent;
                editProduct(parseInt(productId));
            }
            
            //manejar clic en botón eliminar
            if (target.closest('.btn-delete')) {
                const productId = target.closest('tr').querySelector('td:first-child').textContent;
                deleteProduct(parseInt(productId));
            }
        });
    }
}

function setupSearchAndFilters() {
    const searchInput = document.getElementById('searchProducts');
    const categoryFilter = document.getElementById('filterCategory');
    const statusFilter = document.getElementById('filterStatus');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            console.log('searchInput', searchInput.value);
            filterProducts();
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterProducts();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterProducts();
        });
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('searchProducts').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const tableBody = document.getElementById('productsTableBody');
    
    if (!tableBody || !window.productsData) return;
    
    const filteredProducts = window.productsData.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                             product.artist.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        const matchesStatus = !statusFilter || product.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    //actualizar tabla
    updateProductsTable(filteredProducts);
}

function updateProductsTable(products) {
    const tableBody = document.getElementById('productsTableBody');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = createProductRow(product);
        tableBody.appendChild(row);
    });
    
    //actualizar contador
    updateProductCount(products.length);
}

function createProductRow(product) {
    const row = document.createElement('tr');
    
    const categoryClass = product.category;
    const statusClass = product.status;
    
    //verificar stock crítico
    const stockCritico = product.stockCritico || 5; //valor por defecto
    const stockAlerta = product.stock <= stockCritico ? 'stock-critico' : '';
    
    row.innerHTML = `
        <td>${product.id}</td>
        <td>
            <div class="product-info">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div>
                    <p class="product-name">${product.name}</p>
                    <p class="product-year">${product.year}</p>
                </div>
            </div>
        </td>
        <td>${product.artist}</td>
        <td><span class="category-badge ${categoryClass}">${getCategoryDisplayName(product.category)}</span></td>
        <td>$${product.price.toLocaleString()}</td>
        <td class="${stockAlerta}">${product.stock}</td>
        <td><span class="status-badge ${statusClass}">${getStatusDisplayName(product.status)}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn-edit" title="Editar Producto">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" title="Eliminar Producto">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    //mostrar alerta si el stock es crítico
    if (product.stock <= stockCritico) {
        setTimeout(() => {
            alert(`¡ALERTA! El producto "${product.name}" tiene stock crítico (${product.stock} unidades). Stock crítico: ${stockCritico}`);
        }, 100);
    }
    
    return row;
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'rock': 'Rock',
        'pop': 'Pop',
        'jazz': 'Jazz',
        'classical': 'Clásica'
    };
    return categoryNames[category] || category;
}

function getStatusDisplayName(status) {
    const statusNames = {
        'active': 'Activo',
        'inactive': 'Inactivo',
        'out-of-stock': 'Sin Stock'
    };
    return statusNames[status] || status;
}

function updateProductCount(count) {
    const sectionHeader = document.querySelector('.section-header h2');
    if (sectionHeader) {
        sectionHeader.textContent = `Inventario de Productos (${count})`;
    }
}

//funciones de acción
function editProduct(productId) {
    //redirigir a la página de edición con el ID del producto
    window.location.href = `admin-edit-product.html?id=${productId}`;
}

function deleteProduct(productId) {
    //mostrar confirmación antes de eliminar
    if (confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
        //simular eliminación
        const productIndex = window.productsData.findIndex(product => product.id === productId);
        
        if (productIndex !== -1) {
            window.productsData.splice(productIndex, 1);
            
            //actualizar tabla
            filterProducts();
            
            showMessage('Producto eliminado correctamente', 'success');
        } else {
            showMessage('Error al eliminar el producto', 'error');
        }
    }
}


