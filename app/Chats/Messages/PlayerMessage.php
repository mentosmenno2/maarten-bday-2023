<?php

namespace Mentosmenno2\MaartenBday2023\Chats\Messages;

class PlayerMessage extends AbstractMessage
{
	public function __construct(string $message)
	{
		parent::__construct('Maarten: ' . $message);
		$this->talker = 'player';
	}
}
