if(typeof he3 === 'undefined') { he3 = {}; }
he3.GridBlock = function( blockSize, defaultTexture ) {
    THREE.Mesh.call(
        this,
        new THREE.BoxGeometry( blockSize, blockSize, blockSize, 1, 1, 1),
        new THREE.ShaderMaterial( {
            uniforms: {
                diffuseTexture: { value: defaultTexture },
                mouseOver: { value: 0.0 },
                lineWidth: { value: 0.05 },
                isSelected: { value: 0 },
                liftAmount: { value: 3},
            },
            vertexShader: ' uniform float mouseOver; varying vec2 vUv; void main() { vUv = uv; vec3 pos = position; if(mouseOver > 0.5) { pos += vec3( 0, liftAmount, 0 ); } gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 ); } ',
            fragmentShader: ' varying vec2 vUv; uniform float lineWidth; uniform float mouseOver; uniform float isSelected; uniform sampler2D diffuseTexture; void main() { float limit = 0.5 - lineWidth; float xEdge = abs( vUv.x - 0.5 ); float yEdge = abs( vUv.y - 0.5 ); vec4 color = texture2D( diffuseTexture, vUv ); gl_FragColor = color; } ',
        } ),
    );
}
he3.GridBlock.prototype = Object.create( THREE.Mesh.prototype );
