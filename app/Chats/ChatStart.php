<?php

namespace Mentosmenno2\MaartenBday2023\Chats;

use Mentosmenno2\MaartenBday2023\Chats\Messages\EnemyMessage;
use Mentosmenno2\MaartenBday2023\Chats\Messages\PlayerMessage;

class ChatStart extends AbstractChat
{
	public function getMessages(): array
	{
		return array(
			new EnemyMessage('Maarten, what do I see?'),
			new EnemyMessage('Is today your birthday?'),
			new PlayerMessage('...'),
			new PlayerMessage('Yes?'),
			new EnemyMessage('And you\'ve recieved a gift from Menno?'),
			new PlayerMessage('...'),
			new PlayerMessage('Yes I did?'),
			new EnemyMessage('All these years you\'ve reveived specially made gifts from Menno.'),
			new EnemyMessage('But never have I...'),
			new EnemyMessage('But that might change today!'),
			new EnemyMessage('Your present is now mine!'),
			new PlayerMessage('Noooooooooo!'),
			new EnemyMessage('I you want it, you have to deserve it first.'),
			new EnemyMessage('I challenge YOU, to beat ME in a list of challenges.'),
			new EnemyMessage('If you do you\'ll get your gift back.'),
			new EnemyMessage('But if you don\'t, I will keep it forever!'),
			new EnemyMessage('MOEHAHAHAHAHAAAH'),
			new PlayerMessage('Challenge accepted!'),
			new PlayerMessage('I will beat you in all challenges you give me.'),
			new PlayerMessage('Bring it on!'),
		);
	}
}
