import { useEffect, useRef } from "react";

/**
 * **Use only in DEBUG**
 * 
 * counts how many times this component has rendered
 * @param componentName name of the component that is being observed
 * @param props additional props to log
 * @returns 
 */
export function useRenderCount(componentName: string, props?: Record<string, any>) {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`[${componentName}] Render #${renderCount.current}`, props || "");
  });

  return renderCount.current;
}
