window['ak_World'] = function(lib,rng,smooth) 
{
	var this_smooth = smooth;
	var this_depth = -1;
	var this_ofs_x = 0;
	var this_ofs_y = 0;
	var this_root = -1;
	var this_pool = -1;
	var this_data = new Int32Array(1*(0x8));
	var this_size = 0;
	var this_count = 0;
	var this_leafs = 0;
	var this_sprites = 0;
	
	var this_library = lib;
	
	var this_map = null;
	var this_lit = null;
	var this_clr = null;
	
	var this_queue = new Uint32Array(5000); 
	var this_queue_pos = 0;
	var this_queue_len = 0;
	
	var this_map_w = 0;
	var this_map_h = 0;
	
	var this_tile_to_map = 0;
	var this_water=0;
	
	var this_box = new Int32Array(6);
	
	function SampleMapHeight(x,y)
	{
		if (x<0 || x>=this_map_w || y<0 || y>=this_map_h)
			return this_water;
	
		var fx = x;
		var fy = y;
		var x0 = fx | 0;
		var y0 = fy | 0;
		var x1 = x0+1;
		var y1 = y0+1;
		var wx = x1-fx;
		var wy = y1-fy;
		
		x0 = x0<0 ? 0:x0;
		x0 = x0>=this_map_w ? this_map_w-1:x0;
		x1 = x1<0 ? 0:x1;
		x1 = x1>=this_map_w ? this_map_w-1:x1;
		y0 = y0<0 ? 0:y0;
		y0 = y0>=this_map_h ? this_map_h-1:y0;
		y1 = y1<0 ? 0:y1;
		y1 = y1>=this_map_h ? this_map_h-1:y1;
		
		var h00 = this_map[x0+y0*this_map_w];
		var h01 = this_map[x1+y0*this_map_w];
		var h10 = this_map[x0+y1*this_map_w];
		var h11 = this_map[x1+y1*this_map_w];
		
		var h0 = wx*h00 + (1.0-wx)*h01;
		var h1 = wx*h10 + (1.0-wx)*h11;
		
		var h = wy*h0 + (1.0-wy)*h1;
		
		return h;
	}
	
	
	function DecalCircle(cx,cy,rad,decal)
	{
		var dec_w = this_smooth*this_map_w;
		var dec_h = this_smooth*this_map_h;
	
		for (var y=cy-rad; y<=cy+rad; y++)
		{
			var ry = y-cy;
			var rx = Math.sqrt(rad*rad-ry*ry);
			for (var x=cx-rx; x<=cx+rx; x++)
			{
				var i = (x|0)+(y|0)*dec_w;
				this_clr[i] = decal;
			}
		}
	}
	
	function DecalRect(cx,cy,rx,ry,ang,decal, above)
	{
		var dec_w = this_smooth*this_map_w;
		var dec_h = this_smooth*this_map_h;
		
		if (ang===0)
		{
			for (var y=cy-ry; y<=cy+ry; y++)
			{
				for (var x=cx-rx; x<=cx+rx; x++)
				{
					var i = (x|0)+(y|0)*dec_w;
					this_clr[i] = decal;
				}
			}
			
			return;
		}
		
		ang = ang*Math.PI/180;
		var nrm = Math.sqrt(2.001);
		var sub = 1.0/nrm;
		var dxx = Math.cos(ang)*sub;
		var dxy = Math.sin(ang)*sub;
		var dyx = -dxy;
		var dyy = dxx;
		
		for (var y=-ry*nrm; y<=+ry*nrm; y++)
		{
			for (var x=-rx*nrm; x<=+rx*nrm; x++)
			{
				var u = Math.round(x*dxx + y*dxy) + cx;
				var v = Math.round(x*dyx + y*dyy) + cy;
				
				if (SampleMapHeight(u/smooth,v/smooth)>above)
				{
					var i = (u|0)+(v|0)*dec_w;
					this_clr[i] = decal;
				}
			}
		}
	}
	
	// scoped to release lib_* references after initialization
	{
		var lib_images = lib['images'];
		var lib_terrain = lib['terrain'];
		var lib_terrain_img = lib_terrain['img'];
		var lib_images_len = lib_images['length'];
		
		this_tile_to_map = lib_terrain['tile'] | 0;
		this_water = lib_terrain['water'] | 0;
		
		// let's convert map to internal thing
		if (lib_images && lib_terrain && lib_terrain_img>=0 && 
			this_tile_to_map>0 && this_tile_to_map<=100 && 
			lib_terrain_img<lib_images_len)
		{
			var obj = lib_images[lib_terrain_img]['img'];
			if (obj)
			{
				var w = obj['naturalWidth'] | 0;
				var h = obj['naturalHeight'] | 0;
				if (w!==0 && h!==0)
				{
					var canvas = document.createElement('canvas');
					var context = canvas.getContext('2d');
					context.globalCompositeOperation = 'copy';

					canvas.width  = w;
					canvas.height = h;
					
					context.drawImage(obj, 0, 0);
					
					var rgba = context.getImageData(0,0,w,h).data;
					if (rgba)
					{
						this_map_w = w;
						this_map_h = h;
						this_map = new Uint16Array(this_map_w*this_map_h);
						this_lit = new Uint8Array(this_map_w*this_map_h*smooth*smooth);
						this_clr = new Uint8Array(this_map_w*this_map_h*smooth*smooth);
						
						// under water shades:
						// store planar distance to water/ground edge
						
						
						var ss = 1.0/(smooth*smooth);
						for (var y=0, i=0; y<h; y++)
						{
							for (var x=0; x<w; x++,i++)
							{
								var j = (x+y*w)*4;
								var hh = (rgba[j+2]*0.5)| 0;
								this_map[i] = hh;
								
								if (this_map[i]<=this_water && this_map[i]>2)
									this_map[i]-=1+((x^y)&1);
																	
								// filter shading
								var s00 = rgba[j+0];
								var s01 = rgba[j+0+4];
								var s10 = rgba[j+0+this_map_w*4];
								var s11 = rgba[j+0+4+this_map_w*4];
								
								var d00 = rgba[j+1];
								var d01 = rgba[j+1+4];
								var d10 = rgba[j+1+this_map_w*4];
								var d11 = rgba[j+1+4+this_map_w*4];
								
								for (var sy=0; sy<this_smooth; sy++)
								{
									var s0 = s00*(this_smooth-sy)+s10*sy;
									var s1 = s01*(this_smooth-sy)+s11*sy;
									var d0 = d00*(this_smooth-sy)+d10*sy;
									var d1 = d01*(this_smooth-sy)+d11*sy;
									for (var sx=0; sx<this_smooth; sx++)
									{
										var q = (this_smooth*x + sx) + (this_smooth*y + sy) * this_smooth * this_map_w;
										var s = ((s0*(this_smooth-sx) + s1*sx)*ss)|0;
										var d = ((d0*(this_smooth-sx) + d1*sx)*ss)|0;
										
										if (d>0)
											this_lit[q] = d; // underwater distance
										else
											this_lit[q] = s;
									}
								}

								// todo: water distance map
								// currently baked into image!

								
							}
						}
 						
						// let's try to generate shading from heightmap
						/*
						var lx = -1;
						var ly = 0;
						var lz = 0.1;
						
						var ln = 1.0/Math.sqrt(lx*lx+ly*ly+lz*lz);
						lx*=ln;
						ly*=ln;
						lz*=ln;

						var dj = this_smooth*this_map_w;
						for (var y=0, i=0; y<h-1; y++)
						{
							for (var x=0; x<w-1; x++,i++)
							{
								var z = this_map[i];
								var vx = z-this_map[i+1];
								var vy = z-this_map[i+this_map_w];
								var vz = 1;
								var vn = 1.0/Math.sqrt(vx*vx+vy*vy+vz*vz);
								vx*=vn;
								vy*=vn;
								vz*=vn;
								
								var light = ((vx*lx+vy*ly+vz*lz)*127+128)|0;
								
								var j =  x*smooth+y*this_map_w*smooth;
								for (var sy=0; sy<this_smooth; sy++, j+=dj)
								{
									var k=j;
									for (var sx=0; sx<this_smooth; sx++,k++)
									{
										this_lit[k] = light;
									}
								}
							}
						}
						
						// filter out a bit
						for (var y=0, i=0; y<h-1; y++)
						{
							for (var x=0; x<w-1; x++,i++)
							{
								var light = 0;
								var norm = 0;
								for (var ky=-smooth; ky<=smooth; ky++)
								{
									var iy = y+ky;
									if (iy<0)
										iy=0;
									if (iy>=this_map_h)
										iy=this_map_h-1;
									for (var kx=-smooth; kx<=smooth; kx++)
									{
										var ix = x+kx;
										if (ix<0)
											ix=0;
										if (ix>=this_map_w)
											ix=this_map_w-1;
											
										light+=this_lit[ix+iy*this_map_w];
										norm++;
									}
								}
								
								this_lit[x+y*this_map_w] = light/norm;
							}
						}
						*/
						

						var dec_w = this_smooth*this_map_w;
						var dec_h = this_smooth*this_map_h;
						
						// tall & short green circles
						for (var num=0; num<100000; num++)
						{
							var rad = this_smooth*2*((rng.next/*Math.random*/()*5)|0) + 1;
							var cx = rng.next/*Math.random*/()*(dec_w-2*rad) + rad;
							var cy = rng.next/*Math.random*/()*(dec_h-2*rad) + rad;
							
							var decal = ((rng.next/*Math.random*/()*2)|0) << 1;

							DecalCircle(cx,cy,rad,decal);
						}
						
						// rectangular farm fields
						for (var num=0; num<100; num++)
						{
							var rad_x = this_smooth*4*(((rng.next/*Math.random*/()*3) + 1)|0);
							var rad_y = this_smooth*4*(((rng.next/*Math.random*/()*3) + 1)|0);
							var ang = rng.next()*180;
							var rad = Math.max(rad_x,rad_y);
							var cx = rng.next/*Math.random*/()*(dec_w-2*rad) + rad;
							var cy = rng.next/*Math.random*/()*(dec_h-2*rad) + rad;
							DecalRect(cx,cy,rad_x,rad_y,ang,0, 0);
							DecalRect(cx,cy,rad_x-3,rad_y-3,ang,/*2*/3, this_water+3);
						}
						
						// analyse depth gradients
						// if above some threshold, replace decal & shading to rock
						// note: map.png should not introduce any rocks, map2.png should have plenty of them!
						// note: we should post-preocess rocks to show vertical silhouetted!
						// ...
						
						var is = 1.0/this_smooth;
						
						for (var y=0,i=0; y<dec_h; y++)
						{
							for (var x=0; x<dec_w; x++,i++)
							{
								var u = x*is;
								var v = y*is;
								
								var h00 = SampleMapHeight(u,v);
								var h01 = SampleMapHeight(u+is,v);
								var h10 = SampleMapHeight(u,v+is);
								var h11 = SampleMapHeight(u+is,v+is);
								
								var hmin = Math.min(h00,h01);
								hmin = Math.min(hmin,h10);
								hmin = Math.min(hmin,h11);
								
								var hmax = Math.max(h00,h01);
								hmax = Math.max(hmax,h10);
								hmax = Math.max(hmax,h11);
								
								if ( hmax-hmin > 2)
								{
									// dilate to samples above
									for (var qy=-3; qy<=3; qy++)
										for (var qx=-3; qx<=3; qx++)
										{
											if (x+qx>=0 && x+qx<dec_w && y+qy>=0 && y+qy<dec_h)
												if (qx===0 && qy===0 || SampleMapHeight(u+qx*this_smooth,v+qy*this_smooth) > h00)
												{
													if (this_clr[i+qx+qy*dec_w] != 1)
													{
														this_clr[i+qx+qy*dec_w] = 1;
														this_lit[i+qx+qy*dec_w] = 64;
													}
												}
										}
											
									if (hmin>this_water)
									{
										// calc lit
										
										var tu = (u - (u|0));
										var tv = (v - (v|0));
										
										var tuz /*(tv)*/ = ( 1.0 - tv ) * (h10 - h00) + tv * (h11 - h01);
										var tvz /*(tu)*/ = ( 1.0 - tu ) * (h01 - h00) + tu * (h11 - h10);
										
										var len = Math.sqrt(tuz*tuz+tvz*tvz);
										var nx = (tuz - tvz)/len;

										nx = nx*0.5+0.5;
									
										this_lit[i] = rng.next()*32 + nx*48 + 32 /*+ 64-32*/;
									}	
								}
							}
						}
						
						
						console.time('inserting');
						
						var x_tiles = ((this_map_w-1)/this_tile_to_map) | 0;
						var y_tiles = ((this_map_h-1)/this_tile_to_map) | 0;
						
						for (var y=0; y<y_tiles; y++)
						{
							for (var x=0; x<x_tiles; x++)
							{
								InsertTile(x,y);
							}
						}
						
						console.timeEnd('inserting');
					}
				}
			}
		}
	}
	
	function SetLight(lx,ly,lz, planes)
	{
		var ln = 1.0/Math.sqrt(lx*lx+ly*ly+lz*lz);
		var dj = this_smooth*this_map_w;
		
		var sm_w = this_smooth*this_map_w;
		var sm_h = this_smooth*this_map_h;
	
		function cb(tx,ty,tn)
		{
			lx*=ln;
			ly*=ln;
			lz*=ln;
			
			var x0 = tx*this_tile_to_map;
			var y0 = ty*this_tile_to_map;
			var x1 = x0+this_tile_to_map;
			var y1 = y0+this_tile_to_map;
			
			for (var y=y0; y<y1; y++)
			{
				for (var x=x0; x<x1; x++)
				{
					var i = x+y*this_map_w;
					var z = this_map[i];
					var vx = z-this_map[i+1];
					var vy = z-this_map[i+this_map_w];
					var vz = 1;
					var vn = 1.0/Math.sqrt(vx*vx+vy*vy+vz*vz);
					vx*=vn;
					vy*=vn;
					vz*=vn;
					
					var light = ((vx*lx+vy*ly+vz*lz)*127+128)|0;
					
					// scatter
					var j =  x*this_smooth+y*this_smooth*sm_w;
					this_lit[j] = light;
				}
			}
			
			// filter out a bit & replicate
			x0*=this_smooth;
			x1*=this_smooth;
			y0*=this_smooth;
			y1*=this_smooth;

			var norm = 1/9.0;
			
			for (var y=y0; y<y1; y+=this_smooth)
			{
				for (var x=x0; x<x1; x+=this_smooth)
				{
					// gather
					var light = 0;
					for (var ky=-this_smooth; ky<=this_smooth; ky+=this_smooth)
					{
						var iy = y+ky;
						if (iy<0)
							iy=0;
						if (iy>=sm_h)
							iy=sm_h-1;
						for (var kx=-this_smooth; kx<=this_smooth; kx+=this_smooth)
						{
							var ix = x+kx;
							if (ix<0)
								ix=0;
							if (ix>=sm_w)
								ix=sm_w-1;
								
							light+=this_lit[ix+iy*sm_w];
							//norm++;
						}
					}
					
					light = (light*norm)|0;
					
					var j =  x+y*sm_w;
					
					for (var sy=0; sy<this_smooth; sy++, j+=sm_w)
					{
						var k=j;
						for (var sx=0; sx<this_smooth; sx++,k++)
						{
							this_lit[k] = light;
						}
					}
					
				}
			}
		}
		
		QueryHull(planes,cb);
	}
	
	function GetMapShade(x,y)
	{
		return this_lit[this_smooth*(x+this_map_w*y*this_smooth)];
	}
	
	function GetMapDecal(x,y)
	{
		return this_clr[this_smooth*(x+this_map_w*y*this_smooth)];
	}
	
	
	function DecMapDecal(x,y)
	{
		//return;
		
		x=(x*this_smooth)|0;
		y=(y*this_smooth)|0;
	
		for (var dy=y-1; dy<=y+1; dy++)
		{
			if (dy<0)
				continue;
			if (dy>=this_map_h*this_smooth)
				break;
			for (var dx=x-1; dx<=x+1; dx++)
			{
				if (dx<0)
					continue;
				if (dx>=this_map_w*this_smooth)
					break;
				var i = dx+this_map_w*this_smooth*dy;
				var d = this_clr[i];
				
				if (d>1/*0*/ && d<=64)
				{
					// first swap current with ranommly selected ahead sample
					
					//if (d&1)
					{
						var j = this_queue[this_queue_pos];
						this_queue[this_queue_pos]=i;
							
						this_queue_pos ++;
						if (this_queue_pos === this_queue.length)
							this_queue_pos = 0;
						else	
						{
							if (this_queue_len < this_queue.length)
								this_queue_len ++;
							else
								this_clr[j] -= 2;
						}

					}
					this_clr[i] += 2;
				}
			}
		}
	}
	
	function _GetTileRange(x,y)
	{
		var lo = 65536;
		var hi = 0;
		var i = this_tile_to_map*(x+this_map_w*y);
		for (var v=0; v<=this_tile_to_map; v++)
		{
			for (var u=0; u<=this_tile_to_map; u++)
			{
				var h;
				h = this_map[i+u];
				lo = h < lo ? h : lo;
				hi = h > hi ? h : hi;
			}

			i+=this_map_w;
		}
		
		// if this is boundary patch
		// set its min val to 0
		// it makes query work correctly if we want to draw world's boundary
		
		var x_tiles = ((this_map_w-1)/this_tile_to_map) | 0;
		var y_tiles = ((this_map_h-1)/this_tile_to_map) | 0;
		
		if (x<=0 || y<=0 || x>=x_tiles-1 || y>=y_tiles-1)
			lo=0;
		
		return lo | (hi<<16);
	}
	
	function _GetSpriteBox(id,state,box)
	{
		// read it from lib?
		this_library['sprites'][id]['getBox'](state,box);
	}
	
	function GetMapHeight(x,y)
	{
		return this_map[x+y*this_map_w];
	}
	
	function _Free(n)
	{
		var arr = this_data;
		var idx = n*(0x8);
		arr[idx+4] = this_pool;
		this_pool = n;
		this_count--;
	}
	
	function _Alloc(a,b,c,d,e,f,g,h)
	{
		var arr = this_data;
		var ret;
		var idx;
		
		if (this_pool!==-1)
		{
			ret = this_pool;
			idx = ret*(0x8);
			this_pool = arr[idx+4];
		}
		else
		{
			ret = this_size;
			idx = ret*(0x8);
			this_size++;
			if (this_size*(0x8)>arr.length)
			{
				console.log('resizing to ' + 2*arr.length*4 + ' bytes');
				arr = new Int32Array(2*arr.length);
				arr.set(this_data);
				this_data = arr;
			}
		}

					    // BRANCH:  | LEAF:   | SPRITE:			  | POOL:
					    // ---------+---------+-------------------+----------------------
		arr[idx+0]=a|0; // child[0] | tile_id | sprite_id         |
		arr[idx+1]=b|0; // child[1] | base_h  | frame<<16 | angle |
		arr[idx+2]=c|0; // child[2] | style   | next (co-owner)   |
		arr[idx+3]=d|0; // child[3] | sprites | prev (co-owner)   |
		arr[idx+4]=e|0; // parent   | parent  | owner (leaf tile) | next_in_pool (void*)
		arr[idx+5]=f|0; // hMin	    | hMin    | x                 |
		arr[idx+6]=g|0; // hMax     | hMax    | y                 |
		arr[idx+7]=h|0; // --- spritebits --- | z                 |
		
	/*
		NEW:
					    // BRANCH:  | LEAF:   | SPRITE:			  | POOL:
					    // ---------+---------+-------------------+----------------------
		arr[idx+0]=a|0; // child[0] | X(const)| sprite_id / inst  |
		arr[idx+1]=b|0; // child[1] | Y(const)| frame<<16 | angle |
		arr[idx+2]=c|0; // child[2] | sprHead | next (co-owner)   |
		arr[idx+3]=d|0; // child[3] | sprTail | prev (co-owner)   |
		arr[idx+4]=e|0; // parent   | parent  | owner (leaf tile) | next_in_pool (void*)
		arr[idx+5]=f|0; // xMinMax  | xMinMax | x                 |
		arr[idx+6]=g|0; // yMinMax  | yMinMax | y                 |
		arr[idx+7]=h|0; // zMinMax  | zMinMax | z                 |
		
		NOTES ON MOVING TO WORLD EDITOR PHASE
		
		- we should separate LEAFS allocation lists from { BRANCHES & SPRITES }
		- they need supporting map data, their sizes are quite different!
		
		- ok, final mod is to merge X(const), Y(const) into single field
		(we could even limit'em to bytes! as data image size (smooth=4, tilesize=6) would be : (256*24)*(256*24)*4ch = 150,994,944 bytes
		but for thin and long worlds we better keep'em 15bits :) 
		
		- after merging, free slot should be used for data-map index or offset
		so allocating every single tile should allocate its own data submap!
		note: height sub-map must replicate edge values from neighbors!
		it should speed up memory accesses in linear-scan way too, thankx to better locality
		
		- as there are no triangles spanned over different tiles we dont need cross-tile filtering, great!
		
		
		
		notes:
		----------------------------------------------------------------------------------------
		- sprite_id may refer to 'fixed' sprite or more 'complex' object instance 
		- tile's XY can be used to simplify _Update (for d===0 it needs xy)
		- sprite's x,y are relative to tile's xy center! expressed in 1/256 of tile size
		- sprite's z is absolute value expressed in height units
		- xMinMax & yMinMax:
		  they are packed as (max<<16 | min) 
		  unsigned 16bits values expressed 1/256 of tile size (round-up!)
		  they specify how much contained sprites exceed given block 
		- zMinMax are absolute, 
		  they are packed as (max<<16 | min) 
		  unsigned 16bits values expressed directly in height units
		  they specify lo & hi height limits accumulated for both terrain & contained sprites
		  
		so: sprite xy radius must not exceed 256 tiles 
		    tile size should not exceed 256 chars (otherwise sprite position may lack precision)
			absolute height range is (0-65535) chars - same as rendering engine. :)
		----------------------------------------------------------------------------------------
	*/
		
		this_count++;

		return ret;
	}
	
	function _Update(n,d)
	{
		// note: if d>0 all n's descendants must be up to date!
		var arr = this_data;
		
		if (d===0)
		{
			var idx = n*(0x8);
	
			var x = arr[idx+0];
			var y = arr[idx+1];
			arr[idx+7] = _GetTileRange(x,y);
			
			// iterate over sprites,

			var spr = arr[idx+2]; // head
			
			var xMin=0, xMax=256;
			var yMin=0, yMax=256;
			var zMin=arr[idx+7]&0xFFFF, zMax=(arr[idx+7]>>16)&0xFFFF;
			
			while (spr!==-1)
			{
				var sidx = spr*(0x8);
			
				var sprite_id = arr[sidx+0];
				var state = arr[sidx+1];
				
				// temporarily until house has no getBox implementation
				
				// xmin,xmax,ymin,ymax,zmin,zmax
				_GetSpriteBox(sprite_id,state,this_box);
				
				// add instance relative position
				this_box[0] += arr[sidx+5];
				this_box[1] += arr[sidx+5];
				this_box[2] += arr[sidx+6];
				this_box[3] += arr[sidx+6];
				this_box[4] += arr[sidx+7];
				this_box[5] += arr[sidx+7];
				
				// accum
				xMin = xMin < this_box[0] ? xMin : this_box[0];
				xMax = xMax > this_box[1] ? xMax : this_box[1];
				yMin = yMin < this_box[2] ? yMin : this_box[2];
				yMax = yMax > this_box[3] ? yMax : this_box[3];
				zMin = zMin < this_box[4] ? zMin : this_box[4];
				zMax = zMax > this_box[5] ? zMax : this_box[5];
				
				spr = arr[sidx+2]; // next
			}
			
			// convert limits to extends
			xMin = -xMin;
			xMax -= 256;
			yMin = -yMin;
			yMax -= 256;
			
			if (zMin<0)
				zMin=0;
			if (zMax>65535)
				zMax=65535;
			
			// write to leaf
			arr[idx+5] = xMin | (xMax<<16);
			arr[idx+6] = yMin | (yMax<<16);
			arr[idx+7] = zMin | (zMax<<16);
			
			d++;
			n = arr[idx+4];
		}
		
		var step = 1<<(d-1); // needed to accumulate sprite boundaries
		
		// remove unneeded ancestors
		while (n!==-1)
		{
			var idx = n*(0x8);
			if (arr[idx+0]===-1 && arr[idx+1]===-1 && arr[idx+2]===-1 && arr[idx+3]===-1)
			{
				var p = arr[idx+4];
				if (p!==-1)
				{
					var pidx = p*(0x8);
					for (var i=0; i<4; i++)
					{
						if (arr[pidx+i]===n)
							arr[pidx+i]=-1;
					}
					_Free(n);
				}
				else
				{
					// kill the root!
					this_root = -1;
					this_depth = -1;
					this_ofs_x = 0;
					this_ofs_y = 0;
					_Free(n);
					return;
				}

				n=p;
				step<<=1;
			}
			else
				break;
		}
		
		// update ancestor's intervals
		while (n!==-1)
		{
			var idx = n*(0x8);
			
			var hMin=65535;
			var hMax=0;
			//arr[idx+5] = arr[idx+6] = 0;
			
			var sprite_bits=0;
		
			for (var i=0; i<4; i++)
			{
				var c = arr[idx+i];
				if (c!==-1)
				{
					var jdx = c*(0x8);
					
					var r = arr[jdx+7];
					var lo = r&0xFFFF;
					var hi = (r>>16)&0xFFFF;
					hMin = hMin < lo ? hMin : lo;
					hMax = hMax > hi ? hMax : hi;
					
					sprite_bits |= arr[jdx+5] | arr[jdx+6];
				}
			}
			
			arr[idx+7] = hMin|(hMax<<16);

			if (sprite_bits!==0)
			{
				var c,jdx;
				var minx=0, maxx=0, miny=0, maxy=0, maxz=0;
				
				// mul step by inverse of xy_frac
				var xy_step = step*256;

				for (var i=0; i<4; i++)
				{
					c = arr[idx+i]; // LL
					if (c!==-1)
					{
						jdx = c*(0x8);
						if ((arr[jdx+5] | arr[jdx+6]) !== 0)
						{
							var nx = arr[jdx+5]&0xFFFF;
							var px = (arr[jdx+5]>>16)&0xFFFF;
							var ny = arr[jdx+6]&0xFFFF;
							var py = (arr[jdx+6]>>16)&0xFFFF;
							
							if (i&1)
								nx -= xy_step;
							else
								px -= xy_step;
							
							if (i&2)
								ny -= xy_step;
							else
								py -= xy_step;
							
							minx = nx > minx ? nx : minx;
							maxx = px > maxx ? px : maxx;
							miny = ny > miny ? ny : miny;
							maxy = py > maxy ? py : maxy;
						}									
					}
				}
				
				arr[idx+5] = minx | (maxx<<16);
				arr[idx+6] = miny | (maxy<<16);
			}
			else
			{
				arr[idx+5] = 0;
				arr[idx+6] = 0;
			}
			
			n = arr[idx+4];
			step<<=1;
		}
		
		// remove unneeded roots
		n = this_root;
		var idx = n*(0x8);
		while (this_depth>0)
		{
			var ch=-1;
			var j;
			for (var i=0; i<4; i++)
			{
				if (arr[idx+i]!==-1)
				{
					if (ch===-1)
					{
						j=i;
						ch=arr[idx+i];
					}
					else
						return;
				}
			}
			
			// free root & reoffset
			this_root = ch;
			idx = ch*(0x8);
			arr[idx+4]=-1;
			this_depth--;
			
			step = 1<<this_depth;
			
			if (j&1)
				this_ofs_x -= step;
			if (j&2)
				this_ofs_y -= step;
			
			_Free(n);
			n=ch;
		}
	}
	
	function Lookup(x,y)
	{
		x = (x|0) + this_ofs_x;
		y = (y|0) + this_ofs_y;
	
		var d = this_depth;
		var node = this_root;
		
		var arr = this_data;
		
		while (d && node!==-1)
		{
			d--;
			var idx = node*(0x8);
			var ch = ((x>>d)&1) | (((y>>d)&1)<<1);
			node = arr[idx+ch];
		}
		
		return node;
	}
	
	function _QueryRay(x,y,step,node /*global:*/, px,py,pz, ix,iy,iz, tile_cb)
	{
		var ret = 0;
		var arr = this_data;
		var idx = node*(0x8);
		
		// safety margin
		// should be large enough to cover about half character
		var eps = 0.01;
		
		var x0 = x - eps;
		var y0 = y - eps;
		var z0 = (arr[idx+7]&0xFFFF) - eps;
		var x1 = x + step + eps;
		var y1 = y + step + eps;
		var z1 = ((arr[idx+7]>>16)&0xFFFF) + eps;
		
		// only if sprites are queried too
		{
			var xy_frac = 1./256;
			x0 -= (arr[idx+5]&0xFFFF)*xy_frac;
			x1 += ((arr[idx+5]>>16)&0xFFFF)*xy_frac;
			y0 -= (arr[idx+6]&0xFFFF)*xy_frac;
			y1 += ((arr[idx+6]>>16)&0xFFFF)*xy_frac;
		}
		
		
		var tmin;
		var tmax;
		var tymin;
		var tymax;
		
		if (ix<0)
		{
			tmin = (x1-px)*ix;
			tmax = (x0-px)*ix;
		}
		else
		{
			tmin = (x0-px)*ix;
			tmax = (x1-px)*ix;
		}
		
		if (iy<0)
		{
			tymin = (y1-py)*iy;
			tymax = (y0-py)*iy;
		}
		else
		{
			tymin = (y0-py)*iy;
			tymax = (y1-py)*iy;
		}
		
		
		if (tmin < tymax && tymin < tmax)
		{
		
			if (tymin > tmin)
				tmin = tymin;
			if (tymax < tmax)
				tmax = tymax;
				
			var tzmin;
			var tzmax;
			
			if (iz<0)
			{
				tzmin = (z1-pz)*iz;
				tzmax = (z0-pz)*iz;
			}
			else
			{
				tzmin = (z0-pz)*iz;
				tzmax = (z1-pz)*iz;
			}								
			
			if (tmin < tzmax && tzmin < tmax)
			{
				// test if for infinite ray 
				// this is enough to get here
				// ...
				
				if (tzmin > tmin)
					tmin = tzmin;
				if (tzmax < tmax)
					tmax = tzmax;
					
				var t0=0;
				var t1=1;
					
				if (tmin < t1 && tmax > t0)
				{
					// recurse or do exact hit test using image data
					if (step>1)
					{
						step>>=1;
						
						if (arr[idx]!==-1)
							ret += _QueryRay(x,y,step,arr[idx], px,py,pz, ix,iy,iz, tile_cb);
						idx++;
						if (arr[idx]!==-1)
							ret += _QueryRay(x+step,y,step,arr[idx], px,py,pz, ix,iy,iz, tile_cb);
						idx++;
						if (arr[idx]!==-1)
							ret += _QueryRay(x,y+step,step,arr[idx], px,py,pz, ix,iy,iz, tile_cb);
						idx++;
						if (arr[idx]!==-1)
							ret += _QueryRay(x+step,y+step,step,arr[idx], px,py,pz, ix,iy,iz, tile_cb);
					}
					else
					{
						// sprite test first
						// (if ray_sprite_cb is provided)
						// ...
						
						// exact surface test
						// (if ray_tile_cb is provided)
						// ...
						
						// temporarily
						tile_cb(x,y,node);
						ret = 1; 
					}
				}
			}
		}

		return ret;
	}
	
	function QueryRay(px,py,pz, dx,dy,dz, tile_cb)
	{
		if (this_depth<0)
			return 0;
			
		// ray interval
		var t0 = 0;
		var t1 = 1;
		
		// we can get +/-#INF
		// this is crucial to keep them untouched!
		var ix = 1.0/dx;
		var iy = 1.0/dy;
		var iz = 1.0/dz;
	
		var step = 1<<this_depth;
		
		return _QueryRay(-this_ofs_x,-this_ofs_y,step,this_root, px,py,pz, ix,iy,iz,  tile_cb); // times cb has been called
	}
	
	function _PassHull(cb,node,x,y,d)
	{
		if (d===0)
		{
			// signal leaf tile
			// (... and all its sprites?)
			
			// do more detailed checks?
			// - no! bbox already fully passed
			
			cb(x,y,node);
			return 1;
		}

		var ret = 0;
		var arr = this_data;
		var idx = node*(0x8);

		d--;
		var step = 1<<d;
		
		if (arr[idx]>=0)
			ret += _PassHull(cb,arr[idx],x,y,d);
		idx++;

		if (arr[idx]>=0)
			ret += _PassHull(cb,arr[idx],x+step,y,d);
		idx++;

		if (arr[idx]>=0)
			ret += _PassHull(cb,arr[idx],x,y+step,d);
		idx++;

		if (arr[idx]>=0)
			ret += _PassHull(cb,arr[idx],x+step,y+step,d);
		
		return ret;
	}
	
	function _QueryHull(n,planes,cb, node,x,y,d)
	{
		var step = 1<<d;						
	
		var ret = 0;
		var arr = this_data;
		var idx = node*(0x8);
		
		// safety margin
		// should be large enough to cover about half character
		var eps = 0.00; 
		
		var x0 = x - eps;
		var y0 = y - eps;
		var z0 = (arr[idx+7]&0xFFFF) - eps;
		var x1 = x + step + eps;
		var y1 = y + step + eps;
		var z1 = ((arr[idx+7]>>16)&0xFFFF) + eps;
		
		// only if sprites are queried too
		{
			var xy_frac = 1./256;
			x0 -= (arr[idx+5]&0xFFFF)*xy_frac;
			x1 += ((arr[idx+5]>>16)&0xFFFF)*xy_frac;
			y0 -= (arr[idx+6]&0xFFFF)*xy_frac;
			y1 += ((arr[idx+6]>>16)&0xFFFF)*xy_frac;
		}
		
		for (var p=0; p<n; p++)
		{
			var all_neg = 1;
			var all_pos = 1;
			
			var pln = p<<2;
			var pln_x = planes[pln+0];
			var pln_y = planes[pln+1];
			var pln_z = planes[pln+2];
			var pln_w = planes[pln+3];
			
			var dp0 = pln_x*x0 + pln_y*y0 + pln_z*z0 + pln_w;
			all_neg &= dp0<0;
			all_pos &= dp0>=0;

			var dp1 = pln_x*x1 + pln_y*y0 + pln_z*z0 + pln_w;
			all_neg &= dp1<0;
			all_pos &= dp1>=0;
			
			var dp2 = pln_x*x0 + pln_y*y1 + pln_z*z0 + pln_w;
			all_neg &= dp2<0;
			all_pos &= dp2>=0;
			
			var dp3 = pln_x*x1 + pln_y*y1 + pln_z*z0 + pln_w;
			all_neg &= dp3<0;
			all_pos &= dp3>=0;
			
			var dp4 = pln_x*x0 + pln_y*y0 + pln_z*z1 + pln_w;
			all_neg &= dp4<0;
			all_pos &= dp4>=0;

			var dp5 = pln_x*x1 + pln_y*y0 + pln_z*z1 + pln_w;
			all_neg &= dp5<0;
			all_pos &= dp5>=0;
			
			var dp6 = pln_x*x0 + pln_y*y1 + pln_z*z1 + pln_w;
			all_neg &= dp6<0;
			all_pos &= dp6>=0;
			
			var dp7 = pln_x*x1 + pln_y*y1 + pln_z*z1 + pln_w;
			all_neg &= dp7<0;
			all_pos &= dp7>=0;
				
			if (all_neg)
				return 0;
				
			if (all_pos)
			{
				n--;
				var lst = n<<2;
				
				// plane exclusion, swap last with current & shrink
				planes[pln+0] = planes[lst+0];
				planes[pln+1] = planes[lst+1];
				planes[pln+2] = planes[lst+2];
				planes[pln+3] = planes[lst+3];
				
				planes[lst+0] = pln_x;
				planes[lst+1] = pln_y;
				planes[lst+2] = pln_z;
				planes[lst+3] = pln_w;

				p--;
			}
		}
		
		if (d===0)
		{
			cb(x,y,node);
			return 1;
		}
		
		d--;
		step>>=1;

		if (n)
		{
			if (arr[idx]>=0)
				ret += _QueryHull(n,planes,cb, arr[idx],x,y,d);
			idx++;

			if (arr[idx]>=0)
				ret += _QueryHull(n,planes,cb, arr[idx],x+step,y,d);
			idx++;

			if (arr[idx]>=0)
				ret += _QueryHull(n,planes,cb, arr[idx],x,y+step,d);
			idx++;

			if (arr[idx]>=0)
				ret += _QueryHull(n,planes,cb, arr[idx],x+step,y+step,d);
			//idx++;
		}
		else
		{
			if (arr[idx]>=0)
				ret += _PassHull(cb, arr[idx],x,y,d);
			idx++;

			if (arr[idx]>=0)
				ret += _PassHull(cb, arr[idx],x+step,y,d);
			idx++;

			if (arr[idx]>=0)
				ret += _PassHull(cb, arr[idx],x,y+step,d);
			idx++;

			if (arr[idx]>=0)
				ret += _PassHull(cb, arr[idx],x+step,y+step,d);
			//idx++;
		}
		
		return ret;
	}
	
	function QueryHull(planes,cb)
	{
		return _QueryHull(planes.length>>2,planes,cb, this_root,-this_ofs_x,-this_ofs_y,this_depth);
	}
	
	function InsertTile(x,y/*tile_id,base_h, style*/)
	{
		x|=0;
		y|=0;

		/*
		tile_id|=0;
		base_h|=0;
		style|=0;
		
		if (tile_id<0 || tile_id>=81 || base_h<0)
			return -1;
			
		var hMin = base_h + this_library['terrain']['z_lim'][2*tile_id+0];
		var hMax = base_h + this_library['terrain']['z_lim'][2*tile_id+1];
		*/
			
		var r = _GetTileRange(x,y);
		var hMin = r&0xFFFF;
		var hMax = (r>>16)&0xFFFF;
		
		var arr = this_data;
		
		// empty? let's root!
		if (this_depth<0)
		{
			this_leafs++;
			this_depth=0;
			this_ofs_x=-x;
			this_ofs_y=-y;
			this_root = _Alloc(x,y,-1,-1/*sprites*/, -1/*parent*/, 0,0,hMin|(hMax<<16));
			return this_root;
		}
		
		x+=this_ofs_x;
		y+=this_ofs_y;
		
		while (true)
		{
			var step = 1<<this_depth;
			var idx = this_root*(0x8);

			if (x<0 && y<0)
			{
				// first try to shift
				if (this_depth>0 && arr[idx+1]===-1 && arr[idx+2]===-1 && arr[idx+3]===-1)
				{
					// move by half step!
					arr[idx+3] = arr[idx+0];
					arr[idx+0] = -1;
					
					var half = step>>1;
					this_ofs_x += half;
					this_ofs_y += half;
					x += half;
					y += half;
				}
				else
				{
					this_root = _Alloc( -1,-1,-1,this_root, -1 , 0,0,arr[idx+7]);
					arr = this_data; // possible realloc!
					arr[idx+4] = this_root;
					this_ofs_x += step;
					this_ofs_y += step;
					x += step;
					y += step;
					this_depth++;
				}
			}
			else
			if (x<0)
			{
				if (this_depth>0 && arr[idx+1]===-1 && arr[idx+3]===-1)
				{
					arr[idx+1] = arr[idx+0];
					arr[idx+3] = arr[idx+2];
					arr[idx+0] = -1;
					arr[idx+2] = -1;
					var half = step>>1;
					this_ofs_x += half;
					x += half;
				}
				else
				{
					this_root = _Alloc( -1,this_root,-1,-1, -1 , 0,0,arr[idx+7]);
					arr = this_data; // possible realloc!
					arr[idx+4] = this_root;
					this_ofs_x += step;
					x += step;
					this_depth++;
				}
			}
			else
			if (y<0)
			{
				if (this_depth>0 && arr[idx+2]===-1 && arr[idx+3]===-1)
				{
					arr[idx+2] = arr[idx+0];
					arr[idx+3] = arr[idx+1];
					arr[idx+0] = -1;
					arr[idx+1] = -1;
					var half = step>>1;
					this_ofs_y += half;
					y += half;
				}
				else
				{
					this_root = _Alloc( -1,-1,this_root,-1, -1, 0,0,arr[idx+7]);
					arr = this_data; // possible realloc!
					arr[idx+4] = this_root;
					this_ofs_y += step;
					y += step;
					this_depth++;
				}
			}
			else
			if (x>=step || y>=step)
			{
				this_root = _Alloc( this_root,-1,-1,-1, -1, 0,0,arr[idx+7]);
				arr = this_data; // possible realloc!
				arr[idx+4] = this_root;
				this_depth++;
			}
			else
				break;
		}
		
		var d = this_depth;
		var node = this_root;
		
		// fix?: update root
		idx = node*(0x8);
		r = arr[idx+7];
		var lo = r&0xFFFF;
		var hi = (r>>16)&0xFFFF; 
		lo = hMin<lo ? hMin : lo;
		hi = hMax>hi ? hMax : hi;
		arr[idx+7] = lo|(hi<<16); 
		
		
		while (d && node!==-1)
		{
			d--;
			var idx = node*(0x8);
			var ch = ((x>>d)&1) | (((y>>d)&1)<<1);
			
			if (arr[idx+ch]!==-1)
			{
				node = arr[idx+ch];
				idx = node*(0x8);
				
				/*
				arr[idx+5] = hMin < arr[idx+5] ? hMin : arr[idx+5];
				arr[idx+6] = hMax > arr[idx+6] ? hMax : arr[idx+6];
				*/
				r = arr[idx+7];
				lo = r&0xFFFF;
				hi = (r>>16)&0xFFFF; 
				lo = hMin<lo ? hMin : lo;
				hi = hMax>hi ? hMax : hi;
				arr[idx+7] = lo|(hi<<16); 
				
				// already exist? just update
				if (d===0)
				{
					/*
					arr[idx+0] = tile_id;
					arr[idx+1] = base_h;
					arr[idx+2] = style;
					*/
					_Update(node,0);
				}
			}
			else
			{
				if (d===0)
				{
					this_leafs++;
					node = _Alloc( x-this_ofs_x,y-this_ofs_y, -1,-1/*sprites*/, node, 0,0,hMin|(hMax<<16) );
					arr = this_data; // possible realloc!
					arr[idx+ch] = node;
				}
				else
				{
					node = _Alloc( -1,-1,-1,-1, node, 0,0,hMin|(hMax<<16) );
					arr = this_data; // possible realloc!
					arr[idx+ch] = node;
				}
			}
		}

		return node;
	}
	
	function RemoveTile(x,y)
	{
		// must remove all underlying sprites
		// ...
		
		if (this_depth<0)
			return false;
			
		x|=0;
		y|=0;
			
		x+=this_ofs_x;
		y+=this_ofs_y;
		
		var arr = this_data;

		var d = this_depth;
		var node = this_root;
		
		if (x<0 || y<0 || x>=(1<<d) || y>=(1<<d))
			return false;
			
		if (d===0)
		{
			// kill root's sprites
			var idx = node*(0x8);
			var spr = arr[idx+2];
			while (spr!==-1)
			{
				this_sprites--;
				var sidx = spr*(0x8);
				var nxt = arr[sidx+2];
				_Free(spr);
				spr = nxt;
			}
			
			// kill the root!
			this_leafs--;
			this_root = -1;
			this_depth = -1;
			this_ofs_x = 0;
			this_ofs_y = 0;
			_Free(node);
			return true;
		}
			
		while (d && node!==-1)
		{
			d--;
			
			var idx = node*(0x8);
			var ch = ((x>>d)&1) | (((y>>d)&1)<<1);

			if (arr[idx+ch]!==-1)
			{
				if (d===0)
				{
					var leaf = arr[idx+ch];

					// kill leaf's sprites
					var lidx = leaf*(0x8);
					var spr = arr[lidx+2];
					while (spr!==-1)
					{
						this_sprites--;
						var sidx = spr*(0x8);
						var nxt = arr[sidx+2];
						_Free(spr);
						spr = nxt;
					}
				
					this_leafs--;
					_Free(leaf);
					arr[idx+ch]=-1;
					_Update(node,1/*xy is not needed*/);
					return true;
				}
				else
					node = arr[idx+ch];
			}
			else
				break;
		}
		
		return false;
	}
	
	function RemoveSprite(spr)
	{
		var arr = this_data;
		var sidx = spr*(0x8);
		var own = arr[sidx+4];
		var oidx = own*(0x8);
		
		if (arr[sidx+2]>=0)
		{
			// next->prev = prev
			var nidx = arr[sidx+2]*(0x8);
			arr[nidx+3] = arr[sidx+3];
		}
		else
		{
			// last = prev
			arr[oidx+3] = arr[sidx+3];
		}
		
		if (arr[sidx+3]>=0)
		{
			// prev->next = next
			var pidx = arr[sidx+3]*(0x8);
			arr[pidx+2] = arr[sidx+2];
		}
		else
		{
			// first = next
			arr[oidx+2] = arr[sidx+2];
		}

		_Free(spr);
		_Update(own,0);
		
		this_sprites--;
	}

	function InsertSprite(sprite_id,x,y,z,state/*=frame|(angle<<16)*/)
	{
		// x,y here are floating point doubles !!!
		// convert'em to tile's xy integers and fractions, also integers (1/256) 
		// so at tile size 32x32 chars we have 3 bits sub-character precision
		
		// given x,y are in tile coords

		x = Math.round(x*256)|0;
		y = Math.round(y*256)|0;
		
		var qx = x>>8;
		var fx = x&0xFF;
		var qy = y>>8;
		var fy = y&0xFF;
		
		var fz=z|0;
		
		// fz must be relative to interpolated surface height at fx,fy
		// so changing tile_id will keep all sprites at the surface level correctly
		
		var owner = Lookup(qx,qy);
		if (owner===-1)
			return -1;
			
		var arr = this_data;
			
		var oidx = owner*(0x8);
		
		var last = arr[oidx+3];
		var sprite = _Alloc(sprite_id,state,-1,last,owner,fx,fy,fz);
		
		this_sprites++;
		
		if (last>=0)
		{
			// if there is some sprite already, link last->next = sprite
			var lidx = last*(0x8);
			arr[lidx+2] = sprite;
		}
		else
		{
			// if this is very first sprite, set head = sprite
			arr[oidx+2] = sprite;
		}
		
		// set last = sprite
		arr[oidx+3] = sprite;
		
		// if any of 6 sides of this sprite exceeds owner-tile's bbox
		// we need only to _GrowUpdate(owner,sprite_bbox)
		// temporarily we do full _Update()
		_Update(owner,0);
		
		return sprite;
	}
	
	function GetSprites(n,cb/*id,x,y,z,state*/)
	{
		var arr = this_data;
		
		var idx = n*(0x8);

		var x = arr[idx+0];
		var y = arr[idx+1];
		var spr = arr[idx+2]; // head
		
		var frac_xy = 1./256;
		while (spr!==-1)
		{
			var sidx = spr*(0x8);
		
			var sprite_id = arr[sidx+0];
			var state = arr[sidx+1];
			
			var spr_x = x+arr[sidx+5]*frac_xy;
			var spr_y = y+arr[sidx+6]*frac_xy;
			var spr_z = arr[sidx+7];
			
			cb(sprite_id, spr_x, spr_y, spr_z, state);
			spr = arr[sidx+2]; // next
		}
	}
	
    return {
        'Lookup'       : Lookup,
		'QueryRay'     : QueryRay,
		'QueryHull'    : QueryHull,
		'QueryFull'    : function (cb) { return _PassHull(cb,this_root,0,0,this_depth); },
		'InsertTile'   : InsertTile,
		'RemoveTile'   : RemoveTile,
		'InsertSprite' : InsertSprite,
		'RemoveSprite' : RemoveSprite,
		'GetSprites'   : GetSprites,
		'SampleMapHeight' : SampleMapHeight,
		'GetMapHeight' : GetMapHeight,
		'GetMapShade'  : GetMapShade,
		'GetMapDecal'  : GetMapDecal,
		'DecMapDecal'  : DecMapDecal,
		'SetLight'     : SetLight,
		'DecalCircle'  : DecalCircle,
		'DecalRect'    : DecalRect,
		'getMapWidth'  : function() { return this_map_w; },
		'getMapHeight' : function() { return this_map_h; },
		'getDepth'     : function() { return this_depth; },
		'getCount'     : function() { return this_count; },
		'getLeafs'     : function() { return this_leafs; },
		'getSprites'   : function() { return this_sprites; },
		'getTileSize'  : function() { return this_tile_to_map; },
		'getWater'     : function() { return this_water; },
		'setWater'     : function(w){ this_water = w; },
		'getShadeBuf'  : function() { return this_lit; },
		'getDecalBuf'  : function() { return this_clr; },
		'getMapSmooth' : function() { return this_smooth; }
    };	
};


