# [TDF Type Tester](http://tendollarfonts.com/)

TDF Type Tester is a flexible display for the numerouse features available in a typeface. Made specifically for TDF.

## Table of contents

- [Quick Start](#quick-start)
- [Example](#example)
- [Options](#options)
- [Dependencies](#dependencies)
- [Ramp Up](#ramp-up)

## Quick Start
```
<!-- Dependencies -->
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
<script src="https://zachleat.github.io/BigText/dist/bigtext.js"></script>

<!-- Call The Type Tester -->
<section class="typeTester" font="atc_timberline" text="Try ATC Timberline" align="center" weight="400" weightoptions="true" weightselection="Light:100, wonka do:400, Black:800" tracking="0" trackingoptions="siq" italic="yup" italicoptions="ok" singlelineoptions="true" size="90" sizeoptions="cool" opt="dlig" optoptions="dlig, hlig" singleline="true" alignoptions="true"></section>

<!-- Call Type Tester Function -->
<script src="build/js/typeTester.js"></script>


<!-- Call Type Tester Style -->
<link href="build/css/style.css" rel="stylesheet" type="text/css"  media="all"  />
```

## Example

Simple Example
```
<section class="typeTester" ></section>
```

One Feature Example
```
<section class="typeTester" size="20" ></section>
```

Multiple Feature Example
```
<section class="typeTester" font="atc_timberline" singleline="true" text="Try ATC Timberline" align="center" alignoptions="true" weight="400" weightoptions="true" weightselection="Light:100, wonka do:400, Black:800" tracking="0" trackingoptions="siq" italic="yup" italicoptions="ok" singlelineoptions="true" size="90" sizeoptions="cool" opt="dlig" optoptions="dlig, hlig" ></section>
```

## Options

All options are chosen by defining an attribute and feeding it a string.

W A R N I N G
The attribute names are case specific.

#### font
Sets the font-family that the tester looks for.
Default is "'Fakta Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif".
```
font="atc_timberline"
```

#### text
Sets the placeholder text of the tester
Default is "Try Typing Here..." but if you define the font it is "'Try' + font " .
```
text="Happy New Years!"
```

#### size
Sets initial size for tester. Size is set in pixels via font-size.
Default is 40.
```
size="22"
```

#### sizeoptions
Allows slider bar for size.
Default is false.
```
sizeoptions="true"
```

#### tracking
Sets initial tracking for tester. Tracking is set in em via letter-spacing.
You may choose between -0.25 –> 1. Default is 0.
```
tracking="0.8"
```

#### trackingoptions
Allows slider bar for tracking.
Default is false.
```
trackingoptions="true"
```

#### weight
Sets initial weight for tester. Weight is set on a 100 –> 900 scale via font-weight.
Default is 400.
```
weight="800"
```

#### weightoptions
Allows slider bar for weight.
Default is false.
```
weightoptions="true"
```

#### weightselections
Sets slider bar's options for weight.
Default is 100 -> 900.
```
weightselections="Light:100, Book:400, Black:800"
```

#### align
Sets initial alignment for tester. Align is set via text-align. Requires a set size.
You may chose left, center, or right. Default is left.
```
align="right"
```

#### alignoptions
Sets slider bar's options for alignment.
Default is false.
```
alignoptions="true"
```

#### italic
Sets italic for tester. Italic is set via font-style.
Default is false.
```
italic="true"
```

#### italicoptions
Allows switch for italic.
Default is false.
```
italicoptions="true"
```

#### singleline
Sets initial wordwrap for tester. Singleline is set via white-space. Requires a set size.
Default is false.
```
singleline="true"
```

#### singlelineoptions
Allows switch for singleline / wordwrap.
Default is false.
```
singlelineoptions="true"
```

#### opt
Sets initial Open Type Feature for tester. OPT is set via font-feature-settings.
Default is none.
```
opt="dlig"
```

#### optoptions
Allows dropdown for Open Type Features.
Default is false.
```
optoptions="dlig, hlig"
```

#### True or False
You can also set any of the above options with a variety of true or false terms.

True could be "yes", "true", "hawt", "yup", "yep", "siq", "swell", "chiller", "ok", "!", "fine", "right", "good", "aye", "indubitably", "sure", "yeah", "yay", etc...

False could be "sus", "no", "nah", "nvm", "false", "rathernot", "nope", "naaah", "naah", "bye", "fart", "sans", "terminal".


## Dependencies

A short list of depencencies for the project.

#### Jquery
http://jquery.com/download/
```
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
```

#### Jquery UI
http://jquery.com/download/
```
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
```

#### Big Text
https://github.com/zachleat/BigText
```
<script src="https://zachleat.github.io/BigText/dist/bigtext.js"></script>
```

You can add them all by just copying this
```
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
<script src="https://zachleat.github.io/BigText/dist/bigtext.js"></script>
```

## Ramp Up

install node if you haven't already
http://nodejs.org/

install grunt (via terminal)
http://gruntjs.com/getting-started
```
npm install -g grunt-cli
```

Setting up grunt
```
# set current directory
cd projectDirectory

# install packages
npm install
```

Using grunt
```
# Run Grunt and grunt watch
grunt && grunt watch
```

### You're all set!
