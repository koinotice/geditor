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

import React from 'react';
import classnames from 'classnames';
import { DropdownContainer } from '../common/dropdown';
import style from './style.less';
import { IconDropdown } from '../icons';
import { NetworksList } from './networksList';
import { IconCubeTransparent } from '../icons';
import { IEnvironment } from '../../models/state';

interface IProps {
    selectedEnvironment: IEnvironment;
    environments: [IEnvironment];
    onNetworkSelected: (name: string) => void;
}
// Note: We display networks, which really are environments, which map to networks.
// This is due to a simplification where we do not show environments, only networks, but technically it's environments which we work with.
export function NetworkSelector(props: IProps) {
    const { selectedEnvironment, environments, onNetworkSelected } = props;
    return (
        <DropdownContainer
            dropdownContent={
                <NetworksList
                    selectedEnvName={selectedEnvironment.name}
                    environments={environments}
                    onNetworkSelected={onNetworkSelected}
                />
            }
        >
            <div className={classnames([style.selector])}>
                <IconCubeTransparent />
                <div className={classnames([style.capitalize, style.nameContainer])} title={selectedEnvironment.endpoint}>
                    {selectedEnvironment.name}
                </div>
                <div className={style.dropdownIcon}>
                    <IconDropdown />
                </div>
            </div>
        </DropdownContainer>
    );
}
