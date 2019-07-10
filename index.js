/*! smm2data (C) SwitchJS */
const smm2data = (() => {
  const OBJECT_COUNT = 2600;
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

  const SpeedNames  = [ "None", "Slow", "Normal", "Fast", "Custom"];
  const MotionNames = [ "None", "OneWay", "TwoWay" ];
  const CCCatNames  = [ "None", "Parts", "Status", "Action" ];

  /* utilities to read values from Uint8Array / Buffer */
  const UInt16ValAt = (a, idx) => ( a[idx] | (a[idx+1]<<8) ) >>> 0;
  const UInt32ValAt = (a, idx) => ( a[idx] | (a[idx+1]<<8) | (a[idx+2]<<16) | (a[idx+3]<<24) ) >>> 0;
  const ASCIIString = (buf) => Array.from({length: buf.length}, (_, i) => String.fromCharCode(buf[i])).join("");
  const UCS2String  = (buf) => Array.from({length: buf.length/2}, (_, i) => String.fromCharCode(buf[2*i] + (buf[2*i+1]<<8))).join("");
  const UCS2StringTrimmed = (buf) => UCS2String(buf).replace(/\x00.*$/,"");

  /* parse water/lava properties */
  const parse_liquid = (buf) => ({
    Final: buf[0x204],
    Start: buf[0x207],
    Motion: MotionNames[buf[0x205]] || "??",
    Speed: SpeedNames[buf[0x206]] || "??"
  });

  /* clear condition */
  const parse_clear_cond = (buf) => {
    const o = {
      Category: CCCatNames[buf[0x0F]]||"??",
      Type: UInt32ValAt(buf, 0x10).toString(16)
    };
    if(o.Category == "Parts") o.Value = UInt16ValAt(buf, 0x06);
    return o;
  };

  /* get 32-byte object */
  const get_raw_object = (buf, i) => {
    const o = buf.slice(0x248 + 0x20 * i, 0x248 + 0x20 * i + 0x20);
    return (o instanceof ArrayBuffer) ? new Uint8Array(o) : o;
  };

  const parse_auto_scroll = (buf) => {
    const o = {
      Points: [],
      Speeds: []
    };

    o.Speeds.push(buf[0x0E] & 0x03);

    //const obj_cnt = UInt32ValAt(buf, 0x21C);
    for(let i = 0; i < OBJECT_COUNT /* obj_cnt */; ++i) {
      const obj_buf = get_raw_object(buf, i);
      if(UInt16ValAt(obj_buf, 0x18) != 0x59) continue;
      o.Speeds.push((obj_buf[0x0E] & 0x0C)>>2);
    }
    return o;
  };

  const parse_objects = (buf) => {
    const o = [];
    //const obj_cnt = UInt32ValAt(buf, 0x21C);
    for(let i = 0; i < OBJECT_COUNT /* obj_cnt */; ++i) {
      const obj_buf = get_raw_object(buf, i);
      let chk = 0;
      for(let j = 0; j < 0x20; ++j) chk |= obj_buf[j];
      if(chk == 0) continue;
      const obj = {
        //data: Buffer(obj_buf),
        Type: UInt16ValAt(obj_buf, 0x18),
        //RawX: UInt32ValAt(obj_buf, 0x00),
        //RawY: UInt32ValAt(obj_buf, 0x04),
        Width:  obj_buf[0x0A],
        Height: obj_buf[0x0B],
        RawFlags: UInt32ValAt(obj_buf, 0x0C)
      };
      if((obj.RawFlags>>1) & 1) obj.Wings = true;
      if((obj.RawFlags>>15) & 1) obj.Parachute = true;
      obj.TileX = (UInt32ValAt(obj_buf, 0x00) - 80) / 160;
      obj.TileY = (UInt32ValAt(obj_buf, 0x04) - 80) / 160;
      //obj.RawFlags &= ~(1<<1);
      //obj.RawFlags &= ~(1<<15);
      //obj.RawFlags &= ~(1<<18);
      //obj.RawFlags &= ~(1<<2);
      o.push(obj);
    }
    return o;
  };

  const parse_course_data = (buf) => {
    const o = {};
    o.Info = {};
    o.Info.Name = UCS2StringTrimmed(buf.slice(0xF4, 0x134));
    const desc = UCS2StringTrimmed(buf.slice(0x136, 0x1CC));
    if(desc) o.Info.Description = desc;
    o.Info.CreationDate = new Date(UInt16ValAt(buf, 0x08), buf[0x0a] - 1, buf[0x0b], buf[0x0c], buf[0x0d], 0, 0 );
    o.Info.GameStyle = ASCIIString(buf.slice(0xF1, 0xF3));
    o.Info.CourseTheme = CourseThemeNames[buf[0x200]];
    if(buf[0x200] == 2 || buf[0x200] == 9) o.Info.Liquid = parse_liquid(buf);
    o.Info.Timer = UInt16ValAt(buf, 4);
    if(buf[0x0F] != 0) o.Info.Clear = parse_clear_cond(buf);
    if(buf[0x201] != 0) {
      o.Info.AutoScroll = SpeedNames[buf[0x201]];
      if(o.Info.AutoScroll == "Custom") o.Info.ASData = parse_auto_scroll(buf);
    }
    o.Objects = parse_objects(buf);
    return o;
  };

  const ObjectTypeNames = {};
  ObjectTypeNames["M1"] = {
    0x08: "Coin",
    0x14: "Super Mushroom",
    0x21: "1-Up Mushroom",
    0x22: "Fire Flower",
    0x23: "Super Star",
    0x2C: "Big Mushroom",
    0x2D: "Shoe Goomba",
    0x46: "10-Coin",
    0x5C: "Pink Coin"
  };
  const get_object_name = (id, style) => ((ObjectTypeNames[style] || {})[id] || ObjectTypeNames["M1"][id] || id);

  return {
    get_object_name,
    parse_course_data
  };
})();

if(typeof module !== "undefined") module.exports = smm2data;
