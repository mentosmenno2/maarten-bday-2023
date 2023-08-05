<?php

namespace Mentosmenno2\MaartenBday2023\Levels;

use JsonSerializable;
use Mentosmenno2\MaartenBday2023\Chats\AbstractChat;

abstract class AbstractLevel implements JsonSerializable
{
	abstract public function getId(): string;

	abstract public function getName(): string;

	abstract public function getChat(): ?AbstractChat;

	public function getInstructions(): string
	{
		return '';
	}

	public function getControlsMouseMove(): string
	{
		return '';
	}

	public function getControlsMouseClick(): string
	{
		return '';
	}

	public function getControlsKeysArrows(): string
	{
		return '';
	}

	public function getControlsKeysSpace(): string
	{
		return '';
	}

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return array(
			'id' => $this->getId(),
			'chat' => $this->getChat(),
		);
	}
}
