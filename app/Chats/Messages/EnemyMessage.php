<?php

namespace Mentosmenno2\MaartenBday2023\Chats\Messages;

class EnemyMessage extends AbstractMessage
{
	public function __construct(string $message)
	{
		parent::__construct($message);
		$this->talker = 'enemy';
	}
}
