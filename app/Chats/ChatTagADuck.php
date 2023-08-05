<?php

namespace Mentosmenno2\MaartenBday2023\Chats;

use Mentosmenno2\MaartenBday2023\Chats\Messages\EnemyMessage;
use Mentosmenno2\MaartenBday2023\Chats\Messages\PlayerMessage;

class ChatTagADuck extends AbstractChat
{
	public function getMessages(): array
	{
		return array(
			// After Minigame 3 - Tag A Duck
			new PlayerMessage('Yes! Three down, two more to go.'),
			new EnemyMessage('Grr... You just got lucky again. But the next game, Quick Queck Quack, will be different!'),
			new PlayerMessage('I\'ve been honing my skills. Quick Queck Quack won\'t be an easy win for you.'),

			// Before Minigame 4 - QuickQueckQuack
			new EnemyMessage('This is it. Prepare to lose!'),
			new PlayerMessage('We\'ll see about that.'),
		);
	}
}
