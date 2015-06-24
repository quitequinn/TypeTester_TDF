# [TDF Type Tester](http://tendollarfonts.com/)

TDF Type Tester is a flexible display for the numerouse features available in a typeface. Made specifically for TDF.

## Table of contents

- [Example](#example)
- [Options](#options)
- [Ramp Up](#ramp-up)

## Example

Simple Example
```
<section class='typeTester'></section>
```

One Feature Example
```
<section class='typeTester' size="20"></section>
```

Multiple Feature Example
```
<section class="typeTester" font="atc_timberline" singleline="true" text="ATC Timberline" align="center" alignoptions="true" weight="400" weightoptions="true" tracking="0" trackingoptions="siq" italic="yup" italicoptions="ok" singlelineoptions="true" size="90" sizeoptions="cool" opt="dlig" optoptions="dlig, hlig" ></section>
```


## Options

font =
options =
tracking =
weight =
italic =
opt =
align =
singleline =
testerfit =
testerSize =
testerFont =
testerTracking =
testerWeight =
testerItalic =
testerOpt =
testerAlign =
testerSingleline =
sizeoptions =
trackingoptions =
weightoptions =
italicoptions =
singlelineoptions =
alignoptions =
optoptions =
optButton =
testeroptions =
weightselection =
weightPosition = "";

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
