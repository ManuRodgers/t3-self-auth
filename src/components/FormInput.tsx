import React, { memo } from "react";
import { useFormContext } from "react-hook-form";

type FormInputProps<T> = {
  label: string;
  name: T;
  type?: React.HTMLInputTypeAttribute | undefined;
};

const FormInput = <T extends string>({
  label,
  name,
  type = "text",
}: FormInputProps<T>): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="">
      <label className="mb-3 block text-blue-600" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        className="block w-full appearance-none rounded-2xl py-2 px-4 focus:outline-none"
        {...register(name)}
      />
      {errors[name]?.message && (
        <p className="pt-1 text-xs text-red-500">
          {errors[name]?.message as unknown as string}
        </p>
      )}
    </div>
  );
};
const MemoizedFormInput = memo(FormInput) as typeof FormInput;
export default MemoizedFormInput;
