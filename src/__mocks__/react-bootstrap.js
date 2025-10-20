//mocks para componentes de React Bootstrap
import React from 'react';

//mock para Navbar
export const MockNavbar = ({ children, ...props }) => (
  <nav data-testid="navbar" {...props}>
    {children}
  </nav>
);

//mock para Nav
export const MockNav = ({ children, ...props }) => (
  <div data-testid="nav" {...props}>
    {children}
  </div>
);

//mock para Container
export const MockContainer = ({ children, ...props }) => (
  <div data-testid="container" {...props}>
    {children}
  </div>
);

//mock para Row
export const MockRow = ({ children, ...props }) => (
  <div data-testid="row" {...props}>
    {children}
  </div>
);

//mock para Col
export const MockCol = ({ children, ...props }) => (
  <div data-testid="col" {...props}>
    {children}
  </div>
);

//mock para Card
export const MockCard = ({ children, ...props }) => (
  <div data-testid="card" {...props}>
    {children}
  </div>
);

//mock para Button
export const MockButton = ({ children, onClick, ...props }) => (
  <button data-testid="button" onClick={onClick} {...props}>
    {children}
  </button>
);

//mock para Jumbotron
export const MockJumbotron = ({ children, ...props }) => (
  <div data-testid="jumbotron" {...props}>
    {children}
  </div>
);

//mock para Form
export const MockForm = ({ children, onSubmit, ...props }) => (
  <form data-testid="form" onSubmit={onSubmit} {...props}>
    {children}
  </form>
);

//mock para FormGroup
export const MockFormGroup = ({ children, ...props }) => (
  <div data-testid="form-group" {...props}>
    {children}
  </div>
);

//mock para FormControl
export const MockFormControl = ({ ...props }) => (
  <input data-testid="form-control" {...props} />
);

//mock para Modal
export const MockModal = ({ children, show, onHide, ...props }) => (
  show ? (
    <div data-testid="modal" {...props}>
      {children}
    </div>
  ) : null
);

//mock para Alert
export const MockAlert = ({ children, variant, ...props }) => (
  <div data-testid="alert" {...props}>
    {children}
  </div>
);

//mock para Spinner
export const MockSpinner = ({ ...props }) => (
  <div data-testid="spinner" {...props}>
    Loading...
  </div>
);

//mock para Table
export const MockTable = ({ children, ...props }) => (
  <table data-testid="table" {...props}>
    {children}
  </table>
);

//mock para Badge
export const MockBadge = ({ children, ...props }) => (
  <span data-testid="badge" {...props}>
    {children}
  </span>
);

//mock para Dropdown
export const MockDropdown = ({ children, ...props }) => (
  <div data-testid="dropdown" {...props}>
    {children}
  </div>
);

//mock para Tabs
export const MockTabs = ({ children, ...props }) => (
  <div data-testid="tabs" {...props}>
    {children}
  </div>
);

//mock para Tab
export const MockTab = ({ children, ...props }) => (
  <div data-testid="tab" {...props}>
    {children}
  </div>
);

//mock para Accordion
export const MockAccordion = ({ children, ...props }) => (
  <div data-testid="accordion" {...props}>
    {children}
  </div>
);

//mock para Carousel
export const MockCarousel = ({ children, ...props }) => (
  <div data-testid="carousel" {...props}>
    {children}
  </div>
);

//mock para Pagination
export const MockPagination = ({ children, ...props }) => (
  <div data-testid="pagination" {...props}>
    {children}
  </div>
);

//mock para ProgressBar
export const MockProgressBar = ({ ...props }) => (
  <div data-testid="progress-bar" {...props}>
    Progress
  </div>
);

//mock para Toast
export const MockToast = ({ children, ...props }) => (
  <div data-testid="toast" {...props}>
    {children}
  </div>
);

//mock para Tooltip
export const MockTooltip = ({ children, ...props }) => (
  <div data-testid="tooltip" {...props}>
    {children}
  </div>
);

//mock para Popover
export const MockPopover = ({ children, ...props }) => (
  <div data-testid="popover" {...props}>
    {children}
  </div>
);

//mock para OverlayTrigger
export const MockOverlayTrigger = ({ children, ...props }) => (
  <div data-testid="overlay-trigger" {...props}>
    {children}
  </div>
);

//mock para ListGroup
export const MockListGroup = ({ children, ...props }) => (
  <div data-testid="list-group" {...props}>
    {children}
  </div>
);

//mock para ListGroupItem
export const MockListGroupItem = ({ children, ...props }) => (
  <div data-testid="list-group-item" {...props}>
    {children}
  </div>
);

//mock para Breadcrumb
export const MockBreadcrumb = ({ children, ...props }) => (
  <nav data-testid="breadcrumb" {...props}>
    {children}
  </nav>
);

//mock para BreadcrumbItem
export const MockBreadcrumbItem = ({ children, ...props }) => (
  <span data-testid="breadcrumb-item" {...props}>
    {children}
  </span>
);
