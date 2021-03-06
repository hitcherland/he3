if(typeof he3 === 'undefined') { he3 = {}; }
he3.colours = {
	HSVtoRGB: function(h, s, v) {
			var r, g, b, i, f, p, q, t;
			if (arguments.length === 1) {
					s = h.s, v = h.v, h = h.h;
			}
			i = Math.floor(h * 6);
			f = h * 6 - i;
			p = v * (1 - s);
			q = v * (1 - f * s);
			t = v * (1 - (1 - f) * s);
			switch (i % 6) {
					case 0: r = v, g = t, b = p; break;
					case 1: r = q, g = v, b = p; break;
					case 2: r = p, g = v, b = t; break;
					case 3: r = p, g = q, b = v; break;
					case 4: r = t, g = p, b = v; break;
					case 5: r = v, g = p, b = q; break;
			}
			return new THREE.Color( r, g, b );
	},
	getSoft: function(hue) {
		saturation = .248;
		value = .902;	
		return this.HSVtoRGB(hue, saturation, value);
	},

	getHard: function(hue) {
		saturation = .496;
		value = .902;	
		return this.HSVtoRGB(hue, saturation, value);
	},

}

he3.colors = he3.colours;
