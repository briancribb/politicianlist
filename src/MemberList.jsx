import { useState, useEffect } from 'react';
import './MemberList.scss';
import memberListData from './assets/memberListData';
import Modal from './Modal';

export default function MemberList() {
  console.log({memberListData});
  const [arrMembers] = useState(memberListData.members);
  const [modalOpen, setModalOpen] = useState(false);
  const [textMatch, setTextMatch] = useState("");
  const [filters, setFilters] = useState([]);
  const [sortBy, setSortBy] = useState({property: "name", reverse: false});

  const handleTextSearch = (evt)=>{
    console.log("handleTextSearch", evt.target.value);
  }

  useEffect(()=>{
    console.log("-- MemberList() - useEffect()");
  });


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
      return <div className="mb-0">{`District ${member.district}`}</div>;
    } else {
      return null;
    }
  }


  const getFilteredMembers = (filters = {})=>{
    return arrMembers;
  }

  const getMembers = ()=>{

    return getFilteredMembers().map((member, index)=>{
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
      if (member.imageUrl === "" || !member.imageUrl) console.log("Missing stuff:", member);


      return (
        <div key={`key_${member.id}`} className={'member card mb-3 border border-'+partyColor}>
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
    return <Modal setModalOpen={setModalOpen} setSortBy={setSortBy} />
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
              <button type="button" className="d-inline-block btn btn-light flex-fill border border-dark w-50" data-view="filters" onClick={()=>{setModalOpen(true)}}>Filter and Sort</button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <input className="form-control form-control-lg" type="text" placeholder="Filter by name" onChange={handleTextSearch}/>
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