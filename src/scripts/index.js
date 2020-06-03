//import utils from '../../../_vendor/tmc/utils';
import {tmc_transEnd, tmc_documentHidden, tmc_RAF, tmc_throttle, tmc_debounce} from '../../../../_vendor/tmc/tmc-utils';
import states from './states_hash';
import components from './components';
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

let RC = components();
let POL = {
	congress: 116,
	stuff:function(){
		console.log('Called from the components module!', this);
	},
	init: function() {

		this.utils = setupUtils();


		let housePromise = new Promise((resolve, reject) => {
			this.getData(this.congress,'house').then((data)=>{
				resolve(updateMembers(data.results[0]));
			});
		});
		let senatePromise = new Promise((resolve, reject) => {
			this.getData(this.congress,'senate').then((data)=>{
				resolve(updateMembers(data.results[0]));
			});
		});

		/*
		ProPublica recently updated their data and wound up putting representatives into the 
		array twice. The person's id then shows up twice in the array and makes React angry.
		The two entries have different "last updated" dates, so when this happens we're going 
		to just grab the last one.
		*/
		let reducer = (accumulator, currentValue) => {
			if (currentValue > accumulator) accumulator = currentValue;
			let accDate = accumulator ? new Date(accumulator.last_updated) : null,
				currDate = new Date(currentValue.last_updated);

			if (currDate.getTime() > accDate.getTime()) accumulator = currentValue;
			return accumulator; 
		}

		/*
		The object returned has some top-level stuff and an array of members. Moving these 
		properties into each member. Less efficient, maybe, but we're never going to have 
		thousands of members of Congress at once and this will make the array easier to mess
		around with in React.
		*/
		function updateMembers (obj) {
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
			Each object in this array contains duplicates. The dupes have different last_updated
			values, so we use the reducer function above to grab the most recent one and add it 
			to the updatedMembers array.

			And voila! We now have the data that ProPublica should have given us in the first place!
			*/
			Object.keys(objDoubles).forEach((id)=>{
				updatedMembers.push( objDoubles[id].reduce(reducer) );
			});

			return updatedMembers;
		}

		function setupUtils() {
			tmc_RAF();// Polyfills the window.requestAnimationFrame object.
			let ut = tmc_documentHidden();// returns several settings in an object
			ut.trans_end = tmc_transEnd();// returns the name of the transition end event
			ut.throttle = tmc_throttle;
			ut.debounce = tmc_debounce;
			return ut;
		}

		Promise.all([housePromise, senatePromise]).then((allResults)=>{
			console.log('allResults', allResults);
			//console.log('members', allResults[0].concat(allResults[1]));

			ReactDOM.render(
				<RC.memberList members={allResults[0].concat(allResults[1])} />, document.getElementById('app')
			);

		});





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

