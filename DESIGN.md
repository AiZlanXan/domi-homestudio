---
name: domi homestudio
description: Pixel Heart Studio — 手作小店宣传页，藏青工坊墨色配糖果粉与薄荷绿贴纸。
colors:
  ink: "#164d5b"
  teal: "#076e8a"
  homestudio-cyan: "#147c99"
  candy-heart-pink: "#ffd7e3"
  sky-blue: "#4ac6e9"
  bead-box-mint: "#d8ffd0"
  paper: "#fffafb"
  line: "#163e4c"
  preview-bar: "#174f60"
  muted-text: "#5b7279"
  eyebrow: "#377988"
  heart: "#ec85a4"
  ribbon: "#d5f7fc"
  beads-card: "#ffe0e9"
  nails-card: "#d7f4fa"
  charms-card: "#e6f6cf"
  about-wash: "#fff0f4"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Microsoft YaHei, PingFang SC, system-ui, sans-serif"
    fontSize: "clamp(48px, 5.5vw, 76px)"
    fontWeight: 900
    lineHeight: 1.3
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Microsoft YaHei, PingFang SC, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 900
    lineHeight: 1.5
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Microsoft YaHei, PingFang SC, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Microsoft YaHei, PingFang SC, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
  label:
    fontFamily: "Microsoft YaHei, PingFang SC, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 800
    lineHeight: 1.4
    letterSpacing: "0.16em"
rounded:
  sm: "5px"
  md: "6px"
  lg: "12px"
  xl: "14px"
  full: "50%"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "36px"
  xl: "83px"
  gutter: "40px"
  container: "1180px"
components:
  button-primary:
    backgroundColor: "{colors.bead-box-mint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 23px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.bead-box-mint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 23px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "8px 0"
  nav-cta:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "9px 19px"
  craft-card-beads:
    backgroundColor: "{colors.beads-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "25px 25px 21px"
  craft-card-nails:
    backgroundColor: "{colors.nails-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "25px 25px 21px"
  craft-card-charms:
    backgroundColor: "{colors.charms-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "25px 25px 21px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "11px 12px"
  booking-panel:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "29px 30px"
  dialog:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "28px"
---

# Design System: domi homestudio

## Overview

**Creative North Star: "Pixel Heart Studio"**

domi homestudio 是一间拼豆、美甲与热缩片手绘小店的预览站。视觉世界不是豪华电商，也不是扁平 SaaS：它像一间像素爱心工坊——藏青墨色写字，糖果粉画心，薄荷绿当按钮，卡通插画（47 抱着小恐龙 domi）承担品牌记忆。界面密度适中：大标题很重（900），正文很松（行高 1.8），卡片像贴在纸上的色块贴纸。

气质是可爱、像素、工坊、可触摸。中英混排是品牌声音的一部分：中文承担情感标题，英文大写 eyebrow / 项目编号承担工坊标签。♥、✦、↗ 是固定符号，不是装饰噪音。

明确拒绝：玻璃拟态、模糊大阴影、全宽渐变英雄区、纯黑白无彩色、过度衬线杂志风。可爱要克制在工坊尺度里，不要变成豪华店面。

**Key Characteristics:**
- 藏青工坊墨色做文字与描边，糖果粉与薄荷绿做色块，插画用正片叠底贴在纸面上
- 硬边、实色偏移阴影（无模糊），组件像贴纸
- 极重无衬线中文标题 + 大写英文标签
- 双语、像素爱心、微旋转标签是签名细节

## Colors

工坊藏青做骨架，糖果粉与薄荷绿做手作色块；青色只出现在品牌词标与焦点，从不铺满屏幕。

### Primary
- **Studio Teal / 工坊藏青** (`ink`): 全站正文、描边、按钮字色。这是「用什么写字」的颜色，不是装饰色。
- **Homestudio Cyan / 品牌青** (`homestudio-cyan`): 仅用于 `domi` 词标。`:root` 里的 `teal` 用于 favicon 字母，比词标更深一档。

### Secondary
- **Candy Heart Pink / 糖果粉色** (`candy-heart-pink`): 爱心、标题荧光笔衬底、导航描边阴影、拼豆卡片。粉色是「喜欢」的标记，不是大面积背景。
- **Bead-Box Mint / 薄荷绿** (`bead-box-mint`): 主按钮填充。主行动永远是薄荷绿纸片，配藏青描边。

