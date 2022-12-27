import React, { memo } from "react";

import Spinner from "./Spinner";

const FullScreenLoader = (): JSX.Element => {
  return (
    <div className="fixed h-screen w-screen">
      <div className="absolute top-64 left-1/2 -translate-x-1/2">
        <Spinner width={8} height={8} />
      </div>
    </div>
  );
};
export default memo(FullScreenLoader);
