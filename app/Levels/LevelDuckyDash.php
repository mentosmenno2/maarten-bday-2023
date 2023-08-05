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
		return 'Reach the finish first. Avoid the obstacles, those will slow you down.';
	}

	public function getControlsMouseMove(): string
	{
		return 'Move duck left or right towards mouse cursor position.';
	}

	public function getControlsKeysArrows(): string
	{
		return 'Move duck left or right.';
	}

	public function getChat(): ?AbstractChat
	{
		return new ChatDuckyDash();
	}
}
