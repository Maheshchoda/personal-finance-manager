import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  title: string;
  message: string;
}

interface ConfirmationPromise {
  resolve: (value: boolean) => void;
}

type UseConfirmReturnType = [React.FC, () => Promise<boolean>];

const useConfirm = ({
  title,
  message,
}: ConfirmDialogProps): UseConfirmReturnType => {
  const [confirmationPromise, setConfirmationPromise] =
    useState<ConfirmationPromise | null>(null);

  // Function to initiate the confirmation and return a promise
  const confirm = () => {
    return new Promise<boolean>((resolve) => {
      setConfirmationPromise({ resolve });
    });
  };

  // Handlers to resolve the promise based on user actions
  const handleConfirm = () => {
    confirmationPromise?.resolve(true);
    closeDialog();
  };

  const handleCancel = () => {
    confirmationPromise?.resolve(false);
    closeDialog();
  };

  // Function to reset the confirmation state
  const closeDialog = () => {
    setConfirmationPromise(null);
  };

  // Confirmation dialog component
  const ConfirmationDialog: React.FC = () => {
    return (
      <Dialog open={confirmationPromise !== null} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return [ConfirmationDialog, confirm];
};

export default useConfirm;
