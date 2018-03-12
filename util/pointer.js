if(typeof he3 === 'undefined') { he3 = {}; }
he3.PointerEventHandler = function () {
    function check( func ) {
        if ( this.intersection( event.clientX, event.clientY ) ) {
            func( event, this.selectedBlock );
        }
    }

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

    var intersections = ray.intersectObjects( this.children, true );
    if( intersections[0] ) {
        this.selectedBlock = intersections[0].object;
    }
    return intersections[ 0 ] ? intersections[ 0 ] : false;
}

he3.PointerEventHandler.prototype.onPointerMove = function( event ) {};
he3.PointerEventHandler.prototype.onPointerUp = function( event ) {};
he3.PointerEventHandler.prototype.onPointerDown = function( event ) {};
