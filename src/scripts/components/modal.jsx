// https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react
let modal = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sortrows: [
				[ 
					{key: 'first_name', value: "First Name"}, 
					{key: 'last_name', value: "Last Name"}
				],
				[ 
					{key: 'age', value: "Age"}, 
					{key: 'next_election', value: "Next Election"}
				]
			]
		};

		this._getFilterContent  = this._getFilterContent.bind(this);
		this._getSortingContent = this._getSortingContent.bind(this);
		this._handleSortClick 	= this._handleSortClick.bind(this);
		this._handleFilterClick = this._handleFilterClick.bind(this);
		this._handleResetClick 	= this._handleResetClick.bind(this);
		this._handleCloseClick 	= this._handleCloseClick.bind(this);
		this._handleCloseModal	= this._handleCloseModal.bind(this);
	}

	componentDidMount() {
		window.addEventListener('hide.bs.modal', this._handleCloseModal);
	}

	componentWillUnmount() {
		window.removeEventListener('hide.bs.modal', this._handleCloseModal);
	}

	_getFilterContent() {
		let that = this;
		let buttonMarkup = Object.keys(this.props.filters).map((filterCat)=>{
			let objFilter = this.props.filters[filterCat];
			if (filterCat.toLowerCase() === 'text') return;
			return(
				<div key={filterCat} className="d-flex flex-wrap flex-sm-nowrap flex-lg-wrap justify-content-center">
					{
						Object.keys(objFilter).map((filterBool)=>{
							let buttonType = this.props.filters[filterCat][filterBool] ? 'btn-secondary' : 'btn-light';
							return(
								<button key={filterBool} data-category={filterCat} data-filter={filterBool} type="button" onClick={this._handleFilterClick} className={'d-inline-block btn '+buttonType+' flex-fill border border-dark m-1'}>{filterBool}</button>
							);
						})
					}
				</div>
			);
		});

		return(
			<div className="modal-body">
				<p>Filter by political party, election year or chamber. Keep in mind that the House comes up every two years, so election years automatically filter down to the Senate.</p>
				<div className="d-flex flex-wrap flex-sm-nowrap flex-lg-wrap justify-content-center">
					<button type="button" onClick={this._handleResetClick} className="d-inline-block btn btn-light flex-fill border border-dark m-1">Reset Filters</button>
				</div>
				{
					buttonMarkup
				}
			</div>
		);
	}

	_getSortingContent() {
		let reverseButtonType = this.props.reverse ? 'btn-secondary' : 'btn-light';
		let sortingMarkup = this.state.sortrows.map((arrRow)=>{
			return(
				<div key={arrRow[0].key} className="d-flex flex-wrap flex-sm-nowrap flex-lg-wrap justify-content-center">
					{
						arrRow.map((objButton)=>{

							let buttonType = this.props.sortBy === objButton.key ? 'btn-secondary' : 'btn-light';
							return(
								<button key={objButton.value} data-sortkey={objButton.key} type="button" onClick={this._handleSortClick} className={'d-inline-block btn '+buttonType+' flex-fill border border-dark m-1'}>{objButton.value}</button>
							);
						})
					}
				</div>
			);

		});

		return(
			<div className="modal-body">
				<p>Sort the members list by a chosen property. Defaults to ascending order</p>
				<div className="d-flex flex-wrap flex-sm-nowrap flex-lg-wrap justify-content-center">
					<button type="button" data-reverse="true" onClick={this._handleSortClick} className={'d-inline-block btn '+reverseButtonType+' flex-fill border border-dark m-1'}>Reverse Sort</button>
				</div>
				{sortingMarkup}
			</div>
		);
	}

	_handleFilterClick(evt) {
		this.props.updateFilter(evt.target.dataset.category, evt.target.dataset.filter);
	}

	_handleResetClick(evt) {
		this.props.resetFilters();
	}

	_handleSortClick(evt) {
		if (evt.target.dataset.reverse) {
			this.props.reverseSort();
		} else {
			this.props.updateSort(evt.target.dataset.sortkey);
		}
	}

	_handleCloseClick(evt) {
		$('#myModal').modal('hide');
	}
	_handleCloseModal(evt) {
		//TODO: Run filters only when the modal closes. Add a "Set Filters" button.
		//console.log('The modal closed', evt);
	}

	render() {
		let that = this;
		let modalMarkup = this.props.modalView === 'filters' ? this._getFilterContent() : this._getSortingContent();
		let title = this.props.modalView === 'filters' ? "Filters" : "Sorting";
		return (
			<div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="myModalLabel">{title}</h5>
							<button type="button" className="btn-close" data-dismiss="modal" aria-label="Close" onClick={this._handleCloseClick}></button>
						</div>
						{modalMarkup}
					</div>
				</div>
			</div>
		);
	}
}

export default modal;