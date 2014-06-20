$(document).ready(function(){
  _this = this;
  this.gameState = "run";
  this.timePassed = 0;
  this.timeMax = 2;
  this.timerSpeed = 1000;
  this.timerState = 0;
  this.timer;

  var gameBoard = new Board();
  gameBoard.build_board();

  gameBoard.displayLetters = gameBoard.addLetters();

  printUpcoming();
  
  printScore();

  function drawBoard() {
    $.each(gameBoard.board, function(row_idx, row) {
      var rowContainer = "<div class='row'>";
      $.each(row, function(col_idx, col) {
        rowContainer += "<div data-row='" + row_idx + "' data-col='" + col_idx + "' class='tile'>" +
                        "<div class='contents'>" + col.contents + "</div>" +
                        "<div class='up-button'></div><div class='down-button'></div>" +
                        "<div class='right-button'></div><div class='left-button'></div>" +
                        "</div>"
      });
      rowContainer += "</div>"
      $('.board-container').append(rowContainer);
    });
  };

  drawBoard();

  function fillBoardAtStart() {
    $.each(gameBoard.letters, function(index, letter){
      emptyTile = gameBoard.findEmptyTile();
      gameBoard.insertTile(letter, emptyTile);
      row = emptyTile[0];
      col = emptyTile[1];
      $(".tile[data-row=" + row + "][data-col=" + col + "]").find('.contents').html(letter)
    });
  }

  fillBoardAtStart();

  function fillTimerDots() {

    if (_this.timePassed == 0){
      $('.timer-box-01').html("&middot;");
      $('.timer-box-02').html("");
      $('.timer-box-03').html("");
    } else if (_this.timePassed == 1) {
      $('.timer-box-01').html("&middot;");
      $('.timer-box-02').html("&middot;");
    } else {
      $('.timer-box-01').html("&middot;");
      $('.timer-box-02').html("&middot;");
      $('.timer-box-03').html("&middot;");
    }
  };

  function createTimer() {
    setInterval(function(){
    if (_this.timePassed < _this.timeMax) {
      _this.timePassed = _this.timePassed + 1;
    } else {
      _this.timePassed = 0;
      checkAndInsert();
    }
    fillTimerDots();
    }, _this.timerSpeed);
  };

  setInterval(function(){
    if (_this.gameState == "end") {
      var playerName = prompt('Game over! Enter your name:')
      $("#score").val(gameBoard.score);
      $("#player-name").val(playerName);
      $("#score-form").submit();
    }
  }, 1000);

  $(".timer-box-01").html("&middot;");
  
  this.timer = createTimer();

  // Move Listeners //

  $('.up-button').click(function() {
    var row = parseInt($(this).parent().attr('data-row'))
    var col = parseInt($(this).parent().attr('data-col'))
    var rowUp = parseInt($(this).parent().attr('data-row')) - 1

    if (gameBoard.checkForEmptyTile("up", [row, col])) {
      clickedContents = gameBoard.board[row][col].contents;
      $(this).parent().find('.contents').html(" ");
      $(".tile[data-row=" + rowUp + "][data-col=" + col +"]").find('.contents').html(clickedContents);
      gameBoard.board[row - 1][col].contents = clickedContents;
      gameBoard.board[row][col].contents =  " ";
      findAndRemoveWords();
      checkScoreModifyTimer();
      printScore();
    }
  });

  $('.down-button').click(function() {
    var row = parseInt($(this).parent().attr('data-row'))
    var col = parseInt($(this).parent().attr('data-col'))
    var rowDown = parseInt($(this).parent().attr('data-row')) + 1
    
    if (gameBoard.checkForEmptyTile("down", [row, col])) {
      clickedContents = gameBoard.board[row][col].contents;
      $(this).parent().find('.contents').html(" ");
      $(".tile[data-row=" + rowDown + "][data-col=" + col + "]").find('.contents').html(clickedContents);
      gameBoard.board[row + 1][col].contents = clickedContents;
      gameBoard.board[row][col].contents =  " ";
      findAndRemoveWords();
      checkScoreModifyTimer();
      printScore();
    }
  });

  $('.right-button').click(function() {
    var row = parseInt($(this).parent().attr('data-row'))
    var col = parseInt($(this).parent().attr('data-col'))
    var colRight = parseInt($(this).parent().attr('data-col')) + 1
    
    if (gameBoard.checkForEmptyTile("right", [row, col])) {
      clickedContents = gameBoard.board[row][col].contents;
      $(this).parent().find('.contents').html(" ");
      $(".tile[data-row=" + row + "][data-col=" + colRight + "]").find('.contents').html(clickedContents);
      gameBoard.board[row][col + 1].contents = clickedContents;
      gameBoard.board[row][col].contents =  " ";
      findAndRemoveWords();
      checkScoreModifyTimer();
      printScore();
    }
  });

  $('.left-button').click(function() {
    var row = parseInt($(this).parent().attr('data-row'))
    var col = parseInt($(this).parent().attr('data-col'))
    var colRight = parseInt($(this).parent().attr('data-col')) - 1
    
    if (gameBoard.checkForEmptyTile("left", [row, col])) {
      clickedContents = gameBoard.board[row][col].contents;
      $(this).parent().find('.contents').html(" ");
      $(".tile[data-row=" + row + "][data-col=" + colRight + "]").find('.contents').html(clickedContents);
      gameBoard.board[row][col - 1].contents = clickedContents;
      gameBoard.board[row][col].contents =  " ";
      findAndRemoveWords();
      checkScoreModifyTimer();
      printScore();
    }
  });

  // END Move Listeners //

  function findAndRemoveWords() {
    os_on_board = gameBoard.findOsOnBoard();
    word_coords = gameBoard.findWords(os_on_board);

    gameBoard.addWordColor(word_coords);
    gameBoard.removeWords(word_coords);
    gameBoard.removeWordColor(word_coords);
    gameBoard.raiseScore(word_coords);
    printScore();
  };

  function checkAndInsert() {
    letter = gameBoard.getLetter();
    emptyTile = gameBoard.findEmptyTile();
    gameBoard.insertTile(letter, emptyTile);
    gameBoard.showNewTileLetter(emptyTile);
    printUpcoming();
    // findAndRemoveWords();
    if (gameBoard.boardFull() == true) {
      _this.gameState = "end";
    }
    checkScoreModifyTimer();
  };

  function checkScoreModifyTimer() {
    if (gameBoard.score > 15 && _this.timerState == 2) {
      delete _this.timer;
      _this.timerSpeed = 900;
      _this.timer = createTimer;
      _this.timerState = 3;
    } else if (gameBoard.score > 10 && _this.timerState == 1) {
      delete _this.timer;
      _this.timerSpeed = 925;
      _this.timer = createTimer;
      _this.timerState = 2;
    } else if (gameBoard.score > 4 && _this.timerState == 0) {
      delete _this.timer;
      _this.timerSpeed = 950;
      _this.timer = createTimer();
      _this.timerState = 1;
    }
  };

  function printScore() {
    $(".score-container").html("<strong>Score:</strong> " + gameBoard.score);
  };

  function printUpcoming() {
    $(".upcoming-container").html("");
    var lettersList = "<ul><li><strong>Next:</strong> </li>";
    for (var i = 0; i < 5; i++) {
      lettersList += "<li>" + gameBoard.displayLetters[i] + "</li>"
    }
    $(".upcoming-container").append(lettersList + "</ul>");
  };

});
