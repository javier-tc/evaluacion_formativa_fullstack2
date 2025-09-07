//sistema de productos dinámico
class ProductManager {
    constructor() {
        this.productos = [
            {
                id: 1,
                nombre: 'Led Zeppelin IV',
                artista: 'Led Zeppelin',
                genero: 'Rock',
                año: 1971,
                precio: 25000,
                imagen: 'https://www.musicworld.cl/img/cms/cd%20vinilos/led%20zeppelin/d2IV.jpg',
                categoria: 'rock',
                stock: 15,
                stockCritico: 5,
                descripcion: 'El cuarto álbum de estudio de Led Zeppelin, considerado uno de los mejores álbumes de rock de todos los tiempos.'
            },
            {
                id: 2,
                nombre: 'Back To Black',
                artista: 'Amy Winehouse',
                genero: 'Pop',
                año: 2006,
                precio: 30000,
                imagen: 'https://thesoundofvinyl.us/cdn/shop/products/Amy-Winehouse-Backl-To-Black-1LP-Vinyl.png?v=1661868011&width=1000',
                categoria: 'pop',
                stock: 8,
                stockCritico: 3,
                descripcion: 'El segundo y último álbum de estudio de Amy Winehouse, ganador de múltiples premios Grammy.'
            },
            {
                id: 3,
                nombre: 'Plastic Beach',
                artista: 'Gorillaz',
                genero: 'Pop',
                año: 2010,
                precio: 28000,
                imagen: 'https://cdn.webshopapp.com/shops/13847/files/405053016/gorillaz-plastic-beach-vinyl-2lp.jpg',
                categoria: 'pop',
                stock: 12,
                stockCritico: 4,
                descripcion: 'El tercer álbum de estudio de Gorillaz, una obra conceptual sobre la contaminación marina.'
            },
            {
                id: 4,
                nombre: 'Kind of Blue',
                artista: 'Miles Davis',
                genero: 'Jazz',
                año: 1959,
                precio: 35000,
                imagen: 'https://cdn.shopify.com/s/files/1/0264/4075/2726/products/kind-of-blue-miles-davis-vinyl-record.jpg',
                categoria: 'jazz',
                stock: 6,
                stockCritico: 2,
                descripcion: 'Considerado el álbum de jazz más vendido de la historia y una obra maestra del género.'
            },
            {
                id: 5,
                nombre: 'The Dark Side of the Moon',
                artista: 'Pink Floyd',
                genero: 'Rock',
                año: 1973,
                precio: 32000,
                imagen: 'https://cdn.shopify.com/s/files/1/0264/4075/2726/products/dark-side-of-the-moon-pink-floyd-vinyl-record.jpg',
                categoria: 'rock',
                stock: 10,
                stockCritico: 3,
                descripcion: 'El octavo álbum de estudio de Pink Floyd, una obra conceptual sobre la vida y la muerte.'
            },
            {
                id: 6,
                nombre: 'Symphony No. 9',
                artista: 'Beethoven',
                genero: 'Clásica',
                año: 1824,
                precio: 40000,
                imagen: 'https://cdn.shopify.com/s/files/1/0264/4075/2726/products/beethoven-symphony-no-9-vinyl-record.jpg',
                categoria: 'clasica',
                stock: 4,
                stockCritico: 1,
                descripcion: 'La novena sinfonía de Beethoven, conocida como "Oda a la Alegría", una de las obras más famosas de la música clásica.'
            },
            {
                id: 7,
                nombre: 'Abbey Road',
                artista: 'The Beatles',
                genero: 'Rock',
                año: 1969,
                precio: 38000,
                imagen: 'https://ukstore.thebeatles.com/cdn/shop/files/abbey_road_1.png?v=1751901427',
                categoria: 'rock',
                stock: 9,
                stockCritico: 3,
                descripcion: 'Abbey Road es el duodécimo álbum de estudio de The Beatles, lanzado en el Reino Unido el 26 de septiembre de 1969 por Apple Records.'
            },
            {
                id: 8,
                nombre: 'Thriller',
                artista: 'Michael Jackson',
                genero: 'Pop',
                año: 1982,
                precio: 45000,
                imagen: 'https://thesoundofvinyl.com/cdn/shop/files/SharedImage-135521.png?v=1748042884',
                categoria: 'pop',
                stock: 6,
                stockCritico: 2,
                descripcion: 'Thriller es el sexto álbum de estudio del cantante estadounidense Michael Jackson, publicado el 29 de noviembre de 1982 por Epic Records.'
            },
            {
                id: 9,
                nombre: 'Rumours',
                artista: 'Fleetwood Mac',
                genero: 'Rock',
                año: 1977,
                precio: 33000,
                imagen: 'https://store.warnermusic.ca/cdn/shop/files/record_mockup_ecdd1143-314b-4d83-aaba-b60c647c15e1_1024x1024.jpg?v=1748278596',
                categoria: 'rock',
                stock: 12,
                stockCritico: 4,
                descripcion: 'Rumours es el undécimo álbum de estudio de la banda británica de rock Fleetwood Mac, publicado en 1977 por Warner Bros. Records.'
            },
            {
                id: 10,
                nombre: 'Swag',
                artista: 'Justin Bieber',
                genero: 'Pop',
                año: 2025,
                precio: 55990,
                imagen: 'https://shop.universalmusic.dk/cdn/shop/files/Horace_2LP_4.png?v=1752226281&width=2000',
                categoria: 'pop',
                stock: 8,
                stockCritico: 3,
                descripcion: 'Swag es el séptimo álbum de estudio del cantautor canadiense Justin Bieber.'
            },
            {
                id: 11,
                nombre: 'Appetite For Destruction',
                artista: 'Guns N\' Roses',
                genero: 'Rock',
                año: 2025,
                precio: 49990,
                imagen: 'https://www.baba.es/51399-large_default/guns-n-roses-appetite-for-destruction-lp-vinilo-red-indies.jpg',
                categoria: 'rock',
                stock: 15,
                stockCritico: 5,
                descripcion: 'Álbum de debut de la legendaria banda de hard rock. Uno de los discos más aclamados por crítica y público y más vendidos de todos los tiempos.'
            },
            {
                id: 12,
                nombre: 'Eternal Sunshine',
                artista: 'Ariana Grande',
                genero: 'Pop',
                año: 2024,
                precio: 44990,
                imagen: 'https://umusicstore.cl/cdn/shop/files/eternal_sunshine_1_2.png?v=1726244738&width=800',
                categoria: 'pop',
                stock: 7,
                stockCritico: 3,
                descripcion: 'Eternal Sunshine es el séptimo álbum de estudio de la cantautora estadounidense Ariana Grande. Es su primer álbum en tres años, tras el lanzamiento de Positions (2020).'
            }
        ];
        this.categoriaActual = 'todos';
        this.init();
    }

