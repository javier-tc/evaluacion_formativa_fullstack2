//sistema de blogs dinámico
class BlogManager {
    constructor() {
        this.blogs = [
            {
                id: 1,
                titulo: 'Lollapalooza Chile 2026',
                imagen: 'https://universo.cl/wp-content/uploads/2025/08/cd486872-ebb0-4b4d-9f30-735ac1f06596-lollacl-2026640x640-1.png',
                descripcionCorta: 'El festival se realizará los días 13, 14 y 15 de marzo de 2026 en el Parque O\'Higgins, con un line-up que equilibra estrellas globales, referentes latinoamericanos y artistas chilenos que siguen marcando generaciones.',
                descripcionLarga: 'Lollapalooza Chile 2026 promete ser uno de los eventos musicales más esperados del año. El festival, que se realizará en el icónico Parque O\'Higgins de Santiago, contará con tres días llenos de música, arte y entretenimiento.\n\nEl line-up incluye artistas de renombre internacional junto con talentos locales que han conquistado el corazón de los chilenos. Desde géneros como rock, pop, electrónica hasta indie y alternativo, Lollapalooza Chile 2026 ofrecerá una experiencia musical diversa y emocionante.\n\nAdemás de la música, el festival contará con áreas de comida gourmet, arte interactivo, y espacios dedicados a la sustentabilidad, manteniendo su compromiso con el medio ambiente.\n\nLas entradas ya están disponibles y se espera una gran afluencia de público tanto nacional como internacional, consolidando a Chile como uno de los destinos musicales más importantes de Latinoamérica.',
                fecha: '2024-12-15',
                autor: 'Equipo VinylStore',
                categoria: 'Festivales'
            },
            {
                id: 2,
                titulo: 'Halsey regresa a \'Badlands\' 10 años después',
                imagen: 'https://linkstorage.linkfire.com/medialinks/images/1e73268c-38b5-4932-aa6e-2998b5e446fe/artwork-440x440.jpg',
                descripcionCorta: 'Este 2025 se cumplen 10 años desde que Halsey lanzara su álbum debut Badlands a través de dos canciones que se quedaron sin videoclip: Gasoline y Drive.',
                descripcionLarga: 'Halsey celebra una década desde el lanzamiento de su álbum debut "Badlands", una obra que marcó un antes y después en su carrera musical. El álbum, lanzado en 2015, estableció a Halsey como una de las artistas más prometedoras del pop alternativo.\n\n"Badlands" no solo fue un éxito comercial, sino que también fue aclamado por la crítica por su honestidad lírica y su sonido único que combinaba elementos de pop, electropop y indie. Canciones como "New Americana", "Colors" y "Castle" se convirtieron en himnos generacionales.\n\nPara celebrar este aniversario, Halsey ha anunciado una edición especial del álbum en vinilo, incluyendo material inédito y nuevas versiones de las canciones más queridas por sus fans. Esta reedición estará disponible exclusivamente en VinylStore.\n\nEl impacto de "Badlands" en la música pop contemporánea es innegable, influenciando a una nueva generación de artistas que buscan autenticidad y vulnerabilidad en su música.',
                fecha: '2024-12-10',
                autor: 'María González',
                categoria: 'Artistas'
            },
            {
                id: 3,
                titulo: 'Productor de \'Tiny Desk\' no cerrará el programa',
                imagen: 'https://www.billboard.com/wp-content/uploads/2025/08/sabrina-carpenter-tiny-desk-npr-2-2024-espanol-billboard-1800.jpg?w=942&h=628&crop=1',
                descripcionCorta: 'Bobby Carter desmintió los rumores luego que el gobierno retirara 1.100 millones de dólares en fondos.',
                descripcionLarga: 'Bobby Carter, el productor ejecutivo del icónico programa "Tiny Desk" de NPR, ha desmentido categóricamente los rumores sobre el posible cierre del programa tras los recortes presupuestarios del gobierno federal.\n\n"Tiny Desk" se ha convertido en uno de los espacios musicales más importantes de la industria, conocido por sus presentaciones íntimas y acústicas que han catapultado a muchos artistas al estrellato. Desde su creación en 2008, el programa ha presentado a más de 1,000 artistas de todos los géneros musicales.\n\nCarter aseguró que NPR tiene planes de contingencia para mantener el programa funcionando, incluyendo nuevas fuentes de financiamiento y alianzas estratégicas. El programa continuará produciendo contenido de alta calidad y mantendrá su compromiso con la diversidad musical.\n\nLos fans pueden estar tranquilos: "Tiny Desk" seguirá siendo el espacio donde los artistas pueden mostrar su talento en su forma más pura y auténtica.',
                fecha: '2024-12-08',
                autor: 'Carlos Ruiz',
                categoria: 'Noticias'
            },
            {
                id: 4,
                titulo: 'System of a Down: Desafiando el tiempo y las tendencias',
                imagen: 'https://www.rockaxis.com/img/newsList/2876322.jpg',
                descripcionCorta: 'La banda armenio-estadounidense regresa a Sudamérica este mes en un momento crucial para el rock alternativo.',
                descripcionLarga: 'System of a Down, la icónica banda de metal alternativo, regresa a Sudamérica después de varios años de ausencia, demostrando que su música trasciende generaciones y continúa resonando con audiencias de todas las edades.\n\nFormada en 1995, System of a Down se ha caracterizado por su sonido único que combina metal, punk, rock alternativo y elementos de música tradicional armenia. Su música no solo entretiene, sino que también aborda temas sociales y políticos importantes.\n\nEl regreso de la banda a Sudamérica es especialmente significativo, ya que sus letras sobre justicia social y derechos humanos encuentran eco en las luchas sociales de la región. Canciones como "Toxicity", "Chop Suey!" y "B.Y.O.B." siguen siendo himnos para una generación que busca música con mensaje.\n\nSu gira incluye presentaciones en los principales países de la región, y se espera que sea una de las más exitosas del año, demostrando que el rock alternativo sigue vivo y más relevante que nunca.',
                fecha: '2024-12-05',
                autor: 'Ana Silva',
                categoria: 'Rock'
            }
        ];
        this.init();
    }

