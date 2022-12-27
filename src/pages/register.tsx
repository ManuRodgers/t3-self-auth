import FileUpload from "@/components/FileUpload";
import MemoizedFormInput from "@/components/FormInput";

import LoadingButton from "@/components/LoadingButton";
import type { RegisterUserInput } from "@/server/user/user.schema";
import { registerUserSchema } from "@/server/user/user.schema";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type RegisterUserInputKeys = keyof RegisterUserInput;

const RegisterPage: NextPage = (): JSX.Element => {
  const router = useRouter();

  const { mutate: registerUser, isLoading } =
    trpc.auth.registerUser.useMutation({
      onSuccess: (data) => {
        toast(`Welcome ${data.data.user.name}`, {
          type: "success",
          position: "top-right",
        });
      },
      onError: (error) => {
        toast.error(error.message, {
          type: "error",
          position: "top-right",
        });
      },
    });

  const methods = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<RegisterUserInput> = (values) => {
    console.log("values: ", values);
    registerUser(values);
  };
  return (
    <section className="grid min-h-screen place-items-center bg-blue-600 py-8">
      <div className="w-full">
        <h1 className="mb-4 text-center text-4xl font-semibold text-yellow-600 xl:text-6xl">
          Welcome to T3 self auth
        </h1>
        <h2 className="mb-4 text-center text-lg text-blue-200">
          Register To Get Started
        </h2>
        <FormProvider {...methods}>
          <form
            className="mx-auto w-full max-w-md space-y-5 overflow-hidden rounded-2xl bg-blue-200 p-8 shadow-lg"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <MemoizedFormInput<RegisterUserInputKeys>
              label="Full Name"
              name="name"
            />
            <MemoizedFormInput<RegisterUserInputKeys>
              label="Email"
              name="email"
              type="email"
            />
            <MemoizedFormInput<RegisterUserInputKeys>
              label="Password"
              name="password"
              type="password"
            />
            <MemoizedFormInput<RegisterUserInputKeys>
              label="Confirm Password"
              name="passwordConfirmation"
              type="password"
            />
            <FileUpload name="photo" />
            <span className="block">
              Already have an account?
              <Link href="/login" />
            </span>
            <LoadingButton loading={isLoading}>Register</LoadingButton>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};
// public page
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      requireAuth: false,
      enableAuth: false,
    },
  };
};
export default RegisterPage;
