import clsxm from "@/utils/clsxm";
import React, { memo } from "react";

import Spinner from "./Spinner";

import type { FC, PropsWithChildren } from "react";
type LoadingButtonProps = {
  loading: boolean;
  btnColor?: string;
  textColor?: string;
} & PropsWithChildren;

const LoadingButton: FC<LoadingButtonProps> = ({
  loading = false,
  btnColor = "bg-ct-yellow-600",
  textColor = "text-white",
  children,
}): JSX.Element => {
  return (
    <button
      type="submit"
      className={clsxm(
        "flex justify-center",
        `w-full py-3 font-semibold ${btnColor} rounded-lg outline-none`,
        //#region  //*=========== severity ===========
        [loading && "bg-[#ccc]"]
      )}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <Spinner />
          <span className="inline-block text-slate-500">Loading...</span>
        </div>
      ) : (
        <span className={`${textColor}`}>{children}</span>
      )}
    </button>
  );
};
export default memo(LoadingButton);
