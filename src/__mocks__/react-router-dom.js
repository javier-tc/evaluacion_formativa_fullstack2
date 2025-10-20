//mocks para React Router
import React from 'react';

//mock para BrowserRouter
export const MockBrowserRouter = ({ children }) => (
  <div data-testid="browser-router">
    {children}
  </div>
);

//mock para Routes
export const MockRoutes = ({ children }) => (
  <div data-testid="routes">
    {children}
  </div>
);

//mock para Route
export const MockRoute = ({ children, element }) => (
  <div data-testid="route">
    {element || children}
  </div>
);

//mock para Link
export const MockLink = ({ children, to, ...props }) => (
  <a data-testid="link" href={to} {...props}>
    {children}
  </a>
);

//mock para NavLink
export const MockNavLink = ({ children, to, className, ...props }) => (
  <a data-testid="nav-link" href={to} className={className} {...props}>
    {children}
  </a>
);

//mock para Navigate
export const MockNavigate = ({ to, replace }) => (
  <div data-testid="navigate" data-to={to} data-replace={replace}>
    Navigate to {to}
  </div>
);

//mock para useNavigate
export const mockNavigate = jest.fn();

//mock para useLocation
export const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default'
};

//mock para useParams
export const mockParams = {};

//mock para useSearchParams
export const mockSearchParams = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  has: jest.fn(),
  keys: jest.fn(),
  values: jest.fn(),
  entries: jest.fn(),
  forEach: jest.fn(),
  toString: jest.fn()
};

//mock para useHistory (v5)
export const mockHistory = {
  push: jest.fn(),
  replace: jest.fn(),
  go: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  length: 1,
  location: mockLocation,
  action: 'POP'
};

//mock para useRouteMatch (v5)
export const mockRouteMatch = {
  params: {},
  isExact: true,
  path: '/',
  url: '/'
};

//mock para Redirect (v5)
export const MockRedirect = ({ to, from, push }) => (
  <div data-testid="redirect" data-to={to} data-from={from} data-push={push}>
    Redirect to {to}
  </div>
);

//mock para Switch (v5)
export const MockSwitch = ({ children }) => (
  <div data-testid="switch">
    {children}
  </div>
);

//mock para useHistory hook
export const useHistory = () => mockHistory;

//mock para useLocation hook
export const useLocation = () => mockLocation;

//mock para useNavigate hook
export const useNavigate = () => mockNavigate;

//mock para useParams hook
export const useParams = () => mockParams;

//mock para useSearchParams hook
export const useSearchParams = () => [mockSearchParams, jest.fn()];

//mock para useRouteMatch hook
export const useRouteMatch = () => mockRouteMatch;
