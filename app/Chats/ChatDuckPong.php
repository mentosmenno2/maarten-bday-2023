<?php

namespace Mentosmenno2\MaartenBday2023\Chats;

use Mentosmenno2\MaartenBday2023\Chats\Messages\EnemyMessage;
use Mentosmenno2\MaartenBday2023\Chats\Messages\PlayerMessage;

class ChatDuckPong extends AbstractChat
{
	public function getMessages(): array
	{
		return array(
			// After Minigame 2 - Duck Pong
			new PlayerMessage('Yes! Two down, three to go. Victory is within reach.'),
			new EnemyMessage('Grr... You got lucky. But the next game, Tag A Duck, will be mine!'),
			new PlayerMessage('Oh, I have my strategy ready for that one. I won\'t let you slip away this time.'),

			// Before Minigame 3 - Tag A Duck
			new EnemyMessage('Catch me if you can!'),
			new PlayerMessage('I won\'t let you escape this time.'),
		);
	}
}
