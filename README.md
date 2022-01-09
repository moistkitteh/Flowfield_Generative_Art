# Flowfield Generative Art
Flow field art, also known as vector field art, is algorithmically generated art popularized by Tyler Hobbs' Fidenza collection. He's done his own writeup of the method, link [here](https://tylerxhobbs.com/essays/2020/flow-fields), which is fanastic and definitely worth reading. I'm writing this to supplement that post with the added benefit of providing my code freely in a repository for anyone to use. 

This readme is structured in 4 parts. Part 1 is how to run a javascript code if you're unfamiliar with the code. Part 2 covers conceptually how flow field algorithms work and why they result in natural looking fluid fields. Part 3 covers creating vector field based art, and Part 4 covers creating code that works with [fx(hash)](fxhash.xyz), a popular NFT site on Tezos that functions by you uploading your own code and wrapping it in a token system provided by them so that users can mint from it directly and get a generative art piece that's 100% undetermined until after the mint.

## Part 1 - Running this code
This code was written in HTML and JavaScript.

To run the code, first download the index.html, p5.js, and sketch.js files into a single directory. Make sure you have internet access.

Then, open the index.html file in a browser by double clicking it or right clicking and selecting "open with" and then choose a browser. The code will run automatically, and display an image as the only thing on the webpage.

## Part 2 - Conceptual Understanding of Flow Field Art

Flow field art is pretty straightforward to make and understand, but is often obscured behind a lot of terminology that makes it seem more complex than it really is. My non-NFT related job is in fluid dynamics, so I'm going to start at a very basic level and build up from there and make sure we're all on the same page conceptually. If you already have an understanding of the topic then feel free to skip ahead to later parts, but if you read "vector field" and it goes in one eye and out the other than I recommend continuing on with this section.

Flow field art is based on vector fields. Bringing back some high school mathematics, a vector is a line that has a length (more commonly called magnitude) and a direction. Below is a 2D vector. For simplicity's sake we'll stick to 2D for all of our discussion. Also, to keep life easy, we'll stick to a cartesian coordinate system, meaning the horizontal axis is the X axis and vertical axis is the Y axis.

  add picture

One way to describe a 2D vector is with the length in the x direction and length in the y direction between parenthesis and separated by a commas, like so (xlength,ylength). If you had a vector with an X length of 4 and a y length of 3 you could write it as (3,4). The magnitude of this vector is sqrt(3^2 + 4^2) = 5, and the angle of this vector is atan(3/4) = ~53 degrees (unfortunately not as clean of a number as the others). 

  add picture

Often, we use unit vectors: vectors whose length is exactly 1. There are lots of advantages to this, I won't get into them all, but one important for us are that its x and y lengths are both less than 1. Another is that now the xlength = cos(angle) and  the ylength = sin(angle), meaning that a unit vector can easily be used to describe a direction that something is pointing.

  add picture
  
So now that we have a vector defined, a vector field is a just a bunch of vectors on a graph. 

  add picture
  
So how does that relate to flow fields?

Let's first consider water in a stream that is moving to the right at a speed of 5 meters/second. If you put a ping pong ball on top of the river, then it will move with the water exactly 5 meters in 1 second. 

  add picture
  
Now lets consider if the river was flowing 4 meters/second to the right, and 3 meters/second up. Now if you put a ping pong ball in the river, it would move 4 meters to the right and 3 meters up, for a total length moved of 5 meters. Starting to catch on? We can describe the fluid speed (more commonly called velocity) using vectors, where the x direction velocity is called u and the y direction speed velocity is called v, shown again below.

  add picture

Let's now describe the river with a vector field rather than a single vector. Below is a 8 by 8 vector field, each of these vectors is spaced by 1 meter in the x and y directions. Again, each If you dropped a ping poll ball on the first vector at location (0,0) and one at (2,2), then both ping pong balls would move 4 meters to the right and 3 meters up, but have different final locations. 

  add picture
  
Interestingly, these ping pong balls would never hit each other. This is because they're moving along what are called streamlines, which are an important concept we are going to take advantage of. As long as the fluid is not turbulent, then no matter how infinitismally close the particles are placed, they'll never hit each other. 

If we choose some random points within the vector field, drop ping pong balls, and chart the path they take, then we get something that start to look more like a flow field art that you're used to seeing. 

  add picture
 
But this is a pretty boring flow field, lets make it more interesting. The first flow field we drew had the same fluid velocity and direction at every point. Let's make it so that the vector field points in directions that are a little different at every point. Now the ping pong balls follow a more interesting path through the fluid.

  add picture
  
However, one problem we now have is that they don't necessarily intersect with points on our graph as they so nicely did before. In order to figure out a path, we do it in small steps. We take the vector from the closest point to where we are at, take a small step in the direction that it points, and continue taking small steps until we get close to a different point. Once we get close to a different point, we start taking steps in the direction that it points, and so on. 

  add picture
  
And that's pretty much all it is. We start from a vector field that smoothly describes a flow field, drop in particles, and chart their path through the flow field. 

Now the question is, how do you make a vector field that is random and interesting? Part 3 will describe from a code perspective how we generate a a randomized vector field and draw through it. The other parts that make this look really cool are the color palettes used, the width of the path that's drawn, and the length of each path.

## Part 3 - Creating Vector Field Based art

To begin this section, one clarification that should be made is that flow field art vector fields are rarely (if ever) based on actual fluid dynamics. The flow fields that are used for flow field art look nice and natural because they inherently follow streamlines, but 99% of this style of art is based on random noise (typically perlin noise, but more on that later). This is because computational fluid dynamics solutions 1) can be tricky and 2) are somewhat deterministic. It's easier to use random noise, and more importantly you get significantly more potential flow field combinations, meaning you can create more art. 

In this section, we'll be utilizing javascript and html in order to make this code compatible with fx(hash). I'm not an expert at javascript, so it's likely there are much more efficient ways to write this code. 

### Part 3.b - Creating a vector field

### Part 3.c - Randomizing a vector field with noise

### Part 3.c - Drawing over a vector field

## Part 4 - Creating Art for fx(hash)
