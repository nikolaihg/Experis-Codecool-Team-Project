import { useEffect, useState } from "react";
import type { TVShow } from "../types";
import { useAuth } from "../auth/AuthContext";
import { useDelayedSpinner } from "../hooks/useDelayedSpinner";
import { LoadingComponent } from "./Loading/Loading";

type TvShowSearchProps = {
  onSelect?: (show: TVShow) => void;
  resetTrigger?: number;
};

export default function TvShowSearch({ onSelect, resetTrigger = 0 }: TvShowSearchProps) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<TVShow[]>([]);
  const [showList, setShowList] = useState<boolean>(false);
  const [debounced, setDebounced] = useState(query);
  const [userTyping, setUserTyping] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const showSpinner = useDelayedSpinner(loading, 250);
  const { token } = useAuth()


  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setQuery("");
    setDebounced("");
    setResults([]);
    setShowList(false);
    setUserTyping(false);
  }, [resetTrigger]);

  useEffect(() => {
    const search = async () => {

      if (!userTyping) {
        setShowList(false);
        return;
      }

      if (debounced.length < 2) {
        setResults([]);
        setShowList(false);
        setLoading(false)
        return;
      }

      setLoading(true)
      try {
        const res = await fetch(`/api/tvshow/search?q=${encodeURIComponent(debounced)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!res.ok) throw new Error("Unable to fetch tvshows");
        const data = await res.json();
        setResults(data);
        setShowList(true);
      } catch (err: any) {
        setResults([]);
        setShowList(false)
        console.error(err)
      } finally {
        setLoading(false)
      }
    };

    search();
  }, [debounced, userTyping]);

  const handleChange = (value: string) => {
    setUserTyping(true);
    setQuery(value);
  }

  const handleSelect = (show: TVShow) => {
    setUserTyping(false);
    setQuery(show.title);
    setResults([]);
    setShowList(false);
    onSelect?.(show);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{ position: "relative", display: "inline-block", width: 250 }} aria-busy={loading}>
        <input
          className="search"
          type="search"
          placeholder="Search TV show..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => { if (userTyping && results.length > 0) setShowList(true); }}
          style={{
              width: "100%",
              boxSizing: "border-box",
            }}
        />

        {showSpinner && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: "absolute",
              right: 21,
              top: "60%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{ transform: "scale(0.4)", transformOrigin: "right center" }}>
              <LoadingComponent />
            </div>
          </div>
        )}
      </div>

      {showList && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "black",
            border: "1px solid #ddd",
            borderRadius: 4,
            marginTop: 4,
            zIndex: 20,
          }}
        >
          {results.map((r) => (
            <div
              key={r.id}
              style={{
                padding: "8px 10px",
                cursor: "pointer",
              }}
              onClick={() => handleSelect(r)}
            >
              {r.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}