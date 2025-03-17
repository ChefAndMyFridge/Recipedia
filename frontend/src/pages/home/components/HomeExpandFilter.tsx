import FilterButton from "@components/common/button/FilterButton";

interface HomeExpandFilterProps {
  filterType: "type" | "preference" | "dislike";
  filteringElems: string[];
  filteredElems: string[];
  handleFilter: (filterType: "type" | "preference" | "dislike", elem: string) => void;
  handleClear: (filterType: "type" | "preference" | "dislike") => void;
}

const HomeExpandFilter = ({
  filterType,
  filteringElems,
  filteredElems,
  handleFilter,
  handleClear,
}: HomeExpandFilterProps) => {
  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-md z-10 px-4 py-3">
      <div>
        <div>
          <div className="flex justify-between items-center h-8 mb-2 border-content">
            {filterType === "type" && <span className="font-preBold text-sm">음식 장르</span>}
            {filterType === "preference" && <span className="font-preBold text-sm">선호 식단</span>}
            {filterType === "dislike" && <span className="font-preBold text-sm">비선호 식단</span>}
            <button className="font-preBold text-sm text-primary" onClick={() => handleClear(filterType)}>
              초기화
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {filteringElems.map((elem, index) => (
              <FilterButton
                key={index}
                isSelected={filteredElems.includes(elem)}
                content={elem}
                onAction={() => handleFilter(filterType, elem)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeExpandFilter;
