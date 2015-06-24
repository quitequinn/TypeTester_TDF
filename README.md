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

#### font
This is the font-family the tester looks for.
```
font="atc_timberline"
```

#### options
#### tracking
#### weight
#### italic
#### opt
#### align
#### singleline
#### testerfit
#### testerSize
#### testerFont
#### testerTracking
#### testerWeight
#### testerItalic
#### testerOpt
#### testerAlign
#### testerSingleline
#### sizeoptions
#### trackingoptions
#### weightoptions
#### italicoptions
#### singlelineoptions
#### alignoptions
#### optoptions
#### optButton
#### testeroptions
#### weightselection
#### weightPosition

## Dependencies

A short list of depencencies for the project.

### Jquery
http://jquery.com/download/
```
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
```

### Jquery UI
http://jquery.com/download/
```
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
```

### Big Text
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
#set current directory
cd projectDirectory

#install packages
npm install
```

Using grunt
```
#Run Grunt and grunt watch
grunt && grunt watch
```

You're set!
