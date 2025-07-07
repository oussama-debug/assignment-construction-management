"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@civalgo/ui/button";
import { FormField } from "@civalgo/ui/field";
import { MoveRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@civalgo/authentication/client";

import { AuthFormLayout } from "../form-layout";
import FormSocial from "../form-social";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type Login = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Login() {
  const router = useRouter();
  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleLogin = async (values: Login) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
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
      title={"Welcome back, we've missed you !"}
      footerText={"Don't have an account?"}
      footerLinkText={"Sign up"}
      footerLinkHref={"/register"}
      onSubmit={handleSubmit(handleLogin)}
      maxHeight="max-h-[calc(480/16*1rem)]"
      minHeight="min-h-[calc(320/16*1rem)]"
    >
      <div className="flex flex-col space-y-4">
        <FormField
          id="email"
          label={"Email"}
          registration={register("email")}
          error={errors.email}
          className="w-full"
          placeholder={"Enter your email"}
        />
        <div className="flex flex-col w-full justify-start items-start space-y-1.5">
          <FormField
            id="password"
            label={"Password"}
            type="password"
            placeholder={"Enter your password"}
            registration={register("password")}
            className="w-full"
            error={errors.password}
          />
          <Link
            href="/forgot"
            className="text-[.72rem] text-zinc-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>
      <Button
        variant="default"
        className="space-x-3"
        type="submit"
        disabled={isLoading}
        loading={isLoading}
      >
        <span className="text-xs">Login</span>
        <MoveRight className="h-4 w-4" />
      </Button>
      <FormSocial isLoading={isLoading} />
    </AuthFormLayout>
  );
}
