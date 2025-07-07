"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@civalgo/ui/button";
import { FormField } from "@civalgo/ui/field";
import { MoveRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthFormLayout } from "../form-layout";
import FormSocial from "../form-social";
import { useRouter } from "next/navigation";
import { authClient } from "@civalgo/authentication/client";

export type SignupForm = z.infer<typeof signupSchema>;

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(4),
});

export default function SignUpForm() {
  const router = useRouter();
  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleSignUp = async (values: SignupForm) => {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      {
        onError: () => setIsLoading(false),
        onSuccess: () => {
          router.push("/dashboard");
        },
        onRequest: () => setIsLoading(true),
      }
    );
  };

  return (
    <AuthFormLayout
      title={"Get started for free"}
      footerText={"Already have an account?"}
      footerLinkText={"Login"}
      footerLinkHref={"/login"}
      onSubmit={handleSubmit(handleSignUp)}
      maxHeight="max-h-[calc(680/16*1rem)]"
      minHeight="min-h-[calc(320/16*1rem)]"
    >
      <div className="flex flex-col space-y-4">
        <FormField
          id="name"
          label={"Full name"}
          registration={register("name")}
          error={errors.name}
          className="w-full"
          placeholder={"Enter your full name"}
        />
        <FormField
          id="email"
          label={"Email"}
          registration={register("email")}
          error={errors.email}
          className="w-full"
          placeholder={"Enter your email"}
        />
        <FormField
          id="password"
          label={"Password"}
          type="password"
          placeholder={"Enter your password"}
          registration={register("password")}
          error={errors.password}
        />
      </div>
      <Button
        variant="default"
        className="space-x-3"
        type="submit"
        disabled={isLoading}
        loading={isLoading}
      >
        <span className="text-xs">Sign up</span>
        <MoveRight className="h-4 w-4" />
      </Button>
      <FormSocial isLoading={isLoading} />
    </AuthFormLayout>
  );
}
