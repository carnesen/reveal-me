/**
 * Click on pairs of matching tiles to reveal the image
 * @author Chris Arnesen
 */

/**
 * State variables
 */
var firstTileClicked = null; // reference to the jQuery element the user clicks first
var firstColorClicked; // color of that tile
var clickable = true; // whether or not tiles are currently clickable (for animation delays)

/**
 * Constants
 */
var GRID_SIZE = 4; // 4x4 grid of tiles
var IMAGE_WIDTH = 60; // Used in tile calculations
var TILE_BACK_COLOR = '#2e2e2e'; // Color of the "back" of the tile

/**
 * @returns {Array} of random colors in hex notation #bbccdd
 */
function getRandomColors() {

  var colors = [];

  // GRID_SIZE^2 tiles total, half that many random colors since they're paired
  for (var i = 0; i < GRID_SIZE * GRID_SIZE / 2; i++) {
    var color = '#' + Math.floor(Math.random()*16777215).toString(16);
    // push the color twice
    colors.push(color, color);
  }

  // Shuffle the color list in place
  for (i = colors.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = colors[i];
    colors[i] = colors[j];
    colors[j] = temp;
  }

  return colors;
}

/**
 * Creates a jQuery element corresponding to a single tile
 * in the grid. The on('click') event handler implements the game logic
 * @param color
 * @returns {*|jQuery|HTMLElement}
 */
function createTile(color) {

  var $tile = $('<div>');

  $tile.addClass('tile');

  // tiles start as all the same color "face down"
  $tile.css({
    'background-color': TILE_BACK_COLOR,
    border: 'solid 1px',
    position: 'absolute',
    height: '33%',
    padding: 0,
    margin: 0
  });

  $tile.on('click', clickHandler);

  function clickHandler() {

    // clicking is disabled during animation delays
    if (!clickable) {
      return;
    }

    // clicking a tile always reveals its color
    $(this).css({'background-color': color});

    // firstTileClicked is either null or contains the jQuery object that was clicked first
    if (firstTileClicked === null) {
      // was the first click (rather than the second in a pair)
      firstTileClicked = $(this);
      firstColorClicked = color;
      return;
    }

    // Discard repeated clicks on the same tile
    if (firstTileClicked.is($(this))) {
      return;
    }

    // At this point we know this click is the second tile.
    // We'll either vanish or flip both tiles.
    var bothTiles = firstTileClicked.add($(this));
    firstTileClicked = null;

    // Colors match
    if (firstColorClicked === color) {
      bothTiles.off();
      clickable = false;
      setTimeout(function() {
        bothTiles.fadeOut(function () { clickable = true; });
      }, 500);
      return;
    }

    // Colors don't match
    clickable = false;
    setTimeout(function() {
      bothTiles.css({'background-color': TILE_BACK_COLOR});
      clickable = true;
    }, 500);

  } // end of clickHandler function declaration

  return $tile;
}

$(document).ready(function() {

  var $html = $('<div>');

  var $img = $('<img>').attr('src', 'me.jpg').css({'width': IMAGE_WIDTH + '%'});

  $html.append($img);

  var tiles = getRandomColors().map(createTile);

  // horizontal
  for (var i = 0; i < GRID_SIZE; i++) {
    // vertical
    for (var j = 0; j < GRID_SIZE; j++) {

      var $tile = tiles[GRID_SIZE * i + j];

      $tile.css({
        width: IMAGE_WIDTH / GRID_SIZE + '%',
        left: i * IMAGE_WIDTH / GRID_SIZE + '%',
        top: j * 100 / GRID_SIZE + '%'
      });

      $html.append($tile);
    }
  }

  $('main').html($html);

});