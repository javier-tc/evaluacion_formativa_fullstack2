//sistema de productos con arreglo JavaScript
document.addEventListener('DOMContentLoaded', function() {
    //arreglo de productos
    const productos = [
        {
            id: 1,
            nombre: 'Led Zeppelin IV',
            artista: 'Led Zeppelin',
            categoria: 'rock',
            precio: 25000,
            año: 1971,
            imagen: 'https://www.musicworld.cl/img/cms/cd%20vinilos/led%20zeppelin/d2IV.jpg',
            stock: 15,
            descripcion: 'Cuarto álbum de estudio de Led Zeppelin, considerado uno de los mejores álbumes de rock de todos los tiempos.',
            tracklist: ['Black Dog', 'Rock and Roll', 'The Battle of Evermore', 'Stairway to Heaven', 'Misty Mountain Hop', 'Four Sticks', 'Going to California', 'When the Levee Breaks']
        },
        {
            id: 2,
            nombre: 'Back To Black',
            artista: 'Amy Winehouse',
            categoria: 'pop',
            precio: 30000,
            año: 2006,
            imagen: 'https://thesoundofvinyl.us/cdn/shop/products/Amy-Winehouse-Backl-To-Black-1LP-Vinyl.png?v=1661868011&width=1000',
            stock: 8,
            descripcion: 'Segundo álbum de estudio de Amy Winehouse, que le valió múltiples premios Grammy.',
            tracklist: ['Rehab', 'You Know I\'m No Good', 'Me & Mr Jones', 'Just Friends', 'Back to Black', 'Love Is a Losing Game', 'Tears Dry on Their Own', 'Wake Up Alone', 'Some Unholy War', 'He Can Only Hold Her', 'Addicted']
        },
        {
            id: 3,
            nombre: 'Plastic Beach',
            artista: 'Gorillaz',
            categoria: 'pop',
            precio: 28000,
            año: 2010,
            imagen: 'https://cdn.webshopapp.com/shops/13847/files/405053016/gorillaz-plastic-beach-vinyl-2lp.jpg',
            stock: 0,
            descripcion: 'Tercer álbum de estudio de Gorillaz, con colaboraciones de artistas como Snoop Dogg, Mos Def y Lou Reed.',
            tracklist: ['Orchestral Intro', 'Welcome to the World of the Plastic Beach', 'White Flag', 'Rhinestone Eyes', 'Stylo', 'Superfast Jellyfish', 'Empire Ants', 'Glitter Freeze', 'Some Kind of Nature', 'On Melancholy Hill', 'Broken', 'Sweepstakes', 'Plastic Beach', 'To Binge', 'Cloud of Unknowing', 'Pirate Jet']
        },
        {
            id: 4,
            nombre: 'Kind of Blue',
            artista: 'Miles Davis',
            categoria: 'jazz',
            precio: 35000,
            año: 1959,
            imagen: 'https://cdn.shopify.com/s/files/1/0264/4075/2726/products/kind-of-blue-miles-davis-vinyl-record.jpg',
            stock: 12,
            descripcion: 'Álbum icónico de jazz modal de Miles Davis, considerado uno de los mejores álbumes de jazz de la historia.',
            tracklist: ['So What', 'Freddie Freeloader', 'Blue in Green', 'All Blues', 'Flamenco Sketches']
        },
        {
            id: 5,
            nombre: 'The Dark Side of the Moon',
            artista: 'Pink Floyd',
            categoria: 'rock',
            precio: 32000,
            año: 1973,
            imagen: 'https://cdn.shopify.com/s/files/1/0264/4075/2726/products/dark-side-of-the-moon-pink-floyd-vinyl-record.jpg',
            stock: 22,
            descripcion: 'Octavo álbum de estudio de Pink Floyd, uno de los álbumes más vendidos de la historia.',
            tracklist: ['Speak to Me', 'Breathe (In the Air)', 'On the Run', 'Time', 'The Great Gig in the Sky', 'Money', 'Us and Them', 'Any Colour You Like', 'Brain Damage', 'Eclipse']
        },
        {
            id: 6,
            nombre: 'Symphony No. 9',
            artista: 'Beethoven',
            categoria: 'clasica',
            precio: 40000,
            año: 1824,
            imagen: 'https://cdn.shopify.com/s/files/1/0264/4075/2726/products/beethoven-symphony-no-9-vinyl-record.jpg',
            stock: 5,
            descripcion: 'La novena sinfonía de Beethoven, conocida como "Coral", una de las obras más importantes de la música clásica.',
            tracklist: ['Allegro ma non troppo, un poco maestoso', 'Molto vivace', 'Adagio molto e cantabile', 'Presto - Allegro assai']
        },
        {
            id: 7,
            nombre: 'Abbey Road',
            artista: 'The Beatles',
            categoria: 'rock',
            precio: 45000,
            año: 1969,
            imagen: 'https://www.musicworld.cl/img/cms/cd%20vinilos/the%20beatles/abbey%20road.jpg',
            stock: 18,
            descripcion: 'Undécimo álbum de estudio de The Beatles, el último álbum grabado por la banda.',
            tracklist: ['Come Together', 'Something', 'Maxwell\'s Silver Hammer', 'Oh! Darling', 'Octopus\'s Garden', 'I Want You (She\'s So Heavy)', 'Here Comes the Sun', 'Because', 'You Never Give Me Your Money', 'Sun King', 'Mean Mr. Mustard', 'Polythene Pam', 'She Came In Through the Bathroom Window', 'Golden Slumbers', 'Carry That Weight', 'The End', 'Her Majesty']
        },
        {
            id: 8,
            nombre: 'Blue',
            artista: 'Joni Mitchell',
            categoria: 'pop',
            precio: 28000,
            año: 1971,
            imagen: 'https://cdn.shopify.com/s/files/1/0264/4075/2726/products/blue-joni-mitchell-vinyl-record.jpg',
            stock: 7,
            descripcion: 'Cuarto álbum de estudio de Joni Mitchell, considerado uno de los mejores álbumes de folk de todos los tiempos.',
            tracklist: ['All I Want', 'My Old Man', 'Little Green', 'Carey', 'Blue', 'California', 'This Flight Tonight', 'River', 'A Case of You', 'The Last Time I Saw Richard']
        }
    ];
    
    //almacenar productos globalmente
    window.productosData = productos;
    
    //renderizar productos
    renderizarProductos(productos);
    
    //configurar filtros
    configurarFiltros();
});

