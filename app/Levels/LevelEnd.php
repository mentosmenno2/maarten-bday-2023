<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;
use Mentosmenno2\MaartenBday2023\Chats\ChatStart;

class LevelEnd extends AbstractLevel
{
	public function getId(): string
	{
		return 'end';
	}

	public function getName(): string
	{
		return 'Thank you for playing!';
	}

	public function getChat(): ?AbstractChat
	{
		return null;
	}
}
