// noinspection DuplicatedCode
MSG = {};

// noinspection DuplicatedCode
MSG.WriteChar = function(sb, c) {
	(new DataView(sb.data)).setInt8(SZ.GetSpace(sb, 1), c);
};

// noinspection DuplicatedCode
MSG.WriteByte = function(sb, c) {
	(new DataView(sb.data)).setUint8(SZ.GetSpace(sb, 1), c);
};

// noinspection DuplicatedCode
MSG.WriteShort = function(sb, c) {
	(new DataView(sb.data)).setInt16(SZ.GetSpace(sb, 2), c, true);
};

// noinspection DuplicatedCode
MSG.WriteLong = function(sb, c) {
	(new DataView(sb.data)).setInt32(SZ.GetSpace(sb, 4), c, true);
};

// noinspection DuplicatedCode
MSG.WriteFloat = function(sb, f) {
	(new DataView(sb.data)).setFloat32(SZ.GetSpace(sb, 4), f, true);
};

// noinspection DuplicatedCode
MSG.WriteString = function(sb, s) {
	if (s != null) {
		SZ.Write(sb, new Uint8Array(Q.strmem(s)), s.length);
	}
	MSG.WriteChar(sb, 0);
};

// noinspection DuplicatedCode
MSG.WriteCoord = function(sb, f) {
	MSG.WriteShort(sb, f * 8.0);
};

// noinspection DuplicatedCode
MSG.WriteAngle = function(sb, f) {
	MSG.WriteByte(sb, ((f >> 0) * (256.0 / 360.0)) & 255);
};

// noinspection DuplicatedCode
MSG.BeginReading = function() {
	MSG.readcount = 0;
	MSG.badread = false;
};

// noinspection DuplicatedCode
MSG.ReadChar = function() {
	if (MSG.readcount >= NET.message.cursize) {
		MSG.badread = true;

		// noinspection JSConstructorReturnsPrimitive
		return -1;
	}
	var c = (new Int8Array(NET.message.data, MSG.readcount, 1))[0];
	++MSG.readcount;

	// noinspection JSConstructorReturnsPrimitive
	return c;
};

// noinspection DuplicatedCode
MSG.ReadByte = function() {
	if (MSG.readcount >= NET.message.cursize) {
		MSG.badread = true;

		// noinspection JSConstructorReturnsPrimitive
		return -1;
	}

	var c = (new Uint8Array(NET.message.data, MSG.readcount, 1))[0];
	++MSG.readcount;

	// noinspection JSConstructorReturnsPrimitive
	return c;
};

// noinspection DuplicatedCode
MSG.ReadShort = function() {
	if ((MSG.readcount + 2) > NET.message.cursize) {
		MSG.badread = true;

		// noinspection JSConstructorReturnsPrimitive
		return -1;
	}

	var c = (new DataView(NET.message.data)).getInt16(MSG.readcount, true);
	MSG.readcount += 2;

	// noinspection JSConstructorReturnsPrimitive
	return c;
};

// noinspection DuplicatedCode
MSG.ReadLong = function() {
	if ((MSG.readcount + 4) > NET.message.cursize) {
		MSG.badread = true;

		// noinspection JSConstructorReturnsPrimitive
		return -1;
	}

	var c = (new DataView(NET.message.data)).getInt32(MSG.readcount, true);
	MSG.readcount += 4;

	// noinspection JSConstructorReturnsPrimitive
	return c;
};

// noinspection DuplicatedCode
MSG.ReadFloat = function() {
	if ((MSG.readcount + 4) > NET.message.cursize) {
		MSG.badread = true;

		// noinspection JSConstructorReturnsPrimitive
		return -1;
	}

	var f = (new DataView(NET.message.data)).getFloat32(MSG.readcount, true);
	MSG.readcount += 4;

	// noinspection JSConstructorReturnsPrimitive
	return f;
};

// noinspection DuplicatedCode
MSG.ReadString = function() {
	var string = [], l, c;

	for (l = 0; l < 2048; ++l) {
		c = MSG.ReadByte();

		if (c <= 0) {
			break;
		}

		string[l] = String.fromCharCode(c);
	}

	// noinspection JSConstructorReturnsPrimitive
	return string.join('');
};

// noinspection DuplicatedCode
MSG.ReadCoord = function() {
	// noinspection JSConstructorReturnsPrimitive
	return MSG.ReadShort() * 0.125;
};

// noinspection DuplicatedCode
MSG.ReadAngle = function() {
	// noinspection JSConstructorReturnsPrimitive
	return MSG.ReadChar() * 1.40625;
};