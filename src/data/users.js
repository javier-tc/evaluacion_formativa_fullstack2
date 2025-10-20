//sistema de base de datos simple para usuarios
export const USERS_DB = [
  {
    id: 1,
    nombre: 'María',
    apellidos: 'González Pérez',
    email: 'maria.gonzalez@duocuc.cl',
    telefono: '+56 9 1234 5678',
    direccion: {
      calle: 'Av. Providencia 1234',
      departamento: 'Depto 45',
      region: 'Región Metropolitana',
      comuna: 'Providencia',
      indicaciones: 'Casa azul, portón automático'
    },
    password: 'Pass123',
    role: 'user',
    fechaRegistro: '2025-01-15',
    activo: true
  },
  {
    id: 2,
    nombre: 'Carlos',
    apellidos: 'Ruiz Silva',
    email: 'carlos.ruiz@duocuc.cl',
    telefono: '+56 9 2345 6789',
    direccion: {
      calle: 'Calle Las Flores 567',
      departamento: '',
      region: 'Región Metropolitana',
      comuna: 'Las Condes',
      indicaciones: 'Edificio verde, timbre 3B'
    },
    password: 'Admin123',
    role: 'admin',
    fechaRegistro: '2025-01-10',
    activo: true
  },
  {
    id: 3,
    nombre: 'Ana',
    apellidos: 'Silva Mendoza',
    email: 'ana.silva@duocuc.cl',
    telefono: '+56 9 3456 7890',
    direccion: {
      calle: 'Pasaje Los Robles 89',
      departamento: 'Casa 12',
      region: 'Región de Valparaíso',
      comuna: 'Viña del Mar',
      indicaciones: 'Casa con jardín, portón negro'
    },
    password: 'User123',
    role: 'user',
    fechaRegistro: '2025-01-05',
    activo: true
  },
  {
    id: 4,
    nombre: 'Luis',
    apellidos: 'Mendoza López',
    email: 'luis.mendoza@duocuc.cl',
    telefono: '+56 9 4567 8901',
    direccion: {
      calle: 'Av. Libertador Bernardo O\'Higgins 2345',
      departamento: 'Depto 78',
      region: 'Región Metropolitana',
      comuna: 'Santiago',
      indicaciones: 'Torre norte, piso 15'
    },
    password: 'Pass456',
    role: 'user',
    fechaRegistro: '2025-01-20',
    activo: true
  },
  {
    id: 5,
    nombre: 'Patricia',
    apellidos: 'López Torres',
    email: 'patricia.lopez@duocuc.cl',
    telefono: '+56 9 5678 9012',
    direccion: {
      calle: 'Calle Los Nogales 123',
      departamento: '',
      region: 'Región Metropolitana',
      comuna: 'La Reina',
      indicaciones: 'Casa de dos pisos, reja blanca'
    },
    password: 'User456',
    role: 'user',
    fechaRegistro: '2025-01-18',
    activo: true
  },
  {
    id: 6,
    nombre: 'Javier',
    apellidos: 'Tapia C',
    email: 'javi.tapiac@duocuc.cl',
    telefono: '+56 9 6789 0123',
    direccion: {
      calle: 'Av. Vicuña Mackenna 3456',
      departamento: 'Depto 12',
      region: 'Región Metropolitana',
      comuna: 'Macul',
      indicaciones: 'Edificio amarillo, piso 3'
    },
    password: 'Pass123',
    role: 'user',
    fechaRegistro: '2025-01-25',
    activo: true
  },
  {
    id: 7,
    nombre: 'Fernando',
    apellidos: 'Guerrero E',
    email: 'fe.guerreroe@duocuc.cl',
    telefono: '+56 9 7890 1234',
    direccion: {
      calle: 'Calle NN 789',
      departamento: '',
      region: 'Región Metropolitana',
      comuna: 'NN',
      indicaciones: 'Casa verde, portón de madera'
    },
    password: 'Pass123',
    role: 'user',
    fechaRegistro: '2025-01-25',
    activo: true
  }
];

//funciones para manejar la base de datos de usuarios
export const userDB = {
  //buscar usuario por email
  findByEmail: (email) => {
    return USERS_DB.find(user => user.email === email);
  },

  //buscar usuario por id
  findById: (id) => {
    return USERS_DB.find(user => user.id === id);
  },

  //validar credenciales
  validateCredentials: (email, password) => {
    const user = userDB.findByEmail(email);
    if (user && user.password === password && user.activo) {
      return user;
    }
    return null;
  },

  //crear nuevo usuario
  create: (userData) => {
    const newUser = {
      id: USERS_DB.length + 1,
      ...userData,
      fechaRegistro: new Date().toISOString().split('T')[0],
      activo: true
    };
    USERS_DB.push(newUser);
    return newUser;
  },

  //actualizar usuario
  update: (id, userData) => {
    const index = USERS_DB.findIndex(user => user.id === id);
    if (index !== -1) {
      USERS_DB[index] = { ...USERS_DB[index], ...userData };
      return USERS_DB[index];
    }
    return null;
  },

  //obtener todos los usuarios
  getAll: () => {
    return USERS_DB;
  },

  //obtener usuarios activos
  getActive: () => {
    return USERS_DB.filter(user => user.activo);
  }
};

//regiones y comunas de chile para el formulario
export const REGIONES_COMUNAS = {
  'Región Metropolitana': [
    'Santiago', 'Providencia', 'Las Condes', 'La Reina', 'Ñuñoa', 
    'Maipú', 'Pudahuel', 'Quilicura', 'San Miguel', 'San Joaquín'
  ],
  'Región de Valparaíso': [
    'Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana'
  ],
  'Región del Biobío': [
    'Concepción', 'Talcahuano', 'Chiguayante', 'San Pedro de la Paz'
  ],
  'Región de La Araucanía': [
    'Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón'
  ],
  'Región de Los Lagos': [
    'Puerto Montt', 'Osorno', 'Valdivia', 'Chiloé'
  ]
};
