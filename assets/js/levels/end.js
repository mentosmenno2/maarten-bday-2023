var gameState = {
	level: {
		width: $( '.level' ).width(),
		height: $( '.level' ).height(),
	},
	currentCredit: 0,
	credits: [
		{
			title: 'The Stolen Present',
			text: 'A game created for Maarten Sijm',
		},
		{
			title: 'Concept',
			text: 'Menno van den Ende',
		},
		{
			title: 'Minigame ideas',
			text: 'Menno van den Ende and OpenAI ChatGPT',
		},
		{
			title: 'Conversation script',
			text: 'OpenAI ChatGPT',
		},
		{
			title: 'Design',
			text: 'Menno van den Ende with inspiration from The Advent of Code',
		},
		{
			title: 'Artwork',
			text: 'Menno van den Ende',
		},
		{
			title: 'Game code',
			text: 'Menno van den Ende',
		},
		{
			title: 'Game code assistant',
			text: 'Jan-Maarten Legerstee',
		},
		{
			title: 'Menu voice',
			text: 'Menno van den Ende',
		},
		{
			title: 'Menu Music',
			text: 'Bulby - Menu 1 8 Bit Remix - Super Smash Bros. Melee',
		},
		{
			title: 'In Game Music',
			text: 'Quiet Machine - Showdown!',
		},
		{
			title: 'Conversation music',
			text: 'Adam Haynes - Boss Battle - 8-bit RPG Music',
		},
		{
			title: 'Credits music',
			text: 'HeatleyBros - 8 Bit Ending!',
		},
		{
			title: 'Happy birthday Maarten!',
			text: '<p><a class="button button-making-of" href"https://www.youtube.com/watch?v=mlieVi5_l4c">Making of video</a></p><p><button class="button button-main-menu">Main menu</button></p>',
		},
	],
}

function initializeGame() {
	$( '.button-start' ).text( 'Continue' );
}

function addGameEventListeners() {
	$( '.button-skip-credits' ).on( 'click', onClickSkipCredits );
}

function startGame() {
	addGameEventListeners();

	$( '.audio-music-credits' )[0].play();
	$( '.credit-item' ).css( 'transform', 'scale(0)' );

	setTimeout(showFirstCredit, 1000);
}

function onClickSkipCredits() {
	stopCredits();
}

function showFirstCredit() {
	$( '.credit-item' ).css( 'opacity', '1' );
	hideCredit();
}

function showNextCredit() {
	var credit = gameState.credits[gameState.currentCredit] ?? null;
	var nextCredit = gameState.credits[gameState.currentCredit + 1] ?? null;
	if ( ! credit ) {
		$( '.button-main-menu' ).show();
		return;
	}

	$( '.credit-title' ).text( credit.title );
	$( '.credit-text' ).html( credit.text );
	$( '.credit-item' ).css( 'transform', 'scale(1)' );

	gameState.currentCredit++;
	if ( ! nextCredit ) {
		$( '.button-main-menu' ).on( 'click', onClickSkipCredits );
		return;
	}

	setTimeout(hideCredit, 4000);
}

function hideCredit() {
	var randomX = Math.random() * ( gameState.level.width / 2 ) * ( Math.round( Math.random() ) ? 1 : -1 );
	var randomY = Math.random() * ( gameState.level.width / 2 ) * ( Math.round( Math.random() ) ? 1 : -1 );

	$( '.credit-item' ).css( 'transform', 'scale(0) translate(' + randomX + 'px, ' + randomY + 'px)' );

	setTimeout(showNextCredit, 1000);
}

function stopCredits() {
	$( '.audio-music-credits' )[0].pause();
	gameCompleted( null );
}
