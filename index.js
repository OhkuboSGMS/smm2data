/*! smm2data (C) SwitchJS */
const smm2data = (function() {
  const CourseThemeNames = [
    "Ground",
    "Underground",
    "Castle",
    "Airship",
    "Underwater",
    "Ghost House",
    "Snow",
    "Desert",
    "Sky",
    "Forest"
  ];

  const UInt16ValAt = (a, idx) => ( a[idx] | (a[idx+1]<<8) ) >>> 0;
	const ASCIIString = (buf) => Array.from({length: buf.length}, (_, i) => String.fromCharCode(buf[i])).join("");
	const UCS2String  = (buf) => Array.from({length: buf.length/2}, (_, i) => String.fromCharCode(buf[2*i] + (buf[2*i+1]<<8))).join("");

  function parse_course_data(buf) {
    const o = {};
    o.Info = {};
    o.Info.Name = UCS2String(buf.slice(0xF4, 0x134)).replace(/\x00.*$/,"");
    o.Info.CreationDate = new Date(UInt16ValAt(buf, 0x08), buf[0x0a] - 1, buf[0x0b], buf[0x0c], buf[0x0d], 0, 0 );
    o.Info.GameStyle = ASCIIString(buf.slice(0xF1, 0xF3));
    o.Info.CourseTheme = CourseThemeNames[buf[0x200]];
    o.Info.Timer = UInt16ValAt(buf, 4);
    return o;
  }

  return {
    parse_course_data
  };
})();

if(typeof module !== "undefined") module.exports = smm2data;
