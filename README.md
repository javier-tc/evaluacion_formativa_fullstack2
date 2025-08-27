# VinylStore - Sistema de Registro para Tienda Web

## Descripción
Sistema de registro completo para una tienda web de vinilos desarrollado con tecnologías HTML5, CSS3 y JavaScript vanilla. El proyecto implementa un diseño moderno y responsivo con validaciones de formularios en tiempo real.

## Características Implementadas

### 🎨 **Diseño y Estructura HTML5**
- Estructura semántica correcta con etiquetas `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Navegación responsive con menú de hamburguesa
- Páginas: Inicio, Registro e Ingreso
- Formularios accesibles con labels y validaciones HTML5

### 🎨 **Estilos CSS Personalizados**
- Diseño moderno con paleta de colores atractiva
- Variables CSS para consistencia en el diseño
- Layout responsive con Grid y Flexbox
- Animaciones y transiciones suaves
- Efectos hover y estados activos
- Adaptación para dispositivos móviles

### ⚡ **Validaciones JavaScript**
- Validación en tiempo real de formularios
- Mensajes de error contextuales
- Validación de campos obligatorios
- Verificación de formato de email
- Validación de contraseñas (longitud, mayúsculas, minúsculas, números)
- Confirmación de contraseña
- Validación de términos y condiciones

## Estructura del Proyecto

```
evaluacion_formativa/
├── index.html          # Página principal
├── registro.html       # Formulario de registro
├── login.html          # Formulario de ingreso
├── styles.css          # Estilos CSS personalizados
├── registro.js         # Validaciones del formulario de registro
├── login.js            # Validaciones del formulario de login
└── README.md           # Documentación del proyecto
```

## Funcionalidades por Página

### 📱 **Página Principal (index.html)**
- Header con navegación sticky
- Sección hero con llamada a la acción
- Grid de productos destacados
- Información de contacto
- Footer con copyright

### 📝 **Página de Registro (registro.html)**
- Formulario completo de registro
- Campos: nombre, email, contraseña, confirmar contraseña, teléfono
- Checkbox de términos y condiciones
- Validaciones en tiempo real
- Mensajes de error contextuales

### 🔐 **Página de Login (login.html)**
- Formulario de ingreso simplificado
- Campos: email y contraseña
- Checkbox "Recordar sesión"
- Validaciones básicas
- Redirección al registro

## Validaciones Implementadas

### ✅ **Formulario de Registro**
- **Nombre**: Obligatorio, mínimo 3 caracteres, solo letras y espacios
- **Email**: Obligatorio, formato válido de email
- **Contraseña**: Obligatoria, mínimo 6 caracteres, al menos una mayúscula, una minúscula y un número
- **Confirmar Contraseña**: Debe coincidir con la contraseña
- **Teléfono**: Opcional, formato válido si se ingresa
- **Términos**: Obligatorio aceptar

### ✅ **Formulario de Login**
- **Email**: Obligatorio, formato válido
- **Contraseña**: Obligatoria, mínimo 6 caracteres

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica y formularios
- **CSS3**: Estilos personalizados, variables CSS, Grid, Flexbox
- **JavaScript ES6+**: Validaciones, manipulación del DOM, eventos
- **Responsive Design**: Adaptación para diferentes dispositivos

## Cómo Usar

1. Abre `index.html` en tu navegador
2. Navega entre las páginas usando el menú
3. Prueba los formularios de registro e ingreso
4. Observa las validaciones en tiempo real
5. Completa los formularios para ver el comportamiento

## Características Técnicas

- **Sin dependencias externas**: JavaScript vanilla
- **Compatibilidad**: Navegadores modernos (ES6+)
- **Accesibilidad**: Labels, mensajes de error claros
- **Performance**: Validaciones optimizadas
- **Mantenibilidad**: Código comentado y estructurado

## Autor
Desarrollado como proyecto de evaluación formativa para demostrar competencias en:
- Estructuración HTML5 semántica
- Aplicación de estilos CSS personalizados
- Implementación de validaciones JavaScript efectivas
