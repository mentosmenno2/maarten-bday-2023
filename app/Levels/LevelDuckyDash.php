<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;

class LevelDuckyDash extends AbstractLevel
{
	public function getId(): string
	{
		return 'ducky-dash';
	}

	public function getChat(): ?AbstractChat
	{
		return null;
	}
}
