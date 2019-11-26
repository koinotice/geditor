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
import { MenuItem, Divider } from '../../common/menu';
import style from './style.less';
import classNames from 'classnames';

interface IProps {
    projectId: string;
    redirect: boolean;
    downloadProject?: () => void;
    configureProject?: () => void;
    renameProject?: () => void;
    deleteProject?: (projectId: string, redirect: boolean) => void;
    shareProject?: () => void;
    editProject?: () => void;
    openProject?: () => void;
    openProjectNewTab?: () => void;
    forkProject?: (projectId: string, redirect: boolean) => void;
    customClass?: string;
}

export default class ProjectMenuDropdownDialog extends Component<IProps> {
    render() {
        const { projectId, downloadProject, configureProject, renameProject, deleteProject, shareProject, editProject, openProject, openProjectNewTab, forkProject, redirect } = this.props;

        return (
            <div className = {classNames([style.menuDialog, this.props.customClass])} >
                { openProject &&
                    <MenuItem
                        onClick={() => openProject()}
                        title='Open Project'
                    />
                }
                { openProjectNewTab &&
                    <React.Fragment>
                        <MenuItem
                            onClick={() => openProjectNewTab()}
                            title='Open Project in new tab'
                        />
                        <Divider />
                    </React.Fragment>
                }
                { downloadProject &&
                    <MenuItem
                        onClick={() => downloadProject()}
                        title='Download'
                    />
                }
                { configureProject &&
                    <MenuItem
                        onClick={() => configureProject()}
                        title='Configure'
                    />
                }
                { renameProject &&
                    <MenuItem
                        onClick={() => renameProject()}
                        title='Rename'
                    />
                }
                { editProject &&
                    <MenuItem
                        onClick={() => editProject()}
                        title='Edit'
                    />
                }
                { forkProject &&
                    <MenuItem
                        onClick={() => forkProject(projectId, false)}
                        title='Duplicate'
                    />
                }
                { shareProject &&
                    <MenuItem
                        onClick={() => shareProject()}
                        title='Share'
                    />
                }
                { deleteProject &&
                    <MenuItem
                        onClick={() => deleteProject(projectId, redirect)}
                        title='Delete'
                    />
                }
            </div>
        );
    }
}
