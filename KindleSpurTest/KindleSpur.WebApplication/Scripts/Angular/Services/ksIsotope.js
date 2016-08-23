
function msIsotopeFunc(iObj) {
    var _that = this;
    _that.param = iObj;

    _that.gnericIsotopeArray = iObj && iObj.gnericIsotopeArray ? iObj.gnericIsotopeArray : [];
    _that.floatStyleArr = iObj && iObj.floatStyleArr ? iObj.floatStyleArr : [];
    _that.floatStyleLeft = 0;
    _that.floatStyleTop = 0;
    _that.TotalColumns = iObj && iObj.TotalColumns ? iObj.TotalColumns : 3;
    _that.expansionCol = iObj && iObj.expansionCol ? iObj.expansionCol : 2;
    _that.expansionRow = iObj && iObj.expansionRow ? iObj.expansionRow : 2;
    _that.heightOfASingleCell = iObj && iObj.heightOfASingleCell ? iObj.heightOfASingleCel : 252;
    _that.widthOfASingleCell = iObj && iObj.widthOfASingleCell ? iObj.widthOfASingleCell : 278;
    _that.canExpandRight = true;
    _that.expandThisIndex = -1;

};


/**
 * 
 *  ANP - I S O T O P E S
 *  Function to render index cards according to the grid layout, specified by user
 *  9/6/2014, 12:30 PM
 *  
 **/
msIsotopeFunc.prototype.getModValue = function (iIndex, iChangeIndexTo) {
    var _that = this;
    var _horizontalPosition = iChangeIndexTo % _that.TotalColumns
    _that.floatStyleLeft = _horizontalPosition * _that.widthOfASingleCell;
    var _verticalPosition = parseInt(iChangeIndexTo / _that.TotalColumns)
    if (_verticalPosition == 0) {
        _that.floatStyleTop = 0;
    }
    else {
        _that.floatStyleTop = _verticalPosition * _that.heightOfASingleCell;
    }

    var _variableHeight = _that.heightOfASingleCell;
    var _variableWidth = _that.widthOfASingleCell;

    var _zIndex = _that.gnericIsotopeArray.length - iChangeIndexTo;
    var _height = (_that.heightOfASingleCell * _that.expansionRow);
    var _weidth = (_that.widthOfASingleCell * _that.expansionCol);

    if (iIndex == _that.expandThisIndex) {

        _that.gnericIsotopeArray[iIndex].styleObj = {
            marginLeft: _that.floatStyleLeft + '%',
            marginTop: _that.floatStyleTop + 'px',
            height: _height + 'px',
            width: _weidth + '%'
        };
    }
    else {

        _that.gnericIsotopeArray[iIndex].styleObj = {
            marginLeft: _that.floatStyleLeft + '%',
            marginTop: _that.floatStyleTop + 'px',
            height: _variableHeight + 'px',
            width: _variableWidth + '%'
        };

    }
    //////console.log(_that.gnericIsotopeArray[iIndex].styleObj)
}
/**
 * 
 *  ANP - I S O T O P E S
 *  Function to expand index card and re arrange other index cards, according to user input
 *  9/6/2014, 12:30 PM
 *  
 **/
