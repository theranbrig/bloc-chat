import React, { Component } from 'react';
import { Typography, Button } from '@material-ui/core';

class User extends Component {
	signIn() {
		console.log('clickSignIn');
		const provider = new this.props.firebase.auth.GoogleAuthProvider();
		this.props.firebase
			.auth()
			.signInWithPopup(provider)
			.then(result => {
				const user = result.user;
				this.setState({ user });
			});
	}

	signOut() {
		console.log('clickSignOut');
		this.props.firebase.auth().signOut();
		this.setState({ user: null });
	}

	componentDidMount() {
		this.props.firebase.auth().onAuthStateChanged(user => {
			this.props.setUser(user);
		});
	}

	render() {
		return (
			<div className="userInfo">
				<div className="userName">
					<Typography component="h1" variant="headline">
						Welcome {this.props.currentUser}
					</Typography>
				</div>
				<div>
					{this.props.user === null ? (
						<Button
							variant="raised"
							color="primary"
							onClick={this.signIn.bind(this)}
							className="classListButton"
						>
							<i className="fas fa-user" />
							Sign In
						</Button>
					) : (
						<Button
							variant="raised"
							color="secondary"
							onClick={this.signOut.bind(this)}
							className="classListButton"
						>
							<i className="fas fa-sign-out-alt" />
							Sign Out
						</Button>
					)}
				</div>
			</div>
		);
	}
}

export default User;
