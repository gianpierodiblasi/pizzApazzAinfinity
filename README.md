# pizzApazzA<sup>&#8734;</sup>
The project of my life.

## Description
![pizzApazza.png](https://github.com/gianpierodiblasi/pizzApazzAinfinity/blob/master/readme/pizzApazzA.png?raw=true)

pizzApazzA is the project of my life. pizzApazzA was born:
- from the request of a baby to have a crazy graphics software
- from the absence of this kind of graphics software
- from the synergy of some crazy people

pizzApazzA is a professional 2D graphics tool, oriented to the decoration and the pictorial graphics based on parametric and random behaviours
giving to all tools and functionalities of the software the unpredictability and irregularity typical of the natural behaviours.

More attention was dedicated to the usability and to the ergonomics of all functionalities:
- advanced color and chromatic palette management
- tools manager (traces, outlines, envelope, attenuation, etc.)
- clip and collage manager
- drawing canvas manager (grids, symmetries, magnetisms, rulers, etc.)
- manager of deformations, rotations, etc.
- global post-elaborations operations (batch and interactive) manager
- plug-in manager
- saving system manager (anonymous saving, undobuffer, history)
- info saving tool (chromatisms, tools, clips, notes)
- macro recorder
- presentation manager (TommyGun)

Several implementations of pizzApazzA exist:
- a VisualBasic6 edition (developed by  my friend Ettore Luzio)
- a Java Swing edition
- an Android edition
- a .NET edition (again developed by  Ettore Luzio)

This is the fifth edition of pizzApazzA and the first "completely web based" (why the double quotes? I will explain later)

## Why JavaScript?
I'm a Java developer, I love Java, I love NetBeans, I love everything in Java, but sadly Java for desktop (and browser) is a mess.
So, I decided to rewrite pizzApazzA in JavaScript (to be more precise in ES6) and renamed it **pizzApazzA<sup>&#8734;</sup>**.

But... OMG! I can't live without strong typization! So what can I do? I can develop in Java and transpile in JavaScript. Well I need a
transpiler and there are several Java to JavaScript transpiler; but I'm a Java developer! So why don't write a transpiler by myself? Yes,
but this is [another history](https://github.com/gianpierodiblasi/josetta). On the other hand it is very difficult for an old style Java
Swing developer to project UI for the web. So, I could rewrite Java Swing in JavaScript, but this is again [another history](https://github.com/gianpierodiblasi/swing.js).

Ok, so I was talking about JavaScript and the web. I want everyone from everywhere can use pizzApazzA<sup>&#8734;</sup>, with a pc, a mac, a chromebook,
a tablet and everything able to run a browser.

I'm not a professional JavaScript developer; I consider myself a simply good JavaScript developer and I know that several things can be
done better (starting from the build system... why to use ANT for a JavaScript build? Am I crazy?); so, if you have any suggestion to
improve my code I will be happy to do it, but... please don't focus your attention on technical details, focus your attention to the result:
pizzApazzA<sup>&#8734;</sup> is an idea, not the code to realize it.

## Translations
Currently only the English and Italian languages are managed.

## Test
pizzApazzA<sup>&#8734;</sup> has been tested on:
- Windows 11
  - chrome 124
  - edge 124
  - firefox 125
- Chrome OS 125
- Debian 12
  - chrome 124
  - edge 124
  - firefox 125

## Dependencies
- josetta - [link](https://github.com/gianpierodiblasi/josetta)
- jsweet-core - [link](https://repository.jsweet.org/artifactory/libs-release-local/org/jsweet/jsweet-core)
- swing.js - [link](https://github.com/gianpierodiblasi/swing.js)
- Bezier.js - [link](https://pomax.github.io/bezierjs)
- JSZip - [link](https://stuk.github.io/jszip)
- FileSaver.js - [link](https://github.com/eligrey/FileSaver.js)

## Build
pizzApazzA<sup>&#8734;</sup> is developed in NetBeans as an ANT project. In order to perform a build you can use [ANT](https://ant.apache.org/),
[NetBeans](https://netbeans.apache.org/) or any IDE compatible with ANT.

## Run
In order to run pizzApazzA<sup>&#8734;</sup> you only need to click this [link](https://gianpierodiblasi.github.io/pizzApazzAinfinity/).

## Donate
If you would like to support the development of this and/or other projects, consider making a
[donation](https://www.paypal.com/donate/?business=HCDX9BAEYDF4C&no_recurring=0&currency_code=EUR).