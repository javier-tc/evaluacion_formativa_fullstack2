import { useState } from 'react';

//hook personalizado para validación de formularios
export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  //función para validar un campo específico
  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';

    //si la regla es una función directa
    if (typeof rule === 'function') {
      return rule(value);
    }

    //si es un objeto con propiedades de validación
    if (rule.required && (!value || value.toString().trim() === '')) {
      return rule.required;
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      return rule.minLength;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      return rule.maxLength;
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      return rule.pattern;
    }

    if (rule.custom && typeof rule.custom === 'function') {
      return rule.custom(value, values);
    }

    return '';
  };

  //función para validar todos los campos
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  //función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({ ...prev, [name]: fieldValue }));
    
    //validar en tiempo real si el campo ha sido tocado o si hay reglas de validación
    if (touched[name] || validationRules[name]) {
      const error = validateField(name, fieldValue);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[name] = error;
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    }
  };

  //función para manejar blur (cuando el usuario sale del campo)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  //función para resetear el formulario
  const resetForm = (newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  };

  //función para establecer valores manualmente
  const setFieldValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  //función para establecer errores manualmente
  const setFieldError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  //función para limpiar errores
  const clearErrors = () => {
    setErrors({});
  };

  //función para manejar envío del formulario
  const handleSubmit = (e, onSubmit) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(values);
    }
  };

  //calcular si el formulario es válido
  const isValid = Object.keys(errors).length === 0 && 
    Object.keys(validationRules).every(field => {
      const rule = validationRules[field];
      if (rule && rule.required) {
        return values[field] && values[field].toString().trim() !== '';
      }
      return true;
    });

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    resetForm,
    setFieldValue,
    setFieldError,
    clearErrors,
    setValues
  };
};

//reglas de validación comunes
export const validationRules = {
  //validación de RUN chileno
  run: {
    required: 'El RUN es obligatorio',
    pattern: /^[0-9]{7,8}-[0-9Kk]$/,
    custom: (value) => {
      if (!value) return 'El RUN es obligatorio';
      const runRegex = /^[0-9]{7,8}-[0-9Kk]$/;
      if (!runRegex.test(value)) {
        return 'El RUN debe tener el formato correcto (ej: 19011022K)';
      }
      return '';
    }
  },

  //validación de email
  email: {
    required: 'El correo es obligatorio',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value) => {
      if (!value) return 'El correo es obligatorio';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'El correo debe tener un formato válido';
      }
      if (value.length > 100) {
        return 'El correo no puede exceder 100 caracteres';
      }
      return '';
    }
  },

  //validación de nombre
  nombre: {
    required: 'El nombre es obligatorio',
    minLength: 'El nombre debe tener al menos 2 caracteres',
    maxLength: 'El nombre no puede exceder 50 caracteres'
  },

  //validación de precio
  precio: {
    required: 'El precio es obligatorio',
    custom: (value) => {
      if (!value) return 'El precio es obligatorio';
      const precioNum = parseFloat(value);
      if (isNaN(precioNum)) {
        return 'El precio debe ser un número válido';
      }
      if (precioNum < 0) {
        return 'El precio no puede ser negativo';
      }
      return '';
    }
  },

  //validación de stock
  stock: {
    required: 'El stock es obligatorio',
    custom: (value) => {
      if (!value) return 'El stock es obligatorio';
      const stockNum = parseInt(value);
      if (isNaN(stockNum)) {
        return 'El stock debe ser un número entero válido';
      }
      if (stockNum < 0) {
        return 'El stock no puede ser negativo';
      }
      return '';
    }
  },

  //validación de URL de imagen
  imageUrl: {
    custom: (value) => {
      if (!value) return ''; //imagen es opcional
      const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
      if (!urlRegex.test(value)) {
        return 'La URL debe ser válida y apuntar a una imagen (jpg, png, gif, webp)';
      }
      return '';
    }
  }
};
