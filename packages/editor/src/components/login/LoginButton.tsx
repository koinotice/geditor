// Copyright 2019 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component } from 'react';
import classNames from 'classnames';
import style from './style.less';
import LoggedInButton from './LoggedInButton';
import {IUser} from '../../models';

interface IProps {
    isAuthenticated: boolean;
    logout: () => void;
    githubLogin: () => void;
    showModal: (modalType: string, modalProps: any) => void;
    hideModal: () => void;
    userProfile: IUser;
}

export default class LoginButton extends Component<IProps> {

    logout = () => {
        if (!confirm('Are you sure you want to logout?')) { return; }

        this.props.logout();
    }

    componentDidUpdate() {
        if (this.props.isAuthenticated) {
            this.props.hideModal();
        }
    }

    showLoginModal = () => {
        const { showModal, githubLogin, isAuthenticated } = this.props;
        showModal('GITHUB_MODAL', {githubLogin, isAuthenticated});
    }

    render() {
        const { isAuthenticated, userProfile } = this.props;

        return(
            <React.Fragment>
                { isAuthenticated ?
                    <LoggedInButton
                        logout={this.logout}
                        userProfile={userProfile}
                    />
                    :
                    <div className={style.action}>
                        <button
                            className={classNames([style.container, 'btn2'])}
                            onClick={this.showLoginModal}
                        >
                            <span>Login</span>
                        </button>
                    </div>
                }
            </React.Fragment>
        );
    }
}