### Tertiary
- **Sky Blue / 天空青** (`sky-blue`): 品牌插画与色带的冷色点缀；色带背景用更浅的 `ribbon`。美甲卡片 (`nails-card`) 与预约面板阴影走同一冷青家族。

### Neutral
- **Blush Paper / 腮红纸** (`paper`): 页面底，带极轻粉。
- **Line / 工坊线** (`line`): 所有结构描边。卡片、按钮、输入框、对话框共用这条近黑青线。
- **Muted Text / 次级字** (`muted-text`): 英雄区说明、章节辅文、表单提示。工坊青灰，不是中性灰。
- **Preview Bar** (`preview-bar`): 顶栏预览警告，深青底白字。
- **White** (`white`): 预约面板、插画角标、圆形卡片按钮。

项目卡片三色必须保持分工：拼豆用 `beads-card`，美甲用 `nails-card`，热缩片用 `charms-card`。关于区块若启用，铺 `about-wash` 粉格纸，不要改成白底。

**The Ink-Line Rule.** 文字与描边只许用 `ink` / `line` 这一对工坊青。禁止用纯黑 `#000` 或中性灰描边。

**The One Mint Rule.** 薄荷绿只给主行动按钮。卡片、色带、导航不要再铺一层薄荷。

## Typography

**Display Font:** Microsoft YaHei（Windows）/ PingFang SC（Apple），回退 system-ui, sans-serif  
**Body Font:** 同一套中文无衬线，不另配展示字体  
**Label Font:** 同一家族，靠字重与字距扮演标签

**Character:** 没有独立英文展示体。重量制造层次：标题 900、标签 800、导航 700、正文常规。中文标题收字距，英文标签拉开字距。

### Hierarchy
- **Display** (900, `clamp(48px, 5.5vw, 76px)`，超宽屏可达 79px，行高 1.3): 仅英雄区 `h1`。「日常。」下面垫一层歪斜的糖果粉荧光笔。
- **Headline** (900, 36px；联系区 39px；关于区 32px): 章节 `h2`。
- **Title** (约 700–900, 26px 卡片标题 / 21px 预约面板标题): 卡片与面板名。
- **Wordmark** (950, 43px, 字距 -3px): `domi` 词标，心形用 `heart` 且更小（17px）。下方 `HOMESTUDIO` 为 10px、字距 3px、字重 800。
- **Body** (16px, 行高 1.8–2.0): 说明文字。移动端可到 14px。
- **Label** (12px, 字重 800, 字距 0.12–0.16em): eyebrow、色带、卡片编号、角标。英文倾向全大写。

**The Bilingual Label Rule.** 章节 eyebrow 与卡片英文名保持大写英文；情感标题保持中文。不要把 `h1`/`h2` 改成英文，也不要把 eyebrow 改成中文句。

## Layout

单栏内容壳：桌面宽度 `min(1180px, 100% - 80px)` 居中；≤900px 改为 `100% - 44px`。页头与内容壳同宽。滚动时预留约 100px，避开固定视觉顶栏高度。

桌面节奏：
- 英雄区两列（约 1.05fr / 1fr），内边距约 55–65px
- 项目三列，间隙 23px
- 预约区两列（1fr / 1.05fr），列间隙 95px
- 章节上下内边距约 83–90px

断点：1500px 放大英雄标题；900px 收紧间隙；640px 英雄、项目、预约全部改单列，页头高度 100px→85px，导航 CTA 去掉 ↗。`prefers-reduced-motion` 时关闭平滑滚动与全部 transition。

**The Paper Width Rule.** 内容永远居中收在纸面宽度里，不要做全出血色块英雄（预览顶栏与关于格纸除外，它们是全宽纸纹，不是营销渐变）。

## Elevation & Depth

深度来自「贴纸」：1.5–2px 实线描边 + 实色偏移阴影，**没有模糊阴影**。插画 `mix-blend-mode: multiply`，像印在纸上。标签可旋转 7°（英雄角标）或 -4°（老板拍立得，样式已写在 CSS）。

### Shadow Vocabulary
- **Pink sticker** (`3px 3px 0` 糖果粉): 导航描边按钮、英雄角标。
- **Ink stamp** (`4px 4px 0` / hover `5px 6px 0` 工坊线): 主按钮。
- **Card stamp** (`4px 5px 0` `#173e4c`): 项目卡片。
- **Panel stamp** (`7px 7px 0` `#cbeef4`): 预约面板。
- **Dialog stamp** (`8px 8px 0` `#a7d5df`): 预约摘要对话框。
- **Polaroid stamp** (`7px 7px 0` `#edb3c5`): 关于区拍立得（样式已定义）。

