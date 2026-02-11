type SearchBarProps = {
  onSearch?: (value: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <input
      className="search"
      type="search"
      placeholder="Search..."
      onChange={(e) => onSearch?.(e.target.value)}
    />
  );
}