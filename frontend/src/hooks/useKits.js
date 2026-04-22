import { useEffect, useState } from "react";
import { getKits } from "../services/kitService";

export function useKits() {
  const [kits, setKits]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getKits()
      .then(setKits)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { kits, loading, error };
}
