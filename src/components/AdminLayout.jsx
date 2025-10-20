import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminPageLayout = ({ children, title, headerActions }) => {
  return (
    <div className="admin-body">
      <div className="admin-container">
        <AdminSidebar />
        
        <main className="admin-main">
          <header className="admin-header">
            <div className="header-content">
              <h1>{title}</h1>
              {headerActions && (
                <div className="header-actions">
                  {headerActions}
                </div>
              )}
            </div>
          </header>

          <div className="admin-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPageLayout;
