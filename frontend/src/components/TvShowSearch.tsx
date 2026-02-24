import { useEffect, useState } from "react";
import type { TVShow } from "../types";
import { useAuth } from "../auth/AuthContext";

type TvShowSearchProps = {
    onSelect?: (show: TVShow) => void;
};

export default function TvShowSearch({ onSelect } : TvShowSearchProps) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<TVShow[]>([]);
  const [showList, setShowList] = useState<boolean>(false);
  const [debounced, setDebounced] = useState(query);
  const [userTyping, setUserTyping] = useState<boolean>(false);
  const { token } = useAuth()


  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const search = async () => {
      
      if (!userTyping) {
        setShowList(false);
        return;
      }

      if (debounced.length < 2) {
        setResults([]);
        setShowList(false);
        return;
      }

      const res = await fetch(`/api/tvshow/search?q=${encodeURIComponent(debounced)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
      });
      if (!res.ok) {
        throw new Error("Unable to fetch tvshows");
      }
      const data = await res.json();
      setResults(data);
      setShowList(true);
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
      <input
        className="search"
        type="search"
        placeholder="Search TV show..."
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => { if (userTyping && results.length > 0) setShowList(true); }}
      />

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