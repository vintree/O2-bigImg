// function bigImg(imgUrl) {};


window.onload = function() {
    var element = document.querySelector('#img');
    var action, scale, type, limitsLeft, limitsRight;
    var changed, target, clienX, clienY, width, height;

    var elX, elY, offsetX, offsetY, screenX, screenY, clientLeft, clientTop;
    // var changedTouch, target, moveClienX, moveClienY;

    dbtap(element, function(e) {
        changed = e.changedTouches[0];
        target = e.target;
        clienX = changed.clientX;
        clienY = changed.clientY;

        if(element.getAttribute('data-bigImg') === '1') {
            element.style.webkitTransition = '-webkit-transform 200ms ease-out';
            element.style.webkitTransform = 'scale(1, 1)';
            element.setAttribute('data-bigImg', '0');
            //action = null;
            //scale = null;
            //type = null;
            //limitsLeft = null;
            //limitsRight = null;
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

        }

        var firstX, firstY, lastX, lastY;

        var diffX = 0,
            diffY = 0;

        var endPositionX;
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

                //console.log(limitsLeft, limitsRight);

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
                            console.log(limitsRight, diffX);
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

                            //var overDiffX = Math.abs(endPositionX - diffX);
                            //if(overDiffX < 20) {
                            //
                            //}
                            //diffX = endPositionX


                        }
                    }

                    lastX = firstX;
                    lastY = firstY;

                } else {
                    lastX = firstX;
                    lastY = firstY;
                }

            }
        }, false);

        element.addEventListener('touchend', function(e) {
            lastX = lastY = null;
        }, false);

    });

    function setScale(element, percentageX, percentageY) {
        var width = element.offsetWidth || element.width,
            height = element.offsetHeight || element.height,
            rectrangle = height / width;

        if(rectrangle < 1) {
            var viewH = window.innerHeight,
                scale = viewH/height;
            element.style.webkitTransition = '-webkit-transform 200ms ease-out';
            element.style.webkitTransform = 'scale('+ scale +', '+ scale +')';
            element.style.webkitTransformOrigin = ' '+ percentageX +' center ';


            var leftWidth = (width * parseInt(percentageX))/100,
                rightWidth = width - leftWidth;

            var limitsLeft = leftWidth * ( scale - 1 ),
                limitsRight = rightWidth * ( 1 - scale );

            limitsLeft = Math.floor(limitsLeft / scale);
            limitsRight = Math.floor(limitsRight / scale) + 5;

            console.log(limitsLeft, limitsRight);

            var obj = {
                scale: scale,
                type: 'HORIZONTAL',
                limitsLeft: limitsLeft,
                limitsRight: limitsRight
            };

            return obj;
        }
    }
};
