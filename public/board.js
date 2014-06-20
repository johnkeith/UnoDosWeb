function Board () {
  this.board = [];
  this.letters = ["U","N","O","D","S","O"]
  this.moveToDisplay = [];
  this.displayLetters = [];
  this.score = 0;
};

Board.prototype.shuffleLetters = function(lettersSet) {
  return lettersSet.sort(function() {return 0.5 - Math.random();});
};

Board.prototype.getLetter = function() {
  if (this.moveToDisplay.length == 0){
    this.moveToDisplay = this.addLetters();
    this.displayLetters.push(this.moveToDisplay.splice(0,1).toString());
  } else {
    this.displayLetters.push(this.moveToDisplay.splice(0,1).toString());
  }
  return this.displayLetters.splice(0,1);

};

Board.prototype.addLetters = function() {
  var lettersArray = [];
  var letters_randomized = this.shuffleLetters(this.letters);
  for (var i = 0; i < letters_randomized.length; i++) {
    lettersArray.push(letters_randomized[i]);
  }
  return lettersArray;
};


Board.prototype.build_board = function() {
  for (var i = 0; i < 5; i++) {
    row = [];
    for( var j = 0; j < 5; j++) {
      row.push(new Tile())
    }
    this.board.push(row);
  }
};

Board.prototype.boardFull = function() {
  var empty = true;
  $.each(this.board, function(index, row) {
    if (empty == false) {
      return false
    } else {
      $.each(row, function(index, col) {
        if (col.contents == " ") {
          empty = false;
        };
      });
    }
  });
  return empty;
};

Board.prototype.findEmptyTile = function() {
  var emptyTile = null;
  while (emptyTile == null) {
    var row = Math.floor(Math.random() * this.board.length);
    var col = Math.floor(Math.random() * this.board[0].length);

    if (this.board[row][col].contents == " ") {
      emptyTile = [row, col];
    }
  }
  return emptyTile;
};

Board.prototype.insertTile = function(letter, coords) {
  row = coords[0];
  col = coords[1];
  this.board[row][col].contents = letter[0];
}

// returns true if space empty, false if filled or off board
Board.prototype.checkForEmptyTile = function(direction, coords) {
  var row = coords[0];
  var col = coords[1];

  if (direction == "up") {
    if (row == 0) {
      return false;
    } else {
      return this.board[row - 1][col].contents == " ";
    }
  } else if (direction == "down") {
    if (row == 4) {
      return false;
    } else {
      return this.board[row + 1][col].contents == " ";
    }
  } else if (direction == "left") {
    if (col == 0) {
      return false;
    } else {
      return this.board[row][col - 1].contents == " ";
    }
  } else if (direction == "right") {
    if (col == 4) {
      return false
    } else {
      return this.board[row][col + 1].contents == " "; 
    }
  }
};

Board.prototype.wordUp = function(row, col) {
  return this.board[row - 1][col].contents == "N" && this.board[row - 2][col].contents == "U";
};

Board.prototype.wordDown = function(row, col) {
  return this.board[row + 1][col].contents == "N" && this.board[row + 2][col].contents == "U";
};

Board.prototype.wordLeft = function(row, col) {
  return this.board[row][col - 1].contents == "N" && this.board[row][col - 2].contents == "U";
};

Board.prototype.wordRight = function(row, col) {
  return this.board[row][col + 1].contents == "N" && this.board[row][col + 2].contents == "U";
};

Board.prototype.wordCenterVert = function(row, col) {
  return this.board[row + 1][col].contents == "S" && this.board[row - 1][col].contents == "D" ||
         this.board[row + 1][col].contents == "D" && this.board[row - 1][col].contents == "S";
}; 

Board.prototype.wordCenterHorz = function(row, col) {
  return this.board[row][col + 1].contents == "S" && this.board[row][col - 1].contents == "D" ||
         this.board[row][col + 1].contents == "D" && this.board[row][col - 1].contents == "S";
};

Board.prototype.findOsOnBoard = function() {
  os_on_board = []
  $.each(this.board, function(idx_row, row) {
    $.each(row, function(idx_col, col) {
      if (col.contents == "O") {
        os_on_board.push([idx_row, idx_col]);
      }
    });
  });
  return os_on_board
};

Board.prototype.findWords = function(o_array) {
  var _this = this;
  var word_coords = [];
  $.each(o_array, function(index, coords) {
    row = coords[0];
    col = coords[1];
    if (row > 0 && row < 4) {
      if (_this.wordCenterVert(row, col)) {
        word_coords.push([row, col])
        word_coords.push([row + 1, col])
        word_coords.push([row - 1, col])
      }
    }
    if (row < 3) {
      if (_this.wordDown(row, col)) {
        word_coords.push([row, col])
        word_coords.push([row + 1, col])
        word_coords.push([row + 2, col])
      }
    }
    if (row > 1) {
      if (_this.wordUp(row, col)) {
        word_coords.push([row, col])
        word_coords.push([row - 1, col])
        word_coords.push([row - 2, col])
      }
    }
    if (col > 0 && col < 4) {
      if (_this.wordCenterHorz(row, col)) {
        word_coords.push([row, col])
        word_coords.push([row, col + 1])
        word_coords.push([row, col - 1])
      }
    }
    if (col < 3) {
      if (_this.wordRight(row, col)) {
        word_coords.push([row, col])
        word_coords.push([row, col + 1])
        word_coords.push([row, col + 2])
      }
    }
    if (col > 1) {
      if (_this.wordLeft(row, col)) {
        word_coords.push([row, col])
        word_coords.push([row, col - 1])
        word_coords.push([row, col - 2])
      }
    }
  });
  return word_coords;
};

Board.prototype.removeWords = function(word_coords) {
  _removeWordsThis = this;
  setTimeout(function() {
    $.each(word_coords, function(index, coords) {
      _removeWordsThis.board[coords[0]][coords[1]].contents = " ";
      $(".tile[data-row=" + coords[0] + "][data-col=" + coords[1] + "]").find('.contents').html(" ");
    });
  }, 100);
};

Board.prototype.addWordColor = function(word_coords) {
  $.each(word_coords, function(index, coords) {
    $(".tile[data-row=" + coords[0] + "][data-col=" + coords[1] + "]").animate({
      backgroundColor: "#fff" }, 500);
  });
};

Board.prototype.removeWordColor = function(word_coords) {
  $.each(word_coords, function(index, coords) {
    $(".tile[data-row=" + coords[0] + "][data-col=" + coords[1] + "]").animate({
      backgroundColor: "#333" }, 500);
  });
};

Board.prototype.showNewTileLetter = function(coords) {
  row = coords[0];
  col = coords[1];
  newLetter = this.board[row][col].contents;
  $(".tile[data-row=" + row + "][data-col=" + col + "]").find('.contents').fadeOut(250, function(){
    $(this).html(newLetter).fadeIn(250)
  });
};

Board.prototype.raiseScore = function(word_coords) {
  this.score += word_coords.length / 3;
};