//función para renderizar productos
function renderizarProductos(productos) {
    const productosGrid = document.getElementById('productos-grid');
    if (!productosGrid) return;
    
    productosGrid.innerHTML = '';
    
    productos.forEach(producto => {
        const productoCard = crearProductoCard(producto);
        productosGrid.appendChild(productoCard);
    });
}

//función para crear una tarjeta de producto
function crearProductoCard(producto) {
    const article = document.createElement('article');
    article.className = 'producto-card';
    article.setAttribute('data-categoria', producto.categoria);
    
    const stockDisponible = producto.stock > 0;
    const botonTexto = stockDisponible ? 'Agregar al Carrito' : 'Sin Stock';
    const botonDisabled = stockDisponible ? '' : 'disabled';
    
    article.innerHTML = `
        <div class="producto-imagen">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="producto-overlay">
                <button class="ver-detalle-btn" onclick="verDetalle(${producto.id})">Ver Detalle</button>
            </div>
        </div>
        <div class="producto-info">
            <h3>${producto.nombre}</h3>
            <p class="artista">${producto.artista}</p>
            <p class="genero">${getCategoriaDisplayName(producto.categoria)} - ${producto.año}</p>
            <span class="precio">$${producto.precio.toLocaleString()}</span>
            <button class="agregar-carrito-btn" ${botonDisabled} onclick="cart.addToCart(${producto.id}, '${producto.nombre}', ${producto.precio}, '${producto.imagen}', '${producto.artista}')">${botonTexto}</button>
        </div>
    `;
    
    return article;
}

//función para obtener el nombre de la categoría
function getCategoriaDisplayName(categoria) {
    const categorias = {
        'rock': 'Rock',
        'pop': 'Pop',
        'jazz': 'Jazz',
        'clasica': 'Clásica'
    };
    return categorias[categoria] || categoria;
}

//función para configurar filtros
function configurarFiltros() {
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            //remover clase active de todos los botones
            filtroBtns.forEach(b => b.classList.remove('active'));
            //agregar clase active al botón clickeado
            this.classList.add('active');
            
            //filtrar productos
            const categoria = this.getAttribute('data-categoria');
            filtrarProductos(categoria);
        });
    });
}

//función para filtrar productos
function filtrarProductos(categoria) {
    let productosFiltrados = window.productosData;
    
    if (categoria !== 'todos') {
        productosFiltrados = window.productosData.filter(producto => producto.categoria === categoria);
    }
    
    renderizarProductos(productosFiltrados);
}

//función para obtener producto por ID
function getProductoById(id) {
    return window.productosData.find(producto => producto.id === id);
}

//función para ver detalle del producto
function verDetalle(productoId) {
    window.location.href = `detalle-producto.html?id=${productoId}`;
}
