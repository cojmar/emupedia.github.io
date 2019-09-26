

/////////////////////////////////////////////////////


function xp_Export(buf32,width,height,filename)
{
	var pal = new Uint8Array(
	[
		0,  0,  0,    255,
		170,  0,  0,  255,
		0,170,  0,    255,
		170, 85,  0,  255,
		0,  0,170,    255,
		170,  0,170,  255,
		0,170,170,    255,
		170,170,170,  255,
		85, 85, 85,   255,
		255, 85, 85,  255,
		85,255, 85,   255,
		255,255, 85,  255,
		85, 85,255,   255,
		255, 85,255,  255,
		85,255,255,   255,
		255,255,255,  255,			

		// reflection: lower contrast + some blue
		32,  32,  32+32, 255,			
		128,  32,  32+32, 255,			
		32,128,  32+32, 255,			
		128, 64,  32+32, 255,			
		32,  32,128+32, 255,			
		128,  32,128+32, 255,			
		32,128,128+32, 255,			
		128,128,128+32, 255,			
		64, 64, 64+32, 255,			
		192, 64, 64+32, 255,			
		64,192, 64+32, 255,			
		192,192, 64+32, 255,			
		64, 64,192+32, 255,			
		192, 64,192+32, 255,			
		64,192,192+32, 255,			
		192,192,192+32, 255,
	]);

	var size = 16 + width*height*10; // ver,layers,width,height, width*height*(code,fg_rgb,bg_rgb)
	
	var xp = new Uint8Array(size);
	
	xp[0] = 0xff; xp[1] = 0xff; xp[2] = 0xff; xp[3] = 0xff;
	xp[4] = 1;    xp[5] = 0;    xp[6] = 0;    xp[7] = 0;    
	
	xp[8] = (width>>0)&0xff;
	xp[9] = (width>>8)&0xff;
	xp[10]= (width>>16)&0xff;
	xp[11]= (width>>24)&0xff;
	
	xp[12]= (height>>0)&0xff;
	xp[13]= (height>>8)&0xff;
	xp[14]= (height>>16)&0xff;
	xp[15]= (height>>24)&0xff;
	
	var ofs = 16;
	for (var x=0; x<width; x++)
	{
		for (var y=0; y<height; y++)
		{
			var cell = buf32[x+width*y];
			
			var gl = cell & 0xFF;
			var fg = (cell >> 16) & 0xFF;
			var bg = (cell >> 24) & 0xFF;
			fg<<=2;
			bg<<=2;
			
			xp[ofs+0] = cell & 0xFF;
			xp[ofs+1] = 0;
			xp[ofs+2] = 0;
			xp[ofs+3] = 0;
			
			xp[ofs+4] = pal[fg+0];
			xp[ofs+5] = pal[fg+1];
			xp[ofs+6] = pal[fg+2];
			
			xp[ofs+7] = pal[bg+0];
			xp[ofs+8] = pal[bg+1];
			xp[ofs+9] = pal[bg+2];
			
			ofs+=10;
		}
	}
	
	var blob = new Blob([xp], {type: "octet/stream"});
	
    var a = document.createElement("a");
    a.style = "display: none";
	a.href = window.URL.createObjectURL(blob);
	a.download = filename;
    document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	
}


var recorder_frame = 0;
var recorder = null; // new JSZip();
var recorder_dt = 0;

function Record(buf32,width,height,dt)
{
	if (recorder)
	{
		// dt is given in num of frames at 60 fps
		
		recorder_dt += dt;
		var frames = Math.round(recorder_dt/2) | 0;
		
		if (frames>0)
		{
			recorder_dt -= frames*2;
			var data = new Uint32Array(3+width*height);
			data[0]=width;
			data[1]=height;
			data[2]=dt;
			
			var n=width*height;
			for (var i=0; i<n; i++)
				data[i+3]=buf32[i];
				
			while (frames>0)
			{
				var name = ""+recorder_frame;
				while (name.length < 5)
					name = "0"+name;
				recorder.file("rec_"+name, data.buffer);
				recorder_frame++;
				frames--;
			}
		}
	}
}

function StartRecorder()
{
	if ( recorder_frame === 0 && recorder === null)
		recorder = new JSZip();
}

function IsRecording()
{
	if (recorder !== null)
		return 1;
	if (recorder_frame < 0)
		return 2;
	return 0;
}

function GetRecordedFrames()
{
	return recorder_frame;
}

function StopRecorder(filename)
{
	if (recorder)
	{
		recorder.generateAsync({type:"blob",compression:"DEFLATE"})
		.then(function(content) {
		
			var filename = prompt("Save Recording", "rec.zip");
			if (filename !== null)
			{
				var a = document.createElement("a");
				a.style = "display: none";
				a.href = window.URL.createObjectURL(content);
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			}
			recorder_frame = 0;
		});
	
		recorder_dt = 0;
		recorder_frame = -1;
		recorder = null;
	}
}
