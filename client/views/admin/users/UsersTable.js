import { useDebouncedValue, useMediaQuery } from '@rocket.chat/fuselage-hooks';
import React, { useMemo, useCallback, useState } from 'react';

import FilterByText from '../../../components/FilterByText';
import GenericTable from '../../../components/GenericTable';
import { useRoute } from '../../../contexts/RouterContext';
import { useTranslation } from '../../../contexts/TranslationContext';
import { useEndpointData } from '../../../hooks/useEndpointData';
import UserRow from './UserRow';


function UsersTable(props) {
	const t = useTranslation();
	const [params, setParams] = useState({ text: '', current: 0, itemsPerPage: 25 });
	const [sort, setSort] = useState([
		['name', 'asc'],
		['usernames', 'asc'],
	]);

	const usersRoute = useRoute('admin-users');

	const onClick = useCallback(
		(username) => () =>
			usersRoute.push({
				context: 'info',
				id: username,
			}),
		[usersRoute],
	);

	const onHeaderClick = useCallback(
		(id) => {
			const preparedSort = [];

			const [[sortBy, sortDirection]] = sort;

			if (sortBy === id) {
				preparedSort.push([id, sortDirection === 'asc' ? 'desc' : 'asc']);
			} else {
				preparedSort.push([id, 'asc']);
			}

			//
			// Special cases

			// If the sortable field is `name`, we should also add `usernames`
			if (id === 'name') {
				preparedSort.push(['usernames', sortDirection]);
			}

			// If the sortable field is `name`, we should also add `usernames`
			if (id === 'status') {
				preparedSort.push(['active', sortDirection === 'asc' ? 'desc' : 'asc']);
			}

			setSort(preparedSort);
		},
		[sort],
	);

	const mediaQuery = useMediaQuery('(min-width: 1024px)');

	return (
		<GenericTable
			header={
				<>
					<GenericTable.HeaderCell
						key={'name'}
						direction={sort[0][1]}
						active={sort[0][0] === 'name'}
						onClick={onHeaderClick}
						sort='name'
						w='x200'
					>
						{t('Name')}
					</GenericTable.HeaderCell>
					{mediaQuery && (
						<GenericTable.HeaderCell
							key={'username'}
							direction={sort[0][1]}
							active={sort[0][0] === 'username'}
							onClick={onHeaderClick}
							sort='username'
							w='x140'
						>
							{t('Username')}
						</GenericTable.HeaderCell>
					)}
					<GenericTable.HeaderCell
						key={'email'}
						direction={sort[0][1]}
						active={sort[0][0] === 'emails.adress'}
						onClick={onHeaderClick}
						sort='emails.address'
						w='x120'
					>
						{t('Email')}
					</GenericTable.HeaderCell>
					{mediaQuery && (
						<GenericTable.HeaderCell
							key={'roles'}
							direction={sort[0][1]}
							active={sort[0][0] === 'roles'}
							onClick={onHeaderClick}
							sort='roles'
							w='x120'
						>
							{t('Roles')}
						</GenericTable.HeaderCell>
					)}
					<GenericTable.HeaderCell
						key={'status'}
						direction={sort[0][1]}
						active={sort[0][0] === 'status'}
						onClick={onHeaderClick}
						sort='status'
						w='x100'
					>
						{t('Status')}
					</GenericTable.HeaderCell>
				</>
			}
			results={props.users}
			total={props.total}
			setParams={setParams}
			params={params}
			renderFilter={({ onChange, ...props }) => (
				<FilterByText placeholder={t('Search_Users')} onChange={onChange} {...props} />
			)}
		>
			{(props) => <UserRow key={props._id} onClick={onClick} mediaQuery={mediaQuery} {...props} />}
		</GenericTable>
	);
}

export default UsersTable;
