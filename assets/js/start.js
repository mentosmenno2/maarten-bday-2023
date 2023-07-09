function initializeGame() {
	addGameEventListeners();
}

function addGameEventListeners() {
	$( '.button-start' ).on( 'click', onGameStartButtonClick );
	$( document ).on( 'showChatMessage', onShowChatMessage )
}

function onGameStartButtonClick() {
	gameCompleted();
}

function onShowChatMessage( event, index ) {
	if ( index === 0 ) {
		$presentElement = $( '<img class="present pixelated" als="" src="assets/images/present.png" />' );
		$presentElement.css( 'bottom', 0 );
		$presentElement.css( 'left', '30%' );
		$('.talker__container').append($presentElement);
	}

	if ( index === 10 ) {
		var width = $('.present').width();
		$('.present').css( 'left', 'calc(70% - ' + width + 'px)' );
	}
}
