import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ToastProvider, useToast } from '../ToastContext';

//componente de prueba para acceder al contexto
const TestComponent = () => {
  const { success, error, info } = useToast();
  
  return (
    <div>
      <button data-testid="success-btn" onClick={() => success('Operación exitosa')}>
        Success Toast
      </button>
      <button data-testid="error-btn" onClick={() => error('Error en la operación')}>
        Error Toast
      </button>
      <button data-testid="info-btn" onClick={() => info('Información importante')}>
        Info Toast
      </button>
    </div>
  );
};

describe('ToastContext', () => {
  test('debe inicializar con lista vacía de toasts', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal).toBeInTheDocument();
    expect(toastPortal.children).toHaveLength(0);
  });

  test('debe mostrar toast de éxito', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('success-btn'));
    });

    const toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal.children).toHaveLength(1);
    expect(toastPortal.children[0]).toHaveClass('toast');
    expect(toastPortal.children[0]).toHaveClass('success');
    expect(toastPortal.children[0]).toHaveTextContent('Operación exitosa');
  });

  test('debe mostrar toast de error', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('error-btn'));
    });

    const toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal.children).toHaveLength(1);
    expect(toastPortal.children[0]).toHaveClass('toast');
    expect(toastPortal.children[0]).toHaveClass('error');
    expect(toastPortal.children[0]).toHaveTextContent('Error en la operación');
  });

  test('debe mostrar toast de información', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('info-btn'));
    });

    const toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal.children).toHaveLength(1);
    expect(toastPortal.children[0]).toHaveClass('toast');
    expect(toastPortal.children[0]).toHaveClass('info');
    expect(toastPortal.children[0]).toHaveTextContent('Información importante');
  });

  test('debe mostrar múltiples toasts simultáneamente', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('success-btn'));
      fireEvent.click(screen.getByTestId('error-btn'));
      fireEvent.click(screen.getByTestId('info-btn'));
    });

    const toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal.children).toHaveLength(3);
  });

  test('debe generar IDs únicos para cada toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('success-btn'));
      fireEvent.click(screen.getByTestId('success-btn'));
    });

    const toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal.children).toHaveLength(2);
    
    //verificar que son elementos diferentes (React genera keys internamente)
    const firstToast = toastPortal.children[0];
    const secondToast = toastPortal.children[1];
    expect(firstToast).not.toBe(secondToast);
    expect(firstToast.textContent).toBe(secondToast.textContent); //mismo contenido
  });

  test('debe auto-remover toasts después del timeout', async () => {
    vi.useFakeTimers();
    
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('success-btn'));
    });

    let toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal.children).toHaveLength(1);

    //avanzar el tiempo para que expire el timeout
    act(() => {
      vi.advanceTimersByTime(2500);
    });

    toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal.children).toHaveLength(0);
    
    vi.useRealTimers();
  });

  test('debe mantener toasts activos durante el timeout', async () => {
    vi.useFakeTimers();
    
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('success-btn'));
    });

    let toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal.children).toHaveLength(1);

    //avanzar tiempo parcial
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal.children).toHaveLength(1);
    
    vi.useRealTimers();
  });

  test('debe manejar múltiples toasts con diferentes timeouts', async () => {
    vi.useFakeTimers();
    
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('success-btn'));
    });

    let toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal.children).toHaveLength(1);

    //avanzar tiempo parcial y agregar otro toast
    act(() => {
      vi.advanceTimersByTime(1000);
      fireEvent.click(screen.getByTestId('error-btn'));
    });

    toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal.children).toHaveLength(2);

    //avanzar tiempo para que expire el primer toast
    act(() => {
      vi.advanceTimersByTime(1500); //total 2500ms para el primer toast
    });

    toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal.children).toHaveLength(1);
    
    vi.useRealTimers();
  });

  test('debe proporcionar funciones de toast correctamente', () => {
    let toastFunctions;
    
    const TestComponentWithRef = () => {
      toastFunctions = useToast();
      return <div>Test</div>;
    };

    render(
      <ToastProvider>
        <TestComponentWithRef />
      </ToastProvider>
    );

    expect(typeof toastFunctions.success).toBe('function');
    expect(typeof toastFunctions.error).toBe('function');
    expect(typeof toastFunctions.info).toBe('function');
  });

  test('debe manejar mensajes largos correctamente', () => {
    let toastFunctions;
    
    const TestComponentWithRef = () => {
      toastFunctions = useToast();
      return <div>Test</div>;
    };

    render(
      <ToastProvider>
        <TestComponentWithRef />
      </ToastProvider>
    );

    const longMessage = 'Este es un mensaje muy largo que debería ser manejado correctamente por el sistema de toasts sin causar problemas de renderizado o layout';
    
    act(() => {
      toastFunctions.success(longMessage);
    });

    const toastPortal = document.querySelector('.toast-portal');
    expect(toastPortal.children[0]).toHaveTextContent(longMessage);
  });
});
