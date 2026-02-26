import React from 'react';
import Modal from './Modal';

const LogoutModal = ({ onCancel, onLogout, isOpen }) => {
  const actions = [
    {
      label: 'Cancel',
      onClick: onCancel,
      variant: 'default'
    },
    {
      label: 'Logout',
      onClick: onLogout,
      variant: 'danger'
    }
  ];

  return (
    <Modal
      title="Log Out"
      onClose={onCancel}
      isOpen={isOpen}
      actions={actions}
      size="small"
    >
      <p>Are you sure you want to log out?</p>
    </Modal>
  );
};

export default LogoutModal; 