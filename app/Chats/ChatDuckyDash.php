<?php

namespace Mentosmenno2\MaartenBday2023\Chats;

use Mentosmenno2\MaartenBday2023\Chats\Messages\EnemyMessage;
use Mentosmenno2\MaartenBday2023\Chats\Messages\PlayerMessage;

class ChatDuckyDash extends AbstractChat
{
	public function getMessages(): array
	{
		return array(
			new PlayerMessage('Take that evil duck!'),
			new PlayerMessage('This was easy, now give back my present.'),
			new EnemyMessage('You fool.'),
			new EnemyMessage('You think beating me in only one challenge is enough to get your present back?'),
			new EnemyMessage('WHAHAHAHAHAAAH'),
			new PlayerMessage('Well, yes.'),
			new PlayerMessage('I\'ve already beaten you once.'),
			new PlayerMessage('Do you think I can\'t beat you in the other challenges as well?'),
			new EnemyMessage('Of course not!'),
			new EnemyMessage('Come on then, show me what you\'ve got!'),
			new PlayerMessage('Be prepared to lose again you criminal!'),
		);
	}
}
