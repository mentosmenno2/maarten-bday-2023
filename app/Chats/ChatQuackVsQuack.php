<?php

namespace Mentosmenno2\MaartenBday2023\Chats;

use Mentosmenno2\MaartenBday2023\Chats\Messages\EnemyMessage;
use Mentosmenno2\MaartenBday2023\Chats\Messages\PlayerMessage;

class ChatQuackVsQuack extends AbstractChat
{
	public function getMessages(): array
	{
		return array(
			new PlayerMessage('Yes! I did it! I beat you in all five minigames!'),
			new EnemyMessage('Grr... I can\'t believe it. You\'ve won fair and square.'),
			new PlayerMessage('That means I get my present back, right?'),
			new EnemyMessage('Fine, fine. Here\'s your present. But this isn\'t over! I\'ll be back next year with a new challenge.'),
			new PlayerMessage('I\'ll be ready for whatever you throw at me. Until then, enjoy the competition.'),
			new EnemyMessage('Thanks, I wish you a good birthday today!'),
		);
	}
}
