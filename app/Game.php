<?php

namespace Mentosmenno2\MaartenBday2023;

use Mentosmenno2\MaartenBday2023\Levels\AbstractLevel;
use Mentosmenno2\MaartenBday2023\Levels\LevelDuckyDash;
use Mentosmenno2\MaartenBday2023\Levels\LevelQuackVSQuack;
use Mentosmenno2\MaartenBday2023\Levels\LevelStart;
use Mentosmenno2\MaartenBday2023\Levels\LevelTagADuck;

class Game
{

	/**
	 * @var array<int,AbstractLevel>
	 */
	protected array $levels;

	public function __construct()
	{
		$this->levels = array(
			new LevelStart(),
			new LevelDuckyDash(),
			new LevelTagADuck(),
			new LevelQuackVSQuack(),
		);
	}

	public function getLevel(): ?AbstractLevel
	{
		$levelParam = filter_input(INPUT_GET, 'level');
		if (empty($levelParam)) {
			return $this->levels[0];
		}

		foreach ($this->levels as $level) {
			if ($level->getId() === $levelParam) {
				return $level;
			}
		}

		return null;
	}

	public function getNextLevel(): AbstractLevel
	{
		$index = array_search($this->getLevel(), $this->levels, false);
		if ($index === false) {
			return $this->levels[0];
		}

		return $this->levels[$index + 1] ?? $this->levels[0];
	}
}
