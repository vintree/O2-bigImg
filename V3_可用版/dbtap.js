function dbtap(element, callback) {
    var isTouchEnd = false,
        lastTime = 0,
        lastTx = null,
        lastTy = null,
        firstTouchEnd = true,
        body = document.body,
        dTapTimer, startTx, startTy, startTime;
    element.addEventListener( 'touchstart', function( e ){
        if( dTapTimer ){
            clearTimeout( dTapTimer );
            dTapTimer = null;
        }
        var touches = e.touches[0];
        startTx = touches.clientX;
        startTy = touches.clientY;
    }, false );
    element.addEventListener( 'touchend', function( e ){
        var touches = e.changedTouches[0],
            endTx = touches.clientX,
            endTy = touches.clientY,
            now = Date.now(),
            duration = now - lastTime;
        // ����Ҫȷ���ܴ������ε� tap �¼�
        if( Math.abs(startTx - endTx) < 6 && Math.abs(startTx - endTx) < 6 ) {
            // ���� tap �ļ��ȷ���� 500 ��������
            if( duration < 301 ){
                // ���ε� tap λ�ú���һ�ε� tap ��λ������һ����Χ�ڵ����
                if( lastTx !== null &&
                    Math.abs(lastTx - endTx) < 45 &&
                    Math.abs(lastTy - endTy) < 45 ){
                    firstTouchEnd = true;
                    lastTx = lastTy = null;
                    //console.log( 'fire double tap event' );
                    callback(e);
                }
            }
            else{
                lastTx = endTx;
                lastTy = endTy;
            }
        }
        else{
            firstTouchEnd = true;
            lastTx = lastTy = null;
        }
        lastTime = now;
    }, false );
// �� iOS �� safari ����ָ�û���Ļ���ٶȹ��죬
// ��һ���ļ��ʻᵼ�µڶ��β�����Ӧ touchstart �� touchend �¼�
// ͬʱ��ָ��ʱ���touch���ᴥ��click
    if( ~navigator.userAgent.toLowerCase().indexOf('iphone os') ){
        body.addEventListener( 'touchstart', function( e ){
            startTime = Date.now();
        }, true );
        body.addEventListener( 'touchend', function( e ){
            var noLongTap = Date.now() - startTime < 501;
            if( firstTouchEnd ){
                firstTouchEnd = false;
                if( noLongTap && e.target === element ){
                    dTapTimer = setTimeout(function(){
                        firstTouchEnd = true;
                        lastTx = lastTy = null;
                        //console.log( 'fire double tap event' );
                        callback(e);
                    }, 400 );
                }
            }
            else{
                firstTouchEnd = true;
            }
        }, true );
// iOS ����ָ����û���Ļʱ���ٶȹ��첻�ᴥ�� click �¼�
        element.addEventListener( 'click', function( e ){
            if( dTapTimer ){
                clearTimeout( dTapTimer );
                dTapTimer = null;
                firstTouchEnd = true;
            }
        }, false );
    }
}
