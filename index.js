// function bigImg(imgUrl) {};
window.onload = function() {
    var element = document.querySelector('#img');
    var action, scale, type, limitsLeft, limitsRight;
    var changed, target, clienX, clienY, width, height;

    var elX, elY, offsetX, offsetY, screenX, screenY, clientLeft, clientTop;

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

                    if(type === 'HORIZONTAL') {
                        // 在可移动区间
                        if(diffX < limitsLeft && diffX > limitsRight) {
                            element.style.webkitTransform = 'scale('+ scale +', '+ scale +') translate( '+ diffX +'px)';
                            // console.log(limitsRight, diffX);
                        } else {
                            // 保存可移动区间边,并判断是否可
                            if(!endPositionX) {
                                if(Math.abs(diffX - limitsLeft) > Math.abs(diffY - limitsRight)) {
                                    endPositionX = limitsRight;
                                } else {
                                    endPositionX = limitsLeft;
                                }
                            }
                            // 抖动效果
                            diffX -= tempDiffX;
                            diffY -= tempDiffY;
                        }
                    } else if(type === 'SYNTHESIZE') {
                        // 在可移动区间
                        if(diffX < limitsLeft && diffX > limitsRight) {
                            if(diffY < limitsUp && diffY > limitsDown) {
                                console.log('into');
                                element.style.webkitTransform = 'scale('+ scale +', '+ scale +') translate( '+ diffX +'px ,'+ diffY +'px )';
                                // 记录最后一次位置
                                endPositionY = diffY;
                            } else {
                                diffY = endPositionY;
                                element.style.webkitTransform = 'scale('+ scale +', '+ scale +') translate( '+ diffX +'px ,'+ endPositionY +'px )';
                            }

                        } else {
                            // 检测到边界，去掉多余偏移量
                            diffX -= tempDiffX;
                        }
                    }
                }
                lastX = firstX;
                lastY = firstY;
            }
        }, false);

        element.addEventListener('touchend', function(e) {
            lastX = lastY = null;
        }, false);

    });

    function setScale(element, percentageX, percentageY) {
        var width = element.offsetWidth || element.width,
            height = element.offsetHeight || element.height,
            rectrangle = height / width,
            viewH = window.innerHeight,
            scale = '',
            leftWidth, rightWidth, upHeight, downHeight,
            limitsLeft, limitsRight,
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
            limitsLeft = Math.floor(limitsLeft / scale);
            limitsRight = Math.floor(limitsRight / scale) + 5;

            obj = {
                scale: scale,
                type: 'HORIZONTAL',
                limitsLeft: limitsLeft,
                limitsRight: limitsRight
            };
            return obj;
        } else if(rectrangle >= 1) {
            scale = viewH/height + 0.5;
            element.style.webkitTransform = 'scale('+ scale +', '+ scale +')';

            leftWidth = (width * parseInt(percentageX))/100;
            rightWidth = width - leftWidth;
            limitsLeft = leftWidth * ( scale - 1 );
            limitsRight = rightWidth * ( 1 - scale );
            limitsLeft = Math.floor(limitsLeft / scale);
            limitsRight = Math.floor(limitsRight / scale) + 5;

            // 算出上下高度，边界值，边界值处理
            upHeight = (height * parseInt(percentageY))/100;
            downHeight = height - upHeight;
            // ---
            limitsUp = height * ( 0.5 );
            limitsDown = height * ( -0.5 );
            // ---
            limitsUp = Math.floor(limitsUp / scale)/2;
            limitsDown = Math.floor(limitsDown / scale)/2;

            obj = {
                scale: scale,
                type: 'SYNTHESIZE',
                limitsLeft: limitsLeft,
                limitsRight: limitsRight,
                limitsUp: limitsUp,
                limitsDown: limitsDown
            };
            return obj;
        }
    }
};
