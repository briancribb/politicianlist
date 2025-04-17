import { useState } from 'react';
import './MemberList.scss';
import utils from './assets/utils';
import memberListData from './assets/memberListData';

function MemberList() {
  console.log({utils,memberListData});
  const [memberData] = useState(memberListData.members);


  const getMembers = ()=>{
    let listItems = memberData.map((member)=>{
      return (<li>{member.directOrderName}</li>);
    });
    return (<ul>{listItems}</ul>)
  }








  return (
    <>
      <div className="container pt-5">
        <h1>Politician List</h1>
        <p className="lead">A list of current members of Congress</p>
        <p>I need to build something to show off some modern code, so I just grabbed the array of members from three direct calls in the browser and imported it. This is enough to get started.</p>
        <p>Here's the <a target="_blank" href="https://github.com/briancribb/gather-congress/">GitHub repo</a> for this utility.</p>
        {getMembers()}
      </div>
    </>
  )
}

export default MemberList
