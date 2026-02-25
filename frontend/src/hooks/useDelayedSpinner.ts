import { useEffect, useState } from "react";

export function useDelayedSpinner(loading: boolean, delayMs = 300) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timer: number | undefined;

    if (loading) {
      setShowSpinner(false);
      timer = window.setTimeout(() => {
        setShowSpinner(true);
      }, delayMs);
    } else {
      setShowSpinner(false);
    }

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [loading, delayMs]);

  useEffect(() => {
  }, [showSpinner]);

  return showSpinner;
}