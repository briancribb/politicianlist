import { useState, useEffect } from 'react';
import states from './assets/states';


function Modal(props) {
  console.log("Modal()");
  const { handleModalClose, setSortBy } = props;
  const [sortProp, setSortProp] = useState('lastNameFirst');
  const [reverse, setReverse] = useState(false);



  useEffect(()=>{
    //console.log("-- Modal() - useEffect()", states);
  });


  const handleSortField = (evt)=>{
    if (["sort-by"].includes(evt.target.id)) {
      console.log();
    } else if (["reverse"].includes(evt.target.id)) {
      console.log();
    }
  }

  const handleCloseClick = (evt)=>{
    if (["modal","btn-close"].includes(evt.target.id)) {
      handleModalClose(null);
    } else if (["apply"].includes(evt.target.id)) {
      handleModalClose({stuff:"things"});
    }
  }

  const getFilterButtons = ()=>{

  }

  const getStateSelect = ()=>{
    let options = Object.keys(states).map((key)=>{
      return (<option key={`key_${key}`} value={key} defaultValue>{states[key]}</option>);
    });

    return (
      <select id="state" onChange={handleSortField} placeholder="Select a state" className="form-select border-primary text-primary" aria-label="Sort by state">
        <option key="key_default" value="" defaultValue>None</option>
        {options}
      </select>
    );
  }

  return (
    <>
      <div className="modal fade show" id="modal" onClick={handleCloseClick} tabIndex="-1" aria-labelledby="modal-label" aria-modal="true" role="dialog">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modal-label">Sort and Filter</h1>
              <button type="button" id="btn-close" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <label htmlFor="sort-by" className="form-label">Sort By</label>
                <select id="sort-by" onChange={handleSortField} placeholder="Sort by" className="form-select mb-2" aria-label="Sort by">
                  <option key="0" value="lastNameFirst" defaultValue>Last Name</option>
                  <option key="1" value="birthYear">Birth Year</option>
                  <option key="2" value="reelectionYear">Next Election</option>
                </select>
                <div className="form-check form-switch">
                  <input id="reverse" onChange={handleSortField} className="form-check-input" type="checkbox" role="switch" />
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
              {getStateSelect()}
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
