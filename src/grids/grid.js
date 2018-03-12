if(typeof he3 === 'undefined') { he3 = {}; }

he3.Grid = function( xSegments, ySegments, blockSize ) {
    THREE.Object3D.call( this );
    he3.PointEventHandler.call( this );
    var meshes = [];
    for (var x=-xSegments/2; x<=xSegments/2; x++) {
        for (var y=-ySegments/2; y<=ySegments/2; y++) {
            var mesh = new GridBlock( blockSize );
            mesh.position.set( x * blockSize, 0, y * blockSize);
            this.add ( mesh );
        }
    }
}
he3.Grid.prototype = Object.create( THREE.Object3D.prototype ) 
he3.Grid.prototype.intersection = function( X, Y ) {
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


