import FilterCheckBox from './InputComponents/FilterCheckBox';

const OffCanvas = ({ canvasId, filterAction }) => {
  return (
    <div className="offcanvas offcanvas-end proposal-sent" tabIndex={-1} id={canvasId}>
      <div className="offcanvas-header ht-80 px-4 border-bottom border-gray-5">
        <div>
          <h2 className="fs-16 fw-bold text-truncate-1-line">Filter Columns</h2>
        </div>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
      </div>
      <div className="py-3 px-4 d-flex justify-content-between align-items-center border-bottom border-bottom-dashed border-gray-5 bg-gray-100">
        <div>
          <span className="fw-bold text-dark">Date:</span>
          <span className="fs-11 fw-medium text-muted">25 MAY, 2023</span>
        </div>
        <div>
          <span className="fw-bold text-dark">Proposal No:</span>
          <span className="fs-12 fw-bold text-primary c-pointer">#NXL369852</span>
        </div>
      </div>
      <div className="offcanvas-body">
        <FilterCheckBox filterAction={filterAction}/>
      </div>
      <div className="px-4 gap-2 d-flex align-items-center ht-80 border border-end-0 border-gray-2">
        <a href="#" className="btn btn-primary w-50">Apply Filter</a>
        <a href="#" className="btn btn-danger w-50" data-bs-dismiss="offcanvas">
          Cancel
        </a>
      </div>
    </div>
  );
};

export default OffCanvas;
