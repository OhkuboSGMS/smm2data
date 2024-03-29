# NOTES

The `.bcd` save files are encrypted.

The decrypted course data files are expected to be `0x5bfc0 == 376768` bytes.

Information deduced from test course data


## Course Info

**Course Name**

64-byte (32 logical character) UCS-2 string starting at offset `0xF4`.
Characters after the first null character are discarded.

**Course Description**

150-byte (75 logical character) UCS-2 string starting at offset `0x136`
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

**Positions**

Start Y: Byte at offset `0x00`

End Y: Byte at offset `0x01`

X distance: 16-bit unsigned integer at address `0x02`.  Interpreted as 10 * X
position of the goal starting from the left.

Game reserves 7 blocks at the start and 10 blocks at the end.  Total canvas
width is (X distance + 95) / 10.

Height is 27 tiles.

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

### Clear Condition

Byte at offset `0x0F` refers to the tab in the clear condition window:

| File Value | Clear Type |
|:-----------|:-----------|
| 0x00       | "None"     |
| 0x01       | "Parts"    |
| 0x02       | "Status"   |
| 0x03       | "Action"   |

32-bit unsigned integer at offset 0x10 identifies the clear condition.  It is a
CRC-32 checksum of the name of an internal identifier.  Verified values:

| Checksum | T | Internal Name  | Condition                     |
|:---------|:--|:---------------|:------------------------------|
|`7f07acbf`| 1 | EnemyKuribo    | defeating at least ## Goombas |
|`f55b3863`| 1 | Coin           | grabbing at least ## Coins    |
|`66477be4`| 2 | ObjectPowBlock | holding a POW block           |
|`08327ae6`| 3 | Land           | without landing               |
|`1664515a`| 3 | Damage         | without taking damage         |

16-bit unsigned integer at offset 0x06 is the clear parameter.  It applies
only to "Parts" clear conditions.  It is clamped at 999.

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

## Objects

The level area has storage for exactly 2600 Objects starting at address `0x248`.
Each Object is of size `0x20`

### Object Position and Size

X-Coordinate: 32-bit unsigned integer at offset `0x00`

Y-Coordinate: 32-bit unsigned integer at offset `0x04`


The position appears to be the centerpoint of the tile assuming the grid is
160 units wide and 160 units tall.  For example, a `1 x 1` block positioned at
the bottom of the grid has Y-coordinate `80` rather than `0`.  The origin is the
lower-left corner of the canvas.

Width: 8-bit unsigned integer at offset `0x0A`

Height: 8-bit unsigned integer at offset `0x0B`

The sizes are specified in tiles.  For example, AutoScroll waypoints are 3 tiles
wide and 1 tile tall.

### Object Type

16-bit unsigned integer at offset `0x18`

#### Items

| Value | M1 Obj Type    | Common Modifiers             |
|------:|:---------------|------------------------------|
| `0x08`| Coin           | Wing, Parachute              |
| `0x14`| Super Mushroom | Wing, Parachute              |
| `0x21`| 1-Up Mushroom  | Wing, Parachute              |
| `0x22`| Fire Flower    | Wing, Parachute, Mushroom !! |
| `0x23`| Super Star     | Wing, Parachute              |
| `0x2C`| Big Mushroom   | Wing, Parachute, Mushroom    |
| `0x2D`| Shoe Goomba    | Wing, Parachute, Mushroom !! |
| `0x46`| 10-Coin        | Wing, Parachute, !!          |
| `0x5C`| Pink Coin      | (none)                       |

#### Terrain

| Value | M1 Obj Type    | Common Modifiers             |
|------:|:---------------|------------------------------|
| `0x04`| Block          | Wing                         |
| `0x05`| ? Block        | Wing                         |
| `0x06`| Hard Block     | Wing                         |
| `0x0E`| Mushroom Plat  | !!                           |
| `0x10`| Semisolid Plat | !!                           |
| `0x11`| Bridge         | (none)                       |
| `0x15`| Donut Block    | Wing                         |
| `0x16`| Cloud Block    | Wing                         |
| `0x17`| Note Block     | Wing, !!                     |
| `0x1D`| Hidden Block   | Wing                         |
| `0x2B`| Spike Trap     | (none)                       |
| `0x3F`| Ice Block      | Wing                         |
| `0x57`| Gentle Slope   | !!                           |
| `0x58`| Steep Slope    | !!                           |

Even though the selection height is 1, Bridge height is always 2.


#### Miscellaneous

| Value | Description          |
|------:|:---------------------|
| `0x59`| Auto-Scroll Waypoint |

### Object Flags

32-bit unsigned integer at offset `0x0C`.

| BitMask | Interpretation    |
|--------:|:------------------|
| `1<< 1` | Wings             |
| `1<<15` | Parachute         |
| `1<<18` | Mushroom Modifier |

Part-specific modifiers:

| BitMask | Part           | Interpretation                |
|--------:|:---------------|:------------------------------|
| `1<< 2` | Fire Flower    | Superball Flower              |
| `1<< 2` | Shoe Goomba    | Stiletto                      |
| `1<< 2` | Note Block     | Super Note Block              |
| `3<<18` | 10-Coin        | Value: 0 = 10, 1 = 30, 2 = 50 |
| `3<<18` | Semisolid Plat | Style: 0, 1, 2                |
| `3<<18` | Mushroom Plat  | Style: 0, 1, 2                |
| `1<<20` | Gentle Slope   | Direction: 1 = `\`, 0 = `/`   |
| `1<<20` | Steep Slope    | Direction: 1 = `\`, 0 = `/`   |
| `1<<21` | Gentle Slope   | Maximum Length ? 1 = max      |
| `1<<21` | Steep Slope    | Maximum Length ? 1 = max      |


## Ground Tiles

Ground Tiles are stored separately from primary objects.

32-bit unsigned integer at offset `0x23C` is the number of ground tiles.
The Tile data block starts at offset `0x249a4`.  Each tile is 4 bytes large:

| Offset | Bytes | Interpretation        |
|-------:|------:|:----------------------|
| `0x00` |   `1` | X position (in tiles) |
| `0x01` |   `1` | Y position (in tiles) |
| `0x02` |   `2` | unknown               |
