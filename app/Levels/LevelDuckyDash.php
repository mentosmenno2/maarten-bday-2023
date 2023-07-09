<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;
use Mentosmenno2\MaartenBday2023\Chats\ChatDuckyDash;

class LevelDuckyDash extends AbstractLevel
{
	public function getId(): string
	{
		return 'ducky-dash';
	}

	public function getName(): string
	{
		return 'Ducky Dash';
	}

	public function getInstructions(): string
	{
		return 'Avoid the obstacles. Move your mouse to position your duck. Make sure to finish before the evil duck!';
	}

	public function getChat(): ?AbstractChat
	{
		return new ChatDuckyDash();
	}
}
