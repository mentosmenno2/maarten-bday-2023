<?php

namespace Mentosmenno2\MaartenBday2023\Characters;

abstract class AbstractCharacter
{
	abstract public function getId(): string;

	abstract public function getName(): string;
}
