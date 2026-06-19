import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onClose?: () => void;
}

export const SuccessDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onClose,
}: SuccessDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
            <AlertDialogTitle className="text-center text-2xl">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base mt-2">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} className="w-full">
            Ok
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};