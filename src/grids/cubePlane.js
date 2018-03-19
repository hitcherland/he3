if(typeof he3 === 'undefined') { he3 = {}; }
var spheres = [];
he3.CubeDrawer = function( blockSize ) {
    THREE.Group.call( this );
    var boxGeo = new THREE.BoxGeometry( blockSize, blockSize, blockSize, 1, 1, 1);
    var boxEdge = new THREE.EdgesGeometry( boxGeo );
    var boxLine = new THREE.LineSegments(
        boxEdge,
        new THREE.LineBasicMaterial( {
            color:  0x000000,
            transparent: true,
            opacity: 0.1
        } ),
    );
    this.add( boxLine );

    var planeEdge = new THREE.Geometry();
    planeEdge.vertices.push(
        new THREE.Vector3( blockSize / 2, blockSize / 2, 0 ),
        new THREE.Vector3( blockSize / 2, -blockSize / 2, 0 ),
        new THREE.Vector3( -blockSize / 2, -blockSize / 2, 0 ),
        new THREE.Vector3( -blockSize / 2, blockSize / 2, 0 )
    );

    var planeLine = new THREE.LineLoop (
        planeEdge,
        new THREE.LineBasicMaterial( {
            color:  0xFF0000,
            transparent: true,
            opacity: 0.2
        } ),
    );
    this.add( planeLine );

    //var spheres = [];
    var sphereGeo = new THREE.SphereGeometry( 0.2, 32, 32 );
    var sphereMat = new THREE.MeshBasicMaterial( {
        color:  0xFF0000,
        transparent: true,
        opacity: 0.0,
    } );
    var circleGeo = new THREE.CircleGeometry( 0.2, 32 );
    var circleEdge = new THREE.EdgesGeometry( circleGeo );
    var circleMat = new THREE.LineBasicMaterial( {
        color: 0xFF0000,
        opacity: 0.5,
    } );

    for( var i = 0; i < 4; i++ ) {
        var sphere = new THREE.Mesh( sphereGeo, sphereMat );
        var pos = planeEdge.vertices[ i ];
        var circle = new THREE.LineSegments( circleEdge, circleMat );
        circle.lookAt( camera.position );
        sphere.position.set( pos.x, pos.y, pos.z );
        spheres.push( sphere );
        sphere.name = "sphere " + i;
        he3.events.addEventListener( "pointerenter", sphere, function() { 
            if( document.body.style.cursor == "auto" ) document.body.style.cursor = "pointer";
        });
        he3.events.addEventListener( "pointerexit", sphere, function() {
            document.body.style.cursor = "auto";
        });

        he3.events.addEventListener( "pointerdowninside", sphere, function() {
            console.log( "down" );
        });

        he3.events.addEventListener( "pointerupinside", sphere, function() {
            console.log( "up" );
        });

        he3.events.addEventListener( "pointerdrag", sphere, function( event ) {
            var distance = camera.position.distanceTo( this.position );
            var mouseVector = he3.mouseToScreen( event );
            mouseVector = new THREE.Vector3( mouseVector.x, mouseVector.y, 0.5 );
            mouseVector.unproject( camera );
            mouseVector.normalize().multiplyScalar( distance );
            console.log( mouseVector );
            this.position.lerp( mouseVector, 0.8 );
        });

        sphere.add( circle );
        this.add( sphere );
    }
}
he3.CubeDrawer.prototype = Object.create( THREE.Group.prototype );

