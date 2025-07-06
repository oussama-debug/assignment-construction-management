"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@civalgo/ui/button";
import { FormField } from "@civalgo/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveRight, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const createFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  slug: z
    .string()
    .min(2, { message: "Slug must be at least 2 characters" })
    .optional(),
});

export default function CreateForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const { mutateAsync: createWorkspace } =
    trpc.organization.create.useMutation();
  const generateSlugMutation = trpc.organization.generateSlug.useMutation();

  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const watchName = form.watch("name");

  useEffect(() => {
    const generateSlugFromName = async () => {
      if (watchName && watchName.length > 0) {
        setIsGeneratingSlug(true);
        try {
          const result = await generateSlugMutation.mutateAsync({
            name: watchName,
          });
          if (result.slug) {
            form.setValue("slug", result.slug);
          }
        } catch (error) {
          console.error("Error generating slug:", error);
        } finally {
          setIsGeneratingSlug(false);
        }
      } else {
        form.setValue("slug", "");
      }
    };

    const debounceTimer = setTimeout(generateSlugFromName, 500);
    return () => clearTimeout(debounceTimer);
  }, [watchName, generateSlugMutation, form]);

  const handleRegenerateSlug = async () => {
    if (watchName) {
      setIsGeneratingSlug(true);
      try {
        const result = await generateSlugMutation.mutateAsync({
          name: watchName,
        });
        if (result.slug) {
          form.setValue("slug", result.slug);
        }
      } catch (error) {
        console.error("Error generating slug:", error);
      } finally {
        setIsGeneratingSlug(false);
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof createFormSchema>) => {
    setIsLoading(true);
    await createWorkspace(
      {
        slug: data.slug || undefined,
        name: data.name,
        metadata: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
      {
        onError: () => setIsLoading(false),
        onSuccess: () => {
          router.push(`/workspaces/${data.slug}`);
        },
      }
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-2 flex-1 justify-center gap-y-4 rounded-t-md rounded-b-md border border-gray-950/3 bg-white w-full"
    >
      <FormField
        id="name"
        label="Workspace name"
        labelClassName="font-semibold! text-md! font-sans!"
        hint="This is the name of your workspace that will be used to identify it in the system, and publicly display it to your team."
        placeholder="Enter your workspace name"
        registration={form.register("name")}
        error={form.formState.errors.name}
        className="w-full"
      />

      <div className="relative">
        <FormField
          id="slug"
          label="Workspace URL"
          labelClassName="font-semibold! text-md! font-sans!"
          hint="This will be used in your workspace URL. It will be auto-generated from your workspace name."
          placeholder="workspace-url"
          registration={form.register("slug")}
          error={form.formState.errors.slug}
          className="w-full pr-10"
        />
        <button
          type="button"
          onClick={handleRegenerateSlug}
          disabled={!watchName || isGeneratingSlug}
          className="absolute right-2 top-8 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          title="Regenerate slug"
        >
          <RefreshCw
            size={16}
            className={isGeneratingSlug ? "animate-spin" : ""}
          />
        </button>
      </div>

      {form.watch("slug") && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          Your workspace will be available at:{" "}
          <span className="font-mono font-medium">
            /workspaces/{form.watch("slug")}
          </span>
        </div>
      )}

      <Button
        type="submit"
        variant="default"
        size={"sm"}
        className="space-x-2 mt-2"
        disabled={isLoading || isGeneratingSlug}
      >
        <span>{isLoading ? "Creating..." : "Create Workspace"}</span>
        <MoveRight size={14} />
      </Button>
    </form>
  );
}