    //inicializar el sistema de blogs
    init() {
        this.renderBlogs();
    }

    //renderizar blogs en el grid
    renderBlogs() {
        const blogsGrid = document.querySelector('.blogs-grid');
        if (!blogsGrid) return;

        blogsGrid.innerHTML = '';

        this.blogs.forEach(blog => {
            const blogCard = this.createBlogCard(blog);
            blogsGrid.appendChild(blogCard);
        });
    }

    //crear tarjeta de blog
    createBlogCard(blog) {
        const article = document.createElement('article');
        article.className = 'blog-card';
        article.innerHTML = `
            <img src="${blog.imagen}" alt="${blog.titulo}" class="blog-imagen" loading="lazy">
            <div class="blog-content">
                <h3>${blog.titulo}</h3>
                <p class="blog-descripcion">${blog.descripcionCorta}</p>
                <div class="blog-meta">
                    <span class="blog-fecha">${this.formatFecha(blog.fecha)}</span>
                    <span class="blog-autor">Por ${blog.autor}</span>
                    <span class="blog-categoria">${blog.categoria}</span>
                </div>
                <button class="leer-mas-btn" onclick="blogManager.verDetalle(${blog.id})">Leer más</button>
            </div>
        `;

        return article;
    }

    //ver detalle del blog
    verDetalle(blogId) {
        const blog = this.blogs.find(b => b.id === blogId);
        if (blog) {
            //guardar blog en sessionStorage para el detalle
            sessionStorage.setItem('blogDetalle', JSON.stringify(blog));
            window.location.href = `detalle-blog.html?id=${blogId}`;
        }
    }

    //formatear fecha
    formatFecha(fecha) {
        const fechaObj = new Date(fecha);
        return fechaObj.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    //obtener blog por ID
    getBlogById(id) {
        return this.blogs.find(b => b.id === id);
    }

    //obtener todos los blogs
    getAllBlogs() {
        return this.blogs;
    }

    //filtrar blogs por categoría
    getBlogsByCategoria(categoria) {
        return this.blogs.filter(b => b.categoria === categoria);
    }
}

//inicializar el gestor de blogs
const blogManager = new BlogManager();
