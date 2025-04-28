import { useState, useEffect } from 'react';
import './MemberList.scss';
import memberListData from './assets/memberListData';
import Modal from './Modal';
import moodyImageUrl from "./assets/Ashley_Moody_M001244.jpg";

export default function MemberList() {
  //console.log({memberListData});
  const [allMembers] = useState(memberListData.members);
  const [modalOpen, setModalOpen] = useState(false);
  const [textMatch, setTextMatch] = useState("");
  const [sorting, setSorting] = useState({property: "lastNameFirst", reverse: false});
  const [filters, setFilters] = useState({Senate:false,House:false,Republican:false,Democrat:false,"2026":false,"2028":false,"2030":false,State:""});
  const [modalProps, setModalProps] = useState({
    filter: {chamber:[],partyName:[],reelectionYear:[], stateCode:[]},
    sort: {property: "lastNameFirst", reverse: false}
  });

  useEffect(()=>{
    //console.log("-- MemberList() - useEffect()", allMembers);
  });


  const handleTextSearch = (evt)=>{
    setTextMatch(evt.target.value);
  }

  const handleModalClose = (objUpdate = null)=>{
    setModalOpen(false);
    if (!objUpdate) return;
    if (objUpdate.sorting) setSorting(objUpdate.sorting);
    if (objUpdate.filters) setFilters(objUpdate.filters);
    setTextMatch("");
  }

  const getIconClass = (party)=>{
    let objClasses = {
      "R":"fas fa-republican",
      "D":"fas fa-democrat",
      "I":"fas fa-flag-usa"
    }
    return objClasses[party] || objClasses['I'];
  }

  const getRepDistrict = (member)=>{
    if (member.type === "Representative") {
      return <div className="mb-0">{`District: ${member.district}`}</div>;
    } else {
      return null;
    }
  }


  const getFilteredAndSorted = ()=>{
    let filteredMembers = allMembers.filter((member)=> {
      let pass = true;
      if (textMatch.length >= 3 && !member.lastNameFirst.toLowerCase().includes( textMatch.toLowerCase() )) {
        pass = false;
      }

      return pass;
    });
    filteredMembers.sort((a,b)=>{
      let itemA = a[sorting.property].toString().toUpperCase();
      let itemB = b[sorting.property].toString().toUpperCase();

      /*
      Flipping "a" and "b" because we have a birth year and we're trying to sort by age.
      Going backwards here will put the youngest first on regular and the oldest first on reverse.
      */
      if (sorting.property === "birthYear") {
        itemA = parseInt(b[sorting.property]);
        itemB = parseInt(a[sorting.property]);
      }


      // Regular sorting.
      if (itemA < itemB) return -1;
      if (itemA > itemB) return 1;

      return 0;
    });
    if (sorting.reverse) {
      filteredMembers.reverse();
    }


    return filteredMembers;
  }

  const getMembers = ()=>{

    return getFilteredAndSorted().map((member, index)=>{
      let typeAbbr = member.type === "Senator" ? "Senator" : "Rep";
      let partyColor = 'success';
      switch(member.partyAbbr) {
        case "R":
          partyColor = 'danger'
          break;
        case "D":
          partyColor = 'primary'
          break;
      }

      if (member.id === "M001244" && !member.imageUrl) member.imageUrl = moodyImageUrl;
      return (
        <div id={member.id} key={`key_${member.id}`} className={'member card mb-3 border border-'+partyColor}>
          <div className={'card-header bg-'+partyColor+' text-white d-sm-flex justify-content-between'}>
            <div className="party"><i className={getIconClass(member.partyAbbr) + ' mr-2'}></i>
            &nbsp;{`${member.partyName} ${member.type}`}</div>
            <div className="next">Reelection: <strong>{member.reelectionYear}</strong></div>
          </div>
          <div className="card-body">
            <div className="d-sm-flex">
              <div className="member-photo-wrapper mb-2 mb-sm-0">
                <img className="member-photo img-fluid mx-auto ml-sm-0" alt={`Image of ${member.fullName}`} src={member.imageUrl || ""} loading="lazy" />
                <div className="missing-photo text-center">
                  <i className="fas fa-user mb-3 text-secondary"></i>
                  <small className="d-block">Photo not available</small>
                </div>
              </div>
              <div className="member-info-wrapper">
                <h5 className="card-title mb-1">{member.fullName}</h5>
                <div className="mb-0">{member.state_name}</div>
                <div className="mb-0">{member.stateName}</div>
                {getRepDistrict(member)}
                <div className="mb-0">{'Birth Year: '+member.birthYear}</div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  const getModal = ()=>{
    if (!modalOpen) return null;
    return <Modal handleModalClose={handleModalClose} filters={filters} sorting={sorting} />
  }


  return (
    <>
      <div className="container pt-5">
        <h1>Politician List</h1>
        <p className="lead">A list of current members of Congress</p>
        <p>I need to build something to show off some modern code, so I just grabbed the array of members from three direct calls in the browser and imported it. This is enough to get started.</p>
        <p>Here's the <a target="_blank" href="https://github.com/briancribb/gather-congress/">GitHub repo</a> for this utility.</p>
      </div>

      <div className="container">
        <div className="row">
          <div className="col">
            <div className="btn-group btn-group-lg w-100 mb-3" role="group" aria-label="Modal launch buttons">
              <button type="button" className="d-inline-block btn btn-light flex-fill border border-dark w-50" onClick={()=>{setModalOpen(true)}}>Filter and Sort</button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <input value={textMatch} className="form-control form-control-lg" type="text" placeholder="Filter by name" onChange={handleTextSearch}/>
            <small className="d-block mt-1 mb-3 px-3"><em>Filtering by name requires at least three characters.</em></small>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {getMembers()}
          </div>
        </div>
      </div>
      {getModal()}
    </>
  )
}