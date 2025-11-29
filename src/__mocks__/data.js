//mocks para datos de productos
export const mockProducts = [
  {
    id: 1,
    nombre: 'Abbey Road',
    artista: 'The Beatles',
    genero: 'Rock',
    año: 1969,
    precio: 25000,
    imagen: 'https://example.com/abbey-road.jpg',
    stock: 10,
    descripcion: 'Álbum clásico de The Beatles'
  },
  {
    id: 2,
    nombre: 'Kind of Blue',
    artista: 'Miles Davis',
    genero: 'Jazz',
    año: 1959,
    precio: 30000,
    imagen: 'https://example.com/kind-of-blue.jpg',
    stock: 5,
    descripcion: 'Obra maestra del jazz'
  },
  {
    id: 3,
    nombre: 'Thriller',
    artista: 'Michael Jackson',
    genero: 'Pop',
    año: 1982,
    precio: 28000,
    imagen: 'https://example.com/thriller.jpg',
    stock: 8,
    descripcion: 'El álbum más vendido de la historia'
  }
];

//mocks para datos de blogs
export const mockBlogs = [
  {
    id: 1,
    titulo: 'Historia del Vinilo',
    autor: 'Juan Pérez',
    fecha: '2024-01-15',
    imagen: 'https://example.com/blog1.jpg',
    resumen: 'La historia completa del formato vinilo',
    contenido: 'Contenido completo del blog...'
  },
  {
    id: 2,
    titulo: 'Cuidado de Vinilos',
    autor: 'María González',
    fecha: '2024-01-20',
    imagen: 'https://example.com/blog2.jpg',
    resumen: 'Cómo cuidar tu colección de vinilos',
    contenido: 'Guía completa para el cuidado...'
  }
];

//mocks para usuarios
export const mockUsers = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@test.com',
    run: '12345678-9',
    telefono: '+56912345678',
    direccion: 'Av. Principal 123',
    comuna: 'Santiago',
    region: 'Metropolitana',
    role: 'user'
  },
  {
    id: 2,
    nombre: 'María González',
    email: 'maria@test.com',
    run: '98765432-1',
    telefono: '+56987654321',
    direccion: 'Calle Secundaria 456',
    comuna: 'Valparaíso',
    region: 'Valparaíso',
    role: 'admin'
  }
];

//mocks para datos de regiones y comunas
export const mockRegionesComunas = {
  'Metropolitana': ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa'],
  'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué'],
  'Biobío': ['Concepción', 'Talcahuano', 'Chiguayante', 'Hualpén']
};


