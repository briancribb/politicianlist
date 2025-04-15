import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './MemberList.scss';
import utils from './assets/utils';
import memberListData from './assets/memberListData';

function MemberList() {
  console.log({utils,memberListData});
  return (
    <>
      <div className="container pt-5">
        <h1>Politician List</h1>
        <p className="lead">A list of current members of Congress</p>
        <p>I need to build something to show off some modern code, so I just grabbed the array of members from three direct calls in the browser and imported it. This is enough to get started.</p>
        <p>Here's the <a target="_blank" href="https://github.com/briancribb/gather-congress/">GitHub repo</a> for this utility.</p>
      </div>
    </>
  )
}

export default MemberList
