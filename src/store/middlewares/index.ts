// use devtools middleware as last as possible
import type { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const myMiddlewares = <S, A>(
  initializer: StateCreator<
    S & A,
    [["zustand/immer", never], ["zustand/devtools", never]],
    [],
    S & A
  >
) => immer(devtools(initializer));
