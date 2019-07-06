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

**Course Theme**

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

**Timer**

16-bit unsigned integer at address `0x04`.