    //inicializar el sistema de productos
    init() {
        this.renderProductos();
        this.setupFiltros();
        this.checkStockCritico();
    }

    //renderizar productos en el grid
    renderProductos() {
        const productosGrid = document.getElementById('productos-grid');
        if (!productosGrid) return;

        const productosFiltrados = this.categoriaActual === 'todos' 
            ? this.productos 
            : this.productos.filter(p => p.categoria === this.categoriaActual);

        productosGrid.innerHTML = '';

        productosFiltrados.forEach(producto => {
            const productoCard = this.createProductCard(producto);
            productosGrid.appendChild(productoCard);
        });
    }

    //crear tarjeta de producto
    createProductCard(producto) {
        const article = document.createElement('article');
        article.className = 'producto-card';
        article.setAttribute('data-categoria', producto.categoria);

        //verificar si el stock está crítico
        const stockClass = producto.stock <= producto.stockCritico ? 'stock-critico' : '';
        const stockMessage = producto.stock <= producto.stockCritico ? 
            `<span class="stock-warning">¡Últimas unidades!</span>` : '';

        article.innerHTML = `
            <div class="producto-imagen">
                <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                <div class="producto-overlay">
                    <button class="ver-detalle-btn" onclick="productManager.verDetalle(${producto.id})">Ver Detalle</button>
                </div>
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p class="artista">${producto.artista}</p>
                <p class="genero">${producto.genero} - ${producto.año}</p>
                <span class="precio">$${producto.precio.toLocaleString()}</span>
                ${stockMessage}
                <button class="agregar-carrito-btn ${stockClass}" 
                        onclick="productManager.agregarAlCarrito(${producto.id})"
                        ${producto.stock === 0 ? 'disabled' : ''}>
                    ${producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
            </div>
        `;

        return article;
    }

    //configurar filtros de categoría
    setupFiltros() {
        const filtroBtns = document.querySelectorAll('.filtro-btn');
        
        filtroBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                //remover clase active de todos los botones
                filtroBtns.forEach(b => b.classList.remove('active'));
                //agregar clase active al botón clickeado
                e.target.classList.add('active');
                
                //actualizar categoría actual
                this.categoriaActual = e.target.getAttribute('data-categoria');
                
                //renderizar productos filtrados
                this.renderProductos();
            });
        });
    }

    //ver detalle del producto
    verDetalle(productoId) {
        const producto = this.productos.find(p => p.id === productoId);
        if (producto) {
            //guardar producto en sessionStorage para el detalle
            sessionStorage.setItem('productoDetalle', JSON.stringify(producto));
            window.location.href = `detalle-producto.html?id=${productoId}`;
        }
    }

    //agregar producto al carrito
    agregarAlCarrito(productoId) {
        const producto = this.productos.find(p => p.id === productoId);
        if (!producto) return;

        if (producto.stock === 0) {
            alert('Este producto no está disponible en este momento.');
            return;
        }

        //usar el sistema de carrito existente
        if (typeof cart !== 'undefined') {
            cart.addToCart(
                producto.id,
                producto.nombre,
                producto.precio,
                producto.imagen,
                producto.artista
            );
            
            //reducir stock
            producto.stock--;
            
            //verificar stock crítico
            this.checkStockCritico();
            
            //actualizar renderizado
            this.renderProductos();
            
            alert(`${producto.nombre} agregado al carrito!`);
        }
    }

    //verificar stock crítico
    checkStockCritico() {
        const productosCriticos = this.productos.filter(p => p.stock <= p.stockCritico && p.stock > 0);
        
        if (productosCriticos.length > 0) {
            console.log('Productos con stock crítico:', productosCriticos.map(p => p.nombre));
        }
    }

    //obtener producto por ID
    getProductoById(id) {
        return this.productos.find(p => p.id === id);
    }

    //obtener todos los productos
    getAllProductos() {
        return this.productos;
    }

    //agregar nuevo producto (para administrador)
    agregarProducto(producto) {
        const nuevoId = Math.max(...this.productos.map(p => p.id)) + 1;
        producto.id = nuevoId;
        this.productos.push(producto);
        this.renderProductos();
        return producto;
    }

    //actualizar producto (para administrador)
    actualizarProducto(id, datosActualizados) {
        const index = this.productos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.productos[index] = { ...this.productos[index], ...datosActualizados };
            this.renderProductos();
            return this.productos[index];
        }
        return null;
    }

    //eliminar producto (para administrador)
    eliminarProducto(id) {
        const index = this.productos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.productos.splice(index, 1);
            this.renderProductos();
            return true;
        }
        return false;
    }
}

//inicializar el gestor de productos
const productManager = new ProductManager();
