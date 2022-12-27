import { useUserStore } from "@/store/user.store";
import clsxm from "@/utils/clsxm";
import type { FC } from "react";
import React, { memo, useCallback } from "react";
import { Controller, useController, useFormContext } from "react-hook-form";
import Spinner from "./Spinner";

const CLOUDINARY_UPLOAD_PRESET = "t3-self-auth";
// const CLOUDINARY_URL =
//   "cloudinary://699675797747929:bOiBNDY7_5OSju9RMllQUJkLByY@dnpggokwb";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dnpggokwb/image/upload";
type FileUploadProps = { name: string };

const FileUpload: FC<FileUploadProps> = ({ name }): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { field } = useController({ name, control });
  const { uploadingImage, setUploadingImage } = useUserStore();
  const onFileDrop = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      if (!target.files) return;
      const newFile = Object.values(target.files).map((file: File) => file);
      const formData = new FormData();
      formData.append("file", newFile[0]!);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      setUploadingImage(true);
      const data = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          setUploadingImage(false);
          return res.json();
        })
        .catch((error) => {
          setUploadingImage(false);
          console.log("error: ", error);
        });
      console.log("data: ", data);

      if (data.secure_url) {
        field.onChange(data.secure_url);
      }
    },
    [setUploadingImage, field]
  );
  return (
    <Controller
      name={name}
      defaultValue=""
      control={control}
      render={({ field: { name, onBlur, ref } }) => (
        <>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <span className="mb-2 block">Choose Profile photo</span>
              <input
                className={clsxm(
                  "mb-2 block text-sm text-slate-500",
                  //#region  //*=========== file ===========
                  [
                    "file:mr-4 file:rounded-full file:border-0 file:py-2 file:px-4",
                    "file:bg-violet-50 hover:file:bg-violet-100",
                    "file:text-sm file:font-semibold file:text-violet-700",
                  ]
                )}
                type="file"
                name={name}
                onBlur={onBlur}
                ref={ref}
                multiple={false}
                accept="image/jpg, image/png, image/jpeg"
                onChange={onFileDrop}
              />
            </div>
            <div>{uploadingImage && <Spinner color="text-yellow-400" />}</div>
          </div>
          <p
            className={clsxm(
              "mb-2 text-xs italic text-red-500",
              //#region  //*=========== errors[name] ===========
              [`${errors[name] ? "visible" : "invisible"}`]
            )}
          >
            {errors[name] && (errors[name]?.message as unknown as string)}
          </p>
        </>
      )}
    />
  );
};
export default memo(FileUpload);
