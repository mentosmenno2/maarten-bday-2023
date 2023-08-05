<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;
use Mentosmenno2\MaartenBday2023\Chats\ChatQuackVsQuack;

class LevelQuackVSQuack extends AbstractLevel
{
	public function getId(): string
	{
		return 'quack-vs-quack';
	}

	public function getName(): string
	{
		return 'Quack VS Quack';
	}

	public function getInstructions(): string
	{
		return 'Dodge evil duck bullets. Hit the evil duck with your bullets. Bullets shoot automatically.';
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
		return new ChatQuackVsQuack();
	}
}
