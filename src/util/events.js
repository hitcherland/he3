if(typeof he3 === 'undefined') { he3 = {}; }
he3.mouseToScreen = function( event ) {
    var X = event.clientX;
    var Y = event.clientY;
    var rect = renderer.domElement.getBoundingClientRect();
   
    var pointerVector = new THREE.Vector2( 
        2 * ( X - rect.left ) / rect.width - 1,
        - 2 * ( Y - rect.top ) / rect.height + 1
    );
    return pointerVector;
};

he3.mouseRaycast = function( objects, event ) {
    var pointerVector = he3.mouseToScreen( event );
    var ray = new THREE.Raycaster();
    ray.setFromCamera( pointerVector, camera );

    return ray.intersectObjects( objects, false );
};

he3.events = {
    __by_uuid: {},
    __by_event: {},
    __events: [],
    __previous_moves: [],
    __still_down: [],

    EventRaycast: function( events, event ) {
        let objects = events.map( e => e.object );
        let interactions = he3.mouseRaycast( objects, event );
        let insides = interactions.map( i => he3.events.__by_uuid[ i.object.uuid ] );
        return insides;
    },

    Event: function( object ) {
        this.object = object;
        this.events = {};
        this.addEvent = function( name, func ) {
            if( typeof this.events[ name ] === "undefined") 
                this.events[ name ] = [];
            this.events[ name ].push( func );
            if( typeof he3.events.__by_event[ name ] === "undefined" ) 
                he3.events.__by_event[ name ] = [ this ];
            else if ( he3.events.__by_event[ name ].indexOf( this ) < 0 )
                he3.events.__by_event[ name ].push( this );
        }

        var this_ = this;
        function __event( name ) {
            return function( ) {
                let e = this_.events[ name ];
                if( typeof e === "undefined" ) return;
                let l = e.length;
                for( let i = 0; i < l; i++ ) {
                    e[ i ].call( this_.object, ...arguments );
                }
                this.last_pos = he3.mouseToScreen( arguments[0] );
            };
        }

        this.pointermove = __event( "pointermove" );
        this.pointermoveinside = __event( "pointermoveinside" );
        this.pointerenter = __event( "pointerenter" );
        this.pointerexit = __event( "pointerexit" );
        this.pointerstillinside = __event( "pointerstillinside" );
        this.pointerdown = __event( "pointerdown" );
        this.pointerdowninside = __event( "pointerdowninside" );
        this.pointerup = __event( "pointerup" );
        this.pointerupinside = __event( "pointerupinside" );
        this.pointerdrag = __event( "pointerdrag" );

        he3.events.__by_uuid[ this.object.uuid ] = this;
        he3.events.__events.push( this );
    },

    addEventListener: function( name, object, func ) { 
        let event = he3.events.__by_uuid[ object.uuid ];
        if( typeof event === "undefined" ) event = new he3.events.Event( object );
        event.addEvent( name, func );
    },

    mousemove: function( event ) { 
        // pointermove
        let events = he3.events.__by_event.pointermove;
        if( typeof events !== "undefined" ) {
            let l = events.length;
            for( let i = 0; i < l; i++ ) {
                events[ i ].pointermove( event );
            }
        }

        // pointerdrag
        let all_events = he3.events.__events;
        let nEvents = all_events.length;
        for( let i = 0; i < nEvents; i++ ) {
            let e = all_events[ i ];
            if( he3.events.__still_down.indexOf( e ) >= 0 ) {
                e.pointerdrag( event );
            }
        }

        // pointer{moveinside,enter,exit,stillinside}
        let insides = he3.events.EventRaycast( all_events, event );
        let nInsides = insides.length;
        for( let i = 0; i < nInsides; i++ ) {
            let inside = insides[ i ];
            inside.pointermoveinside( event );
            let prevIndex = he3.events.__previous_moves.indexOf( inside );
            if( prevIndex >= 0 ) {
                inside.pointerstillinside( event );
                let e = he3.events.__previous_moves.splice( prevIndex, 1);
            } else {
                inside.pointerenter( event  );
            }
        }

        l = he3.events.__previous_moves.length;
        for( let i = 0; i < l; i++ ) {
            he3.events.__previous_moves[ i ].pointerexit( event );
        }
        he3.events.__previous_moves = insides;
    },

    mousedown: function( event ) {
        let events = he3.events.__by_event.pointerdown;
        if( typeof events !== "undefined" ) {
            let l = events.length;
            for( let i = 0; i < l; i++ ) {
                events[ i ].pointerdown( event );
            }
        }

        events = he3.events.__events;
        let insides = he3.events.EventRaycast( events, event );
        let l = insides.length;
        for( let i = 0; i < l; i++ ) {
            let inside = insides[ i ];
            inside.pointerdowninside( event );
        }
        he3.events.__still_down = insides;

    },

    mouseup: function( event ) {
        let events = he3.events.__by_event.pointerup;
        if( typeof events !== "undefined" ) {
            let l = events.length;
            for( let i = 0; i < l; i++ ) {
                events[ i ].pointerup( event );
            }
        }

        events = he3.events.__events;
        let insides = he3.events.EventRaycast( events, event );
        let l = insides.length;
        for( let i = 0; i < l; i++ ) {
            let inside = insides[ i ];
            inside.pointerupinside( event );
        }
        he3.events.__still_down = [];
    },
}

window.addEventListener( 'mousemove', he3.events.mousemove );
window.addEventListener( 'mousedown', he3.events.mousedown );
window.addEventListener( 'mouseup', he3.events.mouseup );
