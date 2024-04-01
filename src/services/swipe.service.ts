export class SwipeService {
    ////////////////// swipe test ///////////////////////
    private _xDown: any;
    private _yDown: any;

    private _rightSwipeFn: any;
    private _leftSwipeFn: any;
    constructor(rightSwipeFn: any, leftSwipeFn:any){
        this._rightSwipeFn = rightSwipeFn;
        this._leftSwipeFn = leftSwipeFn;
    }

    ignoreSwipe = (event: any) => {
        // if some touches come from elements with ignoreswipe class > ignore
        return Array.from(event.touches).some((t: any) => t.target.classList.contains('noswipe'));
    }

    handleTouchStart = (event: any) => {
        if (this.ignoreSwipe(event)) {
            this._xDown = undefined;
            this._yDown = undefined;
            return;
        }

        const firstTouch = event.touches[0];
        this._xDown = firstTouch.clientX;
        this._yDown = firstTouch.clientY;
    }

    handleTouchMove = (event: any) => {
        if (!this._xDown || !this._yDown) {
            return;
        }

        const xUp = event.touches[0].clientX;
        const yUp = event.touches[0].clientY;

        const xDiff = this._xDown - xUp;
        const yDiff = this._yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            /*most significant*/
            if (xDiff > 0) {
                /* left swipe */
                this._leftSwipeFn()
            } else {
                /* right swipe */
                this._rightSwipeFn()
            }
        } else {
            if (yDiff > 0) {
                /* up swipe */
                //console.log('app: up swipe ', true);
            } else {
                /* down swipe */
                //console.log('app: down swipe ', true);
            }
        }

        /* reset values */
        this._xDown = null;
        this._yDown = null;
    }

}