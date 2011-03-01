
L.Path = L.Class.extend({
	statics: (function() {
		var svgns = 'http://www.w3.org/2000/svg',
			ce = 'createElementNS';
		
		return {
			SVG_NS: svgns,
			SVG: !!(document[ce] && document[ce](svgns, 'svg').createSVGRect),
			
			// how much to extend the clip area around the map view 
			// (relative to its size, e.g. 0.5 is half the screen in each direction)
			CLIP_PADDING: 0.5
		};
	})(),
	
	options: {
		stroke: true,
		color: '#0033ff',
		weight: 5,
		opacity: 0.5,
		
		fill: false,
		fillColor: null, //same as color by default
		fillOpacity: 0.2
	},
	
	initialize: function(options) {
		L.Util.extend(this.options, options);
	},
	
	onAdd: function(map) {
		this._map = map;
		this._initElements();
		this._updatePath();
	},
	
	onRemove: function(map) {
		map._pathRoot.removeChild(this._container);
	},
	
	setPathString: function(str) {
		this._pathStr = str;
		if (this._path) {
			this._updatePath();
		}
	},
	
	_initElements: function() {
		this._initRoot();
		this._initPath();
		this._initStyle();
	},
	
	_initRoot: function() {
		if (!this._map._pathRoot) {
			this._map._pathRoot = this._createElement('svg');
			this._map._panes.overlayPane.appendChild(this._map._pathRoot);

			this._map.on('moveend', this._updateSvgViewport, this);
			this._updateSvgViewport();
		}
	},
	
	_updateSvgViewport: function() {
		this._updateViewport();
		
		var vp = this._map._pathViewport,
			min = vp.min,
			max = vp.max,
			width = max.x - min.x,
			height = max.y - min.y,
			root = this._map._pathRoot;
	
		root.setAttribute('width', width);
		root.setAttribute('height', height);
		root.setAttribute('viewBox', [min.x, min.y, width, height].join(' '));
		L.DomUtil.setPosition(root, min);
	},
	
	_updateViewport: function() {
		var p = L.Path.CLIP_PADDING,
			size = this._map.getSize(),
			//TODO this._map._getMapPanePos()
			panePos = L.DomUtil.getPosition(this._map._mapPane), 
			min = panePos.multiplyBy(-1).subtract(size.multiplyBy(p)),
			max = min.add(size.multiplyBy(1 + p * 2));
		
		this._map._pathViewport = new L.Bounds(min, max);
	},
	
	_initPath: function() {
		this._container = this._createElement('g');
		
		this._path = this._createElement('path');
		this._container.appendChild(this._path);
		
		this._map._pathRoot.appendChild(this._container);
	},
	
	_initStyle: function() {
		if (this.options.stroke) {
			this._path.setAttribute('stroke-linejoin', 'round');
			this._path.setAttribute('stroke-linecap', 'round');
		}
		if (this.options.fill) {
			this._path.setAttribute('fill-rule', 'evenodd');
		} else {
			this._path.setAttribute('fill', 'none');
		}
		this._updateStyle();
	},
	
	_updateStyle: function() {
		if (this.options.stroke) {
			this._path.setAttribute('stroke', this.options.color);
			this._path.setAttribute('stroke-opacity', this.options.opacity);
			this._path.setAttribute('stroke-width', this.options.weight);
		}
		if (this.options.fill) {
			this._path.setAttribute('fill', this.options.fillColor || this.options.color);
			this._path.setAttribute('fill-opacity', this.options.fillOpacity);
		}
	},
	
	_updatePath: function() {
		this._path.setAttribute('d', this._pathStr);
	},
	
	_createElement: function(name) {
		return document.createElementNS(L.Path.SVG_NS, name);
	}	
});