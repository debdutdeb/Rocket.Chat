import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { settings } from '../../settings/client';
import { hasPermission } from '../../authorization/client';
import { MessageAction, modal } from '../../ui-utils/client';
import { messageArgs } from '../../ui-utils/client/lib/messageArgs';
import { t } from '../../utils/client';

Meteor.startup(function() {
	Tracker.autorun(() => {
		if (!settings.get('Discussion_enabled')) {
			return MessageAction.removeButton('start-discussion');
		}

		MessageAction.addButton({
			id: 'start-discussion',
			icon: 'discussion',
			label: 'Discussion_start',
			context: ['message', 'message-mobile'],
			async action(_, props) {
				const { message = messageArgs(this).msg } = props;

				modal.open({
					title: t('Discussion_title'),
					modifier: 'modal',
					content: 'CreateDiscussion',
					data: { rid: message.rid,
						message,
						onCreate(): void {
							modal.close();
						} },
					confirmOnEnter: false,
					showConfirmButton: false,
					showCancelButton: false,
				});
			},
			condition({ message: { u: { _id: uid }, drid, dcount }, subscription, user }) { // TODO SUBSCRIPTION
				if (drid || !isNaN(dcount as any)) {
					return false;
				}
				if (!subscription) {
					return false;
				}

				return uid !== user._id ? hasPermission('start-discussion-other-user') : hasPermission('start-discussion');
			},
			order: 1,
			group: 'menu',
		});
	});
});