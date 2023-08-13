<?php

namespace Mentosmenno2\MaartenBday2023\Characters;

use JsonSerializable;

abstract class AbstractCharacter implements JsonSerializable
{
	abstract public function getId(): string;

	abstract public function getName(): string;

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return array(
			'id' => $this->getId(),
			'name' => $this->getName(),
		);
	}
}
