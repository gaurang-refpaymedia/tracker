import React, { useState } from 'react'; // Import useState
import { useFilter } from '../../contextApi/FilterContext';

const FilterCheckBox = ({filterAction}) => {

  console.log("filterAction",filterAction);
  const { selectedFilters, setSelectedFilters } = useFilter();

  const handleFilterClick = (filterValue) => {
    const allAvailableValues = filterAction.filter((item) => item.value !== 'All').map((item) => item.value);

    if (filterValue === 'All') {
      setSelectedFilters((prevSelected) => {
        const areAllCurrentlySelected = allAvailableValues.every((val) => prevSelected.includes(val)) && prevSelected.length === allAvailableValues.length;

        if (areAllCurrentlySelected) {
          return [];
        } else {
          return allAvailableValues;
        }
      });
      return;
    }

    setSelectedFilters((prevSelected) => {
      const isAllImplicitlySelected = allAvailableValues.every((val) => prevSelected.includes(val)) && prevSelected.length === allAvailableValues.length;

      if (isAllImplicitlySelected) {
        return [filterValue];
      }

      if (prevSelected.includes(filterValue)) {
        return prevSelected.filter((value) => value != filterValue);
      } else {
        return [...prevSelected, filterValue];
      }
    });
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-2 p-2 border rounded bg-light">
        {filterAction.map((filter) => (
          <button key={filter.value} type="button" className={`filter-value-button btn ${selectedFilters.includes(filter.value) ? 'btn-primary' : 'btn-outline-secondary'} d-flex align-items-center`} onClick={() => handleFilterClick(filter.value)}>
            {filter.icon}
            <span className="ms-2">{filter.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-3">
        <h6>Currently Selected:</h6>
        <p>
          {selectedFilters.length > 0
            ? selectedFilters.map((val) => (
                <span key={val} className="badge bg-info text-dark me-2">
                  {val}
                </span>
              ))
            : 'None'}
        </p>
      </div>
    </>
  );
};

export default FilterCheckBox;
