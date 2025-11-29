import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

/* Reglas de validación*/

const allowedDomains = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com", "@duocuc.cl"];

function validateEmail(value) {
  const email = (value || "").trim();
  if (email === "") return "El email es obligatorio";
  if (email.length > 100) return "El email no puede exceder 100 caracteres";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Ingresa un email válido";
  const hasValidDomain = allowedDomains.some((d) => email.endsWith(d));
  if (!hasValidDomain)
    return "Solo se permiten correos de @duoc.cl, @profesor.duoc.cl, @duocuc.cl y @gmail.com";
  return "";
}

function validatePassword(password) {
  if (!password) return "La contraseña es obligatoria";
  if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
  if (password.length > 10) return "La contraseña no puede exceder 10 caracteres";
  if (!/(?=.*[a-z])/.test(password)) return "La contraseña debe contener al menos una minúscula";
  if (!/(?=.*[A-Z])/.test(password)) return "La contraseña debe contener al menos una mayúscula";
  if (!/(?=.*\d)/.test(password)) return "La contraseña debe contener al menos un número";
  return "";
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  // errores por campo (para mostrar junto a los inputs)
  const [errors, setErrors] = useState({ email: "", password: "" });
  const toast = useToast();
  const nav = useNavigate();
  const { login } = useAuth();

  // Validación en tiempo real / blur 
  const validateField = (name, value) => {
    let msg = "";
    if (name === "email") msg = validateEmail(value);
    if (name === "password") msg = validatePassword(value);
    setErrors((e) => ({ ...e, [name]: msg }));
    return msg;
  };

  const handleBlur = (e) => validateField(e.target.name, e.target.value);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPass(value);
    if (name === "remember" && type === "checkbox") setRemember(checked);

    if (errors[name]) validateField(name, type === "checkbox" ? checked : value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validar ambos campos 
    const emailMsg = validateField("email", email);
    const passMsg  = validateField("password", pass);
    const isValid = !emailMsg && !passMsg;

    if (!isValid) {
      toast.error("Por favor, corrige los errores en el formulario.");
      return;
    }

    setLoading(true);

    try {
      //usar la nueva función de login del AuthContext (ahora asíncrona)
      const result = await login(email, pass);
      
      if (result.success) {
        const nombreUsuario = result.user?.nombre || result.user?.name || 'Usuario';
        toast.success(`¡Bienvenido ${nombreUsuario}!`);
        
        //redirigir según el rol del usuario
        if (result.user.rol === 'Administrador' || result.user.rol === 'admin' || result.user.role === 'admin' || result.user.role === 'Administrador') {
          nav('/admin');
        } else {
          nav('/');
        }
      } else {
        const errorMsg = result.error || 'Error al iniciar sesión';
        toast.error(errorMsg);
        console.error('Error de login:', result);
      }
    } catch (error) {
      console.error('Error inesperado en login:', error);
      toast.error(error.message || "Error inesperado. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit} noValidate>
        <h1 className="auth-title">Iniciar Sesión</h1>
        <p className="auth-sub">Accede a tu cuenta de VinylStore</p>

        {/* Email */}
        <div className={`form-group ${errors.email ? "error" : errors.email === "" && email ? "success" : ""}`}>
          <label htmlFor="email">Correo Electrónico *</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="tu@correo.cl"
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <small className="error-message">{errors.email}</small>
        </div>

        {/* Password */}
        <div className={`form-group ${errors.password ? "error" : errors.password === "" && pass ? "success" : ""}`}>
          <label htmlFor="password">Contraseña *</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <small className="error-message">{errors.password}</small>
        </div>

        <label className="auth-check">
          <input
            type="checkbox"
            name="remember"
            checked={remember}
            onChange={handleChange}
          />
          Recordar mi sesión
        </label>

        <div className="auth-actions">
          <button className="auth-btn" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </form>
    </main>
  );
}
