<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;

class LevelBuildDuck extends AbstractLevel
{
	public function getId(): string
	{
		return 'build-duck';
	}

	public function getChat(): ?AbstractChat
	{
		return null;
	}
}
