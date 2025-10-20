// Mock para Bootstrap Icons
const mockBootstrapIcons = {
  'bi-percent': 'percent-icon',
  'bi-chevron-up': 'chevron-up-icon',
  'bi-chevron-down': 'chevron-down-icon',
  'bi-search': 'search-icon',
  'bi-arrow-clockwise': 'arrow-clockwise-icon',
  'bi-info-circle': 'info-circle-icon',
  'bi-vinyl': 'vinyl-icon',
  'bi-cart-plus': 'cart-plus-icon',
  'bi-eye': 'eye-icon',
  'bi-lightning-fill': 'lightning-fill-icon',
  'bi-shield-check': 'shield-check-icon',
  'bi-truck': 'truck-icon',
  'bi-arrow-down': 'arrow-down-icon',
  'bi-cart3': 'cart3-icon',
  'bi-cart-x': 'cart-x-icon',
  'bi-credit-card': 'credit-card-icon',
  'bi-trash': 'trash-icon',
  'bi-arrow-left': 'arrow-left-icon',
  'bi-check-circle': 'check-circle-icon',
  'bi-x-circle': 'x-circle-icon',
  'bi-check-circle-fill': 'check-circle-fill-icon',
  'bi-x-circle-fill': 'x-circle-fill-icon',
  'bi-exclamation-triangle': 'exclamation-triangle-icon',
  'bi-arrow-clockwise': 'arrow-clockwise-icon'
};

// Crear elementos span para cada icono
Object.entries(mockBootstrapIcons).forEach(([className, testId]) => {
  const style = document.createElement('style');
  style.textContent = `.${className}::before { content: '${testId}'; }`;
  document.head.appendChild(style);
});

export default mockBootstrapIcons;
