import React, { ChangeEvent, useState } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

type Props = {
  isOpen: boolean;
  setIsOpen: (name: boolean) => void;
};

const ResetPasswordModal = ({ setIsOpen, isOpen }: Props) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [haveChanges, setHaveChanges] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setHaveChanges(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setHaveChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      // Simulate an API call here
      await new Promise((res) => setTimeout(res, 1000));
      alert("Password successfully updated!");
      closeModal();
    } catch (err) {
      alert("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md">
      <div className="relative w-full bg-white rounded-2xl p-6 dark:bg-gray-800">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          Reset Password
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Enter your current password and choose a new one.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="••••••••"
              value={form.currentPassword}
              required
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="At least 8 characters"
              value={form.newPassword}
              required
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repeat new password"
              value={form.confirmPassword}
              required
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading || !haveChanges}
              loading={loading}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
