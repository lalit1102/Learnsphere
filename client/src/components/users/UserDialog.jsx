import React from "react";
import Modal from "@/components/global/Modal";
import UniversalUserForm from "@/components/auth/UniversalUserForm";

/**
 * UserDialog component: A modal wrapper for the UniversalUserForm using the global Modal component.
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {function} props.setOpen - Handler for dialog state changes.
 * @param {Object|null} props.editingUser - The user object if in edit mode.
 * @param {string} props.role - The role for the new user.
 * @param {function} props.onSuccess - Callback on successful submission.
 */
const UserDialog = ({
  open,
  setOpen,
  editingUser,
  role,
  onSuccess,
}) => {
  const title = editingUser ? "Update User Profile" : `Register New ${role}`;
  const description = editingUser 
    ? `Modify account details for ${editingUser.name}.` 
    : `Create a global account for a new ${role}.`;

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Modal
      title={title}
      description={description}
      open={open}
      setOpen={setOpen}
    >
      <div className="py-4">
        <UniversalUserForm
          type={editingUser ? "update" : "create"}
          role={role}
          initialData={editingUser}
          onSuccess={handleSuccess}
        />
      </div>
    </Modal>
  );
};

export default UserDialog;
