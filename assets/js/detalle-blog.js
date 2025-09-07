//funcionalidad para el detalle del blog
document.addEventListener('DOMContentLoaded', function() {
    //obtener ID del blog desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    
    if (!blogId) {
        //si no hay ID, redirigir a blogs
        window.location.href = 'blogs.html';
        return;
    }
    
    //cargar datos del blog
    cargarDetalleBlog(blogId);
});

//función para cargar el detalle del blog
function cargarDetalleBlog(blogId) {
    //obtener blog por ID
    const blog = getBlogById(parseInt(blogId));
    
    if (!blog) {
        //si no se encuentra el blog, mostrar error y redirigir
        mostrarError('Blog no encontrado');
        setTimeout(() => {
            window.location.href = 'blogs.html';
        }, 3000);
        return;
    }
    
    //actualizar elementos de la página
    actualizarElementosBlog(blog);
}

//función para actualizar los elementos del blog
function actualizarElementosBlog(blog) {
    //actualizar título
    document.getElementById('blog-titulo').textContent = blog.titulo;
    document.title = `${blog.titulo} - VinylStore`;
    
    //actualizar meta información
    document.getElementById('blog-fecha').textContent = formatearFecha(blog.fecha);
    document.getElementById('blog-autor').textContent = `Por ${blog.autor}`;
    document.getElementById('blog-categoria').textContent = blog.categoria;
    
    //actualizar imagen
    const imagenElement = document.getElementById('blog-imagen');
    imagenElement.src = blog.imagen;
    imagenElement.alt = blog.titulo;
    
    //actualizar descripción
    const descripcionElement = document.getElementById('blog-descripcion');
    descripcionElement.innerHTML = formatearDescripcion(blog.descripcionLarga);
}

//función para formatear la descripción larga
function formatearDescripcion(descripcion) {
    //convertir saltos de línea en párrafos HTML
    const parrafos = descripcion.split('\n\n');
    return parrafos.map(parrafo => `<p>${parrafo}</p>`).join('');
}

//función para mostrar error
function mostrarError(mensaje) {
    const heroContent = document.querySelector('.hero-content');
    heroContent.innerHTML = `
        <h2>Error</h2>
        <p>${mensaje}</p>
        <p>Redirigiendo a blogs...</p>
    `;
}
