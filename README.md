Tetris engine js module.

Module allows users to effortlessly implement Tetris game (both mechanics and adjustable graphics) in their website.

The main object <Game> (which is supposed to be imported from the engine module) offers two most important methods:<br>
.addMatrixDefault(<br>
shapesInLine, - defines number of Tetris blocks randomised in advance
speed, - interval between game steps (in miliseconds)
height, - number of pixels in game matrix height
width, - number of pixels in game matrix width
targetElement, - DOM element matrix is supposed to be added inside
resultCallbackFunctions = {
  shapeDroppedFunction, - function invoked every time user drops shape down. It takes current amount of shapes dropped as an argument
  shapeMovedDownFunction, - function invoked every time shape moves down. It takes current amount of shape movements down as an argument
  shapeMovedRightFunction, - function invoked every time user moves shape right. It takes current amount of shape movements right as an argument
  shapeMovedLeftFunction, - function invoked every time user moves shape left. It takes current amount of shape movements left as an argument
  shapeRotatedFunction, - function invoked every time user rotates shape. It takes current amount of shape rotations as an argument
  rowRemovedFunction, - function invoked every time full row disappears. It takes current amount of rows removed as an argument
  gameOverFunction - function invoked when game ends. It takes current amount of rows removed as an argument
},
callbackFunctions = {
  shapeMovedFunction, - function invoked every time user or game moves the shape
  shapeDroppedFunction, - function invoked every time user drops shape down
  shapeRotatedFunction, - function invoked every time user rotates shape
  rowDroppedFunction - function invoked every time full row disappears
}
)

and:
.addMatrixCustom( *Writing documentations is horrible I need to take a break*
