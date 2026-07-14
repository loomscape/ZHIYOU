# DESIGN.md

# Loomscape Design System

Version 2.0

Project Name: Loomscape

Tagline:Turn Images Into Fabric


---
# PROJECT VISION

Loomscape is not a knitting utility.

Loomscape is a digital weaving studio.

Users should feel like they are transforming images into fabric.

The software should feel playful, bright, tactile and creative.

Never feel like:

* CAD software

* Enterprise software

* Engineering software

* AI dashboard

* Admin panel

Instead feel like:

* Procreate

* Figma

* Milanote

* Nintendo creative tools

* Textile workshop

* Yarn sample library


---
# DESIGN PHILOSOPHY

Core Narrative

Image

↓

Thread

↓

Pattern

↓

Fabric

↓

Object

Everything inside the interface should reinforce this transformation.


---
# RESPONSIVE FIRST REQUIREMENT

CRITICAL

Loomscape must be built as:

Responsive Progressive Web App (PWA)

Not:

Desktop Website

then

Mobile Adaptation


---
All functionality must work on:

* Mobile Browser

* Tablet Browser

* Desktop Browser

No feature may be desktop-only.

No feature may require a mouse.

No feature may require a keyboard.


---
# DEVICE STRATEGY

Mobile First

↓

Tablet

↓

Desktop


---
Design must begin with smallest screen.

Desktop expands functionality.

Desktop does not introduce new functionality.


---
# DESIGN PERSONALITY

Keywords

Creative

Playful

Textile

Material

Bright

Friendly

Craft

Modern

Inventive

Human

Tactile


---
Avoid

Dark UI

Cyberpunk

Developer aesthetics

Corporate SaaS

Enterprise dashboard

Technical engineering software


---
# COLOR SYSTEM

Primary

Sky Thread

#62C6FF


---
Secondary

Mint Yarn

#7EE7C1


---
Accent

Coral Stitch

#FF857A


---
Accent 2

Butter Yellow

#FFD86B


---
Accent 3

Lavender Loop

#BBA7FF


---
Background

Cloud White

#FFFDF8


---
Card

Pure White

#FFFFFF


---
Border

Soft Linen

#E8E5DE


---
Text Primary

Graphite

#343434


---
Text Secondary

#6F6F6F


---
Success

#53C88B


---
Warning

#FFB84D


---
Error

#FF6B6B


---
# COLOR USAGE

The application should feel colorful.

Color should communicate creativity.

Avoid monochrome interfaces.

Avoid gray-dominated interfaces.

Use color for:

* Upload actions

* Pattern generation

* Material selection

* Success messages

* Preview modes

* Interactive controls


---
# TYPOGRAPHY

Primary Font

Inter


---
Alternative

IBM Plex Sans


---
Monospace

JetBrains Mono


---
Type Scale

H1

48px


---
H2

36px


---
H3

28px


---
H4

22px


---
Body

16px


---
Small

14px


---
Caption

12px


---
# SHAPE LANGUAGE

Everything should feel soft.

Inspired by:

Fabric

Yarn

Loops

Threads

Patchwork


---
Border Radius

Cards

20px


---
Buttons

16px


---
Inputs

14px


---
Panels

24px


---
# SHADOWS

Very subtle.

Use only:

shadow-sm

shadow-md

Avoid:

Large floating shadows

Glassmorphism

Neumorphism


---
# ICON STYLE

Use:

Lucide

or

Phosphor


---
Icons should be:

Rounded

Friendly

Simple

Readable


---
# LOOMSCAPE BRAND ELEMENT

Logo Concept

Interwoven thread loops

Create a woven "L"

Represent:

Loop

Loom

Landscape

Loomscape


---
Micro Animation

Subtle thread movement.

Maximum animation duration:

800ms


---
# RESPONSIVE BREAKPOINTS

sm

640px


---
md

768px


---
lg

1024px


---
xl

1280px


---
2xl

1536px


---
# MOBILE EXPERIENCE

Primary Device

Mobile must receive the most attention.


---
Navigation

Bottom Navigation Bar

Items:

