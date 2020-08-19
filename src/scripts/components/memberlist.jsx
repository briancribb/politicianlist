// https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react

let memberList = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			members:  	this.props.members,
			RC:  	this.props.parent,
			filters: 	{},
			reverse: 	false,
			sortBy: 	'last_name',
			modalView: 	'filters'	
		};

		this._assembleFilters 		= this._assembleFilters.bind(this);
		this._updateSort	 		= this._updateSort.bind(this);
		this._reverseSort 			= this._reverseSort.bind(this);
		this._updateFilter 			= this._updateFilter.bind(this);
		this._resetFilters 			= this._resetFilters.bind(this);
		this._passedFilters 		= this._passedFilters.bind(this);
		this._getIconClass 			= this._getIconClass.bind(this);
		this._getFilteredSorted 	= this._getFilteredSorted.bind(this);
		this._getMemberItems 		= this._getMemberItems.bind(this);
		this._getMemberName 		= this._getMemberName.bind(this);
		this._handleLaunchModal 	= this._handleLaunchModal.bind(this);
		this._handleImageError 		= this._handleImageError.bind(this);
		this._handleInputChange 	= this._handleInputChange.bind(this);
	}

	componentDidMount() {
		this.setState({
			filters:this._assembleFilters()
		});
		window.getState = ()=>{
			return this.state;
		};
	}

	_assembleFilters() {
		let objTags = {
			next_election:{},
			party_name:{},
			chamber: {'Senate':false,'House':false},
			text: {name:''}
		};
		this.state.members.forEach((member)=>{
			// Add filter tags for each election year and party found in the data.
			if (member.next_election && !objTags.hasOwnProperty(member.next_election)) objTags.next_election[member.next_election] = false;
			if (member.party_name && !objTags.hasOwnProperty(member.party_name)) objTags.party_name[member.party_name] = false;
		});
		return objTags;
	}

	_updateSort(sortBy = null) {
		if (!sortBy || sortBy === this.state.sortBy) return;
		this.setState({sortBy});// ES6 shorthand for {sortBy:sortBy}
	}

	_reverseSort() {
		let reverse = this.state.reverse ? false : true; // Opposite of the current state.
		this.setState({reverse});// ES6 shorthand for {reverse:reverse}
	}

	_updateFilter(category = null, filter = null, value = null) {
		if (!category || !filter) return;
		this.setState((prevState)=>{
			let filters = { ...prevState.filters };					// Copy the filters object from the state. ES6 shorthand for Object.assign()

			// Update the target property 
			if (typeof filters[category][filter] === 'boolean') {
				// If it's boolean, then just flip it.
				filters[category][filter] = !filters[category][filter]; 
			} else {
				// Otherwise, set the value.
				filters[category][filter] = value;
			}    
			return { filters };                   					// Return new filters object. ES6 shorthand for {filters:filters}
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

	_getIconClass(party) {
		let objClasses = {
			"R":"fas fa-republican",
			"D":"fas fa-democrat",
			"I":"fas fa-flag-usa"
		}
		return objClasses[party] || objClasses['I'];
	}

	_passedFilters(member) {
		/*
		Run logic to see if a member should be shown.
		Calling these properties categories and filters just to organize them in my brain.
		- Categories are the property keys in the member object. Ex. "next_election".
		- Filters are the possible values that the category can have. Ex. "2020", "2022".
		- If a filter is true then that value must be present. For example, if "2022" is 
			true then a member's "next_election" property must be "2022" in order to pass.
		-	Multiple filters are okay. If a member has "2020" and both "2020" and "2022" are 
			selected, then it will pass because it has one of the selected values. This means 
			that having both "House" and "Senate" selected would be the same as having neither 
			of them selected.

		1.	Loop through the categories. Each one is a property in a member.
		2.	Loop through the filters in the category. If there are true values, then the 
				member must match one of them in order to pass.
		3.  If there is text in the name filter input, then that text must appear in the 
			member's first or last name in order to pass.
		4.	If there are no true values, then no check is required. Continue with the loop.
		*/

		let objFilters = this.state.filters;
		let matchesFilters = true;
		Object.keys(objFilters).forEach((category)=>{

			let trueFilters = Object.keys(objFilters[category]).filter((filter)=>{
				// If the filter has a value.
				return objFilters[category][filter];
			});

			// If they're all false, then skip this category.
			if (!trueFilters.length) return;

			/*
			Now we have an array of true values, like ["2020","2024"]
			The member must have a value that matches something in the array.
			This is just for booleans, not messing with the text category just yet.
			*/
			if (category !== 'text' && !trueFilters.includes(member[category])) {
				matchesFilters = false;
			}

			/*
			If we're filtering by the next election, then the House will always pass because 
			they come up every two years. The only reason to filter by year is to find out 
			when a Senator is up for re-election. If a year is chosen, fail this check for 
			Representatives.
			*/
			if (category === 'next_election' && member.chamber === "House") {
				matchesFilters = false;
			}

			/*
			At this point the booleans have worked out one way or the other, but there's one 
			more check to do. If the match is still good at this point, we need to check the 
			text category. If there's text in the name search input, then the member must have 
			that text in their first or last name.
			*/
			if (matchesFilters === true && category === 'text') {
				// The handler function will pass in null if the string is less than 3 characters.
				if (objFilters.text.name) {
					// First and last name, lowercase and with no spaces.
					let strName = (member.first_name + member.last_name).toLowerCase().replace(/\s/g, '');

					// The string in the input must be in the name string in order to match.
					if ( !strName.toLowerCase().replace(/\s/g, '').includes(objFilters.text.name) ) {
						matchesFilters = false;
					}
				}
			}
		});
		return matchesFilters;
	}

	/*
	Returns a new array that passes filter tests and is then sorted.
	*/
	_getFilteredSorted() {
		let members = this.state.members.filter((member)=>{
			return this._passedFilters(member);
		});

		members.sort((a,b)=>{
			let itemA = a[this.state.sortBy].toString().toUpperCase();
			let itemB = b[this.state.sortBy].toString().toUpperCase();

			// If sorting is reversed
			if (itemA < itemB && this.state.reverse) return 1;
			if (itemA > itemB && this.state.reverse) return -1;

			// Regular sorting.
			if (itemA < itemB) return -1;
			if (itemA > itemB) return 1;

			return 0;
		});
		return members;
	}

	_getMemberName(member) {
		return member.short_title + ' ' + member.first_name + ' ' + member.last_name;
	}

	_getMemberItems(chamber = 'both') {

		let members = this._getFilteredSorted(); // This will return a new filtered and sorted array of members.

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
				<div data-member-id={member.id} className={'card mb-3 border border-'+partyColor} key={member.id}>
					<div className={'card-header bg-'+partyColor+' text-white d-flex justify-content-between'}>
						<div><i className={this._getIconClass(member.party) + ' mr-2'}></i>
						{member.party_name}</div>
						<div>Next: <strong>{member.next_election}</strong></div>
					</div>
					<div className="card-body">
						<div className="d-flex">
							<div className="member-photo-wrapper mr-2 mr-md-3">
								<img className="member-photo img-fluid" onError={this._handleImageError} src={'https://theunitedstates.io/images/congress/225x275/'+ member.id +'.jpg'} loading="lazy" alt={'Photo of ' + this._getMemberName(member)} />
								<div className="missing-photo text-center">
									<i className="fas fa-user mb-3 text-secondary"></i>
									<small className="d-block">Photo not available</small>
								</div>
							</div>
							<div className="member-info-wrapper">
								<h5 className="card-title mb-1">{this._getMemberName(member)}</h5>
								<div className="mb-0">{member.state_name}</div>
								<div className="mb-0">{'Age: '+member.age}</div>
 							</div>
						</div>
					</div>
				</div>
			);
		});
	}

	_handleImageError(evt) {
		evt.target.parentElement.classList.add('image-error');
	}

	_handleLaunchModal(evt) {
		this.setState({modalView:evt.target.dataset.view});
		$('#myModal').modal('show');
	}

	_handleInputChange(evt) {
		let value = evt.target.value;
		if(value.length < 3) value = null;
		this._updateFilter('text', 'name', value);
	}

	render() {
		let that = this;
		let RC = this.state.RC;

		return (
		<div className="container">
			<div className="row">
				<div className="col">
					<div className="btn-group btn-group-lg w-100 mb-3" role="group" aria-label="Modal launch buttons">
						<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark w-50" data-view="filters" onClick={that._handleLaunchModal}>Filters</button>
						<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark w-50" data-view="sorting" onClick={that._handleLaunchModal}>Sorting</button>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<input className="form-control form-control-lg" type="text" placeholder="Filter by name" onChange={this._handleInputChange}/>
					<small className="d-block mt-1 mb-3 px-3"><em>Filtering by name requires at least three characters.</em></small>
				</div>
			</div>
			<div className="row">
				<div className="col">
					{this._getMemberItems('both')}
				</div>
			</div>
			<RC.modal updateSort={this._updateSort} reverseSort={this._reverseSort} updateFilter={this._updateFilter} resetFilters={this._resetFilters} modalView={that.state.modalView} reverse={that.state.reverse} sortBy={that.state.sortBy} filters={that.state.filters} />
		</div>
		);
	}
}

export default memberList;