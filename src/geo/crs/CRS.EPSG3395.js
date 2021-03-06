function getEPSG3395Transform() {
    var m = L.Projection.Mercator,
		r = m.R_MAJOR,
		r2 = m.R_MINOR;
	
	return new L.Transformation(0.5 / (Math.PI * r), 0.5, -0.5 / (Math.PI * r), 0.5);
}

L.CRS.EPSG3395 = L.Util.extend({}, L.CRS, {
	code: 'EPSG:3395',

	projection: L.Projection.Mercator,
	transformation: getEPSG3395Transform()
});