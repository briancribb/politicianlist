import { useState, useEffect } from 'react';

function Modal(props) {
  console.log("Modal()");
  const { handleModalClose, setSortBy } = props;

  useEffect(()=>{
    console.log("-- Modal() - useEffect()");
  });



  const handleCloseClick = (evt)=>{
    if (["modal","btn-close", "apply"].includes(evt.target.id)) {
      console.log("handleCloseClick()", {props, id:evt.target.id});
      handleModalClose();
    }
  }


  return (
    <>
      <div className="modal fade show" id="modal" onClick={handleCloseClick} tabIndex="-1" aria-labelledby="exampleModalLiveLabel" aria-modal="true" role="dialog">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLiveLabel">Sort and Filter</h1>
              <button type="button" id="btn-close" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <label htmlFor="sort-by" class="form-label">Sort By</label>
                <select id="sort-by" placeholder="Sort by" className="form-select mb-2" aria-label="Default select example">
                  <option value="0" defaultValue>Last Name</option>
                  <option value="1">Age</option>
                  <option value="2">Next Election</option>
                </select>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" role="switch" id="reverse" />
                  <label className="form-check-label" htmlFor="reverse">Reverse order</label>
                </div>
              </div>




              <h2 className="modal-title fs-3">Filter By</h2>
              <div className="btn-group w-100 mb-1" role="group" aria-label="Modal launch buttons">
                <button type="button" className="btn btn-outline-primary w-50">Senate</button>
                <button type="button" className="btn btn-outline-primary w-50">House</button>
              </div>
              <div className="btn-group w-100 mb-1" role="group" aria-label="Modal launch buttons">
                <button type="button" className="btn btn-outline-primary w-50">Republican</button>
                <button type="button" className="btn btn-outline-primary w-50">Democrat</button>
              </div>
              <div className="btn-group w-100 mb-3" role="group" aria-label="Modal launch buttons">
                <button type="button" className="btn btn-outline-primary">2026</button>
                <button type="button" className="btn btn-outline-primary">2028</button>
                <button type="button" className="btn btn-outline-primary">2030</button>
              </div>
            </div>
            <div className="modal-footer">
              <button id="apply" type="button" className="btn btn-primary">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal;
