<?php

namespace Mentosmenno2\MaartenBday2023\Chats;

use Mentosmenno2\MaartenBday2023\Chats\Messages\EnemyMessage;
use Mentosmenno2\MaartenBday2023\Chats\Messages\PlayerMessage;

class ChatDuckyDash extends AbstractChat
{
	public function getMessages(): array
	{
		return array(
			// After Minigame 1 - Ducky Dash
			new PlayerMessage('Ha! One down, four to go.'),
			new EnemyMessage('Grr... Lucky shot. But you won\'t be so fortunate in the next game, Duck Pong!'),
			new PlayerMessage('Haha, we\'ll see. The next game, Duck Pong, is where I\'ll show you that I\'m not to be underestimated.'),

			// Before Minigame 2 - Duck Pong
			new EnemyMessage('Prepare for a fierce match!'),
			new PlayerMessage('I\'m ready. Bring it on!'),
		);
	}
}
