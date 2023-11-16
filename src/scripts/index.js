//import utils from '../../../_vendor/tmc/utils';
//import React from "../../../../node_modules/react";
//import ReactDOM from "../../../../node_modules/react-dom";


import {tmc_transEnd, tmc_documentHidden, tmc_RAF, tmc_throttle, tmc_debounce, tmc_getParams} from '../../../../_vendor/tmc/tmc-utils';
import states from './states';
import missing from './missing';
import MemberList from './components/Memberlist';
import modal from './components/modal';
/*
Member objects from ProPublica only have abbreviations for states, so this handy 
object will provide full names. Changed it from JSON to JS so I could import it.

https://gist.github.com/mshafrir/2646763

====================================================================================

Two calls to the ProPublica API will provide all of the data we'll need for the app.
One call for the House and another call for the Senate.

https://projects.propublica.org/api-docs/congress-api/
let api_key = 'mQSfoVKW5dWSJXfcHtxSAXFneRkyGqnBzmrp4jLx';
https://stackoverflow.com/questions/25515936/perform-curl-request-in-javascript

====================================================================================

Images for members of Congress will come from here. The id property in the member 
object is the bioguide property for the image.

https://github.com/unitedstates/images
https://theunitedstates.io/images/congress/[size]/[bioguide].jpg
*/
let RC = {MemberList,modal};
let POL = {
	congress: 118,
	init: function() {
		this.utils = this.setupUtils();
		let housePromise, senatePromise, allResults;

		/*
		Check local storage to see if we already have data from the past 24 hours. If it's there 
		then it's already processed and can be used immediately. If not, get data from the API, 
		process it and put it together.
		*/
		let localStored = this.getStored();

		if (localStored) {
			housePromise = Promise.resolve(localStored.house);
			senatePromise = Promise.resolve(localStored.senate)
		} else {
			housePromise = new Promise((resolve, reject) => {
				this.getData(this.congress,'house').then((data)=>{
					resolve(this.updateMembers(data.results[0]));
				});
			});
			senatePromise = new Promise((resolve, reject) => {
				this.getData(this.congress,'senate').then((data)=>{
					resolve(this.updateMembers(data.results[0]));
				});
			});
		}

		/*
		TODO: Get/set filters from local storage to reduce calls to the server. Use a timestamp 
		to make sure we still call once a day, but we're probably going to have to refresh the 
		page to get new query string parameters into the address bar. Then the user can just 
		copy/paste the url to share.
		*/
		Promise.all([housePromise, senatePromise]).then((allResults)=>{
			/*
			The "localStored" variable will be null if there's no data in the past 24 hours. 
			If it's null then the "allResults" data comes from the API and we should store it.
			*/
			if (!localStored) {
				localStorage.setItem('politicianlist_'+this.congress, JSON.stringify({
					timestamp: Date.now(),
					house: allResults[0],
					senate: allResults[1]
				}));
			}
			console.log({members:allResults[0].concat(allResults[1])});
			//ReactDOM.render(
			//	<RC.memberList parent={RC} members={allResults[0].concat(allResults[1])} />, document.getElementById('app')
			//);
			console.log('app and stuff');
			let domNode = document.getElementById('app');
			const root = ReactDOM.createRoot(domNode);
			root.render(React.createElement(MemberList,{members:allResults[0].concat(allResults[1])},null));
			//root.render(<MemberList name="Stuff and Things" />);

		});
	},
	updateMembers : function(obj) {
		/*
		The object returned has some top-level stuff and an array of members. Moving these 
		properties into each member. Less efficient, maybe, but we're never going to have 
		thousands of members of Congress at once and this will make the array easier to mess
		around with in React.
		*/
		let objParties = {
			"R":"Republican",
			"D":"Democrat",
			"I":"Independent"
		}

		// Prep for duplicates and filter down to members who are currently in office.
		let updatedMembers = [],
			objDoubles = {},
			everyone = obj.members.filter((item)=>{return item.in_office === true});

		// Separate duplicate entries into objects, each contains an array of dupes.
		everyone.forEach((member)=>{

			// Party info from the object above, other info from the imported "states" object.
			member.party_name = objParties[member.party] || "Independent";
			member.state_name = states[member.state];
			member.chamber = obj.chamber;

			let birthDate = new Date(member.date_of_birth);
			let today = new Date();
			let age = today.getFullYear() - birthDate.getFullYear();
			let m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || m === 0 && today.getDate() < birthDate.getDate() ) {
				age--; // Hasn't had a birthday this year.
			}
			member.age = age;

			// If it's a known missing image, use a local photo.
			member.missing_photo = (!missing[member.id]) ? false : true;
			member.member_photo_link = (!missing[member.id]) 
			? 'https://theunitedstates.io/images/congress/225x275/'+ member.id +'.jpg'
			: 'src/images/missing/225x275/'+ member.id +'.jpg'
			;

			if (everyone.filter((m)=>{return m.id===member.id}).length > 1) {
				// Make an array if there isn't one yet, then add member to it.
				objDoubles[member.id] = objDoubles[member.id] || [];
				objDoubles[member.id].push(member);
			} else {
				// No dupes, just add to the final members array.
				updatedMembers.push(member);
			}
		});

		/*
		These arrays returned may contain duplicates, so run the reducer function from below.
		*/
		Object.keys(objDoubles).forEach((id)=>{
			updatedMembers.push( objDoubles[id].reduce(reducer) );
		});


		/*
		ProPublica recently updated their data and wound up putting representatives into the 
		array twice. The person's id then shows up twice in the array and makes React angry.
		The two entries have different "last updated" dates, so when this happens we're going 
		to just grab the most recent one.

		And voila! We now have the data that ProPublica should have given us in the first place!		
		*/
		var reducer = (accumulator, currentValue) => {
			if (currentValue > accumulator) accumulator = currentValue;
			let accDate = accumulator ? new Date(accumulator.last_updated) : null,
				currDate = new Date(currentValue.last_updated);

			if (currDate.getTime() > accDate.getTime()) accumulator = currentValue;
			return accumulator; 
		}

		return updatedMembers;
	},
	setupUtils: function() {
		tmc_RAF();// Polyfills the window.requestAnimationFrame object.
		let ut 			= tmc_documentHidden();// returns several settings in an object
		ut.trans_end 	= tmc_transEnd();// returns the name of the transition end event
		ut.throttle 	= tmc_throttle;
		ut.debounce 	= tmc_debounce;
		ut.getParams 	= tmc_getParams;
		return ut;
	},
	getStored: function() {
		let stored = localStorage.getItem('politicianlist_'+this.congress);
		if (!stored) return null;

		let storedData = JSON.parse(stored),
			oneDay = 24 * 60 * 60,
			now = Date.now();

		/*
		If we have data for this congress within the past 24 hours, return that data to be 
		used instead of hitting the API again. If not, then return null.
		*/
		return ( now - storedData.timestamp < oneDay ) ? storedData : null;
	},
	getAllMembers : function() {
		return this.senate.members.concat(this.house.members);
	},
	getData : function(congress, chamber) {
		return $.ajax({
			url: `https://api.propublica.org/congress/v1/${congress}/${chamber}/members.json`,
			beforeSend: function(xhr) {
				 xhr.setRequestHeader("X-API-Key", "mQSfoVKW5dWSJXfcHtxSAXFneRkyGqnBzmrp4jLx")
			}
		})
	},
	utils: {}
}

$(document).ready(function(){
	POL.init();
});

