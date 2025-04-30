import { useState, useEffect } from 'react';
import states from './assets/states';


function Modal(props) {
  const { handleModalClose, filters, sorting } = props;
  const [modalFilters, setModalFilters] = useState(null);
  const [modalSorting, setModalSorting] = useState(null);



  useEffect(()=>{
    setModalFilters(filters);
    setModalSorting(sorting);
    console.log("-- Modal() - useEffect()", {handleModalClose, filters, sorting, modalFilters, modalSorting});
  }, []);


  const handleSortField = (evt)=>{
    let obj = {...modalSorting};
    if (["sort-by"].includes(evt.target.id)) {
      obj.property = evt.target.value;
    } else if (["reverse"].includes(evt.target.id)) {
      obj.reverse = evt.target.checked;
    }
    setModalSorting(obj);
  }

  const handleFilterChange = (evt)=>{
    let obj = {...modalFilters};
    if (["state"].includes(evt.target.id)) {
      obj.State = evt.target.value;
    } else {
      obj[evt.target.id] = !!!obj[evt.target.id]
    }
    setModalFilters(obj);
  }

  const handleCloseClick = (evt)=>{
    if (["modal","btn-close"].includes(evt.target.id)) {
      handleModalClose(null);
    } else if (["reset"].includes(evt.target.id)) {

      let updatedFilters = {};
      Object.keys(filters).forEach((key)=>{
        let negValue = false;
        if (key === "State") negValue = '';
        updatedFilters[key] = negValue;
      });
      setModalFilters(updatedFilters);
      setModalSorting({property: "lastNameFirst", reverse: false});

    } else if (["apply"].includes(evt.target.id)) {
      handleModalClose({sorting:modalSorting, filters:modalFilters});
    }
  }

  const getFilterButtons = ()=>{
    const filterKeys = ["Senate","House","Republican","Democratic","2026","2028","2030"];
    let buttons = filterKeys.map((key)=>{
      //const activeClass = modalFilters[key] ? " active" : "";
      const activeClass = modalFilters[key] ? " active" : "";
      return (<button key={key} id={key} type="button" className={`btn btn-outline-primary${activeClass} w-100`} onClick={handleFilterChange}>{key}</button>);
    });
    return (
      <>
      <div className="d-grid w-100 mb-1" role="group" aria-label="Filter by Chamber">
        <div className="row">
        <div className="col-6 pe-1">{buttons[0]}</div>
        <div className="col-6 ps-1">{buttons[1]}</div>
        </div>
      </div>
      <div className="d-grid w-100 mb-1" role="group" aria-label="Filter by Chamber">
        <div className="row">
        <div className="col-6 pe-1">{buttons[2]}</div>
        <div className="col-6 ps-1">{buttons[3]}</div>
        </div>
      </div>
      <div className="d-grid w-100 mb-1" role="group" aria-label="Filter by Chamber">
        <div className="row">
          <div className="col-4 pe-0">{buttons[4]}</div>
          <div className="col-4 px-1">{buttons[5]}</div>
          <div className="col-4 ps-0">{buttons[6]}</div>
        </div>
      </div>
      </>
    );
  }

  const getStateSelect = ()=>{
    let options = Object.keys(states).map((key)=>{
      return (<option key={`key_${key}`} value={key} defaultValue>{states[key]}</option>);
    });

    return (
      <select id="state" value={modalFilters.State} onChange={handleFilterChange} placeholder="Select a state" className="form-select border-primary text-primary" aria-label="Sort by state">
        <option key="key_default" value="" defaultValue>None</option>
        {options}
      </select>
    );
  }

  if (!modalSorting || !modalFilters) return(<></>);
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
                <select id="sort-by" value={modalSorting.property} onChange={handleSortField} placeholder="Sort by" className="form-select border-primary text-primary mb-2" aria-label="Sort by">
                  <option key="0" value="lastNameFirst" defaultValue>Last Name</option>
                  <option key="1" value="birthYear">Age</option>
                  <option key="2" value="reelectionYear">Next Election</option>
                </select>
                <div className="form-check form-switch">
                  <input id="reverse" onChange={handleSortField} className="form-check-input border-primary text-primary" type="checkbox" role="switch" checked={modalSorting.reverse} />
                  <label className="form-check-label" htmlFor="reverse">Reverse order</label>
                </div>
              </div>
              <label className="form-label">Filter By</label>
              <div className="w-100" role="group" aria-label="Modal launch buttons">
                {getFilterButtons()}
              </div>
              {getStateSelect()}
            </div>
            <div className="modal-footer">
              <button id="reset" type="button" className="btn btn-primary">Reset</button>
              <button id="apply" type="button" className="btn btn-primary">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal;
