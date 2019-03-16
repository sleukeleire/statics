# Sevenedge Scss structure

# Table of contents

- [1. SMACSS](#markdown-header-1-smacss)
- [2. BEM](#markdown-header-2-bem)
- [3. Pre-defined components](#markdown-header-3-pre-defined-components)
    - [3.1 Variables](#markdown-header-31-variables)
        - [Constant and element variables](#markdown-header-constant-and-element-variables)
        - [_breakpoints.scss](#markdown-header-_breakpointsscss)
        - [_colors.scss](#markdown-header-_colorsscss)
        - [_dimensions.scss](#markdown-header-_dimensionsscss)
        - [_paths.scss](#markdown-header-_pathsscss)
        - [_timings.scss](#markdown-header-_timingsscss)
        - [_typography.scss](#markdown-header-_typographyscss)
        - [_misc.scss](#markdown-header-_miscscss)
    - [3.2 Functions](#markdown-header-32-functions)
        - [get_breakpoint](#markdown-header-get_breakpoint)
        - [em](#markdown-header-em)
    - [3.3 Mixins](#markdown-header-33-mixins)
        - [Clearfix](#markdown-header-clearfix)
        - [Cursors](#markdown-header-cursors)
        - [Images](#markdown-header-images)
        - [Media Queries](#markdown-header-media-queries)
        - [Positioning](#markdown-header-positioning)
        - [Typography](#markdown-header-typography)
    - [3.4 Classes](#markdown-header-34-classes)
        - [Grid](#markdown-header-grid)
        - [Utilities](#markdown-header-utilities)


> **NOTE:** base.scss and cake.scss is the default cakePHP's templates, please do not remove them!

## 1. SMACSS
We use SMACSS as an architecture for our code. It's is a logical and evident way of structuring the scss code you write for each project.

You can find out more about the principles of SMACSS at [smacss.com](https://smacss.com/book)

## 2. BEM 
BEM (Block Element Modifier) is a methodology that helps you to achieve reusable components and code sharing in the front-end. 

Read all about it at [getbem.com](http://getbem.com/)

An example: 

```html
<!-- Notice the wrapper is placed outside of the block. That's fine. -->
<div class="menu__wrapper">
	<nav class="menu">
		<ul class="menu__list">
			<li class="menu__list-item"><a href="" class="menu__link"></a></li>
			<li class="menu__list-item"><a href="" class="menu__link menu__link--active"></a></li>
			<li class="menu__list-item">
				<a href="" class="menu__link">
					<ul class="menu menu--sub-menu menu__list">
						...
					</ul>
				</a>
			</li>
		</ul>
	</nav>
</div>
```

Please use strict BEM and try not to go any deeper then 4 element levels.

## 3. Pre-defined components
### 3.1 Variables

A lot of variables that we use for almost each project are defined in the boilerplate. Distances and spacing will always be defined **in pixels** in the variables files. 


#### Constant and element variables 

There's an important difference between variables and constants. It is explained below with color variables as an example.

Why? It's very modular, which means that you could re-use modules in future projects. 

##### Constant variables
These are pre-defined colors that have a constant value. White, for example, will always have `#FFFFFF` as a value. You may want to put some more project-specific colors here, like the red that is used in the header and footer.

Try not to use these directly inside the modules. Use 'Element colors' for that.

##### Element variables
These are colors that define the color of a specific element. This could apply to the base/layout styling, but could as easily apply to specific components (modules). 

An example:
```scss
// utils/variables/_colors.scss
$color_red: #f00;
$color_header: $color_red;
$color_footer: $color_red;

// layout/_header.scss
.header {
	color: $color_header;
}

// layout/_footer.scss
.footer {
	color: $color_footer;
}
```
___

You can find a brief description of each existing variable file below.

#### _breakpoints.scss

Contains the breakpoints we will be using for responsiveness. Be aware that you should always maintain the following structure:

```scss
$breakpoints: (
    {device_name}: (
	    {breakpoint_name}: {breakpoint_value},
	    {breakpoint_name}: {breakpoint_value}
    )
    {device_name}: (...)
);
```

Also, don't add a unit to the value. The values are converted to 'em' values. So if your breakpoint is `1440px`, enter `1440` in the file.


#### _colors.scss
You can place all the colors that are used inside a project here. And that's really **all of them**. Avoid using hex codes in the base/layout/module files.

#### _dimensions.scss

Place all re-usable dimensions in this file. By default, these are used for the styling of the page, but you can add all sorts of dimensions here.

For example: 

```scss
$px_sidebar_image_width: 200;
$px_sidebar_image_height: 200;
```

#### _paths.scss

This file contains all file paths that are commonly used in the project.

Usage: 

```scss
.selector {
	background-image: url("#{$path_images}/background.png");
}
```

#### _timings.scss

This file contains all timings for transitions and/or animations. Try to add all timings to this file instead of using `timing_hover/2`.

#### _typography.scss

This file contains all variables that are related to the typography of the project such as font-sizes, font-styles, line-heights, underlines, ... 

#### _misc.scss

Place any variables here that don't fit inside any of the other files. But be carefull it doesn't become the dumpster.

### 3.2 Functions

#### get_breakpoint

Get a certain breakpoint out of the `$breakpoints` array by device and size. 

Usage:

```scss
@media (min-width: get_breakpoint(laptop, small)) {
	// styling
}
```

In fact, this should not be used inside the module files. It is used by the `mq`-mixin, which is better practice to write media queries with.

#### em

Convert pixel values to em values. The `$font_size_base` value is used to calculate the em value.

Usage/example: 

```scss
// utils/variables/_typography.scss
$font_size_base: 15;

// base/_typography.scss
body {
	font-size: $font_size_base + 0px; // will result in 15px
}

// module/some_module.scss
.selector {
	padding: em(30); // will result in 2em, which is 30px
}
```

### 3.3 Mixins

#### Clearfix 

The clearfix allows a container to wrap it's floated children. Without a clearfix or equivalent styling, a container does not wrap around its floated children and collapses, just as if its floated chldren were positioned absolutely.

> **Note:** There's also a utility class .cf that only includes nothing but this mixin. If you want to rapidly clearfix an element, you could use this class. However, try to avoid it since utility classes are not meant to be used as element styling. 

Usage:

```scss
.selector {
	@include clearfix;
}
```

#### Cursors
There are 2 cursors available as a mixin, being the 'grab' and 'grabbing' cursors. The other cursors are included by default in CSS3.

Usage:

```scss
.cursor--grab {
	@include cursor_grab;
}
.cursor--grabbing {
	@include cursor_grabbing;
}
```


#### Images 

##### background_retina

Adds a suffix to the filename on retina screens.

Usage: 

```scss
.selector {
	// For image_name.png and image_name@2x.png having a background-size of 100%:
	@include background_retina('image_name', 'png', 100%);
}
```

##### background_svg

Adds and svg background with fallback to a specified extension.

Usage:
```scss
.selector {
	// For image_name.svg with fallback to image_name.png having a background-size of 100%:
	@include background_svg('image_name', 'png', 100%);
}
```

#### Media Queries 
Write a media query with one of the values out of the `$breakpoints` array.

Usage: 

```scss
// utils/variables/_breakpoints.scss
$breakpoints: (
	tablet: (
		medium: 	768, 
	),

	mobile: (
		largest: 	604,
		...
	)
);

// module/some_module.scss
// For @media (min-width: 604px) 
@include mq(mobile, largest) {
	// styles
}

// For @media (min-width: 604px) and (max-width: 767px)
@include mq(mobile, largest, tablet, medium) {
	// styles
} 
```
(notice that this example is not very accurate, since the pixel values are converted to em values. I just wanted to illustrate the goal of this function)

#### Positioning

##### Absolute, relative and fixes positioning
Short notation to position an element.

Usage:

```scss
.parent {
	@include relative;
}

.child {
	@include absolute(left em(40) top 0);
}
```

##### center_vertically
Center an element vertically

```scss
.selector {
	@include center_vertically;
}
```

#### Typography

##### font_size

Include font-size styling in em with a px fallback.

Usage: 

```scss
.selector {
	@include font-size(30);
}

// results in:
//  .selector {
//	  font-size: 30px;
//    font-size: 2em;
//  }
```

##### opacity 

Cross-browser mixin for granting opacity to an element

```scss
.selector {
	@include opacity(.8)
}
```

##### Font_face
Quickly add a new font. 

Usage: 

```scss
@include font-face("font_name", normal, normal);
```


### 3.4 Classes

#### Grid
Because a grid is almost indispensable in every project, we went ahead and provided it in the boilerplate. By default, there are 12 columns in this grid. You can override it by creating a variable `$grid_columns` in `utils/variables/misc.scss` and setting the number you want.

An example:

```html
<!-- Grid with large gutter -->
<div class="grid grid--gutter-lg">
	<div class="block grid__item col-12 tablet-sm-col-6 laptop-md-col-4">
		<!-- full-width on mobile, half-width on tablet, 1/3 width on laptop -->
	</div>
	
	<div class="block grid__item col-12 tablet-sm-col-6 laptop-md-col-4">
		<!-- full-width on mobile, half-width on tablet, 1/3 width on laptop -->
	</div>
	
	<div class="block grid__item col-12 laptop-md-col-4">
		<!-- full-width on mobile, 1/3 width on laptop -->
	</div>
</div>
```

(Want to know more about grid systems? ([Read more here.](https://www.sitepoint.com/understanding-css-grid-systems/))

#### Utilities

We provided some utility classes that can be used in the project. They are prefixed with `u-`, because they are no part of the BEM-structure. Utility classes do not provide styling for entire components, but should serve only 1 single purpose. 

So when should you use utility classes? That's a debatable topic. In fact, you should try to avoid utility classes as much as you can. But there are a few use cases in which their usage is justified:

- Whenever an element needs only 1 rule of styling, there's no difference in creating a semantic class vs. utility class. For the sake of [DRY css](http://vanseodesign.com/css/dry-principles/), you should probably use utility classes here. 
- When doing a quick fix (should be avoided as much as possible)
- ... 

Summarized: Just try to use common sense and avoid inline styling with classes.

Interesting read on this: [here](http://davidtheclark.com/on-utility-classes/) and [here](https://medium.com/@mariusc23/a-case-for-css-helper-classes-b9248c7a2712#.6i86fml4u).
