// https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react

let memberList = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			members:  	this.props.members,
			RC:  	this.props.parent,
			filters: 	{},
			sortBy: 	'last_name',
			modalView: 	'filters'		
		};

		this._assembleFilters 	= this._assembleFilters.bind(this);
		this._updateFilter 			= this._updateFilter.bind(this);
		this._resetFilters 			= this._resetFilters.bind(this);
		this._passedFilters 		= this._passedFilters.bind(this);
		this._getIconClass 			= this._getIconClass.bind(this);
		this._sortMembersArray 	= this._sortMembersArray.bind(this);
		this._getMemberItems 		= this._getMemberItems.bind(this);
		this._handleLaunchModal = this._handleLaunchModal.bind(this);


		console.log('memberList', this);
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

	_updateFilter(category = null, filter = null) {
		console.log('_updateFilter()', arguments);

		if (!category || !filter) return;
		this.setState((prevState)=>{
			let filters = { ...prevState.filters }; // Copy the filters object from the state. ES6 shorthand for Object.assign()
			filters[category][filter] = !filters[category][filter]; 			// Update the target property                
			return { filters };                   	// Return new filters object. ES6 shorthand for {filters:filters}
		});
	}


	_resetFilters() {
		// Sets all filters to false.
		this.setState((prevState)=>{
			let filters = { ...prevState.filters };
			Object.keys(filters).forEach((category)=>{
				Object.keys(filters[category]).forEach((filter)=>{
					filters[category][filter] = false;
				});
			});
			return { filters };
		});
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

	_sortMembersArray(property = 'last_name') {
		this.state.members.sort(function(a,b){
			let itemA = a[property].toUpperCase();
			let itemB = b[property].toUpperCase();
			if (itemA < itemB) return -1;
			if (itemA > itemB) return 1;
			return 0;
		});
	}

	_getMemberItems(chamber = 'both') {
		this._sortMembersArray();
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
		//console.log('_handleLaunchModal()', evt.target.dataset.view);
	}

	render() {
		let that = this;
		let RC = this.state.RC;

		return (
		<div className="container pt-3">
			<div className="row">
				<div className="col">
				</div>
			</div>
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
			<RC.modal updateFilter={this._updateFilter} resetFilters={this._resetFilters} modalView={that.state.modalView} sortBy={that.state.sortBy} filters={that.state.filters} />
		</div>
		);
	}
}

export default memberList;