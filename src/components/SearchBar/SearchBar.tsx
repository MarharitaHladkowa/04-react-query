import { useId } from "react";
import css from "./SearchBar.module.css";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const searchInputId = useId(); //
  const handleFormAction = (formData: FormData) => {
    const queryValue = formData.get("query") as string;
    const trimmedQuery = queryValue.trim();

    if (!trimmedQuery) {
      toast.error("Please enter a search query.");
      return;
    }

    onSubmit(trimmedQuery);
  };
  return (
    <header className={css.header}>
      {" "}
      <form className={css.searchForm} action={handleFormAction}>
                       {" "}
        <label htmlFor={searchInputId} className={css.visuallyHidden}>
                    Search for movies        {" "}
        </label>
                       {" "}
        <input
          type="text"
          name="query"
          id={searchInputId}
          autoComplete="off"
          autoFocus
          placeholder="Search for movies..."
          className={css.input}
          defaultValue=""
        />
                       {" "}
        <button type="submit" className={css.button}>
                    <FiSearch size={20} />       {" "}
        </button>
             {" "}
      </form>
         {" "}
    </header>
  );
}