悬停：主按钮向左上挪 1–2px 并加深阴影；卡片上移 4px。不要加 blur。

**The No-Blur Rule.** 阴影必须是 `Npx Npx 0 <solid color>`。禁止 `rgba` 模糊投影和大面积 drop-shadow。

## Shapes

小圆角纸片，不是胶囊，也不是直角海报。
- 输入与导航描边按钮：约 5px
- 主按钮：6px
- 卡片 / 预约面板：12–13px
- 对话框：14px
- 卡片序号与卡片 ↗ 按钮：正圆
- favicon：粉色圆角方（约 14px）上叠青色 `d`

描边是身份：结构线 1.5–2px `line`，输入闲置态 1px `#c9d5d8`。标题荧光笔衬底旋转 -2°；角标旋转 +7°。保持少量倾斜，不要让每个模块都歪。

**The Soft-Rect Rule.** 容器保持「带一点点圆的矩形」。禁止 999px 胶囊主按钮，禁止完全直角卡片。

## Components

### Buttons
贴纸主按钮：薄荷绿底、2px 工坊线、6px 圆角、字重 800、内边距 14×23、字与 ↗ 间距约 30px。悬停抬起并加厚阴影；焦点环 `#0585aa`、offset 5px。幽灵文字链用于次要行动（「先逛逛小店」「返回修改」），无边框无阴影。

### Cards / Containers
三张项目卡共用描边、12px 圆角、4×5 工坊阴影。背景按项目分色，不要三张同色。顶部是编号圆与英文名；底部一条半透明墨线，右侧白色半透明圆按钮写 ↗。悬停整卡上移 4px。

### Inputs / Fields
纸色底、1px 青灰边、5px 圆角、14px 字。焦点：2px `#53b5cf` 环。标签 14px 粗体；「选填」用更浅的 `#869398`。双列表单行在桌面并排，窄屏保持可点尺寸（输入 16px）。

### Navigation
100px 高、底部分割线 `#dfdadc`。左词标，右 14px/700 链接，间距 36px。预约项是描边小按钮 + 粉色贴纸阴影。窄屏缩小间距并隐藏 ↗。

### Signature: Pixel heart & ribbon
eyebrow 前的 ♥ 用 `heart` 色。色带全宽浅青底、工坊线上下描边、13px/800、字距 0.14em，分隔符 ✦ 用 `#ba5d7e`。

### Signature: Booking panel & dialog
白底面板 + 浅青贴纸阴影。右上「预览体验」小粉标。对话框纸色底、青阴影、背板 `#143e4b88` 模糊 4px（这是唯一允许的模糊：模态遮罩，不是卡片投影）。摘要 `pre` 用 `#e4f6f8` 浅青块。

### Signature: Polaroid (stylesheet, currently unused in HTML)
老板形象框：白底、工坊线、内边距像拍立得、旋转 -4°、粉色阴影。关于区粉格纸底。新做「关于」时沿用，不要改成通栏摄影。

### Signature: Weekly availability board
白底周历面板，浅青贴纸阴影，与预约面板同族。七天是等高选择卡，不是手风琴：今天粉底，周末青底，选中用硬边工坊阴影。时段不在卡片里展开，而在下方一块固定高度的纸面里替换内容，避免撑高卡片或顶动页面。未选中时显示提示；选中后在同一高度内铺可约 / 已约 / 已过状态条。薄荷绿仍只给主行动。占用数据来自 `bookings.json`，须标明演示而非实时库存。

## Do's and Don'ts

### Do:
- **Do** 用藏青墨色写字、用糖果粉标记喜欢、用薄荷绿做唯一主按钮。
- **Do** 用硬边实色阴影表现贴纸深度，悬停时平移而不是发光。
- **Do** 保持中英分工：中文标题、英文大写标签。
- **Do** 让品牌插画 `multiply` 贴在腮红纸上，保留像素爱心、✦、↗。
- **Do** 项目卡三色分岗：粉 / 青 / 嫩绿。

### Don't:
- **Don't** 使用模糊卡片阴影、玻璃拟态或全宽渐变英雄。
- **Don't** 把主按钮改成实心藏青或纯白描边胶囊。
- **Don't** 引入第二套展示字体或纯黑/纯灰中性色替换工坊青。
- **Don't** 把三张项目卡刷成同一背景色。
- **Don't** 去掉预览顶栏的「尚未发送」语气，或把演示表单扮成真实下单。
