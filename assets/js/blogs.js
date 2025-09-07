//sistema de blogs con arreglo JavaScript
document.addEventListener('DOMContentLoaded', function() {
    //arreglo de blogs
    const blogs = [
        {
            id: 1,
            titulo: 'Lollapalooza Chile 2026',
            descripcionCorta: 'El festival se realizará los días 13, 14 y 15 de marzo de 2026 en el Parque O\'Higgins, con un line-up que equilibra estrellas globales, referentes latinoamericanos y artistas chilenos que siguen marcando generaciones.',
            descripcionLarga: 'Lollapalooza Chile 2026 promete ser uno de los festivales más esperados del año. Con una programación que incluye artistas de talla mundial y talentos locales emergentes, el evento se realizará en el icónico Parque O\'Higgins de Santiago.\n\nEl festival contará con múltiples escenarios donde se presentarán géneros diversos: desde rock alternativo hasta música electrónica, pasando por pop, indie y música latina. Entre los headliners confirmados se encuentran bandas legendarias y artistas solistas que han marcado generaciones.\n\nAdemás de la música, Lollapalooza Chile 2026 ofrecerá una experiencia completa con food trucks de comida internacional, áreas de arte interactivo, espacios de descanso y actividades para toda la familia. El festival también se compromete con la sostenibilidad, implementando iniciativas de reciclaje y reducción de huella de carbono.\n\nLos boletos ya están disponibles en preventa, con descuentos especiales para estudiantes y grupos familiares. No te pierdas esta experiencia única que combina música, arte y cultura en un solo lugar.',
            imagen: 'https://universo.cl/wp-content/uploads/2025/08/cd486872-ebb0-4b4d-9f30-735ac1f06596-lollacl-2026640x640-1.png',
            fecha: '2024-12-15',
            autor: 'Equipo VinylStore',
            categoria: 'Festivales'
        },
        {
            id: 2,
            titulo: 'Halsey regresa a \'Badlands\' 10 años después',
            descripcionCorta: 'Este 2025 se cumplen 10 años desde que Halsey lanzara su álbum debut Badlands a través de dos canciones que se quedaron sin videoclip: Gasoline y Drive.',
            descripcionLarga: 'Halsey celebra una década desde el lanzamiento de su icónico álbum debut "Badlands", que marcó un antes y un después en su carrera musical. El álbum, lanzado originalmente en 2015, se convirtió en un fenómeno cultural que definió una generación.\n\n"Badlands" no solo fue un éxito comercial, sino que también estableció a Halsey como una artista única en el panorama musical. Con canciones como "New Americana", "Castle" y "Colors", el álbum exploró temas de identidad, amor y rebelión que resonaron profundamente con los jóvenes de la época.\n\nPara celebrar este aniversario, Halsey ha anunciado una reedición especial del álbum en vinilo, incluyendo material inédito y nuevas versiones de las canciones más queridas. Esta edición limitada incluirá fotografías exclusivas, letras manuscritas y un ensayo personal de la artista sobre el proceso creativo.\n\nAdemás, se han confirmado dos videoclips para "Gasoline" y "Drive", canciones que originalmente no contaron con material visual oficial. Estos videos prometen ser una mirada íntima al universo creativo de Halsey durante esa época trascendental.',
            imagen: 'https://linkstorage.linkfire.com/medialinks/images/1e73268c-38b5-4932-aa6e-2998b5e446fe/artwork-440x440.jpg',
            fecha: '2024-12-10',
            autor: 'María González',
            categoria: 'Artistas'
        },
        {
            id: 3,
            titulo: 'Productor de \'Tiny Desk\' no cerrará el programa',
            descripcionCorta: 'Bobby Carter desmintió los rumores luego que el gobierno retirara 1.100 millones de dólares en fondos.',
            descripcionLarga: 'Bobby Carter, el productor ejecutivo del icónico programa "Tiny Desk" de NPR, ha desmentido categóricamente los rumores sobre el posible cierre del programa tras los recortes presupuestarios del gobierno federal.\n\n"Tiny Desk" se ha convertido en uno de los espacios más importantes para la música independiente y alternativa, ofreciendo performances íntimas y acústicas de artistas de todos los géneros. Desde su creación, el programa ha presentado a más de 1,000 artistas, desde leyendas establecidas hasta talentos emergentes.\n\nA pesar de los recortes de 1.100 millones de dólares en fondos federales para NPR, Carter asegura que el programa continuará operando gracias a las donaciones privadas y al apoyo de la audiencia. "La música es universal y Tiny Desk seguirá siendo ese espacio especial donde los artistas pueden conectarse directamente con sus fans", declaró Carter.\n\nEl programa ha sido fundamental en la carrera de muchos artistas, incluyendo a Lizzo, Billie Eilish, y Anderson .Paak, quienes han visto sus performances de Tiny Desk convertirse en videos virales que han impulsado significativamente sus carreras.\n\nNPR ha lanzado una campaña de recaudación de fondos para asegurar la continuidad no solo de Tiny Desk, sino de todos sus programas de música y cultura.',
            imagen: 'https://www.billboard.com/wp-content/uploads/2025/08/sabrina-carpenter-tiny-desk-npr-2-2024-espanol-billboard-1800.jpg?w=942&h=628&crop=1',
            fecha: '2024-12-05',
            autor: 'Carlos Mendoza',
            categoria: 'Medios'
        },
        {
            id: 4,
            titulo: 'System of a Down: Desafiando el tiempo y las tendencias',
            descripcionCorta: 'La banda armenio-estadounidense regresa a Sudamérica este mes en un momento.',
            descripcionLarga: 'System of a Down regresa a Sudamérica después de varios años de ausencia, demostrando que su música trasciende generaciones y tendencias musicales. La banda armenio-estadounidense, conocida por su fusión única de metal alternativo, punk y música tradicional armenia, continúa siendo relevante más de dos décadas después de su debut.\n\nSu último álbum de estudio, "Mezmerize/Hypnotize" (2005), sigue siendo considerado una obra maestra del metal alternativo. Canciones como "B.Y.O.B.", "Question!" y "Hypnotize" no solo fueron éxitos comerciales, sino que también abordaron temas políticos y sociales que siguen siendo relevantes hoy en día.\n\nLa gira sudamericana incluye fechas en Chile, Argentina, Brasil y Colombia, donde la banda espera encontrar una audiencia fiel que ha crecido con su música. "Es increíble ver cómo nuestra música ha conectado con personas de diferentes culturas y generaciones", comentó Serj Tankian, vocalista de la banda.\n\nAdemás de los conciertos, System of a Down ha anunciado que trabajarán en nuevo material durante su estadía en Sudamérica, inspirándose en la rica cultura musical de la región. "Siempre hemos estado abiertos a incorporar diferentes influencias musicales en nuestro sonido", agregó Daron Malakian, guitarrista y compositor principal.\n\nLos fanáticos pueden esperar un setlist que incluye tanto los clásicos como algunas sorpresas, incluyendo covers de bandas sudamericanas que han influenciado a System of a Down a lo largo de su carrera.',
            imagen: 'https://www.rockaxis.com/img/newsList/2876322.jpg',
            fecha: '2024-12-01',
            autor: 'Ana Rodríguez',
            categoria: 'Bandas'
        }
    ];
    
    //almacenar blogs globalmente
    window.blogsData = blogs;
    
    //renderizar blogs
    renderizarBlogs(blogs);
});

