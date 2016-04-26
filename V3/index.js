// function bigImg(imgUrl) {};
window.onload = function() {
    var element = document.querySelector('#img');
    var action, scale, type, limitsLeft, limitsRight;
    var changed, target, clienX, clienY;
    var types;
    var firstX, firstY, lastX, lastY;
    // 每次开始偏移量进行初始化
    var diffX = 0,
        diffY = 0;
    var tempDiffX, tempDiffY;
    var caseX, caseY;

    function init() {

    }

    dbtap(element, function(e) {
        changed = e.changedTouches[0];
        target = e.target;
        clienX = changed.clientX;
        clienY = changed.clientY;
        if(element.getAttribute('data-bigImg') === '1') {
            element.style.webkitTransition = '-webkit-transform 200ms ease-out';
            element.style.webkitTransform = 'scale(1, 1)';
            element.setAttribute('data-bigImg', '0');

            limitsLeft = null;
            limitsRight = null;
            limitsUp = null;
            limitsDown = null;

            firstX = null;
            firstY = null;
            lastX = null;
            lastY = null;

            diffX = null;
            diffY = null;
            tempDiffX = null;
            tempDiffY = null;
            caseX = null;
            caseY = null;

        } else {
            element.setAttribute('data-bigImg', '1');
            var x = target.x,
                y = target.y,
                objW = clienX - x,
                objH = clienY - y,
                width = target.width,
                height = target.height,
                percentageX = ( (objW/width) * 100 ) + '%',
                percentageY = ( (objH/height) * 100 ) + '%';

            action = setScale(element, percentageX, percentageY);
            scale = action.scale;
            type = action.type;

            //limitsLeft = null;
            //limitsRight = null;

            limitsLeft = action.limitsLeft;
            limitsRight = action.limitsRight;
            limitsUp = action.limitsUp;
            limitsDown = action.limitsDown;
        }

        element.addEventListener('touchmove', function(e) {
            if(element.getAttribute('data-bigImg') === '1') {
                element.style.webkitTransition = '';

                changedTouch = e.changedTouches[0];
                target = e.target;
                moveClienX = changedTouch.clientX;
                moveClienY = changedTouch.clientY;

                //elX = target.x;
                //elY = target.y;
                //offsetX = target.offsetLeft;
                //offsetY = target.offsetTop;


                //screenX = changedTouch.screenX;
                //screenY = changedTouch.screenY;

                //clientLeft = target.clientLeft;
                //clientTop = target.clientTop;

                firstX = moveClienX;
                firstY = moveClienY;
                if(lastX && lastY) {

                    tempDiffX = (firstX - lastX)/scale;
                    tempDiffY = (firstY - lastY)/scale;

                    diffX = diffX + tempDiffX;
                    diffY = diffY + tempDiffY;

                    if(type === 'HORIZONTAL') {
                        types = getPosition({
                            left: limitsLeft,
                            right: limitsRight,
                            up: limitsUp,
                            down: limitsDown
                        },{
                            left: diffX,
                            right: diffX,
                            up: 0,
                            down: 0
                        });

                        if(types.left) {
                            // 抖动效果
                            caseX = diffX - limitsLeft;
                            diffX -= tempDiffX;
                            diffX += tempDiffX * ( ( (80 - caseX) < 0 ? 0 : (80 - caseX) )/80 );
                        } else if(types.right) {
                            // 抖动效果
                            caseX = Math.abs(diffX - limitsRight);
                            diffX -= tempDiffX;
                            diffX += tempDiffX * ( ( (80 - caseX) < 0 ? 0 : (80 - caseX) )/80 );
                        }
                        element.style.webkitTransform = 'scale('+ scale +', '+ scale +') translate( '+ diffX +'px)';

                    } else if(type === 'SYNTHESIZE') {
                        types = getPosition({
                            left: limitsLeft,
                            right: limitsRight,
                            up: limitsUp,
                            down: limitsDown
                        },{
                            left: diffX,
                            right: diffX,
                            up: diffY,
                            down: diffY
                        });
                        if(types.left) {
                            // 抖动效果
                            caseX = diffX - limitsLeft;
                            diffX -= tempDiffX;
                            diffX += tempDiffX * ( ( (80 - caseX) < 0 ? 0 : (80 - caseX) )/80 );
                        } else if(types.right) {
                            // 抖动效果
                            caseX = Math.abs(diffX - limitsRight);
                            diffX -= tempDiffX;
                            diffX += tempDiffX * ( ( (80 - caseX) < 0 ? 0 : (80 - caseX) )/80 );
                        }

                        if(types.up) {
                            // 抖动效果
                            caseY = diffY - limitsUp;
                            diffY -= tempDiffY;
                            diffY += tempDiffY * ( ( (80 - caseY) < 0 ? 0 : (80 - caseY) )/80 );
                        } else if(types.down) {
                            caseY = Math.abs(diffY - limitsDown);
                            diffY -= tempDiffY;
                            diffY += tempDiffY * ( ( (80 - caseY) < 0 ? 0 : (80 - caseY) )/80 );
                        }
                        element.style.webkitTransform = 'scale('+ scale +', '+ scale +') translate( '+ diffX +'px ,'+ diffY +'px )';

                    }
                }
                lastX = firstX;
                lastY = firstY;
            }
        }, false);

        element.addEventListener('touchend', function(e) {
            // dbTap会主动触发touchend事件，本touchend会一起触发
            if(element.getAttribute('data-bigImg') === '1') {

                lastX = lastY = null;

                types = getPosition({
                    left: limitsLeft,
                    right: limitsRight,
                    up: limitsUp,
                    down: limitsDown
                },{
                    left: diffX,
                    right: diffX,
                    up: diffY,
                    down: diffY
                });

                var tDiffX = diffX;
                var tDiffY = diffY;

                if(types.left) {
                    diffX = limitsLeft;
                } else if(types.right) {
                    diffX = limitsRight;
                }

                if(types.up) {
                    diffY = limitsUp;
                } else if(types.down) {
                    diffY = limitsDown;
                }

                element.style.webkitTransition = '-webkit-transform 200ms ease-out';
                element.style.webkitTransform = 'scale('+ scale +', '+ scale +') translate( '+ diffX +'px, '+ diffY +'px )';
            }
        }, false);
    });

    function getPosition(limitsObj, diffObj) {
        var limitsLeft = limitsObj.left,
            limitsRight = limitsObj.right,
            limitsUp = limitsObj.up,
            limitsDown = limitsObj.down;

        var diffLeft = diffObj.left,
            diffRight = diffObj.right,
            diffUp = diffObj.up,
            diffDown = diffObj.down;
        var types = {};


        // 已越过左边边界
        if(diffLeft && limitsLeft < diffLeft) {
            types.left = 1;
        }
        // 已超过右边界
        if(diffRight && limitsRight > diffRight) {
            types.right = 1;
        }
        // 已超过右边界
        if(diffUp && limitsUp < diffUp) {
            types.up = 1;
            // console.log('into');
        }
        // 已超过左边界
        if(diffDown && limitsDown > diffDown) {
            types.down = 1;
        }
        return types;
    }


    function setScale(element, percentageX, percentageY) {
        var width = element.offsetWidth || element.width,
            height = element.offsetHeight || element.height,
            rectrangle = height / width,
            viewH = window.innerHeight,
            scale = '',
            leftWidth, rightWidth, upHeight, downHeight,
            limitsLeft, limitsRight, limitsUp, limitsDown,
            type,
            obj = {};
        element.style.webkitTransition = '-webkit-transform 200ms ease-out';
        element.style.webkitTransformOrigin = ' '+ percentageX +' center ';

        if(rectrangle < 1) {
            type = 'HORIZONTAL';
            scale = viewH/height;
            // 算出鼠标点击位置的左右宽度
            leftWidth = (width * parseInt(percentageX))/100;
            rightWidth = width - leftWidth;
            // 算出放大后左右边界值
            limitsLeft = leftWidth * ( scale - 1 );
            limitsRight = rightWidth * ( 1 - scale );
            // 将左右边界值，按比例缩回
            limitsLeft = limitsLeft / scale;
            limitsRight = limitsRight / scale + 2;

            limitsUp = 0;
            limitsDown = 0;

        } else if(rectrangle >= 1) {
            var moreScale = 0.5;
            type = 'SYNTHESIZE';
            scale = viewH/height + moreScale;

            leftWidth = (width * parseInt(percentageX))/100;
            rightWidth = width - leftWidth;

            limitsLeft = leftWidth * ( scale - 1 );
            limitsRight = rightWidth * ( 1 - scale );

            limitsLeft = (limitsLeft / scale);
            limitsRight = (limitsRight / scale) + 2;
            // 算出上下高度，边界值，边界值处理(由于高度等比放大,这里不进行上下比分割)
            // ---
            limitsUp = height * moreScale;
            limitsDown = height * ( - moreScale );
            // ---
            limitsUp = limitsUp / (2 * scale);
            limitsDown = limitsDown / (2 * scale);
        }

        element.style.webkitTransform = 'scale('+ scale +', '+ scale +')';
        obj = {
            type: type,
            scale: scale,
            limitsLeft: limitsLeft,
            limitsRight: limitsRight,
            limitsUp: limitsUp,
            limitsDown: limitsDown
        };

        return obj;
    }
};