Import

Pattern

Preview

Export


---
Icons

🧶 Import

🪡 Pattern

🧵 Preview

📤 Export


---
Canvas

Full width

Highest priority


---
No sidebars.

No hidden functionality.


---
Mobile Layout


---
Top Bar


---
Canvas


---
Bottom Navigation


---
Active Tool Panel


---

---
# MOBILE GESTURES

Single Finger

Pan Canvas


---
Double Tap

Zoom In


---
Pinch

Zoom


---
Long Press

Color Picker


---
Two Finger Drag

Rotate 3D Preview


---
Two Finger Pinch

Scale 3D Preview


---
# TABLET EXPERIENCE

Layout


---
Top Bar


---
Canvas


---
Tabbed Panel

Tools

Preview

Export


---
Instructions


---

---
# DESKTOP EXPERIENCE

Layout


---
Toolbar


---
Tools

Canvas

Preview


---
Instructions


---

---
Width Allocation

Tools

20%

Canvas

50%

Preview

30%


---
# MAIN CANVAS

The canvas is the heart of Loomscape.

Everything should support the canvas.


---
Background

Subtle fabric grid

Very light

Almost invisible


---
Canvas Color

#FFFDF8


---
Capabilities

Zoom

Pan

Edit

Brush

Selection

Fill

Color Picker


---
# PATTERN REPRESENTATION

Do not display plain pixels.

Display stitch symbols.


---
Knit

V


---
Purl

∩


---
Cable

╳


---
Lace

○


---
Seed

•


---
When zoomed out the pattern should resemble a real knitting chart.


---
# MATERIAL SYSTEM

Materials must feel physical.


---
Cotton

Bright

Clean

Smooth


---
Wool

Warm

Soft

Organic


---
Acrylic

Uniform

Synthetic

Clean


---
Plastic Yarn

Glossy

Reflective

Future Material

Inspired by recycled plastics


---
# MATERIAL SELECTOR

Do not use dropdowns.

Use visual material cards.

Each card includes:

Texture

Name

Preview

Description


---
# UPLOAD EXPERIENCE

Empty State

Illustration:

Yarn Ball

Thread

Needle


---
Text

Drop an image to start weaving


---
Upload Methods

Camera

Gallery

Files

Drag and Drop


---
# IMAGE TO FABRIC TRANSFORMATION

Signature Animation

When user clicks:

Generate Pattern


---
Do not show:

Loading Spinner


---
Instead show:

Image dissolves into thread strands

Threads move into woven structure

Pattern appears

Fabric emerges


---
Duration

1.2 to 1.8 seconds


---
This is the signature Loomscape moment.


---
# KNIT PREVIEW

Modes

2D

Stitch

Fabric


---
User can switch instantly.


---
Preview must update live.


---
# BUTTONS

Primary

Sky Thread

Filled


---
Secondary

White

Bordered


---
Danger

Coral Stitch


---
Radius

16px


---
# MICROCOPY

Avoid technical language.


---
Instead of:

Generate Pattern

Use:

Weave Pattern


---
Instead of:

Processing

Use:

Spinning Threads...


---
Instead of:

Completed

Use:

Your fabric is ready


---
Instead of:

Export Complete

Use:

Pattern packed and ready to knit


---
# ACCESSIBILITY

Required

Keyboard Navigation

Focus States

ARIA Labels

Semantic HTML

Color Contrast Compliance


---
# DARK MODE

Not required in MVP.

Do not implement.


---
# PWA REQUIREMENTS

Installable

Offline Support

Local Storage

Mobile Friendly

Touch Friendly

Responsive


---
Must behave like a creative app.

Not like a website.


---
# FUTURE MODULES

Pattern Library

Material Atlas

Plastic Yarn Lab

Community Gallery

AI Stitch Generator

Pattern Marketplace


---
All future modules must follow:

Image

↓

Thread

↓

Pattern

↓

Fabric

↓

Object

Narrative.


---
# FINAL DESIGN RULE

If a design decision must be made:

Choose the option that feels more like a weaving studio

and less like software.

END OF FILE

