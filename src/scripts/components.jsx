let components = (POL)=>{

let RC = {};

RC.init = ()=>{
	POL.stuff();
}


RC.memberList = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			members:  	this.props.members,
			filters: 	{},
			sortBy: 	'last_name',
			modalView: 	'filters'			
		};
		this._assembleFilters 	= this._assembleFilters.bind(this);
		this._passedFilters 	= this._passedFilters.bind(this);
		this._getIconClass 		= this._getIconClass.bind(this);
		this.sortMembersArray 	= this.sortMembersArray.bind(this);
		this._getMemberItems 	= this._getMemberItems.bind(this);
		this._handleLaunchModal = this._handleLaunchModal.bind(this);

		console.log('RC.memberList', this);
	}

	componentDidMount() {
		this.setState({
			filters:this._assembleFilters()
		});
	}

	_assembleFilters() {
		let objTags = {
			next_election:{},
			party_name:{},
			chamber: {'Senate':false,'House':false}
		};
		this.state.members.forEach((member)=>{
			//if (member.next_election && !objTags.next_election.includes(member.next_election)) objTags.next_election.push(member.next_election);
			//if (member.party_name && !objTags.party_name.includes(member.party_name)) objTags.party_name.push(member.party_name);
			if (member.next_election && !objTags.hasOwnProperty(member.next_election)) objTags.next_election[member.next_election] = false;
			if (member.party_name && !objTags.hasOwnProperty(member.party_name)) objTags.party_name[member.party_name] = false;
		});
		return objTags;
	}

	_passedFilters(member) {
		// Run logic to see if a member should be shown.
		return true;
	}

	_getIconClass(party) {
		let objClasses = {
			"R":"fas fa-republican",
			"D":"fas fa-democrat",
			"I":"fas fa-flag-usa"
		}
		return objClasses[party] || objClasses['I'];
	}

	sortMembersArray(property = 'last_name') {
		this.state.members.sort(function(a,b){
			let itemA = a[property].toUpperCase();
			let itemB = b[property].toUpperCase();
			if (itemA < itemB) return -1;
			if (itemA > itemB) return 1;
			return 0;
		});
	}

	_getMemberItems(chamber = 'both') {
		this.sortMembersArray();
		let members = this.state.members;

		if(!this._passedFilters()) return false;

		return members.map((member) =>{
			let partyColor = 'success';
			switch(member.party) {
				case "R":
					partyColor = 'danger'
					break;
				case "D":
					partyColor = 'primary'
					break;
			}

			return(
				<div className={'card mb-3 border border-'+partyColor} key={member.id}>
					<div className={'card-header bg-'+partyColor+' text-white d-flex justify-content-between'}>
						<div><i className={this._getIconClass(member.party) + ' mr-2'}></i>
						{member.party_name}</div>
						<div><strong>{member.next_election}</strong></div>
					</div>
					<div className="card-body">
						<h5 className="card-title">{member.short_title + ' ' + member.first_name + ' ' + member.last_name}</h5>
						<p className="mb-0">{member.state_name}</p>						
					</div>
				</div>
			);
		});
	}

	_handleLaunchModal(evt) {
		this.setState({modalView:evt.target.dataset.view});
		$('#myModal').modal('show');
		console.log('_handleLaunchModal()', evt.target.dataset.view);
	}

	render() {
		let that = this;
		return (
		<div className="container pt-3">
			<div className="row">
				<div className="col">
					<div className="btn-group btn-group-lg w-100 mb-3" role="group" aria-label="Basic example">
						<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark w-50" data-view="filters" onClick={that._handleLaunchModal}>Filters</button>
						<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark w-50" data-view="sorting" onClick={that._handleLaunchModal}>Sorting</button>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					{this._getMemberItems('both')}
				</div>
			</div>

			<RC.modal modalView={that.state.modalView} filters={this.state.filters} sortMembersArray={this.sortMembersArray} />
		</div>
		);
	}
}

RC.modal = class extends React.Component {
	/*
	The filters object will be managed here and used to update the filters object in the parent.
	*/
	constructor(props) {
		super(props);
		this.state = {
			filters: 	this.props.filters
		};
		this._getFilterContent 	= this._getFilterContent.bind(this);
		this._applyFilterRules 	= this._applyFilterRules.bind(this);
		console.log('RC.modal', this);
	}

	_applyFilterRules(filterClicked) {
		/*
		The House is up for re-election every two years, so filtering by any available year will 
		show all representatives. For this reason, having a year selected will automatically select 
		the Senate. De-selecting the Senate will de-select all years.
		*/
	}

	_getFilterContent() {

		return(
			<div className="modal-body">
				<p>Filter by political party, election year or chamber. Keep in mind that the House comes up every two years, so election years automatically filter down to the Senate.</p>
				<div className="d-flex flex-wrap flex-sm-nowrap justify-content-center">
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">Senate</button>
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">House</button>
				</div>
				<div className="d-flex flex-wrap flex-sm-nowrap justify-content-center">
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">Republican</button>
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">Democrat</button>
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">Independent</button>
				</div>
				<div className="d-flex flex-wrap flex-sm-nowrap justify-content-center">
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">2020</button>
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">2022</button>
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">2024</button>
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">2024</button>
				</div>
			</div>
		);
	}

	_getSortingContent() {

		return(
			<div className="modal-body">
				<p>Sort the members list by a chosen property.</p>
				<div className="d-flex flex-wrap flex-sm-nowrap justify-content-center">
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">First Name</button>
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">Last Name</button>
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">Chamber</button>
				</div>
				<div className="d-flex flex-wrap flex-sm-nowrap justify-content-center">
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">Age</button>
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">Seniority</button>
					<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark m-1">Next Election</button>
				</div>
			</div>
		);
	}

	render() {
		let that = this;
		let markup = this.props.modalView === 'filters' ? this._getFilterContent() : this._getSortingContent();
		let title = this.props.modalView === 'filters' ? "Filters" : "Sorting";
		return (
		<div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="myModalLabel">{title}</h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					{markup}
				</div>
			</div>
		</div>
		);
	}
}










return RC;
}






export default components;