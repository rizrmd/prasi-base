import { useRef } from "react";
import { proxy, Snapshot, useSnapshot } from "valtio";
import { getVersion } from "valtio";

export const local = proxy;
export const useLocal = <T extends object>(init: () => T) => {
  const ref = useRef<T>(undefined as any);
  if (!ref.current) {
    const data = init();
    ref.current = isValtioProxy(data) ? data : proxy(data);
  }
  const local = ref.current;

  for (const [key, v] of Object.entries(local)) {
    if (typeof v === "object" && v && v.hasOwnProperty("_bind")) {
      v._bind = [key, local];
    }
  }

  if (!(local as any).set) {
    (local as any).set = (update: (write: T) => void) => {
      update(local);
    };
  }
  const snap = useSnapshot(local);

  return snap as Snapshot<T> & {
    set: (update: (write: T) => void) => void;
  };
};

const isValtioProxy = (obj: object) => typeof getVersion(obj) === "number";
