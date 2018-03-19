if(typeof he3 === 'undefined') { he3 = {}; }
he3.PointerEventHandler = function ( object, args ) {
    this.object = object;
    var this_ = this;
    function check( func ) {
        return function( event ) {
            if ( this_.intersection( event.clientX, event.clientY ) ) {
                console.log( event );
                func( event, this_.selected );
            }
        }
    }
    
    if( typeof args === "undefined" ) {
        args = Object.assing( {}, this._defaultArgs );
    } else {
        args = Object.assign( {}, this._defaultArgs, args );
    }

    this.move = args.move
    this.up = args.up;
    this.down = args.down;

    console.log( this.down );

    window.addEventListener( 'mousemove', check( this.onPointerMove ) );
    window.addEventListener( 'mouseup', check ( this.onPointerUp ) );
    window.addEventListener( 'mousedown', check ( this.onPointerDown ) );
}

he3.PointerEventHandler.prototype.intersection = function( X, Y ) {
    var rect = renderer.domElement.getBoundingClientRect();
   
    var pointerVector = new THREE.Vector2( 
        2 * ( X - rect.left ) / rect.width - 1,
        2 * ( Y - rect.top ) / rect.height - 1
    );
    var ray = new THREE.Raycaster();
    ray.setFromCamera( pointerVector, camera );

    var intersections = ray.intersectObjects( [ this.object ] , true );
    if( intersections[0] ) {
        this.selected = intersections[0].object;
    }
    return intersections[ 0 ] ? intersections[ 0 ] : false;
}

he3.PointerEventHandler.prototype.onPointerMove = function( event ) { return this.move( event ); };
he3.PointerEventHandler.prototype.onPointerUp = function( event ) { return this.up( event )};
he3.PointerEventHandler.prototype.onPointerDown = function( event ) { return this.down( event )};
he3.PointerEventHandler.prototype._defaultArgs = {
        move: function() { },
        up  : function() { },
        down: function() { },
}
