// noinspection DuplicatedCode
VID = {};

// noinspection DuplicatedCode
VID.d_8to24table = new Uint32Array(new ArrayBuffer(1024));

// noinspection DuplicatedCode
VID.SetPalette = function() {
	Sys.DPrint('VID.SetPalette()');

	var palette = COM.LoadFile('gfx/palette.lmp');

	if (palette == null) {
		Sys.Error('Couldn\'t load gfx/palette.lmp');
	}

	var pal = new Uint8Array(palette);
	var i, src = 0;

	// noinspection DuplicatedCode
	for (i = 0; i < 256; ++i) {
		VID.d_8to24table[i] = pal[src] + (pal[src + 1] << 8) + (pal[src + 2] << 16);
		src += 3;
	}
};

// noinspection DuplicatedCode
VID.Init = function() {
	Sys.DPrint('VID.Init()');

	document.getElementById('progress').style.display = 'none';
	GL.Init();
	VID.SetPalette();
};