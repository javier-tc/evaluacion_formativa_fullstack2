import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

/* Reglas de validación */
function validateNombre(nombre) {
  const n = (nombre || "").trim();
  if (n === "") return "El nombre es obligatorio";
  if (n.length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(n))
    return "El nombre solo puede contener letras y espacios";
  return "";
}
function validateEmail(email) {
  const e = (email || "").trim();
  if (e === "") return "El email es obligatorio";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(e)) return "Ingresa un email válido";
  return "";
}
function validatePassword(password) {
  const p = password || "";
  if (p === "") return "La contraseña es obligatoria";
  if (p.length < 6) return "La contraseña debe tener al menos 6 caracteres";
  if (!/(?=.*[a-z])/.test(p)) return "La contraseña debe contener al menos una minúscula";
  if (!(/(?=.*[A-Z])/.test(p))) return "La contraseña debe contener al menos una mayúscula";
  if (!(/(?=.*\d)/.test(p))) return "La contraseña debe contener al menos un número";
  return "";
}
function validateConfirmPassword(password, confirmPassword) {
  const c = confirmPassword || "";
  if (c === "") return "Confirma tu contraseña";
  if (password !== c) return "Las contraseñas no coinciden";
  return "";
}
function validateTelefono(telefono) {
  const t = (telefono || "").trim();
  if (t === "") return ""; // opcional
  const telefonoRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
  if (!telefonoRegex.test(t)) return "Ingresa un teléfono válido";
  return "";
}
function validateTerminos(checked) {
  if (!checked) return "Debes aceptar los términos y condiciones";
  return "";
}

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    terminos: false,
  });
  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    terminos: "",
  });
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const nav = useNavigate();
  const { register } = useAuth();

  const validateField = (name, value) => {
    let msg = "";
    switch (name) {
      case "nombre":
        msg = validateNombre(value);
        break;
      case "apellido":
        msg = validateNombre(value); //usar la misma validación que nombre
        break;
      case "email":
        msg = validateEmail(value);
        break;
      case "password":
        msg = validatePassword(value);
        // si cambia la password revalidamos confirmación
        if (form.confirmPassword) {
          const m2 = validateConfirmPassword(value, form.confirmPassword);
          setErrors((e) => ({ ...e, confirmPassword: m2 }));
        }
        break;
      case "confirmPassword":
        msg = validateConfirmPassword(form.password, value);
        break;
      case "telefono":
        msg = validateTelefono(value);
        break;
      case "terminos":
        msg = validateTerminos(value);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg;
  };

  const onBlur = (e) => {
    const { name, type, checked, value } = e.target;
    validateField(name, type === "checkbox" ? checked : value);
  };

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((f) => ({ ...f, [name]: val }));
    // revalidar si ya había error
    if (errors[name]) validateField(name, val);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validar todo
    const msgs = {
      nombre: validateField("nombre", form.nombre),
      apellido: validateField("apellido", form.apellido),
      email: validateField("email", form.email),
      password: validateField("password", form.password),
      confirmPassword: validateField("confirmPassword", form.confirmPassword),
      telefono: validateField("telefono", form.telefono),
      terminos: validateField("terminos", form.terminos),
    };

    const isValid = Object.values(msgs).every((m) => !m);
    if (!isValid) {
      toast.error("Por favor, corrige los errores en el formulario.");
      return;
    }

    setLoading(true);

    try {
      //usar la nueva función de register del AuthContext
      //la API espera: nombre, apellido (no apellidos), email, password (requeridos)
      //y opcionalmente: telefono, direccion (string), region, comuna, rol
      const userData = {
        nombre: form.nombre,
        apellido: form.apellido, //la API espera 'apellido' singular (requerido)
        email: form.email,
        telefono: form.telefono || '',
        password: form.password,
        direccion: '', //opcional, string simple
        region: '', //opcional
        comuna: '', //opcional
        rol: 'Usuario' //la API espera 'Usuario' o 'Administrador' (con mayúscula)
      };

      const result = await register(userData);
      
      if (result.success) {
        if (result.requiresLogin) {
          toast.success(result.message || "¡Cuenta creada exitosamente! Por favor inicia sesión.");
          nav("/login");
        } else {
          toast.success("¡Cuenta creada exitosamente! Bienvenido a VinylStore.");
          //limpiar formulario
          setForm({
            nombre: "",
            apellido: "",
            email: "",
            password: "",
            confirmPassword: "",
            telefono: "",
            terminos: false,
          });
          setErrors({
            nombre: "",
            apellido: "",
            email: "",
            password: "",
            confirmPassword: "",
            telefono: "",
            terminos: "",
          });
          //redirigir al inicio
          nav("/");
        }
      } else {
        toast.error(result.error || "Error al crear la cuenta");
      }
    } catch (error) {
      toast.error("Error inesperado. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit} noValidate>
        <h1 className="auth-title">Crear Cuenta</h1>
        <p className="auth-sub">Únete a VinylStore y descubre la mejor música</p>

        {/* Nombre */}
        <div className={`form-group ${errors.nombre ? "error" : errors.nombre === "" && form.nombre ? "success" : ""}`}>
          <label htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={onChange}
            onBlur={onBlur}
          />
          <small className="error-message">{errors.nombre}</small>
        </div>

        {/* Apellido */}
        <div className={`form-group ${errors.apellido ? "error" : errors.apellido === "" && form.apellido ? "success" : ""}`}>
          <label htmlFor="apellido">Apellido *</label>
          <input
            id="apellido"
            name="apellido"
            type="text"
            placeholder="Tu apellido"
            value={form.apellido}
            onChange={onChange}
            onBlur={onBlur}
          />
          <small className="error-message">{errors.apellido}</small>
        </div>

        {/* Email */}
        <div className={`form-group ${errors.email ? "error" : errors.email === "" && form.email ? "success" : ""}`}>
          <label htmlFor="email">Correo Electrónico *</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="tu@correo.com"
            value={form.email}
            onChange={onChange}
            onBlur={onBlur}
          />
          <small className="error-message">{errors.email}</small>
        </div>

        {/* Password */}
        <div className={`form-group ${errors.password ? "error" : errors.password === "" && form.password ? "success" : ""}`}>
          <label htmlFor="password">Contraseña *</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Mín. 6 caracteres, 1 mayús., 1 minús., 1 número"
            value={form.password}
            onChange={onChange}
            onBlur={onBlur}
          />
          <small className="error-message">{errors.password}</small>
        </div>

        {/* Confirm Password */}
        <div className={`form-group ${errors.confirmPassword ? "error" : errors.confirmPassword === "" && form.confirmPassword ? "success" : ""}`}>
          <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            value={form.confirmPassword}
            onChange={onChange}
            onBlur={onBlur}
          />
          <small className="error-message">{errors.confirmPassword}</small>
        </div>

        {/* Teléfono opciona */}
        <div className={`form-group ${errors.telefono ? "error" : errors.telefono === "" && form.telefono ? "success" : ""}`}>
          <label htmlFor="telefono">Teléfono (opcional)</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            placeholder="+56 9 1234 5678"
            value={form.telefono}
            onChange={onChange}
            onBlur={onBlur}
          />
          <small className="error-message">{errors.telefono}</small>
        </div>

        {/* Términos */}
        <div className={`form-group ${errors.terminos ? "error" : ""}`} style={{ marginTop: 4 }}>
          <label className="auth-check">
            <input
              type="checkbox"
              name="terminos"
              checked={form.terminos}
              onChange={onChange}
              onBlur={onBlur}
            />
            Acepto los <Link to="#">términos y condiciones</Link> *
          </label>
          <small className="error-message">{errors.terminos}</small>
        </div>

        <div className="auth-actions" style={{ marginTop: 10 }}>
          <button className="auth-btn" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </main>
  );
}
