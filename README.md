# LegoLog - A lego catalouge for you
Submitted for the Application Programming coursework of 2021/22

## TODO

https://octagonal-packet-aed.notion.site/101f33a7f6c84982bfdb57ef92e172cc?v=0156eaf7774046fcbf8fb9bdf254d940

# Resources / Notes

### Web design (i hate web design)

- https://www.smashingmagazine.com/2009/06/fixed-vs-fluid-vs-elastic-l
ayout-whats-the-right-one-for-you/
- https://blog.hubspot.com/website/fluid-design
- https://jonsuh.com/hamburgers/

### Usable shop design

- https://www.semrush.com/blog/11-great-examples-ecommerce-navigation-
improve-sales/

### Databases

- https://rebrickable.com/downloads/
- https://www.bricklink.com/catalogDownload.asp?a=a
- https://www.eurobricks.com/forum/index.php?/forums/topic/140643-open-
and-freely-available-data-set-of-all-partspieces/
- https://www.sqlitetutorial.net/sqlite-nodejs/
- https://dbschema.com/features.html

# Documentation & Implementation Rationale

Make sure to see docs/ for more detailed module documentation

IMPORTANT MAKE SURE TO READ CONFIGURATION.md BEFORE RUNNING

## 1.1 Content Delivery and Storage of Thousands of Images

Due to the fact that there is ~85000 images of individual lego bricks
and even more of sets. I have chosen not to store them in a database as
a BLOB or anything else like that as it is inefficient. I am also aware
of the pitfalls of a conventional filesystem for storage of mass data.

The way I have approached a solution for this is in preprocessing, by
hashing the name of the image file (which is also the brick / set in
question), I can then use the filesystem's natural directory cache
speedyness to speed up access times significantly.

Take the file name `2336p68.png`, which is a Lego "Cockpit Space Nose",
after a simple MD5 hash, the result is:

```text
"d2ef319ea58566b55070e06096165cb8"
 ^^^^
```

Using the first four characters in the hash, we can allocate images
into buckets for storage and quick retreval. This acts very similar
to a hash table implemented in the filesystem.

Also due to the non-ability to use subdomains during this project, all
content served like this will use the API suffix, `cdn/`

**This implementation description does not take into account resource
cacheing.**

## 1.2 Database Storage of the Pieces of a Set

Because I am using a bloody RELATIONAL database, I cannot simply store
all of the pieces in a set, in that set without serialising it. So 
that's what I did, sets have a JSON field of IDs and amounts for the
easy retrieval of the pieces used in a lego set, unfortunately this
reduces the easyness of using fancy SQL joins to get the piece from
that.

My other option for this was to have a seperate table which includes
relationships, for example, there could be a set|piece|number column
however, there would be not much room for a primary key in that case,
unless some hashing of sets/pieces went on. We will see how I approach
this.

## 1.3 Database 

See docs/DATABASE.md for more technical documentation.

# Acknowledgements

Jacek Kopecký for the PortSoc Eslint
(I'm sorry I overwrote your 2 spaces rule, I prefer 4)

The MIT Permissive Software License can be found in LICENSE

Copyright 2021/22 Benjamin Kyd
