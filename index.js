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

  const AutoScrollNames = [
    "None",
    "Slow",
    "Normal",
    "Fast",
    "Custom"
  ];

  const UInt16ValAt = (a, idx) => ( a[idx] | (a[idx+1]<<8) ) >>> 0;
  const UInt32ValAt = (a, idx) => ( a[idx] | (a[idx+1]<<8) | (a[idx+2]<<16) | (a[idx+3]<<24) ) >>> 0;
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
    o.Info.AutoScroll = AutoScrollNames[buf[0x201]];
    if(o.Info.AutoScroll == "Custom") o.Info.ASPoints = parse_auto_scroll(buf);
    return o;
  }

  function get_raw_object(buf, i) {
    const o = buf.slice(0x248 + 0x20 * i, 0x248 + 0x20 * i + 0x20);
    return (o instanceof ArrayBuffer) ? new Uint8Array(o) : o;
  }

  function parse_auto_scroll(buf) {
    const o = {
      Points: [],
      Speeds: []
    };

    o.Speeds.push(buf[0x0E] & 0x03);

    const obj_cnt = UInt32ValAt(buf, 0x21C);
    for(let i = 0; i < obj_cnt; ++i) {
      const obj_buf = get_raw_object(buf, i);
      if(UInt16ValAt(obj_buf, 0x18) != 0x59) continue;

      o.Speeds.push((obj_buf[0x0E] & 0x0C)>>2);
    }
    return o;
  }

  return {
    parse_course_data
  };
})();

if(typeof module !== "undefined") module.exports = smm2data;
