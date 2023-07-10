<?php

namespace Mentosmenno2\MaartenBday2023\Chats;

use Mentosmenno2\MaartenBday2023\Chats\Messages\EnemyMessage;
use Mentosmenno2\MaartenBday2023\Chats\Messages\PlayerMessage;

class ChatWhackADuck extends AbstractChat
{
	public function getMessages(): array
	{
		return array(
			new EnemyMessage('Auch, I\'ve got a bit of a headache.'),
			new EnemyMessage('Did you have to hit me so hard?'),
			new PlayerMessage('You asked, you recieved.'),
			new EnemyMessage('Can we wait a few minutes? I\'m a little bit dizzy.'),
			new PlayerMessage('I want my present, and I want it now!'),
		);
	}
}