msIsotopeFunc.prototype.expandForFloat = function (iObj) {
    //////console.log("WHY AM I IN EXPAND FOR FLOAT")
    //////console.log(iObj)
    var _that = this;
    _that.heightOfASingleCell = iObj.iHeight;
    _that.widthOfASingleCell = iObj.iWidth;
    var iIndex = iObj.index;
    ////console.log(iObj.TotalColumns)
    if (iObj.TotalColumns)
        _that.TotalColumns = iObj.TotalColumns;
    _that.expansionCol = iObj.column;
    _that.expansionRow = iObj.row;
    _that.expandThisIndex = iIndex;
    _that.gnericIsotopeArray = iObj.array
    for (var i = 0; i < _that.gnericIsotopeArray.length; i++)
        _that.getModValue(i, i);

    if ((iIndex % _that.TotalColumns + _that.expansionCol - 1) < _that.TotalColumns) {
        _that.canExpandRight = true;
    }
    else {
        _that.canExpandRight = false;
    }

    var _indexChange = 0;
    var j = 0;

    while (j < _that.gnericIsotopeArray.length) {

        if (iIndex == j) {

            if (_that.canExpandRight == true) {
                _that.getModValue(j, j);
            }
            else {
                _that.getModValue(j, ((parseInt(j / _that.TotalColumns) + 1) * _that.TotalColumns) - _that.expansionCol);
                _indexChange--;
            }
            j++;
        }
        else if (iIndex % _that.TotalColumns <= (j + _indexChange) % _that.TotalColumns && (j + _indexChange) % _that.TotalColumns < iIndex % _that.TotalColumns + _that.expansionCol && _that.canExpandRight == true) {

            if (parseInt(iIndex / _that.TotalColumns) == parseInt((j + _indexChange) / _that.TotalColumns)) {

                _indexChange = _indexChange + _that.expansionCol - 1;
            }
            else if (parseInt(iIndex / _that.TotalColumns) < parseInt((j + _indexChange) / _that.TotalColumns) && parseInt((j + _indexChange) / _that.TotalColumns) < parseInt(iIndex / _that.TotalColumns) + _that.expansionRow) {

                _indexChange = _indexChange + _that.expansionCol;
            }
            else {

                _that.getModValue(j, j + _indexChange);
                j++;
            }
        }
        else if (_that.TotalColumns - _that.expansionCol <= (j + _indexChange) % _that.TotalColumns && _that.canExpandRight == false) {

            if (parseInt(iIndex / _that.TotalColumns) == parseInt((j + _indexChange) / _that.TotalColumns)) {
                _indexChange = _indexChange + _that.expansionCol;
            }
            else if (parseInt(iIndex / _that.TotalColumns) < parseInt((j + _indexChange) / _that.TotalColumns) && parseInt((j + _indexChange) / _that.TotalColumns) < parseInt(iIndex / _that.TotalColumns) + _that.expansionRow) {
                _indexChange = _indexChange + _that.expansionCol;
            }
            else {

                _that.getModValue(j, j + _indexChange);
                j++;
            }
        }
        else {

            _that.getModValue(j, j + _indexChange);
            j++;
        }
    }
}

/**
 * 
 *  ANP - I S O T O P E S
 *  Function to collapse index card and re arrange other index cards.
 *  9/6/2014, 12:30 PM
 *  
 **/

msIsotopeFunc.prototype.genericColChange = function (iValue) {
    var _that = this;
    _that.TotalColumns = iValue;
    for (var i = 0; i < _that.gnericIsotopeArray.length; i++)
        _that.getModValue(i, i);
}

/**
 * 
 *  ANP - I S O T O P E S
 *  Function to collapse index card and re arrange other index cards.
 *  20/6/2014, 11:33 PM
 *  
 **/

msIsotopeFunc.prototype.genericHeightChange = function (iObj) {
    var _that = this;
    _that.expandThisIndex = -1
    _that.heightOfASingleCell = iObj.iHeight;
    _that.widthOfASingleCell = 100 / iObj.iCol;
    _that.TotalColumns = iObj.iCol;
    _that.gnericIsotopeArray = iObj.iArray;
    if (_that.gnericIsotopeArray) {
        for (var i = 0; i < _that.gnericIsotopeArray.length; i++)
            _that.getModValue(i, i);
    }
};

/**
 * 
 *  ANP - I S O T O P E S
 *  Function to collapse index card and re arrange other index cards.
 *  9/6/2014, 12:30 PM
 *  
 **/

msIsotopeFunc.prototype.resetExpansion = function (iObj) {
    var _that = this;
    _that.expandThisIndex = -1;
    _that.heightOfASingleCell = iObj.iHeight;
    _that.widthOfASingleCell = 100 / iObj.iCol;
    _that.TotalColumns = iObj.iCol;
    _that.gnericIsotopeArray = iObj.iArray;

    for (var i = 0; i < _that.gnericIsotopeArray.length; i++) {
        _that.getModValue(i, i);
    }
};