import { useState, useEffect } from 'react';

function Modal(props) {
  console.log("Modal()");
  const { setModalOpen,setSortBy } = props;

  useEffect(()=>{
    console.log("-- Modal() - useEffect()");
  });



  const handleCloseClick = (evt)=>{
    if (["modal","btn-close", "apply"].includes(evt.target.id)) {
      console.log("handleCloseClick()", {props, id:evt.target.id});
      setModalOpen(false);
    }
  }


  return (
    <>
      <div className="modal fade show" id="modal" onClick={handleCloseClick} tabindex="-1" aria-labelledby="exampleModalLiveLabel" aria-modal="true" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLiveLabel">Filter and Sort</h1>
              <button type="button" id="btn-close" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Woo-hoo, you're reading this text in a modal!</p>
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
