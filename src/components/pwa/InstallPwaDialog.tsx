'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Download, Smartphone, Laptop } from 'lucide-react';
import { Logo } from '../Logo';

interface InstallPwaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
}

export function InstallPwaDialog({ isOpen, onClose, onInstall }: InstallPwaDialogProps) {
  const handleInstallClick = () => {
    onInstall();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Logo />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            Install JobTrack
          </DialogTitle>
          <DialogDescription className="text-center">
            Get a native app experience on your phone or desktop for faster access to your job applications.
          </DialogDescription>
        </DialogHeader>
        <div className="my-6 grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col items-center gap-2 rounded-lg bg-muted p-4">
                <Smartphone className="h-8 w-8 text-primary" />
                <p className="font-semibold">Mobile</p>
                <p className="text-xs text-muted-foreground">Access on the go</p>
            </div>
             <div className="flex flex-col items-center gap-2 rounded-lg bg-muted p-4">
                <Laptop className="h-8 w-8 text-primary" />
                <p className="font-semibold">Desktop</p>
                <p className="text-xs text-muted-foreground">Works offline</p>
            </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button type="button" size="lg" onClick={handleInstallClick} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Install App
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
