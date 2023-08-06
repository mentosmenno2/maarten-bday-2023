<?php

namespace Mentosmenno2\MaartenBday2023\Chats\Messages;

use Mentosmenno2\MaartenBday2023\Game;

class EnemyMessage extends AbstractMessage
{
	public function __construct(string $message)
	{
		parent::__construct('Evil duck: ' . $message);
		$this->talker = 'enemy';
	}
}
