// function bigImg(imgUrl) {};
window.onload = function() {
    var element = document.querySelector('#img');
    var action, scale, type, limitsLeft, limitsRight;
    var changed, target, clienX, clienY, width, height;

    var elX, elY, offsetX, offsetY, screenX, screenY, clientLeft, clientTop;

    var endLimitsLeft = 0, endLimitsRight, endLimitsTop = 0, endLimitsBottom;

    var types;

    dbtap(element, function(e) {
        changed = e.changedTouches[0];
        target = e.target;
        clienX = changed.clientX;
        clienY = changed.clientY;
        if(element.getAttribute('data-bigImg') === '1') {
            element.style.webkitTransition = '-webkit-transform 200ms ease-out';
            element.style.webkitTransform = 'scale(1, 1)';
            element.setAttribute('data-bigImg', '0');
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

            limitsLeft = null;
            limitsRight = null;

            limitsLeft = action.limitsLeft;
            limitsRight = action.limitsRight;
            limitsUp = action.limitsUp;
            limitsDown = action.limitsDown;

        }

        var firstX, firstY, lastX, lastY;
        // 每次开始偏移量进行初始化
        var diffX = 0,
            diffY = 0;

        var endPositionX, endPositionY;
        element.addEventListener('touchmove', function(e) {
            if(element.getAttribute('data-bigImg') === '1') {
                element.style.webkitTransition = '';

                changedTouch = e.changedTouches[0];
                target = e.target;
                moveClienX = changedTouch.clientX;
                moveClienY = changedTouch.clientY;

                elX = target.x;
                elY = target.y;
                offsetX = target.offsetLeft;
                offsetY = target.offsetTop;
                screenX = changedTouch.screenX;
                screenY = changedTouch.screenY;
                clientLeft = target.clientLeft;
                clientTop = target.clientTop;

                firstX = moveClienX;
                firstY = moveClienY;
                if(lastX && lastY) {

                    var tempDiffX = (firstX - lastX)/scale,
                        tempDiffY = (firstY - lastY)/scale;

                    diffX = diffX + tempDiffX;
                    diffY = diffY + tempDiffY;
                    var caseX, caseY;
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
                        // 在可移动区间
                        // if(diffX < limitsLeft && diffX > limitsRight) {
                        //     if(diffY < limitsUp && diffY > limitsDown) {
                        //         console.log('into');
                        //         element.style.webkitTransform = 'scale('+ scale +', '+ scale +') translate( '+ diffX +'px ,'+ diffY +'px )';
                        //         // 记录最后一次位置
                        //         endPositionY = diffY;
                        //     } else {
                        //         diffY = endPositionY;
                        //         element.style.webkitTransform = 'scale('+ scale +', '+ scale +') translate( '+ diffX +'px ,'+ endPositionY +'px )';
                        //     }
                        //
                        // } else {
                        //     // 检测到边界，去掉多余偏移量
                        //     diffX -= tempDiffX;
                        // }
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
                // console.log(limitsUp, limitsDown, diffY);
                // diffX = tDiffX;
                // diffY = tDiffY;
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
            obj = {};
        element.style.webkitTransition = '-webkit-transform 200ms ease-out';
        element.style.webkitTransformOrigin = ' '+ percentageX +' center ';
        if(rectrangle < 1) {
            scale = viewH/height;
            element.style.webkitTransform = 'scale('+ scale +', '+ scale +')';
            // 算出鼠标点击位置的左右宽度
            leftWidth = (width * parseInt(percentageX))/100;
            rightWidth = width - leftWidth;
            // 算出放大后左右边界值
            limitsLeft = leftWidth * ( scale - 1 );
            limitsRight = rightWidth * ( 1 - scale );
            // 将左右边界值，按比例缩回
            limitsLeft = limitsLeft / scale;
            limitsRight = limitsRight / scale;

            limitsUp = 0;
            limitsDown = 0;

            obj = {
                type: 'HORIZONTAL',
                scale: scale,
                limitsLeft: limitsLeft,
                limitsRight: limitsRight,
                limitsUp: limitsUp,
                limitsDown: limitsDown
            };
            return obj;
        } else if(rectrangle >= 1) {
            scale = viewH/height + 0.5;
            element.style.webkitTransform = 'scale('+ scale +', '+ scale +')';

            leftWidth = (width * parseInt(percentageX))/100;
            rightWidth = width - leftWidth;
            limitsLeft = leftWidth * ( scale - 1 );
            limitsRight = rightWidth * ( 1 - scale );
            limitsLeft = (limitsLeft / scale);
            limitsRight = (limitsRight / scale) + 2;
            // 算出上下高度，边界值，边界值处理
            upHeight = (height * parseInt(percentageY))/100;
            downHeight = height - upHeight;
            // ---
            limitsUp = height * ( 0.5 );
            limitsDown = height * ( -0.5 );
            // ---
            limitsUp = (limitsUp / scale)/2;
            limitsDown = (limitsDown / scale)/2;
            obj = {
                type: 'SYNTHESIZE',
                scale: scale,
                limitsLeft: limitsLeft,
                limitsRight: limitsRight,
                limitsUp: limitsUp,
                limitsDown: limitsDown
            };
            console.log(obj);
            return obj;
        }
    }
};
