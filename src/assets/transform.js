import memberListData from './memberListData';

let testData = memberListData.members.map((member)=>{
	return {
		name: member.directOrderName,
		id: member.bioguideId
	}
});

export default testData;