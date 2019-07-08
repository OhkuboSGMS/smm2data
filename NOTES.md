# NOTES

The `.bcd` save files are encrypted.

The decrypted course data files are expected to be `0x5bfc0 == 376768` bytes.

Information deduced from test course data


## Course Info

**Course Name**

64-byte (32 logical character) UCS-2 string starting at offset `0xF4`.
Characters after the first null character are discarded.

**Course Creation Date**

| Offset (sz) | Field  |
|:------------|:-------|
| `0x08` (2)  | Year   |
| `0x0A` (1)  | Month  |
| `0x0B` (1)  | Day    |
| `0x0C` (1)  | Hour   |
| `0x0D` (1)  | Minute |

**Game Style**

Two ASCII characters at offsets `0xF1` and `0xF2`:

| File Value | Game Style |
|:----------:|:-----------|
|    `M1`    | SMB1       |
|    `M3`    | SMB3       |
|    `MW`    | SMW        |
|    `WU`    | NSMBU      |
|    `3W`    | SM3DW      |

**Timer**

16-bit unsigned integer at address `0x04`.

### Course Theme

Byte at offset `0x200`:

| File Value | Course Theme |
|:----------:|:-------------|
|   `0x00`   | Ground       |
|   `0x01`   | Underground  |
|   `0x02`   | Castle       |
|   `0x03`   | Airship      |
|   `0x04`   | Underwater   |
|   `0x05`   | Ghost House  |
|   `0x06`   | Snow         |
|   `0x07`   | Desert       |
|   `0x08`   | Sky          |
|   `0x09`   | Forest       |

Forest and Castle in Main Game Styles have parameters for the water/lava level

| Address | Interpretation                                  |
|:--------|:------------------------------------------------|
| `0x204` | Final Height of water/lava (in tiles)           |
| `0x205` | Mode: 0 = fixed, 1 = one-way, 2 = oscillating   |
| `0x206` | Speed: 0 = none, 1 = slow, 2 = medium, 3 = fast |
| `0x207` | Starting height of water/level (in tiles)       |

### Auto-Scroll

Byte at offset `0x201`:

| File Value | Auto Scroll |
|:----------:|:------------|
|   `0x00`   | None        |
|   `0x01`   | Slow        |
|   `0x02`   | Normal      |
|   `0x03`   | Fast        |
|   `0x04`   | Custom      |

Custom Auto-Scrolling is implemented with Waypoints stored as Objects.

Scrolling speed of first segment stored in low 2 bits at offset 0x0E.

Scrolling speed for subsequent segments are stored in the object offset 0x0E in
bits 2-3 (mask 0x0C)
