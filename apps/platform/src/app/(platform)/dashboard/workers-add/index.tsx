"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { MoveRight } from "lucide-react";

import { useCreateWorkers } from "@/lib/stores/use-create-workers";
import { trpc } from "@/lib/trpc/client";
import { authClient } from "@civalgo/authentication/client";
import { Button } from "@civalgo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@civalgo/ui/dialog";
import WorkersAddForm from "./workers-add-form";

export const WorkersAddFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export type WorkersAddFormSchemaType = z.infer<typeof WorkersAddFormSchema>;

export default function WorkersAdd() {
  const { setIsClosed, isOpen } = useCreateWorkers();
  const utils = trpc.useUtils();

  const { mutateAsync: createWorker, isPending } =
    trpc.worker.createWorker.useMutation({
      onSuccess: async () => {
        toast.success("Worker added successfully");
        utils.worker.getActiveCheckIns.invalidate();
        utils.worker.getWorkers.invalidate();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create worker");
      },
    });

  const form = useForm<WorkersAddFormSchemaType>({
    resolver: zodResolver(WorkersAddFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: WorkersAddFormSchemaType) => {
    const result = await createWorker(data);
    if (result?.id) {
      await authClient.signUp.email({
        email: data.email,
        password: "12345678",
        name: data.name,
      });
      setIsClosed();
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsClosed}>
      <DialogContent className="max-w-md px-0 pb-0 border border-zinc-400">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader className="border-b border-sidebar-border">
            <div className="flex flex-col space-y-1 px-5 pb-4">
              <DialogTitle className="text-[.85rem] font-medium">
                Add a new worker
              </DialogTitle>
              <DialogDescription className="text-[.8rem] text-zinc-500">
                Add a new worker to the system.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex w-full px-5 border-b py-2 border-sidebar-border flex-col bg-slate-50">
            <WorkersAddForm onSubmit={onSubmit} register={form.register} />
          </div>
          <DialogFooter className="flex items-center justify-end px-5 space-x-2 py-2">
            <Button variant="white" size="sm" onClick={() => setIsClosed()}>
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="space-x-2"
              type="submit"
              disabled={isPending}
            >
              <span>{isPending ? "Adding..." : "Add worker"}</span>
              <MoveRight size={16} strokeWidth={2.5} />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
