import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteServiceDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteServiceDialog = ({ open, onClose, onConfirm }: DeleteServiceDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-card border-border-subtle">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Remover serviço</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Deseja remover este serviço da agenda? Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-surface-elevated border-border-subtle text-foreground hover:bg-secondary">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
