import { useState } from "react";

function MultiSelectDropdown({ options, selectedItems, setSelectedItems, placeholder, span }) {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOptionToggle = (option) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(option)
        ? prevSelectedItems.filter((item) => item !== option)
        : [...prevSelectedItems, option]
    );
  };

  const getDisplayText = () => {
    return selectedItems.length > 0
      ? selectedItems.map((item) => item.name).join(", ")
      : placeholder;
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="input-group mb-3">
      <span className="input-group-text">{span}</span>
      <div
        className="form-control form-select dropdown-select"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {getDisplayText()}
      </div>
      {dropdownOpen && (
        <div className="dropdown-menu show dropdown-options">
          {/* Search Input */}
          <input
            type="text"
            className="form-control dropdown-search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Filtered Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <label key={option} className="dropdown-item">
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedItems.includes(option)}
                  onChange={() => handleOptionToggle(option)}
                />
                {option.name}
              </label>
            ))
          ) : (
            <div className="dropdown-item text-muted">No options found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default MultiSelectDropdown;
