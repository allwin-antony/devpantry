# Open-Source Font Licensing Guide & Legal Compliance

When using fonts in software, web applications, graphic design, embedded devices, and commercial products, typography is protected under software copyright and design patents. Using verified open-source licenses guarantees that you are legally compliant and safe from licensing disputes.

---

## 1. SIL Open Font License 1.1 (SIL OFL)
*The de-facto industry standard for open-source fonts.*

- **SPDX Identifier**: `OFL-1.1`
- **Official URL**: [https://openfontlibrary.org/en/license](https://openfontlibrary.org/en/license) / [https://scripts.sil.org/OFL](https://scripts.sil.org/OFL)

### Permitted:
-  **Commercial & Personal Use**: Use in commercial software, websites, print, and mobile apps without royalties.
-  **Embedding**: Embed in web pages (via CSS `@font-face`), PDFs, mobile apps, desktop apps, and games.
-  **Modification**: Alter glyphs, design, axes, and OpenType features.
-  **Redistribution**: Distribute the font files freely with your software or repository.

### Requirements & Restrictions:
- ⚠️ **Cannot Be Sold By Itself**: You cannot sell the raw font file alone. It must be bundled with other software or artistic work.
- ⚠️ **Reserved Font Name (RFN)**: If you modify the font files and the original designer declared a "Reserved Font Name", you must rename your modified version (e.g. modify *Roboto* -> release as *MyRoboto*).
- ⚠️ **Preserve Copyright & License**: The OFL license text and copyright notice must remain included.

---

## 2. Apache License 2.0
*Commonly used by Google (e.g., Roboto original release), Adobe, and Android.*

- **SPDX Identifier**: `Apache-2.0`
- **Official URL**: [https://www.apache.org/licenses/LICENSE-2.0](https://www.apache.org/licenses/LICENSE-2.0)

### Permitted:
-  **Commercial & Personal Use**: Full rights to use, modify, and distribute.
-  **Patent Grant**: Includes explicit express patent rights grant.
-  **Embedding & Bundling**: Embed in any proprietary or open-source software.

### Requirements:
- ⚠️ **Include License Notice**: Maintain the original Apache 2.0 license and notice.
- ⚠️ **State Changes**: If you modify the files, state prominently that you changed them.

---

## 3. Ubuntu Font License 1.0 (UFL)
*Created by Canonical for the Ubuntu font family.*

- **SPDX Identifier**: `UFL-1.0`
- **Official URL**: [https://ubuntu.com/legal/font-licence](https://ubuntu.com/legal/font-licence)

### Permitted:
-  Use in any medium (digital or print), commercial or non-commercial.
-  Modify and create derivative works.

### Requirements:
- ⚠️ Renaming requirement for derivatives (cannot use "Ubuntu" without permission).
- ⚠️ Derivative fonts must also be licensed under UFL.

---

## 4. MIT License & CC0 (Public Domain)
*Used for lightweight programming fonts and public domain typography (e.g., Comic Mono, Hack derivatives, Atkinson Hyperlegible).*

- **SPDX Identifier**: `MIT` / `CC0-1.0`
- **Permissions**: Extremely permissive. Free to use, modify, distribute, embed, and sell without any renaming restrictions.

---

## 5. Summary Matrix

| License | Free Commercial Use? | Font Modification Allowed? | Web / App Embedding Allowed? | Sell Raw Font Alone? | Rename Required on Edit? |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **SIL OFL 1.1** |  Yes |  Yes |  Yes |  No |  Yes (if RFN declared) |
| **Apache 2.0** |  Yes |  Yes |  Yes |  Yes |  No (just state changes) |
| **MIT / CC0** |  Yes |  Yes |  Yes |  Yes |  No |
| **UFL 1.0** |  Yes |  Yes |  Yes |  No |  Yes |
| **ITF Free Font License** |  Yes (usage only) |  No |  Yes |  No | N/A (proprietary) |
