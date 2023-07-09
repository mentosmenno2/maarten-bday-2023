<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;
use Mentosmenno2\MaartenBday2023\Chats\ChatStart;

class LevelStart extends AbstractLevel
{
	public function getId(): string
	{
		return 'start';
	}

	public function getChat(): ?AbstractChat
	{
		return new ChatStart();
	}
}
