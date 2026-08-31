"use dom";

import { useDOMImperativeHandle, type DOMImperativeFactory } from "expo/dom";
import { Ref, useRef } from "react";

export interface DOMRef extends DOMImperativeFactory {
  focus: () => void;
}

export default function MyComponent(props: {
  ref: Ref<DOMRef>;
  dom?: import("expo/dom").DOMProps;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useDOMImperativeHandle(
    props.ref,
    () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }),
    [],
  );

  return <input ref={inputRef} />;
}
