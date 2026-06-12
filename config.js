var GAME_CONFIG = {
	PMAX: 7,
	PUT_DICE: 3,
	SIZE: localStorage.getItem('dicewars_size') || 'medium',
	SIZES: {
		small:  { xmax: 18, ymax: 22, area_max: 20, stock_max: 40 },
		medium: { xmax: 28, ymax: 32, area_max: 32, stock_max: 64 },
		large:  { xmax: 34, ymax: 32, area_max: 48, stock_max: 96 },
	},
	CEL_W: 27,
	CEL_H: 18,
	MAX_AREA_MAX: 48,
	MAX_STOCK_MAX: 96,
};

(function() {
	var preset = GAME_CONFIG.SIZES[GAME_CONFIG.SIZE];
	var win_w = window.innerWidth || 840;
	var win_h = window.innerHeight || 840;
	var view_w = Math.round(840 * win_w / win_h);

	// Cap xmax so the grid fits within the canvas with a side margin
	var xmax_cap = Math.floor((view_w - 80) / GAME_CONFIG.CEL_W);

	GAME_CONFIG.XMAX      = Math.min(preset.xmax, xmax_cap);
	GAME_CONFIG.YMAX      = preset.ymax;
	GAME_CONFIG.AREA_MAX  = preset.area_max;
	GAME_CONFIG.STOCK_MAX = preset.stock_max;
	GAME_CONFIG.VIEW_W    = view_w;
}());
