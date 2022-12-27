import { useUserStore } from "@/store/user.store";
import { trpc } from "@/utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { memo } from "react";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

const Header = (): JSX.Element => {
  const { authUser, pageLoading } = useUserStore();
  const queryClient = useQueryClient();
  const { mutate: logoutUser } = trpc.auth.logoutUser.useMutation({
    onSuccess: () => {
      queryClient.clear();
      document.location.href = "/login";
    },
    onError: (error) => {
      toast(error.message, { type: "error", position: "top-right" });
      queryClient.clear();
      document.location.href = "/login";
    },
    onSettled: () => {
      console.log("onSettled: ");
    },
  });

  return (
    <>
      <header className="h-20 bg-white">
        <nav className="container flex h-full items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-semibold text-blue-600">
              CodevoWeb
            </Link>
          </div>
          <ul>
            <li>
              <Link href="/" className="text-blue-600">
                Home
              </Link>
            </li>
            {!authUser && (
              <>
                <li>
                  <Link href="/register" className="text-blue-600">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-blue-600">
                    Login
                  </Link>
                </li>
              </>
            )}
            {authUser && (
              <>
                <li>
                  <Link href="/profile" className="text-blue-600">
                    Profile
                  </Link>
                </li>
                <li className="cursor-pointer">Create Post</li>
                <li
                  className="cursor-pointer"
                  onClick={() => {
                    logoutUser();
                  }}
                >
                  Logout
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <div className="fixed pt-4 pl-2 text-blue-600">
        {pageLoading && <Spinner color="text-yellow-600" />}
      </div>
    </>
  );
};
export default memo(Header);
