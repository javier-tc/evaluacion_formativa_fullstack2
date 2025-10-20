import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { useFormValidation } from '../../hooks/useFormValidation';

//componente de prueba para usar el hook
const TestComponent = ({ initialValues = {}, validationRules = {} }) => {
  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    clearErrors,
    resetForm
  } = useFormValidation(initialValues, validationRules);

  return (
    <div>
      <div data-testid="is-valid">{isValid ? 'true' : 'false'}</div>
      <div data-testid="values">{JSON.stringify(values)}</div>
      <div data-testid="errors">{JSON.stringify(errors)}</div>
      <div data-testid="touched">{JSON.stringify(touched)}</div>
      
      <input
        data-testid="name-input"
        name="name"
        value={values.name || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Nombre"
      />
      
      <input
        data-testid="email-input"
        name="email"
        value={values.email || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Email"
      />
      
      <button
        data-testid="set-field-value"
        onClick={() => setFieldValue('name', 'Test Value')}
      >
        Set Field Value
      </button>
      
      <button
        data-testid="set-field-error"
        onClick={() => setFieldError('name', 'Test Error')}
      >
        Set Field Error
      </button>
      
      <button
        data-testid="clear-errors"
        onClick={clearErrors}
      >
        Clear Errors
      </button>
      
      <button
        data-testid="reset-form"
        onClick={() => resetForm({ name: '', email: '' })}
      >
        Reset Form
      </button>
      
      <button
        data-testid="submit-form"
        onClick={(e) => handleSubmit(e, (values) => console.log('Submit:', values))}
      >
        Submit Form
      </button>
    </div>
  );
};

describe('useFormValidation Hook', () => {
  test('debe inicializar con valores por defecto', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('is-valid')).toHaveTextContent('true');
    expect(screen.getByTestId('values')).toHaveTextContent('{}');
    expect(screen.getByTestId('errors')).toHaveTextContent('{}');
    expect(screen.getByTestId('touched')).toHaveTextContent('{}');
  });

  test('debe inicializar con valores proporcionados', () => {
    const initialValues = { name: 'Juan', email: 'juan@test.com' };
    render(<TestComponent initialValues={initialValues} />);
    
    expect(screen.getByTestId('values')).toHaveTextContent(JSON.stringify(initialValues));
    expect(screen.getByTestId('name-input')).toHaveValue('Juan');
    expect(screen.getByTestId('email-input')).toHaveValue('juan@test.com');
  });

  test('debe manejar cambios en campos de entrada', () => {
    render(<TestComponent />);
    
    const nameInput = screen.getByTestId('name-input');
    fireEvent.change(nameInput, { target: { value: 'María' } });
    
    expect(nameInput).toHaveValue('María');
    expect(screen.getByTestId('values')).toHaveTextContent('{"name":"María"}');
  });

  test('debe manejar múltiples cambios en campos', () => {
    render(<TestComponent />);
    
    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    
    fireEvent.change(nameInput, { target: { value: 'Carlos' } });
    fireEvent.change(emailInput, { target: { value: 'carlos@test.com' } });
    
    expect(nameInput).toHaveValue('Carlos');
    expect(emailInput).toHaveValue('carlos@test.com');
    expect(screen.getByTestId('values')).toHaveTextContent('{"name":"Carlos","email":"carlos@test.com"}');
  });

  test('debe manejar eventos de blur', () => {
    render(<TestComponent />);
    
    const nameInput = screen.getByTestId('name-input');
    fireEvent.blur(nameInput);
    
    expect(screen.getByTestId('touched')).toHaveTextContent('{"name":true}');
  });

  test('debe establecer valores de campo programáticamente', () => {
    render(<TestComponent />);
    
    const setFieldValueButton = screen.getByTestId('set-field-value');
    fireEvent.click(setFieldValueButton);
    
    expect(screen.getByTestId('name-input')).toHaveValue('Test Value');
    expect(screen.getByTestId('values')).toHaveTextContent('{"name":"Test Value"}');
  });

  test('debe establecer errores de campo programáticamente', () => {
    render(<TestComponent />);
    
    const setFieldErrorButton = screen.getByTestId('set-field-error');
    fireEvent.click(setFieldErrorButton);
    
    expect(screen.getByTestId('errors')).toHaveTextContent('{"name":"Test Error"}');
  });

  test('debe limpiar errores', () => {
    render(<TestComponent />);
    
    //establecer un error primero
    const setFieldErrorButton = screen.getByTestId('set-field-error');
    fireEvent.click(setFieldErrorButton);
    
    //luego limpiarlo
    const clearErrorsButton = screen.getByTestId('clear-errors');
    fireEvent.click(clearErrorsButton);
    
    expect(screen.getByTestId('errors')).toHaveTextContent('{}');
  });

  test('debe resetear el formulario', () => {
    const initialValues = { name: 'Juan', email: 'juan@test.com' };
    render(<TestComponent initialValues={initialValues} />);
    
    const resetFormButton = screen.getByTestId('reset-form');
    fireEvent.click(resetFormButton);
    
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('email-input')).toHaveValue('');
    expect(screen.getByTestId('values')).toHaveTextContent('{"name":"","email":""}');
  });

  test('debe manejar validación de campos requeridos', () => {
    const validationRules = {
      name: (value) => !value ? 'El nombre es requerido' : '',
      email: (value) => !value ? 'El email es requerido' : ''
    };
    
    render(<TestComponent validationRules={validationRules} />);
    
    const nameInput = screen.getByTestId('name-input');
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.blur(nameInput);
    
    expect(screen.getByTestId('errors')).toHaveTextContent('{"name":"El nombre es requerido"}');
    expect(screen.getByTestId('is-valid')).toHaveTextContent('false');
  });

  test('debe manejar validación de email', () => {
    const validationRules = {
      email: (value) => {
        if (!value) return 'El email es requerido';
        if (!/\S+@\S+\.\S+/.test(value)) return 'El email no es válido';
        return '';
      }
    };
    
    render(<TestComponent validationRules={validationRules} />);
    
    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
    fireEvent.blur(emailInput);
    
    expect(screen.getByTestId('errors')).toHaveTextContent('{"email":"El email no es válido"}');
    expect(screen.getByTestId('is-valid')).toHaveTextContent('false');
  });

  test('debe ser válido cuando todos los campos son válidos', () => {
    const validationRules = {
      name: (value) => !value ? 'El nombre es requerido' : '',
      email: (value) => !value ? 'El email es requerido' : ''
    };
    
    render(<TestComponent validationRules={validationRules} />);
    
    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    
    fireEvent.change(nameInput, { target: { value: 'Juan' } });
    fireEvent.change(emailInput, { target: { value: 'juan@test.com' } });
    
    expect(screen.getByTestId('is-valid')).toHaveTextContent('true');
    expect(screen.getByTestId('errors')).toHaveTextContent('{}');
  });

  test('debe manejar envío del formulario', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<TestComponent />);
    
    const submitButton = screen.getByTestId('submit-form');
    fireEvent.click(submitButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Submit:', {});
    
    consoleSpy.mockRestore();
  });

  test('debe manejar validación en tiempo real', () => {
    const validationRules = {
      name: (value) => value && value.length < 3 ? 'El nombre debe tener al menos 3 caracteres' : ''
    };
    
    render(<TestComponent validationRules={validationRules} />);
    
    const nameInput = screen.getByTestId('name-input');
    fireEvent.change(nameInput, { target: { value: 'Jo' } });
    
    expect(screen.getByTestId('errors')).toHaveTextContent('{"name":"El nombre debe tener al menos 3 caracteres"}');
    expect(screen.getByTestId('is-valid')).toHaveTextContent('false');
  });

  test('debe limpiar errores cuando el campo se vuelve válido', () => {
    const validationRules = {
      name: (value) => value && value.length < 3 ? 'El nombre debe tener al menos 3 caracteres' : ''
    };
    
    render(<TestComponent validationRules={validationRules} />);
    
    const nameInput = screen.getByTestId('name-input');
    
    //establecer valor inválido
    fireEvent.change(nameInput, { target: { value: 'Jo' } });
    expect(screen.getByTestId('errors')).toHaveTextContent('{"name":"El nombre debe tener al menos 3 caracteres"}');
    
    //corregir el valor
    fireEvent.change(nameInput, { target: { value: 'Juan' } });
    expect(screen.getByTestId('errors')).toHaveTextContent('{}');
    expect(screen.getByTestId('is-valid')).toHaveTextContent('true');
  });
});