//función para renderizar blogs
function renderizarBlogs(blogs) {
    const blogsGrid = document.getElementById('blogs');
    if (!blogsGrid) return;
    
    const blogsContainer = blogsGrid.querySelector('.blogs-grid');
    if (!blogsContainer) return;
    
    blogsContainer.innerHTML = '';
    
    blogs.forEach(blog => {
        const blogCard = crearBlogCard(blog);
        blogsContainer.appendChild(blogCard);
    });
}

//función para crear una tarjeta de blog
function crearBlogCard(blog) {
    const article = document.createElement('article');
    article.className = 'blog-card';
    
    article.innerHTML = `
        <img src="${blog.imagen}" alt="${blog.titulo}" class="blog-imagen" />
        <div class="blog-content">
            <h3>${blog.titulo}</h3>
            <p>${blog.descripcionCorta}</p>
            <div class="blog-meta">
                <span class="blog-fecha">${formatearFecha(blog.fecha)}</span>
                <span class="blog-autor">Por ${blog.autor}</span>
                <span class="blog-categoria">${blog.categoria}</span>
            </div>
            <button class="ver-detalle-btn" onclick="verDetalleBlog(${blog.id})">Leer más</button>
        </div>
    `;
    
    return article;
}

//función para formatear fecha
function formatearFecha(fecha) {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

//función para obtener blog por ID
function getBlogById(id) {
    return window.blogsData.find(blog => blog.id === id);
}

//función para ver detalle del blog
function verDetalleBlog(blogId) {
    window.location.href = `detalle-blog.html?id=${blogId}`;
}
