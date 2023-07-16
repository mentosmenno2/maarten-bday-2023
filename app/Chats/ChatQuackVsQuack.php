<?php

namespace Mentosmenno2\MaartenBday2023\Chats;

use Mentosmenno2\MaartenBday2023\Chats\Messages\EnemyMessage;
use Mentosmenno2\MaartenBday2023\Chats\Messages\PlayerMessage;

class ChatQuackVsQuack extends AbstractChat
{
	public function getMessages(): array
	{
		return array(
			new EnemyMessage('Hallo.'),
		);
	}
}
