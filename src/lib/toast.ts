import { toast } from "sonner";

export const notify = {
  success: (message: string) =>
    toast.success(message, {
      duration: 3500,
    }),

  error: (message: string) =>
    toast.error(message, {
      duration: 4000,
    }),

  warning: (message: string) =>
    toast.warning(message, {
      duration: 3500,
    }),

  info: (message: string) =>
    toast.info(message, {
      duration: 3000,
    }),

  loading: (message: string) =>
    toast.loading(message),

  dismiss: (id?: string | number) =>
    toast.dismiss(id),
};