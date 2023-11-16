// https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react

let MemberList = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		let arrFunctions = [
			"getIconClass","getMemberName"
		];
		arrFunctions.forEach((name, i) => {
			this[name] = this[name].bind(this);
		});
	}

	componentDidMount() {

	}

	getIconClass(party) {
		let objClasses = {
			"R":"fas fa-republican",
			"D":"fas fa-democrat",
			"I":"fas fa-flag-usa"
		}
		return objClasses[party] || objClasses['I'];
	}

	getMemberName(member) {
		return member.short_title + ' ' + member.first_name + ' ' + member.last_name;
	}


	render() {
		let that = this;
		let member = this.props.members[0];

		let partyColor = 'success';
		switch(member.party) {
			case "R":
				partyColor = 'danger'
				break;
			case "D":
				partyColor = 'primary'
				break;
		}

		return (

		<div className="container">
			<div className="row">
				<div className="col">
					<div className="btn-group btn-group-lg w-100 mb-3" role="group" aria-label="Modal launch buttons">
						<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark w-50" data-view="filters" onClick={that.handleLaunchModal}>Filters</button>
						<button type="button" className="d-inline-block btn btn-light flex-fill border border-dark w-50" data-view="sorting" onClick={that.handleLaunchModal}>Sorting</button>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<input className="form-control form-control-lg" type="text" placeholder="Filter by name" onChange={this.handleInputChange}/>
					<small className="d-block mt-1 mb-3 px-3"><em>Filtering by name requires at least three characters.</em></small>
				</div>
			</div>
			<div className="row">
				<div className="col">



				<div data-member-id={member.id} className={'member card mb-3 border border-'+partyColor} key={member.id}>
					<div className={'card-header bg-'+partyColor+' text-white d-sm-flex justify-content-between'}>
						<div className="party"><i className={this.getIconClass(member.party) + ' mr-2'}></i>
						&nbsp;{member.party_name}</div>
						<div className="next">Next: <strong>{member.next_election}</strong></div>
					</div>
					<div className="card-body">
						<div className="d-sm-flex">
							<div className="member-photo-wrapper mb-2 mb-sm-0">
								<img className="member-photo img-fluid mx-auto ml-sm-0" onError={this.handleImageError} src={member.member_photo_link} loading="lazy" alt={'Photo of ' + this.getMemberName(member)} />
								<div className="missing-photo text-center">
									<i className="fas fa-user mb-3 text-secondary"></i>
									<small className="d-block">Photo not available</small>
								</div>
							</div>
							<div className="member-info-wrapper">
								<h5 className="card-title mb-1">{this.getMemberName(member)}</h5>
								<div className="mb-0">{member.state_name}</div>
								<div className="mb-0">{'Age: '+member.age}</div>
 							</div>
						</div>
					</div>
				</div>



				</div>
			</div>
		</div>


		);
	}
}

export default MemberList;