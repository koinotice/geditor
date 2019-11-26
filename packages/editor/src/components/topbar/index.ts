// Copyright 2018 Superblocks AB
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

import { connect } from 'react-redux';
import TopBar from './Topbar';
import { viewSelectors, projectSelectors, userSelectors, accountsConfigSelectors } from '../../selectors';
import { projectsActions, modalActions, viewActions, accountActions } from '../../actions';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';

const mapStateToProps = (state: any) => ({
    selectedProjectName: projectSelectors.getProjectName(state),
    selectedProjectId: projectSelectors.getProjectId(state),
    view: {
        project: projectSelectors.getProject(state),
        showOpenStudio: viewSelectors.getShowTopBarOpenInLab(state),
        showForkButton: viewSelectors.getShowTopBarForkButton(state),
        showShareButton: viewSelectors.getShowTopBarShareButton(state),
    },
    isProjectForking: userSelectors.isProjectForking(state),
    showAccountConfig: accountsConfigSelectors.getShowAccountConfig(state),
    showAboutModal: viewSelectors.getShowAboutModal(state)
});

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
    return {
        forkProject: (projectId: string, redirect: boolean) => {
            dispatch(projectsActions.forkProject(projectId, redirect));
        },
        showModal: (modalType: string, modalProps: any) => {
            dispatch(modalActions.showModal(modalType, modalProps));
        },
        closeAccountConfigModal: () => {
            dispatch(accountActions.closeAccountConfig());
        },
        toggleAboutModal: () => {
            dispatch(viewActions.toggleAboutModal());
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
