Tetris engine js module.

Module allows users to effortlessly implement Tetris game (both mechanics and adjustable graphics) in their website.

The main object <Game> (which is supposed to be imported from the engine module) offers two most important methods:<br>
.addMatrixDefault(<br>
shapesInLine, - defines number of Tetris blocks randomised in advance<br>
speed, - interval between game steps (in miliseconds)<br>
height, - number of pixels in game matrix height<br>
width, - number of pixels in game matrix width<br>
targetElement, - DOM element matrix is supposed to be added inside<br>
resultCallbackFunctions = {<br>
  shapeDroppedFunction, - function invoked every time user drops shape down. It takes current amount of shapes dropped as an argument<br>
  shapeMovedDownFunction, - function invoked every time shape moves down. It takes current amount of shape movements down as an argument<br>
  shapeMovedRightFunction, - function invoked every time user moves shape right. It takes current amount of shape movements right as an argument<br>
  shapeMovedLeftFunction, - function invoked every time user moves shape left. It takes current amount of shape movements left as an argument<br>
  shapeRotatedFunction, - function invoked every time user rotates shape. It takes current amount of shape rotations as an argument<br>
  rowRemovedFunction, - function invoked every time full row disappears. It takes current amount of rows removed as an argument<br>
  gameOverFunction - function invoked when game ends. It takes current amount of rows removed as an argument<br>
},<br>
callbackFunctions = {<br>
  shapeMovedFunction, - function invoked every time user or game moves the shape<br>
  shapeDroppedFunction, - function invoked every time user drops shape down<br>
  shapeRotatedFunction, - function invoked every time user rotates shape<br>
  rowDroppedFunction - function invoked every time full row disappears<br>
}<br>
)<br>

and:<br>
.addMatrixCustom( *Writing documentations is horrible I need to take a break*
