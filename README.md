# pizzApazzA<sup>&#8734;</sup>
The project of my life.

## Description
![pizzApazza.png](https://github.com/gianpierodiblasi/pizzApazzAinfinity/blob/master/pizzApazzA.png?raw=true)

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

Several implementation of pizzApazzA exist:
- a VisualBasic6 edition (developed by  my friend Ettore Luzio)
- a Java Swing edition
- an Android edition
- a .NET edition (again developed by  Ettore Luzio)

This is the fifth edition of pizzApazzA and the first "completely web based" (why the double quotes? I will explain later)

## Why JavaScript?
I'm a Java developer, I love Java, I love NetBeans, I love everything in Java, but sadly Java for desktop (and browser) is a mess.
So, I decided to rewrite pizzApazzA in JavaScript (to be more precise in ES6).

But... OMG!! I can't live without strong typization! So what can I do? I can develop in Java and transpile in JavaScript. Well I need a
transpiler and there are several Java to JavaScript transpiler; but I'm a Java developer! So why don't write a transpiler by myself? Yes,
but this is [another history](https://github.com/gianpierodiblasi/josetta).

I want everyone from everywhere can use pizzApazzA, with a pc, a mac, a chromebook, a tablet and everything able to run a browser.

I'm not a professional JavaScript developer; I consider myself a simply good JavaScript developer and I know that several things can be
done better (starting from the build system... why to use ANT for a JavaScript build? Am I crazy?); so, if you have any suggestion to
improve my code I will be happy to do it, but... please don't focus your attention on technical details, focus your attention to the result:
pizzApazzA is an idea, not the code to realize it.

## Dependencies
- geometry.js - [link](https://resources.jointjs.com/docs/jointjs/v3.5/geometry.html)

## Build
pizzApazzA is developed in NetBeans as an ANT project. In order to perform a build the following tools are necessary:
- NetBeans [link](https://netbeans.apache.org/) or ANT [link](https://ant.apache.org/)
- node.js [link](https://nodejs.org/)
- terser [link](https://github.com/terser/terser)
- clean-css cli [link](https://github.com/clean-css/clean-css-cli)

## Run
In order to run pizzApazzA locally you will need any basic web server, due to its simplicity I prefer the Chrome app
[Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb),
but you can use any other web server of your choice.

## Donate
If you would like to support the development of this and/or other projects, consider making a
[donation](https://www.paypal.com/donate/?business=HCDX9BAEYDF4C&no_recurring=0&currency_code=EUR).