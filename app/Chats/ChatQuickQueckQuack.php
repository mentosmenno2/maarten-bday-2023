<?php

namespace Mentosmenno2\MaartenBday2023\Chats;

use Mentosmenno2\MaartenBday2023\Chats\Messages\EnemyMessage;
use Mentosmenno2\MaartenBday2023\Chats\Messages\PlayerMessage;

class ChatQuickQueckQuack extends AbstractChat
{
	public function getMessages(): array
	{
		return array(
			// After Minigame 4 - QuickQueckQuack
			new PlayerMessage('Yes! Four down, one more to go.'),
			new EnemyMessage('Grr... You won\'t win the last game. Quack VS Quack is where I\'ll shine!'),
			new PlayerMessage('I\'m ready for the final challenge. Bring it on!'),

			// Before Minigame 5 - Quack VS Quack
			new EnemyMessage('Prepare yourself. The final challenge is Quack VS Quack! I won\'t hold back.'),
			new PlayerMessage('I\'m not backing down! Let\'s finish this.'),
		);
	}
}
